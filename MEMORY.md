# NimQuest Memory

This file is the project source of truth. It must be updated after every milestone or checkpoint before pushing.

## Operating Rules

- Use `master-forge-orchestrator` as the coordinator.
- Backend comes before frontend.
- Every milestone/checkpoint updates this file.
- Every milestone/checkpoint is committed and pushed to GitHub.
- GitHub actions are handled through the GitHub plugin, not GitHub CLI.
- No deploy, publish, submit, delete, or irreversible external action without explicit approval.

## Milestone 0 - Project Start

Date: 2026-07-28

Phase: Research and requirements moving into backend architecture.

Decisions:

- Project name: NimQuest.
- Target competition: Nimiq Mini Apps Competition, Cycle I.
- Build strategy: backend-first, smallest complete judging flow.
- Product thesis: 60-second Nimiq onboarding quests with wallet-based completion proof and NIM-native reward readiness.
- Frontend is intentionally deferred until backend behavior is stable.

Deliverables:

- Private GitHub repo verified: `mystiquemide/nimquest`.
- Backend API scaffold planned.
- Memory logging established.

Risks:

- Cycle I timing is tight.
- Real Nimiq Pay wallet testing is still unverified.
- Reward sending may need a later integration or manual funding model.

Next checkpoint:

- Backend API scaffold with quests, quiz grading, wallet completion proof, duplicate guard, and tests.

## Checkpoint 1 - Backend API Scaffold

Date: 2026-07-28

Phase: Backend build.

Deliverables:

- Added dependency-free Node API scaffold.
- Added three onboarding quests:
  - `wallet-basics`
  - `nim-payments`
  - `mini-app-safety`
- Added public quest serialization that hides answer keys.
- Added quiz grading.
- Added wallet-address completion proof.
- Added duplicate reward guard per quest and wallet.
- Added health route and API route plan.
- Added Node test suite.

Verification:

- Command: `npm test`
- Result: pass
- Evidence: 5 tests passed, 0 failed.

Risks:

- Completion proof is currently in-memory and will reset when the server restarts.
- Reward claim status is prepared as `ready_for_wallet_claim`; actual NIM transfer integration is not built yet.
- Wallet-address validation is not strict yet.

Next checkpoint:

- Add persistence boundary and stricter backend validation before frontend work.

## Correction - Master Forge Foundation Docs

Date: 2026-07-28

Note:

- The Master Forge foundation docs were missing after project initialization.
- Added the required project control files:
  - `PRD.md`
  - `TASKS.md`
  - `ARCHITECTURE.md`

Reason:

- These files keep requirements, architecture, and execution checkpoints explicit while we move fast for Cycle I.

## Checkpoint 2 - Backend Validation and Persistence

Date: 2026-07-28

Phase: Backend build.

Deliverables:

- Added `PRD.md`, `TASKS.md`, and `ARCHITECTURE.md`.
- Added durable JSON completion storage.
- Added atomic completion store writes.
- Added Nimiq and EVM wallet-address validation.
- Added Nimiq Pay device identifier validation.
- Added tests for invalid wallet addresses.
- Added tests for invalid device identifiers.
- Added persistence test across store instances.
- Updated README to point to project control docs.

Verification:

- Command: `npm test`
- Result: pass
- Evidence: 8 tests passed, 0 failed.

Risks:

- Completion persistence is file-based and suitable for MVP, not long-term scale.
- Real wallet ownership proof is still pending frontend Nimiq Pay integration.
- NIM transfer execution is still not implemented.

Next checkpoint:

- Define the Nimiq integration contract between frontend, wallet provider, and backend before UI work.

## Checkpoint 3 - Nimiq Integration Contract

Date: 2026-07-28

Phase: Backend integration contract.

Deliverables:

- Added `INTEGRATION.md`.
- Defined frontend wallet flow.
- Defined Nimiq Pay provider success state.
- Defined browser fallback state.
- Defined completion request and response payloads.
- Added claim-intent contract.
- Added `POST /api/claim-intents`.
- Added claim intent service.
- Added tests for successful claim intent creation.
- Added tests for mismatched wallet rejection.
- Updated README, architecture, and task tracker.

Verification:

- Command: `npm test`
- Result: pass
- Evidence: 10 tests passed, 0 failed.

Risks:

- Claim intent does not execute a real NIM transfer yet.
- Real provider behavior must still be verified inside Nimiq Pay.
- Frontend must avoid presenting browser fallback claims as real NIM payments.

Next checkpoint:

- Add backend ecosystem readiness before frontend: richer quests, quest pools, progress stats, and frontend-safe CORS.

## Checkpoint 4 - Backend Ecosystem Layer

Date: 2026-07-28

Phase: Backend build.

Deliverables:

- Expanded quest catalog from 3 to 7 quests.
- Added ecosystem metadata to each quest:
  - track
  - audience
  - difficulty
  - ecosystem use case
- Added sponsor-ready quest pools:
  - `starter-onboarding`
  - `ecosystem-growth`
- Added `GET /api/pools`.
- Added `GET /api/pools/:id`.
- Added `GET /api/progress`.
- Added public progress stats without exposing wallet addresses.
- Added store value listing for aggregate stats.
- Added CORS `OPTIONS` preflight handling for frontend calls.
- Extended backend tests for pools and progress.

Verification:

- Command: `npm test`
- Result: pass
- Evidence: 12 tests passed, 0 failed.

Risks:

- Quest pools are demo-ready metadata, not funded pools yet.
- Public progress is aggregate-only and suitable for judging/demo, not analytics-grade reporting.
- Real Nimiq Pay provider behavior remains the next proof point.

Next checkpoint:

- Harden API route coverage before frontend work.

## Checkpoint 5 - Backend API Hardening

Date: 2026-07-28

Phase: Backend QA.

Deliverables:

- Added `apps/api/test/server.test.js`.
- Added route-level test for `GET /health`.
- Added route-level test for `GET /api/quests`.
- Added route-level test confirming answer keys stay hidden over HTTP.
- Added route-level test for `GET /api/pools`.
- Added route-level test for `GET /api/progress`.
- Added route-level test for CORS `OPTIONS` preflight.

Verification:

- Command: `npm test`
- Result: pass
- Evidence: 17 tests passed, 0 failed.

Risks:

- Route tests still do not prove Nimiq Pay provider behavior.
- Real frontend runtime remains the next critical integration point.

Next checkpoint:

- Start frontend MVP with Nimiq Pay provider detection, browser fallback, quest flow, and backend integration.

## Checkpoint 6 - Backend Truth and Wallet Proof

Date: 2026-07-28

Phase: Backend security and product truth.

Deliverables:

- Replaced seven uneven quests with three sourced onboarding quests: `meet-nimiq`, `pay-with-nim`, and `prove-wallet-control`.
- Removed demo pool, public progress, and claim-intent routes.
- Removed automatic `1 NIM` promises and EVM address support.
- Added five-minute wallet-bound signing challenges with random nonces.
- Added official `@nimiq/core` signature verification.
- Derived the signer address from the public key and matched it to the challenge wallet.
- Added nonce expiry and single-use replay protection.
- Persisted only signature-verified completions.
- Added question-level feedback for failed quizzes.
- Updated PRD, architecture, integration contract, task tracker, and README.

Verification:

- Command: `npm test`
- Result: pass.
- Evidence: 17 tests passed, 0 failed.
- Coverage includes real Nimiq keys and signatures, wrong-wallet rejection, changed-message rejection, expiry, replay protection, duplicate completion handling, and the full HTTP flow.

Truth status:

- Backend wallet proof is cryptographically valid.
- Nimiq Pay runtime integration is not yet proven.
- Rewards remain unavailable until a funded payout rail exists.
- No pool or ecosystem analytics are exposed as live product data.

Next checkpoint:

- Prove SDK initialization, account access, challenge signing, and completion inside Nimiq Pay.
- Build frontend one screen at a time, sending mobile and desktop screenshots for approval before moving on.
