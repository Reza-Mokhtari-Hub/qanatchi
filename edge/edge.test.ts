import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { generateDailyChallenge } from '../src/engagement/dailyChallenge';
import { createFriendChallengeFromTemplate, encodeFriendChallengeId } from '../src/engagement/friendChallenge';
import { calculateRankedScore, RANKED_SCORING_ALGO_VERSION } from '../src/engagement/rankedScoring';
import {
  MAX_SUBMITTED_ACTIONS,
  MAX_VERIFY_BODY_BYTES,
  type TileRotationAction,
} from '../src/engagement/solutionReplay';
import { isRotatableTile } from '../src/engine/connections';
import type { LevelDefinition } from '../src/engine/types';
import { handleEdgeRequest } from './router';
import { InMemoryTestStorageAdapter } from './storage/inMemoryTestStorage';
import { UnconfiguredStorageAdapter } from './storage/unconfiguredStorage';

const FIXED_NOW = () => new Date('2026-11-19T12:00:00.000Z'); // 2026-11-19 15:30 Asia/Tehran

/**
 * Helper to derive the exact valid minimal clockwise rotation sequence for any verified LevelDefinition.
 */
function buildOptimalActionsForLevel(level: LevelDefinition): TileRotationAction[] {
  const actions: TileRotationAction[] = [];
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      const tile = level.grid[r][c];
      if (!isRotatableTile(tile.type, Boolean(tile.locked))) continue;
      let delta = ((tile.solutionRotation - tile.initialRotation) % 360 + 360) % 360;
      if (tile.type === 'straight') {
        delta = delta % 180;
      } else if (tile.type === 'cross') {
        delta = 0;
      }
      const steps = delta / 90;
      for (let i = 0; i < steps; i++) {
        actions.push({ row: r, col: c });
      }
    }
  }
  return actions;
}

function makeJsonPost(url: string, body: unknown, headers?: Record<string, string>): Request {
  return new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// 1. RANKED SCORING v2 AUDIT TESTS
// ---------------------------------------------------------------------------

test('ranked scoring v2 awards 0 for unsolved, decreases strictly in efficiency window [0..24], and documents floor plateau', () => {
  const invalid = calculateRankedScore({
    verifiedSolved: false,
    verifiedMoves: 10,
    trustedExpectedMinMoves: 10,
    difficulty: 'medium',
  });
  assert.equal(invalid.scoringVersion, RANKED_SCORING_ALGO_VERSION);
  assert.equal(invalid.score, 0);
  assert.equal(invalid.stars, 0);
  assert.equal(invalid.performanceTier, null);

  let prev = Infinity;
  for (let extra = 0; extra <= 24; extra++) {
    const res = calculateRankedScore({
      verifiedSolved: true,
      verifiedMoves: 12 + extra,
      trustedExpectedMinMoves: 12,
      difficulty: 'normal',
    });
    assert.ok(
      res.score < prev,
      `Expected strict decrease at extraMoves=${extra}: got ${res.score} vs prev ${prev}`,
    );
    prev = res.score;
  }

  // Explicitly verify documented floor plateau once extraMoves >= 25
  const at25 = calculateRankedScore({
    verifiedSolved: true,
    verifiedMoves: 12 + 25,
    trustedExpectedMinMoves: 12,
    difficulty: 'normal',
  });
  const at35 = calculateRankedScore({
    verifiedSolved: true,
    verifiedMoves: 12 + 35,
    trustedExpectedMinMoves: 12,
    difficulty: 'normal',
  });
  assert.equal(at25.score, at35.score);
  assert.ok(at25.score >= 300);
});

// ---------------------------------------------------------------------------
// 2. HEALTH, DAILY, METHOD, CONTENT-TYPE, JSON & PAYLOAD SIZE VALIDATION
// ---------------------------------------------------------------------------

test('GET /api/v1/health returns structured status, Tehran date, feature flags, and exposes no secrets', async () => {
  const res = await handleEdgeRequest(new Request('https://qanatchi.example.ir/api/v1/health'), {
    now: FIXED_NOW,
    storage: new UnconfiguredStorageAdapter(),
  });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('cache-control'), 'no-store');

  const json = (await res.json()) as Record<string, unknown>;
  assert.equal(json.ok, true);
  assert.equal(json.apiVersion, 'v1');
  assert.equal(json.status, 'ok');
  assert.equal(json.serverDateTehran, '2026-11-19');
  assert.deepEqual(json.storage, {
    configured: false,
    status: 'not_configured',
    driver: 'unconfigured',
  });
  assert.deepEqual(json.features, {
    dailyMetadata: true,
    serverVerification: true,
    globalLeaderboard: false,
    serverVerifiedTiming: false,
  });

  // Ensure no credential-like keys exist in health payload
  const serialized = JSON.stringify(json).toLowerCase();
  assert.equal(serialized.includes('password'), false);
  assert.equal(serialized.includes('secret'), false);
  assert.equal(serialized.includes('database_url'), false);
});

test('unsupported methods, invalid Content-Type, invalid JSON, and oversized bodies are rejected with explicit HTTP codes', async () => {
  // Unsupported method on health & daily
  const postHealth = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/health', { method: 'POST' }),
  );
  assert.equal(postHealth.status, 405);
  assert.ok(postHealth.headers.get('allow')?.includes('GET'));

  const deleteDaily = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/daily', { method: 'DELETE' }),
  );
  assert.equal(deleteDaily.status, 405);

  const getVerify = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/challenges/verify', { method: 'GET' }),
  );
  assert.equal(getVerify.status, 405);

  // Invalid Content-Type on POST
  const badContentType = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/challenges/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '{}',
    }),
  );
  assert.equal(badContentType.status, 415);

  // Malformed JSON
  const badJson = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', '{broken json'),
  );
  assert.equal(badJson.status, 400);
  const badJsonBody = (await badJson.json()) as { error: { code: string } };
  assert.equal(badJsonBody.error.code, 'INVALID_JSON');

  // Oversized request body (> 16 KiB)
  const hugePayload = JSON.stringify({ pad: 'a'.repeat(MAX_VERIFY_BODY_BYTES + 256) });
  const tooLarge = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', hugePayload),
  );
  assert.equal(tooLarge.status, 413);
  const tooLargeBody = (await tooLarge.json()) as { error: { code: string } };
  assert.equal(tooLargeBody.error.code, 'PAYLOAD_TOO_LARGE');

  // CORS: no wildcard "*" on unknown cross-origin
  const unknownOriginRes = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/health', {
      headers: { Origin: 'https://evil.example.com' },
    }),
  );
  assert.equal(unknownOriginRes.headers.get('access-control-allow-origin'), null);
});

test('GET /api/v1/daily returns deterministic Tehran daily metadata and rejects unsupported algoVersion', async () => {
  // Even if client tries to pass ?date=2099-01-01, server ignores client date and uses Asia/Tehran
  const res = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/daily?date=2099-01-01'),
    { now: FIXED_NOW },
  );
  assert.equal(res.status, 200);
  const body = (await res.json()) as { ok: true; daily: Record<string, unknown> };
  const expected = generateDailyChallenge('2026-11-19');
  assert.equal(body.daily.dateKey, '2026-11-19');
  assert.equal(body.daily.challengeId, expected.challengeId);
  assert.equal(body.daily.templateId, expected.templateId);
  assert.equal(body.daily.seed, expected.seed);
  assert.equal(body.daily.expectedMinMoves, expected.level.expectedMinMoves);

  // Unsupported algorithm version rejected safely
  const badAlgo = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/daily?algoVersion=99'),
    { now: FIXED_NOW },
  );
  assert.equal(badAlgo.status, 400);
  const badAlgoBody = (await badAlgo.json()) as { error: { code: string } };
  assert.equal(badAlgoBody.error.code, 'UNSUPPORTED_ALGO_VERSION');
});

// ---------------------------------------------------------------------------
// 3. SERVER-SIDE CHALLENGE VERIFICATION (DAILY & FRIEND)
// ---------------------------------------------------------------------------

test('POST /api/v1/challenges/verify reconstructs daily & friend puzzles, computes server score, and ignores client-spoofed metrics', async () => {
  const daily = generateDailyChallenge('2026-11-19');
  const dailyActions = buildOptimalActionsForLevel(daily.level);

  // Spoof client score, stars, moveCount, expectedMinMoves, and arbitrary board grid
  const dailyVerifyRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      actions: dailyActions,
      // Untrusted spoofed fields that MUST be ignored:
      score: 999999,
      stars: 3,
      moveCount: 1,
      expectedMinMoves: 1,
      isSolved: true,
      grid: [],
    }),
    { now: FIXED_NOW },
  );

  assert.equal(dailyVerifyRes.status, 200);
  const dailyVerifyBody = (await dailyVerifyRes.json()) as {
    ok: true;
    verification: {
      verified: boolean;
      verifiedMoves: number;
      trustedExpectedMinMoves: number;
      rankedScore: { score: number; stars: number };
      timingVerified: boolean;
    };
  };
  assert.equal(dailyVerifyBody.verification.verified, true);
  assert.equal(dailyVerifyBody.verification.verifiedMoves, dailyActions.length);
  assert.equal(dailyVerifyBody.verification.trustedExpectedMinMoves, daily.level.expectedMinMoves);
  assert.notEqual(dailyVerifyBody.verification.rankedScore.score, 999999);
  assert.equal(dailyVerifyBody.verification.timingVerified, false);

  const expectedScore = calculateRankedScore({
    verifiedSolved: true,
    verifiedMoves: dailyActions.length,
    trustedExpectedMinMoves: daily.level.expectedMinMoves,
    difficulty: daily.difficulty,
  });
  assert.equal(dailyVerifyBody.verification.rankedScore.score, expectedScore.score);
  assert.equal(dailyVerifyBody.verification.rankedScore.stars, expectedScore.stars);

  // Friend challenge verification
  const friend = createFriendChallengeFromTemplate('tpl_03', 424242);
  const friendActions = buildOptimalActionsForLevel(friend.level);
  const friendVerifyRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'friend',
      challengeId: friend.challengeId,
      algoVersion: friend.algoVersion,
      actions: friendActions,
      score: 888888,
      stars: 1,
      expectedMinMoves: 999,
    }),
    { now: FIXED_NOW },
  );
  assert.equal(friendVerifyRes.status, 200);
  const friendVerifyBody = (await friendVerifyRes.json()) as {
    ok: true;
    verification: {
      challengeId: string;
      verifiedMoves: number;
      trustedExpectedMinMoves: number;
      rankedScore: { score: number; stars: number };
    };
  };
  assert.equal(friendVerifyBody.verification.challengeId, friend.challengeId);
  assert.equal(friendVerifyBody.verification.verifiedMoves, friendActions.length);
  assert.equal(friendVerifyBody.verification.trustedExpectedMinMoves, friend.level.expectedMinMoves);
  assert.equal(friendVerifyBody.verification.rankedScore.stars, 3);
});

test('POST /api/v1/challenges/verify rejects invalid challenge IDs, unsupported versions, illegal rotations, leaks, incomplete solutions, and action overflows', async () => {
  const daily = generateDailyChallenge('2026-11-19');
  const optimalActions = buildOptimalActionsForLevel(daily.level);

  // 1. Invalid friend challenge ID
  const invalidFriend = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'friend',
      challengeId: 'Q1-01-BADBAD-00',
      algoVersion: 1,
      actions: [{ row: 0, col: 0 }],
    }),
    { now: FIXED_NOW },
  );
  assert.equal(invalidFriend.status, 400);

  // 2. Unsupported algorithm version
  const unsupportedVer = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'friend',
      challengeId: encodeFriendChallengeId(1, 123, 2),
      algoVersion: 2,
      actions: [{ row: 0, col: 0 }],
    }),
    { now: FIXED_NOW },
  );
  assert.equal(unsupportedVer.status, 400);
  assert.equal(((await unsupportedVer.json()) as { error: { code: string } }).error.code, 'UNSUPPORTED_ALGO_VERSION');

  // 3. Future Tehran date rejected
  const futureDaily = generateDailyChallenge('2026-11-25');
  const futureRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: futureDaily.challengeId,
      dateKey: futureDaily.dateKey,
      algoVersion: 1,
      actions: buildOptimalActionsForLevel(futureDaily.level),
    }),
    { now: FIXED_NOW },
  );
  assert.equal(futureRes.status, 400);
  assert.equal(((await futureRes.json()) as { error: { code: string } }).error.code, 'FUTURE_DATE_NOT_ALLOWED');

  // 4. Attempting to rotate source (fixed non-rotatable tile) rejected
  const rotateSource = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      actions: [{ row: daily.level.source.row, col: daily.level.source.col }],
    }),
    { now: FIXED_NOW },
  );
  assert.equal(rotateSource.status, 422);
  assert.equal(((await rotateSource.json()) as { error: { code: string } }).error.code, 'INVALID_ACTION_TILE');

  // 5. Incomplete / leaking solution (drop last required move)
  const partialActions = optimalActions.slice(0, Math.max(1, optimalActions.length - 1));
  const incompleteRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      actions: partialActions,
    }),
    { now: FIXED_NOW },
  );
  assert.equal(incompleteRes.status, 422);
  const incompleteCode = ((await incompleteRes.json()) as { error: { code: string } }).error.code;
  assert.ok(
    incompleteCode === 'SOLUTION_HAS_LEAKS' || incompleteCode === 'SOLUTION_INCOMPLETE',
    `Unexpected code: ${incompleteCode}`,
  );

  // 6. Explicitly construct a leaking solution by over-rotating a tile in the optimal solution
  const leakingActions = [...optimalActions, optimalActions[0]];
  const leakingRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      actions: leakingActions,
    }),
    { now: FIXED_NOW },
  );
  assert.equal(leakingRes.status, 422);
  const leakCode = ((await leakingRes.json()) as { error: { code: string } }).error.code;
  assert.ok(leakCode === 'SOLUTION_HAS_LEAKS' || leakCode === 'SOLUTION_INCOMPLETE');

  // 7. Excessive actions count (> MAX_SUBMITTED_ACTIONS)
  const tooManyActions = Array.from({ length: MAX_SUBMITTED_ACTIONS + 1 }, () => optimalActions[0]);
  const overflowRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      actions: tooManyActions,
    }),
    { now: FIXED_NOW },
  );
  assert.equal(overflowRes.status, 400);
  assert.equal(((await overflowRes.json()) as { error: { code: string } }).error.code, 'ACTION_LIMIT_EXCEEDED');
});

// ---------------------------------------------------------------------------
// 4. STORAGE NOT CONFIGURED + TEST-ONLY STORAGE ADAPTER WORKFLOWS
// ---------------------------------------------------------------------------

test('unconfigured storage returns honest 503 STORAGE_NOT_CONFIGURED while keeping health & verify operational', async () => {
  const daily = generateDailyChallenge('2026-11-19');
  const actions = buildOptimalActionsForLevel(daily.level);

  const listDaily = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/daily?date=2026-11-19'),
    { now: FIXED_NOW, storage: new UnconfiguredStorageAdapter() },
  );
  assert.equal(listDaily.status, 503);
  assert.equal(((await listDaily.json()) as { error: { code: string } }).error.code, 'STORAGE_NOT_CONFIGURED');

  const submitRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      playerId: 'anon_1234567890abcdef',
      displayLabel: 'آرش یزدی',
      actions,
    }),
    { now: FIXED_NOW, storage: new UnconfiguredStorageAdapter() },
  );
  assert.equal(submitRes.status, 503);
  const submitJson = (await submitRes.json()) as {
    error: { code: string; details?: { verified?: boolean; verifiedScore?: number } };
  };
  assert.equal(submitJson.error.code, 'STORAGE_NOT_CONFIGURED');
  assert.equal(submitJson.error.details?.verified, true);
  assert.ok((submitJson.error.details?.verifiedScore ?? 0) > 0);
});

test('leaderboard storage adapter supports persistence across handler invocations, duplicates, concurrent writes, ordering, pagination, and failure handling', async () => {
  const storage = new InMemoryTestStorageAdapter();
  const daily = generateDailyChallenge('2026-11-19');
  const optimalActions = buildOptimalActionsForLevel(daily.level);
  // Create a suboptimal valid solution (add 4 full clockwise rotations on first rotatable tile = +4 extra moves)
  const extra4Actions = [
    ...optimalActions,
    optimalActions[0],
    optimalActions[0],
    optimalActions[0],
    optimalActions[0],
  ];
  const extra8Actions = [
    ...extra4Actions,
    optimalActions[0],
    optimalActions[0],
    optimalActions[0],
    optimalActions[0],
  ];

  // Concurrent submissions from 3 distinct anonymous players
  const [r1, r2, r3] = await Promise.all([
    handleEdgeRequest(
      makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: 1,
        playerId: 'anon_player_alpha_0001',
        displayLabel: 'سارا',
        actions: extra4Actions,
      }),
      { storage, now: () => new Date('2026-11-19T12:00:01.000Z') },
    ),
    handleEdgeRequest(
      makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: 1,
        playerId: 'anon_player_beta_0002',
        displayLabel: 'کیان',
        actions: optimalActions,
      }),
      { storage, now: () => new Date('2026-11-19T12:00:02.000Z') },
    ),
    handleEdgeRequest(
      makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: 1,
        playerId: 'anon_player_gamma_0003',
        displayLabel: 'مریم',
        actions: extra8Actions,
      }),
      { storage, now: () => new Date('2026-11-19T12:00:03.000Z') },
    ),
  ]);

  assert.equal(r1.status, 201);
  assert.equal(r2.status, 201);
  assert.equal(r3.status, 201);

  // Duplicate submission detection
  const dupRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      playerId: 'anon_player_beta_0002',
      displayLabel: 'کیان',
      actions: optimalActions,
    }),
    { storage, now: () => new Date('2026-11-19T12:00:05.000Z') },
  );
  assert.equal(dupRes.status, 200);
  const dupJson = (await dupRes.json()) as { submission: { duplicate: boolean } };
  assert.equal(dupJson.submission.duplicate, true);

  // Worse replay by top player MUST NOT overwrite better persisted record
  const worseReplay = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: 1,
      playerId: 'anon_player_beta_0002',
      displayLabel: 'کیان',
      actions: extra8Actions,
    }),
    { storage, now: () => new Date('2026-11-19T12:00:10.000Z') },
  );
  const worseJson = (await worseReplay.json()) as {
    submission: { isNewBest: boolean; entry: { verifiedMoves: number } };
  };
  assert.equal(worseJson.submission.isNewBest, false);
  assert.equal(worseJson.submission.entry.verifiedMoves, optimalActions.length);

  // Pagination & deterministic ordering verification (fresh handler invocation sharing storage)
  const page1Res = await handleEdgeRequest(
    new Request(
      'https://qanatchi.example.ir/api/v1/leaderboards/daily?date=2026-11-19&limit=2&offset=0&playerId=anon_player_alpha_0001',
    ),
    { storage, now: FIXED_NOW },
  );
  assert.equal(page1Res.status, 200);
  const page1 = (await page1Res.json()) as {
    leaderboard: {
      total: number;
      hasMore: boolean;
      entries: Array<{ rank: number; displayLabel: string; score: number }>;
      playerBest: { rank: number; displayLabel: string } | null;
    };
  };
  assert.equal(page1.leaderboard.total, 3);
  assert.equal(page1.leaderboard.hasMore, true);
  assert.equal(page1.leaderboard.entries.length, 2);
  assert.equal(page1.leaderboard.entries[0].displayLabel, 'کیان');
  assert.equal(page1.leaderboard.entries[0].rank, 1);
  assert.equal(page1.leaderboard.entries[1].displayLabel, 'سارا');
  assert.equal(page1.leaderboard.entries[1].rank, 2);
  assert.equal(page1.leaderboard.playerBest?.rank, 2);

  const page2Res = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/daily?date=2026-11-19&limit=2&offset=2'),
    { storage, now: FIXED_NOW },
  );
  const page2 = (await page2Res.json()) as {
    leaderboard: { hasMore: boolean; entries: Array<{ rank: number; displayLabel: string }> };
  };
  assert.equal(page2.leaderboard.hasMore, false);
  assert.equal(page2.leaderboard.entries.length, 1);
  assert.equal(page2.leaderboard.entries[0].displayLabel, 'مریم');
  assert.equal(page2.leaderboard.entries[0].rank, 3);

  // Storage failure handled safely with HTTP 503 STORAGE_UNAVAILABLE
  storage.setSimulateFailure(true);
  const failedRead = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/daily?date=2026-11-19'),
    { storage, now: FIXED_NOW },
  );
  assert.equal(failedRead.status, 503);
  assert.equal(((await failedRead.json()) as { error: { code: string } }).error.code, 'STORAGE_UNAVAILABLE');
});

// ---------------------------------------------------------------------------
// 5. BUILT ARVANCLOUD EDGE BUNDLE RUNTIME COMPATIBILITY SANDBOX TEST
// ---------------------------------------------------------------------------

test('built dist-edge/worker.js executes cleanly inside a pure Web Fetch-Event sandbox without Node or Cloudflare APIs', async () => {
  const bundlePath = path.resolve(process.cwd(), 'dist-edge/worker.js');
  assert.ok(
    fs.existsSync(bundlePath),
    'dist-edge/worker.js must exist before running runtime compatibility tests (run `npm run build:edge`)',
  );
  const bundleSource = fs.readFileSync(bundlePath, 'utf8');

  // Verify zero forbidden Node/Express/Cloudflare/test-adapter strings exist in production bundle
  assert.equal(/\bprocess\.env\b/.test(bundleSource), false, 'Bundle must not reference process.env');
  assert.equal(/\brequire\s*\(/.test(bundleSource), false, 'Bundle must not use require()');
  assert.equal(/\bnode:/.test(bundleSource), false, 'Bundle must not import node:* built-ins');
  assert.equal(/\bInMemoryTestStorageAdapter\b/.test(bundleSource), false, 'Bundle must not include test storage');

  // Execute dist-edge/worker.js inside an isolated V8 vm.Context that exposes ONLY
  // standard Web Fetch-Event APIs + ArvanCloud-style global env vars (`APP_ENV`, `EC_URL`).
  // Note: This validates Web-standard Fetch-Event compatibility locally; it does NOT substitute
  // for live deployment testing on ArvanCloud's production Edge PoPs.
  type FetchListener = (event: {
    request: Request;
    respondWith: (resp: Response | Promise<Response>) => void;
  }) => void;
  let registeredFetchListener: FetchListener | null = null;

  const sandboxGlobals: Record<string, unknown> = {
    APP_ENV: 'production',
    EC_URL: 'https://qanatchi-api.arvanedge.ir',
    Request,
    Response,
    Headers,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    Intl,
    Date,
    Math,
    JSON,
    Object,
    Array,
    Map,
    Set,
    RegExp,
    Error,
    TypeError,
    Number,
    String,
    Boolean,
    Promise,
    console,
    addEventListener: (type: string, listener: FetchListener) => {
      if (type === 'fetch') {
        registeredFetchListener = listener;
      }
    },
  };
  sandboxGlobals.globalThis = sandboxGlobals;
  sandboxGlobals.self = sandboxGlobals;

  const ctx = vm.createContext(sandboxGlobals);
  vm.runInContext(bundleSource, ctx, { filename: 'dist-edge/worker.js' });

  assert.ok(
    registeredFetchListener !== null,
    'Worker bundle must register an addEventListener("fetch", ...) handler',
  );

  const invokeWorker = async (req: Request): Promise<Response> => {
    let responsePromise: Response | Promise<Response> | null = null;
    registeredFetchListener!({
      request: req,
      respondWith: (r) => {
        responsePromise = r;
      },
    });
    assert.ok(responsePromise !== null, 'Worker must call event.respondWith(...)');
    return await responsePromise;
  };

  // Exercise real endpoints through the compiled production bundle
  const healthResp = await invokeWorker(new Request('https://qanatchi-api.arvanedge.ir/api/v1/health'));
  assert.equal(healthResp.status, 200);
  const healthJson = (await healthResp.json()) as {
    ok: boolean;
    runtime: { platform: string; ecUrlConfigured: boolean; environment: string };
    storage: { configured: boolean; status: string };
  };
  assert.equal(healthJson.ok, true);
  assert.equal(healthJson.runtime.platform, 'arvancloud-edge');
  assert.equal(healthJson.runtime.ecUrlConfigured, true);
  assert.equal(healthJson.runtime.environment, 'production');
  assert.equal(healthJson.storage.configured, false);
  assert.equal(healthJson.storage.status, 'not_configured');

  const dailyResp = await invokeWorker(new Request('https://qanatchi-api.arvanedge.ir/api/v1/daily'));
  assert.equal(dailyResp.status, 200);
  const dailyJson = (await dailyResp.json()) as {
    ok: boolean;
    daily: { challengeId: string; dateKey: string; algoVersion: number };
  };
  assert.equal(dailyJson.ok, true);

  // Verify solving today's daily challenge through the compiled production worker
  const todayDef = generateDailyChallenge(dailyJson.daily.dateKey, dailyJson.daily.algoVersion);
  const verifyResp = await invokeWorker(
    makeJsonPost('https://qanatchi-api.arvanedge.ir/api/v1/challenges/verify', {
      challengeType: 'daily',
      challengeId: todayDef.challengeId,
      dateKey: todayDef.dateKey,
      algoVersion: todayDef.algoVersion,
      actions: buildOptimalActionsForLevel(todayDef.level),
    }),
  );
  assert.equal(verifyResp.status, 200);
  const verifyJson = (await verifyResp.json()) as {
    ok: boolean;
    verification: { verified: boolean; rankedScore: { score: number } };
  };
  assert.equal(verifyJson.ok, true);
  assert.equal(verifyJson.verification.verified, true);
  assert.ok(verifyJson.verification.rankedScore.score > 1000);
});

// ---------------------------------------------------------------------------
// 6. PHASE 6 SECURITY HARDENING & FAILURE RESILIENCE TESTS
// ---------------------------------------------------------------------------

test('streaming oversized body without Content-Length is rejected with 413 PAYLOAD_TOO_LARGE', async () => {
  const chunk = new TextEncoder().encode('x'.repeat(4096));
  let emitted = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (emitted < 6) {
        emitted++;
        controller.enqueue(chunk);
      } else {
        controller.close();
      }
    },
  });

  const req = new Request('https://qanatchi.example.ir/api/v1/challenges/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: stream,
    // @ts-expect-error Node fetch requires duplex for streaming Request bodies
    duplex: 'half',
  });

  const res = await handleEdgeRequest(req, { now: FIXED_NOW });
  assert.equal(res.status, 413);
  const body = (await res.json()) as { error: { code: string } };
  assert.equal(body.error.code, 'PAYLOAD_TOO_LARGE');
});

test('CORS enforces HTTPS-only origins in production, allows localhost HTTP only in development, and supports same-origin with empty allowlist', async () => {
  const prodConfig = {
    appEnv: 'production',
    allowedOrigins: [
      'https://qanatchi.example.ir/',
      'http://qanatchi.example.ir',
      'http://localhost:3000',
      '*',
      'null',
      'javascript:alert(1)',
      'ftp://files.example.ir',
      'not-a-url',
    ],
  };

  // 1. Valid HTTPS production origin (with trailing slash normalized) is allowed
  const allowedPreflight = await handleEdgeRequest(
    new Request('https://api.example.ir/api/v1/challenges/verify', {
      method: 'OPTIONS',
      headers: { Origin: 'https://qanatchi.example.ir' },
    }),
    { configOverrides: prodConfig },
  );
  assert.equal(allowedPreflight.status, 204);
  assert.equal(
    allowedPreflight.headers.get('access-control-allow-origin'),
    'https://qanatchi.example.ir',
  );
  assert.equal(allowedPreflight.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(allowedPreflight.headers.get('x-content-type-options'), 'nosniff');

  // 2. Wildcard, null, invalid schemes, and plain HTTP origins (including localhost) are rejected in production
  for (const badOrigin of [
    'http://qanatchi.example.ir',
    'http://localhost:3000',
    'https://attacker.invalid',
    '*',
    'null',
    'javascript:alert(1)',
    'ftp://files.example.ir',
  ]) {
    const res = await handleEdgeRequest(
      new Request('https://api.example.ir/api/v1/health', {
        headers: { Origin: badOrigin },
      }),
      { configOverrides: prodConfig },
    );
    assert.equal(
      res.headers.get('access-control-allow-origin'),
      null,
      `Expected production CORS rejection for origin: ${badOrigin}`,
    );
    assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
  }

  // 3. Development mode permits localhost/127.0.0.1 HTTP origins while still rejecting remote plain HTTP
  const devConfig = {
    appEnv: 'development',
    allowedOrigins: [
      'http://localhost:3000/',
      'http://127.0.0.1:5173',
      'http://remote.example.com',
      'https://staging.example.ir',
    ],
  };
  for (const devAllowed of [
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://staging.example.ir',
  ]) {
    const res = await handleEdgeRequest(
      new Request('http://localhost:8787/api/v1/health', {
        headers: { Origin: devAllowed },
      }),
      { configOverrides: devConfig },
    );
    assert.equal(res.headers.get('access-control-allow-origin'), devAllowed);
  }
  const devRemoteHttp = await handleEdgeRequest(
    new Request('http://localhost:8787/api/v1/health', {
      headers: { Origin: 'http://remote.example.com' },
    }),
    { configOverrides: devConfig },
  );
  assert.equal(devRemoteHttp.headers.get('access-control-allow-origin'), null);

  // 4. Same-origin deployment with an empty allowlist accepts matching origin and rejects foreign origins
  const sameOriginRes = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/health', {
      headers: { Origin: 'https://qanatchi.example.ir' },
    }),
    { configOverrides: { appEnv: 'production', allowedOrigins: [] } },
  );
  assert.equal(
    sameOriginRes.headers.get('access-control-allow-origin'),
    'https://qanatchi.example.ir',
  );
  assert.equal(sameOriginRes.headers.get('vary'), 'Origin');

  const foreignOnEmptyAllowlist = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/health', {
      headers: { Origin: 'https://other.example.ir' },
    }),
    { configOverrides: { appEnv: 'production', allowedOrigins: [] } },
  );
  assert.equal(foreignOnEmptyAllowlist.headers.get('access-control-allow-origin'), null);
});

test('router rejects oversized query strings (414), unsupported methods across all routes (405), unknown routes (404), and malformed submit bodies (400)', async () => {
  const longQuery = `?pad=${'a'.repeat(2100)}`;
  const uriTooLong = await handleEdgeRequest(
    new Request(`https://qanatchi.example.ir/api/v1/daily${longQuery}`),
    { now: FIXED_NOW },
  );
  assert.equal(uriTooLong.status, 414);
  assert.equal(((await uriTooLong.json()) as { error: { code: string } }).error.code, 'URI_TOO_LONG');

  const notFound = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/debug-secret-route'),
    { now: FIXED_NOW },
  );
  assert.equal(notFound.status, 404);

  const putLb = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/daily', { method: 'PUT' }),
  );
  assert.equal(putLb.status, 405);

  const patchFriendLb = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/friend', { method: 'PATCH' }),
  );
  assert.equal(patchFriendLb.status, 405);

  const getSubmit = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/submit', { method: 'GET' }),
  );
  assert.equal(getSubmit.status, 405);

  // Non-object JSON array rejected on submit
  const arrayBody = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', [1, 2, 3]),
    { now: FIXED_NOW },
  );
  assert.equal(arrayBody.status, 400);
  assert.equal(((await arrayBody.json()) as { error: { code: string } }).error.code, 'INVALID_SUBMISSION');

  // Invalid playerId rejected on submit
  const badPlayer = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      playerId: 'short',
      challengeType: 'daily',
    }),
    { now: FIXED_NOW },
  );
  assert.equal(badPlayer.status, 400);
  assert.equal(((await badPlayer.json()) as { error: { code: string } }).error.code, 'INVALID_PLAYER_ID');

  // Invalid pagination rejected on leaderboard GET
  const badPagination = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/leaderboards/daily?date=2026-11-19&limit=999'),
    { now: FIXED_NOW },
  );
  assert.equal(badPagination.status, 400);
  assert.equal(((await badPagination.json()) as { error: { code: string } }).error.code, 'INVALID_PAGINATION');
});

test('unexpected internal exceptions return sanitized 500 INTERNAL_ERROR without leaking stack traces', async () => {
  const res = await handleEdgeRequest(
    new Request('https://qanatchi.example.ir/api/v1/health'),
    {
      now: () => {
        throw new Error('SENSITIVE_INTERNAL_SECRET_STACK_DETAIL');
      },
    },
  );
  assert.equal(res.status, 500);
  const raw = await res.text();
  assert.equal(raw.includes('SENSITIVE_INTERNAL_SECRET_STACK_DETAIL'), false);
  const parsed = JSON.parse(raw) as { ok: boolean; error: { code: string } };
  assert.equal(parsed.ok, false);
  assert.equal(parsed.error.code, 'INTERNAL_ERROR');
});

