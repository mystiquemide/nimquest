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
