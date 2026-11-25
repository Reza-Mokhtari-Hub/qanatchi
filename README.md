# QANATCHI — قنات‌چی (نبض آب ایران)

[![Author](https://img.shields.io/badge/Author-Reza--Mokhtari--Hub-19A7B8?style=flat-square)](https://github.com/Reza-Mokhtari-Hub)
[![Live Demo](https://img.shields.io/badge/Live-ghanatchi.dentalfy.ir-D99B26?style=flat-square)](https://ghanatchi.dentalfy.ir/)
[![Stack](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-3178C6?style=flat-square)](#tech-stack)
[![Runtime](https://img.shields.io/badge/Edge%20API-ArvanCloud%20Edge%20Computing-0F766E?style=flat-square)](#edge-api--anti-cheat-architecture)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2014%2B%20%2F%20Neon%20HTTP-336791?style=flat-square)](#database-setup)

> **نبض آب ایران** — یک بازی پازل استراتژیک در ستایش مهندسی قنات‌های باستانی و جغرافیای فرهنگی ایران؛ از بادگیرهای یزد تا راه کوچ شاهسون و دشت‌های ترکمن‌صحرا.

**QANATCHI** (`قنات‌چی`) is a full-stack Persian water-channel puzzle game engineered by **[Reza Mokhtari (`@Reza-Mokhtari-Hub`)](https://github.com/Reza-Mokhtari-Hub)** for the **ArvanCloud Edge Game Dev Competition**.

Live production deployment: **[https://ghanatchi.dentalfy.ir/](https://ghanatchi.dentalfy.ir/)**

---

## Table of Contents

- [Overview & Gameplay](#overview--gameplay)
- [Campaign Structure (12 Routes · 50 Destinations · 100 Levels)](#campaign-structure-12-routes--50-destinations--100-levels)
- [Tech Stack](#tech-stack)
- [Edge API & Anti-Cheat Architecture](#edge-api--anti-cheat-architecture)
- [Engineering Notes & Trade-offs](#engineering-notes--trade-offs)
- [Project Structure](#project-structure)
- [Local Development & Testing](#local-development--testing)
- [Database Setup](#database-setup)
- [Deploying to ArvanCloud](#deploying-to-arvancloud)
- [API Reference](#api-reference)
- [Author](#author)

---

## Overview & Gameplay

Players restore dry underground *qanat* aqueducts by rotating tile segments (`straight`, `corner`, `tee`, `cross`, plus fixed `source`, `destination`, and `blocker` tiles) on grid boards before releasing water flow. A valid solution must reach **every** destination (`مظهر قنات`) without a single open leak (`نشت آب`).

Core features implemented in the client and edge backend:

- **100-Level Handcrafted Campaign**: Sequential progression across 12 Iranian cultural & geographic routes with region unlock milestones, story moments, optimal-move hints, and 3-star scoring.
- **Deterministic Daily Challenge**: Synchronized strictly to the **`Asia/Tehran`** calendar (`UTC+03:30`) using a seeded PRNG (`src/engagement/prng.ts`), puzzle template transformer, and daily streak tracker.
- **Shareable Friend Challenges**: Deterministic challenge codes (`Q1-...`) that generate identical puzzles on any device and support server-backed expiry windows and per-challenge leaderboards.
- **Offline-First Resilience**: Campaign progression, daily records, friend records, and an idempotent unsent-submission queue (`localStorage`) ensure zero lost progress even if `/api/v1/*` is unreachable.
- **Custom Visuals & Synthesized Audio**: Step-by-step water-flow propagation, leak splash animations, Persian Lalezar/Vazirmatn typography, full RTL layout, reduced-motion accessibility, and zero-asset Web Audio API sound synthesis (`src/audio/soundEngine.ts`).

---

## Campaign Structure (12 Routes · 50 Destinations · 100 Levels)

Every campaign grid is programmatically verified (`src/engine/verifier.ts`) at test time for uniqueness, tile rotation solvability, and zero-leak reachability:

| # | Route | Key Destinations | Levels |
| :---: | :--- | :--- | :---: |
| 1 | **یزد (Yazd)** | یزد، میبد، اردکان، تفت | 1–8 |
| 2 | **کرمان (Kerman)** | کرمان، ماهان، بم، راین | 9–16 |
| 3 | **کاشان و پیرامون (Kashan)** | کاشان، ابوزیدآباد، نیاسر، قمصر | 17–24 |
| 4 | **زنجان (Zanjan)** | زنجان، ایجرود، سلطانیه، ماهنشان | 25–32 |
| 5 | **خراسان (Khorasan)** | گناباد، فردوس، طبس، بیرجند | 33–40 |
| 6 | **فلات اصفهان (Isfahan Plateau)** | اصفهان، اردستان، نائین، نطنز | 41–48 |
| 7 | **فارس (Fars)** | شیراز، نی‌ریز، استهبان، آباده | 49–56 |
| 8 | **سمنان (Semnan)** | گرمسار، سمنان، دامغان، شاهرود | 57–64 |
| 9 | **شمال‌غرب ایران (Northwest)** | تبریز، مراغه، خوی، ارومیه | 65–72 |
| 10 | **خراسان رضوی (Razavi Khorasan)** | نیشابور، سبزوار، کاشمر، تربت حیدریه | 73–80 |
| 11 | **راه کوچ شاهسون (Shahsavan Trail)** | پارس‌آباد، بیله‌سوار، گرمی، مشگین‌شهر، اردبیل و دامنه سبلان | 81–90 |
| 12 | **راه ترکمن‌صحرا (Turkmen Sahra)** | گنبد کاووس، آق‌قلا، بندر ترکمن، گمیشان، مراوه‌تپه | 91–100 |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion
- **Edge Runtime**: Pure Web Fetch API Service Worker (`addEventListener('fetch', ...)`), ES2020 IIFE bundle via `esbuild`, zero Node.js built-ins
- **Database**: PostgreSQL 14+ via either:
  - **Neon Serverless HTTP** (`neon-http` driver using `POST /sql` with `Neon-Connection-String`), or
  - **ArvanCloud Managed PostgreSQL** behind the included lightweight Node HTTP SQL Gateway (`gateway/` & `scripts/postgres-http-gateway.mjs`)
- **Testing**: Built-in Node test runner (`node:test` + `tsx`) with 60 unit & end-to-end HTTP integration tests

---

## Edge API & Anti-Cheat Architecture

```text
+-----------------------------------------------------------------------+
| Frontend SPA (React 19 + TypeScript -> dist/)                         |
| Hosted on ArvanCloud Object Storage + CDN                             |
| - 100% offline-playable Campaign, Daily & Friend Challenges           |
| - Offline retry queue + Idempotency-Key deduplication                 |
+-----------------------------------+-----------------------------------+
                                    | HTTPS (/api/v1/*)
                                    v
+-----------------------------------------------------------------------+
| ArvanCloud Edge Worker (dist-edge/worker.js)                          |
| - Pure Web Fetch ES2020 (zero Node APIs, zero process.env)            |
| - Server-side deterministic BFS solution replay (simulateWaterFlow)   |
| - Pure ES2022 SHA-256 / HMAC-SHA256 attemptToken & single-use nonces  |
| - Structured JSON logs with automatic secret/token redaction          |
+-----------------------------------+-----------------------------------+
                                    | HTTPS POST /sql (4s timeout)
                                    v
+-----------------------------------------------------------------------+
| PostgreSQL 14+ (Neon HTTP /sql OR ArvanCloud DBaaS + gateway/)        |
| - 6 relational tables: players, verified_submissions,                 |
|   leaderboard_best, challenge_nonces, friend_challenges,              |
|   rate_limit_buckets                                                  |
+-----------------------------------------------------------------------+
```

### How Score Verification Works

The Edge API **never trusts** client-reported scores, star counts, move counts, elapsed times, or board JSON:

1. When starting a Daily or Friend challenge, the client requests `POST /api/v1/challenges/start`, receiving an HMAC-SHA256 signed `attemptToken` backed by a `challenge_nonces` row.
2. On completion, the client submits only `{ challengeType, challengeId, algoVersion, actions: [{ row, col }, ...], attemptToken }`.
3. The Edge worker reconstructs the exact initial board from trusted server definitions (`LEVELS`, `generateDailyChallenge`, or `parseFriendChallengeCode`), replays every rotation step through `simulateWaterFlow()`, and checks for boundary errors, locked tiles, leaks, and incomplete paths.
4. Score, stars, and move count are computed server-side (`calculateRankedScore` v2).
5. If an `attemptToken` is supplied (or required via `REQUIRE_ATTEMPT_TOKEN`), the worker checks HMAC integrity, enforces minimum physical solve duration (`422 IMPOSSIBLE_SOLVE_TIME`), and consumes the nonce once (`409 NONCE_ALREADY_USED` on replay).

---

## Engineering Notes & Trade-offs

A few practical lessons baked directly into the codebase while building for ArvanCloud Edge:

- **Self-contained Web Cryptography (`edge/crypto.ts`)**: Because lightweight Edge isolates don't guarantee `node:crypto` and synchronous verification keeps worker latency predictable, SHA-256 and HMAC-SHA256 are implemented directly in TypeScript/ES2022.
- **ArvanCloud Edge Variable Binding (`edge/env.ts`)**: ArvanCloud Edge Computing exposes variables on the global/event scope rather than `process.env`, and the dashboard JSON variable UI expects valid JSON objects (`{ ... }`). `readEdgeRuntimeConfig()` resolves individual bindings, `{ "value": "..." }` wrappers, `event.env`/`event.bindings`, and consolidated `QANATCHI_CONFIG` JSON objects seamlessly, while `scripts/build-edge.mjs` statically rejects any accidental `process.env` or `node:*` reference.
- **Sequential PostgreSQL Statements over Single Multi-CTE Queries (`edge/storage/postgresHttpStorage.ts`)**: In PostgreSQL MVCC, sibling CTEs inside a single `WITH` statement share a snapshot taken before the statement starts—meaning a final ranking `SELECT` CTE cannot observe rows written by an `INSERT/UPSERT` CTE in the same statement. `saveVerifiedSubmission` runs committed parameterized statements sequentially (`players` -> `verified_submissions` `ON CONFLICT DO NOTHING` -> `leaderboard_best` strict-improvement upsert -> player totals -> rank lookup), keeping Neon/Postgres HTTP consistent on first-time submissions as well as retries.
- **ASCII Multi-line Edge Bundle (`scripts/build-edge.mjs`)**: `esbuild` outputs an IIFE bundle formatted cleanly across ASCII lines (`charset: 'ascii'`, `target: 'es2020'`) so pasting or uploading into web-based Edge editors never chokes on minified single-line buffers or non-ASCII literals.

---

## Project Structure

```text
.
├── src/
│   ├── engine/          # Tile port model, BFS flow simulator, hint engine, verifier, local scoring
│   ├── campaign/        # 12 routes, 50 destinations, story milestones, v1->v5 storage migration
│   ├── levels/          # All 100 handcrafted levels organized by region
│   ├── engagement/      # Tehran daily generator, friend codes, ranked scoring v2, solution replay
│   ├── animation/       # Water-flow animation state machine & timing specs
│   ├── audio/           # Zero-dependency Web Audio synthesizer
│   ├── api/             # Typed Edge client & offline localStorage submission queue
│   ├── components/      # GameScreen, Board, RegionalMap, Daily/Friend hubs, LeaderboardPanel
│   └── storage/         # Local persistence for campaign progress & user preferences
├── edge/
│   ├── worker.ts        # ArvanCloud Edge fetch event entry point
│   ├── router.ts        # REST router (/api/v1/*), validation, CORS, rate-limiting
│   ├── crypto.ts        # Pure ES2022 SHA-256 / HMAC-SHA256 & attempt tokens
│   ├── env.ts           # Edge config reader (QANATCHI_CONFIG + global/event bindings)
│   ├── logger.ts        # Structured JSON logs with credential redaction
│   ├── db/migrations/   # PostgreSQL schema (001_initial_schema.sql)
│   └── storage/         # PostgresHttpStorageAdapter (postgres-http & neon-http) + test adapter
├── gateway/             # Optional self-migrating Node HTTPS->PostgreSQL SQL bridge (Dockerfile included)
├── scripts/
│   ├── build-edge.mjs   # Bundles dist-edge/worker.js + runs strict Edge compatibility audit
│   └── postgres-http-gateway.mjs
└── docs/                # API reference, compatibility checklist, and Persian deployment guide
```

---

## Local Development & Testing

### Prerequisites

- Node.js 20+
- npm (or bun)

### Install & Run Locally

```bash
npm install
npm run dev
```

The Vite development server starts on `http://localhost:3000`.

### Build & Verify

```bash
# 1. Type-check TypeScript (client + edge)
npm run lint

# 2. Run all 60 unit & integration tests
npm test

# 3. Build frontend SPA -> dist/
npm run build

# 4. Build & audit ArvanCloud Edge worker -> dist-edge/worker.js
npm run build:edge
node -c dist-edge/worker.js
```

---

## Database Setup

Apply [`edge/db/migrations/001_initial_schema.sql`](edge/db/migrations/001_initial_schema.sql) to any PostgreSQL 14+ instance (for example via the **Neon SQL Editor** or `psql`):

Tables created:
- `players` — Hashed anonymous IDs (`player_id_hash`), sanitized display labels, aggregate scores
- `friend_challenges` — Registered friend challenges, optional `expires_at`
- `challenge_nonces` — Single-use attempt nonces (`consumed_at`)
- `verified_submissions` — Deduplicated audit log (`submission_fingerprint`, `idempotency_key`, `nonce_id`)
- `leaderboard_best` — Materialized best run per `(challenge_type, challenge_id, player_id_hash)`
- `rate_limit_buckets` — Persistent sliding-window rate-limit counters

If you use **ArvanCloud Managed PostgreSQL** instead of Neon HTTP, deploy the standalone [`gateway/`](gateway/) service (`AUTO_MIGRATE=true` creates tables automatically on boot).

---

## Deploying to ArvanCloud

1. **Frontend (`dist/`)**: Run `npm run build` and upload `dist/` to **ArvanCloud Object Storage** behind **ArvanCloud CDN**.
2. **Edge Worker (`dist-edge/worker.js`)**: Run `npm run build:edge` and deploy `dist-edge/worker.js` to **ArvanCloud Edge Computing**.
3. **Edge Route**: Forward `/api/v1/*` on your CDN domain to the Edge Computing application (same-origin avoids CORS preflight overhead).
4. **Environment Configuration (`QANATCHI_CONFIG`)**: Add a Secret JSON variable named `QANATCHI_CONFIG` in ArvanCloud Edge Computing:

```json
{
  "APP_ENV": "production",
  "LEADERBOARD_STORAGE_DRIVER": "neon-http",
  "LEADERBOARD_DATABASE_URL": "postgresql://USER:PASSWORD@YOUR_NEON_POOLER_HOST/neondb?sslmode=require",
  "EDGE_SIGNING_SECRET": "REPLACE_WITH_64_HEX_RANDOM_SECRET",
  "REQUIRE_ATTEMPT_TOKEN": false,
  "RATE_LIMIT_MAX_PER_MIN": 60,
  "ENABLE_STRUCTURED_LOGS": true
}
```

For full step-by-step Persian instructions (including ArvanCloud Managed PostgreSQL + Container Gateway setup), see [`docs/ARVANCLOUD_DEPLOYMENT_FA.md`](docs/ARVANCLOUD_DEPLOYMENT_FA.md).

---

## API Reference

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/api/v1/health` | `GET` | Service status, Tehran server date, algorithm versions, feature flags |
| `/api/v1/ready` | `GET` | Live database connectivity probe (`SELECT 1`) and latency |
| `/api/v1/version` | `GET` | API version and total campaign levels (`100`) |
| `/api/v1/daily` | `GET` | Authoritative `Asia/Tehran` daily puzzle metadata |
| `/api/v1/challenges/start` | `POST` | Issues HMAC-SHA256 signed `attemptToken` + saves single-use nonce |
| `/api/v1/challenges/verify` | `POST` | Deterministic server-side BFS solution replay (`campaign`, `daily`, `friend`) |
| `/api/v1/friend-challenges` | `POST` | Creates/registers a friend challenge with optional TTL |
| `/api/v1/friend-challenges/:id` | `GET` | Retrieves friend challenge metadata and participant count |
| `/api/v1/leaderboards/daily` | `GET` | Paginated daily leaderboard (`date`, `limit`, `offset`, `playerId`) |
| `/api/v1/leaderboards/friend` | `GET` | Paginated friend challenge leaderboard (`challengeId`) |
| `/api/v1/leaderboards/global` | `GET` | Cumulative global leaderboard across players |
| `/api/v1/leaderboards/submit` | `POST` | Replays moves, validates optional token/nonce, saves best score atomically |
| `/api/v1/players/me` | `GET` | Anonymous player profile summary and recent verified runs |
| `/api/v1/players/profile` | `POST` | Updates sanitized player nickname (`displayLabel`) |

Detailed schema & error codes are documented in [`docs/API_AND_ARCHITECTURE.md`](docs/API_AND_ARCHITECTURE.md).

---

## Author

**Reza Mokhtari** — GitHub: [@Reza-Mokhtari-Hub](https://github.com/Reza-Mokhtari-Hub)
