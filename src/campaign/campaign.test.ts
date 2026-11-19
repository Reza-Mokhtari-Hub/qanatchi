import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DESTINATIONS,
  getDestinationById,
  getDestinationForLevelId,
  getDestinationsByRegion,
} from './destinations';
import {
  detectCompletionMilestone,
  getCampaignSummary,
  getDestinationProgress,
  getRecommendedPlayableLevelId,
  getRegionProgress,
  isDestinationUnlocked,
  isLevelUnlocked,
  isRegionUnlocked,
  TOTAL_CAMPAIGN_LEVELS,
} from './progression';
import { getRegionById, REGIONS } from './regions';
import { getLevelsByDestination, LEVELS } from '../levels/levels';
import { calculateLevelScore } from '../engine/scoring';
import {
  clearProgress,
  createDefaultProgress,
  LEGACY_V1_PROGRESS_KEY,
  LEGACY_V2_PROGRESS_KEY,
  LEGACY_V3_PROGRESS_KEY,
  loadProgress,
  PROGRESS_STORAGE_KEY,
  recordLevelCompletion,
  STORAGE_SCHEMA_VERSION,
  type StorageLike,
} from '../storage/progressStorage';
import type { DestinationId, RegionId } from '../engine/types';

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

test('campaign structure matches exact 10-route, 40-destination, 80-level architecture', () => {
  assert.equal(REGIONS.length, 10);
  assert.equal(DESTINATIONS.length, 40);
  assert.equal(LEVELS.length, 80);
  assert.equal(TOTAL_CAMPAIGN_LEVELS, 80);

  // Verify exact 10 route IDs in order
  assert.deepEqual(
    REGIONS.map((r) => r.id),
    [
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
    ],
  );

  // Route 5 (Khorasan) and Route 10 (Razavi Khorasan) must be clearly distinct
  const route5 = getRegionById('khorasan');
  const route10 = getRegionById('razavi_khorasan');
  assert.notEqual(route5.id, route10.id);
  assert.notEqual(route5.nameFa, route10.nameFa);
  assert.equal(route5.nameFa, 'خراسان');
  assert.equal(route10.nameFa, 'خراسان رضوی');

  // Verify no duplicate destination IDs or duplicate level IDs (gapless 1..80)
  const destinationIds = new Set(DESTINATIONS.map((d) => d.id));
  assert.equal(destinationIds.size, 40);
  const levelIds = new Set(LEVELS.map((l) => l.id));
  assert.equal(levelIds.size, 80);
  for (let i = 0; i < 80; i++) {
    assert.equal(LEVELS[i].id, i + 1);
  }

  // Verify each route has exactly 4 destinations and 8 levels
  for (const region of REGIONS) {
    const regionDestinations = getDestinationsByRegion(region.id);
    assert.equal(regionDestinations.length, 4, `Region ${region.id} must have 4 destinations`);
    assert.deepEqual(
      regionDestinations.map((d) => d.id),
      region.destinationIds,
    );
    assert.equal(region.levelIds.length, 8);
  }

  // Verify exact destination roster per route and 2 levels per destination across all 10 routes
  const expectedRoster: Record<
    RegionId,
    Array<{ id: DestinationId; nameFa: string; levels: [number, number] }>
  > = {
    yazd: [
      { id: 'yazd', nameFa: 'یزد', levels: [1, 2] },
      { id: 'meybod', nameFa: 'میبد', levels: [3, 4] },
      { id: 'ardakan', nameFa: 'اردکان', levels: [5, 6] },
      { id: 'taft', nameFa: 'تفت', levels: [7, 8] },
    ],
    kerman: [
      { id: 'kerman', nameFa: 'کرمان', levels: [9, 10] },
      { id: 'mahan', nameFa: 'ماهان', levels: [11, 12] },
      { id: 'bam', nameFa: 'بم', levels: [13, 14] },
      { id: 'rayen', nameFa: 'راین', levels: [15, 16] },
    ],
    kashan: [
      { id: 'kashan', nameFa: 'کاشان', levels: [17, 18] },
      { id: 'abuzeydabad', nameFa: 'ابوزیدآباد', levels: [19, 20] },
      { id: 'niasar', nameFa: 'نیاسر', levels: [21, 22] },
      { id: 'qamsar', nameFa: 'قمصر', levels: [23, 24] },
    ],
    zanjan: [
      { id: 'zanjan', nameFa: 'زنجان', levels: [25, 26] },
      { id: 'ijrud', nameFa: 'ایجرود', levels: [27, 28] },
      { id: 'soltaniyeh', nameFa: 'سلطانیه', levels: [29, 30] },
      { id: 'mahneshan', nameFa: 'ماهنشان', levels: [31, 32] },
    ],
    khorasan: [
      { id: 'gonabad', nameFa: 'گناباد', levels: [33, 34] },
      { id: 'ferdows', nameFa: 'فردوس', levels: [35, 36] },
      { id: 'tabas', nameFa: 'طبس', levels: [37, 38] },
      { id: 'birjand', nameFa: 'بیرجند', levels: [39, 40] },
    ],
    isfahan: [
      { id: 'isfahan', nameFa: 'اصفهان', levels: [41, 42] },
      { id: 'ardestan', nameFa: 'اردستان', levels: [43, 44] },
      { id: 'nain', nameFa: 'نائین', levels: [45, 46] },
      { id: 'natanz', nameFa: 'نطنز', levels: [47, 48] },
    ],
    fars: [
      { id: 'shiraz', nameFa: 'شیراز', levels: [49, 50] },
      { id: 'neyriz', nameFa: 'نی‌ریز', levels: [51, 52] },
      { id: 'estahban', nameFa: 'استهبان', levels: [53, 54] },
      { id: 'abadeh', nameFa: 'آباده', levels: [55, 56] },
    ],
    semnan: [
      { id: 'garmsar', nameFa: 'گرمسار', levels: [57, 58] },
      { id: 'semnan', nameFa: 'سمنان', levels: [59, 60] },
      { id: 'damghan', nameFa: 'دامغان', levels: [61, 62] },
      { id: 'shahroud', nameFa: 'شاهرود', levels: [63, 64] },
    ],
    northwest: [
      { id: 'tabriz', nameFa: 'تبریز', levels: [65, 66] },
      { id: 'maragheh', nameFa: 'مراغه', levels: [67, 68] },
      { id: 'khoy', nameFa: 'خوی', levels: [69, 70] },
      { id: 'urmia', nameFa: 'ارومیه', levels: [71, 72] },
    ],
    razavi_khorasan: [
      { id: 'nishapur', nameFa: 'نیشابور', levels: [73, 74] },
      { id: 'sabzevar', nameFa: 'سبزوار', levels: [75, 76] },
      { id: 'kashmar', nameFa: 'کاشمر', levels: [77, 78] },
      { id: 'torbat_heydarieh', nameFa: 'تربت حیدریه', levels: [79, 80] },
    ],
  };

  for (const [regionId, expectedDests] of Object.entries(expectedRoster) as Array<
    [RegionId, Array<{ id: DestinationId; nameFa: string; levels: [number, number] }>]
  >) {
    const actualDests = getDestinationsByRegion(regionId);
    assert.equal(actualDests.length, expectedDests.length);
    for (let i = 0; i < expectedDests.length; i++) {
      const exp = expectedDests[i];
      const act = actualDests[i];
      assert.equal(act.id, exp.id);
      assert.equal(act.nameFa, exp.nameFa);
      assert.equal(act.regionId, regionId);
      assert.deepEqual(act.levelIds, exp.levels);

      const destLevels = getLevelsByDestination(act.id);
      assert.equal(destLevels.length, 2, `Destination ${act.id} must have 2 levels`);
      assert.deepEqual(
        destLevels.map((l) => l.id),
        exp.levels,
      );
      for (const lvl of destLevels) {
        assert.equal(lvl.regionId, regionId);
        assert.equal(lvl.destinationId, act.id);
        assert.equal(getDestinationForLevelId(lvl.id).id, act.id);
      }
    }
  }

  // Explicit spot checks for key preserved & new destinations
  assert.equal(getDestinationById('abuzeydabad').nameFa, 'ابوزیدآباد');
  assert.equal(getDestinationById('ijrud').nameFa, 'ایجرود');
  assert.equal(getDestinationById('isfahan').regionId, 'isfahan');
  assert.equal(getDestinationById('torbat_heydarieh').regionId, 'razavi_khorasan');
  assert.deepEqual(getDestinationById('torbat_heydarieh').levelIds, [79, 80]);
});

test('original Level IDs 1–40 preserve their exact regions and difficulty progression, and 41–80 follow regional assignments', () => {
  const expectedDifficulty1To24 = (id: number) => {
    if (id <= 4) return 'easy';
    if (id <= 8) return 'normal';
    if (id <= 12) return 'medium';
    if (id <= 16) return 'challenging';
    if (id <= 20) return 'hard';
    return 'expert';
  };

  const expectedRegion = (id: number): RegionId => {
    if (id <= 8) return 'yazd';
    if (id <= 16) return 'kerman';
    if (id <= 24) return 'kashan';
    if (id <= 32) return 'zanjan';
    if (id <= 40) return 'khorasan';
    if (id <= 48) return 'isfahan';
    if (id <= 56) return 'fars';
    if (id <= 64) return 'semnan';
    if (id <= 72) return 'northwest';
    return 'razavi_khorasan';
  };

  for (let i = 0; i < 80; i++) {
    const lvl = LEVELS[i];
    const id = i + 1;
    assert.equal(lvl.id, id);
    assert.equal(lvl.regionId, expectedRegion(id));
    if (id <= 24) {
      assert.equal(lvl.difficulty, expectedDifficulty1To24(id));
    } else {
      assert.ok(['medium', 'challenging', 'hard', 'expert'].includes(lvl.difficulty));
    }
  }
});

test('initial progression unlocks only Level 1, Route 1 (Yazd), and Destination 1 (yazd)', () => {
  const progress = createDefaultProgress();
  assert.equal(isLevelUnlocked(progress, 1), true);
  assert.equal(isLevelUnlocked(progress, 2), false);
  assert.equal(isLevelUnlocked(progress, 41), false);
  assert.equal(isLevelUnlocked(progress, 80), false);

  assert.equal(isRegionUnlocked(progress, 'yazd'), true);
  for (const r of REGIONS.slice(1)) {
    assert.equal(isRegionUnlocked(progress, r.id), false);
  }

  assert.equal(isDestinationUnlocked(progress, 'yazd'), true);
  assert.equal(isDestinationUnlocked(progress, 'meybod'), false);
  assert.equal(isDestinationUnlocked(progress, 'isfahan'), false);
  assert.equal(isDestinationUnlocked(progress, 'torbat_heydarieh'), false);

  const summary = getCampaignSummary(progress);
  assert.equal(summary.completedLevels, 0);
  assert.equal(summary.totalLevels, 80);
  assert.equal(summary.maxStars, 240);
  assert.equal(summary.completionPercent, 0);
  assert.equal(summary.unlockedRegionsCount, 1);
  assert.equal(summary.totalRegionsCount, 10);
});

test('sequential progression unlocks all 10 routes and completes all 80 levels with milestones', () => {
  const mem = createMemoryStorage();
  let progress = createDefaultProgress();

  const completeOne = (id: number) => {
    const lvl = LEVELS[id - 1];
    const score = calculateLevelScore({
      rotations: lvl.expectedMinMoves,
      expectedMinMoves: lvl.expectedMinMoves,
      elapsedSeconds: Math.max(15, Math.floor(lvl.parTimeSec * 0.6)),
      parTimeSec: lvl.parTimeSec,
      hintsUsed: 0,
    });
    const nextId = id < TOTAL_CAMPAIGN_LEVELS ? id + 1 : id;
    const before = progress;
    progress = recordLevelCompletion(progress, id, score, nextId, mem);
    return { before, after: progress };
  };

  // Level 1 -> Level 2 unlocks, first_qanat_restored triggers
  const r1 = completeOne(1);
  assert.equal(isLevelUnlocked(progress, 2), true);
  assert.equal(isLevelUnlocked(progress, 3), false);
  assert.equal(detectCompletionMilestone(r1.before, r1.after, 1)?.id, 'first_qanat_restored');

  // Level 2 -> Meybod unlocks
  completeOne(2);
  assert.equal(isDestinationUnlocked(progress, 'meybod'), true);
  assert.equal(getDestinationProgress(progress, 'yazd').isCompleted, true);
  assert.equal(getDestinationProgress(progress, 'yazd').earnedStars, 6);

  // Route unlock gates at 8, 16, 24, 32, 40, 48, 56, 64, 72
  const routeGates: Array<{
    gateLevel: number;
    unlocksRegion: RegionId;
    unlocksFirstDest: DestinationId;
    milestoneId: string;
  }> = [
    { gateLevel: 8, unlocksRegion: 'kerman', unlocksFirstDest: 'kerman', milestoneId: 'unlock_kerman' },
    { gateLevel: 16, unlocksRegion: 'kashan', unlocksFirstDest: 'kashan', milestoneId: 'unlock_kashan' },
    { gateLevel: 24, unlocksRegion: 'zanjan', unlocksFirstDest: 'zanjan', milestoneId: 'unlock_zanjan' },
    { gateLevel: 32, unlocksRegion: 'khorasan', unlocksFirstDest: 'gonabad', milestoneId: 'unlock_khorasan' },
    { gateLevel: 40, unlocksRegion: 'isfahan', unlocksFirstDest: 'isfahan', milestoneId: 'unlock_isfahan' },
    { gateLevel: 48, unlocksRegion: 'fars', unlocksFirstDest: 'shiraz', milestoneId: 'unlock_fars' },
    { gateLevel: 56, unlocksRegion: 'semnan', unlocksFirstDest: 'garmsar', milestoneId: 'unlock_semnan' },
    { gateLevel: 64, unlocksRegion: 'northwest', unlocksFirstDest: 'tabriz', milestoneId: 'unlock_northwest' },
    {
      gateLevel: 72,
      unlocksRegion: 'razavi_khorasan',
      unlocksFirstDest: 'nishapur',
      milestoneId: 'unlock_razavi_khorasan',
    },
  ];

  let current = 3;
  for (const gate of routeGates) {
    while (current < gate.gateLevel) {
      completeOne(current);
      current++;
    }
    assert.equal(isRegionUnlocked(progress, gate.unlocksRegion), false);
    assert.equal(isLevelUnlocked(progress, gate.gateLevel + 1), false);

    const res = completeOne(gate.gateLevel);
    current++;
    assert.equal(isRegionUnlocked(progress, gate.unlocksRegion), true);
    assert.equal(isLevelUnlocked(progress, gate.gateLevel + 1), true);
    assert.equal(isDestinationUnlocked(progress, gate.unlocksFirstDest), true);
    assert.equal(getCampaignSummary(progress).isCampaignCompleted, false);
    assert.equal(detectCompletionMilestone(res.before, res.after, gate.gateLevel)?.id, gate.milestoneId);
  }

  // Complete Levels 73..79
  for (let id = 73; id <= 79; id++) completeOne(id);
  assert.equal(getCampaignSummary(progress).completedLevels, 79);
  assert.equal(getCampaignSummary(progress).isCampaignCompleted, false);
  assert.equal(isLevelUnlocked(progress, 80), true);

  // Level 80 -> 80-level Campaign completion!
  const r80 = completeOne(80);
  const finalSummary = getCampaignSummary(progress);
  assert.equal(finalSummary.completedLevels, 80);
  assert.equal(finalSummary.totalLevels, 80);
  assert.equal(finalSummary.completionPercent, 100);
  assert.equal(finalSummary.earnedStars, 240);
  assert.equal(finalSummary.maxStars, 240);
  assert.equal(finalSummary.unlockedRegionsCount, 10);
  assert.equal(finalSummary.totalRegionsCount, 10);
  assert.equal(finalSummary.isCampaignCompleted, true);
  assert.equal(getRegionProgress(progress, 'razavi_khorasan').completionPercent, 100);
  assert.equal(detectCompletionMilestone(r80.before, r80.after, 80)?.id, 'campaign_complete');
});

test('replaying an older completed level never erases better stars, score, moves, time, or later unlocked routes', () => {
  const mem = createMemoryStorage();
  let progress = createDefaultProgress();

  for (let id = 1; id <= 41; id++) {
    const lvl = LEVELS[id - 1];
    const greatScore = calculateLevelScore({
      rotations: lvl.expectedMinMoves,
      expectedMinMoves: lvl.expectedMinMoves,
      elapsedSeconds: 20,
      parTimeSec: lvl.parTimeSec,
      hintsUsed: 0,
    });
    progress = recordLevelCompletion(progress, id, greatScore, id + 1, mem);
  }
  const origL1 = progress.levels[1];
  assert.equal(origL1.bestStars, 3);
  assert.equal(progress.highestUnlockedLevelId, 42);
  assert.equal(isRegionUnlocked(progress, 'isfahan'), true);

  const worseReplay = calculateLevelScore({
    rotations: 35,
    expectedMinMoves: LEVELS[0].expectedMinMoves,
    elapsedSeconds: 180,
    parTimeSec: LEVELS[0].parTimeSec,
    hintsUsed: 3,
  });
  assert.equal(worseReplay.stars, 1);
  const afterReplay = recordLevelCompletion(progress, 1, worseReplay, 2, mem);

  assert.equal(afterReplay.levels[1].bestStars, 3);
  assert.equal(afterReplay.levels[1].bestScore, origL1.bestScore);
  assert.equal(afterReplay.levels[1].bestMoves, origL1.bestMoves);
  assert.equal(afterReplay.levels[1].bestTimeSec, origL1.bestTimeSec);
  assert.equal(afterReplay.highestUnlockedLevelId, 42);
  assert.equal(isLevelUnlocked(afterReplay, 42), true);
  assert.equal(isRegionUnlocked(afterReplay, 'isfahan'), true);
});

test('lossless migration from Phase 1 v1 storage preserves all stars, scores, and unlocks into v4', () => {
  const mem = createMemoryStorage();
  const phase1Payload = {
    version: 1,
    lastPlayedLevelId: 4,
    levels: {
      1: {
        levelId: 1,
        completed: true,
        bestStars: 3,
        bestScore: 1980,
        bestMoves: 6,
        bestTimeSec: 21,
        completedAt: '2026-11-19T12:00:00.000Z',
      },
      2: {
        levelId: 2,
        completed: true,
        bestStars: 2,
        bestScore: 1620,
        bestMoves: 14,
        bestTimeSec: 48,
        completedAt: '2026-11-19T12:05:00.000Z',
      },
      3: {
        levelId: 3,
        completed: true,
        bestStars: 3,
        bestScore: 1950,
        bestMoves: 11,
        bestTimeSec: 39,
        completedAt: '2026-11-19T12:10:00.000Z',
      },
    },
  };
  mem.setItem(LEGACY_V1_PROGRESS_KEY, JSON.stringify(phase1Payload));

  const migrated = loadProgress(mem);
  assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);
  assert.equal(migrated.levels[1].bestStars, 3);
  assert.equal(migrated.levels[1].bestScore, 1980);
  assert.equal(migrated.levels[2].bestStars, 2);
  assert.equal(migrated.levels[3].bestScore, 1950);
  assert.equal(migrated.highestUnlockedLevelId, 4);
  assert.equal(migrated.lastPlayedLevelId, 4);
  assert.deepEqual(migrated.unlockedRegions, ['yazd']);
  assert.ok(mem.getItem(PROGRESS_STORAGE_KEY) !== null);
});

test('migration from completed 24/24 Phase 6 v2 storage unlocks Level 25 & Zanjan without falsely completing 25–80', () => {
  const mem = createMemoryStorage();
  const levels: Record<number, unknown> = {};
  for (let id = 1; id <= 24; id++) {
    levels[id] = {
      levelId: id,
      completed: true,
      bestStars: 3,
      bestScore: 2000 + id,
      bestMoves: LEVELS[id - 1].expectedMinMoves,
      bestTimeSec: 30,
      completedAt: '2026-11-19T12:00:00.000Z',
    };
  }
  const v2Completed24 = {
    version: 2,
    lastPlayedLevelId: 24,
    highestUnlockedLevelId: 24,
    lastSelectedRegionId: 'kashan',
    unlockedRegions: ['yazd', 'kerman', 'kashan'],
    seenStoryIds: [
      'enter_yazd',
      'first_qanat_restored',
      'unlock_kerman',
      'unlock_kashan',
      'campaign_complete',
    ],
    levels,
  };
  mem.setItem(LEGACY_V2_PROGRESS_KEY, JSON.stringify(v2Completed24));

  const migrated = loadProgress(mem);
  assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);

  for (let id = 1; id <= 24; id++) {
    assert.equal(migrated.levels[id]?.completed, true);
    assert.equal(migrated.levels[id]?.bestStars, 3);
    assert.equal(migrated.levels[id]?.bestScore, 2000 + id);
  }
  for (let id = 25; id <= 80; id++) {
    assert.equal(migrated.levels[id], undefined);
  }

  assert.equal(migrated.highestUnlockedLevelId, 25);
  assert.equal(migrated.lastPlayedLevelId, 25);
  assert.equal(migrated.lastSelectedRegionId, 'zanjan');
  assert.equal(isRegionUnlocked(migrated, 'zanjan'), true);
  assert.equal(isRegionUnlocked(migrated, 'khorasan'), false);
  assert.equal(isRegionUnlocked(migrated, 'isfahan'), false);
  assert.equal(migrated.seenStoryIds.includes('campaign_complete'), false);
  assert.equal(getCampaignSummary(migrated).completedLevels, 24);
  assert.equal(getCampaignSummary(migrated).totalLevels, 80);
});

test('lossless migration from Phase 7 v3 partial save preserves exact progress into v4', () => {
  const mem = createMemoryStorage();
  const levels: Record<number, unknown> = {};
  for (let id = 1; id <= 30; id++) {
    levels[id] = {
      levelId: id,
      completed: true,
      bestStars: id % 3 === 0 ? 2 : 3,
      bestScore: 1700 + id * 10,
      bestMoves: LEVELS[id - 1].expectedMinMoves + 1,
      bestTimeSec: 40 + id,
      completedAt: '2026-11-19T12:00:00.000Z',
    };
  }
  mem.setItem(
    LEGACY_V3_PROGRESS_KEY,
    JSON.stringify({
      version: 3,
      lastPlayedLevelId: 31,
      highestUnlockedLevelId: 31,
      lastSelectedRegionId: 'zanjan',
      unlockedRegions: ['yazd', 'kerman', 'kashan', 'zanjan'],
      seenStoryIds: ['enter_yazd', 'first_qanat_restored', 'unlock_kerman', 'unlock_kashan', 'unlock_zanjan'],
      levels,
    }),
  );

  const migrated = loadProgress(mem);
  assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);
  assert.equal(Object.keys(migrated.levels).length, 30);
  assert.equal(migrated.levels[30].bestScore, 2000);
  assert.equal(migrated.highestUnlockedLevelId, 31);
  assert.equal(migrated.lastPlayedLevelId, 31);
  assert.equal(migrated.lastSelectedRegionId, 'zanjan');
  assert.equal(isRegionUnlocked(migrated, 'zanjan'), true);
  assert.equal(isRegionUnlocked(migrated, 'khorasan'), false);
  assert.equal(isRegionUnlocked(migrated, 'isfahan'), false);
  assert.equal(getRecommendedPlayableLevelId(migrated), 31);
  assert.ok(mem.getItem(PROGRESS_STORAGE_KEY) !== null);
});

test('migration from completed 40/40 Phase 7 v3 storage unlocks Level 41 & Isfahan Plateau without falsely completing 41–80', () => {
  const mem = createMemoryStorage();
  const levels: Record<number, unknown> = {};
  for (let id = 1; id <= 40; id++) {
    levels[id] = {
      levelId: id,
      completed: true,
      bestStars: 3,
      bestScore: 2100 + id,
      bestMoves: LEVELS[id - 1].expectedMinMoves,
      bestTimeSec: 35,
      completedAt: '2026-11-19T12:00:00.000Z',
    };
  }
  const v3Completed40 = {
    version: 3,
    lastPlayedLevelId: 40,
    highestUnlockedLevelId: 40,
    lastSelectedRegionId: 'khorasan',
    unlockedRegions: ['yazd', 'kerman', 'kashan', 'zanjan', 'khorasan'],
    seenStoryIds: [
      'enter_yazd',
      'first_qanat_restored',
      'unlock_kerman',
      'unlock_kashan',
      'unlock_zanjan',
      'unlock_khorasan',
      'campaign_complete',
    ],
    levels,
  };
  mem.setItem(LEGACY_V3_PROGRESS_KEY, JSON.stringify(v3Completed40));

  const migrated = loadProgress(mem);
  assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);

  // All 40 completed records preserved verbatim
  for (let id = 1; id <= 40; id++) {
    assert.equal(migrated.levels[id]?.completed, true);
    assert.equal(migrated.levels[id]?.bestStars, 3);
    assert.equal(migrated.levels[id]?.bestScore, 2100 + id);
  }
  // Levels 41–80 MUST NOT be falsely marked completed
  for (let id = 41; id <= 80; id++) {
    assert.equal(migrated.levels[id], undefined, `Level ${id} must not be marked completed on migration`);
  }

  // Level 41 & Isfahan Plateau MUST automatically unlock; Routes 7–10 stay locked
  assert.equal(migrated.highestUnlockedLevelId, 41);
  assert.equal(migrated.lastPlayedLevelId, 41);
  assert.equal(migrated.lastSelectedRegionId, 'isfahan');
  assert.equal(isLevelUnlocked(migrated, 41), true);
  assert.equal(isLevelUnlocked(migrated, 42), false);
  assert.equal(isRegionUnlocked(migrated, 'isfahan'), true);
  assert.equal(isRegionUnlocked(migrated, 'fars'), false);
  assert.equal(isRegionUnlocked(migrated, 'semnan'), false);
  assert.equal(isRegionUnlocked(migrated, 'northwest'), false);
  assert.equal(isRegionUnlocked(migrated, 'razavi_khorasan'), false);
  assert.equal(getRecommendedPlayableLevelId(migrated), 41);

  // Pre-v4 'campaign_complete' cleared so the 80-level finale will trigger on Level 80
  assert.equal(migrated.seenStoryIds.includes('campaign_complete'), false);

  const summary = getCampaignSummary(migrated);
  assert.equal(summary.completedLevels, 40);
  assert.equal(summary.totalLevels, 80);
  assert.equal(summary.completionPercent, 50);
  assert.equal(summary.unlockedRegionsCount, 6);
  assert.equal(summary.totalRegionsCount, 10);
  assert.equal(summary.isCampaignCompleted, false);
});

test('corrupted and incomplete storage payloads are handled safely without crashing', () => {
  const mem = createMemoryStorage();

  mem.setItem(PROGRESS_STORAGE_KEY, '{not-valid-json');
  assert.deepEqual(loadProgress(mem), createDefaultProgress());

  mem.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      version: 4,
      lastPlayedLevelId: 999,
      highestUnlockedLevelId: -5,
      unlockedRegions: ['atlantis', 123],
      levels: {
        1: { completed: true, bestStars: 99, bestScore: -20 },
        999: { completed: true, bestStars: 3 },
      },
    }),
  );
  const safe = loadProgress(mem);
  assert.equal(safe.version, STORAGE_SCHEMA_VERSION);
  assert.equal(safe.levels[1].bestStars, 3);
  assert.equal(safe.levels[1].bestScore, 0);
  assert.equal(safe.levels[999], undefined);
  assert.equal(safe.highestUnlockedLevelId, 2);
  assert.deepEqual(safe.unlockedRegions, ['yazd']);

  clearProgress(mem);
  assert.equal(mem.getItem(PROGRESS_STORAGE_KEY), null);
  assert.equal(mem.getItem(LEGACY_V3_PROGRESS_KEY), null);
  assert.equal(mem.getItem(LEGACY_V2_PROGRESS_KEY), null);
  assert.equal(mem.getItem(LEGACY_V1_PROGRESS_KEY), null);
});
