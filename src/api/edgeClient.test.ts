import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fetchApiHealth,
  fetchDailyLeaderboard,
  fetchFriendLeaderboard,
  fetchServerDailyMetadata,
  resolveApiBaseUrl,
  submitVerifiedScoreToLeaderboard,
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
