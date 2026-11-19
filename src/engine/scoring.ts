import type { ScoreResult } from './types';

export interface ScoreInput {
  rotations: number;
  expectedMinMoves: number;
  elapsedSeconds: number;
  parTimeSec: number;
  hintsUsed: number;
}

/**
 * Compute three-star rating and numerical score for a completed level.
 *
 * - 3 stars: 0 hints used AND rotations within expectedMinMoves + 2
 * - 2 stars: <= 1 hint used AND rotations within ceil(expectedMinMoves * 1.65) + 3
 * - 1 star: Any valid completion
 */
export function calculateLevelScore(input: ScoreInput): ScoreResult {
  const rotations = Math.max(0, Math.round(input.rotations));
  const expectedMinMoves = Math.max(1, Math.round(input.expectedMinMoves));
  const elapsedSeconds = Math.max(0, Math.round(input.elapsedSeconds));
  const parTimeSec = Math.max(10, Math.round(input.parTimeSec));
  const hintsUsed = Math.max(0, Math.round(input.hintsUsed));

  const threeStarMoveLimit = expectedMinMoves + 2;
  const twoStarMoveLimit = Math.ceil(expectedMinMoves * 1.65) + 3;

  let stars: 1 | 2 | 3 = 1;
  if (hintsUsed === 0 && rotations <= threeStarMoveLimit) {
    stars = 3;
  } else if (hintsUsed <= 1 && rotations <= twoStarMoveLimit) {
    stars = 2;
  }

  const basePoints = 1000;
  const extraMoves = Math.max(0, rotations - expectedMinMoves);
  const moveBonus = Math.max(0, 400 - extraMoves * 35);
  const timeOverPar = Math.max(0, elapsedSeconds - parTimeSec);
  const timeBonus = Math.max(0, 300 - timeOverPar * 5);
  const hintPenalty = hintsUsed * 150;
  const starBonus = stars * 100;

  const score = Math.max(
    100,
    Math.round(basePoints + moveBonus + timeBonus + starBonus - hintPenalty),
  );

  return {
    stars,
    score,
    rotations,
    expectedMinMoves,
    elapsedSeconds,
    hintsUsed,
  };
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Convert Latin digits in a string or integer to Persian numerals for native RTL UI display.
 */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/**
 * Format elapsed seconds as MM:SS in Persian numerals.
 */
export function formatTimePersian(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  const raw = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return toPersianDigits(raw);
}
