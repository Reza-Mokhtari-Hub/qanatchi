import {
  DAILY_PUZZLE_ALGO_VERSION,
  generateDailyChallenge,
  SUPPORTED_DAILY_ALGO_VERSIONS,
} from '../src/engagement/dailyChallenge';
import { LOCAL_SCORING_ALGO_VERSION } from '../src/engagement/dailyScoring';
import {
  createFriendChallengeByDifficulty,
  FRIEND_CHALLENGE_ALGO_VERSION,
  parseFriendChallengeCode,
} from '../src/engagement/friendChallenge';
import { RANKED_SCORING_ALGO_VERSION } from '../src/engagement/rankedScoring';
import {
  CAMPAIGN_PUZZLE_ALGO_VERSION,
  MAX_VERIFY_BODY_BYTES,
  replayAndVerifyChallengeSubmission,
  resolveTrustedChallengeDefinition,
  type TileRotationAction,
} from '../src/engagement/solutionReplay';
import { getTehranDateKey, isValidDateKey } from '../src/engagement/tehranTime';
import { LEVELS } from '../src/levels/levels';
import {
  createRandomHexId,
  sha256Hex,
  signAttemptToken,
  verifyAttemptToken,
} from './crypto';
import { readEdgeRuntimeConfig } from './env';
import { emitEdgeStructuredLog } from './logger';
import { resolveProductionStorage } from './storage/resolveStorage';
import {
  NonceAlreadyUsedError,
  StorageNotConfiguredError,
  StorageUnavailableError,
  type LeaderboardStorageAdapter,
} from './storage/types';
import {
  API_VERSION,
  type ApiAttemptStartResponse,
  type ApiDailyChallengeResponse,
  type ApiErrorBody,
  type ApiFriendChallengeCreateResponse,
  type ApiFriendChallengeGetResponse,
  type ApiGlobalLeaderboardResponse,
  type ApiHealthResponse,
  type ApiLeaderboardListResponse,
  type ApiLeaderboardSubmitResponse,
  type ApiPlayerProfileResponse,
  type ApiReadyResponse,
  type ApiVerifyChallengeResponse,
  type ApiVersionResponse,
  type EdgeRuntimeConfig,
} from './types';

export interface EdgeRequestOptions {
  storage?: LeaderboardStorageAdapter;
  configOverrides?: Partial<EdgeRuntimeConfig>;
  bindings?: Record<string, unknown>;
  now?: () => Date;
  fetchImpl?: typeof fetch;
}

const DEFAULT_LEADERBOARD_LIMIT = 20;
const MAX_LEADERBOARD_LIMIT = 50;
const ANON_PLAYER_ID_REGEX = /^[a-zA-Z0-9_-]{12,64}$/;
const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9_.:-]{8,80}$/;
const ATTEMPT_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const DEFAULT_FRIEND_EXPIRY_HOURS = 168; // 7 days
const MAX_FRIEND_EXPIRY_HOURS = 720; // 30 days
const RATE_LIMIT_WINDOW_MS = 60_000;

const textEncoder = new TextEncoder();

// Lightweight per-isolate sliding window burst protector (augments durable DB rate limiting)
const isolateRateCounters = new Map<string, { windowStartMs: number; count: number }>();

function checkIsolateBurstRateLimit(
  bucketKey: string,
  maxRequests: number,
  nowMs: number,
): { allowed: boolean; retryAfterSec: number } {
  if (isolateRateCounters.size > 2000) {
    isolateRateCounters.clear();
  }
  const existing = isolateRateCounters.get(bucketKey);
  if (!existing || nowMs - existing.windowStartMs >= RATE_LIMIT_WINDOW_MS) {
    isolateRateCounters.set(bucketKey, { windowStartMs: nowMs, count: 1 });
    return { allowed: true, retryAfterSec: 0 };
  }
  existing.count += 1;
  if (existing.count > maxRequests) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((existing.windowStartMs + RATE_LIMIT_WINDOW_MS - nowMs) / 1000),
    );
    return { allowed: false, retryAfterSec };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function buildCorsHeaders(
  request: Request,
  config: EdgeRuntimeConfig,
): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!origin) return {};

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
      'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key, X-Request-Id',
      'Access-Control-Expose-Headers': 'X-Request-Id, Retry-After',
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
  requestId: string,
  extraHeaders?: Record<string, string>,
): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
    'X-Request-Id': requestId,
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
  requestId: string,
  details?: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
): Response {
  const payload: ApiErrorBody = {
    ok: false,
    apiVersion: API_VERSION,
    requestId,
    error: details ? { code, message, details } : { code, message },
  };
  return jsonResponse(payload, status, request, config, requestId, extraHeaders);
}

async function readValidatedJsonBody(
  request: Request,
  config: EdgeRuntimeConfig,
  requestId: string,
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
        requestId,
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
          requestId,
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
                requestId,
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
            requestId,
            { maxBytes: MAX_VERIFY_BODY_BYTES, receivedBytes: actualBytes },
          ),
        };
      }
    }
  } catch {
    return {
      ok: false,
      response: errorResponse(
        400,
        'INVALID_BODY',
        'Unable to read request body.',
        request,
        config,
        requestId,
      ),
    };
  }

  if (!rawText.trim()) {
    return {
      ok: false,
      response: errorResponse(
        400,
        'INVALID_JSON',
        'Request body cannot be empty.',
        request,
        config,
        requestId,
      ),
    };
  }

  try {
    const parsed: unknown = JSON.parse(rawText);
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      response: errorResponse(
        400,
        'INVALID_JSON',
        'Malformed JSON request body.',
        request,
        config,
        requestId,
      ),
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
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
  return cleaned.length >= 2 ? cleaned : 'مسافر قنات';
}

function hashOpaquePlayerId(playerId: string): string {
  return `p_${sha256Hex(`qanatchi:anon:v1:${playerId}`).slice(0, 24)}`;
}

function buildSubmissionFingerprint(
  playerIdHash: string,
  challengeId: string,
  actions: TileRotationAction[],
): string {
  const actionStr = actions.map((a) => `${a.row},${a.col}`).join(';');
  return `sub_${sha256Hex(`qanatchi:sub:v1:${playerIdHash}:${challengeId}:${actionStr}`).slice(0, 32)}`;
}

function resolveClientIpHash(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp =
    request.headers.get('ar-real-ip')?.trim() ??
    request.headers.get('x-real-ip')?.trim() ??
    forwardedFor ??
    'unknown';
  return sha256Hex(`qanatchi:ip:${realIp}`).slice(0, 16);
}

function resolveSigningSecret(config: EdgeRuntimeConfig): string | null {
  if (config.signingSecret && config.signingSecret.length >= 16) {
    return config.signingSecret;
  }
  if (config.appEnv === 'development' || config.appEnv === 'test') {
    return 'qanatchi-local-dev-ephemeral-signing-key-only';
  }
  return null;
}

function extractIdempotencyKey(request: Request, payload: Record<string, unknown>): string | null {
  const headerVal = request.headers.get('idempotency-key')?.trim() ?? '';
  const bodyVal = typeof payload.idempotencyKey === 'string' ? payload.idempotencyKey.trim() : '';
  const candidate = headerVal || bodyVal;
  if (!candidate) return null;
  if (!IDEMPOTENCY_KEY_REGEX.test(candidate)) return null;
  return candidate;
}

/**
 * Pure Web Fetch API request handler for QANATCHI Edge API (`/api/v1/*`).
 * Compatible with ArvanCloud Edge `addEventListener("fetch", ...)` without Node or Cloudflare bindings.
 */
export async function handleEdgeRequest(
  request: Request,
  options?: EdgeRequestOptions,
): Promise<Response> {
  const startMs = Date.now();
  const baseConfig = readEdgeRuntimeConfig(options?.configOverrides, options?.bindings);
  const storage = options?.storage ?? resolveProductionStorage(baseConfig);
  const config: EdgeRuntimeConfig = {
    ...baseConfig,
    storageConfigured: storage.isConfigured,
    storageDriver: storage.driverName,
  };

  const incomingReqId = request.headers.get('x-request-id')?.trim();
  const requestId =
    incomingReqId && /^[a-zA-Z0-9_-]{8,48}$/.test(incomingReqId)
      ? incomingReqId
      : `req_${createRandomHexId(8)}`;

  let pathname = '/';
  let errorCode: string | undefined;
  let response: Response;

  try {
    try {
      pathname = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
    } catch {
      pathname = '/invalid-url';
    }
    response = await dispatchEdgeRequest(request, storage, config, requestId, options);
    if (response.status >= 400 && !errorCode) {
      try {
        const errJson = (await response.clone().json()) as { error?: { code?: unknown } };
        if (typeof errJson?.error?.code === 'string') {
          errorCode = errJson.error.code;
        }
      } catch {
        // Ignore non-JSON error responses
      }
    }
  } catch {
    errorCode = 'INTERNAL_ERROR';
    response = errorResponse(
      500,
      'INTERNAL_ERROR',
      'An unexpected server error occurred.',
      request,
      config,
      requestId,
    );
  }

  const durationMs = Math.max(0, Date.now() - startMs);
  let readyProbeDetails: Record<string, unknown> | undefined;
  if (pathname === '/api/v1/ready' && !config.storageConfigured) {
    try {
      const scope = globalThis as Record<string, unknown>;
      const ownGlobalKeys = Object.getOwnPropertyNames(scope)
        .filter((k) => /^[A-Z][A-Z0-9_]{2,}$/.test(k))
        .slice(0, 20);
      const proc = scope.process as { env?: Record<string, unknown> } | undefined;
      const procEnvKeys =
        proc && typeof proc === 'object' && proc.env && typeof proc.env === 'object'
          ? Object.keys(proc.env).filter((k) => /^[A-Z][A-Z0-9_]{2,}$/.test(k)).slice(0, 20)
          : [];
      readyProbeDetails = {
        upperGlobalKeys: ownGlobalKeys,
        hasLexicalQanatchi: typeof (globalThis as Record<string, unknown>).QANATCHI_CONFIG,
        procEnvUpperKeys: procEnvKeys,
        eventBindingKeys: options?.bindings ? Object.keys(options.bindings).slice(0, 20) : [],
      };
    } catch {
      readyProbeDetails = undefined;
    }
  }

  emitEdgeStructuredLog(
    {
      ts: new Date(startMs).toISOString(),
      level: response.status >= 500 ? 'error' : response.status >= 400 ? 'warn' : 'info',
      requestId,
      method: request.method.toUpperCase(),
      path: pathname,
      status: response.status,
      durationMs,
      storageDriver: config.storageDriver,
      ...(errorCode ? { errorCode } : {}),
      ...(readyProbeDetails ? { details: readyProbeDetails } : {}),
    },
    config.structuredLogsEnabled,
  );

  return response;
}

async function enforceWriteRateLimit(
  request: Request,
  storage: LeaderboardStorageAdapter,
  config: EdgeRuntimeConfig,
  requestId: string,
  routeKey: string,
  nowMs: number,
  playerIdHash?: string,
): Promise<Response | null> {
  const ipHash = resolveClientIpHash(request);
  const bucketKey = `${routeKey}:${playerIdHash ?? ipHash}`;

  const isolateCheck = checkIsolateBurstRateLimit(bucketKey, config.rateLimitMaxPerMin, nowMs);
  if (!isolateCheck.allowed) {
    return errorResponse(
      429,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again shortly.',
      request,
      config,
      requestId,
      { retryAfterSec: isolateCheck.retryAfterSec },
      { 'Retry-After': String(isolateCheck.retryAfterSec) },
    );
  }

  if (storage.isConfigured) {
    try {
      const durableCheck = await storage.checkRateLimit({
        bucketKey,
        windowMs: RATE_LIMIT_WINDOW_MS,
        maxRequests: config.rateLimitMaxPerMin,
        nowMs,
      });
      if (!durableCheck.allowed) {
        return errorResponse(
          429,
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please try again shortly.',
          request,
          config,
          requestId,
          { retryAfterSec: durableCheck.retryAfterSec },
          { 'Retry-After': String(durableCheck.retryAfterSec) },
        );
      }
    } catch {
      // Do not fail valid gameplay submissions solely due to rate-limit table outage
    }
  }

  return null;
}

async function validateOptionalAttemptToken(params: {
  payload: Record<string, unknown>;
  challengeType: 'campaign' | 'daily' | 'friend';
  challengeId: string;
  playerIdHash: string;
  consumeInStorage: boolean;
  storage: LeaderboardStorageAdapter;
  config: EdgeRuntimeConfig;
  request: Request;
  requestId: string;
  now: Date;
}): Promise<
  | { ok: true; timingVerified: boolean; serverElapsedMs: number | null; nonceId: string | null }
  | { ok: false; response: Response }
> {
  const { payload, challengeType, challengeId, playerIdHash, consumeInStorage, storage, config, request, requestId, now } =
    params;

  const rawToken = typeof payload.attemptToken === 'string' ? payload.attemptToken.trim() : '';
  if (!rawToken) {
    if (config.requireAttemptToken) {
      return {
        ok: false,
        response: errorResponse(
          400,
          'ATTEMPT_TOKEN_REQUIRED',
          'A signed server attemptToken is required for ranked submissions.',
          request,
          config,
          requestId,
        ),
      };
    }
    return { ok: true, timingVerified: false, serverElapsedMs: null, nonceId: null };
  }

  const secret = resolveSigningSecret(config);
  if (!secret) {
    return {
      ok: false,
      response: errorResponse(
        503,
        'SIGNING_SECRET_NOT_CONFIGURED',
        'Attempt token verification requires EDGE_SIGNING_SECRET in production.',
        request,
        config,
        requestId,
      ),
    };
  }

  const nowMs = now.getTime();
  const verifiedToken = verifyAttemptToken(rawToken, secret, nowMs);
  if (!verifiedToken.ok) {
    const code =
      verifiedToken.reason === 'expired' ? 'ATTEMPT_TOKEN_EXPIRED' : 'INVALID_ATTEMPT_TOKEN';
    return {
      ok: false,
      response: errorResponse(
        400,
        code,
        verifiedToken.reason === 'expired'
          ? 'Attempt token has expired. Please start a fresh attempt.'
          : 'Attempt token signature or format is invalid.',
        request,
        config,
        requestId,
      ),
    };
  }

  const { claims } = verifiedToken;
  if (
    claims.challengeType !== challengeType ||
    claims.challengeId !== challengeId ||
    claims.playerIdHash !== playerIdHash
  ) {
    return {
      ok: false,
      response: errorResponse(
        400,
        'ATTEMPT_TOKEN_MISMATCH',
        'Attempt token does not match the submitted challenge or player.',
        request,
        config,
        requestId,
      ),
    };
  }

  const elapsedMs = nowMs - claims.issuedAtMs;
  if (elapsedMs < claims.minSolveMs) {
    return {
      ok: false,
      response: errorResponse(
        422,
        'IMPOSSIBLE_SOLVE_TIME',
        'Submitted completion elapsed time is below the physical minimum solve threshold.',
        request,
        config,
        requestId,
        { serverElapsedMs: elapsedMs, minSolveMs: claims.minSolveMs },
      ),
    };
  }

  if (consumeInStorage && storage.isConfigured) {
    const consumeRes = await storage.consumeAttemptNonce({
      nonceId: claims.nonceId,
      challengeType,
      challengeId,
      playerIdHash,
      nowIso: now.toISOString(),
    });
    if (!consumeRes.consumed) {
      return {
        ok: false,
        response: errorResponse(
          409,
          'NONCE_ALREADY_USED',
          'This attempt token has already been used or was never issued.',
          request,
          config,
          requestId,
        ),
      };
    }
  }

  return {
    ok: true,
    timingVerified: consumeInStorage ? storage.isConfigured : true,
    serverElapsedMs: elapsedMs,
    nonceId: claims.nonceId,
  };
}

async function dispatchEdgeRequest(
  request: Request,
  storage: LeaderboardStorageAdapter,
  config: EdgeRuntimeConfig,
  requestId: string,
  options?: EdgeRequestOptions,
): Promise<Response> {
  const now = options?.now ? options.now() : new Date();
  const nowMs = now.getTime();

  let url: URL;
  try {
    url = new URL(request.url);
  } catch {
    return errorResponse(400, 'INVALID_URL', 'Request URL is invalid.', request, config, requestId);
  }

  if (url.search.length > 2048) {
    return errorResponse(
      414,
      'URI_TOO_LONG',
      'Request query string exceeds maximum allowed length.',
      request,
      config,
      requestId,
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
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Cache-Control': 'no-store',
        'X-Request-Id': requestId,
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
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const signingAvailable = Boolean(resolveSigningSecret(config));
    const body: ApiHealthResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
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
        campaignPuzzleVersion: CAMPAIGN_PUZZLE_ALGO_VERSION,
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
        campaignVerification: true,
        globalLeaderboard: storage.isConfigured,
        serverVerifiedTiming: signingAvailable && storage.isConfigured,
        onlineFriendChallenges: storage.isConfigured,
        playerProfiles: storage.isConfigured,
      },
    };
    return jsonResponse(body, 200, request, config, requestId);
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/ready
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/ready') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/ready.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Edge API is alive, but durable storage is not configured.',
        request,
        config,
        requestId,
      );
    }

    try {
      const ping = await storage.ping();
      const body: ApiReadyResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        ready: true,
        storage: {
          configured: true,
          driver: storage.driverName,
          reachable: true,
          latencyMs: ping.latencyMs,
        },
        serverTimeIso: now.toISOString(),
      };
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        503,
        'STORAGE_UNAVAILABLE',
        'Durable storage ping failed.',
        request,
        config,
        requestId,
      );
    }
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/version
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/version') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/version.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const body: ApiVersionResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
      platform: 'arvancloud-edge',
      totalCampaignLevels: LEVELS.length,
      algorithms: {
        dailyPuzzleVersion: DAILY_PUZZLE_ALGO_VERSION,
        friendChallengeVersion: FRIEND_CHALLENGE_ALGO_VERSION,
        campaignPuzzleVersion: CAMPAIGN_PUZZLE_ALGO_VERSION,
        rankedScoringVersion: RANKED_SCORING_ALGO_VERSION,
        localScoringVersion: LOCAL_SCORING_ALGO_VERSION,
      },
      supportedChallengeTypes: ['campaign', 'daily', 'friend'],
    };
    return jsonResponse(body, 200, request, config, requestId, {
      'Cache-Control': 'public, max-age=60',
    });
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
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

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
          requestId,
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
          requestId,
          { supportedVersions: [...SUPPORTED_DAILY_ALGO_VERSIONS] },
        );
      }
    }

    const tehranDateKey = getTehranDateKey(now);
    const daily = generateDailyChallenge(tehranDateKey, algoVersion);

    const body: ApiDailyChallengeResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
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

    return jsonResponse(body, 200, request, config, requestId, {
      'Cache-Control': 'public, max-age=60',
    });
  }

  // -------------------------------------------------------------------------
  // POST /api/v1/challenges/start
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/challenges/start') {
    if (method !== 'POST') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST is allowed for /api/v1/challenges/start.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config, requestId);
    if (!parsedBody.ok) return parsedBody.response;
    if (!parsedBody.data || typeof parsedBody.data !== 'object' || Array.isArray(parsedBody.data)) {
      return errorResponse(
        400,
        'INVALID_REQUEST',
        'Request body must be a JSON object.',
        request,
        config,
        requestId,
      );
    }

    const payload = parsedBody.data as Record<string, unknown>;
    const rawPlayerId = typeof payload.playerId === 'string' ? payload.playerId.trim() : '';
    if (!ANON_PLAYER_ID_REGEX.test(rawPlayerId)) {
      return errorResponse(
        400,
        'INVALID_PLAYER_ID',
        'playerId must be an anonymous opaque identifier (12-64 characters).',
        request,
        config,
        requestId,
      );
    }
    const playerIdHash = hashOpaquePlayerId(rawPlayerId);

    const rateBlocked = await enforceWriteRateLimit(
      request,
      storage,
      config,
      requestId,
      'start',
      nowMs,
      playerIdHash,
    );
    if (rateBlocked) return rateBlocked;

    const resolved = resolveTrustedChallengeDefinition(payload, { now });
    if (!resolved.ok) {
      return errorResponse(
        resolved.httpStatus,
        resolved.code,
        resolved.message,
        request,
        config,
        requestId,
        resolved.details,
      );
    }

    const secret = resolveSigningSecret(config);
    if (!secret) {
      return errorResponse(
        503,
        'SIGNING_SECRET_NOT_CONFIGURED',
        'EDGE_SIGNING_SECRET is not configured in this production deployment.',
        request,
        config,
        requestId,
      );
    }

    const nonceId = `n_${createRandomHexId(12)}`;
    const minSolveMs = Math.min(4000, Math.max(500, resolved.level.expectedMinMoves * 200));
    const expiresAtMs = nowMs + ATTEMPT_TOKEN_TTL_MS;
    const attemptToken = signAttemptToken(
      {
        v: 1,
        nonceId,
        challengeType: resolved.challengeType,
        challengeId: resolved.challengeId,
        playerIdHash,
        issuedAtMs: nowMs,
        expiresAtMs,
        minSolveMs,
      },
      secret,
    );

    let persistedNonce = false;
    if (storage.isConfigured) {
      try {
        await storage.saveAttemptNonce({
          nonceId,
          challengeType: resolved.challengeType,
          challengeId: resolved.challengeId,
          playerIdHash,
          issuedAtMs: nowMs,
          expiresAtMs,
          minSolveMs,
        });
        persistedNonce = true;
      } catch {
        // Nonce remains cryptographically signed even if storage insert encounters transient unavailability
        persistedNonce = false;
      }
    }

    const body: ApiAttemptStartResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
      attempt: {
        attemptToken,
        nonceId,
        challengeType: resolved.challengeType,
        challengeId: resolved.challengeId,
        issuedAtIso: new Date(nowMs).toISOString(),
        expiresAtIso: new Date(expiresAtMs).toISOString(),
        minSolveTimeMs: minSolveMs,
        persistedNonce,
      },
    };
    return jsonResponse(body, 201, request, config, requestId);
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
        requestId,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config, requestId);
    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    const rateBlocked = await enforceWriteRateLimit(
      request,
      storage,
      config,
      requestId,
      'verify',
      nowMs,
    );
    if (rateBlocked) return rateBlocked;

    const outcome = replayAndVerifyChallengeSubmission(parsedBody.data, { now });
    if (!outcome.ok) {
      return errorResponse(
        outcome.httpStatus,
        outcome.code,
        outcome.message,
        request,
        config,
        requestId,
        outcome.details,
      );
    }

    const bodyObj = parsedBody.data as Record<string, unknown>;
    let timingVerified = false;
    let serverElapsedMs: number | null = null;
    if (typeof bodyObj.attemptToken === 'string' && bodyObj.attemptToken.trim()) {
      const rawPlayerId = typeof bodyObj.playerId === 'string' ? bodyObj.playerId.trim() : '';
      if (!ANON_PLAYER_ID_REGEX.test(rawPlayerId)) {
        return errorResponse(
          400,
          'INVALID_PLAYER_ID',
          'playerId is required when verifying with an attemptToken.',
          request,
          config,
          requestId,
        );
      }
      const tokenCheck = await validateOptionalAttemptToken({
        payload: bodyObj,
        challengeType: outcome.challengeType,
        challengeId: outcome.challengeId,
        playerIdHash: hashOpaquePlayerId(rawPlayerId),
        consumeInStorage: false,
        storage,
        config,
        request,
        requestId,
        now,
      });
      if (!tokenCheck.ok) return tokenCheck.response;
      timingVerified = tokenCheck.timingVerified;
      serverElapsedMs = tokenCheck.serverElapsedMs;
    }

    const responseBody: ApiVerifyChallengeResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
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
        timingVerified,
        serverElapsedMs,
      },
    };

    return jsonResponse(responseBody, 200, request, config, requestId);
  }

  // -------------------------------------------------------------------------
  // POST /api/v1/friend-challenges
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/friend-challenges') {
    if (method !== 'POST') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST is allowed for /api/v1/friend-challenges.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config, requestId);
    if (!parsedBody.ok) return parsedBody.response;
    if (!parsedBody.data || typeof parsedBody.data !== 'object' || Array.isArray(parsedBody.data)) {
      return errorResponse(
        400,
        'INVALID_REQUEST',
        'Request body must be a JSON object.',
        request,
        config,
        requestId,
      );
    }

    const payload = parsedBody.data as Record<string, unknown>;
    const rateBlocked = await enforceWriteRateLimit(
      request,
      storage,
      config,
      requestId,
      'friend_create',
      nowMs,
    );
    if (rateBlocked) return rateBlocked;

    const rawPlayerId = typeof payload.playerId === 'string' ? payload.playerId.trim() : '';
    const createdByHash =
      rawPlayerId && ANON_PLAYER_ID_REGEX.test(rawPlayerId)
        ? hashOpaquePlayerId(rawPlayerId)
        : null;

    let challengeDef;
    if (typeof payload.challengeId === 'string' && payload.challengeId.trim()) {
      const parsed = parseFriendChallengeCode(payload.challengeId.trim());
      if (!parsed.ok) {
        return errorResponse(
          400,
          parsed.reason === 'unsupported_version'
            ? 'UNSUPPORTED_ALGO_VERSION'
            : 'INVALID_FRIEND_CHALLENGE',
          `Invalid friend challenge code (${parsed.reason}).`,
          request,
          config,
          requestId,
        );
      }
      challengeDef = parsed.challenge;
    } else {
      const diff =
        payload.difficulty === 'normal' ||
        payload.difficulty === 'medium' ||
        payload.difficulty === 'challenging' ||
        payload.difficulty === 'hard' ||
        payload.difficulty === 'expert'
          ? payload.difficulty
          : 'any';
      const entropy = `${nowMs}-${createRandomHexId(8)}-${createdByHash ?? 'anon'}`;
      challengeDef = createFriendChallengeByDifficulty(diff, entropy);
    }

    let expiresAt: string | null = null;
    if (payload.expiresInHours !== null) {
      const hours =
        typeof payload.expiresInHours === 'number' && Number.isFinite(payload.expiresInHours)
          ? Math.min(MAX_FRIEND_EXPIRY_HOURS, Math.max(1, Math.round(payload.expiresInHours)))
          : DEFAULT_FRIEND_EXPIRY_HOURS;
      expiresAt = new Date(nowMs + hours * 3600 * 1000).toISOString();
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Durable storage is not configured to persist friend challenges on the server.',
        request,
        config,
        requestId,
        {
          challengeId: challengeDef.challengeId,
          algoVersion: challengeDef.algoVersion,
        },
      );
    }

    try {
      const saved = await storage.saveFriendChallenge({
        challengeId: challengeDef.challengeId,
        algoVersion: challengeDef.algoVersion,
        templateId: challengeDef.templateId,
        seed: challengeDef.seed,
        difficulty: challengeDef.difficulty,
        titleFa: challengeDef.titleFa,
        rows: challengeDef.level.rows,
        cols: challengeDef.level.cols,
        expectedMinMoves: challengeDef.level.expectedMinMoves,
        parTimeSec: challengeDef.level.parTimeSec,
        createdByHash,
        expiresAt,
        createdAt: now.toISOString(),
      });

      const body: ApiFriendChallengeCreateResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        friendChallenge: saved,
      };
      return jsonResponse(body, 201, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageUnavailableError || err instanceof StorageNotConfiguredError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to save friend challenge metadata.',
        request,
        config,
        requestId,
      );
    }
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/friend-challenges/:challengeId
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/api/v1/friend-challenges/')) {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/friend-challenges/:challengeId.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const challengeIdParam = decodeURIComponent(
      pathname.slice('/api/v1/friend-challenges/'.length),
    ).trim();
    const parsedFriend = parseFriendChallengeCode(challengeIdParam);
    if (!parsedFriend.ok) {
      return errorResponse(
        400,
        parsedFriend.reason === 'unsupported_version'
          ? 'UNSUPPORTED_ALGO_VERSION'
          : 'INVALID_FRIEND_CHALLENGE',
        `Invalid friend challenge code (${parsedFriend.reason}).`,
        request,
        config,
        requestId,
      );
    }

    let storedMeta = null;
    if (storage.isConfigured) {
      try {
        storedMeta = await storage.getFriendChallenge(parsedFriend.challenge.challengeId);
        if (storedMeta?.expiresAt && Date.parse(storedMeta.expiresAt) < nowMs) {
          return errorResponse(
            410,
            'CHALLENGE_EXPIRED',
            'This friend challenge has expired.',
            request,
            config,
            requestId,
            { challengeId: storedMeta.challengeId, expiresAt: storedMeta.expiresAt },
          );
        }
      } catch {
        // Fall back to deterministic verification when metadata lookup fails
        storedMeta = null;
      }
    }

    const c = parsedFriend.challenge;
    const body: ApiFriendChallengeGetResponse = {
      ok: true,
      apiVersion: API_VERSION,
      requestId,
      friendChallenge: {
        challengeId: c.challengeId,
        algoVersion: c.algoVersion,
        templateId: c.templateId,
        seed: c.seed,
        difficulty: c.difficulty,
        titleFa: c.titleFa,
        rows: c.level.rows,
        cols: c.level.cols,
        expectedMinMoves: c.level.expectedMinMoves,
        parTimeSec: c.level.parTimeSec,
        createdByHash: storedMeta?.createdByHash ?? null,
        expiresAt: storedMeta?.expiresAt ?? null,
        createdAt: storedMeta?.createdAt ?? now.toISOString(),
        participantCount: storedMeta?.participantCount ?? 0,
      },
    };

    return jsonResponse(body, 200, request, config, requestId);
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
        requestId,
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
        requestId,
      );
    }

    const pagination = parsePagination(url);
    if ('error' in pagination) {
      return errorResponse(400, 'INVALID_PAGINATION', pagination.error, request, config, requestId);
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
        requestId,
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
        requestId,
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
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to retrieve daily leaderboard.',
        request,
        config,
        requestId,
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
        requestId,
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
        requestId,
      );
    }

    const pagination = parsePagination(url);
    if ('error' in pagination) {
      return errorResponse(400, 'INVALID_PAGINATION', pagination.error, request, config, requestId);
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
        requestId,
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
        requestId,
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
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to retrieve friend challenge leaderboard.',
        request,
        config,
        requestId,
      );
    }
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/leaderboards/global
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/leaderboards/global') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/leaderboards/global.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const pagination = parsePagination(url);
    if ('error' in pagination) {
      return errorResponse(400, 'INVALID_PAGINATION', pagination.error, request, config, requestId);
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
        requestId,
        { scope: 'global' },
      );
    }

    try {
      const page = await storage.getGlobalLeaderboard({
        limit: pagination.limit,
        offset: pagination.offset,
        playerIdHash,
      });

      const body: ApiGlobalLeaderboardResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        leaderboard: {
          scope: 'global',
          scoringVersion: RANKED_SCORING_ALGO_VERSION,
          total: page.total,
          limit: page.limit,
          offset: page.offset,
          hasMore: page.hasMore,
          entries: page.entries,
          ...(playerIdHash ? { playerEntry: page.playerEntry ?? null } : {}),
        },
      };
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to retrieve global leaderboard.',
        request,
        config,
        requestId,
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
        requestId,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config, requestId);
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
        requestId,
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
        requestId,
      );
    }

    const playerIdHash = hashOpaquePlayerId(rawPlayerId);
    const rateBlocked = await enforceWriteRateLimit(
      request,
      storage,
      config,
      requestId,
      'submit',
      nowMs,
      playerIdHash,
    );
    if (rateBlocked) return rateBlocked;

    // Independently verify puzzle and recompute score on server BEFORE touching storage
    const verified = replayAndVerifyChallengeSubmission(payload, { now });
    if (!verified.ok) {
      return errorResponse(
        verified.httpStatus,
        verified.code,
        verified.message,
        request,
        config,
        requestId,
        verified.details,
      );
    }

    // Check Friend Challenge expiry if registered in durable storage
    if (verified.challengeType === 'friend' && storage.isConfigured) {
      try {
        const fcMeta = await storage.getFriendChallenge(verified.challengeId);
        if (fcMeta?.expiresAt && Date.parse(fcMeta.expiresAt) < nowMs) {
          return errorResponse(
            410,
            'CHALLENGE_EXPIRED',
            'This friend challenge has expired and no longer accepts new scores.',
            request,
            config,
            requestId,
          );
        }
      } catch {
        // Proceed if lookup unavailable
      }
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Solution verified, but durable leaderboard storage is not configured in this Edge deployment.',
        request,
        config,
        requestId,
        {
          verified: true,
          verifiedScore: verified.rankedScore.score,
          verifiedMoves: verified.verifiedMoves,
          scoringVersion: verified.scoringVersion,
        },
      );
    }

    const displayLabel = sanitizeDisplayLabel(payload.displayLabel);
    const submittedAt = now.toISOString();
    const actions = payload.actions as TileRotationAction[];
    const submissionFingerprint = buildSubmissionFingerprint(
      playerIdHash,
      verified.challengeId,
      actions,
    );
    const submissionId = `${submissionFingerprint.slice(0, 20)}_${now.getTime().toString(36)}`;
    const idempotencyKey = extractIdempotencyKey(request, payload);

    try {
      const tokenCheck = await validateOptionalAttemptToken({
        payload,
        challengeType: verified.challengeType,
        challengeId: verified.challengeId,
        playerIdHash,
        consumeInStorage: true,
        storage,
        config,
        request,
        requestId,
        now,
      });
      if (!tokenCheck.ok) return tokenCheck.response;

      const saved = await storage.saveVerifiedSubmission({
        submissionId,
        submissionFingerprint,
        idempotencyKey,
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
        elapsedMsServer: tokenCheck.serverElapsedMs,
        timingVerified: tokenCheck.timingVerified,
        nonceId: tokenCheck.nonceId,
        submittedAt,
      });

      const responseBody: ApiLeaderboardSubmitResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        submission: {
          accepted: true,
          duplicate: saved.duplicate,
          isNewBest: saved.isNewBest,
          timingVerified: tokenCheck.timingVerified,
          serverElapsedMs: tokenCheck.serverElapsedMs,
          entry: saved.entry,
        },
      };

      return jsonResponse(responseBody, saved.duplicate ? 200 : 201, request, config, requestId);
    } catch (err) {
      if (err instanceof NonceAlreadyUsedError) {
        return errorResponse(409, err.code, err.message, request, config, requestId);
      }
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to save verified leaderboard submission.',
        request,
        config,
        requestId,
      );
    }
  }

  // -------------------------------------------------------------------------
  // GET /api/v1/players/me?playerId=...
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/players/me') {
    if (method !== 'GET') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only GET is allowed for /api/v1/players/me.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'GET, OPTIONS' },
      );
    }

    const rawPlayerId = url.searchParams.get('playerId')?.trim() ?? '';
    if (!ANON_PLAYER_ID_REGEX.test(rawPlayerId)) {
      return errorResponse(
        400,
        'INVALID_PLAYER_ID',
        'playerId query parameter must be an anonymous opaque identifier (12-64 chars).',
        request,
        config,
        requestId,
      );
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Durable player profile storage is not configured.',
        request,
        config,
        requestId,
      );
    }

    const playerIdHash = hashOpaquePlayerId(rawPlayerId);
    try {
      const existing = await storage.getPlayerProfile(playerIdHash);
      const profile = existing ?? {
        playerIdHash,
        displayLabel: 'مسافر قنات',
        verifiedSubmissions: 0,
        bestDailyScore: 0,
        bestFriendScore: 0,
        totalVerifiedScore: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        recentSubmissions: [],
      };
      const body: ApiPlayerProfileResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        profile,
      };
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to load player profile.',
        request,
        config,
        requestId,
      );
    }
  }

  // -------------------------------------------------------------------------
  // POST /api/v1/players/profile
  // -------------------------------------------------------------------------
  if (pathname === '/api/v1/players/profile') {
    if (method !== 'POST') {
      return errorResponse(
        405,
        'METHOD_NOT_ALLOWED',
        'Only POST is allowed for /api/v1/players/profile.',
        request,
        config,
        requestId,
        undefined,
        { Allow: 'POST, OPTIONS' },
      );
    }

    const parsedBody = await readValidatedJsonBody(request, config, requestId);
    if (!parsedBody.ok) return parsedBody.response;
    if (!parsedBody.data || typeof parsedBody.data !== 'object' || Array.isArray(parsedBody.data)) {
      return errorResponse(
        400,
        'INVALID_REQUEST',
        'Profile payload must be a JSON object.',
        request,
        config,
        requestId,
      );
    }

    const payload = parsedBody.data as Record<string, unknown>;
    const rawPlayerId = typeof payload.playerId === 'string' ? payload.playerId.trim() : '';
    if (!ANON_PLAYER_ID_REGEX.test(rawPlayerId)) {
      return errorResponse(
        400,
        'INVALID_PLAYER_ID',
        'playerId must be an anonymous opaque identifier (12-64 chars).',
        request,
        config,
        requestId,
      );
    }

    if (!storage.isConfigured) {
      return errorResponse(
        503,
        'STORAGE_NOT_CONFIGURED',
        'Durable player profile storage is not configured.',
        request,
        config,
        requestId,
      );
    }

    const playerIdHash = hashOpaquePlayerId(rawPlayerId);
    const rateBlocked = await enforceWriteRateLimit(
      request,
      storage,
      config,
      requestId,
      'profile',
      nowMs,
      playerIdHash,
    );
    if (rateBlocked) return rateBlocked;

    const displayLabel = sanitizeDisplayLabel(payload.displayLabel);
    try {
      const profile = await storage.upsertPlayerProfile({
        playerIdHash,
        displayLabel,
        nowIso: now.toISOString(),
      });
      const body: ApiPlayerProfileResponse = {
        ok: true,
        apiVersion: API_VERSION,
        requestId,
        profile,
      };
      return jsonResponse(body, 200, request, config, requestId);
    } catch (err) {
      if (err instanceof StorageNotConfiguredError || err instanceof StorageUnavailableError) {
        return errorResponse(503, err.code, err.message, request, config, requestId);
      }
      return errorResponse(
        500,
        'STORAGE_ERROR',
        'Failed to update player profile.',
        request,
        config,
        requestId,
      );
    }
  }

  return errorResponse(404, 'NOT_FOUND', `Unknown API route: ${pathname}`, request, config, requestId);
}
