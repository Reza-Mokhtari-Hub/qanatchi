import {
  computeHighestUnlockedLevelId,
  computeUnlockedRegions,
  TOTAL_CAMPAIGN_LEVELS,
} from '../campaign/progression';
import { getRegionForLevelId } from '../campaign/regions';
import type {
  GameSettings,
  LevelProgressRecord,
  RegionId,
  SavedProgress,
  ScoreResult,
} from '../engine/types';

export const LEGACY_V1_PROGRESS_KEY = 'qanatchi_v1_progress';
export const LEGACY_V2_PROGRESS_KEY = 'qanatchi_v2_progress';
export const LEGACY_V3_PROGRESS_KEY = 'qanatchi_v3_progress';
export const PROGRESS_STORAGE_KEY = 'qanatchi_v4_progress';
export const SETTINGS_STORAGE_KEY = 'qanatchi_v1_settings';
export const STORAGE_SCHEMA_VERSION = 4;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  showLeakHints: true,
};

const VALID_REGIONS: readonly RegionId[] = [
  'yazd',
  'kerman',
  'kashan',
  'zanjan',
  'khorasan',
  'isfahan',
  'fars',
  'semnan',
  'northwest',
  'razavi_khorasan',
];

function isValidRegionId(value: unknown): value is RegionId {
  return typeof value === 'string' && VALID_REGIONS.includes(value as RegionId);
}

export function createDefaultProgress(): SavedProgress {
  return {
    version: STORAGE_SCHEMA_VERSION,
    lastPlayedLevelId: 1,
    highestUnlockedLevelId: 1,
    unlockedRegions: ['yazd'],
    lastSelectedRegionId: 'yazd',
    seenStoryIds: [],
    levels: {},
  };
}

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

function sanitizeLevelRecords(
  rawLevels: unknown,
): Record<number, LevelProgressRecord> {
  const sanitized: Record<number, LevelProgressRecord> = {};
  if (!rawLevels || typeof rawLevels !== 'object') {
    return sanitized;
  }

  for (const [key, val] of Object.entries(rawLevels as Record<string, unknown>)) {
    const numericId = Number(key);
    if (
      !Number.isInteger(numericId) ||
      numericId < 1 ||
      numericId > TOTAL_CAMPAIGN_LEVELS ||
      !val ||
      typeof val !== 'object'
    ) {
      continue;
    }
    const entry = val as Partial<LevelProgressRecord>;
    const rawStars = typeof entry.bestStars === 'number' && Number.isFinite(entry.bestStars)
      ? entry.bestStars
      : 0;
    const clampedStars = Math.min(3, Math.max(0, Math.round(rawStars))) as 0 | 1 | 2 | 3;

    const completed = Boolean(entry.completed);
    const bestMoves =
      typeof entry.bestMoves === 'number' && Number.isFinite(entry.bestMoves)
        ? Math.max(0, Math.round(entry.bestMoves))
        : 0;
    const bestTimeSec =
      typeof entry.bestTimeSec === 'number' && Number.isFinite(entry.bestTimeSec)
        ? Math.max(0, Math.round(entry.bestTimeSec))
        : 0;

    sanitized[numericId] = {
      levelId: numericId,
      completed,
      bestStars: clampedStars,
      bestScore:
        typeof entry.bestScore === 'number' && Number.isFinite(entry.bestScore)
          ? Math.max(0, Math.round(entry.bestScore))
          : 0,
      bestMoves,
      bestTimeSec,
      completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : '',
      ...(typeof entry.completionsCount === 'number' && Number.isFinite(entry.completionsCount)
        ? { completionsCount: Math.max(completed ? 1 : 0, Math.round(entry.completionsCount)) }
        : {}),
      ...(typeof entry.totalRotations === 'number' && Number.isFinite(entry.totalRotations)
        ? { totalRotations: Math.max(bestMoves, Math.round(entry.totalRotations)) }
        : {}),
      ...(typeof entry.totalTimeSec === 'number' && Number.isFinite(entry.totalTimeSec)
        ? { totalTimeSec: Math.max(bestTimeSec, Math.round(entry.totalTimeSec)) }
        : {}),
    };
  }

  return sanitized;
}

/**
 * Migrate raw parsed storage payload (v1, v2, v3, or v4) safely and losslessly
 * into the current v4 80-level / 10-route campaign schema.
 *
 * Guarantees:
 * - Never discards valid stars, scores, moves, times, or completed levels (1–40 or 41–80).
 * - Never marks new levels (41–80) as completed.
 * - Pre-v3 player who finished Level 24 seamlessly continues to Level 25 (Zanjan).
 * - Pre-v4 player who finished Level 40 seamlessly continues to Level 41 (Isfahan Plateau).
 * - Pre-v4 `campaign_complete` story flag (earned at 24 or 40 levels) is cleared on upgrade
 *   so the true 80-level campaign finale triggers upon completing Level 80.
 */
export function migrateProgressPayload(parsed: unknown): SavedProgress {
  if (!parsed || typeof parsed !== 'object') {
    return createDefaultProgress();
  }

  const record = parsed as Partial<SavedProgress>;
  const sourceVersion =
    typeof record.version === 'number' && Number.isFinite(record.version)
      ? record.version
      : 1;
  const sanitizedLevels = sanitizeLevelRecords(record.levels);

  const rawStoredHighest =
    typeof record.highestUnlockedLevelId === 'number' &&
    Number.isInteger(record.highestUnlockedLevelId)
      ? record.highestUnlockedLevelId
      : 1;

  const highestUnlockedLevelId = computeHighestUnlockedLevelId(
    sanitizedLevels,
    rawStoredHighest,
  );

  const rawRegions = Array.isArray(record.unlockedRegions)
    ? record.unlockedRegions.filter(isValidRegionId)
    : [];

  const unlockedRegions = computeUnlockedRegions(
    sanitizedLevels,
    highestUnlockedLevelId,
    rawRegions,
  );

  let rawLastPlayed =
    typeof record.lastPlayedLevelId === 'number' &&
    Number.isInteger(record.lastPlayedLevelId) &&
    record.lastPlayedLevelId >= 1 &&
    record.lastPlayedLevelId <= TOTAL_CAMPAIGN_LEVELS
      ? record.lastPlayedLevelId
      : highestUnlockedLevelId;

  // Seamless v3 -> v4 continuation for players who finished Level 40 before Phase 8
  const upgradedFromCompleted40 =
    sourceVersion < STORAGE_SCHEMA_VERSION &&
    Boolean(sanitizedLevels[40]?.completed) &&
    !sanitizedLevels[41]?.completed &&
    rawLastPlayed === 40 &&
    highestUnlockedLevelId >= 41;

  // Seamless v2 -> v4 continuation for players who finished Level 24 before Phase 7
  const upgradedFromCompleted24 =
    sourceVersion < 3 &&
    Boolean(sanitizedLevels[24]?.completed) &&
    !sanitizedLevels[25]?.completed &&
    rawLastPlayed === 24 &&
    highestUnlockedLevelId >= 25;

  if (upgradedFromCompleted40) {
    rawLastPlayed = 41;
  } else if (upgradedFromCompleted24) {
    rawLastPlayed = 25;
  }

  const lastPlayedLevelId = Math.min(rawLastPlayed, highestUnlockedLevelId);

  const inferredRegion = getRegionForLevelId(lastPlayedLevelId).id;
  const lastSelectedRegionId = upgradedFromCompleted40
    ? 'isfahan'
    : upgradedFromCompleted24
      ? 'zanjan'
      : isValidRegionId(record.lastSelectedRegionId) &&
          unlockedRegions.includes(record.lastSelectedRegionId)
        ? record.lastSelectedRegionId
        : unlockedRegions.includes(inferredRegion)
          ? inferredRegion
          : 'yazd';

  let seenStoryIds = Array.isArray(record.seenStoryIds)
    ? record.seenStoryIds.filter((s): s is string => typeof s === 'string')
    : [];

  if (sourceVersion < STORAGE_SCHEMA_VERSION) {
    seenStoryIds = seenStoryIds.filter((id) => id !== 'campaign_complete');
  }

  return {
    version: STORAGE_SCHEMA_VERSION,
    lastPlayedLevelId,
    highestUnlockedLevelId,
    unlockedRegions,
    lastSelectedRegionId,
    seenStoryIds,
    levels: sanitizedLevels,
  };
}

/**
 * Load progress with automatic, lossless migration from:
 * 1. Current v4 storage (`qanatchi_v4_progress`)
 * 2. Phase 7 v3 storage (`qanatchi_v3_progress`)
 * 3. Phase 2–6.1 v2 storage (`qanatchi_v2_progress`)
 * 4. Phase 1 v1 storage (`qanatchi_v1_progress`)
 * Handles malformed JSON or partial objects safely without losing valid records.
 */
export function loadProgress(storage: StorageLike | null = getBrowserStorage()): SavedProgress {
  if (!storage) return createDefaultProgress();

  // 1. Try current v4 storage first
  try {
    const rawV4 = storage.getItem(PROGRESS_STORAGE_KEY);
    if (rawV4) {
      const parsed: unknown = JSON.parse(rawV4);
      if (parsed && typeof parsed === 'object') {
        return migrateProgressPayload(parsed);
      }
    }
  } catch {
    // Fall through to legacy keys or safe default
  }

  // 2. Fallback & auto-migrate from Phase 7 v3 storage key
  try {
    const rawV3 = storage.getItem(LEGACY_V3_PROGRESS_KEY);
    if (rawV3) {
      const parsedV3: unknown = JSON.parse(rawV3);
      if (parsedV3 && typeof parsedV3 === 'object') {
        const migrated = migrateProgressPayload(parsedV3);
        saveProgress(migrated, storage);
        return migrated;
      }
    }
  } catch {
    // Fall through to legacy v2 key
  }

  // 3. Fallback & auto-migrate from Phase 2–6.1 v2 storage key
  try {
    const rawV2 = storage.getItem(LEGACY_V2_PROGRESS_KEY);
    if (rawV2) {
      const parsedV2: unknown = JSON.parse(rawV2);
      if (parsedV2 && typeof parsedV2 === 'object') {
        const migrated = migrateProgressPayload(parsedV2);
        saveProgress(migrated, storage);
        return migrated;
      }
    }
  } catch {
    // Fall through to legacy v1 key
  }

  // 4. Fallback & auto-migrate from Phase 1 v1 storage key
  try {
    const rawV1 = storage.getItem(LEGACY_V1_PROGRESS_KEY);
    if (rawV1) {
      const parsedV1: unknown = JSON.parse(rawV1);
      if (parsedV1 && typeof parsedV1 === 'object') {
        const migrated = migrateProgressPayload(parsedV1);
        saveProgress(migrated, storage);
        return migrated;
      }
    }
  } catch {
    return createDefaultProgress();
  }

  return createDefaultProgress();
}

export function saveProgress(
  progress: SavedProgress,
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or private mode failures gracefully
  }
}

export function recordLevelCompletion(
  current: SavedProgress,
  levelId: number,
  result: ScoreResult,
  nextLevelId: number,
  storage: StorageLike | null = getBrowserStorage(),
): SavedProgress {
  const existing = current.levels[levelId];
  const prevRuns = existing
    ? (existing.completionsCount && existing.completionsCount > 0 ? existing.completionsCount : existing.completed ? 1 : 0)
    : 0;
  const prevRotations = existing
    ? (existing.totalRotations && existing.totalRotations > 0 ? existing.totalRotations : existing.bestMoves)
    : 0;
  const prevTimeSec = existing
    ? (existing.totalTimeSec && existing.totalTimeSec > 0 ? existing.totalTimeSec : existing.bestTimeSec)
    : 0;

  const updatedRecord: LevelProgressRecord = {
    levelId,
    completed: true,
    bestStars: existing
      ? (Math.max(existing.bestStars, result.stars) as 0 | 1 | 2 | 3)
      : result.stars,
    bestScore: existing ? Math.max(existing.bestScore, result.score) : result.score,
    bestMoves:
      existing && existing.bestMoves > 0
        ? Math.min(existing.bestMoves, result.rotations)
        : result.rotations,
    bestTimeSec:
      existing && existing.bestTimeSec > 0
        ? Math.min(existing.bestTimeSec, result.elapsedSeconds)
        : result.elapsedSeconds,
    completedAt: new Date().toISOString(),
    completionsCount: prevRuns + 1,
    totalRotations: prevRotations + result.rotations,
    totalTimeSec: prevTimeSec + result.elapsedSeconds,
  };

  const nextLevels: Record<number, LevelProgressRecord> = {
    ...current.levels,
    [levelId]: updatedRecord,
  };

  const highestUnlockedLevelId = computeHighestUnlockedLevelId(
    nextLevels,
    Math.max(current.highestUnlockedLevelId, Math.min(TOTAL_CAMPAIGN_LEVELS, levelId + 1)),
  );
  const unlockedRegions = computeUnlockedRegions(
    nextLevels,
    highestUnlockedLevelId,
    current.unlockedRegions,
  );
  const safeNextLevel = Math.min(
    Math.max(1, nextLevelId),
    highestUnlockedLevelId,
  );
  const nextRegionId = getRegionForLevelId(safeNextLevel).id;

  const nextProgress: SavedProgress = {
    ...current,
    version: STORAGE_SCHEMA_VERSION,
    lastPlayedLevelId: safeNextLevel,
    highestUnlockedLevelId,
    unlockedRegions,
    lastSelectedRegionId: unlockedRegions.includes(nextRegionId)
      ? nextRegionId
      : current.lastSelectedRegionId,
    levels: nextLevels,
  };

  saveProgress(nextProgress, storage);
  return nextProgress;
}

export function updateLastPlayedLevel(
  current: SavedProgress,
  levelId: number,
  storage: StorageLike | null = getBrowserStorage(),
): SavedProgress {
  const regionId = getRegionForLevelId(levelId).id;
  const nextProgress: SavedProgress = {
    ...current,
    lastPlayedLevelId: levelId,
    lastSelectedRegionId: current.unlockedRegions.includes(regionId)
      ? regionId
      : current.lastSelectedRegionId,
  };
  saveProgress(nextProgress, storage);
  return nextProgress;
}

export function markStorySeen(
  current: SavedProgress,
  storyId: string,
  storage: StorageLike | null = getBrowserStorage(),
): SavedProgress {
  if (current.seenStoryIds.includes(storyId)) return current;
  const nextProgress: SavedProgress = {
    ...current,
    seenStoryIds: [...current.seenStoryIds, storyId],
  };
  saveProgress(nextProgress, storage);
  return nextProgress;
}

export function clearProgress(
  storage: StorageLike | null = getBrowserStorage(),
): SavedProgress {
  const fresh = createDefaultProgress();
  if (storage) {
    try {
      storage.removeItem(PROGRESS_STORAGE_KEY);
      storage.removeItem(LEGACY_V3_PROGRESS_KEY);
      storage.removeItem(LEGACY_V2_PROGRESS_KEY);
      storage.removeItem(LEGACY_V1_PROGRESS_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return fresh;
}

export function loadSettings(storage: StorageLike | null = getBrowserStorage()): GameSettings {
  if (!storage) return { ...DEFAULT_SETTINGS };
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    const obj = parsed as Partial<GameSettings>;
    return {
      soundEnabled:
        typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      animationsEnabled:
        typeof obj.animationsEnabled === 'boolean'
          ? obj.animationsEnabled
          : DEFAULT_SETTINGS.animationsEnabled,
      showLeakHints:
        typeof obj.showLeakHints === 'boolean'
          ? obj.showLeakHints
          : DEFAULT_SETTINGS.showLeakHints,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(
  settings: GameSettings,
  storage: StorageLike | null = getBrowserStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function getTotalStars(progress: SavedProgress): number {
  return Object.values(progress.levels).reduce((acc, rec) => acc + rec.bestStars, 0);
}

export function getCompletedCount(progress: SavedProgress): number {
  return Object.values(progress.levels).filter((rec) => rec.completed).length;
}
