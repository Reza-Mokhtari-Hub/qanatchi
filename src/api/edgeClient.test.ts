import assert from 'node:assert/strict';
import test from 'node:test';
import type { StorageLike } from '../storage/progressStorage';
import {
  enqueueUnsentSubmission,
  getPlayerDisplayLabel,
  listUnsentSubmissions,
  MAX_UNSENT_SUBMISSIONS,
  removeUnsentSubmission,
  setPlayerDisplayLabel,
} from '../storage/submissionQueue';
import {
  createOnlineFriendChallenge,
  fetchApiHealth,
  fetchDailyLeaderboard,
  fetchFriendLeaderboard,
  fetchGlobalLeaderboard,
  fetchOnlineFriendChallenge,
  fetchPlayerProfile,
  fetchServerDailyMetadata,
  resolveApiBaseUrl,
  startChallengeAttempt,
  submitVerifiedScoreToLeaderboard,
  updatePlayerProfile,
  verifyChallengeOnServer,
  type FetchLike,
} from './edgeClient';

function mockFetch(status: number, body: string, contentType = 'application/json'): FetchLike {
  return async () =>
    new Response(body, {
      status,
      headers: { 'Content-Type': contentType },
    });
}

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

test('edgeClient rejects malformed HTTP 200 JSON and HTML captive-portal responses safely without throwing', async () => {
  // Captive portal returning 200 HTML
  const htmlFetch = mockFetch(200, '<html><body>Login Required</body></html>', 'text/html');
  assert.equal((await fetchApiHealth({ fetchImpl: htmlFetch })).status, 'offline');
  assert.equal((await fetchServerDailyMetadata({ fetchImpl: htmlFetch })).status, 'error');
  assert.equal(
    (
      await verifyChallengeOnServer(
        {
          challengeType: 'daily',
          challengeId: 'daily-v1-2026-11-19',
          dateKey: '2026-11-19',
          algoVersion: 1,
          actions: [{ row: 0, col: 0 }],
        },
        { fetchImpl: htmlFetch },
      )
    ).status,
    'rejected',
  );
  assert.equal((await fetchDailyLeaderboard('2026-11-19', undefined, { fetchImpl: htmlFetch })).status, 'error');

  // Truncated/shape-mismatched 200 JSON ({ ok: true } missing required nested fields)
  const partialJsonFetch = mockFetch(200, JSON.stringify({ ok: true }));
  assert.equal((await fetchApiHealth({ fetchImpl: partialJsonFetch })).status, 'offline');
  assert.equal((await fetchServerDailyMetadata({ fetchImpl: partialJsonFetch })).status, 'error');
  assert.equal(
    (
      await fetchFriendLeaderboard('Q1-01-E7CFCF50-2A', undefined, { fetchImpl: partialJsonFetch })
    ).status,
    'error',
  );
  assert.equal(
    (
      await submitVerifiedScoreToLeaderboard(
        {
          challengeType: 'daily',
          challengeId: 'daily-v1-2026-11-19',
          dateKey: '2026-11-19',
          algoVersion: 1,
          actions: [{ row: 0, col: 0 }],
          playerId: 'anon_1234567890abcdef',
        },
        { fetchImpl: partialJsonFetch },
      )
    ).status,
    'error',
  );
});

test('edgeClient aborts slow requests cleanly on timeout and degrades to offline state', async () => {
  const slowFetch: FetchLike = (_input, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        const abortErr = new Error('The operation was aborted.');
        abortErr.name = 'AbortError';
        reject(abortErr);
      });
    });

  const healthRes = await fetchApiHealth({ fetchImpl: slowFetch, timeoutMs: 25 });
  assert.equal(healthRes.status, 'offline');

  const lbRes = await fetchDailyLeaderboard('2026-11-19', undefined, {
    fetchImpl: slowFetch,
    timeoutMs: 25,
  });
  assert.equal(lbRes.status, 'offline');
});

test('edgeClient maps HTTP 503 STORAGE_NOT_CONFIGURED and network errors cleanly without fabricating success', async () => {
  const unconfiguredFetch = mockFetch(
    503,
    JSON.stringify({
      ok: false,
      apiVersion: 'v1',
      error: {
        code: 'STORAGE_NOT_CONFIGURED',
        message: 'Not configured',
        details: { verified: true, verifiedScore: 2450 },
      },
    }),
  );

  const lbRes = await fetchDailyLeaderboard('2026-11-19', undefined, {
    fetchImpl: unconfiguredFetch,
  });
  assert.equal(lbRes.status, 'storage_not_configured');

  const submitRes = await submitVerifiedScoreToLeaderboard(
    {
      challengeType: 'daily',
      challengeId: 'daily-v1-2026-11-19',
      dateKey: '2026-11-19',
      algoVersion: 1,
      actions: [{ row: 0, col: 0 }],
      playerId: 'anon_1234567890abcdef',
    },
    { fetchImpl: unconfiguredFetch },
  );
  assert.equal(submitRes.status, 'storage_not_configured');
  assert.equal(submitRes.verifiedScore, 2450);

  const networkFailFetch: FetchLike = async () => {
    throw new TypeError('Failed to fetch');
  };
  assert.equal((await fetchApiHealth({ fetchImpl: networkFailFetch })).status, 'offline');
  assert.equal(resolveApiBaseUrl('https://edge.example.ir///'), 'https://edge.example.ir');
});

test('edgeClient propagates Idempotency-Key, handles attempt start, global leaderboard, friend expiry (410), and player profiles', async () => {
  let seenIdempotencyHeader: string | undefined;
  const mockRouterFetch: FetchLike = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const headers = new Headers(init?.headers);
    if (url.endsWith('/api/v1/leaderboards/submit')) {
      seenIdempotencyHeader = headers.get('Idempotency-Key') ?? undefined;
      return new Response(
        JSON.stringify({
          ok: true,
          apiVersion: 'v1',
          requestId: 'req_1',
          submission: {
            accepted: true,
            duplicate: false,
            isNewBest: true,
            timingVerified: true,
            serverElapsedMs: 5000,
            entry: { rank: 1, score: 2500, displayLabel: 'آذر' },
          },
        }),
        { status: 201 },
      );
    }
    if (url.endsWith('/api/v1/challenges/start')) {
      return new Response(
        JSON.stringify({
          ok: true,
          apiVersion: 'v1',
          requestId: 'req_2',
          attempt: {
            attemptToken: 'tok_abc',
            nonceId: 'n_123',
            challengeType: 'daily',
            challengeId: 'daily-v1-2026-11-19',
            issuedAtIso: '2026-11-19T12:00:00Z',
            expiresAtIso: '2026-11-19T14:00:00Z',
            minSolveTimeMs: 800,
            persistedNonce: true,
          },
        }),
        { status: 201 },
      );
    }
    if (url.includes('/api/v1/leaderboards/global')) {
      return new Response(
        JSON.stringify({
          ok: true,
          apiVersion: 'v1',
          requestId: 'req_3',
          leaderboard: {
            scope: 'global',
            scoringVersion: 2,
            total: 1,
            limit: 20,
            offset: 0,
            hasMore: false,
            entries: [{ rank: 1, playerIdHash: 'p_1', displayLabel: 'آذر', totalScore: 2500 }],
          },
        }),
        { status: 200 },
      );
    }
    if (url.endsWith('/api/v1/friend-challenges')) {
      return new Response(
        JSON.stringify({
          ok: true,
          apiVersion: 'v1',
          requestId: 'req_4',
          friendChallenge: { challengeId: 'Q1-01-E7CFCF50-2A', participantCount: 0 },
        }),
        { status: 201 },
      );
    }
    if (url.includes('/api/v1/friend-challenges/Q1-EXPIRED')) {
      return new Response(
        JSON.stringify({
          ok: false,
          apiVersion: 'v1',
          requestId: 'req_5',
          error: { code: 'CHALLENGE_EXPIRED', message: 'Expired' },
        }),
        { status: 410 },
      );
    }
    if (url.includes('/api/v1/players/')) {
      return new Response(
        JSON.stringify({
          ok: true,
          apiVersion: 'v1',
          requestId: 'req_6',
          profile: {
            playerIdHash: 'p_1',
            displayLabel: 'آذر یزدی',
            verifiedSubmissions: 2,
            bestDailyScore: 2500,
            bestFriendScore: 1900,
            totalVerifiedScore: 4400,
            createdAt: '2026-11-19T12:00:00Z',
            updatedAt: '2026-11-19T12:00:00Z',
            recentSubmissions: [],
          },
        }),
        { status: 200 },
      );
    }
    return new Response('{}', { status: 404 });
  };

  const startRes = await startChallengeAttempt(
    {
      challengeType: 'daily',
      challengeId: 'daily-v1-2026-11-19',
      dateKey: '2026-11-19',
      algoVersion: 1,
      playerId: 'anon_1234567890abcdef',
    },
    { baseUrl: 'https://edge.example.ir', fetchImpl: mockRouterFetch },
  );
  assert.equal(startRes.ok, true);

  const subRes = await submitVerifiedScoreToLeaderboard(
    {
      challengeType: 'daily',
      challengeId: 'daily-v1-2026-11-19',
      dateKey: '2026-11-19',
      algoVersion: 1,
      actions: [{ row: 0, col: 0 }],
      playerId: 'anon_1234567890abcdef',
      idempotencyKey: 'idem_test_12345',
    },
    { baseUrl: 'https://edge.example.ir', fetchImpl: mockRouterFetch },
  );
  assert.equal(subRes.status, 'submitted');
  assert.equal(seenIdempotencyHeader, 'idem_test_12345');

  const globalRes = await fetchGlobalLeaderboard(
    { playerId: 'anon_1234567890abcdef' },
    { baseUrl: 'https://edge.example.ir', fetchImpl: mockRouterFetch },
  );
  assert.equal(globalRes.status, 'ok');

  const fcCreate = await createOnlineFriendChallenge(
    { challengeId: 'Q1-01-E7CFCF50-2A' },
    { baseUrl: 'https://edge.example.ir', fetchImpl: mockRouterFetch },
  );
  assert.equal(fcCreate.status, 'ok');

  const fcExpired = await fetchOnlineFriendChallenge('Q1-EXPIRED', {
    baseUrl: 'https://edge.example.ir',
    fetchImpl: mockRouterFetch,
  });
  assert.equal(fcExpired.status, 'expired');

  const profileGet = await fetchPlayerProfile('anon_1234567890abcdef', {
    baseUrl: 'https://edge.example.ir',
    fetchImpl: mockRouterFetch,
  });
  assert.equal(profileGet.status, 'ok');

  const profileUp = await updatePlayerProfile('anon_1234567890abcdef', 'آذر یزدی', {
    baseUrl: 'https://edge.example.ir',
    fetchImpl: mockRouterFetch,
  });
  assert.equal(profileUp.status, 'ok');
});

test('submissionQueue persists sanitized displayLabel and manages bounded deduplicated offline submission queue', () => {
  const storage = createMemoryStorage();
  assert.equal(getPlayerDisplayLabel(storage), 'مسافر قنات');
  assert.equal(setPlayerDisplayLabel('  <سهراب>   یزدی  ', storage), 'سهراب یزدی');
  assert.equal(getPlayerDisplayLabel(storage), 'سهراب یزدی');

  for (let i = 0; i < MAX_UNSENT_SUBMISSIONS + 5; i++) {
    enqueueUnsentSubmission(
      {
        idempotencyKey: `idem_queue_${i}`,
        challengeType: 'daily',
        challengeId: `daily-v1-2026-11-${String((i % 28) + 1).padStart(2, '0')}`,
        algoVersion: 1,
        actions: [{ row: 0, col: 0 }],
        playerId: 'anon_1234567890abcdef',
        displayLabel: 'سهراب یزدی',
        queuedAt: '2026-11-19T12:00:00Z',
      },
      storage,
    );
  }
  // Duplicate idempotencyKey ignored
  enqueueUnsentSubmission(
    {
      idempotencyKey: 'idem_queue_10',
      challengeType: 'daily',
      challengeId: 'daily-v1-2026-11-19',
      algoVersion: 1,
      actions: [{ row: 0, col: 0 }],
      playerId: 'anon_1234567890abcdef',
      displayLabel: 'سهراب یزدی',
      queuedAt: '2026-11-19T12:00:00Z',
    },
    storage,
  );

  const queued = listUnsentSubmissions(storage);
  assert.equal(queued.length, MAX_UNSENT_SUBMISSIONS);
  assert.equal(queued[0].idempotencyKey, 'idem_queue_5');

  const afterRemove = removeUnsentSubmission('idem_queue_10', storage);
  assert.equal(afterRemove.length, MAX_UNSENT_SUBMISSIONS - 1);
});

