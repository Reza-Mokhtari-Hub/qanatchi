import type { DailyPerformanceTier } from '../../src/engine/types';
import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';
import type { PersistedLeaderboardEntry } from '../types';

export class StorageNotConfiguredError extends Error {
  readonly code = 'STORAGE_NOT_CONFIGURED' as const;
  constructor(
    message = 'Durable leaderboard storage is not provisioned or configured in this Edge deployment.',
  ) {
    super(message);
    this.name = 'StorageNotConfiguredError';
  }
}

export class StorageUnavailableError extends Error {
  readonly code = 'STORAGE_UNAVAILABLE' as const;
  constructor(message = 'Persistent leaderboard storage is temporarily unavailable.') {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

export interface SaveVerifiedSubmissionInput {
  submissionId: string;
  submissionFingerprint: string;
  playerIdHash: string;
  displayLabel: string;
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey: string | null;
  algoVersion: number;
  scoringVersion: number;
  score: number;
  stars: 1 | 2 | 3;
  verifiedMoves: number;
  performanceTier: DailyPerformanceTier;
  performanceLabelFa: string;
  submittedAt: string;
}

export interface SaveVerifiedSubmissionResult {
  duplicate: boolean;
  isNewBest: boolean;
  entry: PersistedLeaderboardEntry;
}

export interface PaginatedLeaderboardResult {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  entries: PersistedLeaderboardEntry[];
}

/**
 * Storage abstraction for persistent global leaderboards.
 *
 * Production deployments MUST plug in a verified durable external storage adapter
 * (accessible from ArvanCloud Edge via an officially supported protocol).
 * LocalStorage and Edge isolate memory MUST NOT be used as production storage.
 */
export interface LeaderboardStorageAdapter {
  readonly isConfigured: boolean;
  readonly driverName: string;

  saveVerifiedSubmission(
    input: SaveVerifiedSubmissionInput,
  ): Promise<SaveVerifiedSubmissionResult>;

  getDailyLeaderboard(params: {
    dateKey: string;
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult>;

  getFriendLeaderboard(params: {
    challengeId: string;
    limit: number;
    offset: number;
  }): Promise<PaginatedLeaderboardResult>;

  getPlayerBest(params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null>;

  hasDuplicateSubmission(submissionFingerprint: string): Promise<boolean>;
}
