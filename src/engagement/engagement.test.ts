import assert from 'node:assert/strict';
import test from 'node:test';
import { TOTAL_CAMPAIGN_LEVELS } from '../campaign/progression';
import { verifyLevel } from '../engine/verifier';
import {
  clearProgress,
  createDefaultProgress,
  loadProgress,
  recordLevelCompletion,
  type StorageLike,
} from '../storage/progressStorage';
import {
  clearEngagementData,
  createDefaultEngagementData,
  ENGAGEMENT_STORAGE_KEY,
  loadEngagementData,
  MAX_DAILY_RECORDS,
  MAX_FRIEND_RECORDS,
  recordDailyChallengeCompletion,
  recordFriendChallengeCompletion,
} from '../storage/engagementStorage';
import { DAILY_PUZZLE_ALGO_VERSION, generateDailyChallenge } from './dailyChallenge';
import { calculateDailyScore } from './dailyScoring';
import {
  applyDailyCompletionToStreak,
  createInitialStreak,
  getEffectiveStreak,
} from './dailyStreak';
import {
  buildFriendChallengeUrl,
  createFriendChallengeByDifficulty,
  createFriendChallengeFromTemplate,
  encodeFriendChallengeId,
  parseFriendChallengeCode,
  parseFriendChallengeFromSearch,
} from './friendChallenge';
import { PUZZLE_TEMPLATES } from './puzzleTemplates';
import { buildDeterministicLevelFromTemplate } from './puzzleTransform';
import { copyChallengeLink, shareChallengeLink } from './shareUtils';
import { computePersonalStatistics } from './statistics';
import {
  diffTehranDateKeys,
  formatPersianJalaliDate,
  getMsUntilNextTehranDay,
  getTehranDateKey,
  shiftDateKey,
} from './tehranTime';

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

// ---------------------------------------------------------------------------
// 1. PUZZLE TEMPLATES & DAILY CHALLENGES
// ---------------------------------------------------------------------------

test('all 12 daily/friend puzzle templates generate verified solvable boards across multiple seeds', () => {
  assert.equal(PUZZLE_TEMPLATES.length, 12);
  for (const tpl of PUZZLE_TEMPLATES) {
    for (const seed of [1, 42, 99991, 0xdeadbeef]) {
      const level = buildDeterministicLevelFromTemplate(tpl, seed, {
        syntheticLevelId: 1000 + tpl.numericIndex,
      });
      const report = verifyLevel(level);
      assert.equal(
        report.valid,
        true,
        `Template ${tpl.id} seed ${seed} failed: ${report.errors.join('; ')}`,
      );
      assert.equal(report.initialAlreadySolved, false);
      assert.ok(level.expectedMinMoves > 0);
    }
  }
});

test('daily challenge is strictly deterministic for the same Tehran date and varies across consecutive dates', () => {
  const firstA = generateDailyChallenge('2026-11-19');
  const firstB = generateDailyChallenge('2026-11-19');

  assert.equal(firstA.challengeId, firstB.challengeId);
  assert.equal(firstA.seed, firstB.seed);
  assert.equal(firstA.templateId, firstB.templateId);
  assert.deepEqual(firstA.level.grid, firstB.level.grid);
  assert.equal(firstA.algoVersion, DAILY_PUZZLE_ALGO_VERSION);
  assert.ok(firstA.persianDateFa.length > 0);

  // Verify 60 consecutive dates all pass verifyLevel and consecutive days never repeat template
  let prevTemplateId = '';
  const distinctTemplates = new Set<string>();
  const distinctSeeds = new Set<number>();

  for (let i = 0; i < 60; i++) {
    const dateKey = shiftDateKey('2026-10-01', i)!;
    const daily = generateDailyChallenge(dateKey);
    const report = verifyLevel(daily.level);
    assert.equal(report.valid, true, `Daily ${dateKey} failed verification: ${report.errors.join(', ')}`);
    assert.notEqual(
      daily.templateId,
      prevTemplateId,
      `Consecutive daily challenge repeated template ${daily.templateId} on ${dateKey}`,
    );
    prevTemplateId = daily.templateId;
    distinctTemplates.add(daily.templateId);
    distinctSeeds.add(daily.seed);
  }

  assert.equal(distinctTemplates.size, 12);
  assert.equal(distinctSeeds.size, 60);
});

test('Tehran timezone boundary transitions at 20:30 UTC (00:00 Asia/Tehran) regardless of host timezone', () => {
  // Iran Standard Time is UTC+03:30:
  // 2026-11-19T20:29:59Z -> 2026-11-19 23:59:59 Asia/Tehran
  // 2026-11-19T20:30:00Z -> 2026-11-20 00:00:00 Asia/Tehran
  const justBeforeMidnightTehran = new Date('2026-11-19T20:29:59.000Z');
  const exactMidnightTehran = new Date('2026-11-19T20:30:00.000Z');

  assert.equal(getTehranDateKey(justBeforeMidnightTehran), '2026-11-19');
  assert.equal(getTehranDateKey(exactMidnightTehran), '2026-11-20');

  // Countdown right before midnight should be ~1 second (1000ms)
  const msBefore = getMsUntilNextTehranDay(justBeforeMidnightTehran);
  assert.ok(msBefore > 0 && msBefore <= 2000, `Expected <=2000ms, got ${msBefore}`);

  // Persian Jalali date renders Persian digits cleanly
  const jalali = formatPersianJalaliDate('2026-11-19');
  assert.ok(jalali.includes('۱۴۰۵'), `Expected Jalali year ۱۴۰۵ in "${jalali}"`);
});

test('daily puzzle generator rejects invalid dates and unsupported algorithm versions', () => {
  assert.throws(() => generateDailyChallenge('2026-02-30'), /Invalid Tehran dateKey/);
  assert.throws(() => generateDailyChallenge('not-a-date'), /Invalid Tehran dateKey/);
  assert.throws(() => generateDailyChallenge('2026-11-19', 99), /Unsupported daily puzzle algorithm version/);
});

test('completing daily challenges does not modify or unlock campaign progression', () => {
  const storage = createMemoryStorage();
  const initialCampaign = loadProgress(storage);
  assert.equal(initialCampaign.highestUnlockedLevelId, 1);
  assert.deepEqual(initialCampaign.unlockedRegions, ['yazd']);

  const daily = generateDailyChallenge('2026-11-19');
  const score = calculateDailyScore({
    completed: true,
    rotations: daily.level.expectedMinMoves,
    expectedMinMoves: daily.level.expectedMinMoves,
    elapsedSeconds: 30,
    parTimeSec: daily.level.parTimeSec,
    hintsUsed: 0,
    restarts: 0,
  });

  recordDailyChallengeCompletion(
    createDefaultEngagementData(),
    {
      dateKey: daily.dateKey,
      todayTehranKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      result: score,
    },
    storage,
  );

  const afterCampaign = loadProgress(storage);
  assert.deepEqual(afterCampaign, initialCampaign);
});

// ---------------------------------------------------------------------------
// 2. DAILY SCORING
// ---------------------------------------------------------------------------

test('local daily scoring v1 is deterministic, non-increasing with documented clamp plateaus, and awards 0 for incomplete puzzles', () => {
  const incomplete = calculateDailyScore({
    completed: false,
    rotations: 10,
    expectedMinMoves: 10,
    elapsedSeconds: 15,
    parTimeSec: 60,
    hintsUsed: 0,
    restarts: 0,
  });
  assert.equal(incomplete.completed, false);
  assert.equal(incomplete.score, 0);
  assert.equal(incomplete.stars, 0);
  assert.equal(incomplete.performanceTier, null);

  const optimalA = calculateDailyScore({
    completed: true,
    rotations: 12,
    expectedMinMoves: 12,
    elapsedSeconds: 35,
    parTimeSec: 60,
    hintsUsed: 0,
    restarts: 0,
  });
  const optimalB = calculateDailyScore({
    completed: true,
    rotations: 12,
    expectedMinMoves: 12,
    elapsedSeconds: 35,
    parTimeSec: 60,
    hintsUsed: 0,
    restarts: 0,
  });
  assert.deepEqual(optimalA, optimalB);
  assert.equal(optimalA.stars, 3);
  assert.equal(optimalA.performanceLabelFa, 'استاد قنات');

  // Non-increasing (weakly monotonic) in rotations: more moves can NEVER produce a higher score,
  // and once extraMoves exceeds the move-bonus ceiling (18+), the bonus clamps cleanly at 0.
  let prevScore = optimalA.score;
  for (let moves = 13; moves <= 45; moves++) {
    const res = calculateDailyScore({
      completed: true,
      rotations: moves,
      expectedMinMoves: 12,
      elapsedSeconds: 35,
      parTimeSec: 60,
      hintsUsed: 0,
      restarts: 0,
    });
    assert.ok(
      res.score <= prevScore,
      `Score increased with more moves: moves=${moves} score=${res.score} > prev=${prevScore}`,
    );
    prevScore = res.score;
  }

  // Explicitly verify documented lower clamp floor (150) under extreme penalties
  const flooredA = calculateDailyScore({
    completed: true,
    rotations: 80,
    expectedMinMoves: 12,
    elapsedSeconds: 500,
    parTimeSec: 60,
    hintsUsed: 10,
    restarts: 10,
  });
  const flooredB = calculateDailyScore({
    completed: true,
    rotations: 90,
    expectedMinMoves: 12,
    elapsedSeconds: 600,
    parTimeSec: 60,
    hintsUsed: 15,
    restarts: 15,
  });
  assert.equal(flooredA.score, 150);
  assert.equal(flooredB.score, 150);

  // Hints and restarts decrease score consistently
  const withHint = calculateDailyScore({
    completed: true,
    rotations: 12,
    expectedMinMoves: 12,
    elapsedSeconds: 35,
    parTimeSec: 60,
    hintsUsed: 1,
    restarts: 0,
  });
  const withRestart = calculateDailyScore({
    completed: true,
    rotations: 12,
    expectedMinMoves: 12,
    elapsedSeconds: 35,
    parTimeSec: 60,
    hintsUsed: 0,
    restarts: 1,
  });
  const withBoth = calculateDailyScore({
    completed: true,
    rotations: 12,
    expectedMinMoves: 12,
    elapsedSeconds: 35,
    parTimeSec: 60,
    hintsUsed: 2,
    restarts: 2,
  });
  assert.ok(withHint.score < optimalA.score);
  assert.ok(withRestart.score < optimalA.score);
  assert.ok(withBoth.score < withHint.score && withBoth.score < withRestart.score);
  assert.equal(withBoth.stars, 1);
});

test('replaying a daily challenge with a worse score never overwrites the better saved record', () => {
  const storage = createMemoryStorage();
  const bestRun = calculateDailyScore({
    completed: true,
    rotations: 14,
    expectedMinMoves: 14,
    elapsedSeconds: 25,
    parTimeSec: 60,
    hintsUsed: 0,
    restarts: 0,
  });
  const worseRun = calculateDailyScore({
    completed: true,
    rotations: 28,
    expectedMinMoves: 14,
    elapsedSeconds: 110,
    parTimeSec: 60,
    hintsUsed: 2,
    restarts: 2,
  });

  const first = recordDailyChallengeCompletion(
    createDefaultEngagementData(),
    { dateKey: '2026-11-19', todayTehranKey: '2026-11-19', algoVersion: 1, result: bestRun },
    storage,
  );
  assert.equal(first.isNewBest, true);

  const second = recordDailyChallengeCompletion(
    first.data,
    { dateKey: '2026-11-19', todayTehranKey: '2026-11-19', algoVersion: 1, result: worseRun },
    storage,
  );
  assert.equal(second.isNewBest, false);

  const savedRec = second.data.dailyRecords['2026-11-19'];
  assert.equal(savedRec.bestScore, bestRun.score);
  assert.equal(savedRec.bestStars, 3);
  assert.equal(savedRec.bestMoves, 14);
  assert.equal(savedRec.bestTimeSec, 25);
  assert.equal(savedRec.completionsCount, 2);
});

// ---------------------------------------------------------------------------
// 3. FRIEND CHALLENGES & SHARE FALLBACKS
// ---------------------------------------------------------------------------

test('friend challenge URLs reproduce identical verified puzzles and reject malformed/unsupported links safely', () => {
  const created = createFriendChallengeByDifficulty('challenging', 'test-entropy-2026');
  const shareUrl = buildFriendChallengeUrl(created.challengeId, 'https://qanatchi.ir/play');
  const parsedUrl = new URL(shareUrl);

  const parsedResult = parseFriendChallengeFromSearch(parsedUrl.search);
  assert.ok(parsedResult && parsedResult.ok);
  assert.equal(parsedResult.challenge.challengeId, created.challengeId);
  assert.equal(parsedResult.challenge.templateId, created.templateId);
  assert.equal(parsedResult.challenge.seed, created.seed);
  assert.deepEqual(parsedResult.challenge.level.grid, created.level.grid);

  // Verify malformed, tampered checksum, unknown template, and unsupported version rejections
  const malformed = parseFriendChallengeCode('not-a-valid-code');
  assert.equal(malformed.ok, false);
  if (!malformed.ok) assert.equal(malformed.reason, 'malformed');

  const tampered = parseFriendChallengeCode(
    `${created.challengeId.slice(0, -2)}${created.challengeId.endsWith('00') ? 'FF' : '00'}`,
  );
  assert.equal(tampered.ok, false);
  if (!tampered.ok) assert.equal(tampered.reason, 'invalid_checksum');

  const futureVersionCode = encodeFriendChallengeId(1, 12345, 2);
  const unsupported = parseFriendChallengeCode(futureVersionCode);
  assert.equal(unsupported.ok, false);
  if (!unsupported.ok) assert.equal(unsupported.reason, 'unsupported_version');

  const badTemplate = parseFriendChallengeCode(encodeFriendChallengeId(99, 12345, 1));
  assert.equal(badTemplate.ok, false);
  if (!badTemplate.ok) assert.equal(badTemplate.reason, 'invalid_template');
});

test('Web Share API and Copy-Link fallbacks work cleanly and friend completion preserves campaign state', async () => {
  let sharedPayload: { title?: string; text?: string; url?: string } | null = null;
  const webShareRes = await shareChallengeLink(
    { title: 'قنات‌چی', text: 'بیا رقابت کنیم', url: 'https://qanatchi.ir/?challenge=Q1-01-00000001-AA' },
    {
      navigator: {
        share: async (data) => {
          sharedPayload = data;
        },
      },
    },
  );
  assert.equal(webShareRes.ok, true);
  assert.equal(webShareRes.method, 'web-share');
  assert.ok(sharedPayload !== null);

  let copiedText = '';
  const clipboardFallbackRes = await shareChallengeLink(
    { title: 'قنات‌چی', text: 'بیا رقابت کنیم', url: 'https://qanatchi.ir/?challenge=Q1-01-00000001-AA' },
    {
      navigator: {
        clipboard: {
          writeText: async (text) => {
            copiedText = text;
          },
        },
      },
    },
  );
  assert.equal(clipboardFallbackRes.ok, true);
  assert.equal(clipboardFallbackRes.method, 'clipboard');
  assert.equal(copiedText, 'https://qanatchi.ir/?challenge=Q1-01-00000001-AA');

  const execCommandFallback = await copyChallengeLink(
    'https://qanatchi.ir/?challenge=Q1-01-00000001-AA',
    {
      navigator: {},
      document: {
        createElement: () =>
          ({
            value: '',
            style: {},
            setAttribute: () => {},
            select: () => {},
          }) as unknown as HTMLTextAreaElement,
        body: {
          appendChild: (n) => n,
          removeChild: (n) => n,
        },
        execCommand: () => true,
      },
    },
  );
  assert.equal(execCommandFallback.ok, true);
  assert.equal(execCommandFallback.method, 'exec-command');

  // Imported friend challenge completion does not touch campaign progress
  const storage = createMemoryStorage();
  const baseCampaign = loadProgress(storage);
  const friend = createFriendChallengeFromTemplate('tpl_02', 7777);
  const score = calculateDailyScore({
    completed: true,
    rotations: friend.level.expectedMinMoves,
    expectedMinMoves: friend.level.expectedMinMoves,
    elapsedSeconds: 40,
    parTimeSec: friend.level.parTimeSec,
    hintsUsed: 0,
    restarts: 0,
  });
  recordFriendChallengeCompletion(
    createDefaultEngagementData(),
    { challenge: friend, result: score },
    storage,
  );
  assert.deepEqual(loadProgress(storage), baseCampaign);
});

// ---------------------------------------------------------------------------
// 4. DAILY STREAK LOGIC
// ---------------------------------------------------------------------------

test('daily streak handles first day, repeated same-day, consecutive days, missed days, old replays, and clock rollbacks', () => {
  let streak = createInitialStreak();

  // First daily completion -> streak = 1, longest = 1
  streak = applyDailyCompletionToStreak(streak, '2026-11-10', '2026-11-10');
  assert.deepEqual(streak, {
    currentStreak: 1,
    longestStreak: 1,
    lastCompletedDateKey: '2026-11-10',
  });

  // Repeated completion on the exact same Tehran day -> MUST NOT increment again
  streak = applyDailyCompletionToStreak(streak, '2026-11-10', '2026-11-10');
  assert.equal(streak.currentStreak, 1);
  assert.equal(streak.longestStreak, 1);

  // Consecutive Tehran day -> streak = 2, longest = 2
  streak = applyDailyCompletionToStreak(streak, '2026-11-11', '2026-11-11');
  assert.equal(streak.currentStreak, 2);
  assert.equal(streak.longestStreak, 2);

  // Another consecutive Tehran day -> streak = 3, longest = 3
  streak = applyDailyCompletionToStreak(streak, '2026-11-12', '2026-11-12');
  assert.equal(streak.currentStreak, 3);
  assert.equal(streak.longestStreak, 3);

  // Replaying an older daily challenge MUST NOT modify current streak
  const afterOldReplay = applyDailyCompletionToStreak(streak, '2026-11-10', '2026-11-12');
  assert.deepEqual(afterOldReplay, streak);

  // Check effective streak on the very next day (still alive before completing)
  const nextDayView = getEffectiveStreak(streak, '2026-11-13');
  assert.equal(nextDayView.currentStreak, 3);
  assert.equal(nextDayView.longestStreak, 3);
  assert.equal(nextDayView.completedToday, false);
  assert.equal(nextDayView.isBroken, false);

  // Missing a full Tehran calendar day (2026-11-13 missed -> now 2026-11-14)
  assert.equal(diffTehranDateKeys('2026-11-12', '2026-11-14'), 2);
  const brokenView = getEffectiveStreak(streak, '2026-11-14');
  assert.equal(brokenView.currentStreak, 0);
  assert.equal(brokenView.longestStreak, 3);
  assert.equal(brokenView.isBroken, true);

  // Completing after a missed day restarts currentStreak at 1 while preserving longestStreak = 3
  streak = applyDailyCompletionToStreak(streak, '2026-11-14', '2026-11-14');
  assert.equal(streak.currentStreak, 1);
  assert.equal(streak.longestStreak, 3);
  assert.equal(streak.lastCompletedDateKey, '2026-11-14');

  // Conservative handling when device clock rolls backward (today < lastCompletedDateKey)
  const clockRollbackView = getEffectiveStreak(streak, '2026-11-12');
  assert.equal(clockRollbackView.clockAnomalyDetected, true);
  const afterRollbackCompletion = applyDailyCompletionToStreak(streak, '2026-11-12', '2026-11-12');
  assert.deepEqual(afterRollbackCompletion, streak);
});

// ---------------------------------------------------------------------------
// 5. PERSONAL STATISTICS, RETENTION & CORRUPTED STORAGE SAFETY
// ---------------------------------------------------------------------------

test('personal statistics accurately derive empty states and combined campaign, daily, and friend records', () => {
  const storage = createMemoryStorage();

  // Empty state check
  const emptyStats = computePersonalStatistics(
    createDefaultProgress(),
    createDefaultEngagementData(),
    '2026-11-19',
  );
  assert.equal(emptyStats.hasAnyActivity, false);
  assert.equal(emptyStats.campaignLevelsCompleted, 0);
  assert.equal(emptyStats.campaignCompletionPercent, 0);
  assert.equal(emptyStats.totalStarsEarned, 0);
  assert.equal(emptyStats.totalPuzzlesSolved, 0);
  assert.equal(emptyStats.totalRotationsPerformed, 0);
  assert.equal(emptyStats.averageCompletionTimeSec, 0);
  assert.equal(emptyStats.bestDailyChallengeScore, 0);
  assert.equal(emptyStats.currentDailyStreak, 0);
  assert.equal(emptyStats.longestDailyStreak, 0);
  assert.equal(emptyStats.friendChallengesCompleted, 0);

  // Add real campaign + daily + friend completions
  let campaign = recordLevelCompletion(
    createDefaultProgress(),
    1,
    {
      stars: 3,
      score: 2000,
      rotations: 6,
      expectedMinMoves: 6,
      elapsedSeconds: 20,
      hintsUsed: 0,
    },
    2,
    storage,
  );
  campaign = recordLevelCompletion(
    campaign,
    2,
    {
      stars: 2,
      score: 1650,
      rotations: 14,
      expectedMinMoves: 11,
      elapsedSeconds: 40,
      hintsUsed: 1,
    },
    3,
    storage,
  );

  let engagement = createDefaultEngagementData();
  const daily = generateDailyChallenge('2026-11-19');
  const dailyScore = calculateDailyScore({
    completed: true,
    rotations: 20,
    expectedMinMoves: daily.level.expectedMinMoves,
    elapsedSeconds: 60,
    parTimeSec: daily.level.parTimeSec,
    hintsUsed: 0,
    restarts: 0,
  });
  engagement = recordDailyChallengeCompletion(
    engagement,
    { dateKey: '2026-11-19', todayTehranKey: '2026-11-19', algoVersion: 1, result: dailyScore },
    storage,
  ).data;

  const friend = createFriendChallengeFromTemplate('tpl_01', 555);
  const friendScore = calculateDailyScore({
    completed: true,
    rotations: 10,
    expectedMinMoves: friend.level.expectedMinMoves,
    elapsedSeconds: 40,
    parTimeSec: friend.level.parTimeSec,
    hintsUsed: 0,
    restarts: 0,
  });
  engagement = recordFriendChallengeCompletion(
    engagement,
    { challenge: friend, result: friendScore },
    storage,
  ).data;

  // Reload from storage to confirm persistence
  const reloadedCampaign = loadProgress(storage);
  const reloadedEngagement = loadEngagementData(storage);
  const stats = computePersonalStatistics(reloadedCampaign, reloadedEngagement, '2026-11-19');

  assert.equal(stats.hasAnyActivity, true);
  assert.equal(stats.campaignLevelsCompleted, 2);
  assert.equal(stats.campaignCompletionPercent, Math.round((2 / TOTAL_CAMPAIGN_LEVELS) * 100));
  assert.equal(stats.campaignStarsEarned, 5);
  assert.equal(stats.totalStarsEarned, 5 + dailyScore.stars + friendScore.stars);
  assert.equal(stats.totalPuzzlesSolved, 4);
  assert.equal(stats.totalRotationsPerformed, 6 + 14 + 20 + 10);
  assert.equal(stats.averageCompletionTimeSec, Math.round((20 + 40 + 60 + 40) / 4));
  assert.equal(stats.bestDailyChallengeScore, dailyScore.score);
  assert.equal(stats.currentDailyStreak, 1);
  assert.equal(stats.longestDailyStreak, 1);
  assert.equal(stats.friendChallengesCompleted, 1);

  // Clean up
  clearProgress(storage);
  clearEngagementData(storage);
});

test('engagement storage enforces retention limits and handles corrupted payloads safely', () => {
  const storage = createMemoryStorage();

  // Corrupted JSON never crashes and preserves campaign progress
  storage.setItem(ENGAGEMENT_STORAGE_KEY, '{not-valid-json');
  const recovered = loadEngagementData(storage);
  assert.equal(recovered.streak.currentStreak, 0);
  assert.deepEqual(recovered.dailyRecords, {});

  // Retention cap test: insert MAX_DAILY_RECORDS + 15 records and verify bounded size + preserved totals
  let eng = createDefaultEngagementData();
  let highestScore = 0;
  for (let i = 0; i < MAX_DAILY_RECORDS + 15; i++) {
    const dk = shiftDateKey('2025-01-01', i)!;
    const isPeak = i === 0; // Put peak score in oldest pruned record to verify archival preservation!
    const score = calculateDailyScore({
      completed: true,
      rotations: isPeak ? 10 : 18,
      expectedMinMoves: 10,
      elapsedSeconds: isPeak ? 15 : 80,
      parTimeSec: 60,
      hintsUsed: 0,
      restarts: 0,
    });
    if (score.score > highestScore) highestScore = score.score;
    eng = recordDailyChallengeCompletion(
      eng,
      { dateKey: dk, todayTehranKey: dk, algoVersion: 1, result: score },
      storage,
    ).data;
  }

  assert.equal(Object.keys(eng.dailyRecords).length, MAX_DAILY_RECORDS);
  assert.equal(eng.archivedTotals.prunedDailyCompletedCount, 15);
  assert.equal(eng.archivedTotals.prunedDailyBestScore, highestScore);

  const stats = computePersonalStatistics(createDefaultProgress(), eng, shiftDateKey('2025-01-01', MAX_DAILY_RECORDS + 14)!);
  assert.equal(stats.dailyChallengesCompleted, MAX_DAILY_RECORDS + 15);
  assert.equal(stats.bestDailyChallengeScore, highestScore);

  // Friend retention cap test
  for (let i = 0; i < MAX_FRIEND_RECORDS + 5; i++) {
    const ch = createFriendChallengeFromTemplate('tpl_01', 1000 + i);
    const sc = calculateDailyScore({
      completed: true,
      rotations: ch.level.expectedMinMoves,
      expectedMinMoves: ch.level.expectedMinMoves,
      elapsedSeconds: 30,
      parTimeSec: 60,
      hintsUsed: 0,
      restarts: 0,
    });
    eng = recordFriendChallengeCompletion(eng, { challenge: ch, result: sc }, storage).data;
  }
  assert.equal(Object.keys(eng.friendRecords).length, MAX_FRIEND_RECORDS);
  assert.equal(eng.archivedTotals.prunedFriendCompletedCount, 5);
});
