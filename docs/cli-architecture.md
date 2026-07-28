# NimQuest QA CLI Architecture

This document records what the CLI was built against. Every check is derived from the repository, not invented.

## Application under test

- Language and runtime: JavaScript, ESM (`"type": "module"`), Node.js 20+.
- Package manager: npm.
- Frontend: Vite single-page app in `apps/web`, built to `dist/`.
- Two equivalent backends serving the same routes:
  - Node server `apps/api/src/server.js` for local development and tests. Reads `PORT` (default 8787). Serves `dist/` and the API. `/health` returns `{ ok: true, service: "nimquest-api" }`.
  - Cloudflare Worker `worker/index.js` for production. `/health` returns `{ ok: true, service: "nimquest-worker" }`. Static assets and SPA fallback are served by Workers Static Assets; `run_worker_first` is scoped to `/api/*` and `/health`.
- Database: Cloudflare D1 in production, migrations in `migrations/` (three applied). Local development uses file-backed storage.
- Authentication: there is no user login. Proof of control is a Nimiq wallet signature verified server-side. Signing requires the Nimiq Pay Mini App provider, so it cannot be automated headlessly.
- Deployment: Cloudflare Workers, live at https://nimquest.artistic-chip.workers.dev, auto-deployed from `main`.

## API routes (derived from server.js and worker/index.js)

```
GET  /health
GET  /api/quests
GET  /api/quests/:id
GET  /api/leaderboard
GET  /api/completions?wallet=:address
GET  /api/completions/:receiptId
POST /api/grade                 read-only, grades quiz answers
POST /api/completion-challenges writes a short-lived challenge row
POST /api/complete              needs a real Nimiq signature
POST /api/feedback              needs a completion token
```

Write routes reject cross-origin browser requests with 403. D1 rate limits apply per route.

## Primary user journeys

1. Learn: read a quest lesson.
2. Answer: server grades the quiz (`POST /api/grade`). Correct answers never reach the browser.
3. Prove: sign a one-time challenge in Nimiq Pay (`POST /api/completion-challenges` then `POST /api/complete`).
4. Record: the verified completion is stored and appears on the masked leaderboard.

Steps 1, 2, and the challenge issuance are automatable. The signing step needs Nimiq Pay and is marked SKIP by the CLI.

## Existing tests reused

- `npm test` runs `node --test` (25 unit, API, and crypto tests).
- `npm run test:browser` runs the Playwright smoke suite in `scripts/browser-smoke.mjs`.
- `npm run worker:check` builds the frontend and runs `wrangler deploy --dry-run`.
- `scripts/worker-integration.mjs` runs the full Worker and D1 flow.

## Safety boundaries

- Live and deploy checks are read-only. The CLI never POSTs to production without `--allow-write`, and the write flow only runs against a local server.
- The completion-challenge write flow writes an isolated, short-lived local challenge and never touches production D1.
- No secrets are printed. Config checks report presence, not values.
- Release-blocking failures return a non-zero exit code.

## CLI layout

```
cli/
  index.mjs   entry, flag parsing, command dispatch, reporting, artifacts
  lib.mjs     http helpers, local server management, check runner, status helpers
  checks.mjs  health, config, doctor, api, flow, and deploy checks
```

Artifacts are written to `artifacts/qa/` (`summary.json`, `summary.md`).
