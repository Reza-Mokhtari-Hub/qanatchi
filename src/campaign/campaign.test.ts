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
  LEGACY_V4_PROGRESS_KEY,
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

function buildMockLevelsRecord(maxId: number, starPattern: 'all3' | 'mixed' = 'all3') {
  const levels: Record<number, unknown> = {};
  for (let id = 1; id <= maxId; id++) {
    levels[id] = {
      levelId: id,
      completed: true,
      bestStars: starPattern === 'mixed' && id % 3 === 0 ? 2 : 3,
      bestScore: 2000 + id * 5,
      bestMoves: LEVELS[id - 1].expectedMinMoves,
      bestTimeSec: 32,
      completedAt: '2026-11-19T12:00:00.000Z',
    };
  }
  return levels;
}

test('campaign structure matches exact 12-route, 50-destination, 100-level architecture with variable route lengths', () => {
  assert.equal(REGIONS.length, 12);
  assert.equal(DESTINATIONS.length, 50);
  assert.equal(LEVELS.length, 100);
  assert.equal(TOTAL_CAMPAIGN_LEVELS, 100);

  // Verify exact 12 route IDs in order
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
      'shahsavan',
      'turkmen_sahra',
    ],
  );

  // Route 5 (Khorasan) and Route 10 (Razavi Khorasan), as well as Route 11 & 12 must be distinct
  const route5 = getRegionById('khorasan');
  const route10 = getRegionById('razavi_khorasan');
  const route11 = getRegionById('shahsavan');
  const route12 = getRegionById('turkmen_sahra');
  assert.notEqual(route5.id, route10.id);
  assert.equal(route5.nameFa, 'خراسان');
  assert.equal(route10.nameFa, 'خراسان رضوی');
  assert.equal(route11.nameFa, 'راه کوچ شاهسون');
  assert.equal(route12.nameFa, 'راه ترکمن‌صحرا');

  // Verify no duplicate destination IDs or duplicate level IDs (gapless 1..100)
  const destinationIds = new Set(DESTINATIONS.map((d) => d.id));
  assert.equal(destinationIds.size, 50);
  const levelIds = new Set(LEVELS.map((l) => l.id));
  assert.equal(levelIds.size, 100);
  for (let i = 0; i < 100; i++) {
    assert.equal(LEVELS[i].id, i + 1);
  }

  // Variable route lengths: Routes 1–10 have 4 destinations & 8 levels; Routes 11–12 have 5 destinations & 10 levels
  for (const region of REGIONS) {
    const regionDestinations = getDestinationsByRegion(region.id);
    const expectedDestCount = region.order <= 10 ? 4 : 5;
    const expectedLevelCount = expectedDestCount * 2;
    assert.equal(
      regionDestinations.length,
      expectedDestCount,
      `Region ${region.id} must have ${expectedDestCount} destinations`,
    );
    assert.deepEqual(
      regionDestinations.map((d) => d.id),
      region.destinationIds,
    );
    assert.equal(
      region.levelIds.length,
      expectedLevelCount,
      `Region ${region.id} must have ${expectedLevelCount} levels`,
    );
  }

  // Verify exact destination roster per route and 2 levels per destination across all 12 routes
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
    shahsavan: [
      { id: 'parsabad', nameFa: 'پارس‌آباد', levels: [81, 82] },
      { id: 'bileh_savar', nameFa: 'بیله‌سوار', levels: [83, 84] },
      { id: 'germi', nameFa: 'گرمی', levels: [85, 86] },
      { id: 'meshgin_shahr', nameFa: 'مشگین‌شهر', levels: [87, 88] },
      { id: 'ardabil_sabalan', nameFa: 'اردبیل و دامنه سبلان', levels: [89, 90] },
    ],
    turkmen_sahra: [
      { id: 'gonbad_kavus', nameFa: 'گنبد کاووس', levels: [91, 92] },
      { id: 'aq_qala', nameFa: 'آق‌قلا', levels: [93, 94] },
      { id: 'bandar_torkaman', nameFa: 'بندر ترکمن', levels: [95, 96] },
      { id: 'gomishan', nameFa: 'گمیشان / گمیش‌تپه', levels: [97, 98] },
      { id: 'maraveh_tappeh', nameFa: 'مراوه‌تپه', levels: [99, 100] },
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

  // Explicit spot checks for key preserved & Phase 9 destinations
  assert.equal(getDestinationById('abuzeydabad').nameFa, 'ابوزیدآباد');
  assert.equal(getDestinationById('ijrud').nameFa, 'ایجرود');
  assert.equal(getDestinationById('torbat_heydarieh').regionId, 'razavi_khorasan');
  assert.equal(getDestinationById('parsabad').regionId, 'shahsavan');
  assert.equal(getDestinationById('ardabil_sabalan').nameFa, 'اردبیل و دامنه سبلان');
  assert.equal(getDestinationById('gonbad_kavus').regionId, 'turkmen_sahra');
  assert.deepEqual(getDestinationById('maraveh_tappeh').levelIds, [99, 100]);
});

test('original Level IDs 1–80 preserve their exact regions and difficulty progression, and 81–100 follow Routes 11–12', () => {
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
    if (id <= 80) return 'razavi_khorasan';
    if (id <= 90) return 'shahsavan';
    return 'turkmen_sahra';
  };

  for (let i = 0; i < 100; i++) {
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
  assert.equal(isLevelUnlocked(progress, 81), false);
  assert.equal(isLevelUnlocked(progress, 100), false);

  assert.equal(isRegionUnlocked(progress, 'yazd'), true);
  for (const r of REGIONS.slice(1)) {
    assert.equal(isRegionUnlocked(progress, r.id), false);
  }

  assert.equal(isDestinationUnlocked(progress, 'yazd'), true);
  assert.equal(isDestinationUnlocked(progress, 'meybod'), false);
  assert.equal(isDestinationUnlocked(progress, 'parsabad'), false);
  assert.equal(isDestinationUnlocked(progress, 'maraveh_tappeh'), false);

  const summary = getCampaignSummary(progress);
  assert.equal(summary.completedLevels, 0);
  assert.equal(summary.totalLevels, 100);
  assert.equal(summary.maxStars, 300);
  assert.equal(summary.completionPercent, 0);
  assert.equal(summary.unlockedRegionsCount, 1);
  assert.equal(summary.totalRegionsCount, 12);
});

test('sequential progression unlocks all 12 routes and completes all 100 levels with milestones', () => {
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

  // Route unlock gates at 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 90
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
    {
      gateLevel: 80,
      unlocksRegion: 'shahsavan',
      unlocksFirstDest: 'parsabad',
      milestoneId: 'unlock_shahsavan',
    },
    {
      gateLevel: 90,
      unlocksRegion: 'turkmen_sahra',
      unlocksFirstDest: 'gonbad_kavus',
      milestoneId: 'unlock_turkmen_sahra',
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

  // Verify variable route progress percentages cleanly for Route 11 (10 levels)
  const r11Progress = getRegionProgress(progress, 'shahsavan');
  assert.equal(r11Progress.totalCount, 10);
  assert.equal(r11Progress.completedCount, 10);
  assert.equal(r11Progress.maxStars, 30);
  assert.equal(r11Progress.completionPercent, 100);

  // Complete Levels 91..99 (Routes 12 has 10 levels)
  for (let id = 91; id <= 99; id++) completeOne(id);
  const partial12 = getRegionProgress(progress, 'turkmen_sahra');
  assert.equal(partial12.totalCount, 10);
  assert.equal(partial12.completedCount, 9);
  assert.equal(partial12.completionPercent, 90);
  assert.equal(getCampaignSummary(progress).completedLevels, 99);
  assert.equal(getCampaignSummary(progress).isCampaignCompleted, false);
  assert.equal(isLevelUnlocked(progress, 100), true);

  // Level 100 -> 100-level Campaign completion!
  const r100 = completeOne(100);
  const finalSummary = getCampaignSummary(progress);
  assert.equal(finalSummary.completedLevels, 100);
  assert.equal(finalSummary.totalLevels, 100);
  assert.equal(finalSummary.completionPercent, 100);
  assert.equal(finalSummary.earnedStars, 300);
  assert.equal(finalSummary.maxStars, 300);
  assert.equal(finalSummary.unlockedRegionsCount, 12);
  assert.equal(finalSummary.totalRegionsCount, 12);
  assert.equal(finalSummary.isCampaignCompleted, true);
  assert.equal(getRegionProgress(progress, 'turkmen_sahra').completionPercent, 100);
  assert.equal(detectCompletionMilestone(r100.before, r100.after, 100)?.id, 'campaign_complete');
});

test('replaying an older completed level never erases better stars, score, moves, time, or later unlocked routes', () => {
  const mem = createMemoryStorage();
  let progress = createDefaultProgress();

  for (let id = 1; id <= 85; id++) {
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
  assert.equal(progress.highestUnlockedLevelId, 86);
  assert.equal(isRegionUnlocked(progress, 'shahsavan'), true);

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
  assert.equal(afterReplay.highestUnlockedLevelId, 86);
  assert.equal(isLevelUnlocked(afterReplay, 86), true);
  assert.equal(isRegionUnlocked(afterReplay, 'shahsavan'), true);
});

test('lossless migration from Phase 1 v1, v2 24/24, and v3 40/40 storage preserves progress cleanly into v5', () => {
  // v1 partial
  {
    const mem = createMemoryStorage();
    mem.setItem(
      LEGACY_V1_PROGRESS_KEY,
      JSON.stringify({
        version: 1,
        lastPlayedLevelId: 4,
        levels: buildMockLevelsRecord(3, 'mixed'),
      }),
    );
    const migrated = loadProgress(mem);
    assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);
    assert.equal(migrated.highestUnlockedLevelId, 4);
    assert.deepEqual(migrated.unlockedRegions, ['yazd']);
    assert.ok(mem.getItem(PROGRESS_STORAGE_KEY) !== null);
  }

  // v2 24/24
  {
    const mem = createMemoryStorage();
    mem.setItem(
      LEGACY_V2_PROGRESS_KEY,
      JSON.stringify({
        version: 2,
        lastPlayedLevelId: 24,
        highestUnlockedLevelId: 24,
        lastSelectedRegionId: 'kashan',
        unlockedRegions: ['yazd', 'kerman', 'kashan'],
        seenStoryIds: ['enter_yazd', 'first_qanat_restored', 'unlock_kerman', 'unlock_kashan', 'campaign_complete'],
        levels: buildMockLevelsRecord(24),
      }),
    );
    const migrated = loadProgress(mem);
    assert.equal(migrated.highestUnlockedLevelId, 25);
    assert.equal(migrated.lastSelectedRegionId, 'zanjan');
    assert.equal(migrated.seenStoryIds.includes('campaign_complete'), false);
    assert.equal(getCampaignSummary(migrated).completedLevels, 24);
  }

  // v3 40/40
  {
    const mem = createMemoryStorage();
    mem.setItem(
      LEGACY_V3_PROGRESS_KEY,
      JSON.stringify({
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
        levels: buildMockLevelsRecord(40),
      }),
    );
    const migrated = loadProgress(mem);
    assert.equal(migrated.highestUnlockedLevelId, 41);
    assert.equal(migrated.lastSelectedRegionId, 'isfahan');
    assert.equal(isRegionUnlocked(migrated, 'isfahan'), true);
    assert.equal(isRegionUnlocked(migrated, 'shahsavan'), false);
    assert.equal(migrated.seenStoryIds.includes('campaign_complete'), false);
    assert.equal(getCampaignSummary(migrated).completedLevels, 40);
  }
});

test('migration from partial Phase 8 v4 saves (20/80, 40/80, 60/80) preserves exact unlocks into v5', () => {
  for (const completedCount of [20, 40, 60] as const) {
    const mem = createMemoryStorage();
    const expectedRegion: RegionId =
      completedCount === 20 ? 'kashan' : completedCount === 40 ? 'isfahan' : 'semnan';
    const expectedUnlockedCount = completedCount === 20 ? 3 : completedCount === 40 ? 6 : 8;

    mem.setItem(
      LEGACY_V4_PROGRESS_KEY,
      JSON.stringify({
        version: 4,
        lastPlayedLevelId: completedCount + 1,
        highestUnlockedLevelId: completedCount + 1,
        lastSelectedRegionId: expectedRegion,
        unlockedRegions: REGIONS.slice(0, expectedUnlockedCount).map((r) => r.id),
        seenStoryIds: ['enter_yazd'],
        levels: buildMockLevelsRecord(completedCount, 'mixed'),
      }),
    );

    const migrated = loadProgress(mem);
    assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);
    assert.equal(getCampaignSummary(migrated).completedLevels, completedCount);
    assert.equal(getCampaignSummary(migrated).totalLevels, 100);
    assert.equal(migrated.highestUnlockedLevelId, completedCount + 1);
    assert.equal(isRegionUnlocked(migrated, expectedRegion), true);
    assert.equal(isRegionUnlocked(migrated, 'shahsavan'), false);
    assert.equal(isRegionUnlocked(migrated, 'turkmen_sahra'), false);
    assert.equal(migrated.levels[completedCount + 1], undefined);
  }
});

test('migration from completed 80/80 Phase 8 v4 storage unlocks Level 81 & Shahsavan without falsely completing 81–100', () => {
  const mem = createMemoryStorage();
  const v4Completed80 = {
    version: 4,
    lastPlayedLevelId: 80,
    highestUnlockedLevelId: 80,
    lastSelectedRegionId: 'razavi_khorasan',
    unlockedRegions: REGIONS.slice(0, 10).map((r) => r.id),
    seenStoryIds: [
      'enter_yazd',
      'first_qanat_restored',
      'unlock_kerman',
      'unlock_kashan',
      'unlock_zanjan',
      'unlock_khorasan',
      'unlock_isfahan',
      'unlock_fars',
      'unlock_semnan',
      'unlock_northwest',
      'unlock_razavi_khorasan',
      'campaign_complete',
    ],
    levels: buildMockLevelsRecord(80),
  };
  mem.setItem(LEGACY_V4_PROGRESS_KEY, JSON.stringify(v4Completed80));

  const migrated = loadProgress(mem);
  assert.equal(migrated.version, STORAGE_SCHEMA_VERSION);

  // All 80 completed records preserved verbatim
  for (let id = 1; id <= 80; id++) {
    assert.equal(migrated.levels[id]?.completed, true);
    assert.equal(migrated.levels[id]?.bestStars, 3);
    assert.equal(migrated.levels[id]?.bestScore, 2000 + id * 5);
  }
  // Levels 81–100 MUST NOT be falsely marked completed
  for (let id = 81; id <= 100; id++) {
    assert.equal(migrated.levels[id], undefined, `Level ${id} must not be marked completed on migration`);
  }

  // Level 81 & Shahsavan MUST automatically unlock; Turkmen Sahra stays locked
  assert.equal(migrated.highestUnlockedLevelId, 81);
  assert.equal(migrated.lastPlayedLevelId, 81);
  assert.equal(migrated.lastSelectedRegionId, 'shahsavan');
  assert.equal(isLevelUnlocked(migrated, 81), true);
  assert.equal(isLevelUnlocked(migrated, 82), false);
  assert.equal(isRegionUnlocked(migrated, 'shahsavan'), true);
  assert.equal(isRegionUnlocked(migrated, 'turkmen_sahra'), false);
  assert.equal(getRecommendedPlayableLevelId(migrated), 81);

  // Pre-v5 'campaign_complete' cleared so the 100-level finale will trigger on Level 100
  assert.equal(migrated.seenStoryIds.includes('campaign_complete'), false);

  const summary = getCampaignSummary(migrated);
  assert.equal(summary.completedLevels, 80);
  assert.equal(summary.totalLevels, 100);
  assert.equal(summary.completionPercent, 80);
  assert.equal(summary.unlockedRegionsCount, 11);
  assert.equal(summary.totalRegionsCount, 12);
  assert.equal(summary.isCampaignCompleted, false);
});

test('partial Shahsavan progress (85/100), Level 90 Turkmen unlock, and Level 100 completion persist cleanly', () => {
  const mem = createMemoryStorage();
  let progress = createDefaultProgress();

  // Seed partial Shahsavan (1..85 completed)
  mem.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_SCHEMA_VERSION,
      lastPlayedLevelId: 86,
      highestUnlockedLevelId: 86,
      lastSelectedRegionId: 'shahsavan',
      unlockedRegions: REGIONS.slice(0, 11).map((r) => r.id),
      seenStoryIds: ['enter_yazd', 'unlock_shahsavan'],
      levels: buildMockLevelsRecord(85),
    }),
  );

  progress = loadProgress(mem);
  assert.equal(getCampaignSummary(progress).completedLevels, 85);
  assert.equal(isLevelUnlocked(progress, 86), true);
  assert.equal(isRegionUnlocked(progress, 'turkmen_sahra'), false);

  // Complete 86..90 -> Turkmen Sahra unlocks
  for (let id = 86; id <= 90; id++) {
    const lvl = LEVELS[id - 1];
    progress = recordLevelCompletion(
      progress,
      id,
      calculateLevelScore({
        rotations: lvl.expectedMinMoves,
        expectedMinMoves: lvl.expectedMinMoves,
        elapsedSeconds: 30,
        parTimeSec: lvl.parTimeSec,
        hintsUsed: 0,
      }),
      id + 1,
      mem,
    );
  }
  assert.equal(isRegionUnlocked(progress, 'turkmen_sahra'), true);
  assert.equal(isLevelUnlocked(progress, 91), true);
  assert.equal(isLevelUnlocked(progress, 92), false);

  // Complete 91..100 -> True 100/100 completion
  for (let id = 91; id <= 100; id++) {
    const lvl = LEVELS[id - 1];
    progress = recordLevelCompletion(
      progress,
      id,
      calculateLevelScore({
        rotations: lvl.expectedMinMoves,
        expectedMinMoves: lvl.expectedMinMoves,
        elapsedSeconds: 35,
        parTimeSec: lvl.parTimeSec,
        hintsUsed: 0,
      }),
      id < 100 ? id + 1 : 100,
      mem,
    );
  }
  const reloaded = loadProgress(mem);
  const summary = getCampaignSummary(reloaded);
  assert.equal(summary.completedLevels, 100);
  assert.equal(summary.earnedStars, 300);
  assert.equal(summary.isCampaignCompleted, true);
});

test('corrupted and incomplete storage payloads are handled safely without crashing', () => {
  const mem = createMemoryStorage();

  mem.setItem(PROGRESS_STORAGE_KEY, '{not-valid-json');
  assert.deepEqual(loadProgress(mem), createDefaultProgress());

  mem.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      version: 5,
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
  assert.equal(mem.getItem(LEGACY_V4_PROGRESS_KEY), null);
  assert.equal(mem.getItem(LEGACY_V3_PROGRESS_KEY), null);
  assert.equal(mem.getItem(LEGACY_V2_PROGRESS_KEY), null);
  assert.equal(mem.getItem(LEGACY_V1_PROGRESS_KEY), null);
});
