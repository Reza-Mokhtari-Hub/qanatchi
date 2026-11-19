import type {
  ApiDailyChallengeResponse,
  ApiErrorBody,
  ApiHealthResponse,
  ApiLeaderboardListResponse,
  ApiLeaderboardSubmitResponse,
  ApiVerifyChallengeResponse,
} from '../../edge/types';
import type {
  ChallengeVerifyRequestPayload,
  TileRotationAction,
  VerifiableChallengeType,
} from '../engagement/solutionReplay';

export const ANON_PLAYER_ID_STORAGE_KEY = 'qanatchi_v1_anon_id';
const DEFAULT_TIMEOUT_MS = 8000;

declare global {
  interface Window {
    __QANATCHI_API_BASE__?: string;
  }
}

/**
 * Resolve configurable Edge API base URL without rebuilding gameplay logic.
 * Priority: runtime `window.__QANATCHI_API_BASE__` -> Vite `VITE_API_BASE_URL` -> "" (same-origin).
 */
export function resolveApiBaseUrl(explicitBase?: string): string {
  if (typeof explicitBase === 'string') {
    return explicitBase.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && typeof window.__QANATCHI_API_BASE__ === 'string') {
    return window.__QANATCHI_API_BASE__.trim().replace(/\/+$/, '');
  }
  const viteBase =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.VITE_API_BASE_URL === 'string'
      ? import.meta.env.VITE_API_BASE_URL
      : '';
  return viteBase.trim().replace(/\/+$/, '');
}

/**
 * Generate or load a cryptographically random anonymous opaque device identifier.
 * Contains zero PII and is explicitly NOT a verified human identity.
 */
export function getOrCreateAnonymousPlayerId(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = window.localStorage.getItem(ANON_PLAYER_ID_STORAGE_KEY);
      if (existing && /^[a-zA-Z0-9_-]{12,64}$/.test(existing)) {
        return existing;
      }
    }
  } catch {
    // Fallback to ephemeral ID if storage is blocked
  }

  let generated = '';
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      generated = `anon_${crypto.randomUUID().replace(/-/g, '')}`;
    } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      generated = `anon_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
    }
  } catch {
    // Fallback below
  }

  if (!generated) {
    generated = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ANON_PLAYER_ID_STORAGE_KEY, generated);
    }
  } catch {
    // Ignore storage quota errors
  }

  return generated;
}

export type FetchLike = typeof fetch;

export interface EdgeClientOptions {
  baseUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  options?: EdgeClientOptions,
): Promise<
  | { networkOk: true; status: number; json: unknown }
  | { networkOk: false; reason: 'timeout' | 'network' }
> {
  const fetchFn = options?.fetchImpl ?? (typeof fetch === 'function' ? fetch : null);
  if (!fetchFn) {
    return { networkOk: false, reason: 'network' };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer =
    controller !== null
      ? globalThis.setTimeout(() => {
          controller.abort();
        }, timeoutMs)
      : null;

  try {
    const response = await fetchFn(url, {
      ...init,
      signal: controller?.signal,
    });
    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    return { networkOk: true, status: response.status, json: parsed };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return { networkOk: false, reason: isAbort ? 'timeout' : 'network' };
  } finally {
    if (timer !== null) {
      globalThis.clearTimeout(timer);
    }
  }
}

function extractApiError(json: unknown): ApiErrorBody['error'] | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Partial<ApiErrorBody>;
  if (obj.ok === false && obj.error && typeof obj.error.code === 'string') {
    return obj.error;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValidHealthResponse(json: unknown): json is ApiHealthResponse {
  if (!isRecord(json) || json.ok !== true) return false;
  return (
    typeof json.apiVersion === 'string' &&
    typeof json.serverDateTehran === 'string' &&
    isRecord(json.storage) &&
    typeof json.storage.configured === 'boolean' &&
    isRecord(json.features)
  );
}

function isValidDailyResponse(json: unknown): json is ApiDailyChallengeResponse {
  if (!isRecord(json) || json.ok !== true || !isRecord(json.daily)) return false;
  return (
    typeof json.daily.challengeId === 'string' &&
    typeof json.daily.dateKey === 'string' &&
    typeof json.daily.algoVersion === 'number'
  );
}

function isValidVerifyResponse(json: unknown): json is ApiVerifyChallengeResponse {
  if (!isRecord(json) || json.ok !== true || !isRecord(json.verification)) return false;
  const v = json.verification;
  return (
    v.verified === true &&
    typeof v.challengeId === 'string' &&
    typeof v.verifiedMoves === 'number' &&
    isRecord(v.rankedScore) &&
    typeof v.rankedScore.score === 'number'
  );
}

function isValidLeaderboardListResponse(json: unknown): json is ApiLeaderboardListResponse {
  if (!isRecord(json) || json.ok !== true || !isRecord(json.leaderboard)) return false;
  const lb = json.leaderboard;
  return (
    typeof lb.challengeId === 'string' &&
    typeof lb.total === 'number' &&
    typeof lb.hasMore === 'boolean' &&
    Array.isArray(lb.entries)
  );
}

function isValidLeaderboardSubmitResponse(json: unknown): json is ApiLeaderboardSubmitResponse {
  if (!isRecord(json) || json.ok !== true || !isRecord(json.submission)) return false;
  return json.submission.accepted === true && isRecord(json.submission.entry);
}

export type ApiHealthResult =
  | { status: 'online'; data: ApiHealthResponse }
  | { status: 'offline'; messageFa: string };

export async function fetchApiHealth(options?: EdgeClientOptions): Promise<ApiHealthResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/health`,
    { method: 'GET', headers: { Accept: 'application/json' } },
    options,
  );

  if (!res.networkOk) {
    return {
      status: 'offline',
      messageFa: 'سرور لبه در دسترس نیست؛ بازی به صورت آفلاین کاملاً فعال است.',
    };
  }

  if (res.status === 200 && isValidHealthResponse(res.json)) {
    return { status: 'online', data: res.json };
  }

  return {
    status: 'offline',
    messageFa: 'پاسخ معتبری از سرور لبه دریافت نشد؛ بازی در حالت آفلاین ادامه دارد.',
  };
}

export type ServerDailyResult =
  | { status: 'ok'; data: ApiDailyChallengeResponse['daily'] }
  | { status: 'offline'; messageFa: string }
  | { status: 'error'; code: string; messageFa: string };

export async function fetchServerDailyMetadata(
  options?: EdgeClientOptions,
): Promise<ServerDailyResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/daily`,
    { method: 'GET', headers: { Accept: 'application/json' } },
    options,
  );

  if (!res.networkOk) {
    return {
      status: 'offline',
      messageFa: 'ارتباط با سرور برقرار نشد؛ معمای روزانه به صورت محلی بارگذاری شده است.',
    };
  }

  if (res.status === 200 && isValidDailyResponse(res.json)) {
    return { status: 'ok', data: res.json.daily };
  }

  const apiErr = extractApiError(res.json);
  return {
    status: 'error',
    code: apiErr?.code ?? 'API_ERROR',
    messageFa: 'دریافت مشخصات چالش روزانه از سرور ناموفق بود.',
  };
}

export type ServerVerifyResult =
  | { status: 'verified'; data: ApiVerifyChallengeResponse['verification'] }
  | { status: 'rejected'; code: string; messageFa: string }
  | { status: 'offline'; messageFa: string };

export async function verifyChallengeOnServer(
  payload: ChallengeVerifyRequestPayload,
  options?: EdgeClientOptions,
): Promise<ServerVerifyResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/challenges/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
    options,
  );

  if (!res.networkOk) {
    return {
      status: 'offline',
      messageFa: 'سرور لبه در دسترس نیست؛ رکورد شما به صورت آفلاین روی این دستگاه ذخیره شد.',
    };
  }

  if (res.status === 200 && isValidVerifyResponse(res.json)) {
    return {
      status: 'verified',
      data: res.json.verification,
    };
  }

  const apiErr = extractApiError(res.json);
  return {
    status: 'rejected',
    code: apiErr?.code ?? 'VERIFICATION_REJECTED',
    messageFa: 'تأیید سرور برای این مسیر حل انجام نشد.',
  };
}

export type LeaderboardFetchResult =
  | { status: 'ok'; data: ApiLeaderboardListResponse['leaderboard'] }
  | { status: 'storage_not_configured'; messageFa: string }
  | { status: 'offline'; messageFa: string }
  | { status: 'error'; code: string; messageFa: string };

export async function fetchDailyLeaderboard(
  dateKey: string,
  params?: { limit?: number; offset?: number; playerId?: string },
  options?: EdgeClientOptions,
): Promise<LeaderboardFetchResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const query = new URLSearchParams();
  query.set('date', dateKey);
  if (typeof params?.limit === 'number') query.set('limit', String(params.limit));
  if (typeof params?.offset === 'number') query.set('offset', String(params.offset));
  if (params?.playerId) query.set('playerId', params.playerId);

  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/leaderboards/daily?${query.toString()}`,
    { method: 'GET', headers: { Accept: 'application/json' } },
    options,
  );

  return interpretLeaderboardListResponse(res);
}

export async function fetchFriendLeaderboard(
  challengeId: string,
  params?: { limit?: number; offset?: number; playerId?: string },
  options?: EdgeClientOptions,
): Promise<LeaderboardFetchResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const query = new URLSearchParams();
  query.set('challengeId', challengeId);
  if (typeof params?.limit === 'number') query.set('limit', String(params.limit));
  if (typeof params?.offset === 'number') query.set('offset', String(params.offset));
  if (params?.playerId) query.set('playerId', params.playerId);

  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/leaderboards/friend?${query.toString()}`,
    { method: 'GET', headers: { Accept: 'application/json' } },
    options,
  );

  return interpretLeaderboardListResponse(res);
}

function interpretLeaderboardListResponse(
  res:
    | { networkOk: true; status: number; json: unknown }
    | { networkOk: false; reason: 'timeout' | 'network' },
): LeaderboardFetchResult {
  if (!res.networkOk) {
    return {
      status: 'offline',
      messageFa: 'ارتباط با سرور لبه برقرار نشد. رکوردهای محلی شما همچنان در دسترس هستند.',
    };
  }

  if (res.status === 200 && isValidLeaderboardListResponse(res.json)) {
    return {
      status: 'ok',
      data: res.json.leaderboard,
    };
  }

  const apiErr = extractApiError(res.json);
  if (apiErr?.code === 'STORAGE_NOT_CONFIGURED') {
    return {
      status: 'storage_not_configured',
      messageFa:
        'حافظه پایدار جدول امتیازات جهانی هنوز روی سرور پیکربندی نشده است. تأیید مسیر حل در سرور لبه فعال است و رکوردهای شخصی شما به صورت محلی ذخیره می‌شوند.',
    };
  }

  return {
    status: 'error',
    code: apiErr?.code ?? 'LEADERBOARD_UNAVAILABLE',
    messageFa: 'جدول امتیازات جهانی در حال حاضر در دسترس نیست.',
  };
}

export type LeaderboardSubmitResult =
  | { status: 'submitted'; data: ApiLeaderboardSubmitResponse['submission'] }
  | { status: 'storage_not_configured'; verifiedScore?: number; messageFa: string }
  | { status: 'offline'; messageFa: string }
  | { status: 'error'; code: string; messageFa: string };

export async function submitVerifiedScoreToLeaderboard(
  payload: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    dateKey?: string;
    algoVersion: number;
    actions: TileRotationAction[];
    playerId: string;
    displayLabel?: string;
  },
  options?: EdgeClientOptions,
): Promise<LeaderboardSubmitResult> {
  const base = resolveApiBaseUrl(options?.baseUrl);
  const res = await fetchJsonWithTimeout(
    `${base}/api/v1/leaderboards/submit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
    options,
  );

  if (!res.networkOk) {
    return {
      status: 'offline',
      messageFa: 'ارتباط با سرور برقرار نشد؛ رکورد شما به صورت آفلاین ذخیره شد.',
    };
  }

  if ((res.status === 200 || res.status === 201) && isValidLeaderboardSubmitResponse(res.json)) {
    return {
      status: 'submitted',
      data: res.json.submission,
    };
  }

  const apiErr = extractApiError(res.json);
  if (apiErr?.code === 'STORAGE_NOT_CONFIGURED') {
    const verifiedScore =
      typeof apiErr.details?.verifiedScore === 'number'
        ? apiErr.details.verifiedScore
        : undefined;
    return {
      status: 'storage_not_configured',
      verifiedScore,
      messageFa:
        'مسیر حل شما در سرور تأیید شد، اما حافظه پایدار جدول امتیازات جهانی هنوز متصل نشده است.',
    };
  }

  return {
    status: 'error',
    code: apiErr?.code ?? 'SUBMIT_FAILED',
    messageFa: 'ثبت امتیاز در جدول جهانی انجام نشد.',
  };
}
