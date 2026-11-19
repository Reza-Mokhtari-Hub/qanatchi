# ArvanCloud Edge Computing — Documentation & Runtime Compatibility Audit (Reconciled)

**Project:** QANATCHI — The Pulse of Persian Water (`قنات‌چی — نبض آب ایران`)  
**Phase:** Phase 6.1 (Final Audit Reconciliation & Cross-Platform Release Fixes)  
**Date Checked:** `2026-11-19`  
**Audit Policy:** An item is labeled `VERIFIED FROM OFFICIAL DOCUMENTATION` **only** when the exact official URL, document/product title, and section/heading were directly retrieved and inspected from this environment. Items whose official `docs.arvancloud.ir` pages could not be directly retrieved (HTTP 307 redirect loop / TCP timeout from this sandbox) are explicitly labeled **`NOT VERIFIED`**—and never inferred to be `NOT SUPPORTED` merely due to inaccessible documentation.

---

## 1. Direct Access Results from This Build Environment (`2026-11-19`)

| Target URL | Access Result | Exact Title / Verification Scope |
| :--- | :--- | :--- |
| `https://arvancloudstatus.ir/` | **HTTP 200 (Directly Retrieved)** | Title: **`Arvancloud Status`** — Service status listings directly confirm active ArvanCloud product lines including **Edge Computing**, **Managed Database**, and **Object Storage**. |
| `https://github.com/arvancloud` | **HTTP 200 (Directly Retrieved)** | Title: **`ArvanCloud · GitHub`** — Official public organization repository listing. |
| `https://docs.arvancloud.ir/en/edge-computing/` & `https://docs.arvancloud.ir/fa/edge-computing/` | **HTTP 307 Redirect Loop (`curl: (47) Maximum (50) redirects followed`)** | **Inaccessible directly from this build container.** Exact documentation pages, headings, and numerical limits could not be directly verified. |
| `https://docs.arvancloud.ir/en/products/edge-computing/` | **TCP Timeout (`curl: (28) Connection timed out`)** | **Inaccessible directly from this build container.** |
| `https://www.arvancloud.ir/en/products/edge-computing` | **Body Download Timeout (`curl: (28) Connection timed out`)** | **Inaccessible directly from this build container.** |

*(Note: Indirect search summaries returned via search grounding cannot substitute for directly verified official documentation URLs, titles, and section headings, so all Edge technical specifications below that rely on `docs.arvancloud.ir` are strictly classified as `NOT VERIFIED` until the project owner confirms them directly in ArvanCloud's documentation/dashboard.)*

---

## 2. Reconciled Compatibility Matrix

| # | Capability / Constraint | Reconciled Status | Evidence, Engineering Choice & Owner Verification Action |
| :-: | :--- | :--- | :--- |
| 1 | **ArvanCloud Product Existence (Edge Computing, Managed Database, Object Storage)** | **VERIFIED FROM OFFICIAL DOCUMENTATION** | URL: `https://arvancloudstatus.ir/` · Title: `Arvancloud Status` · Section: Service Status Overview · Date checked: `2026-11-19`. |
| 2 | **JavaScript Runtime APIs (Web Fetch Standard)** | **NOT VERIFIED** (against `docs.arvancloud.ir`) / **VERIFIED BY ACTUAL RUNTIME TEST** (local V8 Fetch sandbox) | `dist-edge/worker.js` uses strictly standard Web Fetch primitives (`Request`, `Response`, `Headers`, `URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`, `ReadableStream`, `Intl.DateTimeFormat`) with `0` Node/Express/Cloudflare references; verified locally in V8 `vm.Context` (`edge/edge.test.ts`). Confirm exact runtime API table in ArvanCloud docs before live cutover. |
| 3 | **Worker Entry-Point Format (`addEventListener("fetch", ...)`)** | **NOT VERIFIED** (against `docs.arvancloud.ir`) / **VERIFIED BY ACTUAL RUNTIME TEST** (local V8 Fetch sandbox) | `edge/worker.ts` implements `addEventListener("fetch", event => event.respondWith(handleEdgeRequest(event.request)))` per the project specification and executes cleanly in the local V8 Fetch-Event sandbox. Confirm against your ArvanCloud Edge dashboard starter template during upload. |
| 4 | **Deployment Artifact & Bundle-Size Limits** | **NOT VERIFIED** (official ArvanCloud max upload bytes) / **VERIFIED BY ACTUAL RUNTIME TEST** (local build) | `npm run build:edge` outputs minified `dist-edge/worker.js` (`36.01 KiB`, `11.63 KiB` gzip). Confirm your account's exact maximum script size in the ArvanCloud Edge dashboard. |
| 5 | **CPU Execution Time Limits** | **NOT VERIFIED** | Official `docs.arvancloud.ir` limits page was unreachable (`HTTP 307` / timeout). QANATCHI caps request bodies at `16 KiB` (stream-enforced), caps move sequences at `200`, and completes BFS replay in `< 1 ms` locally. Confirm exact CPU ms quota in your ArvanCloud plan. |
| 6 | **Monthly Request Quotas & Billing Entitlements** | **NOT VERIFIED** | Exact free monthly request thresholds and PAYG quotas could not be directly verified from `docs.arvancloud.ir`; check the Quota Management section of your ArvanCloud panel. |
| 7 | **Memory Limits** | **NOT VERIFIED** | Per-isolate RAM limits could not be directly verified from `docs.arvancloud.ir`. Incremental stream-capped body parsing prevents unbounded buffering. |
| 8 | **Web Crypto API (`crypto.subtle`) Support** | **NOT VERIFIED** | Official `docs.arvancloud.ir` examples could not be directly fetched. QANATCHI does **not** depend on `crypto.subtle` in `dist-edge/worker.js` (uses pure ES2022 FNV-1a for deterministic hashing/pseudonyms) and honestly reports `timingVerified: false`. |
| 9 | **Environment Variables & Encrypted Secrets** | **NOT VERIFIED** (exact ArvanCloud injection mechanism) / **VERIFIED BY ACTUAL RUNTIME TEST** (local V8 sandbox) | `edge/env.ts` reads `globalThis` keys (`APP_ENV`, `ALLOWED_ORIGINS`, `EC_URL`, `LEADERBOARD_STORAGE_DRIVER`) with `0` `process.env` references and restricts production `ALLOWED_ORIGINS` to HTTPS-only. Confirm exact dashboard variable binding in your ArvanCloud Edge settings. |
| 10 | **Persistent Storage & Database Connectivity** | **NOT VERIFIED** (official Edge storage/egress/DB support) | Because official Edge storage/egress docs could not be directly fetched and no durable database is provisioned, QANATCHI does **not** assume or invent any Edge KV/DB binding and does **not** claim native storage is unsupported without official proof. Production safely defaults to `UnconfiguredStorageAdapter` (`503 STORAGE_NOT_CONFIGURED`), never using `InMemoryTestStorageAdapter` or fake records. |
| 11 | **Custom Domain Routing, SSL & Logging** | **NOT VERIFIED** | Route path mapping (`/api/v1/*` vs `/*`), SSL provisioning, and Edge log viewer behavior could not be directly fetched from `docs.arvancloud.ir`; verify inside your ArvanCloud CDN/Edge panel. |
| 12 | **Live Remote ArvanCloud Edge PoP Execution** | **BLOCKED** | Blocked by missing ArvanCloud account credentials, API tokens, and live domain access in this container. |

---

## 3. Timing Anti-Cheat & Storage Safety Summary

1. **Honest Timing Limitation (`timingVerified: false`)**: Ranked Scoring v2 intentionally excludes client-reported solve time because deterministic offline-playable puzzles allow offline pre-solving before requesting any server start token, and no durable cross-PoP single-use nonce store is provisioned.
2. **Safe Default Storage (`503 STORAGE_NOT_CONFIGURED`)**: Global leaderboard endpoints remain honestly unconfigured until a verified durable storage backend is provisioned by the project owner.
