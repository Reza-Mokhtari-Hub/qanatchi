import type { EdgeRuntimeConfig } from '../types';
import { PostgresHttpStorageAdapter } from './postgresHttpStorage';
import type { LeaderboardStorageAdapter } from './types';
import { UnconfiguredStorageAdapter } from './unconfiguredStorage';

function isPostgresConnectionString(value: string): boolean {
  return /^postgres(ql)?:\/\//i.test(value.trim());
}

/**
 * Resolve production storage adapter strictly from verified runtime configuration.
 *
 * Supports:
 * 1. `postgres-http`: QANATCHI HTTPS SQL Gateway (`https://gateway.../sql` + Bearer token)
 *    or direct Neon endpoint (`https://ep-...neon.tech/sql` + `postgresql://...` token).
 * 2. `neon-http` (or `neon`): Direct Neon Serverless Postgres over HTTPS `POST /sql`,
 *    accepting either `https://.../sql` + `LEADERBOARD_DATABASE_TOKEN=postgresql://...`
 *    OR directly pasting the Neon `postgresql://...` connection string into `LEADERBOARD_DATABASE_URL`.
 *
 * Never falls back to InMemoryTestStorageAdapter or localStorage.
 * If durable storage environment variables are absent or invalid, returns
 * UnconfiguredStorageAdapter so API routes report 503 STORAGE_NOT_CONFIGURED honestly.
 */
export function resolveProductionStorage(
  config: Pick<EdgeRuntimeConfig, 'appEnv' | 'storageDriver' | 'storageUrl' | 'storageToken'>,
): LeaderboardStorageAdapter {
  const driver = (config.storageDriver ?? '').trim().toLowerCase();
  const rawUrl = (config.storageUrl ?? '').trim();
  const rawToken = (config.storageToken ?? '').trim();

  if (!rawUrl) {
    return new UnconfiguredStorageAdapter();
  }

  if (driver === 'neon-http' || driver === 'neon') {
    try {
      if (isPostgresConnectionString(rawUrl)) {
        const parsedPg = new URL(rawUrl);
        if (!parsedPg.hostname) {
          return new UnconfiguredStorageAdapter();
        }
        const connectionString =
          rawToken && isPostgresConnectionString(rawToken) ? rawToken : rawUrl;
        return new PostgresHttpStorageAdapter({
          endpointUrl: `https://${parsedPg.hostname}/sql`,
          authToken: connectionString,
          authMode: 'neon-connection-string',
          driverName: 'neon-http',
        });
      }

      const parsed = new URL(rawUrl);
      const isHttps = parsed.protocol === 'https:';
      const isLocalDevHttp =
        config.appEnv === 'development' &&
        parsed.protocol === 'http:' &&
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');

      if ((isHttps || isLocalDevHttp) && rawToken) {
        return new PostgresHttpStorageAdapter({
          endpointUrl: parsed.toString(),
          authToken: rawToken,
          authMode: 'neon-connection-string',
          driverName: 'neon-http',
        });
      }
    } catch {
      return new UnconfiguredStorageAdapter();
    }
    return new UnconfiguredStorageAdapter();
  }

  if (driver === 'postgres-http') {
    try {
      const parsed = new URL(rawUrl);
      const isHttps = parsed.protocol === 'https:';
      const isLocalDevHttp =
        config.appEnv === 'development' &&
        parsed.protocol === 'http:' &&
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');

      if (isHttps || isLocalDevHttp) {
        const useNeonAuth =
          parsed.hostname.toLowerCase().endsWith('.neon.tech') &&
          Boolean(rawToken && isPostgresConnectionString(rawToken));
        return new PostgresHttpStorageAdapter({
          endpointUrl: parsed.toString(),
          authToken: rawToken || undefined,
          authMode: useNeonAuth ? 'neon-connection-string' : 'bearer',
          driverName: useNeonAuth ? 'neon-http' : 'postgres-http',
        });
      }
    } catch {
      return new UnconfiguredStorageAdapter();
    }
  }

  return new UnconfiguredStorageAdapter();
}
