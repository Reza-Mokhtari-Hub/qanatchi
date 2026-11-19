import type { DailyPerformanceTier, Difficulty } from '../src/engine/types';
import type { RankedScoreResult } from '../src/engagement/rankedScoring';
import type { VerifiableChallengeType } from '../src/engagement/solutionReplay';

export const API_VERSION = 'v1';

export type StorageConfigurationStatus = 'configured' | 'not_configured';

export interface EdgeRuntimeConfig {
  appEnv: string;
  ecUrlPresent: boolean;
  allowedOrigins: string[];
  storageConfigured: boolean;
  storageDriver: string;
}

export interface ApiErrorBody {
  ok: false;
  apiVersion: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiHealthResponse {
  ok: true;
  apiVersion: string;
  status: 'ok';
  runtime: {
    platform: 'arvancloud-edge';
    environment: string;
    ecUrlConfigured: boolean;
  };
  serverDateTehran: string;
  serverTimeIso: string;
  algorithms: {
    dailyPuzzleVersion: number;
    friendChallengeVersion: number;
    rankedScoringVersion: number;
    localScoringVersion: number;
  };
  storage: {
    configured: boolean;
    status: StorageConfigurationStatus;
    driver: string;
  };
  features: {
    dailyMetadata: boolean;
    serverVerification: boolean;
    globalLeaderboard: boolean;
    serverVerifiedTiming: boolean;
  };
}

export interface ApiDailyChallengeResponse {
  ok: true;
  apiVersion: string;
  daily: {
    challengeId: string;
    dateKey: string;
    persianDateFa: string;
    algoVersion: number;
    templateId: string;
    seed: number;
    titleFa: string;
    introFa: string;
    difficulty: Difficulty;
    rows: number;
    cols: number;
    expectedMinMoves: number;
    parTimeSec: number;
  };
}

export interface ApiVerifyChallengeResponse {
  ok: true;
  apiVersion: string;
  verification: {
    verified: true;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    dateKey: string | null;
    algoVersion: number;
    scoringVersion: number;
    templateId: string;
    difficulty: Difficulty;
    rows: number;
    cols: number;
    verifiedMoves: number;
    trustedExpectedMinMoves: number;
    rankedScore: RankedScoreResult;
    timingVerified: false;
  };
}

export interface PersistedLeaderboardEntry {
  rank: number;
  submissionId: string;
  playerIdHash: string;
  displayLabel: string;
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey: string | null;
  score: number;
  stars: 1 | 2 | 3;
  verifiedMoves: number;
  performanceTier: DailyPerformanceTier;
  performanceLabelFa: string;
  scoringVersion: number;
  submittedAt: string;
}

export interface ApiLeaderboardListResponse {
  ok: true;
  apiVersion: string;
  leaderboard: {
    challengeType: VerifiableChallengeType;
    challengeId: string;
    dateKey: string | null;
    scoringVersion: number;
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    entries: PersistedLeaderboardEntry[];
    playerBest?: PersistedLeaderboardEntry | null;
  };
}

export interface ApiLeaderboardSubmitResponse {
  ok: true;
  apiVersion: string;
  submission: {
    accepted: true;
    duplicate: boolean;
    isNewBest: boolean;
    entry: PersistedLeaderboardEntry;
  };
}
