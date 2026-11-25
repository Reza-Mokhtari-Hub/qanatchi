import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';
import type {
  FriendChallengeMetadataRecord,
  GlobalPlayerLeaderboardEntry,
  PersistedLeaderboardEntry,
  PlayerProfileSummary,
} from '../types';
import {
  StorageNotConfiguredError,
  StorageUnavailableError,
  type LeaderboardStorageAdapter,
  type PaginatedGlobalLeaderboardResult,
  type PaginatedLeaderboardResult,
  type RateLimitCheckResult,
  type SaveAttemptNonceInput,
  type SaveFriendChallengeInput,
  type SaveVerifiedSubmissionInput,
  type SaveVerifiedSubmissionResult,
} from './types';

export interface PostgresHttpStorageOptions {
  endpointUrl: string;
  authToken?: string;
  authMode?: 'bearer' | 'neon-connection-string';
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  driverName?: string;
}

interface SqlGatewayResponse {
  rows?: Array<Record<string, unknown>>;
  rowCount?: number;
  error?: string;
}

const DEFAULT_STORAGE_TIMEOUT_MS = 4000;

function toInt(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStr(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function mapLeaderboardRow(row: Record<string, unknown>, fallbackRank: number): PersistedLeaderboardEntry {
  const rawStars = toInt(row.stars, 1);
  const stars = (rawStars >= 3 ? 3 : rawStars === 2 ? 2 : 1) as 1 | 2 | 3;
  return {
    rank: toInt(row.rank, fallbackRank),
    submissionId: toStr(row.submission_id),
    playerIdHash: toStr(row.player_id_hash),
    displayLabel: toStr(row.display_label, 'مسافر قنات'),
    challengeType: (toStr(row.challenge_type, 'daily') as VerifiableChallengeType),
    challengeId: toStr(row.challenge_id),
    dateKey: row.date_key ? toStr(row.date_key) : null,
    score: toInt(row.score, 0),
    stars,
    verifiedMoves: toInt(row.verified_moves, 1),
    performanceTier: toStr(row.performance_tier, 'striver') as PersistedLeaderboardEntry['performanceTier'],
    performanceLabelFa: toStr(row.performance_label_fa, 'تلاشگر کویر'),
    scoringVersion: toInt(row.scoring_version, 2),
    submittedAt: toStr(row.submitted_at),
  };
}

/**
 * Durable PostgreSQL storage adapter using pure Web Fetch (`POST /sql`) over HTTPS.
 *
 * Compatible with:
 * - ArvanCloud Managed PostgreSQL (DBaaS) fronted by QANATCHI HTTPS SQL Gateway (`scripts/postgres-http-gateway.mjs`)
 * - Neon Serverless PostgreSQL HTTP SQL endpoint
 * - Any PostgreSQL HTTPS SQL bridge accepting `{ query, params }` JSON requests
 *
 * Uses zero Node APIs, zero raw TCP sockets, and atomic PostgreSQL CTEs with ON CONFLICT
 * constraints so concurrent writes from multiple ArvanCloud Edge PoPs remain race-free.
 */
export class PostgresHttpStorageAdapter implements LeaderboardStorageAdapter {
  readonly isConfigured = true;
  readonly driverName: string;

  private readonly endpointUrl: string;
  private readonly authToken?: string;
  private readonly authMode: 'bearer' | 'neon-connection-string';
  private readonly timeoutMs: number;
  private readonly fetchImpl?: typeof fetch;

  constructor(options: PostgresHttpStorageOptions) {
    if (!options.endpointUrl || !options.endpointUrl.trim()) {
      throw new StorageNotConfiguredError('LEADERBOARD_DATABASE_URL is required for postgres-http storage.');
    }
    this.endpointUrl = options.endpointUrl.trim().replace(/\/+$/, '');
    this.authToken = options.authToken?.trim() || undefined;
    this.authMode = options.authMode ?? 'bearer';
    this.timeoutMs = options.timeoutMs ?? DEFAULT_STORAGE_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl;
    this.driverName = options.driverName ?? 'postgres-http';
  }

  private async executeSql(
    query: string,
    params: unknown[] = [],
  ): Promise<Array<Record<string, unknown>>> {
    const fetchFn = this.fetchImpl ?? (typeof fetch === 'function' ? fetch : null);
    if (!fetchFn) {
      throw new StorageUnavailableError('Global fetch API is unavailable in this runtime.');
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer =
      controller !== null
        ? globalThis.setTimeout(() => {
            controller.abort();
          }, this.timeoutMs)
        : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.authToken) {
      if (this.authMode === 'neon-connection-string') {
        headers['Neon-Connection-String'] = this.authToken;
      } else {
        headers.Authorization = `Bearer ${this.authToken}`;
      }
    }

    try {
      const targetUrl = this.endpointUrl.endsWith('/sql')
        ? this.endpointUrl
        : `${this.endpointUrl}/sql`;
      const response = await fetchFn(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, params }),
        signal: controller?.signal,
      });

      const rawText = await response.text();
      let parsed: SqlGatewayResponse | null = null;
      try {
        parsed = rawText ? (JSON.parse(rawText) as SqlGatewayResponse) : null;
      } catch {
        parsed = null;
      }

      if (!response.ok || !parsed || (!Array.isArray(parsed.rows) && typeof parsed.rowCount !== 'number')) {
        const rawCode =
          parsed && typeof (parsed as Record<string, unknown>).code === 'string'
            ? String((parsed as Record<string, unknown>).code).trim()
            : '';
        const safePgCode = /^[0-9A-Z]{5}$/.test(rawCode) ? rawCode : undefined;
        throw new StorageUnavailableError(
          `Durable storage gateway returned HTTP ${response.status}${safePgCode ? ` (${safePgCode})` : ''}.`,
        );
      }

      return Array.isArray(parsed.rows) ? parsed.rows : [];
    } catch (err) {
      if (err instanceof StorageUnavailableError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new StorageUnavailableError('Durable storage request timed out.');
      }
      throw new StorageUnavailableError('Failed to communicate with durable PostgreSQL HTTP gateway.');
    } finally {
      if (timer !== null) {
        globalThis.clearTimeout(timer);
      }
    }
  }

  async ping(): Promise<{ ok: true; latencyMs: number }> {
    const start = Date.now();
    await this.executeSql('SELECT 1 AS alive', []);
    return {
      ok: true,
      latencyMs: Math.max(0, Date.now() - start),
    };
  }

  async hasDuplicateSubmission(submissionFingerprint: string): Promise<boolean> {
    const rows = await this.executeSql(
      `SELECT 1 AS found FROM verified_submissions WHERE submission_fingerprint = $1 LIMIT 1`,
      [submissionFingerprint],
    );
    return rows.length > 0;
  }

  async saveVerifiedSubmission(
    input: SaveVerifiedSubmissionInput,
  ): Promise<SaveVerifiedSubmissionResult> {
    // Sequential PostgreSQL statements rather than a single multi-CTE statement:
    // In PostgreSQL MVCC, all CTEs in one WITH block share the pre-statement snapshot,
    // so a SELECT CTE (such as rank calculation) cannot see rows newly inserted by a
    // sibling INSERT/UPSERT CTE in the same statement. Executing committed statements
    // sequentially guarantees full read-your-writes consistency over Neon/PostgreSQL HTTP.

    // 1. Ensure player row exists before foreign-key inserts
    await this.executeSql(
      `
        INSERT INTO players (player_id_hash, display_label, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (player_id_hash) DO UPDATE
          SET display_label = EXCLUDED.display_label,
              updated_at = NOW();
      `,
      [input.playerIdHash, input.displayLabel],
    );

    // 2. Atomically insert submission; ON CONFLICT DO NOTHING deduplicates across
    // submission_fingerprint, idempotency_key, and nonce_id unique indexes.
    const insertedSubRows = await this.executeSql(
      `
        INSERT INTO verified_submissions (
          submission_id, submission_fingerprint, idempotency_key,
          player_id_hash, display_label, challenge_type, challenge_id,
          date_key, algo_version, scoring_version, score, stars,
          verified_moves, performance_tier, performance_label_fa,
          elapsed_ms_server, timing_verified, nonce_id, submitted_at
        )
        VALUES (
          $1, $2, $3,
          $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18, $19::TIMESTAMPTZ
        )
        ON CONFLICT DO NOTHING
        RETURNING submission_id;
      `,
      [
        input.submissionId, // $1
        input.submissionFingerprint, // $2
        input.idempotencyKey, // $3
        input.playerIdHash, // $4
        input.displayLabel, // $5
        input.challengeType, // $6
        input.challengeId, // $7
        input.dateKey, // $8
        input.algoVersion, // $9
        input.scoringVersion, // $10
        input.score, // $11
        input.stars, // $12
        input.verifiedMoves, // $13
        input.performanceTier, // $14
        input.performanceLabelFa, // $15
        input.elapsedMsServer, // $16
        input.timingVerified, // $17
        input.nonceId, // $18
        input.submittedAt, // $19
      ],
    );

    const duplicate = insertedSubRows.length === 0;
    let isNewBest = false;

    if (!duplicate) {
      // 3. Upsert leaderboard_best strictly when score/stars/moves improve (or first entry)
      const bestRows = await this.executeSql(
        `
          INSERT INTO leaderboard_best (
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, updated_at
          )
          VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11, $12, $13,
            $14::TIMESTAMPTZ, NOW()
          )
          ON CONFLICT (challenge_type, challenge_id, player_id_hash) DO UPDATE
            SET submission_id = EXCLUDED.submission_id,
                display_label = EXCLUDED.display_label,
                scoring_version = EXCLUDED.scoring_version,
                score = EXCLUDED.score,
                stars = EXCLUDED.stars,
                verified_moves = EXCLUDED.verified_moves,
                performance_tier = EXCLUDED.performance_tier,
                performance_label_fa = EXCLUDED.performance_label_fa,
                submitted_at = EXCLUDED.submitted_at,
                updated_at = NOW()
            WHERE (EXCLUDED.score > leaderboard_best.score)
               OR (EXCLUDED.score = leaderboard_best.score AND EXCLUDED.stars > leaderboard_best.stars)
               OR (EXCLUDED.score = leaderboard_best.score AND EXCLUDED.stars = leaderboard_best.stars AND EXCLUDED.verified_moves < leaderboard_best.verified_moves)
          RETURNING submission_id;
        `,
        [
          input.challengeType, // $1
          input.challengeId, // $2
          input.playerIdHash, // $3
          input.submissionId, // $4
          input.displayLabel, // $5
          input.dateKey, // $6
          input.algoVersion, // $7
          input.scoringVersion, // $8
          input.score, // $9
          input.stars, // $10
          input.verifiedMoves, // $11
          input.performanceTier, // $12
          input.performanceLabelFa, // $13
          input.submittedAt, // $14
        ],
      );
      isNewBest = bestRows.length > 0;

      // 4. Update aggregate player statistics after leaderboard_best has committed
      await this.executeSql(
        `
          UPDATE players
          SET verified_submissions = verified_submissions + 1,
              best_daily_score = CASE WHEN $2::TEXT = 'daily' THEN GREATEST(best_daily_score, $3::INTEGER) ELSE best_daily_score END,
              best_friend_score = CASE WHEN $2::TEXT = 'friend' THEN GREATEST(best_friend_score, $3::INTEGER) ELSE best_friend_score END,
              total_verified_score = COALESCE((
                SELECT SUM(score)
                FROM leaderboard_best
                WHERE player_id_hash = $1
              ), 0),
              updated_at = NOW()
          WHERE player_id_hash = $1;
        `,
        [input.playerIdHash, input.challengeType, input.score],
      );
    }

    // 5. Compute authoritative rank from committed leaderboard_best state
    let entry = await this.getPlayerBest({
      challengeType: input.challengeType,
      challengeId: input.challengeId,
      playerIdHash: input.playerIdHash,
    });

    if (!entry && duplicate) {
      // Self-heal if a prior partial failure inserted verified_submissions before leaderboard_best
      await this.executeSql(
        `
          INSERT INTO leaderboard_best (
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, updated_at
          )
          SELECT
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, NOW()
          FROM verified_submissions
          WHERE challenge_type = $1 AND challenge_id = $2 AND player_id_hash = $3
          ORDER BY score DESC, stars DESC, verified_moves ASC, submitted_at ASC
          LIMIT 1
          ON CONFLICT (challenge_type, challenge_id, player_id_hash) DO NOTHING;
        `,
        [input.challengeType, input.challengeId, input.playerIdHash],
      );
      entry = await this.getPlayerBest({
        challengeType: input.challengeType,
        challengeId: input.challengeId,
        playerIdHash: input.playerIdHash,
      });
    }

    if (!entry) {
      throw new StorageUnavailableError('PostgreSQL submission query returned no leaderboard entry.');
    }

    return {
      duplicate,
      isNewBest,
      entry,
    };
  }

  private async queryLeaderboardPage(
    challengeType: VerifiableChallengeType,
    challengeId: string,
    limit: number,
    offset: number,
  ): Promise<PaginatedLeaderboardResult> {
    const sql = `
      WITH ranked AS (
        SELECT
          ROW_NUMBER() OVER (
            ORDER BY score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC
          ) AS rank,
          submission_id, player_id_hash, display_label, challenge_type,
          challenge_id, date_key, score, stars, verified_moves,
          performance_tier, performance_label_fa, scoring_version, submitted_at
        FROM leaderboard_best
        WHERE challenge_type = $1 AND challenge_id = $2
      ),
      total_count AS (
        SELECT COUNT(*)::INTEGER AS total FROM ranked
      )
      SELECT tc.total, r.*
      FROM total_count tc
      LEFT JOIN ranked r ON TRUE
      ORDER BY r.rank ASC NULLS LAST
      LIMIT $3 OFFSET $4;
    `;

    const rows = await this.executeSql(sql, [challengeType, challengeId, limit, offset]);
    const total = rows.length > 0 ? toInt(rows[0].total, 0) : 0;
    const entries = rows
      .filter((r) => Boolean(r.submission_id))
      .map((r, idx) => mapLeaderboardRow(r, offset + idx + 1));

    return {
      total,
      limit,
      offset,
      hasMore: offset + entries.length < total,
      entries,
    };
  }

  async getDailyLeaderboard(params: {
    dateKey: string;
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    return this.queryLeaderboardPage('daily', params.challengeId, params.limit, params.offset);
  }

  async getFriendLeaderboard(params: {
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    return this.queryLeaderboardPage('friend', params.challengeId, params.limit, params.offset);
  }

  async getGlobalLeaderboard(params: {
    limit: number;
    offset: number;
    playerIdHash?: string | null;
  }): Promise<PaginatedGlobalLeaderboardResult & { playerEntry?: GlobalPlayerLeaderboardEntry | null }> {
    const sql = `
      WITH aggregated AS (
        SELECT
          p.player_id_hash,
          p.display_label,
          p.total_verified_score AS total_score,
          GREATEST(p.best_daily_score, p.best_friend_score) AS best_single_score,
          p.verified_submissions,
          COALESCE(COUNT(lb.challenge_id), 0)::INTEGER AS challenges_completed,
          COALESCE(MAX(lb.submitted_at), p.updated_at) AS last_submitted_at
        FROM players p
        INNER JOIN leaderboard_best lb ON lb.player_id_hash = p.player_id_hash
        GROUP BY p.player_id_hash, p.display_label, p.total_verified_score, p.best_daily_score, p.best_friend_score, p.verified_submissions, p.updated_at
      ),
      ranked AS (
        SELECT
          ROW_NUMBER() OVER (
            ORDER BY total_score DESC, best_single_score DESC, verified_submissions DESC, player_id_hash ASC
          ) AS rank,
          player_id_hash,
          display_label,
          total_score,
          best_single_score,
          verified_submissions,
          challenges_completed,
          last_submitted_at
        FROM aggregated
      ),
      total_count AS (
        SELECT COUNT(*)::INTEGER AS total FROM ranked
      )
      SELECT tc.total, r.*
      FROM total_count tc
      LEFT JOIN ranked r ON TRUE
      ORDER BY r.rank ASC NULLS LAST
      LIMIT $1 OFFSET $2;
    `;

    const rows = await this.executeSql(sql, [params.limit, params.offset]);
    const total = rows.length > 0 ? toInt(rows[0].total, 0) : 0;
    const entries: GlobalPlayerLeaderboardEntry[] = rows
      .filter((r) => Boolean(r.player_id_hash))
      .map((r, idx) => ({
        rank: toInt(r.rank, params.offset + idx + 1),
        playerIdHash: toStr(r.player_id_hash),
        displayLabel: toStr(r.display_label, 'مسافر قنات'),
        totalScore: toInt(r.total_score, 0),
        bestSingleScore: toInt(r.best_single_score, 0),
        verifiedSubmissions: toInt(r.verified_submissions, 0),
        challengesCompleted: toInt(r.challenges_completed, 0),
        lastSubmittedAt: toStr(r.last_submitted_at),
      }));

    let playerEntry: GlobalPlayerLeaderboardEntry | null | undefined;
    if (params.playerIdHash) {
      const playerRows = await this.executeSql(
        `
          WITH aggregated AS (
            SELECT
              p.player_id_hash,
              p.display_label,
              p.total_verified_score AS total_score,
              GREATEST(p.best_daily_score, p.best_friend_score) AS best_single_score,
              p.verified_submissions,
              COALESCE(COUNT(lb.challenge_id), 0)::INTEGER AS challenges_completed,
              COALESCE(MAX(lb.submitted_at), p.updated_at) AS last_submitted_at
            FROM players p
            INNER JOIN leaderboard_best lb ON lb.player_id_hash = p.player_id_hash
            GROUP BY p.player_id_hash, p.display_label, p.total_verified_score, p.best_daily_score, p.best_friend_score, p.verified_submissions, p.updated_at
          ),
          ranked AS (
            SELECT
              ROW_NUMBER() OVER (
                ORDER BY total_score DESC, best_single_score DESC, verified_submissions DESC, player_id_hash ASC
              ) AS rank,
              player_id_hash, display_label, total_score, best_single_score,
              verified_submissions, challenges_completed, last_submitted_at
            FROM aggregated
          )
          SELECT * FROM ranked WHERE player_id_hash = $1 LIMIT 1;
        `,
        [params.playerIdHash],
      );
      if (playerRows.length > 0) {
        const r = playerRows[0];
        playerEntry = {
          rank: toInt(r.rank, 1),
          playerIdHash: toStr(r.player_id_hash),
          displayLabel: toStr(r.display_label, 'مسافر قنات'),
          totalScore: toInt(r.total_score, 0),
          bestSingleScore: toInt(r.best_single_score, 0),
          verifiedSubmissions: toInt(r.verified_submissions, 0),
          challengesCompleted: toInt(r.challenges_completed, 0),
          lastSubmittedAt: toStr(r.last_submitted_at),
        };
      } else {
        playerEntry = null;
      }
    }

    return {
      total,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + entries.length < total,
      entries,
      ...(params.playerIdHash ? { playerEntry } : {}),
    };
  }

  async getPlayerBest(params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null> {
    const rows = await this.executeSql(
      `
        WITH ranked AS (
          SELECT
            ROW_NUMBER() OVER (
              ORDER BY score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC
            ) AS rank,
            submission_id, player_id_hash, display_label, challenge_type,
            challenge_id, date_key, score, stars, verified_moves,
            performance_tier, performance_label_fa, scoring_version, submitted_at
          FROM leaderboard_best
          WHERE challenge_type = $1 AND challenge_id = $2
        )
        SELECT * FROM ranked WHERE player_id_hash = $3 LIMIT 1;
      `,
      [params.challengeType, params.challengeId, params.playerIdHash],
    );
    if (rows.length === 0) return null;
    return mapLeaderboardRow(rows[0], 1);
  }

  async getPlayerProfile(playerIdHash: string): Promise<PlayerProfileSummary | null> {
    const profileRows = await this.executeSql(
      `SELECT player_id_hash, display_label, verified_submissions, best_daily_score, best_friend_score, total_verified_score, created_at, updated_at
       FROM players WHERE player_id_hash = $1 LIMIT 1`,
      [playerIdHash],
    );
    if (profileRows.length === 0) return null;

    const p = profileRows[0];
    const recentRows = await this.executeSql(
      `SELECT submission_id, player_id_hash, display_label, challenge_type, challenge_id, date_key,
              score, stars, verified_moves, performance_tier, performance_label_fa, scoring_version, submitted_at
       FROM verified_submissions
       WHERE player_id_hash = $1
       ORDER BY submitted_at DESC
       LIMIT 15`,
      [playerIdHash],
    );

    return {
      playerIdHash: toStr(p.player_id_hash),
      displayLabel: toStr(p.display_label, 'مسافر قنات'),
      verifiedSubmissions: toInt(p.verified_submissions, 0),
      bestDailyScore: toInt(p.best_daily_score, 0),
      bestFriendScore: toInt(p.best_friend_score, 0),
      totalVerifiedScore: toInt(p.total_verified_score, 0),
      createdAt: toStr(p.created_at),
      updatedAt: toStr(p.updated_at),
      recentSubmissions: recentRows.map((r, idx) => mapLeaderboardRow(r, idx + 1)),
    };
  }

  async upsertPlayerProfile(params: {
    playerIdHash: string;
    displayLabel: string;
    nowIso: string;
  }): Promise<PlayerProfileSummary> {
    await this.executeSql(
      `INSERT INTO players (player_id_hash, display_label, created_at, updated_at)
       VALUES ($1, $2, $3::TIMESTAMPTZ, $3::TIMESTAMPTZ)
       ON CONFLICT (player_id_hash) DO UPDATE
         SET display_label = EXCLUDED.display_label,
             updated_at = EXCLUDED.updated_at`,
      [params.playerIdHash, params.displayLabel, params.nowIso],
    );
    await this.executeSql(
      `UPDATE leaderboard_best SET display_label = $2, updated_at = NOW() WHERE player_id_hash = $1`,
      [params.playerIdHash, params.displayLabel],
    );
    const profile = await this.getPlayerProfile(params.playerIdHash);
    if (!profile) {
      throw new StorageUnavailableError('Failed to read back upserted player profile.');
    }
    return profile;
  }

  async saveAttemptNonce(input: SaveAttemptNonceInput): Promise<void> {
    await this.executeSql(
      `INSERT INTO challenge_nonces (
         nonce_id, challenge_type, challenge_id, player_id_hash,
         issued_at_ms, expires_at_ms, min_solve_ms
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (nonce_id) DO NOTHING`,
      [
        input.nonceId,
        input.challengeType,
        input.challengeId,
        input.playerIdHash,
        input.issuedAtMs,
        input.expiresAtMs,
        input.minSolveMs,
      ],
    );
  }

  async consumeAttemptNonce(params: {
    nonceId: string;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
    nowIso: string;
  }): Promise<{ consumed: boolean }> {
    const rows = await this.executeSql(
      `UPDATE challenge_nonces
       SET consumed_at = $5::TIMESTAMPTZ
       WHERE nonce_id = $1
         AND challenge_type = $2
         AND challenge_id = $3
         AND player_id_hash = $4
         AND consumed_at IS NULL
       RETURNING nonce_id`,
      [
        params.nonceId,
        params.challengeType,
        params.challengeId,
        params.playerIdHash,
        params.nowIso,
      ],
    );
    return { consumed: rows.length > 0 };
  }

  async saveFriendChallenge(input: SaveFriendChallengeInput): Promise<FriendChallengeMetadataRecord> {
    if (input.createdByHash) {
      await this.executeSql(
        `INSERT INTO players (player_id_hash, display_label)
         VALUES ($1, 'مسافر قنات')
         ON CONFLICT (player_id_hash) DO NOTHING`,
        [input.createdByHash],
      );
    }

    const rows = await this.executeSql(
      `INSERT INTO friend_challenges (
         challenge_id, algo_version, template_id, seed, difficulty,
         title_fa, created_by_hash, expires_at, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::TIMESTAMPTZ, $9::TIMESTAMPTZ)
       ON CONFLICT (challenge_id) DO UPDATE
         SET expires_at = COALESCE(friend_challenges.expires_at, EXCLUDED.expires_at)
       RETURNING challenge_id, algo_version, template_id, seed, difficulty, title_fa, created_by_hash, expires_at, created_at`,
      [
        input.challengeId,
        input.algoVersion,
        input.templateId,
        input.seed,
        input.difficulty,
        input.titleFa,
        input.createdByHash,
        input.expiresAt,
        input.createdAt,
      ],
    );

    const row = rows[0];
    const countRows = await this.executeSql(
      `SELECT COUNT(*)::INTEGER AS cnt FROM leaderboard_best WHERE challenge_type = 'friend' AND challenge_id = $1`,
      [input.challengeId],
    );

    return {
      challengeId: toStr(row.challenge_id, input.challengeId),
      algoVersion: toInt(row.algo_version, input.algoVersion),
      templateId: toStr(row.template_id, input.templateId),
      seed: toInt(row.seed, input.seed),
      difficulty: toStr(row.difficulty, input.difficulty) as FriendChallengeMetadataRecord['difficulty'],
      titleFa: toStr(row.title_fa, input.titleFa),
      rows: input.rows,
      cols: input.cols,
      expectedMinMoves: input.expectedMinMoves,
      parTimeSec: input.parTimeSec,
      createdByHash: row.created_by_hash ? toStr(row.created_by_hash) : null,
      expiresAt: row.expires_at ? toStr(row.expires_at) : null,
      createdAt: toStr(row.created_at, input.createdAt),
      participantCount: countRows.length > 0 ? toInt(countRows[0].cnt, 0) : 0,
    };
  }

  async getFriendChallenge(challengeId: string): Promise<FriendChallengeMetadataRecord | null> {
    const rows = await this.executeSql(
      `SELECT fc.challenge_id, fc.algo_version, fc.template_id, fc.seed, fc.difficulty,
              fc.title_fa, fc.created_by_hash, fc.expires_at, fc.created_at,
              (SELECT COUNT(*)::INTEGER FROM leaderboard_best lb WHERE lb.challenge_type = 'friend' AND lb.challenge_id = fc.challenge_id) AS participant_count
       FROM friend_challenges fc
       WHERE fc.challenge_id = $1
       LIMIT 1`,
      [challengeId],
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      challengeId: toStr(row.challenge_id),
      algoVersion: toInt(row.algo_version, 1),
      templateId: toStr(row.template_id),
      seed: toInt(row.seed, 0),
      difficulty: toStr(row.difficulty, 'normal') as FriendChallengeMetadataRecord['difficulty'],
      titleFa: toStr(row.title_fa),
      rows: 5,
      cols: 5,
      expectedMinMoves: 1,
      parTimeSec: 60,
      createdByHash: row.created_by_hash ? toStr(row.created_by_hash) : null,
      expiresAt: row.expires_at ? toStr(row.expires_at) : null,
      createdAt: toStr(row.created_at),
      participantCount: toInt(row.participant_count, 0),
    };
  }

  async checkRateLimit(params: {
    bucketKey: string;
    windowMs: number;
    maxRequests: number;
    nowMs: number;
  }): Promise<RateLimitCheckResult> {
    const sql = `
      INSERT INTO rate_limit_buckets (bucket_key, window_start_ms, request_count, updated_at)
      VALUES ($1, $2, 1, NOW())
      ON CONFLICT (bucket_key) DO UPDATE
        SET window_start_ms = CASE
              WHEN ($2 - rate_limit_buckets.window_start_ms) >= $3 THEN $2
              ELSE rate_limit_buckets.window_start_ms
            END,
            request_count = CASE
              WHEN ($2 - rate_limit_buckets.window_start_ms) >= $3 THEN 1
              ELSE rate_limit_buckets.request_count + 1
            END,
            updated_at = NOW()
      RETURNING window_start_ms, request_count;
    `;
    const rows = await this.executeSql(sql, [params.bucketKey, params.nowMs, params.windowMs]);
    if (rows.length === 0) {
      return { allowed: true, remaining: params.maxRequests - 1, retryAfterSec: 0 };
    }
    const windowStart = toInt(rows[0].window_start_ms, params.nowMs);
    const count = toInt(rows[0].request_count, 1);
    const allowed = count <= params.maxRequests;
    const remaining = Math.max(0, params.maxRequests - count);
    const retryAfterSec = allowed
      ? 0
      : Math.max(1, Math.ceil((windowStart + params.windowMs - params.nowMs) / 1000));
    return { allowed, remaining, retryAfterSec };
  }
}
