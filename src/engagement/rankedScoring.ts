import type { DailyPerformanceTier, Difficulty } from '../engine/types';
import { PERFORMANCE_LABELS_FA } from './dailyScoring';

/**
 * Explicit version identifier for server-verified ranked scoring.
 *
 * Why v2 is separate from Local Scoring v1 (`dailyScoring.ts`):
 * 1. Client-controlled timers cannot be trusted without a server-issued cryptographic
 *    attempt token backed by durable single-use nonce storage. Because durable Edge
 *    storage and Web Crypto availability are not yet confirmed/provisioned in Phase 4,
 *    Ranked Scoring v2 intentionally excludes client-reported elapsed time, client-reported
 *    hints, and client-reported restarts, scoring strictly from server-replayed tile actions.
 * 2. Monotonicity clarity: any integer score with a finite floor eventually hits a plateau
 *    at extreme move counts. Ranked Scoring v2 is strictly decreasing for every extra move
 *    in the practical efficiency window `extraMoves ∈ [0..24]` and non-increasing (weakly
 *    monotonic) with an explicit floor thereafter. Tied scores are resolved deterministically
 *    by `(score DESC, verifiedMoves ASC, submittedAt ASC, submissionId ASC)`.
 */
export const RANKED_SCORING_ALGO_VERSION = 2;

export interface RankedScoreInput {
  verifiedSolved: boolean;
  verifiedMoves: number;
  trustedExpectedMinMoves: number;
  difficulty: Difficulty;
}

export interface RankedScoreResult {
  scoringVersion: number;
  verifiedSolved: boolean;
  score: number;
  stars: 0 | 1 | 2 | 3;
  verifiedMoves: number;
  trustedExpectedMinMoves: number;
  extraMoves: number;
  performanceTier: DailyPerformanceTier | null;
  performanceLabelFa: string;
}

const DIFFICULTY_BASE_BONUS: Record<Difficulty, number> = {
  easy: 100,
  normal: 200,
  medium: 300,
  challenging: 400,
  hard: 500,
  expert: 650,
};

/**
 * Server-authoritative deterministic scoring computed exclusively from replayed actions
 * and the server-reconstructed puzzle definition.
 *
 * Formula (Ranked Scoring v2):
 * - Unsolved / invalid / leaking solution -> score = 0, stars = 0, tier = null.
 * - Base score: 1200 + difficultyBaseBonus
 * - Move efficiency bonus:
 *     extraMoves = max(0, verifiedMoves - trustedExpectedMinMoves)
 *     For extraMoves in [0..24]: strictly decreasing by 40 points per extra move
 *       (1000 down to 40).
 *     For extraMoves >= 25: floor bonus = 0 (weakly monotonic plateau; tie-broken by
 *       `verifiedMoves ASC` on leaderboards).
 * - Stars (derived solely from server-verified move ratio):
 *     - 3 stars: verifiedMoves <= trustedExpectedMinMoves + 2
 *     - 2 stars: verifiedMoves <= ceil(trustedExpectedMinMoves * 1.55) + 3
 *     - 1 star: any other valid leak-free solution
 * - Star bonus: stars * 150
 */
export function calculateRankedScore(input: RankedScoreInput): RankedScoreResult {
  const verifiedMoves = Math.max(0, Math.round(input.verifiedMoves));
  const trustedExpectedMinMoves = Math.max(1, Math.round(input.trustedExpectedMinMoves));
  const extraMoves = Math.max(0, verifiedMoves - trustedExpectedMinMoves);

  if (!input.verifiedSolved) {
    return {
      scoringVersion: RANKED_SCORING_ALGO_VERSION,
      verifiedSolved: false,
      score: 0,
      stars: 0,
      verifiedMoves,
      trustedExpectedMinMoves,
      extraMoves,
      performanceTier: null,
      performanceLabelFa: 'نامعتبر',
    };
  }

  const threeStarLimit = trustedExpectedMinMoves + 2;
  const twoStarLimit = Math.ceil(trustedExpectedMinMoves * 1.55) + 3;

  let stars: 1 | 2 | 3 = 1;
  if (verifiedMoves <= threeStarLimit) {
    stars = 3;
  } else if (verifiedMoves <= twoStarLimit) {
    stars = 2;
  }

  const baseScore = 1200 + (DIFFICULTY_BASE_BONUS[input.difficulty] ?? 200);
  const moveEfficiencyBonus = Math.max(0, 1000 - extraMoves * 40);
  const starBonus = stars * 150;
  const score = Math.max(300, baseScore + moveEfficiencyBonus + starBonus);

  let performanceTier: DailyPerformanceTier;
  if (stars === 3 && extraMoves === 0) {
    performanceTier = 'master';
  } else if (stars === 3) {
    performanceTier = 'engineer';
  } else if (stars === 2) {
    performanceTier = 'guardian';
  } else {
    performanceTier = 'striver';
  }

  return {
    scoringVersion: RANKED_SCORING_ALGO_VERSION,
    verifiedSolved: true,
    score,
    stars,
    verifiedMoves,
    trustedExpectedMinMoves,
    extraMoves,
    performanceTier,
    performanceLabelFa: PERFORMANCE_LABELS_FA[performanceTier],
  };
}
