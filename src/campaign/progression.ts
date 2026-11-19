import { getDestinationById } from './destinations';
import { getRegionById, REGIONS, STORY_MOMENTS } from './regions';
import type {
  CampaignProgressSummary,
  DestinationId,
  DestinationProgressSummary,
  LevelProgressRecord,
  RegionId,
  RegionProgressSummary,
  SavedProgress,
  StoryMoment,
} from '../engine/types';

export const TOTAL_CAMPAIGN_LEVELS = 80;

/**
 * Derive the highest unlocked level ID deterministically from completed records
 * and stored frontier, guaranteeing Level 1 is always unlocked and progress never regresses.
 */
export function computeHighestUnlockedLevelId(
  levels: Record<number, LevelProgressRecord>,
  storedHighest: number = 1,
): number {
  let highestFromCompleted = 1;
  for (const rec of Object.values(levels)) {
    if (rec.completed && rec.levelId >= 1 && rec.levelId <= TOTAL_CAMPAIGN_LEVELS) {
      const nextUnlock = Math.min(TOTAL_CAMPAIGN_LEVELS, rec.levelId + 1);
      if (nextUnlock > highestFromCompleted) {
        highestFromCompleted = nextUnlock;
      }
    }
  }
  const safeStored =
    Number.isInteger(storedHighest) && storedHighest >= 1
      ? Math.min(TOTAL_CAMPAIGN_LEVELS, storedHighest)
      : 1;
  return Math.max(1, highestFromCompleted, safeStored);
}

/**
 * Determine all unlocked routes based on completed gate levels and stored unlock state.
 * - Yazd: Always unlocked (Levels 1–8)
 * - Kerman: Unlocked once Level 8 is completed (Levels 9–16)
 * - Kashan: Unlocked once Level 16 is completed (Levels 17–24)
 * - Zanjan: Unlocked once Level 24 is completed (Levels 25–32)
 * - Khorasan: Unlocked once Level 32 is completed (Levels 33–40)
 * - Isfahan Plateau: Unlocked once Level 40 is completed (Levels 41–48)
 * - Fars: Unlocked once Level 48 is completed (Levels 49–56)
 * - Semnan: Unlocked once Level 56 is completed (Levels 57–64)
 * - Northwestern Iran: Unlocked once Level 64 is completed (Levels 65–72)
 * - Razavi Khorasan: Unlocked once Level 72 is completed (Levels 73–80)
 */
export function computeUnlockedRegions(
  levels: Record<number, LevelProgressRecord>,
  highestUnlockedLevelId: number,
  storedUnlocked: readonly RegionId[] = [],
): RegionId[] {
  const unlocked = new Set<RegionId>(['yazd']);

  for (const region of REGIONS) {
    if (region.requiredCompletedLevelId === null) {
      unlocked.add(region.id);
      continue;
    }
    const gateCompleted = Boolean(levels[region.requiredCompletedLevelId]?.completed);
    const reachedPastGate = highestUnlockedLevelId > region.requiredCompletedLevelId;
    if (gateCompleted || reachedPastGate) {
      unlocked.add(region.id);
    }
  }

  // Preserve valid previously unlocked regions only if any level inside them is already completed
  for (const regId of storedUnlocked) {
    const def = REGIONS.find((r) => r.id === regId);
    if (!def) continue;
    const anyCompletedInRegion = def.levelIds.some((id) => Boolean(levels[id]?.completed));
    if (anyCompletedInRegion) {
      unlocked.add(regId);
    }
  }

  return REGIONS.map((r) => r.id).filter((id) => unlocked.has(id));
}

export function isLevelUnlocked(progress: SavedProgress, levelId: number): boolean {
  if (levelId < 1 || levelId > TOTAL_CAMPAIGN_LEVELS) return false;
  if (levelId === 1) return true;
  if (progress.levels[levelId]?.completed) return true;
  const highest = computeHighestUnlockedLevelId(
    progress.levels,
    progress.highestUnlockedLevelId,
  );
  return levelId <= highest;
}

export function isRegionUnlocked(progress: SavedProgress, regionId: RegionId): boolean {
  const highest = computeHighestUnlockedLevelId(
    progress.levels,
    progress.highestUnlockedLevelId,
  );
  const unlocked = computeUnlockedRegions(
    progress.levels,
    highest,
    progress.unlockedRegions,
  );
  return unlocked.includes(regionId);
}

export function isDestinationUnlocked(
  progress: SavedProgress,
  destinationId: DestinationId,
): boolean {
  const dest = getDestinationById(destinationId);
  return dest.levelIds.some((levelId) => isLevelUnlocked(progress, levelId));
}

export function getDestinationProgress(
  progress: SavedProgress,
  destinationId: DestinationId,
): DestinationProgressSummary {
  const dest = getDestinationById(destinationId);
  const unlocked = isDestinationUnlocked(progress, destinationId);
  const totalCount = dest.levelIds.length;
  let completedCount = 0;
  let earnedStars = 0;
  let nextPlayableLevelId: number | null = null;

  for (const lvlId of dest.levelIds) {
    const rec = progress.levels[lvlId];
    if (rec?.completed) {
      completedCount++;
      earnedStars += rec.bestStars;
    } else if (nextPlayableLevelId === null && isLevelUnlocked(progress, lvlId)) {
      nextPlayableLevelId = lvlId;
    }
  }

  if (unlocked && nextPlayableLevelId === null && dest.levelIds.length > 0) {
    nextPlayableLevelId = dest.levelIds[0];
  }

  const maxStars = totalCount * 3;
  const completionPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    destinationId,
    regionId: dest.regionId,
    unlocked,
    completedCount,
    totalCount,
    completionPercent,
    earnedStars,
    maxStars,
    isCompleted: completedCount === totalCount,
    nextPlayableLevelId,
  };
}

export function getRegionProgress(
  progress: SavedProgress,
  regionId: RegionId,
): RegionProgressSummary {
  const region = getRegionById(regionId);
  const unlocked = isRegionUnlocked(progress, regionId);
  const totalCount = region.levelIds.length;
  let completedCount = 0;
  let earnedStars = 0;
  let nextPlayableLevelId: number | null = null;

  for (const lvlId of region.levelIds) {
    const rec = progress.levels[lvlId];
    if (rec?.completed) {
      completedCount++;
      earnedStars += rec.bestStars;
    } else if (nextPlayableLevelId === null && unlocked && isLevelUnlocked(progress, lvlId)) {
      nextPlayableLevelId = lvlId;
    }
  }

  // If all levels in the region are completed, default next playable to the first level for replay
  if (unlocked && nextPlayableLevelId === null && region.levelIds.length > 0) {
    nextPlayableLevelId = region.levelIds[0];
  }

  const maxStars = totalCount * 3;
  const completionPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    regionId,
    unlocked,
    completedCount,
    totalCount,
    completionPercent,
    earnedStars,
    maxStars,
    isCompleted: completedCount === totalCount,
    nextPlayableLevelId,
  };
}

export function getCampaignSummary(progress: SavedProgress): CampaignProgressSummary {
  let completedLevels = 0;
  let earnedStars = 0;

  for (let id = 1; id <= TOTAL_CAMPAIGN_LEVELS; id++) {
    const rec = progress.levels[id];
    if (rec?.completed) {
      completedLevels++;
      earnedStars += rec.bestStars;
    }
  }

  const highestUnlockedLevelId = computeHighestUnlockedLevelId(
    progress.levels,
    progress.highestUnlockedLevelId,
  );
  const unlockedRegions = computeUnlockedRegions(
    progress.levels,
    highestUnlockedLevelId,
    progress.unlockedRegions,
  );

  return {
    completedLevels,
    totalLevels: TOTAL_CAMPAIGN_LEVELS,
    completionPercent: Math.round((completedLevels / TOTAL_CAMPAIGN_LEVELS) * 100),
    earnedStars,
    maxStars: TOTAL_CAMPAIGN_LEVELS * 3,
    unlockedRegionsCount: unlockedRegions.length,
    totalRegionsCount: REGIONS.length,
    highestUnlockedLevelId,
    isCampaignCompleted: completedLevels === TOTAL_CAMPAIGN_LEVELS,
  };
}

/**
 * Determine which unlocked level should be launched when pressing "Continue" or "Start Adventure".
 */
export function getRecommendedPlayableLevelId(progress: SavedProgress): number {
  const highest = computeHighestUnlockedLevelId(
    progress.levels,
    progress.highestUnlockedLevelId,
  );
  // Prefer lastPlayedLevelId if it is valid, unlocked, and either uncompleted or campaign is complete
  if (
    progress.lastPlayedLevelId >= 1 &&
    progress.lastPlayedLevelId <= TOTAL_CAMPAIGN_LEVELS &&
    isLevelUnlocked(progress, progress.lastPlayedLevelId)
  ) {
    const lastCompleted = Boolean(progress.levels[progress.lastPlayedLevelId]?.completed);
    const frontierUncompleted = !progress.levels[highest]?.completed;
    if (lastCompleted && frontierUncompleted) {
      return highest;
    }
    return progress.lastPlayedLevelId;
  }
  return highest;
}

/**
 * Detect narrative & progression milestones newly achieved upon completing a level.
 * Returns the highest-priority newly unlocked StoryMoment (or null if none).
 */
export function detectCompletionMilestone(
  prevProgress: SavedProgress,
  nextProgress: SavedProgress,
  completedLevelId: number,
): StoryMoment | null {
  const prevSummary = getCampaignSummary(prevProgress);
  const nextSummary = getCampaignSummary(nextProgress);

  // 1. Entire 80-level campaign completed for the first time
  if (!prevSummary.isCampaignCompleted && nextSummary.isCampaignCompleted) {
    return STORY_MOMENTS.campaign_complete;
  }

  // 2. Completing Level 72 unlocks Razavi Khorasan
  if (
    !isRegionUnlocked(prevProgress, 'razavi_khorasan') &&
    isRegionUnlocked(nextProgress, 'razavi_khorasan')
  ) {
    return STORY_MOMENTS.unlock_razavi_khorasan;
  }

  // 3. Completing Level 64 unlocks Northwestern Iran
  if (!isRegionUnlocked(prevProgress, 'northwest') && isRegionUnlocked(nextProgress, 'northwest')) {
    return STORY_MOMENTS.unlock_northwest;
  }

  // 4. Completing Level 56 unlocks Semnan
  if (!isRegionUnlocked(prevProgress, 'semnan') && isRegionUnlocked(nextProgress, 'semnan')) {
    return STORY_MOMENTS.unlock_semnan;
  }

  // 5. Completing Level 48 unlocks Fars
  if (!isRegionUnlocked(prevProgress, 'fars') && isRegionUnlocked(nextProgress, 'fars')) {
    return STORY_MOMENTS.unlock_fars;
  }

  // 6. Completing Level 40 unlocks Isfahan Plateau
  if (!isRegionUnlocked(prevProgress, 'isfahan') && isRegionUnlocked(nextProgress, 'isfahan')) {
    return STORY_MOMENTS.unlock_isfahan;
  }

  // 7. Completing Level 32 unlocks Khorasan
  if (!isRegionUnlocked(prevProgress, 'khorasan') && isRegionUnlocked(nextProgress, 'khorasan')) {
    return STORY_MOMENTS.unlock_khorasan;
  }

  // 8. Completing Level 24 unlocks Zanjan
  if (!isRegionUnlocked(prevProgress, 'zanjan') && isRegionUnlocked(nextProgress, 'zanjan')) {
    return STORY_MOMENTS.unlock_zanjan;
  }

  // 9. Completing Level 16 unlocks Kashan
  if (!isRegionUnlocked(prevProgress, 'kashan') && isRegionUnlocked(nextProgress, 'kashan')) {
    return STORY_MOMENTS.unlock_kashan;
  }

  // 10. Completing Level 8 unlocks Kerman
  if (!isRegionUnlocked(prevProgress, 'kerman') && isRegionUnlocked(nextProgress, 'kerman')) {
    return STORY_MOMENTS.unlock_kerman;
  }

  // 6. First level ever completed
  if (
    completedLevelId === 1 &&
    prevSummary.completedLevels === 0 &&
    nextSummary.completedLevels >= 1
  ) {
    return STORY_MOMENTS.first_qanat_restored;
  }

  return null;
}
