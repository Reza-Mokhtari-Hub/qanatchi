-- ============================================================================
-- QANATCHI (قنات‌چی) — Migration 001: Initial Durable Edge Leaderboard Schema
-- Target Engine: PostgreSQL 14+ (ArvanCloud Managed PostgreSQL / Compatible)
-- ============================================================================

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

-- Deterministic leaderboard ordering index matching Ranked Scoring v2 contract:
-- score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC
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
