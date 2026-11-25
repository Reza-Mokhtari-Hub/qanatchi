import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
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
import { LEVELS } from '../src/levels/levels';
import { hmacSha256Hex, sha256Hex, signAttemptToken, verifyAttemptToken } from './crypto';
import { readEdgeRuntimeConfig } from './env';
import { handleEdgeRequest } from './router';
import { InMemoryTestStorageAdapter } from './storage/inMemoryTestStorage';
import { PostgresHttpStorageAdapter } from './storage/postgresHttpStorage';
import { resolveProductionStorage } from './storage/resolveStorage';
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
    campaignVerification: true,
    globalLeaderboard: false,
    serverVerifiedTiming: false,
    onlineFriendChallenges: false,
    playerProfiles: false,
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
    AbortController,
    setTimeout,
    clearTimeout,
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

// ---------------------------------------------------------------------------
// 7. REAL ARVANCLOUD EDGE CRYPTO, ATTEMPT TOKENS, CAMPAIGN, GLOBAL, PROFILES
// ---------------------------------------------------------------------------

test('pure ES2022 SHA-256, HMAC-SHA256, and attemptToken signing/verification reject tampering and expiry', () => {
  // Known FIPS 180-4 SHA-256 vector for "abc"
  assert.equal(
    sha256Hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
  // RFC 4231 Test Case 2: key="Jefe", data="what do ya want for nothing?"
  assert.equal(
    hmacSha256Hex('Jefe', 'what do ya want for nothing?'),
    '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
  );

  const secret = 'test-signing-secret-32-characters-min';
  const issuedAtMs = 1_700_000_000_000;
  const token = signAttemptToken(
    {
      v: 1,
      nonceId: 'n_abcdef1234567890',
      challengeType: 'daily',
      challengeId: 'daily-v1-2026-11-19',
      playerIdHash: 'p_1234567890abcdef',
      issuedAtMs,
      expiresAtMs: issuedAtMs + 60_000,
      minSolveMs: 1000,
    },
    secret,
  );

  const valid = verifyAttemptToken(token, secret, issuedAtMs + 5000);
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.claims.nonceId, 'n_abcdef1234567890');
  }

  // Expired token
  const expired = verifyAttemptToken(token, secret, issuedAtMs + 120_000);
  assert.deepEqual(expired, { ok: false, reason: 'expired' });

  // Tampered payload
  const [payloadB64, sigB64] = token.split('.');
  const tamperedToken = `${payloadB64.slice(0, -1)}Z.${sigB64}`;
  const tampered = verifyAttemptToken(tamperedToken, secret, issuedAtMs + 5000);
  assert.equal(tampered.ok, false);
});

test('GET /api/v1/ready, /api/v1/version, and campaign level verification (1..100) behave accurately', async () => {
  // 1. /ready returns 503 STORAGE_NOT_CONFIGURED when unconfigured
  const notReady = await handleEdgeRequest(new Request('https://qanatchi.example.ir/api/v1/ready'), {
    now: FIXED_NOW,
    storage: new UnconfiguredStorageAdapter(),
  });
  assert.equal(notReady.status, 503);
  assert.equal(((await notReady.json()) as { error: { code: string } }).error.code, 'STORAGE_NOT_CONFIGURED');

  // 2. /ready returns 200 with latency when healthy
  const storage = new InMemoryTestStorageAdapter();
  const readyOk = await handleEdgeRequest(new Request('https://qanatchi.example.ir/api/v1/ready'), {
    now: FIXED_NOW,
    storage,
  });
  assert.equal(readyOk.status, 200);
  const readyJson = (await readyOk.json()) as { ok: true; ready: boolean; storage: { reachable: boolean } };
  assert.equal(readyJson.ready, true);
  assert.equal(readyJson.storage.reachable, true);

  // 3. /ready returns 503 STORAGE_UNAVAILABLE when ping fails
  storage.setSimulateFailure(true);
  const readyDown = await handleEdgeRequest(new Request('https://qanatchi.example.ir/api/v1/ready'), {
    now: FIXED_NOW,
    storage,
  });
  assert.equal(readyDown.status, 503);
  assert.equal(((await readyDown.json()) as { error: { code: string } }).error.code, 'STORAGE_UNAVAILABLE');

  // 4. /version reports all 100 campaign levels
  const verRes = await handleEdgeRequest(new Request('https://qanatchi.example.ir/api/v1/version'));
  assert.equal(verRes.status, 200);
  const verJson = (await verRes.json()) as {
    totalCampaignLevels: number;
    supportedChallengeTypes: string[];
  };
  assert.equal(verJson.totalCampaignLevels, 100);
  assert.deepEqual(verJson.supportedChallengeTypes, ['campaign', 'daily', 'friend']);

  // 5. Verify Campaign Level 1 and Level 100 on server
  for (const levelId of [1, 100]) {
    const levelDef = LEVELS.find((l) => l.id === levelId)!;
    const actions = buildOptimalActionsForLevel(levelDef);
    const verifyCampaign = await handleEdgeRequest(
      makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
        challengeType: 'campaign',
        levelId,
        challengeId: `campaign-${levelId}`,
        algoVersion: 1,
        actions,
      }),
      { now: FIXED_NOW },
    );
    assert.equal(verifyCampaign.status, 200);
    const body = (await verifyCampaign.json()) as {
      verification: { verified: boolean; challengeType: string; challengeId: string };
    };
    assert.equal(body.verification.verified, true);
    assert.equal(body.verification.challengeType, 'campaign');
    assert.equal(body.verification.challengeId, `campaign-${levelId}`);
  }

  // Invalid campaign levelId (101) rejected
  const invalidCampaign = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/verify', {
      challengeType: 'campaign',
      challengeId: 'campaign-101',
      levelId: 101,
      algoVersion: 1,
      actions: [{ row: 0, col: 0 }],
    }),
    { now: FIXED_NOW },
  );
  assert.equal(invalidCampaign.status, 400);
  assert.equal(((await invalidCampaign.json()) as { error: { code: string } }).error.code, 'INVALID_LEVEL_ID');
});

test('POST /api/v1/challenges/start enforces signed attempt tokens, impossible solve-time protection, single-use nonce consumption, and idempotency', async () => {
  const storage = new InMemoryTestStorageAdapter();
  const daily = generateDailyChallenge('2026-11-19');
  const actions = buildOptimalActionsForLevel(daily.level);
  const signingSecret = 'qanatchi-test-hmac-secret-key-2026';
  const playerId = 'anon_attempt_player_001';

  const startMs = FIXED_NOW().getTime();
  const startRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/challenges/start', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      playerId,
    }),
    {
      storage,
      now: () => new Date(startMs),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(startRes.status, 201);
  const startJson = (await startRes.json()) as {
    attempt: { attemptToken: string; minSolveTimeMs: number; persistedNonce: boolean };
  };
  assert.equal(startJson.attempt.persistedNonce, true);
  assert.ok(startJson.attempt.minSolveTimeMs >= 500);

  // 1. Submitting faster than minSolveTimeMs (100ms later) -> 422 IMPOSSIBLE_SOLVE_TIME
  const tooFast = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      playerId,
      displayLabel: 'سهراب',
      attemptToken: startJson.attempt.attemptToken,
      actions,
    }),
    {
      storage,
      now: () => new Date(startMs + 100),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(tooFast.status, 422);
  assert.equal(((await tooFast.json()) as { error: { code: string } }).error.code, 'IMPOSSIBLE_SOLVE_TIME');

  // 2. Submitting with wrong playerId -> 400 ATTEMPT_TOKEN_MISMATCH
  const wrongPlayer = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      playerId: 'anon_different_player_999',
      attemptToken: startJson.attempt.attemptToken,
      actions,
    }),
    {
      storage,
      now: () => new Date(startMs + 10_000),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(wrongPlayer.status, 400);
  assert.equal(((await wrongPlayer.json()) as { error: { code: string } }).error.code, 'ATTEMPT_TOKEN_MISMATCH');

  // 3. Valid submit after elapsed >= minSolveMs -> 201 timingVerified=true
  const validSubmit = await handleEdgeRequest(
    makeJsonPost(
      'https://qanatchi.example.ir/api/v1/leaderboards/submit',
      {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId,
        displayLabel: 'سهراب',
        attemptToken: startJson.attempt.attemptToken,
        actions,
      },
      { 'Idempotency-Key': 'idem_attempt_key_0001' },
    ),
    {
      storage,
      now: () => new Date(startMs + 12_500),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(validSubmit.status, 201);
  const validJson = (await validSubmit.json()) as {
    submission: { timingVerified: boolean; serverElapsedMs: number };
  };
  assert.equal(validJson.submission.timingVerified, true);
  assert.equal(validJson.submission.serverElapsedMs, 12_500);

  // 4. Reusing the exact same attemptToken nonce a second time -> 409 NONCE_ALREADY_USED
  const replayNonce = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      playerId,
      attemptToken: startJson.attempt.attemptToken,
      actions,
    }),
    {
      storage,
      now: () => new Date(startMs + 15_000),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(replayNonce.status, 409);
  assert.equal(((await replayNonce.json()) as { error: { code: string } }).error.code, 'NONCE_ALREADY_USED');

  // 5. Idempotency-Key deduplicates retries cleanly without attemptToken requirement if not enforced
  const retrySameIdem = await handleEdgeRequest(
    makeJsonPost(
      'https://qanatchi.example.ir/api/v1/leaderboards/submit',
      {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId,
        actions: [...actions, actions[0], actions[0], actions[0], actions[0]],
      },
      { 'Idempotency-Key': 'idem_attempt_key_0001' },
    ),
    {
      storage,
      now: () => new Date(startMs + 20_000),
      configOverrides: { signingSecret },
    },
  );
  assert.equal(retrySameIdem.status, 200);
  const retryJson = (await retrySameIdem.json()) as { submission: { duplicate: boolean } };
  assert.equal(retryJson.submission.duplicate, true);
});

test('friend challenge registration/expiry (410), global leaderboard aggregation, player profiles, and rate limits (429) work end-to-end', async () => {
  const storage = new InMemoryTestStorageAdapter();
  const friend = createFriendChallengeFromTemplate('tpl_02', 777111);
  const playerId = 'anon_friend_host_001';

  // 1. Register friend challenge with short 1-hour expiry
  const createRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/friend-challenges', {
      challengeId: friend.challengeId,
      playerId,
      expiresInHours: 1,
    }),
    { storage, now: () => new Date('2026-11-19T12:00:00.000Z') },
  );
  assert.equal(createRes.status, 201);

  // 2. Active friend challenge returns 200
  const getActive = await handleEdgeRequest(
    new Request(`https://qanatchi.example.ir/api/v1/friend-challenges/${friend.challengeId}`),
    { storage, now: () => new Date('2026-11-19T12:30:00.000Z') },
  );
  assert.equal(getActive.status, 200);

  // 3. Expired friend challenge returns 410 CHALLENGE_EXPIRED
  const getExpired = await handleEdgeRequest(
    new Request(`https://qanatchi.example.ir/api/v1/friend-challenges/${friend.challengeId}`),
    { storage, now: () => new Date('2026-11-19T14:00:00.000Z') },
  );
  assert.equal(getExpired.status, 410);
  assert.equal(((await getExpired.json()) as { error: { code: string } }).error.code, 'CHALLENGE_EXPIRED');

  // 4. Update player profile + submit daily score + verify global leaderboard & /players/me
  const profilePost = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/players/profile', {
      playerId,
      displayLabel: 'دارا کاشانی',
    }),
    { storage, now: FIXED_NOW },
  );
  assert.equal(profilePost.status, 200);

  const daily = generateDailyChallenge('2026-11-19');
  const submitRes = await handleEdgeRequest(
    makeJsonPost('https://qanatchi.example.ir/api/v1/leaderboards/submit', {
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: daily.algoVersion,
      playerId,
      displayLabel: 'دارا کاشانی',
      actions: buildOptimalActionsForLevel(daily.level),
    }),
    { storage, now: FIXED_NOW },
  );
  assert.equal(submitRes.status, 201);

  const globalRes = await handleEdgeRequest(
    new Request(`https://qanatchi.example.ir/api/v1/leaderboards/global?playerId=${playerId}`),
    { storage, now: FIXED_NOW },
  );
  assert.equal(globalRes.status, 200);
  const globalJson = (await globalRes.json()) as {
    leaderboard: {
      total: number;
      entries: Array<{ rank: number; displayLabel: string; totalScore: number }>;
      playerEntry: { rank: number; displayLabel: string } | null;
    };
  };
  assert.equal(globalJson.leaderboard.total, 1);
  assert.equal(globalJson.leaderboard.entries[0].displayLabel, 'دارا کاشانی');
  assert.equal(globalJson.leaderboard.playerEntry?.rank, 1);

  const meRes = await handleEdgeRequest(
    new Request(`https://qanatchi.example.ir/api/v1/players/me?playerId=${playerId}`),
    { storage, now: FIXED_NOW },
  );
  assert.equal(meRes.status, 200);
  const meJson = (await meRes.json()) as {
    profile: { displayLabel: string; verifiedSubmissions: number };
  };
  assert.equal(meJson.profile.displayLabel, 'دارا کاشانی');
  assert.equal(meJson.profile.verifiedSubmissions, 1);

  // 5. Rate limit enforcement -> 429 + Retry-After header
  for (let i = 0; i < 6; i++) {
    const r = await handleEdgeRequest(
      makeJsonPost('https://qanatchi.example.ir/api/v1/players/profile', {
        playerId: 'anon_rate_limit_tester_99',
        displayLabel: `بازیکن ${i}`,
      }),
      {
        storage,
        now: () => new Date('2026-11-19T12:00:00.000Z'),
        configOverrides: { rateLimitMaxPerMin: 5 },
      },
    );
    if (i < 5) {
      assert.equal(r.status, 200);
    } else {
      assert.equal(r.status, 429);
      assert.ok(Number(r.headers.get('retry-after')) >= 1);
      assert.equal(((await r.json()) as { error: { code: string } }).error.code, 'RATE_LIMIT_EXCEEDED');
    }
  }
});

test('PostgresHttpStorageAdapter & resolveProductionStorage communicate cleanly over HTTPS/HTTP SQL gateway and handle sequential MVCC saves, duplicates, auth, and security constraints', async () => {
  const capturedCalls: Array<{ authHeader?: string; query: string; params: unknown[] }> = [];

  // Stateful PostgreSQL table simulation to enforce real committed-between-statements visibility
  const pgPlayers = new Map<string, { player_id_hash: string; display_label: string; verified_submissions: number; best_daily_score: number; best_friend_score: number; total_verified_score: number }>();
  const pgSubs: Array<Record<string, unknown>> = [];
  const pgBest = new Map<string, Record<string, unknown>>();

  const server = http.createServer(async (req, res) => {
    if (req.url === '/sql' && req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const c of req) {
        chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
      }
      const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
        query: string;
        params: unknown[];
      };
      capturedCalls.push({
        authHeader: req.headers.authorization,
        query: parsed.query,
        params: parsed.params,
      });

      if (req.headers.authorization !== 'Bearer gw-secret-token-test') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized', code: '28P01' }));
        return;
      }

      const q = parsed.query;
      const p = parsed.params;

      if (q.includes('SELECT 1 AS alive')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: [{ alive: 1 }] }));
        return;
      }

      if (q.includes('INSERT INTO players')) {
        const hash = String(p[0]);
        const label = String(p[1] ?? 'مسافر قنات');
        const existing = pgPlayers.get(hash);
        if (existing) {
          existing.display_label = label;
        } else {
          pgPlayers.set(hash, {
            player_id_hash: hash,
            display_label: label,
            verified_submissions: 0,
            best_daily_score: 0,
            best_friend_score: 0,
            total_verified_score: 0,
          });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: [] }));
        return;
      }

      if (q.includes('INSERT INTO verified_submissions')) {
        const subId = String(p[0]);
        const fingerprint = String(p[1]);
        const idemKey = p[2] === null || p[2] === undefined ? null : String(p[2]);
        const nonceId = p[17] === null || p[17] === undefined ? null : String(p[17]);
        const conflict = pgSubs.some(
          (s) =>
            s.submission_id === subId ||
            s.submission_fingerprint === fingerprint ||
            (idemKey !== null && s.idempotency_key === idemKey) ||
            (nonceId !== null && s.nonce_id === nonceId),
        );
        if (conflict) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ rows: [] }));
          return;
        }
        pgSubs.push({
          submission_id: subId,
          submission_fingerprint: fingerprint,
          idempotency_key: idemKey,
          player_id_hash: p[3],
          display_label: p[4],
          challenge_type: p[5],
          challenge_id: p[6],
          date_key: p[7],
          algo_version: p[8],
          scoring_version: p[9],
          score: Number(p[10]),
          stars: Number(p[11]),
          verified_moves: Number(p[12]),
          performance_tier: p[13],
          performance_label_fa: p[14],
          elapsed_ms_server: p[15],
          timing_verified: Boolean(p[16]),
          nonce_id: nonceId,
          submitted_at: p[18],
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: [{ submission_id: subId }] }));
        return;
      }

      if (q.includes('INSERT INTO leaderboard_best')) {
        const key = `${String(p[0])}:${String(p[1])}:${String(p[2])}`;
        const candidate = {
          challenge_type: p[0],
          challenge_id: p[1],
          player_id_hash: p[2],
          submission_id: p[3],
          display_label: p[4],
          date_key: p[5],
          algo_version: p[6],
          scoring_version: p[7],
          score: Number(p[8]),
          stars: Number(p[9]),
          verified_moves: Number(p[10]),
          performance_tier: p[11],
          performance_label_fa: p[12],
          submitted_at: p[13],
        };
        const existing = pgBest.get(key);
        const better =
          !existing ||
          candidate.score > Number(existing.score) ||
          (candidate.score === Number(existing.score) && candidate.stars > Number(existing.stars)) ||
          (candidate.score === Number(existing.score) &&
            candidate.stars === Number(existing.stars) &&
            candidate.verified_moves < Number(existing.verified_moves));
        if (better) {
          pgBest.set(key, candidate);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ rows: [{ submission_id: candidate.submission_id }] }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ rows: [] }));
        }
        return;
      }

      if (q.includes('UPDATE players')) {
        const player = pgPlayers.get(String(p[0]));
        if (!player) {
          // Simulates PostgreSQL error/miss if player hadn't been committed yet
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ rows: [] }));
          return;
        }
        player.verified_submissions += 1;
        if (p[1] === 'daily') player.best_daily_score = Math.max(player.best_daily_score, Number(p[2]));
        if (p[1] === 'friend') player.best_friend_score = Math.max(player.best_friend_score, Number(p[2]));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: [] }));
        return;
      }

      if (q.includes('FROM leaderboard_best') && q.includes('WHERE player_id_hash = $3')) {
        const cType = String(p[0]);
        const cId = String(p[1]);
        const playerHash = String(p[2]);
        const entries = Array.from(pgBest.values())
          .filter((r) => r.challenge_type === cType && r.challenge_id === cId)
          .sort((a, b) => Number(b.score) - Number(a.score) || Number(a.verified_moves) - Number(b.verified_moves));
        const idx = entries.findIndex((r) => r.player_id_hash === playerHash);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: idx >= 0 ? [{ rank: idx + 1, ...entries[idx] }] : [] }));
        return;
      }

      if (q.includes('SELECT tc.total, r.*')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ rows: [{ total: 0 }] }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ rows: [] }));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const gatewayUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Production config rejects non-HTTPS gateway URLs strictly
    const prodRejected = resolveProductionStorage(
      readEdgeRuntimeConfig(undefined, {
        APP_ENV: 'production',
        LEADERBOARD_STORAGE_DRIVER: 'postgres-http',
        LEADERBOARD_DATABASE_URL: gatewayUrl,
        LEADERBOARD_DATABASE_TOKEN: 'gw-secret-token-test',
      }),
    );
    assert.equal(prodRejected.isConfigured, false);

    // 2. Development config permits localhost HTTP gateway
    const devResolved = resolveProductionStorage(
      readEdgeRuntimeConfig(undefined, {
        APP_ENV: 'development',
        LEADERBOARD_STORAGE_DRIVER: 'postgres-http',
        LEADERBOARD_DATABASE_URL: gatewayUrl,
        LEADERBOARD_DATABASE_TOKEN: 'gw-secret-token-test',
      }),
    );
    assert.equal(devResolved.isConfigured, true);
    assert.equal(devResolved.driverName, 'postgres-http');

    // 3. /api/v1/ready succeeds via real HTTP POST /sql
    const readyRes = await handleEdgeRequest(new Request('http://localhost:3000/api/v1/ready'), {
      storage: devResolved,
      now: FIXED_NOW,
    });
    assert.equal(readyRes.status, 200);
    assert.equal(capturedCalls[0].authHeader, 'Bearer gw-secret-token-test');

    // 4. First-time POST /api/v1/leaderboards/submit persists sequentially & computes rank 1
    const daily = generateDailyChallenge('2026-11-19');
    const optimalActions = buildOptimalActionsForLevel(daily.level);
    const submitRes = await handleEdgeRequest(
      makeJsonPost('http://localhost:3000/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId: 'anon_pg_gateway_user_01',
        displayLabel: 'نوید شیرازی',
        actions: optimalActions,
      }),
      { storage: devResolved, now: FIXED_NOW },
    );
    assert.equal(submitRes.status, 201);
    const submitBody = (await submitRes.json()) as {
      submission: { duplicate: boolean; isNewBest: boolean; entry: { displayLabel: string; rank: number; score: number } };
    };
    assert.equal(submitBody.submission.duplicate, false);
    assert.equal(submitBody.submission.isNewBest, true);
    assert.equal(submitBody.submission.entry.displayLabel, 'نوید شیرازی');
    assert.equal(submitBody.submission.entry.rank, 1);

    // 5. Exact duplicate replay returns 200 duplicate=true, isNewBest=false
    const dupRes = await handleEdgeRequest(
      makeJsonPost('http://localhost:3000/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId: 'anon_pg_gateway_user_01',
        displayLabel: 'نوید شیرازی',
        actions: optimalActions,
      }),
      { storage: devResolved, now: FIXED_NOW },
    );
    assert.equal(dupRes.status, 200);
    const dupBody = (await dupRes.json()) as {
      submission: { duplicate: boolean; isNewBest: boolean; entry: { rank: number } };
    };
    assert.equal(dupBody.submission.duplicate, true);
    assert.equal(dupBody.submission.isNewBest, false);
    assert.equal(dupBody.submission.entry.rank, 1);

    // 6. Slower replay with extra 4-turn rotation on same tile returns 201, duplicate=false, isNewBest=false, preserving best score
    const slowerActions = [...optimalActions, optimalActions[0], optimalActions[0], optimalActions[0], optimalActions[0]];
    const slowerRes = await handleEdgeRequest(
      makeJsonPost('http://localhost:3000/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId: 'anon_pg_gateway_user_01',
        displayLabel: 'نوید شیرازی',
        actions: slowerActions,
      }),
      { storage: devResolved, now: FIXED_NOW },
    );
    assert.equal(slowerRes.status, 201);
    const slowerBody = (await slowerRes.json()) as {
      submission: { duplicate: boolean; isNewBest: boolean; entry: { score: number } };
    };
    assert.equal(slowerBody.submission.duplicate, false);
    assert.equal(slowerBody.submission.isNewBest, false);
    assert.equal(slowerBody.submission.entry.score, submitBody.submission.entry.score);

    // 7. Wrong token fails safely with 503 STORAGE_UNAVAILABLE without leaking secrets
    const badTokenAdapter = new PostgresHttpStorageAdapter({
      endpointUrl: gatewayUrl,
      authToken: 'wrong-secret-should-not-leak',
      timeoutMs: 1500,
    });
    const failedRes = await handleEdgeRequest(new Request('http://localhost:3000/api/v1/ready'), {
      storage: badTokenAdapter,
      now: FIXED_NOW,
    });
    assert.equal(failedRes.status, 503);
    const failedRaw = await failedRes.text();
    assert.equal(failedRaw.includes('wrong-secret-should-not-leak'), false);
    assert.equal(JSON.parse(failedRaw).error.code, 'STORAGE_UNAVAILABLE');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('standalone gateway/server.mjs and scripts/postgres-http-gateway.mjs stay synchronized with 001_initial_schema.sql', () => {
  const migrationSql = fs.readFileSync(
    path.resolve(process.cwd(), 'edge/db/migrations/001_initial_schema.sql'),
    'utf8',
  );
  const gatewayServer = fs.readFileSync(
    path.resolve(process.cwd(), 'gateway/server.mjs'),
    'utf8',
  );
  const rootGateway = fs.readFileSync(
    path.resolve(process.cwd(), 'scripts/postgres-http-gateway.mjs'),
    'utf8',
  );

  const requiredTables = [
    'players',
    'friend_challenges',
    'challenge_nonces',
    'verified_submissions',
    'leaderboard_best',
    'rate_limit_buckets',
  ];

  for (const tableName of requiredTables) {
    const marker = `CREATE TABLE IF NOT EXISTS ${tableName}`;
    assert.ok(migrationSql.includes(marker), `001_initial_schema.sql missing ${tableName}`);
    assert.ok(gatewayServer.includes(marker), `gateway/server.mjs missing ${tableName}`);
    assert.ok(rootGateway.includes(marker), `scripts/postgres-http-gateway.mjs missing ${tableName}`);
  }
});

test('resolveProductionStorage supports neon-http with direct postgresql:// URI or https://.../sql endpoint using Neon-Connection-String header', async () => {
  const secretConn = 'postgresql://neondb_owner:supersecret99@ep-qanat-test.eu-central-1.aws.neon.tech/neondb?sslmode=require';

  // 1. Direct postgresql:// URI pasted into LEADERBOARD_DATABASE_URL under LEADERBOARD_STORAGE_DRIVER=neon-http
  const resolvedFromUri = resolveProductionStorage(
    readEdgeRuntimeConfig(undefined, {
      APP_ENV: 'production',
      LEADERBOARD_STORAGE_DRIVER: 'neon-http',
      LEADERBOARD_DATABASE_URL: secretConn,
    }),
  );
  assert.equal(resolvedFromUri.isConfigured, true);
  assert.equal(resolvedFromUri.driverName, 'neon-http');

  // 2. Intercept fetch on PostgresHttpStorageAdapter in neon-connection-string mode
  const captured: Array<{ url: string; neonHeader: string | null; authHeader: string | null }> = [];
  const neonAdapter = new PostgresHttpStorageAdapter({
    endpointUrl: 'https://ep-qanat-test.eu-central-1.aws.neon.tech/sql',
    authToken: secretConn,
    authMode: 'neon-connection-string',
    driverName: 'neon-http',
    fetchImpl: async (input, init) => {
      const headers = new Headers(init?.headers);
      captured.push({
        url: String(input),
        neonHeader: headers.get('Neon-Connection-String'),
        authHeader: headers.get('Authorization'),
      });
      return new Response(JSON.stringify({ rows: [{ alive: 1 }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    },
  });

  const pingRes = await handleEdgeRequest(new Request('https://ghanatchi.dentalfy.ir/api/v1/ready'), {
    storage: neonAdapter,
    now: FIXED_NOW,
  });
  assert.equal(pingRes.status, 200);
  assert.equal(captured.length, 1);
  assert.equal(captured[0].url, 'https://ep-qanat-test.eu-central-1.aws.neon.tech/sql');
  assert.equal(captured[0].neonHeader, secretConn);
  assert.equal(captured[0].authHeader, null);

  const pingText = await pingRes.text();
  assert.equal(pingText.includes('supersecret99'), false);
  assert.equal(JSON.parse(pingText).storage.driver, 'neon-http');

  // 3. Auto-upgrade postgres-http when pointed at *.neon.tech with postgresql:// token
  const autoUpgraded = resolveProductionStorage(
    readEdgeRuntimeConfig(undefined, {
      APP_ENV: 'production',
      LEADERBOARD_STORAGE_DRIVER: 'postgres-http',
      LEADERBOARD_DATABASE_URL: 'https://ep-qanat-test.eu-central-1.aws.neon.tech/sql',
      LEADERBOARD_DATABASE_TOKEN: secretConn,
    }),
  );
  assert.equal(autoUpgraded.isConfigured, true);
  assert.equal(autoUpgraded.driverName, 'neon-http');
});

test('readEdgeRuntimeConfig supports QANATCHI_CONFIG JSON object bundles, { value } objects, and native JSON booleans/numbers', () => {
  const fromBundle = readEdgeRuntimeConfig(undefined, {
    QANATCHI_CONFIG: {
      APP_ENV: 'production',
      LEADERBOARD_STORAGE_DRIVER: 'neon-http',
      LEADERBOARD_DATABASE_URL: 'postgresql://user:pass@ep-bundle.eu-central-1.aws.neon.tech/neondb',
      EDGE_SIGNING_SECRET: 'bundle_signing_secret_at_least_32_chars',
      REQUIRE_ATTEMPT_TOKEN: true,
      RATE_LIMIT_MAX_PER_MIN: 90,
      ENABLE_STRUCTURED_LOGS: false,
    },
  });
  assert.equal(fromBundle.appEnv, 'production');
  assert.equal(fromBundle.storageDriver, 'neon-http');
  assert.equal(fromBundle.requireAttemptToken, true);
  assert.equal(fromBundle.rateLimitMaxPerMin, 90);
  assert.equal(fromBundle.structuredLogsEnabled, false);

  const fromWrappedValues = readEdgeRuntimeConfig(undefined, {
    LEADERBOARD_STORAGE_DRIVER: { value: 'neon-http' },
    LEADERBOARD_DATABASE_URL: { value: 'postgresql://user:pass@ep-wrap.eu-central-1.aws.neon.tech/neondb' },
  });
  const storage = resolveProductionStorage(fromWrappedValues);
  assert.equal(storage.isConfigured, true);
  assert.equal(storage.driverName, 'neon-http');
});

test('structured Edge logs include errorCode on handled 4xx and 5xx error responses without exposing secrets', async () => {
  const capturedWarns: string[] = [];
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    capturedWarns.push(args.map((a) => String(a)).join(' '));
  };

  try {
    const storage = new InMemoryTestStorageAdapter();
    const daily = generateDailyChallenge('2026-11-19');
    const res = await handleEdgeRequest(
      makeJsonPost('https://ghanatchi.dentalfy.ir/api/v1/leaderboards/submit', {
        challengeType: 'daily',
        challengeId: daily.challengeId,
        dateKey: daily.dateKey,
        algoVersion: daily.algoVersion,
        playerId: 'anon_log_check_user_01',
        actions: buildOptimalActionsForLevel(daily.level),
      }),
      {
        storage,
        now: FIXED_NOW,
        configOverrides: {
          requireAttemptToken: true,
          structuredLogsEnabled: true,
          signingSecret: 'signing_secret_for_structured_log_test_32',
        },
      },
    );
    assert.equal(res.status, 400);
    assert.equal(capturedWarns.length, 1);
    const logged = JSON.parse(capturedWarns[0]) as { status: number; errorCode?: string };
    assert.equal(logged.status, 400);
    assert.equal(logged.errorCode, 'ATTEMPT_TOKEN_REQUIRED');
  } finally {
    console.warn = origWarn;
  }
});
