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
  storageUrl?: string;
  storageToken?: string;
  signingSecret?: string;
  requireAttemptToken: boolean;
  rateLimitMaxPerMin: number;
  structuredLogsEnabled: boolean;
}

export interface ApiErrorBody {
  ok: false;
  apiVersion: string;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiHealthResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
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
    campaignPuzzleVersion: number;
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
    campaignVerification: boolean;
    globalLeaderboard: boolean;
    serverVerifiedTiming: boolean;
    onlineFriendChallenges: boolean;
    playerProfiles: boolean;
  };
}

export interface ApiReadyResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  ready: true;
  storage: {
    configured: true;
    driver: string;
    reachable: true;
    latencyMs: number;
  };
  serverTimeIso: string;
}

export interface ApiVersionResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  platform: 'arvancloud-edge';
  totalCampaignLevels: number;
  algorithms: {
    dailyPuzzleVersion: number;
    friendChallengeVersion: number;
    campaignPuzzleVersion: number;
    rankedScoringVersion: number;
    localScoringVersion: number;
  };
  supportedChallengeTypes: VerifiableChallengeType[];
}

export interface ApiDailyChallengeResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
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

export interface ApiAttemptStartResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  attempt: {
    attemptToken: string;
    nonceId: string;
    challengeType: VerifiableChallengeType;
    challengeId: string;
    issuedAtIso: string;
    expiresAtIso: string;
    minSolveTimeMs: number;
    persistedNonce: boolean;
  };
}

export interface ApiVerifyChallengeResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
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
    timingVerified: boolean;
    serverElapsedMs: number | null;
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

export interface GlobalPlayerLeaderboardEntry {
  rank: number;
  playerIdHash: string;
  displayLabel: string;
  totalScore: number;
  bestSingleScore: number;
  verifiedSubmissions: number;
  challengesCompleted: number;
  lastSubmittedAt: string;
}

export interface ApiLeaderboardListResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
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

export interface ApiGlobalLeaderboardResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  leaderboard: {
    scope: 'global';
    scoringVersion: number;
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    entries: GlobalPlayerLeaderboardEntry[];
    playerEntry?: GlobalPlayerLeaderboardEntry | null;
  };
}

export interface ApiLeaderboardSubmitResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  submission: {
    accepted: true;
    duplicate: boolean;
    isNewBest: boolean;
    timingVerified: boolean;
    serverElapsedMs: number | null;
    entry: PersistedLeaderboardEntry;
  };
}

export interface FriendChallengeMetadataRecord {
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
  participantCount: number;
}

export interface ApiFriendChallengeCreateResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  friendChallenge: FriendChallengeMetadataRecord;
}

export interface ApiFriendChallengeGetResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  friendChallenge: FriendChallengeMetadataRecord;
}

export interface PlayerProfileSummary {
  playerIdHash: string;
  displayLabel: string;
  verifiedSubmissions: number;
  bestDailyScore: number;
  bestFriendScore: number;
  totalVerifiedScore: number;
  createdAt: string;
  updatedAt: string;
  recentSubmissions: PersistedLeaderboardEntry[];
}

export interface ApiPlayerProfileResponse {
  ok: true;
  apiVersion: string;
  requestId: string;
  profile: PlayerProfileSummary;
}
