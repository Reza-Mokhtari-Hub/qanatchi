import {
  DAILY_PUZZLE_ALGO_VERSION,
  generateDailyChallenge,
  SUPPORTED_DAILY_ALGO_VERSIONS,
} from '../src/engagement/dailyChallenge';
import { LOCAL_SCORING_ALGO_VERSION } from '../src/engagement/dailyScoring';
import {
  FRIEND_CHALLENGE_ALGO_VERSION,
  parseFriendChallengeCode,
} from '../src/engagement/friendChallenge';
import { hashStringFNV1a } from '../src/engagement/prng';
import { RANKED_SCORING_ALGO_VERSION } from '../src/engagement/rankedScoring';
import {
  MAX_VERIFY_BODY_BYTES,
  replayAndVerifyChallengeSubmission,
  type TileRotationAction,
} from '../src/engagement/solutionReplay';
import { getTehranDateKey, isValidDateKey } from '../src/engagement/tehranTime';
import { readEdgeRuntimeConfig } from './env';
import {
  StorageNotConfiguredError,
  StorageUnavailableError,
  type LeaderboardStorageAdapter,
} from './storage/types';
import { UnconfiguredStorageAdapter } from './storage/unconfiguredStorage';
import {
  API_VERSION,
  type ApiDailyChallengeResponse,
  type ApiErrorBody,
  type ApiHealthResponse,
  type ApiLeaderboardListResponse,
  type ApiLeaderboardSubmitResponse,
  type ApiVerifyChallengeResponse,
  type EdgeRuntimeConfig,
} from './types';

export interface EdgeRequestOptions {
  storage?: LeaderboardStorageAdapter;
  configOverrides?: Partial<EdgeRuntimeConfig>;
  now?: () => Date;
}

const DEFAULT_LEADERBOARD_LIMIT = 20;
const MAX_LEADERBOARD_LIMIT = 50;
const ANON_PLAYER_ID_REGEX = /^[a-zA-Z0-9_-]{12,64}$/;

const textEncoder = new TextEncoder();

function buildCorsHeaders(
  request: Request,
  config: EdgeRuntimeConfig,
): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!origin) return {};

  // Allow same-origin automatically, plus explicitly configured allowlist (never wildcard "*")
  let requestOrigin = '';
  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    requestOrigin = '';
  }

  if (origin === requestOrigin || config.allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };
  }

  return { Vary: 'Origin' };
}

function jsonResponse(
  body: unknown,
  status: number,
  request: Request,
  config: EdgeRuntimeConfig,
  extraHeaders?: Record<string, string>,
): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
    ...buildCorsHeaders(request, config),
    ...(extraHeaders ?? {}),
  };

  return new Response(JSON.stringify(body), { status, headers });
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  request: Request,
  config: EdgeRuntimeConfig,
  details?: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
): Response {
  const payload: ApiErrorBody = {
    ok: false,
    apiVersion: API_VERSION,
    error: details ? { code, message, details } : { code, message },
  };
  return jsonResponse(payload, status, request, config, extraHeaders);
}

async function readValidatedJsonBody(
  request: Request,
  config: EdgeRuntimeConfig,
): Promise<{ ok: true; data: unknown } | { ok: false; response: Response }> {
  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return {
      ok: false,
      response: errorResponse(
        415,
        'UNSUPPORTED_MEDIA_TYPE',
        'Content-Type must be application/json.',
        request,
        config,
      ),
    };
  }

  const declaredLengthHeader = request.headers.get('content-length');
  if (declaredLengthHeader) {
    const declaredLength = Number.parseInt(declaredLengthHeader, 10);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_VERIFY_BODY_BYTES) {
      return {
        ok: false,
        response: errorResponse(
          413,
          'PAYLOAD_TOO_LARGE',
          `Request body exceeds maximum allowed size of ${MAX_VERIFY_BODY_BYTES} bytes.`,
          request,
          config,
          { maxBytes: MAX_VERIFY_BODY_BYTES },
        ),
      };
    }
  }

  let rawText = '';
  try {
    if (request.body && typeof request.body.getReader === 'function') {
      const reader = request.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let receivedBytes = 0;
      const chunks: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.byteLength;
          if (receivedBytes > MAX_VERIFY_BODY_BYTES) {
            try {
              await reader.cancel();
            } catch {
              // Ignore stream cancel errors
            }
            return {
              ok: false,
              response: errorResponse(
                413,
                'PAYLOAD_TOO_LARGE',
                `Request body exceeds maximum allowed size of ${MAX_VERIFY_BODY_BYTES} bytes.`,
                request,
                config,
                { maxBytes: MAX_VERIFY_BODY_BYTES, receivedBytes },
              ),
            };
          }
          chunks.push(decoder.decode(value, { stream: true }));
        }
      }
      chunks.push(decoder.decode());
      rawText = chunks.join('');
    } else {
      rawText = await request.text();
      const actualBytes = textEncoder.encode(rawText).byteLength;
      if (actualBytes > MAX_VERIFY_BODY_BYTES) {
        return {
          ok: false,
          response: errorResponse(
            413,
            'PAYLOAD_TOO_LARGE',
            `Request body exceeds maximum allowed size of ${MAX_VERIFY_BODY_BYTES} bytes.`,
            request,
            config,
            { maxBytes: MAX_VERIFY_BODY_BYTES, receivedBytes: actualBytes },
          ),
        };
      }
    }
  } catch {
    return {
      ok: false,
      response: errorResponse(400, 'INVALID_BODY', 'Unable to read request body.', request, config),
    };
  }

  if (!rawText.trim()) {
    return {
      ok: false,
      response: errorResponse(400, 'INVALID_JSON', 'Request body cannot be empty.', request, config),
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawText);
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      response: errorResponse(400, 'INVALID_JSON', 'Malformed JSON request body.', request, config),
    };
  }
}

function parsePagination(url: URL): { limit: number; offset: number } | { error: string } {
  const rawLimit = url.searchParams.get('limit');
  const rawOffset = url.searchParams.get('offset');

  let limit = DEFAULT_LEADERBOARD_LIMIT;
  if (rawLimit !== null && rawLimit !== '') {
    if (!/^\d+$/.test(rawLimit)) {
      return { error: 'limit must be a positive integer.' };
    }
    const parsed = Number.parseInt(rawLimit, 10);
    if (parsed < 1 || parsed > MAX_LEADERBOARD_LIMIT) {
      return { error: `limit must be between 1 and ${MAX_LEADERBOARD_LIMIT}.` };
    }
    limit = parsed;
  }

  let offset = 0;
  if (rawOffset !== null && rawOffset !== '') {
    if (!/^\d+$/.test(rawOffset)) {
      return { error: 'offset must be a non-negative integer.' };
    }
    const parsed = Number.parseInt(rawOffset, 10);
    if (parsed < 0 || parsed > 10_000) {
      return { error: 'offset must be between 0 and 10000.' };
    }
    offset = parsed;
  }

  return { limit, offset };
}

function sanitizeDisplayLabel(raw: unknown): string {
  if (typeof raw !== 'string') return 'مسافر قنات';
  // Strip control characters and angle brackets, keep readable Persian/Latin label up to 24 chars
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
  return cleaned.length >= 2 ? cleaned : 'مسافر قنات';
}

function hashOpaquePlayerId(playerId: string): string {
  // Deterministic 64-bit hex pseudonym derived from two domain-separated FNV-1a hashes
  // (pure JS — does not depend on unverified crypto.subtle availability)
  const hi = hashStringFNV1a(`qanatchi:anon:hi:${playerId}`).toString(16).padStart(8, '0');
  const lo = hashStringFNV1a(`qanatchi:anon:lo:${playerId}`).toString(16).padStart(8, '0');
  return `p_${hi}${lo}`;
}

function buildSubmissionFingerprint(
  playerIdHash: string,
  challengeId: string,
  actions: TileRotationAction[],
): string {
  const actionStr = actions.map((a) => `${a.row},${a.col}`).join(';');
  const h1 = hashStringFNV1a(`qanatchi:sub:1:${playerIdHash}:${challengeId}:${actionStr}`)
    .toString(16)
    .padStart(8, '0');
  const h2 = hashStringFNV1a(`qanatchi:sub:2:${actions.length}:${actionStr}:${playerIdHash}`)
    .toString(16)
    .padStart(8, '0');
  return `sub_${h1}${h2}`;
}

/**
 * Pure Web Fetch API request handler for QANATCHI Edge API (`/api/v1/*`).
 * Compatible with ArvanCloud Edge `addEventListener("fetch", ...)` without Node or Cloudflare bindings.
 */
export async function handleEdgeRequest(
  request: Request,
  options?: EdgeRequestOptions,
): Promise<Response> {
  const storage = options?.storage ?? new UnconfiguredStorageAdapter();
  const config = readEdgeRuntimeConfig({
    ...(options?.configOverrides ?? {}),
    storageConfigured: storage.isConfigured,
    storageDriver: storage.driverName,
  });

  try {
    return await dispatchEdgeRequest(request, storage, config, options);
  } catch {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      'An unexpected server error occurred.',
      request,
      config,
    );
  }
}

async function dispatchEdgeRequest(
  request: Request,
  storage: LeaderboardStorageAdapter,
  config: EdgeRuntimeConfig,
  options?: EdgeRequestOptions,
): Promise<Response> {
  const now = options?.now ? options.now() : new Date();

  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return errorResponse(400, 'INVALID_URL', 'Request URL is invalid.', request, config);
  }

  if (url.search.length > 2048) {
    return errorResponse(
      414,
      'URI_TOO_LONG',
      'Request query string exceeds maximum allowed length.',
      request,
      config,
    );
  }

  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS' && pathname.startsWith('/api/v1/')) {
    return new Response(null, {
      status: 204,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Cache-Control': 'no-store',
        ...buildCorsHeaders(request, config),
      },
    });
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/health
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/health') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/health.',
        request,
        config,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const body: ApiHealthResponse = {
      ok: true,
      apiVersion: API_VERSION,
      status: 'ok',
      runtime: {
        platform: 'arvancloud-edge',
        environment: config.appEnv,
        ecUrlConfigured: config.ecUrlPresent,
      },
      serverDateTehran: getTehranDateKey(now),
      serverTimeIso: now.toISOString(),
      algorithms: {
        dailyPuzzleVersion: DAILY_PUZZLE_ALGO_VERSION,
        friendChallengeVersion: FRIEND_CHALLENGE_ALGO_VERSION,
        rankedScoringVersion: RANKED_SCORING_ALGO_VERSION,
        localScoringVersion: LOCAL_SCORING_ALGO_VERSION,
      },
      storage: {
        configured: storage.isConfigured,
        status: storage.isConfigured ? 'configured' : 'not_configured',
        driver: storage.driverName,
      },
      features: {
        dailyMetadata: true,
        serverVerification: true,
        globalLeaderboard: storage.isConfigured,
        serverVerifiedTiming: false,
      },
    };
    return jsonResponse(body, 200, request, config);
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/daily
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/daily') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/daily.',
        request,
        config,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    // Never accept browser's local date as authoritative: always compute from Asia/Tehran on server.
    const rawAlgoParam = url.searchParams.get('algoVersion');
    let algoVersion = DAILY_PUZZLE_ALGO_VERSION;
    if (rawAlgoParam !== null && rawAlgoParam !== '') {
      if (!/^\d+$/.test(rawAlgoParam)) {
        return errorResponse(
          400,
          'UNSUPPORTED_ALGO_VERSION',
          'algoVersion must be a supported integer.',
          request,
          config,
          { supportedVersions: [...SUPPORTED_DAILY_ALGO_VERSIONS] },
        );
      }
      algoVersion = Number.parseInt(rawAlgoParam, 10);
      if (!SUPPORTED_DAILY_ALGO_VERSIONS.includes(algoVersion)) {
        return errorResponse(
          400,
          'UNSUPPORTED_ALGO_VERSION',
          `Unsupported daily puzzle algorithm version: ${algoVersion}.`,
          request,
          config,
          { supportedVersions: [...SUPPORTED_DAILY_ALGO_VERSIONS] },
        );
      }
    }

    const tehranDateKey = getTehranDateKey(now);
    const daily = generateDailyChallenge(tehranDateKey, algoVersion);

    const body: ApiDailyChallengeResponse = {
      ok: true,
      apiVersion: API_VERSION,
      daily: {
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        persianDateFa: daily.persianDateFa,
        algoVersion: daily.algoVersion,
        templateId: daily.templateId,
        seed: daily.seed,
        titleFa: daily.titleFa,
        introFa: daily.introFa,
        difficulty: daily.difficulty,
        rows: daily.level.rows,
        cols: daily.level.cols,
        expectedMinMoves: daily.level.expectedMinMoves,
        parTimeSec: daily.level.parTimeSec,
      },
    };

    // Short conservative cache (60s) on public non-personalized daily metadata
    return jsonResponse(body, 200, request, config, {
      'Cache-Control': 'public, max-age=60',
    });
  }

  // -------------------------------------------------------------------------
  // POST /api/v1/challenges/verify
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/challenges/verify') {
    if (method !== 'POST') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST is allowed for /api/v1/challenges/verify.',
        request,
        config,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config);
    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const outcome = replayAndVerifyChallengeSubmission(parsedBody.data, { now });
    if (!outcome.ok) {
      return errorResponse(
        outcome.httpStatus,
        outcome.code,
        outcome.message,
        request,
        config,
        outcome.details,
      );
    }

    const responseBody: ApiVerifyChallengeResponse = {
      ok: true,
      apiVersion: API_VERSION,
      verification: {
        verified: true,
        challengeType: outcome.challengeType,
        challengeId: outcome.challengeId,
        dateKey: outcome.dateKey,
        algoVersion: outcome.algoVersion,
        scoringVersion: outcome.scoringVersion,
        templateId: outcome.templateId,
        difficulty: outcome.difficulty,
        rows: outcome.rows,
        cols: outcome.cols,
        verifiedMoves: outcome.verifiedMoves,
        trustedExpectedMinMoves: outcome.trustedExpectedMinMoves,
        rankedScore: outcome.rankedScore,
        timingVerified: false,
      },
    };

    return jsonResponse(responseBody, 200, request, config);
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/leaderboards/daily?date=YYYY-MM-DD
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/leaderboards/daily') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/leaderboards/daily.',
        request,
        config,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const dateParam = (url.searchParams.get('date') ?? getTehranDateKey(now)).trim();
    if (!isValidDateKey(dateParam)) {
      return errorResponse(
        400,
        'INVALID_DATE_KEY',
        'date query parameter must be a valid YYYY-MM-DD Tehran date.',
        request,
        config,
      );
    }

    const pagination = parsePagination(url);
    if ('error' in pagination) {
      return errorResponse(400, 'INVALID_PAGINATION', pagination.error, request, config);
    }

    const rawPlayerId = url.searchParams.get('playerId')?.trim() ?? '';
    const playerIdHash =
      rawPlayerId && ANON_PLAYER_ID_REGEX.test(rawPlayerId)
        ? hashOpaquePlayerId(rawPlayerId)
        : null;

    const challengeId = `daily-v${DAILY_PUZZLE_ALGO_VERSION}-${dateParam}`;

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Durable leaderboard storage is not configured in this Edge deployment.',
        request,
        config,
        { challengeType: 'daily', dateKey: dateParam },
      );
    }

    try {
      const page = await storage.getDailyLeaderboard({
        dateKey: dateParam,
        challengeId,
        limit: pagination.limit,
        offset: pagination.offset,
      });
      const playerBest = playerIdHash
        ? await storage.getPlayerBest({
            challengeType: 'daily',
            challengeId,
            playerIdHash,
          })
        : null;

      const body: ApiLeaderboardListResponse = {
        ok: true,
        apiVersion: API_VERSION,
        leaderboard: {
          challengeType: 'daily',
          challengeId,
          dateKey: dateParam,
          scoringVersion: RANKED_SCORING_ALGO_VERSION,
          total: page.total,
          limit: page.limit,
          offset: page.offset,
          hasMore: page.hasMore,
          entries: page.entries,
          ...(playerIdHash ? { playerBest } : {}),
        },
      };
      return jsonResponse(body, 200, request, config);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      if (err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to retrieve daily leaderboard.',
        request,
        config,
      );
    }
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/leaderboards/friend?challengeId=...
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/leaderboards/friend') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/leaderboards/friend.',
        request,
        config,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const challengeIdParam = (url.searchParams.get('challengeId') ?? '').trim();
    const parsedFriend = parseFriendChallengeCode(challengeIdParam);
    if (!parsedFriend.ok) {
      return errorResponse(
        400,
        parsedFriend.reason === 'unsupported_version'
          ? 'UNSUPPORTED_ALGO_VERSION'
          : 'INVALID_FRIEND_CHALLENGE',
        `Invalid friend challengeId (${parsedFriend.reason}).`,
        request,
        config,
      );
    }

    const pagination = parsePagination(url);
    if ('error' in pagination) {
      return errorResponse(400, 'INVALID_PAGINATION', pagination.error, request, config);
    }

    const rawPlayerId = url.searchParams.get('playerId')?.trim() ?? '';
    const playerIdHash =
      rawPlayerId && ANON_PLAYER_ID_REGEX.test(rawPlayerId)
        ? hashOpaquePlayerId(rawPlayerId)
        : null;

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Durable leaderboard storage is not configured in this Edge deployment.',
        request,
        config,
        { challengeType: 'friend', challengeId: parsedFriend.challenge.challengeId },
      );
    }

    try {
      const page = await storage.getFriendLeaderboard({
        challengeId: parsedFriend.challenge.challengeId,
        limit: pagination.limit,
        offset: pagination.offset,
      });
      const playerBest = playerIdHash
        ? await storage.getPlayerBest({
            challengeType: 'friend',
            challengeId: parsedFriend.challenge.challengeId,
            playerIdHash,
          })
        : null;

      const body: ApiLeaderboardListResponse = {
        ok: true,
        apiVersion: API_VERSION,
        leaderboard: {
          challengeType: 'friend',
          challengeId: parsedFriend.challenge.challengeId,
          dateKey: null,
          scoringVersion: RANKED_SCORING_ALGO_VERSION,
          total: page.total,
          limit: page.limit,
          offset: page.offset,
          hasMore: page.hasMore,
          entries: page.entries,
          ...(playerIdHash ? { playerBest } : {}),
        },
      };
      return jsonResponse(body, 200, request, config);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      if (err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to retrieve friend challenge leaderboard.',
        request,
        config,
      );
    }
  }

  // -------------------------------------------------------------------------
  // POST /api/v1/leaderboards/submit
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/leaderboards/submit') {
    if (method !== 'POST') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST is allowed for /api/v1/leaderboards/submit.',
        request,
        config,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config);
    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    if (!parsedBody.data || typeof parsedBody.data !== 'object' || Array.isArray(parsedBody.data)) {
      return errorResponse(
        400,
        'INVALID_SUBMISSION',
        'Submission payload must be a JSON object.',
        request,
        config,
      );
    }

    const payload = parsedBody.data as Record<string, unknown>;
    const rawPlayerId = typeof payload.playerId === 'string' ? payload.playerId.trim() : '';
    if (!ANON_PLAYER_ID_REGEX.test(rawPlayerId)) {
      return errorResponse(
        400,
        'INVALID_PLAYER_ID',
        'playerId must be an anonymous opaque identifier (12-64 alphanumeric/underscore/hyphen characters).',
        request,
        config,
      );
    }

    // Independently verify puzzle and recompute score on server BEFORE touching storage
    const verified = replayAndVerifyChallengeSubmission(payload, { now });
    if (!verified.ok) {
      return errorResponse(
        verified.httpStatus,
        verified.code,
        verified.message,
        request,
        config,
        verified.details,
      );
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Solution verified, but durable leaderboard storage is not configured in this Edge deployment.',
        request,
        config,
        {
          verified: true,
          verifiedScore: verified.rankedScore.score,
          verifiedMoves: verified.verifiedMoves,
          scoringVersion: verified.scoringVersion,
        },
      );
    }

    const playerIdHash = hashOpaquePlayerId(rawPlayerId);
    const displayLabel = sanitizeDisplayLabel(payload.displayLabel);
    const submittedAt = now.toISOString();
    const actions = payload.actions as TileRotationAction[];
    const submissionFingerprint = buildSubmissionFingerprint(
      playerIdHash,
      verified.challengeId,
      actions,
    );
    const submissionId = `${submissionFingerprint}_${now.getTime().toString(36)}`;

    try {
      const saved = await storage.saveVerifiedSubmission({
        submissionId,
        submissionFingerprint,
        playerIdHash,
        displayLabel,
        challengeType: verified.challengeType,
        challengeId: verified.challengeId,
        dateKey: verified.dateKey,
        algoVersion: verified.algoVersion,
        scoringVersion: verified.scoringVersion,
        score: verified.rankedScore.score,
        stars: verified.rankedScore.stars as 1 | 2 | 3,
        verifiedMoves: verified.verifiedMoves,
        performanceTier: verified.rankedScore.performanceTier!,
        performanceLabelFa: verified.rankedScore.performanceLabelFa,
        submittedAt,
      });

      const responseBody: ApiLeaderboardSubmitResponse = {
        ok: true,
        apiVersion: API_VERSION,
        submission: {
          accepted: true,
          duplicate: saved.duplicate,
          isNewBest: saved.isNewBest,
          entry: saved.entry,
        },
      };

      return jsonResponse(responseBody, saved.duplicate ? 200 : 201, request, config);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      if (err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to save verified leaderboard submission.',
        request,
        config,
      );
    }
  }

  return errorResponse(404, 'NOT_FOUND', `Unknown API route: ${pathname}`, request, config);
}
