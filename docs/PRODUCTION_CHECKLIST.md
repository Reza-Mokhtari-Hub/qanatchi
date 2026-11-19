# QANATCHI — Production Release & Rollback Checklist (Phase 6.1)

## Pre-Deployment Local Gates
- [x] `npm run build:edge` succeeds, outputs minified `dist-edge/worker.js` (`36 KiB`), and passes the zero-Node / zero-Express / zero-`process.env` / zero-Cloudflare / zero-test-adapter / zero-secret audit.
- [x] `npm run lint` (`tsc --noEmit`) passes with `0` errors.
- [x] `npm test` passes 100% (**45 / 45 tests** across `engine`, `campaign`, `engagement`, `audio`, `animation`, `edgeClient`, and `edge`).
- [x] `npm run build` (`cross-env NODE_ENV=production vite build`) succeeds with `0` chunk-size warnings, `0` React DevTools development strings, lazy-loaded secondary screens, and optimized progressive hero JPEG (`149 KiB`). *(Verified on Linux; Windows PowerShell execution not yet tested.)*
- [x] Zero secrets, API keys, or `InMemoryTestStorageAdapter` references exist in `dist/` or `dist-edge/worker.js`.

## ArvanCloud Dashboard Live Verification (Perform After Manual Upload)
- [ ] `GET https://<domain>/api/v1/health` returns `200 OK` with `ok: true`, `apiVersion: "v1"`, accurate `Asia/Tehran` date, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, and zero secrets.
- [ ] `GET https://<domain>/api/v1/daily` returns deterministic metadata matching today's Tehran date.
- [ ] `POST https://<domain>/api/v1/challenges/verify` rejects invalid JSON (`400`), wrong Content-Type (`415`), oversized/streaming payload > 16 KiB (`413`), unsupported methods (`405`), and incomplete/leaking solutions (`422`), and accepts valid action sequences (`200`) with server-computed Ranked Scoring v2.
- [ ] `GET https://<domain>/api/v1/leaderboards/daily` returns `503 STORAGE_NOT_CONFIGURED` cleanly until a verified durable database gateway is configured (zero fabricated entries).
- [ ] `ALLOWED_ORIGINS` accepts only `https://` origins in production; `Origin: https://evil.example.com` and plain `http://` origins receive NO `Access-Control-Allow-Origin` header.
- [ ] Static SPA serves `dist/index.html` cleanly at `/` (or configured `VITE_BASE_PATH`) and preserves `?challenge=Q1-...` friend links on direct navigation.
- [ ] Blocking `/api/v1/*` or disconnecting network keeps Campaign (24 levels), Daily Challenge, Friend Challenges, and Personal Statistics 100% playable offline.

## Rollback Steps
1. Revert `qanatchi-api` in ArvanCloud Edge Computing Dashboard Deployments history to the previous verified release (or temporarily detach `/api/v1/*`; frontend degrades gracefully to offline mode).
2. Restore previous `dist/` archive to Object Storage / static host and purge ArvanCloud CDN cache.
3. Re-verify `GET /api/v1/health` and desktop/mobile page load.
