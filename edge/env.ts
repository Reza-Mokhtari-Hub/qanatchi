import type { EdgeRuntimeConfig } from './types';

declare const QANATCHI_CONFIG: unknown;
declare const APP_ENV: unknown;
declare const EC_URL: unknown;
declare const ALLOWED_ORIGINS: unknown;
declare const LEADERBOARD_STORAGE_DRIVER: unknown;
declare const LEADERBOARD_DATABASE_URL: unknown;
declare const LEADERBOARD_DATABASE_TOKEN: unknown;
declare const LEADERBOARD_DATABASE_PASSWORD: unknown;
declare const EDGE_SIGNING_SECRET: unknown;
declare const REQUIRE_ATTEMPT_TOKEN: unknown;
declare const RATE_LIMIT_MAX_PER_MIN: unknown;
declare const ENABLE_STRUCTURED_LOGS: unknown;

declare const ENV: unknown;
declare const env: unknown;
declare const vars: unknown;

const LEXICAL_BINDING_READERS: Record<string, () => unknown> = {
  QANATCHI_CONFIG: () => (typeof QANATCHI_CONFIG !== 'undefined' ? QANATCHI_CONFIG : undefined),
  ENV: () => (typeof ENV !== 'undefined' ? ENV : undefined),
  env: () => (typeof env !== 'undefined' ? env : undefined),
  vars: () => (typeof vars !== 'undefined' ? vars : undefined),
  APP_ENV: () => (typeof APP_ENV !== 'undefined' ? APP_ENV : undefined),
  EC_URL: () => (typeof EC_URL !== 'undefined' ? EC_URL : undefined),
  ALLOWED_ORIGINS: () => (typeof ALLOWED_ORIGINS !== 'undefined' ? ALLOWED_ORIGINS : undefined),
  LEADERBOARD_STORAGE_DRIVER: () =>
    typeof LEADERBOARD_STORAGE_DRIVER !== 'undefined' ? LEADERBOARD_STORAGE_DRIVER : undefined,
  LEADERBOARD_DATABASE_URL: () =>
    typeof LEADERBOARD_DATABASE_URL !== 'undefined' ? LEADERBOARD_DATABASE_URL : undefined,
  LEADERBOARD_DATABASE_TOKEN: () =>
    typeof LEADERBOARD_DATABASE_TOKEN !== 'undefined' ? LEADERBOARD_DATABASE_TOKEN : undefined,
  LEADERBOARD_DATABASE_PASSWORD: () =>
    typeof LEADERBOARD_DATABASE_PASSWORD !== 'undefined'
      ? LEADERBOARD_DATABASE_PASSWORD
      : undefined,
  EDGE_SIGNING_SECRET: () =>
    typeof EDGE_SIGNING_SECRET !== 'undefined' ? EDGE_SIGNING_SECRET : undefined,
  REQUIRE_ATTEMPT_TOKEN: () =>
    typeof REQUIRE_ATTEMPT_TOKEN !== 'undefined' ? REQUIRE_ATTEMPT_TOKEN : undefined,
  RATE_LIMIT_MAX_PER_MIN: () =>
    typeof RATE_LIMIT_MAX_PER_MIN !== 'undefined' ? RATE_LIMIT_MAX_PER_MIN : undefined,
  ENABLE_STRUCTURED_LOGS: () =>
    typeof ENABLE_STRUCTURED_LOGS !== 'undefined' ? ENABLE_STRUCTURED_LOGS : undefined,
};

/**
 * Safe Edge runtime environment reader.
 *
 * ArvanCloud Edge Computing exposes dashboard-configured Environment Variables
 * (including encrypted secrets and reserved runtime variables such as `EC_URL`)
 * on the JavaScript global scope (`globalThis` / lexical bindings), NOT via Node's `process.env`.
 *
 * Also supports a single JSON-object variable `QANATCHI_CONFIG` (in case a dashboard
 * JSON field requires `{ ... }` object syntax), `{ "value": "..." }` wrappers, and
 * native boolean JSON values (`true`/`false`).
 *
 * This helper NEVER references `process.env` and NEVER returns secret values in public responses.
 */
function readLexicalBinding(name: string): unknown {
  const reader = LEXICAL_BINDING_READERS[name];
  if (!reader) return undefined;
  try {
    return reader();
  } catch {
    return undefined;
  }
}

function readNamedContainerField(containerName: string, key: string): unknown {
  const scope = globalThis as Record<string, unknown>;
  const container = scope[containerName] ?? readLexicalBinding(containerName);
  if (container && typeof container === 'object' && !Array.isArray(container)) {
    return (container as Record<string, unknown>)[key];
  }
  return undefined;
}

function readSelfScopeField(key: string): unknown {
  try {
    if (typeof self !== 'undefined' && self && typeof self === 'object') {
      return (self as unknown as Record<string, unknown>)[key];
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function readConfigBundle(
  bindings?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const scope = globalThis as Record<string, unknown>;
  const raw =
    bindings?.QANATCHI_CONFIG ??
    scope.QANATCHI_CONFIG ??
    readSelfScopeField('QANATCHI_CONFIG') ??
    readLexicalBinding('QANATCHI_CONFIG') ??
    readNamedContainerField('ENV', 'QANATCHI_CONFIG') ??
    readNamedContainerField('env', 'QANATCHI_CONFIG') ??
    readNamedContainerField('vars', 'QANATCHI_CONFIG');
  if (!raw) return undefined;
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

function readRawValue(name: string, bindings?: Record<string, unknown>): unknown {
  if (bindings && bindings[name] !== undefined) {
    return bindings[name];
  }
  const scope = globalThis as Record<string, unknown>;
  if (scope[name] !== undefined) {
    return scope[name];
  }
  const fromSelf = readSelfScopeField(name);
  if (fromSelf !== undefined) {
    return fromSelf;
  }
  const lexical = readLexicalBinding(name);
  if (lexical !== undefined) {
    return lexical;
  }
  const fromContainer =
    readNamedContainerField('ENV', name) ??
    readNamedContainerField('env', name) ??
    readNamedContainerField('vars', name);
  if (fromContainer !== undefined) {
    return fromContainer;
  }
  const bundle = readConfigBundle(bindings);
  if (bundle && bundle[name] !== undefined) {
    return bundle[name];
  }
  return undefined;
}

function readRuntimeString(
  name: string,
  bindings?: Record<string, unknown>,
): string | undefined {
  const raw = readRawValue(name, bindings);
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const inner = (raw as Record<string, unknown>).value;
    if (typeof inner === 'string' && inner.trim().length > 0) {
      return inner.trim();
    }
  }
  return undefined;
}

function readRuntimeBool(
  name: string,
  fallback: boolean,
  bindings?: Record<string, unknown>,
): boolean {
  const rawVal = readRawValue(name, bindings);
  if (typeof rawVal === 'boolean') return rawVal;
  const raw = readRuntimeString(name, bindings);
  if (!raw) return fallback;
  const lower = raw.toLowerCase();
  if (lower === '1' || lower === 'true' || lower === 'yes') return true;
  if (lower === '0' || lower === 'false' || lower === 'no') return false;
  return fallback;
}

function readRuntimeInt(
  name: string,
  fallback: number,
  min: number,
  max: number,
  bindings?: Record<string, unknown>,
): number {
  const rawVal = readRawValue(name, bindings);
  if (typeof rawVal === 'number' && Number.isFinite(rawVal)) {
    return Math.min(max, Math.max(min, Math.trunc(rawVal)));
  }
  const raw = readRuntimeString(name, bindings);
  if (!raw || !/^\d+$/.test(raw)) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function isLocalhostHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return lower === 'localhost' || lower === '127.0.0.1' || lower === '[::1]' || lower === '::1';
}

function parseAllowedOrigins(raw: string | undefined, appEnv: string): string[] {
  if (!raw) return [];
  const allowDevLocalHttp = appEnv === 'development';
  const normalized: string[] = [];
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed || trimmed === '*' || trimmed.toLowerCase() === 'null') {
      continue;
    }
    try {
      const parsed = new URL(trimmed);
      const isValidHttps = parsed.protocol === 'https:';
      const isValidDevLocalHttp =
        allowDevLocalHttp && parsed.protocol === 'http:' && isLocalhostHostname(parsed.hostname);
      if (isValidHttps || isValidDevLocalHttp) {
        if (!normalized.includes(parsed.origin)) {
          normalized.push(parsed.origin);
        }
      }
    } catch {
      // Ignore malformed origin entries safely
    }
  }
  return normalized;
}

export function readEdgeRuntimeConfig(
  overrides?: Partial<EdgeRuntimeConfig>,
  bindings?: Record<string, unknown>,
): EdgeRuntimeConfig {
  const appEnv = overrides?.appEnv ?? readRuntimeString('APP_ENV', bindings) ?? 'production';
  const ecUrlPresent =
    overrides?.ecUrlPresent ?? Boolean(readRuntimeString('EC_URL', bindings));

  const rawOrigins = readRuntimeString('ALLOWED_ORIGINS', bindings);
  const parsedOrigins = overrides?.allowedOrigins
    ? parseAllowedOrigins(overrides.allowedOrigins.join(','), appEnv)
    : parseAllowedOrigins(rawOrigins, appEnv);

  const storageDriver =
    overrides?.storageDriver ??
    readRuntimeString('LEADERBOARD_STORAGE_DRIVER', bindings) ??
    'unconfigured';

  const storageUrl =
    overrides?.storageUrl ?? readRuntimeString('LEADERBOARD_DATABASE_URL', bindings);
  const storageToken =
    overrides?.storageToken ??
    readRuntimeString('LEADERBOARD_DATABASE_TOKEN', bindings) ??
    readRuntimeString('LEADERBOARD_DATABASE_PASSWORD', bindings);

  const signingSecret =
    overrides?.signingSecret ?? readRuntimeString('EDGE_SIGNING_SECRET', bindings);

  const requireAttemptToken =
    overrides?.requireAttemptToken ??
    readRuntimeBool('REQUIRE_ATTEMPT_TOKEN', false, bindings);

  const rateLimitMaxPerMin =
    overrides?.rateLimitMaxPerMin ??
    readRuntimeInt('RATE_LIMIT_MAX_PER_MIN', 60, 5, 1000, bindings);

  const structuredLogsEnabled =
    overrides?.structuredLogsEnabled ??
    readRuntimeBool('ENABLE_STRUCTURED_LOGS', appEnv !== 'test', bindings);

  const storageConfigured = overrides?.storageConfigured ?? false;

  return {
    appEnv,
    ecUrlPresent,
    allowedOrigins: parsedOrigins,
    storageConfigured,
    storageDriver,
    storageUrl,
    storageToken,
    signingSecret,
    requireAttemptToken,
    rateLimitMaxPerMin,
    structuredLogsEnabled,
  };
}
