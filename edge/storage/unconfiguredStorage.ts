import {
  StorageNotConfiguredError,
  type LeaderboardStorageAdapter,
  type PaginatedLeaderboardResult,
  type SaveVerifiedSubmissionInput,
  type SaveVerifiedSubmissionResult,
} from './types';
import type { PersistedLeaderboardEntry } from '../types';
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
}
