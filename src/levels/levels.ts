import { buildGridFromLevel } from '../engine/verifier';
import type { DestinationId, LevelDefinition, RegionId, TileState } from '../engine/types';
import { FARS_LEVELS } from './farsLevels';
import { ISFAHAN_LEVELS } from './isfahanLevels';
import { KASHAN_LEVELS } from './kashanLevels';
import { KERMAN_LEVELS } from './kermanLevels';
import { KHORASAN_LEVELS } from './khorasanLevels';
import { NORTHWEST_LEVELS } from './northwestLevels';
import { RAZAVI_KHORASAN_LEVELS } from './razaviKhorasanLevels';
import { SEMNAN_LEVELS } from './semnanLevels';
import { SHAHSAVAN_LEVELS } from './shahsavanLevels';
import { TURKMEN_SAHRA_LEVELS } from './turkmenSahraLevels';
import { YAZD_LEVELS } from './yazdLevels';
import { ZANJAN_LEVELS } from './zanjanLevels';

export const LEVELS: readonly LevelDefinition[] = [
  ...YAZD_LEVELS,
  ...KERMAN_LEVELS,
  ...KASHAN_LEVELS,
  ...ZANJAN_LEVELS,
  ...KHORASAN_LEVELS,
  ...ISFAHAN_LEVELS,
  ...FARS_LEVELS,
  ...SEMNAN_LEVELS,
  ...NORTHWEST_LEVELS,
  ...RAZAVI_KHORASAN_LEVELS,
  ...SHAHSAVAN_LEVELS,
  ...TURKMEN_SAHRA_LEVELS,
];

export function getLevelById(levelId: number): LevelDefinition {
  return LEVELS.find((lvl) => lvl.id === levelId) ?? LEVELS[0];
}

export function getLevelsByRegion(regionId: RegionId): readonly LevelDefinition[] {
  return LEVELS.filter((lvl) => lvl.regionId === regionId);
}

export function getLevelsByDestination(destinationId: DestinationId): readonly LevelDefinition[] {
  return LEVELS.filter((lvl) => lvl.destinationId === destinationId);
}

export function createInitialBoard(level: LevelDefinition): TileState[][] {
  return buildGridFromLevel(level, 'initial');
}
