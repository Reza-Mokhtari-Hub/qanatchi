import type { DailyStreakState } from '../engine/types';
import { diffTehranDateKeys, isValidDateKey } from './tehranTime';

export interface EffectiveStreakView {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  isBroken: boolean;
  clockAnomalyDetected: boolean;
}

export function createInitialStreak(): DailyStreakState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDateKey: null,
  };
}

/**
 * Compute the player's current effective streak relative to today's Tehran calendar date.
 * - Missing a full Tehran day (delta > 1) resets effective currentStreak to 0 while keeping longestStreak.
 * - Invalid backward device clocks (delta < 0) are handled conservatively without crashing or inflating.
 */
export function getEffectiveStreak(
  streak: DailyStreakState,
  todayTehranKey: string,
): EffectiveStreakView {
  const safeLongest = Math.max(0, Math.floor(streak.longestStreak || 0));
  const safeCurrent = Math.max(0, Math.floor(streak.currentStreak || 0));

  if (!streak.lastCompletedDateKey || !isValidDateKey(streak.lastCompletedDateKey)) {
    return {
      currentStreak: 0,
      longestStreak: safeLongest,
      completedToday: false,
      isBroken: false,
      clockAnomalyDetected: false,
    };
  }

  if (!isValidDateKey(todayTehranKey)) {
    return {
      currentStreak: 0,
      longestStreak: safeLongest,
      completedToday: false,
      isBroken: false,
      clockAnomalyDetected: true,
    };
  }

  const delta = diffTehranDateKeys(streak.lastCompletedDateKey, todayTehranKey);
  if (delta === null) {
    return {
      currentStreak: 0,
      longestStreak: safeLongest,
      completedToday: false,
      isBroken: false,
      clockAnomalyDetected: true,
    };
  }

  if (delta < 0) {
    // Device clock appears behind last recorded Tehran completion date
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      completedToday: false,
      isBroken: false,
      clockAnomalyDetected: true,
    };
  }

  if (delta === 0) {
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      completedToday: true,
      isBroken: false,
      clockAnomalyDetected: false,
    };
  }

  if (delta === 1) {
    // Completed yesterday; streak is still active if player completes today
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      completedToday: false,
      isBroken: false,
      clockAnomalyDetected: false,
    };
  }

  // delta > 1: at least one full Tehran calendar day was missed
  return {
    currentStreak: 0,
    longestStreak: Math.max(safeLongest, safeCurrent),
    completedToday: false,
    isBroken: safeCurrent > 0,
    clockAnomalyDetected: false,
  };
}

/**
 * Update streak state upon completing a daily challenge.
 *
 * Rules:
 * 1. Completing an older (or future-mismatched) daily challenge where completedDateKey !== todayTehranKey
 *    MUST NOT modify currentStreak, longestStreak, or lastCompletedDateKey.
 * 2. Completing today's challenge multiple times does NOT increase the streak again.
 * 3. First completion starts streak at 1.
 * 4. Completing on the next consecutive Tehran day increments currentStreak by 1.
 * 5. Missing one or more full Tehran days resets currentStreak to 1 upon completion.
 * 6. Invalid backward device clock (completedDateKey < lastCompletedDateKey) is rejected conservatively.
 * 7. longestStreak always preserves the historical maximum.
 */
export function applyDailyCompletionToStreak(
  streak: DailyStreakState,
  completedDateKey: string,
  todayTehranKey: string,
): DailyStreakState {
  const safeLongest = Math.max(0, Math.floor(streak.longestStreak || 0));
  const safeCurrent = Math.max(0, Math.floor(streak.currentStreak || 0));

  if (!isValidDateKey(completedDateKey) || !isValidDateKey(todayTehranKey)) {
    return {
      currentStreak: safeCurrent,
      longestStreak: safeLongest,
      lastCompletedDateKey: streak.lastCompletedDateKey,
    };
  }

  // Replaying an older daily challenge never alters the current streak
  if (completedDateKey !== todayTehranKey) {
    return {
      currentStreak: safeCurrent,
      longestStreak: safeLongest,
      lastCompletedDateKey: streak.lastCompletedDateKey,
    };
  }

  if (!streak.lastCompletedDateKey || !isValidDateKey(streak.lastCompletedDateKey)) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(safeLongest, 1),
      lastCompletedDateKey: completedDateKey,
    };
  }

  const delta = diffTehranDateKeys(streak.lastCompletedDateKey, completedDateKey);
  if (delta === null || delta <= 0) {
    // delta === 0: already completed today (no double increment)
    // delta < 0: invalid device clock went backwards (conservative no-op)
    return {
      currentStreak: safeCurrent,
      longestStreak: Math.max(safeLongest, safeCurrent),
      lastCompletedDateKey: streak.lastCompletedDateKey,
    };
  }

  const nextCurrent = delta === 1 ? safeCurrent + 1 : 1;
  return {
    currentStreak: nextCurrent,
    longestStreak: Math.max(safeLongest, nextCurrent),
    lastCompletedDateKey: completedDateKey,
  };
}
