# QANATCHI — Production Release & Rollback Checklist

## Local Automated Verification Gates
- [x] `npm run build:edge` builds `dist-edge/worker.js` (`139.17 KiB`, `~33 KiB` gzip) and passes zero-Node / zero-`process.env` / zero-Express / zero-Cloudflare / zero-test-adapter / zero-secret checks.
- [x] `npm run lint` (`tsc --noEmit`) passes with `0` errors.
- [x] `npm test` passes **56 / 56 tests** across `engine`, `campaign` (100 levels), `engagement`, `audio`, `animation`, `edgeClient`, and `edge` (including real local HTTP `/sql` server tests).
- [x] `npm run build` (`cross-env NODE_ENV=production vite build`) compiles `dist/` cleanly with zero secrets in client bundles.

## Infrastructure & Live ArvanCloud Cutover Checklist (Requires Owner Account)
- [ ] Provision ArvanCloud Managed PostgreSQL 14+ and apply `edge/db/migrations/001_initial_schema.sql`.
- [ ] Deploy `scripts/postgres-http-gateway.mjs` behind HTTPS (e.g. ArvanCloud Cloud Container / PaaS) with `DATABASE_URL` and strong `GATEWAY_AUTH_TOKEN`, then verify `GET /healthz`.
- [ ] Upload `dist-edge/worker.js` to ArvanCloud Edge Computing (`qanatchi-api`) and configure encrypted environment variables (`LEADERBOARD_STORAGE_DRIVER=postgres-http`, `LEADERBOARD_DATABASE_URL`, `LEADERBOARD_DATABASE_TOKEN`, `EDGE_SIGNING_SECRET`, `ALLOWED_ORIGINS`, `REQUIRE_ATTEMPT_TOKEN`, `RATE_LIMIT_MAX_PER_MIN`).
- [ ] Upload `dist/` to ArvanCloud Object Storage + CDN (`VITE_EDGE_API_URL` configured if cross-origin, empty if same-origin `/api/v1/*`) and attach `/api/v1/*` route to `qanatchi-api`.
- [ ] Verify live endpoints:
  - `GET /api/v1/health` returns `200 OK` with `globalLeaderboard: true` and zero secret leakage.
  - `GET /api/v1/ready` returns `200 OK` with `storage.reachable: true`.
  - `GET /api/v1/version` reports `totalCampaignLevels: 100`.
  - `POST /api/v1/challenges/start` + `POST /api/v1/leaderboards/submit` verifies solution, enforces single-use nonce (`409 NONCE_ALREADY_USED` on replay), persists score in PostgreSQL, and reflects immediately in `GET /api/v1/leaderboards/daily` & `GET /api/v1/leaderboards/global`.
  - Blocking `/api/v1/*` keeps all 100 campaign levels, daily puzzles, friend puzzles, and offline queue functioning cleanly.

## Rollback Steps
1. Revert `qanatchi-api` to the previous deployment in ArvanCloud Edge Computing History (or detach `/api/v1/*`; frontend seamlessly falls back to offline mode + local submission queue).
2. Restore previous `dist/` static assets in Object Storage and purge CDN cache.
3. Re-run `GET /api/v1/health` and `GET /api/v1/ready`.
