# ArvanCloud Edge Computing — Documentation & Runtime Compatibility Audit

**Project:** QANATCHI — The Pulse of Persian Water (`قنات‌چی — نبض آب ایران`)  
**Audit Policy:** Direct documentation verification is separated from runtime verification (`dist-edge/worker.js` static audit + isolated V8 `vm.Context` sandbox execution). Items that require live ArvanCloud dashboard confirmation or credentials are explicitly marked `REQUIRES LIVE VERIFICATION`.

---

## 1. Compatibility Matrix

| # | Capability / Constraint | Status | Engineering Implementation & Verification |
| :-: | :--- | :--- | :--- |
| 1 | **Entry Point (`addEventListener("fetch", ...)`)** | **VERIFIED IN SANDBOX** | `edge/worker.ts` registers standard Web Fetch event handling (`event.respondWith(handleEdgeRequest(event.request))`). Verified in isolated V8 `vm.Context` (`edge/edge.test.ts`). |
| 2 | **Pure ES2022 Web Fetch Standard** | **VERIFIED BY AUDIT & SANDBOX** | `dist-edge/worker.js` (`139.17 KiB`, `~33 KiB` gzip) is built with `esbuild --platform=neutral --target=es2022` and passes automated zero-`node:*`, zero-`require()`, zero-`process.env`, zero-`express`, and zero-Cloudflare checks (`scripts/build-edge.mjs`). |
| 3 | **CPU Execution Budget (~10 ms standard)** | **OPTIMIZED / LOCAL VERIFIED** | Bodies capped via streaming reader at `16 KiB`, action sequences capped at `200`, BFS replay completes in `< 1 ms` locally, and Postgres persistence uses single-roundtrip atomic CTE queries with a `4000 ms` `AbortController` timeout. |
| 4 | **Cryptography (`SHA-256` / `HMAC-SHA256`)** | **VERIFIED BY CRYPTO VECTORS** | `edge/crypto.ts` implements pure ES2022 SHA-256 and HMAC-SHA256 (verified against FIPS 180-4 & RFC 4231 test vectors) without requiring `node:crypto` or `crypto.subtle`. |
| 5 | **Environment Variables & Encrypted Secrets** | **VERIFIED IN SANDBOX** | `edge/env.ts` reads ArvanCloud global variables (`APP_ENV`, `EC_URL`, `ALLOWED_ORIGINS`, `LEADERBOARD_STORAGE_DRIVER`, `LEADERBOARD_DATABASE_URL`, `LEADERBOARD_DATABASE_TOKEN`, `EDGE_SIGNING_SECRET`, `REQUIRE_ATTEMPT_TOKEN`, `RATE_LIMIT_MAX_PER_MIN`, `ENABLE_STRUCTURED_LOGS`) from `globalThis` (with dev `bindings` injection in Vite dev middleware only). |
| 6 | **Durable Storage (ArvanCloud Managed PostgreSQL)** | **HTTPS SQL ADAPTER READY / LIVE DB BLOCKED** | ArvanCloud Edge workers do not expose raw TCP PostgreSQL sockets or native Edge KV. `PostgresHttpStorageAdapter` (`edge/storage/postgresHttpStorage.ts`) communicates via Web `fetch()` (`POST /sql`) with `scripts/postgres-http-gateway.mjs` (or any Neon-compatible HTTPS SQL endpoint). Safely defaults to `503 STORAGE_NOT_CONFIGURED` when unset. |
| 7 | **CORS & Security Headers** | **VERIFIED BY TESTS** | Rejects `*`, `null`, and `http://` origins in `production` (`ALLOWED_ORIGINS` accepts `https://` only); sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`. |
| 8 | **Live ArvanCloud Edge PoP Deployment** | **BLOCKED (NO CREDENTIALS)** | Automated upload and live PoP testing require an ArvanCloud API token/CLI session, domain configuration, and provisioned Managed PostgreSQL instance. |
