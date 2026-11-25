import type { DailyPerformanceTier, Difficulty } from '../../src/engine/types';
import type { VerifiableChallengeType } from '../../src/engagement/solutionReplay';
import type {
  FriendChallengeMetadataRecord,
  GlobalPlayerLeaderboardEntry,
  PersistedLeaderboardEntry,
  PlayerProfileSummary,
} from '../types';

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

export class NonceAlreadyUsedError extends Error {
  readonly code = 'NONCE_ALREADY_USED' as const;
  constructor(message = 'This attempt token has already been consumed.') {
    super(message);
    this.name = 'NonceAlreadyUsedError';
  }
}

export interface SaveVerifiedSubmissionInput {
  submissionId: string;
  submissionFingerprint: string;
  idempotencyKey: string | null;
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
  elapsedMsServer: number | null;
  timingVerified: boolean;
  nonceId: string | null;
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

export interface PaginatedGlobalLeaderboardResult {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  entries: GlobalPlayerLeaderboardEntry[];
}

export interface SaveAttemptNonceInput {
  nonceId: string;
  challengeType: VerifiableChallengeType;
  challengeId: string;
  playerIdHash: string;
  issuedAtMs: number;
  expiresAtMs: number;
  minSolveMs: number;
}

export interface SaveFriendChallengeInput {
  challengeId: string;
  algoVersion: number;
  templateId: string;
  seed: number;
  difficulty: Difficulty;
  titleFa: string;
  rows: number;
  cols: number;
  expectedMinMoves: number;
  parTimeSec: number;
  createdByHash: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * Storage abstraction for persistent global leaderboards, player profiles,
 * single-use anti-replay nonces, friend challenge metadata, and distributed rate limits.
 *
 * Production deployments MUST plug in a verified durable external storage adapter
 * (accessible from ArvanCloud Edge via an officially supported HTTPS protocol).
 * LocalStorage and Edge isolate memory MUST NOT be used as production storage.
 */
export interface LeaderboardStorageAdapter {
  readonly isConfigured: boolean;
  readonly driverName: string;

  ping(): Promise<{ ok: true; latencyMs: number }>;

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

  getGlobalLeaderboard(params: {
    limit: number;
    offset: number;
    playerIdHash?: string | null;
  }): Promise<PaginatedGlobalLeaderboardResult & { playerEntry?: GlobalPlayerLeaderboardEntry | null }>;

  getPlayerBest(params: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
  }): Promise<PersistedLeaderboardEntry | null>;

  hasDuplicateSubmission(submissionFingerprint: string): Promise<boolean>;

  getPlayerProfile(playerIdHash: string): Promise<PlayerProfileSummary | null>;

  upsertPlayerProfile(params: {
    playerIdHash: string;
    displayLabel: string;
    nowIso: string;
  }): Promise<PlayerProfileSummary>;

  saveAttemptNonce(input: SaveAttemptNonceInput): Promise<void>;

  consumeAttemptNonce(params: {
    nonceId: string;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    playerIdHash: string;
    nowIso: string;
  }): Promise<{ consumed: boolean }>;

  saveFriendChallenge(input: SaveFriendChallengeInput): Promise<FriendChallengeMetadataRecord>;

  getFriendChallenge(challengeId: string): Promise<FriendChallengeMetadataRecord | null>;

  checkRateLimit(params: {
    bucketKey: string;
    windowMs: number;
    maxRequests: number;
    nowMs: number;
  }): Promise<RateLimitCheckResult>;
}
