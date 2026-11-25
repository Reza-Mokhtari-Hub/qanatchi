import crypto from 'node:crypto';
import http from 'node:http';
import { Pool } from 'pg';

const PORT = Number.parseInt(process.env.PORT ?? process.env.GATEWAY_PORT ?? '8080', 10);
const DATABASE_URL = (process.env.DATABASE_URL ?? '').trim();
const AUTH_TOKEN = (process.env.GATEWAY_AUTH_TOKEN ?? '').trim();
const AUTO_MIGRATE = (process.env.AUTO_MIGRATE ?? 'true').trim().toLowerCase() !== 'false';
const RAW_SSL = (process.env.DATABASE_SSL ?? process.env.DB_SSL ?? 'true').trim().toLowerCase();
const MAX_BODY_BYTES = 64 * 1024;

const INITIAL_SCHEMA_SQL = `
BEGIN;

CREATE TABLE IF NOT EXISTS players (
  player_id_hash TEXT PRIMARY KEY,
  display_label VARCHAR(24) NOT NULL DEFAULT 'مسافر قنات',
  verified_submissions INTEGER NOT NULL DEFAULT 0 CHECK (verified_submissions >= 0),
  best_daily_score INTEGER NOT NULL DEFAULT 0 CHECK (best_daily_score >= 0),
  best_friend_score INTEGER NOT NULL DEFAULT 0 CHECK (best_friend_score >= 0),
  total_verified_score BIGINT NOT NULL DEFAULT 0 CHECK (total_verified_score >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friend_challenges (
  challenge_id VARCHAR(64) PRIMARY KEY,
  algo_version INTEGER NOT NULL CHECK (algo_version >= 1),
  template_id VARCHAR(32) NOT NULL,
  seed BIGINT NOT NULL,
  difficulty VARCHAR(24) NOT NULL,
  title_fa VARCHAR(120) NOT NULL,
  created_by_hash TEXT REFERENCES players(player_id_hash) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_friend_challenges_expires_at
  ON friend_challenges (expires_at)
  WHERE expires_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS challenge_nonces (
  nonce_id VARCHAR(64) PRIMARY KEY,
  challenge_type VARCHAR(16) NOT NULL CHECK (challenge_type IN ('campaign', 'daily', 'friend')),
  challenge_id VARCHAR(64) NOT NULL,
  player_id_hash TEXT NOT NULL,
  issued_at_ms BIGINT NOT NULL,
  expires_at_ms BIGINT NOT NULL,
  min_solve_ms INTEGER NOT NULL CHECK (min_solve_ms >= 0),
  consumed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_nonces_expires
  ON challenge_nonces (expires_at_ms);

CREATE TABLE IF NOT EXISTS verified_submissions (
  submission_id VARCHAR(80) PRIMARY KEY,
  submission_fingerprint VARCHAR(80) NOT NULL UNIQUE,
  idempotency_key VARCHAR(96) NULL UNIQUE,
  player_id_hash TEXT NOT NULL REFERENCES players(player_id_hash) ON DELETE CASCADE,
  display_label VARCHAR(24) NOT NULL,
  challenge_type VARCHAR(16) NOT NULL CHECK (challenge_type IN ('campaign', 'daily', 'friend')),
  challenge_id VARCHAR(64) NOT NULL,
  date_key VARCHAR(10) NULL,
  algo_version INTEGER NOT NULL CHECK (algo_version >= 1),
  scoring_version INTEGER NOT NULL CHECK (scoring_version >= 1),
  score INTEGER NOT NULL CHECK (score >= 0),
  stars SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 3),
  verified_moves INTEGER NOT NULL CHECK (verified_moves >= 1),
  performance_tier VARCHAR(24) NOT NULL,
  performance_label_fa VARCHAR(48) NOT NULL,
  elapsed_ms_server INTEGER NULL CHECK (elapsed_ms_server IS NULL OR elapsed_ms_server >= 0),
  timing_verified BOOLEAN NOT NULL DEFAULT FALSE,
  nonce_id VARCHAR(64) NULL UNIQUE,
  submitted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verified_submissions_player
  ON verified_submissions (player_id_hash, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_verified_submissions_challenge
  ON verified_submissions (challenge_type, challenge_id, submitted_at DESC);

CREATE TABLE IF NOT EXISTS leaderboard_best (
  challenge_type VARCHAR(16) NOT NULL CHECK (challenge_type IN ('campaign', 'daily', 'friend')),
  challenge_id VARCHAR(64) NOT NULL,
  player_id_hash TEXT NOT NULL REFERENCES players(player_id_hash) ON DELETE CASCADE,
  submission_id VARCHAR(80) NOT NULL REFERENCES verified_submissions(submission_id) ON DELETE CASCADE,
  display_label VARCHAR(24) NOT NULL,
  date_key VARCHAR(10) NULL,
  algo_version INTEGER NOT NULL CHECK (algo_version >= 1),
  scoring_version INTEGER NOT NULL CHECK (scoring_version >= 1),
  score INTEGER NOT NULL CHECK (score >= 0),
  stars SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 3),
  verified_moves INTEGER NOT NULL CHECK (verified_moves >= 1),
  performance_tier VARCHAR(24) NOT NULL,
  performance_label_fa VARCHAR(48) NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (challenge_type, challenge_id, player_id_hash)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_best_ranking
  ON leaderboard_best (
    challenge_type,
    challenge_id,
    score DESC,
    verified_moves ASC,
    submitted_at ASC,
    submission_id ASC
  );

CREATE INDEX IF NOT EXISTS idx_leaderboard_best_daily_date
  ON leaderboard_best (date_key, score DESC, verified_moves ASC)
  WHERE date_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket_key VARCHAR(128) PRIMARY KEY,
  window_start_ms BIGINT NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
`;

function resolveSslOption(rawValue) {
  if (rawValue === 'false' || rawValue === '0' || rawValue === 'disable') {
    return false;
  }
  if (rawValue === 'no-verify' || rawValue === 'allow-self-signed') {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: true };
}

if (!DATABASE_URL || !AUTH_TOKEN || AUTH_TOKEN.length < 24) {
  console.error(
    'Refusing to start: DATABASE_URL and a strong GATEWAY_AUTH_TOKEN (>= 24 chars) are required.',
  );
  process.exit(1);
}

const pgPool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: resolveSslOption(RAW_SSL),
});

let schemaReady = !AUTO_MIGRATE;

async function ensureSchemaReady() {
  if (!AUTO_MIGRATE) return true;
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pgPool.query(INITIAL_SCHEMA_SQL);
      schemaReady = true;
      console.log('QANATCHI PostgreSQL schema verified and ready.');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown schema initialization error';
      console.error(`Schema initialization attempt ${attempt}/${maxAttempts} failed: ${message}`);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  return false;
}

await ensureSchemaReady();

function timingSafeBearerMatch(headerVal, expectedToken) {
  if (!headerVal || !headerVal.startsWith('Bearer ')) return false;
  const provided = headerVal.slice(7).trim();
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expectedToken, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

  if ((pathname === '/' || pathname === '/healthz') && (req.method === 'GET' || req.method === 'HEAD')) {
    try {
      await pgPool.query('SELECT 1');
      if (!schemaReady && AUTO_MIGRATE) {
        await ensureSchemaReady();
      }
      if (!schemaReady) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ ok: false, schemaReady: false }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        req.method === 'HEAD'
          ? undefined
          : JSON.stringify({
              ok: true,
              service: 'qanatchi-pg-gateway',
              schemaReady: true,
            }),
      );
    } catch {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ ok: false }));
    }
    return;
  }

  if (pathname !== '/sql' || req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  if (!timingSafeBearerMatch(req.headers.authorization, AUTH_TOKEN)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload Too Large' }));
      return;
    }
    chunks.push(chunk);
  }

  let parsed;
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  if (!parsed || typeof parsed.query !== 'string' || !Array.isArray(parsed.params)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Expected { query: string, params: array }' }));
    return;
  }

  try {
    if (!schemaReady && AUTO_MIGRATE) {
      await ensureSchemaReady();
    }
    const result = await pgPool.query(parsed.query, parsed.params);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ rows: result.rows, rowCount: result.rowCount }));
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Query execution failed' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`QANATCHI PostgreSQL HTTP Gateway listening on port ${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(async () => {
      await pgPool.end().catch(() => undefined);
      process.exit(0);
    });
  });
}
