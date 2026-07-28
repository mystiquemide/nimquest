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

Status: Next

- [ ] Initialize the Mini Apps SDK.
- [ ] Check consensus and block height.
- [ ] Request account access and sign a backend challenge.
- [ ] Verify one real completion inside Nimiq Pay.
- [ ] Verify rejection, timeout, and browser fallback.
- [ ] Stop and send the first screen screenshots for approval.

## Checkpoint 8 - Screen-by-Screen Frontend

Status: Pending

- [ ] Build Entry screen and request approval.
- [ ] Build Quest Trail screen and request approval.
- [ ] Build Quest Session screen and request approval.
- [ ] Build Wallet Proof screen and request approval.
- [ ] Build My Journey screen and request approval.

## Checkpoint 9 - Submission Package

Status: Pending

- [ ] Polish README.
- [ ] Add screenshots.
- [ ] Draft 250-word submission copy.
- [ ] Draft demo script.
- [ ] Run final QA.
- [ ] Update `MEMORY.md`.
- [ ] Push through GitHub plugin.
