# QANATCHI — Edge API & Production Architecture Reference

**Project:** QANATCHI — The Pulse of Persian Water (`قنات‌چی — نبض آب ایران`)  
**API Version:** `v1`  
**Campaign Scope:** 12 Regional Routes · 50 Destinations · 100 Handcrafted Levels

---

## 1. End-to-End Architecture

```
+-------------------------------------------------------------+
| Frontend SPA (React 19 + TypeScript + Vite -> dist/)        |
| Hosted on ArvanCloud Object Storage + CDN (Static Edge)     |
| - 100% offline-first Campaign (100 levels), Daily & Friend  |
| - Submission Queue (localStorage) + VITE_EDGE_API_URL       |
+------------------------------+------------------------------+
                               | HTTPS (/api/v1/*, Same-Origin or CORS)
                               v
+-------------------------------------------------------------+
| ArvanCloud Edge Computing Worker (dist-edge/worker.js)      |
| - Pure Web Fetch ES2022 (addEventListener("fetch", ...))    |
| - Zero Node.js APIs, zero process.env, 139 KiB minified     |
| - Server-side deterministic BFS solution replay             |
| - Pure ES2022 HMAC-SHA256 attemptToken & single-use nonces  |
| - Structured JSON logs (with automatic secret redaction)    |
+------------------------------+------------------------------+
                               | HTTPS POST /sql + Bearer Token (4s timeout)
                               v
+-------------------------------------------------------------+
| Postgres HTTP SQL Gateway (scripts/postgres-http-gateway.mjs|
| - Deployed in ArvanCloud Cloud Container / PaaS alongside DB|
| - Parameterized $1..$N SQL queries over SSL                 |
+------------------------------+------------------------------+
                               | TCP / TLS (Private Network)
                               v
+-------------------------------------------------------------+
| ArvanCloud Managed PostgreSQL (DBaaS)                       |
| - edge/db/migrations/001_initial_schema.sql                 |
| - Atomic CTE idempotency, best-score upsert, rankings       |
+-------------------------------------------------------------+
```

---

## 2. API Endpoints (`/api/v1/*`)

| Method & Path | Purpose | Storage Required | Key Error Codes |
| :--- | :--- | :---: | :--- |
| `GET /api/v1/health` | Liveness, Tehran date, algorithm versions, feature flags | No | `405` |
| `GET /api/v1/ready` | Verifies durable DB connectivity (`SELECT 1`) & latency | Yes | `503 STORAGE_NOT_CONFIGURED`, `503 STORAGE_UNAVAILABLE` |
| `GET /api/v1/version` | API platform, campaign count (`100`), algorithm versions | No | `405` |
| `GET /api/v1/daily` | Authoritative `Asia/Tehran` daily challenge metadata | No | `400 UNSUPPORTED_ALGO_VERSION` |
| `POST /api/v1/challenges/start` | Issues HMAC-SHA256 `attemptToken` + records single-use nonce | Optional | `400 INVALID_PLAYER_ID`, `429 RATE_LIMIT_EXCEEDED`, `503 SIGNING_SECRET_NOT_CONFIGURED` |
| `POST /api/v1/challenges/verify` | Authoritative BFS solution replay for `campaign` (`1..100`), `daily`, `friend` | No | `400`, `413`, `415`, `422 SOLUTION_HAS_LEAKS / IMPOSSIBLE_SOLVE_TIME` |
| `POST /api/v1/friend-challenges` | Registers friend challenge metadata + optional expiry window | Yes | `400`, `429`, `503 STORAGE_NOT_CONFIGURED` |
| `GET /api/v1/friend-challenges/:id` | Fetches metadata, participant count & expiry status | Optional | `400`, `410 CHALLENGE_EXPIRED` |
| `GET /api/v1/leaderboards/daily` | Paginated daily leaderboard (`?date=YYYY-MM-DD&limit&offset&playerId`) | Yes | `400`, `503 STORAGE_NOT_CONFIGURED / STORAGE_UNAVAILABLE` |
| `GET /api/v1/leaderboards/friend` | Paginated friend challenge leaderboard (`?challengeId=...`) | Yes | `400`, `503` |
| `GET /api/v1/leaderboards/global` | Cross-challenge cumulative leaderboard across players | Yes | `400`, `503` |
| `POST /api/v1/leaderboards/submit` | Replays solution, validates token/nonce, saves best score atomically (`Idempotency-Key`) | Yes | `400`, `409 NONCE_ALREADY_USED`, `410 CHALLENGE_EXPIRED`, `422`, `429`, `503` |
| `GET /api/v1/players/me` | Anonymous player profile summary & recent verified submissions | Yes | `400 INVALID_PLAYER_ID`, `503` |
| `POST /api/v1/players/profile` | Updates sanitized player nickname (`displayLabel`) | Yes | `400`, `429`, `503` |

---

## 3. PostgreSQL Schema & Migrations

Run `edge/db/migrations/001_initial_schema.sql` against your PostgreSQL 14+ database before enabling `LEADERBOARD_STORAGE_DRIVER="postgres-http"`:

- `players`: Opaque hashed player identities (`player_id_hash`), sanitized `display_label`, cumulative verified scores.
- `friend_challenges`: Challenge metadata, optional `expires_at` (`410 CHALLENGE_EXPIRED`), and creator hash.
- `challenge_nonces`: Single-use server-issued attempt nonces preventing replay attacks (`409 NONCE_ALREADY_USED`).
- `verified_submissions`: Immutable audit log of verified runs with `UNIQUE (submission_fingerprint)` and `UNIQUE (idempotency_key)`.
- `leaderboard_best`: Materialized per-(challenge, player) best score row with composite index `(challenge_type, challenge_id, score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC)`.
- `rate_limit_buckets`: Cross-PoP sliding window rate-limiting state (`429 RATE_LIMIT_EXCEEDED`).

---

## 4. Security Guarantees

- **Zero Trust in Client Metrics**: Scores, stars, moves, elapsed times, and board JSON sent by clients are completely ignored. The Edge worker reconstructs the exact puzzle from trusted server definitions (`LEVELS`, `generateDailyChallenge`, or signed `Q1-...` friend code) and replays every tile rotation through `simulateWaterFlow()`.
- **Pure ES2022 Cryptography (`edge/crypto.ts`)**: Self-contained SHA-256 and HMAC-SHA256 implementation requiring zero `node:crypto` and zero reliance on `crypto.subtle`.
- **Single-Use Nonce & Minimum Solve Time**: `/api/v1/challenges/start` issues a short-lived HMAC-signed `attemptToken`; `/api/v1/leaderboards/submit` enforces physical minimum solve thresholds (`422 IMPOSSIBLE_SOLVE_TIME`) and atomically consumes the nonce (`409 NONCE_ALREADY_USED`).
- **Fail-Closed Storage & Redacted Logging**: Production requires `https://` for `LEADERBOARD_DATABASE_URL`, checks explicit `ALLOWED_ORIGINS` (`https://` only, never `*`), caps request bodies via streaming reader at `16 KiB`, and automatically redacts secret/token fields from structured JSON logs.
