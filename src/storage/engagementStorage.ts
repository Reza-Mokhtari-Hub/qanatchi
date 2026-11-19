import { applyDailyCompletionToStreak, createInitialStreak } from '../engagement/dailyStreak';
import { isNewBestChallengeRun } from '../engagement/dailyScoring';
import { isValidDateKey } from '../engagement/tehranTime';
import type {
  ArchivedEngagementTotals,
  DailyChallengeRecord,
  DailyScoreResult,
  FriendChallengeDefinition,
  FriendChallengeRecord,
  SavedEngagementData,
} from '../engine/types';
import type { StorageLike } from './progressStorage';

export const ENGAGEMENT_STORAGE_KEY = 'qanatchi_v1_engagement';
export const ENGAGEMENT_SCHEMA_VERSION = 1;

/** Retention caps to guarantee bounded LocalStorage usage over years of play. */
export const MAX_DAILY_RECORDS = 90;
export const MAX_FRIEND_RECORDS = 50;

function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function createEmptyArchivedTotals(): ArchivedEngagementTotals {
  return {
    prunedDailyCompletedCount: 0,
    prunedDailyStars: 0,
    prunedDailyRotations: 0,
    prunedDailyTimeSec: 0,
    prunedDailyBestScore: 0,
    prunedFriendCompletedCount: 0,
    prunedFriendStars: 0,
    prunedFriendRotations: 0,
    prunedFriendTimeSec: 0,
  };
}

export function createDefaultEngagementData(): SavedEngagementData {
  return {
    version: ENGAGEMENT_SCHEMA_VERSION,
    streak: createInitialStreak(),
    dailyRecords: {},
    friendRecords: {},
    archivedTotals: createEmptyArchivedTotals(),
  };
}

function clampNonNegInt(value: unknown, fallback = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.round(value));
}

function clampStars(value: unknown): 0 | 1 | 2 | 3 {
  const n = clampNonNegInt(value, 0);
  return Math.min(3, n) as 0 | 1 | 2 | 3;
}

function sanitizeDailyRecords(raw: unknown): Record<string, DailyChallengeRecord> {
  const out: Record<string, DailyChallengeRecord> = {};
  if (!raw || typeof raw !== 'object') return out;

  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!isValidDateKey(key) || !val || typeof val !== 'object') continue;
    const entry = val as Partial<DailyChallengeRecord>;
    const completed = Boolean(entry.completed);
    out[key] = {
      dateKey: key,
      algoVersion: Math.max(1, clampNonNegInt(entry.algoVersion, 1)),
      completed,
      bestScore: completed ? clampNonNegInt(entry.bestScore, 0) : 0,
      bestStars: completed ? clampStars(entry.bestStars) : 0,
      bestMoves: completed ? clampNonNegInt(entry.bestMoves, 0) : 0,
      bestTimeSec: completed ? clampNonNegInt(entry.bestTimeSec, 0) : 0,
      bestHintsUsed: completed ? clampNonNegInt(entry.bestHintsUsed, 0) : 0,
      bestRestarts: completed ? clampNonNegInt(entry.bestRestarts, 0) : 0,
      performanceLabelFa:
        typeof entry.performanceLabelFa === 'string' && entry.performanceLabelFa.trim()
          ? entry.performanceLabelFa.slice(0, 40)
          : completed
            ? 'تلاشگر کویر'
            : 'ناتمام',
      attemptsCount: Math.max(completed ? 1 : 0, clampNonNegInt(entry.attemptsCount, completed ? 1 : 0)),
      completionsCount: completed ? Math.max(1, clampNonNegInt(entry.completionsCount, 1)) : 0,
      totalRotations: clampNonNegInt(entry.totalRotations, completed ? clampNonNegInt(entry.bestMoves, 0) : 0),
      totalTimeSec: clampNonNegInt(entry.totalTimeSec, completed ? clampNonNegInt(entry.bestTimeSec, 0) : 0),
      firstCompletedAt: typeof entry.firstCompletedAt === 'string' ? entry.firstCompletedAt : '',
      lastPlayedAt: typeof entry.lastPlayedAt === 'string' ? entry.lastPlayedAt : '',
    };
  }

  return out;
}

function sanitizeFriendRecords(raw: unknown): Record<string, FriendChallengeRecord> {
  const out: Record<string, FriendChallengeRecord> = {};
  if (!raw || typeof raw !== 'object') return out;

  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof key !== 'string' || key.length > 40 || !val || typeof val !== 'object') continue;
    const entry = val as Partial<FriendChallengeRecord>;
    const completed = Boolean(entry.completed);
    out[key] = {
      challengeId: key,
      templateId: typeof entry.templateId === 'string' ? entry.templateId : 'tpl_01',
      algoVersion: Math.max(1, clampNonNegInt(entry.algoVersion, 1)),
      seed: clampNonNegInt(entry.seed, 0),
      titleFa:
        typeof entry.titleFa === 'string' && entry.titleFa.trim()
          ? entry.titleFa.slice(0, 60)
          : 'رقابت دوستانه',
      completed,
      bestScore: completed ? clampNonNegInt(entry.bestScore, 0) : 0,
      bestStars: completed ? clampStars(entry.bestStars) : 0,
      bestMoves: completed ? clampNonNegInt(entry.bestMoves, 0) : 0,
      bestTimeSec: completed ? clampNonNegInt(entry.bestTimeSec, 0) : 0,
      bestHintsUsed: completed ? clampNonNegInt(entry.bestHintsUsed, 0) : 0,
      bestRestarts: completed ? clampNonNegInt(entry.bestRestarts, 0) : 0,
      performanceLabelFa:
        typeof entry.performanceLabelFa === 'string' && entry.performanceLabelFa.trim()
          ? entry.performanceLabelFa.slice(0, 40)
          : completed
            ? 'تلاشگر کویر'
            : 'ناتمام',
      completionsCount: completed ? Math.max(1, clampNonNegInt(entry.completionsCount, 1)) : 0,
      totalRotations: clampNonNegInt(entry.totalRotations, completed ? clampNonNegInt(entry.bestMoves, 0) : 0),
      totalTimeSec: clampNonNegInt(entry.totalTimeSec, completed ? clampNonNegInt(entry.bestTimeSec, 0) : 0),
      completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : '',
    };
  }

  return out;
}

function sanitizeArchivedTotals(raw: unknown): ArchivedEngagementTotals {
  if (!raw || typeof raw !== 'object') return createEmptyArchivedTotals();
  const obj = raw as Partial<ArchivedEngagementTotals>;
  return {
    prunedDailyCompletedCount: clampNonNegInt(obj.prunedDailyCompletedCount, 0),
    prunedDailyStars: clampNonNegInt(obj.prunedDailyStars, 0),
    prunedDailyRotations: clampNonNegInt(obj.prunedDailyRotations, 0),
    prunedDailyTimeSec: clampNonNegInt(obj.prunedDailyTimeSec, 0),
    prunedDailyBestScore: clampNonNegInt(obj.prunedDailyBestScore, 0),
    prunedFriendCompletedCount: clampNonNegInt(obj.prunedFriendCompletedCount, 0),
    prunedFriendStars: clampNonNegInt(obj.prunedFriendStars, 0),
    prunedFriendRotations: clampNonNegInt(obj.prunedFriendRotations, 0),
    prunedFriendTimeSec: clampNonNegInt(obj.prunedFriendTimeSec, 0),
  };
}

/**
 * Enforce bounded retention policy on daily and friend records.
 * When older records exceed caps, their aggregate totals are folded into `archivedTotals`
 * so lifetime statistics and all-time best daily score remain completely accurate.
 */
export function enforceEngagementRetention(data: SavedEngagementData): SavedEngagementData {
  let archived = { ...data.archivedTotals };
  const dailyRecords = { ...data.dailyRecords };
  const friendRecords = { ...data.friendRecords };

  // Prune oldest daily records beyond MAX_DAILY_RECORDS
  const dailyKeys = Object.keys(dailyRecords).sort(); // Ascending YYYY-MM-DD
  if (dailyKeys.length > MAX_DAILY_RECORDS) {
    const excessCount = dailyKeys.length - MAX_DAILY_RECORDS;
    for (let i = 0; i < excessCount; i++) {
      const oldestKey = dailyKeys[i];
      const rec = dailyRecords[oldestKey];
      if (rec && rec.completed) {
        archived = {
          ...archived,
          prunedDailyCompletedCount: archived.prunedDailyCompletedCount + 1,
          prunedDailyStars: archived.prunedDailyStars + rec.bestStars,
          prunedDailyRotations: archived.prunedDailyRotations + Math.max(rec.bestMoves, rec.totalRotations),
          prunedDailyTimeSec: archived.prunedDailyTimeSec + Math.max(rec.bestTimeSec, rec.totalTimeSec),
          prunedDailyBestScore: Math.max(archived.prunedDailyBestScore, rec.bestScore),
        };
      }
      delete dailyRecords[oldestKey];
    }
  }

  // Prune oldest friend records beyond MAX_FRIEND_RECORDS (sorted by completedAt ascending)
  const friendEntries = Object.values(friendRecords);
  if (friendEntries.length > MAX_FRIEND_RECORDS) {
    friendEntries.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
    const excessCount = friendEntries.length - MAX_FRIEND_RECORDS;
    for (let i = 0; i < excessCount; i++) {
      const rec = friendEntries[i];
      if (rec.completed) {
        archived = {
          ...archived,
          prunedFriendCompletedCount: archived.prunedFriendCompletedCount + 1,
          prunedFriendStars: archived.prunedFriendStars + rec.bestStars,
          prunedFriendRotations: archived.prunedFriendRotations + Math.max(rec.bestMoves, rec.totalRotations),
          prunedFriendTimeSec: archived.prunedFriendTimeSec + Math.max(rec.bestTimeSec, rec.totalTimeSec),
        };
      }
      delete friendRecords[rec.challengeId];
    }
  }

  return {
    ...data,
    dailyRecords,
    friendRecords,
    archivedTotals: archived,
  };
}

/**
 * Safely migrate/validate any raw parsed engagement payload into Schema v1.
 */
export function migrateEngagementPayload(parsed: unknown): SavedEngagementData {
  if (!parsed || typeof parsed !== 'object') {
    return createDefaultEngagementData();
  }

  const raw = parsed as Partial<SavedEngagementData>;
  const rawStreak = raw.streak && typeof raw.streak === 'object' ? raw.streak : createInitialStreak();
  const lastKey =
    typeof rawStreak.lastCompletedDateKey === 'string' &&
    isValidDateKey(rawStreak.lastCompletedDateKey)
      ? rawStreak.lastCompletedDateKey
      : null;

  const currentStreak = lastKey ? clampNonNegInt(rawStreak.currentStreak, 0) : 0;
  const longestStreak = Math.max(currentStreak, clampNonNegInt(rawStreak.longestStreak, 0));

  const normalized: SavedEngagementData = {
    version: ENGAGEMENT_SCHEMA_VERSION,
    streak: {
      currentStreak,
      longestStreak,
      lastCompletedDateKey: lastKey,
    },
    dailyRecords: sanitizeDailyRecords(raw.dailyRecords),
    friendRecords: sanitizeFriendRecords(raw.friendRecords),
    archivedTotals: sanitizeArchivedTotals(raw.archivedTotals),
  };

  return enforceEngagementRetention(normalized);
}

export function loadEngagementData(
  storage: StorageLike | null = getBrowserStorage(),
): SavedEngagementData {
  if (!storage) return createDefaultEngagementData();
  try {
    const raw = storage.getItem(ENGAGEMENT_STORAGE_KEY);
    if (!raw) return createDefaultEngagementData();
    const parsed: unknown = JSON.parse(raw);
    return migrateEngagementPayload(parsed);
  } catch {
    return createDefaultEngagementData();
  }
}

export function saveEngagementData(
  data: SavedEngagementData,
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or private mode failures gracefully
  }
}

export function recordDailyChallengeCompletion(
  current: SavedEngagementData,
  params: {
    dateKey: string;
    todayTehranKey: string;
    algoVersion: number;
    result: DailyScoreResult;
  },
  storage: StorageLike | null = getBrowserStorage(),
): { data: SavedEngagementData; isNewBest: boolean } {
  const { dateKey, todayTehranKey, algoVersion, result } = params;
  // Never award scores or update streak for incomplete runs
  if (!result.completed || !isValidDateKey(dateKey)) {
    return { data: current, isNewBest: false };
  }

  const nowIso = new Date().toISOString();
  const existing = current.dailyRecords[dateKey];
  const isNewBest = isNewBestChallengeRun(result, existing);

  const updatedRecord: DailyChallengeRecord = existing && existing.completed
    ? {
        ...existing,
        algoVersion,
        completed: true,
        bestScore: isNewBest ? result.score : existing.bestScore,
        bestStars: Math.max(existing.bestStars, result.stars) as 0 | 1 | 2 | 3,
        bestMoves:
          existing.bestMoves > 0
            ? Math.min(existing.bestMoves, result.rotations)
            : result.rotations,
        bestTimeSec:
          existing.bestTimeSec > 0
            ? Math.min(existing.bestTimeSec, result.elapsedSeconds)
            : result.elapsedSeconds,
        bestHintsUsed: Math.min(existing.bestHintsUsed, result.hintsUsed),
        bestRestarts: Math.min(existing.bestRestarts, result.restarts),
        performanceLabelFa: isNewBest ? result.performanceLabelFa : existing.performanceLabelFa,
        attemptsCount: existing.attemptsCount + 1,
        completionsCount: existing.completionsCount + 1,
        totalRotations: existing.totalRotations + result.rotations,
        totalTimeSec: existing.totalTimeSec + result.elapsedSeconds,
        lastPlayedAt: nowIso,
      }
    : {
        dateKey,
        algoVersion,
        completed: true,
        bestScore: result.score,
        bestStars: result.stars,
        bestMoves: result.rotations,
        bestTimeSec: result.elapsedSeconds,
        bestHintsUsed: result.hintsUsed,
        bestRestarts: result.restarts,
        performanceLabelFa: result.performanceLabelFa,
        attemptsCount: (existing?.attemptsCount ?? 0) + 1,
        completionsCount: 1,
        totalRotations: (existing?.totalRotations ?? 0) + result.rotations,
        totalTimeSec: (existing?.totalTimeSec ?? 0) + result.elapsedSeconds,
        firstCompletedAt: nowIso,
        lastPlayedAt: nowIso,
      };

  const nextStreak = applyDailyCompletionToStreak(current.streak, dateKey, todayTehranKey);

  const nextData = enforceEngagementRetention({
    ...current,
    version: ENGAGEMENT_SCHEMA_VERSION,
    streak: nextStreak,
    dailyRecords: {
      ...current.dailyRecords,
      [dateKey]: updatedRecord,
    },
  });

  saveEngagementData(nextData, storage);
  return { data: nextData, isNewBest };
}

export function recordFriendChallengeCompletion(
  current: SavedEngagementData,
  params: {
    challenge: FriendChallengeDefinition;
    result: DailyScoreResult;
  },
  storage: StorageLike | null = getBrowserStorage(),
): { data: SavedEngagementData; isNewBest: boolean } {
  const { challenge, result } = params;
  if (!result.completed) {
    return { data: current, isNewBest: false };
  }

  const nowIso = new Date().toISOString();
  const existing = current.friendRecords[challenge.challengeId];
  const isNewBest = isNewBestChallengeRun(result, existing);

  const updatedRecord: FriendChallengeRecord = existing && existing.completed
    ? {
        ...existing,
        completed: true,
        bestScore: isNewBest ? result.score : existing.bestScore,
        bestStars: Math.max(existing.bestStars, result.stars) as 0 | 1 | 2 | 3,
        bestMoves:
          existing.bestMoves > 0
            ? Math.min(existing.bestMoves, result.rotations)
            : result.rotations,
        bestTimeSec:
          existing.bestTimeSec > 0
            ? Math.min(existing.bestTimeSec, result.elapsedSeconds)
            : result.elapsedSeconds,
        bestHintsUsed: Math.min(existing.bestHintsUsed, result.hintsUsed),
        bestRestarts: Math.min(existing.bestRestarts, result.restarts),
        performanceLabelFa: isNewBest ? result.performanceLabelFa : existing.performanceLabelFa,
        completionsCount: existing.completionsCount + 1,
        totalRotations: existing.totalRotations + result.rotations,
        totalTimeSec: existing.totalTimeSec + result.elapsedSeconds,
        completedAt: nowIso,
      }
    : {
        challengeId: challenge.challengeId,
        templateId: challenge.templateId,
        algoVersion: challenge.algoVersion,
        seed: challenge.seed,
        titleFa: challenge.titleFa,
        completed: true,
        bestScore: result.score,
        bestStars: result.stars,
        bestMoves: result.rotations,
        bestTimeSec: result.elapsedSeconds,
        bestHintsUsed: result.hintsUsed,
        bestRestarts: result.restarts,
        performanceLabelFa: result.performanceLabelFa,
        completionsCount: 1,
        totalRotations: result.rotations,
        totalTimeSec: result.elapsedSeconds,
        completedAt: nowIso,
      };

  const nextData = enforceEngagementRetention({
    ...current,
    version: ENGAGEMENT_SCHEMA_VERSION,
    friendRecords: {
      ...current.friendRecords,
      [challenge.challengeId]: updatedRecord,
    },
  });

  saveEngagementData(nextData, storage);
  return { data: nextData, isNewBest };
}

export function clearEngagementData(
  storage: StorageLike | null = getBrowserStorage(),
): SavedEngagementData {
  const fresh = createDefaultEngagementData();
  if (storage) {
    try {
      storage.removeItem(ENGAGEMENT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return fresh;
}
