import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';
import type { PersistedLeaderboardEntry } from '../types';
import {
  StorageUnavailableError,
  type LeaderboardStorageAdapter,
  type PaginatedLeaderboardResult,
  type SaveVerifiedSubmissionInput,
  type SaveVerifiedSubmissionResult,
} from './types';

interface StoredRecord extends Omit<PersistedLeaderboardEntry, 'rank'> {
  algoVersion: number;
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
  private readonly fingerprints = new Set<string>();
  private simulateFailure = false;

  setSimulateFailure(fail: boolean): void {
    this.simulateFailure = fail;
  }

  private assertHealthy(): void {
    if (this.simulateFailure) {
      throw new StorageUnavailableError('Simulated storage failure for automated testing.');
    }
  }

  private static compareEntries(a: StoredRecord, b: StoredRecord): number {
    // Deterministic ordering: higher score -> fewer verified moves -> earlier timestamp -> submissionId
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

    if (this.fingerprints.has(input.submissionFingerprint) && existing) {
      const ranked = this.listSortedForChallenge(input.challengeType, input.challengeId);
      const found = ranked.find((r) => r.playerIdHash === input.playerIdHash)!;
      return {
        duplicate: true,
        isNewBest: false,
        entry: found,
      };
    }

    this.fingerprints.add(input.submissionFingerprint);

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

    let isNewBest = false;
    if (!existing || InMemoryTestStorageAdapter.isBetter(candidate, existing)) {
      this.bestByChallengeAndPlayer.set(compositeKey, candidate);
      isNewBest = true;
    }

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

  async getPlayerBest(params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null> {
    this.assertHealthy();
    const all = this.listSortedForChallenge(params.challengeType, params.challengeId);
    return all.find((r) => r.playerIdHash === params.playerIdHash) ?? null;
  }
}
