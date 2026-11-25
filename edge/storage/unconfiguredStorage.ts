import {
  StorageNotConfiguredError,
  type LeaderboardStorageAdapter,
  type PaginatedGlobalLeaderboardResult,
  type PaginatedLeaderboardResult,
  type RateLimitCheckResult,
  type SaveAttemptNonceInput,
  type SaveFriendChallengeInput,
  type SaveVerifiedSubmissionInput,
  type SaveVerifiedSubmissionResult,
} from './types';
import type {
  FriendChallengeMetadataRecord,
  GlobalPlayerLeaderboardEntry,
  PersistedLeaderboardEntry,
  PlayerProfileSummary,
} from '../types';
import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';

/**
 * Production default storage adapter when durable external storage has not yet been
 * provisioned or verified for ArvanCloud Edge connectivity.
 *
 * Never fabricates records or silently falls back to ephemeral Edge process memory.
 */
export class UnconfiguredStorageAdapter implements LeaderboardStorageAdapter {
  readonly isConfigured = false;
  readonly driverName = 'unconfigured';

  async ping(): Promise<{ ok: true; latencyMs: number }> {
    throw new StorageNotConfiguredError();
  }

  async saveVerifiedSubmission(
    _input: SaveVerifiedSubmissionInput,
  ): Promise<SaveVerifiedSubmissionResult> {
    throw new StorageNotConfiguredError();
  }

  async getDailyLeaderboard(_params: {
    dateKey: string;
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    throw new StorageNotConfiguredError();
  }

  async getFriendLeaderboard(_params: {
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult> {
    throw new StorageNotConfiguredError();
  }

  async getGlobalLeaderboard(_params: {
    limit: number;
    offset: number;
    playerIdHash?: string | null;
  }): Promise<PaginatedGlobalLeaderboardResult & { playerEntry?: GlobalPlayerLeaderboardEntry | null }> {
    throw new StorageNotConfiguredError();
  }

  async getPlayerBest(_params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null> {
    throw new StorageNotConfiguredError();
  }

  async hasDuplicateSubmission(_submissionFingerprint: string): Promise<boolean> {
    throw new StorageNotConfiguredError();
  }

  async getPlayerProfile(_playerIdHash: string): Promise<PlayerProfileSummary | null> {
    throw new StorageNotConfiguredError();
  }

  async upsertPlayerProfile(_params: {
    playerIdHash: string;
    displayLabel: string;
    nowIso: string;
  }): Promise<PlayerProfileSummary> {
    throw new StorageNotConfiguredError();
  }

  async saveAttemptNonce(_input: SaveAttemptNonceInput): Promise<void> {
    throw new StorageNotConfiguredError();
  }

  async consumeAttemptNonce(_params: {
    nonceId: string;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
    nowIso: string;
  }): Promise<{ consumed: boolean }> {
    throw new StorageNotConfiguredError();
  }

  async saveFriendChallenge(_input: SaveFriendChallengeInput): Promise<FriendChallengeMetadataRecord> {
    throw new StorageNotConfiguredError();
  }

  async getFriendChallenge(_challengeId: string): Promise<FriendChallengeMetadataRecord | null> {
    throw new StorageNotConfiguredError();
  }

  async checkRateLimit(_params: {
    bucketKey: string;
    windowMs: number;
    maxRequests: number;
    nowMs: number;
  }): Promise<RateLimitCheckResult> {
    throw new StorageNotConfiguredError();
  }
}
