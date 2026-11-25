import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';
import type {
  FriendChallengeMetadataRecord,
  GlobalPlayerLeaderboardEntry,
  PersistedLeaderboardEntry,
  PlayerProfileSummary,
} from '../types';
import {
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

interface StoredRecord extends Omit<PersistedLeaderboardEntry, 'rank'> {
  algoVersion: number;
}

interface StoredPlayer {
  playerIdHash: string;
  displayLabel: string;
  verifiedSubmissions: number;
  bestDailyScore: number;
  bestFriendScore: number;
  totalVerifiedScore: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * TEST-ONLY in-memory storage adapter for automated unit & API integration tests.
 *
 * CRITICAL: Never import or wire this adapter into the production ArvanCloud Edge entry point
 * (`edge/worker.ts`). Ephemeral isolate memory is NOT durable production storage.
 */
export class InMemoryTestStorageAdapter implements LeaderboardStorageAdapter {
  readonly isConfigured = true;
  readonly driverName = 'in-memory-test-only';

  private readonly bestByChallengeAndPlayer = new Map<string, StoredRecord>();
  private readonly submissions: StoredRecord[] = [];
  private readonly fingerprints = new Set<string>();
  private readonly idempotencyKeys = new Map<string, { challengeType: VerifiableChallengeType; challengeId: string; playerIdHash: string }>();
  private readonly players = new Map<string, StoredPlayer>();
  private readonly nonces = new Map<string, SaveAttemptNonceInput & { consumedAt: string | null }>();
  private readonly friendChallenges = new Map<string, FriendChallengeMetadataRecord>();
  private readonly rateLimits = new Map<string, { windowStartMs: number; count: number }>();
  private simulateFailure = false;

  setSimulateFailure(fail: boolean): void {
    this.simulateFailure = fail;
  }

  private assertHealthy(): void {
    if (this.simulateFailure) {
      throw new StorageUnavailableError('Simulated storage failure for automated testing.');
    }
  }

  async ping(): Promise<{ ok: true; latencyMs: number }> {
    this.assertHealthy();
    return { ok: true, latencyMs: 1 };
  }

  private static compareEntries(a: StoredRecord, b: StoredRecord): number {
    if (b.score !== a.score) return b.score - a.score;
    if (a.verifiedMoves !== b.verifiedMoves) return a.verifiedMoves - b.verifiedMoves;
    if (a.submittedAt !== b.submittedAt) return a.submittedAt.localeCompare(b.submittedAt);
    return a.submissionId.localeCompare(b.submissionId);
  }

  private static isBetter(candidate: StoredRecord, existing: StoredRecord): boolean {
    if (candidate.score !== existing.score) return candidate.score > existing.score;
    if (candidate.stars !== existing.stars) return candidate.stars > existing.stars;
    if (candidate.verifiedMoves !== existing.verifiedMoves) {
      return candidate.verifiedMoves < existing.verifiedMoves;
    }
    return false;
  }

  private listSortedForChallenge(
    challengeType: VerifiableChallengeType,
    challengeId: string,
  ): PersistedLeaderboardEntry[] {
    const matched: StoredRecord[] = [];
    for (const rec of this.bestByChallengeAndPlayer.values()) {
      if (rec.challengeType === challengeType && rec.challengeId === challengeId) {
        matched.push(rec);
      }
    }
    matched.sort(InMemoryTestStorageAdapter.compareEntries);
    return matched.map((rec, idx) => ({
      rank: idx + 1,
      submissionId: rec.submissionId,
      playerIdHash: rec.playerIdHash,
      displayLabel: rec.displayLabel,
      challengeType: rec.challengeType,
      challengeId: rec.challengeId,
      dateKey: rec.dateKey,
      score: rec.score,
      stars: rec.stars,
      verifiedMoves: rec.verifiedMoves,
      performanceTier: rec.performanceTier,
      performanceLabelFa: rec.performanceLabelFa,
      scoringVersion: rec.scoringVersion,
      submittedAt: rec.submittedAt,
    }));
  }

  async hasDuplicateSubmission(submissionFingerprint: string): Promise<boolean> {
    this.assertHealthy();
    return this.fingerprints.has(submissionFingerprint);
  }

  async saveVerifiedSubmission(
    input: SaveVerifiedSubmissionInput,
  ): Promise<SaveVerifiedSubmissionResult> {
    this.assertHealthy();

    const compositeKey = `${input.challengeType}:${input.challengeId}:${input.playerIdHash}`;
    const existing = this.bestByChallengeAndPlayer.get(compositeKey);
    const existingByIdem = input.idempotencyKey ? this.idempotencyKeys.get(input.idempotencyKey) : undefined;

    if ((this.fingerprints.has(input.submissionFingerprint) || existingByIdem) && existing) {
      const ranked = this.listSortedForChallenge(input.challengeType, input.challengeId);
      const found = ranked.find((r) => r.playerIdHash === input.playerIdHash)!;
      return {
        duplicate: true,
        isNewBest: false,
        entry: found,
      };
    }

    this.fingerprints.add(input.submissionFingerprint);
    if (input.idempotencyKey) {
      this.idempotencyKeys.set(input.idempotencyKey, {
        challengeType: input.challengeType,
        challengeId: input.challengeId,
        playerIdHash: input.playerIdHash,
      });
    }

    const candidate: StoredRecord = {
      submissionId: input.submissionId,
      playerIdHash: input.playerIdHash,
      displayLabel: input.displayLabel,
      challengeType: input.challengeType,
      challengeId: input.challengeId,
      dateKey: input.dateKey,
      algoVersion: input.algoVersion,
      scoringVersion: input.scoringVersion,
      score: input.score,
      stars: input.stars,
      verifiedMoves: input.verifiedMoves,
      performanceTier: input.performanceTier,
      performanceLabelFa: input.performanceLabelFa,
      submittedAt: input.submittedAt,
    };

    this.submissions.push(candidate);

    let isNewBest = false;
    if (!existing || InMemoryTestStorageAdapter.isBetter(candidate, existing)) {
      this.bestByChallengeAndPlayer.set(compositeKey, candidate);
      isNewBest = true;
    }

    const existingPlayer = this.players.get(input.playerIdHash);
    let totalVerifiedScore = 0;
    for (const rec of this.bestByChallengeAndPlayer.values()) {
      if (rec.playerIdHash === input.playerIdHash) {
        totalVerifiedScore += rec.score;
      }
    }

    this.players.set(input.playerIdHash, {
      playerIdHash: input.playerIdHash,
      displayLabel: input.displayLabel,
      verifiedSubmissions: (existingPlayer?.verifiedSubmissions ?? 0) + 1,
      bestDailyScore:
        input.challengeType === 'daily'
          ? Math.max(existingPlayer?.bestDailyScore ?? 0, input.score)
          : (existingPlayer?.bestDailyScore ?? 0),
      bestFriendScore:
        input.challengeType === 'friend'
          ? Math.max(existingPlayer?.bestFriendScore ?? 0, input.score)
          : (existingPlayer?.bestFriendScore ?? 0),
      totalVerifiedScore,
      createdAt: existingPlayer?.createdAt ?? input.submittedAt,
      updatedAt: input.submittedAt,
    });

    const ranked = this.listSortedForChallenge(input.challengeType, input.challengeId);
    const entry = ranked.find((r) => r.playerIdHash === input.playerIdHash)!;

    return {
      duplicate: false,
      isNewBest,
      entry,
    };
  }

  async getDailyLeaderboard(params: {
    dateKey: string;
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    this.assertHealthy();
    const all = this.listSortedForChallenge('daily', params.challengeId);
    const entries = all.slice(params.offset, params.offset + params.limit);
    return {
      total: all.length,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + entries.length < all.length,
      entries,
    };
  }

  async getFriendLeaderboard(params: {
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    this.assertHealthy();
    const all = this.listSortedForChallenge('friend', params.challengeId);
    const entries = all.slice(params.offset, params.offset + params.limit);
    return {
      total: all.length,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + entries.length < all.length,
      entries,
    };
  }

  async getGlobalLeaderboard(params: {
    limit: number;
    offset: number;
    playerIdHash?: string | null;
  }): Promise<PaginatedGlobalLeaderboardResult & { playerEntry?: GlobalPlayerLeaderboardEntry | null }> {
    this.assertHealthy();
    const all: GlobalPlayerLeaderboardEntry[] = [];

    for (const p of this.players.values()) {
      const playerBests = [...this.bestByChallengeAndPlayer.values()].filter(
        (b) => b.playerIdHash === p.playerIdHash,
      );
      if (playerBests.length === 0) continue;
      const lastSubmittedAt = playerBests.reduce(
        (latest, rec) => (rec.submittedAt > latest ? rec.submittedAt : latest),
        p.updatedAt,
      );
      all.push({
        rank: 0,
        playerIdHash: p.playerIdHash,
        displayLabel: p.displayLabel,
        totalScore: p.totalVerifiedScore,
        bestSingleScore: Math.max(p.bestDailyScore, p.bestFriendScore),
        verifiedSubmissions: p.verifiedSubmissions,
        challengesCompleted: playerBests.length,
        lastSubmittedAt,
      });
    }

    all.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.bestSingleScore !== a.bestSingleScore) return b.bestSingleScore - a.bestSingleScore;
      if (b.verifiedSubmissions !== a.verifiedSubmissions) {
        return b.verifiedSubmissions - a.verifiedSubmissions;
      }
      return a.playerIdHash.localeCompare(b.playerIdHash);
    });

    const ranked = all.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    const entries = ranked.slice(params.offset, params.offset + params.limit);
    const playerEntry = params.playerIdHash
      ? (ranked.find((e) => e.playerIdHash === params.playerIdHash) ?? null)
      : undefined;

    return {
      total: ranked.length,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + entries.length < ranked.length,
      entries,
      ...(params.playerIdHash ? { playerEntry } : {}),
    };
  }

  async getPlayerBest(params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null> {
    this.assertHealthy();
    const all = this.listSortedForChallenge(params.challengeType, params.challengeId);
    return all.find((r) => r.playerIdHash === params.playerIdHash) ?? null;
  }

  async getPlayerProfile(playerIdHash: string): Promise<PlayerProfileSummary | null> {
    this.assertHealthy();
    const p = this.players.get(playerIdHash);
    if (!p) return null;
    const recentSubmissions = this.submissions
      .filter((s) => s.playerIdHash === playerIdHash)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
      .slice(0, 15)
      .map((rec, idx) => ({
        rank: idx + 1,
        submissionId: rec.submissionId,
        playerIdHash: rec.playerIdHash,
        displayLabel: rec.displayLabel,
        challengeType: rec.challengeType,
        challengeId: rec.challengeId,
        dateKey: rec.dateKey,
        score: rec.score,
        stars: rec.stars,
        verifiedMoves: rec.verifiedMoves,
        performanceTier: rec.performanceTier,
        performanceLabelFa: rec.performanceLabelFa,
        scoringVersion: rec.scoringVersion,
        submittedAt: rec.submittedAt,
      }));

    return {
      ...p,
      recentSubmissions,
    };
  }

  async upsertPlayerProfile(params: {
    playerIdHash: string;
    displayLabel: string;
    nowIso: string;
  }): Promise<PlayerProfileSummary> {
    this.assertHealthy();
    const existing = this.players.get(params.playerIdHash);
    const next: StoredPlayer = existing
      ? { ...existing, displayLabel: params.displayLabel, updatedAt: params.nowIso }
      : {
          playerIdHash: params.playerIdHash,
          displayLabel: params.displayLabel,
          verifiedSubmissions: 0,
          bestDailyScore: 0,
          bestFriendScore: 0,
          totalVerifiedScore: 0,
          createdAt: params.nowIso,
          updatedAt: params.nowIso,
        };
    this.players.set(params.playerIdHash, next);

    for (const [key, rec] of this.bestByChallengeAndPlayer.entries()) {
      if (rec.playerIdHash === params.playerIdHash) {
        this.bestByChallengeAndPlayer.set(key, { ...rec, displayLabel: params.displayLabel });
      }
    }

    return (await this.getPlayerProfile(params.playerIdHash))!;
  }

  async saveAttemptNonce(input: SaveAttemptNonceInput): Promise<void> {
    this.assertHealthy();
    if (!this.nonces.has(input.nonceId)) {
      this.nonces.set(input.nonceId, { ...input, consumedAt: null });
    }
  }

  async consumeAttemptNonce(params: {
    nonceId: string;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
    nowIso: string;
  }): Promise<{ consumed: boolean }> {
    this.assertHealthy();
    const rec = this.nonces.get(params.nonceId);
    if (!rec) return { consumed: false };
    if (
      rec.consumedAt !== null ||
      rec.challengeType !== params.challengeType ||
      rec.challengeId !== params.challengeId ||
      rec.playerIdHash !== params.playerIdHash
    ) {
      return { consumed: false };
    }
    rec.consumedAt = params.nowIso;
    return { consumed: true };
  }

  async saveFriendChallenge(input: SaveFriendChallengeInput): Promise<FriendChallengeMetadataRecord> {
    this.assertHealthy();
    const existing = this.friendChallenges.get(input.challengeId);
    const participants = this.listSortedForChallenge('friend', input.challengeId).length;
    if (existing) {
      const updated = { ...existing, participantCount: participants };
      this.friendChallenges.set(input.challengeId, updated);
      return updated;
    }
    const created: FriendChallengeMetadataRecord = {
      ...input,
      participantCount: participants,
    };
    this.friendChallenges.set(input.challengeId, created);
    return created;
  }

  async getFriendChallenge(challengeId: string): Promise<FriendChallengeMetadataRecord | null> {
    this.assertHealthy();
    const found = this.friendChallenges.get(challengeId);
    if (!found) return null;
    return {
      ...found,
      participantCount: this.listSortedForChallenge('friend', challengeId).length,
    };
  }

  async checkRateLimit(params: {
    bucketKey: string;
    windowMs: number;
    maxRequests: number;
    nowMs: number;
  }): Promise<RateLimitCheckResult> {
    this.assertHealthy();
    const existing = this.rateLimits.get(params.bucketKey);
    if (!existing || params.nowMs - existing.windowStartMs >= params.windowMs) {
      this.rateLimits.set(params.bucketKey, { windowStartMs: params.nowMs, count: 1 });
      return { allowed: true, remaining: params.maxRequests - 1, retryAfterSec: 0 };
    }
    existing.count += 1;
    const allowed = existing.count <= params.maxRequests;
    const remaining = Math.max(0, params.maxRequests - existing.count);
    const retryAfterSec = allowed
      ? 0
      : Math.max(1, Math.ceil((existing.windowStartMs + params.windowMs - params.nowMs) / 1000));
    return { allowed, remaining, retryAfterSec };
  }
}
