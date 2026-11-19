import type {
  DailyChallengeRecord,
  DailyPerformanceTier,
  DailyScoreResult,
  FriendChallengeRecord,
} from '../engine/types';

export interface DailyScoreInput {
  completed: boolean;
  rotations: number;
  expectedMinMoves: number;
  elapsedSeconds: number;
  parTimeSec: number;
  hintsUsed: number;
  restarts: number;
}

export const PERFORMANCE_LABELS_FA: Record<DailyPerformanceTier, string> = {
  master: 'استاد قنات',
  engineer: 'مهندس آب',
  guardian: 'نگهبان چشمه',
  striver: 'تلاشگر کویر',
};

export const LOCAL_SCORING_ALGO_VERSION = 1;

/**
 * Transparent, deterministic, non-increasing (weakly monotonic) local scoring formula
 * for offline Daily & Friend Challenge personal records (Local Scoring v1).
 *
 * Audit note (Phase 4):
 * - Because moveBonus, timeBonus, and final score use explicit lower clamps (`Math.max(0, ...)`
 *   and `Math.max(150, ...)`), scores form plateaus once penalties exceed bonus ceilings or hit
 *   the 150-point floor. Consequently this formula is non-increasing (more moves, more time over
 *   par, more hints, or more restarts can never raise the score), rather than strictly decreasing
 *   across unbounded inputs.
 * - For official server-verified online rankings, use `calculateRankedScore` (Ranked Scoring v2)
 *   which excludes unverified client timers and computes scores solely from replayed actions.
 * - Historical local records remain preserved untouched without rewriting saved scores.
 *
 * Rules (v1):
 * - Incomplete puzzles ALWAYS receive score=0, stars=0, tier=null.
 * - Base completion points: 1500
 * - Move efficiency bonus: max(0, 600 - max(0, rotations - expectedMinMoves) * 35)
 * - Time efficiency bonus: max(0, 400 - max(0, elapsedSeconds - parTimeSec) * 4)
 * - Hint penalty: hintsUsed * 180
 * - Restart penalty: restarts * 120
 * - Star rating:
 *   - 3 stars: 0 hints, 0 restarts, rotations <= expectedMinMoves + 2
 *   - 2 stars: <= 1 hint, <= 1 restart, rotations <= ceil(expectedMinMoves * 1.65) + 3
 *   - 1 star: any other valid completion
 * - Star bonus: stars * 150
 * - Floor for completed puzzle: 150
 */
export function calculateDailyScore(input: DailyScoreInput): DailyScoreResult {
  const rotations = Math.max(0, Math.round(input.rotations));
  const expectedMinMoves = Math.max(1, Math.round(input.expectedMinMoves));
  const elapsedSeconds = Math.max(0, Math.round(input.elapsedSeconds));
  const parTimeSec = Math.max(15, Math.round(input.parTimeSec));
  const hintsUsed = Math.max(0, Math.round(input.hintsUsed));
  const restarts = Math.max(0, Math.round(input.restarts));

  if (!input.completed) {
    return {
      completed: false,
      stars: 0,
      score: 0,
      rotations,
      expectedMinMoves,
      elapsedSeconds,
      hintsUsed,
      restarts,
      performanceTier: null,
      performanceLabelFa: 'ناتمام',
    };
  }

  const threeStarMoveLimit = expectedMinMoves + 2;
  const twoStarMoveLimit = Math.ceil(expectedMinMoves * 1.65) + 3;

  let stars: 1 | 2 | 3 = 1;
  if (hintsUsed === 0 && restarts === 0 && rotations <= threeStarMoveLimit) {
    stars = 3;
  } else if (hintsUsed <= 1 && restarts <= 1 && rotations <= twoStarMoveLimit) {
    stars = 2;
  }

  const basePoints = 1500;
  const extraMoves = Math.max(0, rotations - expectedMinMoves);
  const moveBonus = Math.max(0, 600 - extraMoves * 35);
  const timeOverPar = Math.max(0, elapsedSeconds - parTimeSec);
  const timeBonus = Math.max(0, 400 - timeOverPar * 4);
  const hintPenalty = hintsUsed * 180;
  const restartPenalty = restarts * 120;
  const starBonus = stars * 150;

  const score = Math.max(
    150,
    Math.round(basePoints + moveBonus + timeBonus + starBonus - hintPenalty - restartPenalty),
  );

  let performanceTier: DailyPerformanceTier;
  if (stars === 3 && score >= 2600) {
    performanceTier = 'master';
  } else if (stars === 3 || score >= 2100) {
    performanceTier = 'engineer';
  } else if (stars === 2 || score >= 1550) {
    performanceTier = 'guardian';
  } else {
    performanceTier = 'striver';
  }

  return {
    completed: true,
    stars,
    score,
    rotations,
    expectedMinMoves,
    elapsedSeconds,
    hintsUsed,
    restarts,
    performanceTier,
    performanceLabelFa: PERFORMANCE_LABELS_FA[performanceTier],
  };
}

export function isNewBestChallengeRun(
  candidate: DailyScoreResult,
  existing: Pick<DailyChallengeRecord | FriendChallengeRecord, 'completed' | 'bestScore' | 'bestStars' | 'bestMoves' | 'bestTimeSec'> | undefined,
): boolean {
  if (!candidate.completed) return false;
  if (!existing || !existing.completed) return true;
  if (candidate.score !== existing.bestScore) {
    return candidate.score > existing.bestScore;
  }
  if (candidate.stars !== existing.bestStars) {
    return candidate.stars > existing.bestStars;
  }
  if (candidate.rotations !== existing.bestMoves) {
    return candidate.rotations < existing.bestMoves;
  }
  return candidate.elapsedSeconds < existing.bestTimeSec;
}
