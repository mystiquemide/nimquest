# NimQuest Tasks

## Milestone 0 - Foundation

Status: Done

- [x] Verify private GitHub repo access.
- [x] Establish `MEMORY.md`.
- [x] Lock backend-first workflow.
- [x] Confirm Master Forge operating rules.

## Checkpoint 1 - Backend API Scaffold

Status: Done

- [x] Add Node package scripts.
- [x] Add quest catalog.
- [x] Hide answer keys from public quest responses.
- [x] Add quiz grading.
- [x] Add wallet completion proof.
- [x] Add duplicate completion guard.
- [x] Add tests.
- [x] Push through GitHub plugin.

## Checkpoint 2 - Backend Validation and Persistence

Status: Done

- [x] Add durable completion store.
- [x] Add wallet-address validation.
- [x] Add device identifier validation.
- [x] Extend tests.
- [x] Update `MEMORY.md`.
- [x] Push through GitHub plugin.

## Checkpoint 3 - Nimiq Integration Contract

Status: Done

- [x] Define frontend-to-backend wallet proof payload.
- [x] Define Nimiq Pay provider success and fallback states.
- [x] Add claim-preparation endpoint if needed.
- [x] Add tests.
- [x] Update `MEMORY.md`.
- [x] Push through GitHub plugin.

## Checkpoint 4 - Backend Ecosystem Layer

Status: Done

- [x] Expand quest catalog beyond the first three onboarding quests.
- [x] Add ecosystem metadata for tracks, audiences, difficulty, and use cases.
- [x] Add sponsor-ready quest pool contract.
- [x] Add public progress stats without exposing wallet addresses.
- [x] Add CORS preflight handling.
- [x] Extend tests.
- [x] Update `MEMORY.md`.
- [x] Push through GitHub plugin.

## Checkpoint 5 - Backend API Hardening

Status: Done

- [x] Add HTTP server route tests.
- [x] Verify health route.
- [x] Verify public quest route hides answer keys.
- [x] Verify quest pool route.
- [x] Verify public progress route.
- [x] Verify CORS preflight route.
- [x] Update `MEMORY.md`.
- [x] Push through GitHub plugin.

## Checkpoint 6 - Backend Truth and Wallet Proof

Status: Done

- [x] Replace filler content with three sourced quests.
- [x] Remove demo pools, unverified progress, and claim-intent routes.
- [x] Remove automatic reward promises and EVM support.
- [x] Add one-time signing challenges.
- [x] Verify Nimiq signatures and signer addresses with `@nimiq/core`.
- [x] Add nonce expiry and replay protection.
- [x] Persist verified completion proof.
- [x] Add service and HTTP integration tests.
- [x] Update project control docs.
- [x] Push through GitHub plugin.

## Checkpoint 7 - Nimiq Pay Runtime Proof

Status: Done

- [x] Initialize the Mini Apps SDK in the Wallet Proof screen.
- [x] Check consensus and block height.
- [x] Request account access and sign a backend challenge.
- [x] Serve the production frontend and API from one origin.
- [x] Verify production deep links and absolute asset paths.
- [x] Pass an injected-provider browser flow with a real Nimiq key and signature.
- [x] Verify one real completion inside Nimiq Pay.
- [x] Implement rejection, timeout, and browser fallback states.
- [x] Stop and send each screen screenshot for approval.

## Checkpoint 7B - Cloudflare Worker Runtime

Status: Done

- [x] Add a Cloudflare Worker API entrypoint.
- [x] Configure Workers Static Assets with SPA deep-link routing.
- [x] Add D1 migrations for challenges and verified completions.
- [x] Make challenge consumption and proof insertion atomic.
- [x] Replace incompatible Nimiq WebAssembly in Workers with Web Crypto Ed25519 verification.
- [x] Cross-test Worker address derivation against 25 `@nimiq/core` key pairs.
- [x] Pass 24 Node tests.
- [x] Pass Wrangler dry-run bundling.
- [x] Pass a full signed completion in local `workerd`.
- [x] Push the verified source checkpoint to GitHub.
- [x] Create and migrate the production D1 database.
- [x] Deploy the Worker to public HTTPS.
- [x] Complete one native Nimiq Pay phone test.

## Checkpoint 8 - Screen-by-Screen Frontend

Status: Done

- [x] Build and approve the landing page.
- [x] Build and approve the Quest Trail screen.
- [x] Build and approve the Quest Session screen.
- [x] Build and approve the Wallet Proof screen.
- [x] Build and approve the My Journey screen.

## Checkpoint 8A - Connected Flow Polish

Status: Done locally, not pushed

- [x] Connect landing actions to real product routes.
- [x] Add direct quest starts from landing previews.
- [x] Preserve unfinished quiz answers within the browser session.
- [x] Clear stale drafts after proof handoff and verification.
- [x] Correct out-of-order next-quest selection.
- [x] Remove orphaned preview code and consumer-facing documentation exits.
- [x] Pass production build.
- [x] Pass 17 backend tests.
- [x] Pass full desktop and mobile browser-flow QA.
- [x] Add `PAGE_PLAN.md`.

## Checkpoint 8B - Pre-Wallet Quiz Grading

Status: Done locally, not pushed

- [x] Add `POST /api/grade`.
- [x] Validate every submitted answer without exposing answer indexes.
- [x] Show question-level correction guidance before wallet access.
- [x] Request Nimiq Pay only after the quiz passes.
- [x] Keep completion-time server grading as a second trust check.
- [x] Pass production build and 20 backend tests.
- [x] Pass desktop and mobile correction-flow browser QA.
- [x] Send correction-state screenshots for approval.

## Checkpoint 9 - Submission Package

Status: Pending

- [ ] Polish README.
- [ ] Add screenshots.
- [ ] Draft 250-word submission copy.
- [ ] Draft demo script.
- [ ] Run final QA.
- [ ] Update `MEMORY.md`.
- [ ] Push through GitHub plugin.

## Checkpoint 8C - Post-Proof Product Layer

Status: Done locally, not pushed

- [x] Expand the catalog to 20 sourced quests across seven paths.
- [x] Keep the landing page curated to six featured quests.
- [x] Add path filters and progress-based next-quest recommendations.
- [x] Add eight badges backed only by verified completion records.
- [x] Add backend-backed Journey recovery after Nimiq Pay account approval.
- [x] Add durable `/completions/:proofKey` receipts and safe sharing.
- [x] Add proof-linked completion feedback with D1 persistence.
- [x] Add proper 404 and offline recovery states.
- [x] Replace the old mark with a reusable vector NimQuest identity.
- [x] Pass 24 Node tests, production build, Worker dry run, migrations, and full Worker integration.
