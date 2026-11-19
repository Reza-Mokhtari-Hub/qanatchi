import type { DailyChallengeDefinition } from '../engine/types';
import { createMulberry32, hashStringFNV1a } from './prng';
import { PUZZLE_TEMPLATES } from './puzzleTemplates';
import { buildDeterministicLevelFromTemplate } from './puzzleTransform';
import {
  diffTehranDateKeys,
  formatPersianJalaliDate,
  getTehranDateKey,
  isValidDateKey,
} from './tehranTime';

export const DAILY_PUZZLE_ALGO_VERSION = 1;
export const SUPPORTED_DAILY_ALGO_VERSIONS: readonly number[] = [1];

const DAILY_EPOCH_KEY = '2025-01-01';

/**
 * Deterministic Fisher-Yates permutation of template indices for a given 12-day cycle.
 * Guarantees no template repeats within a cycle and ensures consecutive days vary.
 */
function getCyclePermutation(cycleIndex: number, algoVersion: number): number[] {
  const count = PUZZLE_TEMPLATES.length;
  const indices = Array.from({ length: count }, (_, i) => i);
  const cycleSeed = hashStringFNV1a(`qanatchi:daily-cycle:v${algoVersion}:${cycleIndex}`);
  const rng = createMulberry32(cycleSeed);

  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }

  return indices;
}

function selectDailyTemplateIndex(dateKey: string, algoVersion: number): number {
  const count = PUZZLE_TEMPLATES.length;
  const rawDayOffset = diffTehranDateKeys(DAILY_EPOCH_KEY, dateKey) ?? 0;
  const cycleIndex = Math.floor(rawDayOffset / count);
  const posInCycle = ((rawDayOffset % count) + count) % count;

  const perm = getCyclePermutation(cycleIndex, algoVersion);
  let selected = perm[posInCycle];

  // Prevent boundary repeat if first day of new cycle matches last day of previous cycle
  if (posInCycle === 0) {
    const prevPerm = getCyclePermutation(cycleIndex - 1, algoVersion);
    const prevLast = prevPerm[count - 1];
    if (selected === prevLast) {
      selected = perm[1 % count];
    }
  } else if (posInCycle === 1) {
    const prevPerm = getCyclePermutation(cycleIndex - 1, algoVersion);
    const prevLast = prevPerm[count - 1];
    if (perm[0] === prevLast) {
      selected = perm[0];
    }
  }

  return selected;
}

/**
 * Deterministically generate the shared Daily Challenge for any valid Tehran dateKey ("YYYY-MM-DD").
 *
 * Seed formula (v1):
 *   FNV-1a-32("qanatchi:daily:v1:<YYYY-MM-DD>") -> Mulberry32 PRNG
 *
 * Throws if dateKey is malformed or algoVersion is unsupported.
 */
export function generateDailyChallenge(
  dateKey: string = getTehranDateKey(),
  algoVersion: number = DAILY_PUZZLE_ALGO_VERSION,
): DailyChallengeDefinition {
  if (!isValidDateKey(dateKey)) {
    throw new Error(`Invalid Tehran dateKey for daily challenge: "${dateKey}"`);
  }
  if (!SUPPORTED_DAILY_ALGO_VERSIONS.includes(algoVersion)) {
    throw new Error(`Unsupported daily puzzle algorithm version: ${algoVersion}`);
  }

  const seedInput = `qanatchi:daily:v${algoVersion}:${dateKey}`;
  const seed = hashStringFNV1a(seedInput);
  const templateIdx = selectDailyTemplateIndex(dateKey, algoVersion);
  const template = PUZZLE_TEMPLATES[templateIdx];

  const persianDateFa = formatPersianJalaliDate(dateKey);
  const level = buildDeterministicLevelFromTemplate(template, seed, {
    syntheticLevelId: 1000 + template.numericIndex,
    titleFa: template.titleFa,
    subtitleFa: template.introFa,
  });

  return {
    challengeId: `daily-v${algoVersion}-${dateKey}`,
    dateKey,
    algoVersion,
    seed,
    templateId: template.id,
    persianDateFa,
    titleFa: template.titleFa,
    introFa: template.introFa,
    difficulty: template.difficulty,
    level,
  };
}
