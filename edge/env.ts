import type { EdgeRuntimeConfig } from './types';

/**
 * Safe Edge runtime environment reader.
 *
 * ArvanCloud Edge Computing exposes dashboard-configured Environment Variables
 * (including encrypted secrets and reserved runtime variables such as `EC_URL`)
 * on the JavaScript global scope (`globalThis`), NOT via Node's `process.env`.
 *
 * This helper NEVER references `process.env` and NEVER returns secret values.
 */
function readGlobalString(name: string): string | undefined {
  const scope = globalThis as Record<string, unknown>;
  const raw = scope[name];
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  return undefined;
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
): EdgeRuntimeConfig {
  const appEnv = overrides?.appEnv ?? readGlobalString('APP_ENV') ?? 'production';
  const ecUrlPresent = overrides?.ecUrlPresent ?? Boolean(readGlobalString('EC_URL'));

  const rawOrigins = readGlobalString('ALLOWED_ORIGINS');
  const parsedOrigins = overrides?.allowedOrigins
    ? parseAllowedOrigins(overrides.allowedOrigins.join(','), appEnv)
    : parseAllowedOrigins(rawOrigins, appEnv);

  const storageDriver =
    overrides?.storageDriver ?? readGlobalString('LEADERBOARD_STORAGE_DRIVER') ?? 'unconfigured';

  const storageConfigured = overrides?.storageConfigured ?? false;

  return {
    appEnv,
    ecUrlPresent,
    allowedOrigins: parsedOrigins,
    storageConfigured,
    storageDriver,
  };
}
