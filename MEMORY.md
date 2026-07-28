# NimQuest Project Memory

Last updated: 2026-07-28

This file records the product decisions, implementation milestones, verification evidence, deployment state, and remaining work for NimQuest.

## Current State

NimQuest is a live Nimiq Mini App that teaches Nimiq through short quests. A learner reads a sourced lesson, passes a server-graded quiz, and signs a one-time completion message in Nimiq Pay. The backend verifies the signature and stores a wallet-backed completion in Cloudflare D1. Completing a quest does not transfer NIM.

Current production:

- Live app: `https://nimquest.artistic-chip.workers.dev`
- Repository: `mystiquemide/nimquest`
- Production branch: `main`
- Current release commit before this memory update: `196a0a331372a9eff3fd8f3870ec6430621a4ac6`
- Hosting: Cloudflare Workers with Static Assets
- Database: Cloudflare D1
- Deployment: automatic Cloudflare build from pushes to `main`
- Repository visibility: private as verified by GitHub on 2026-07-28. This remains a competition eligibility blocker.
- License: MIT

Live product:

- 20 sourced quests
- Seven learning paths
- Nimiq Pay account access and message signing
- Server-side quiz grading
- Cryptographic Nimiq signature verification
- D1-backed verified completions
- Eight proof-backed badges
- Journey recovery
- Shareable proof receipts
- Mandatory wallet leaderboard
- Completion feedback
- Privacy Notice and Terms of Use
- Five in-app documentation routes
- Offline, retry, empty, and 404 recovery states
- Rewards marked as **Coming soon**

Latest verification:

- 25 Node, API, and cryptography tests passed
- 56 rendered-route checks passed
- Routes tested at 320, 375, 390, and 430 CSS-pixel widths
- Production frontend build passed
- Cloudflare Worker dry run passed
- Full Worker and D1 integration passed
- Zero dependency vulnerabilities
- Native Nimiq Pay completion succeeded on iPhone
- Production routes and APIs were checked after deployment
- Canonical first-quest routing and route-specific page titles passed 56 rendered checks
- A second production quiz reached the Nimiq Pay proof boundary, but five new native wallet signatures remain a real-device check

## Product Decisions

- Every verified completion joins the public leaderboard.
- Public leaderboard participation is mandatory.
- Users cannot opt out of public ranking.
- Public responses mask wallet addresses.
- Public receipts use opaque identifiers.
- NimQuest does not collect a Nimiq Pay device identifier.
- Wallet plus quest is the duplicate-completion boundary.
- Correct quiz answers stay server-side.
- Completion records are stored in D1, not written to the Nimiq blockchain.
- Product copy must say wallet-verified or signature-verified, not onchain.
- Rewards are not active. The UI says **Coming soon**.
- No NIM moves during the current completion flow.
- Documentation belongs inside the app as public routes.
- Judge notes, demo scripts, submission copy, audit reports, and temporary screenshots remain outside the public product release until requested.
- `MEMORY.md` is public because the project owner explicitly requested it be updated and pushed.

## Operating Rules

- Keep claims aligned with the deployed code.
- Update this file after major checkpoints.
- Run relevant tests before release.
- Apply required D1 migrations before deploying code that depends on them.
- Do not expose private keys, recovery data, answer keys, feedback tokens, full public wallet addresses, or raw abuse-control identifiers.
- Do not deploy, submit, delete, or perform irreversible external actions without explicit approval.
- Use the connected GitHub workflow for repository changes.

## Milestone 0 - Project Start

Date: 2026-07-28

The project began as a Nimiq Mini Apps Competition entry named NimQuest.

Initial direction:

- Build a learn-by-doing Nimiq onboarding product.
- Use short quests that can be completed in about one minute.
- Start with backend behavior and trust boundaries.
- Prove wallet ownership before presenting completion as verified.
- Keep reward readiness separate from unfunded reward promises.

Initial risks:

- Tight competition timeline
- Unproven Nimiq Pay runtime behavior
- No funded payout rail
- No production persistence

## Milestone 1 - Backend API Scaffold

The first backend included:

- Three onboarding quests
- Public quest serialization without answer keys
- Quiz grading
- Wallet-address completion records
- Duplicate completion checks
- Health endpoint
- Node test suite

Verification:

- 5 tests passed

Known limit:

- Completions were stored in memory and reset with the process.

## Milestone 2 - Validation and Persistence

Added:

- `PRD.md`
- `TASKS.md`
- `ARCHITECTURE.md`
- Durable JSON completion storage
- Atomic local writes
- Wallet-address validation
- Early device-identifier validation
- Persistence tests

Verification:

- 8 tests passed

Known limit:

- File storage was suitable for local development only.

## Milestone 3 - Nimiq Integration Contract

Added:

- `INTEGRATION.md`
- Frontend wallet-flow contract
- Nimiq Pay success and browser-fallback states
- Completion request and response payloads
- Early claim-intent API
- Wallet-match validation

Verification:

- 10 tests passed

Correction made later:

- Claim intent and unfunded reward behavior were removed from the live core flow.

## Milestone 4 - Early Ecosystem Layer

The backend briefly expanded to:

- Seven quests
- Quest tracks and difficulty metadata
- Sponsor-ready quest pools
- Public aggregate progress
- Frontend-safe CORS behavior

Verification:

- 12 tests passed

Correction made later:

- Demo pools and unsupported ecosystem analytics were removed so the product only exposed real behavior.

## Milestone 5 - API Hardening

Added route-level coverage for:

- `GET /health`
- `GET /api/quests`
- Hidden answer keys
- Early pool and progress routes
- CORS preflight behavior

Verification:

- 17 tests passed

## Milestone 6 - Backend Truth and Wallet Proof

The product was simplified around a defensible proof flow.

Added:

- Three sourced quests: `meet-nimiq`, `pay-with-nim`, and `prove-wallet-control`
- Five-minute wallet-bound signing challenges
- Random nonces
- Official Nimiq signature verification
- Signer-address derivation from the public key
- Wallet matching
- Nonce expiry
- Single-use replay protection
- Signature-verified completion persistence
- Question-level quiz feedback

Removed:

- Demo pools
- Public progress claims
- Claim-intent routes
- Automatic `1 NIM` promises
- EVM address support

Result:

- The backend proof became cryptographically valid.
- Native Nimiq Pay behavior still needed a public runtime test.

## Milestone 7 - Frontend and Host-Ready Flow

Connected the approved product screens:

- Landing page
- Quest Trail
- Quest Session
- Wallet Proof
- My Journey

Added:

- Real route navigation
- Direct quest starts
- Session-based draft recovery
- Draft cleanup after verification
- Correct next-quest selection
- Known-quest filtering in Journey
- Production-safe asset paths
- SPA deep-link fallback
- Static frontend hosting through the Node API
- JSON 404 behavior for unknown API routes

The built Wallet Proof route was tested with an injected Nimiq-compatible provider and generated Nimiq key pair.

Verification:

- Frontend build passed
- 20 tests passed
- Injected wallet flow passed
- Account access, consensus, block height, challenge creation, signing, signature verification, persistence, and Journey handoff passed

## Milestone 8 - Pre-Wallet Grading

Added:

- `POST /api/grade`
- Strict answer-shape validation
- Server-side quiz grading before wallet access
- Correction state for failed answers
- Question explanations
- Direct answer-edit actions
- A second grading check inside completion verification

Result:

- Users only reached Nimiq Pay after passing the quiz.
- Correct answer indexes remained outside the browser bundle.

## Milestone 9 - Cloudflare Worker and D1

Moved production behavior to Cloudflare.

Added:

- `worker/index.js`
- Workers Static Assets routing
- SPA fallback
- D1 migrations for challenges and completions
- Atomic D1 completion insertion
- Atomic challenge consumption
- Web Crypto Ed25519 verification
- Pure Nimiq address derivation
- Wrangler configuration and deployment scripts

Cross-check:

- Worker address derivation matched 25 key pairs generated with `@nimiq/core`.

Verification:

- 23 tests passed
- Frontend build passed
- Worker dry run passed
- Worker startup check passed
- Local D1 migration passed
- Full `workerd` flow passed

## Milestone 10 - Production Deployment and Native Wallet Proof

Production setup:

- Created the Cloudflare D1 database
- Added the D1 binding to Wrangler configuration
- Connected GitHub `main` to Cloudflare automatic builds
- Set the build command to `npm run build:web`
- Set the deploy command to `npx wrangler deploy`

Deployment issue fixed:

- Cloudflare initially failed because `dist` did not exist.
- Adding the frontend build command created `dist` before Wrangler deployment.

Wallet issue fixed:

- Nimiq Pay signing initially failed backend verification.
- Verification was corrected to use Nimiq's signed-message prefix and SHA-256 message format.

Native proof:

- Completed **Meet Nimiq** inside Nimiq Pay on iPhone.
- Nimiq Pay approved account access.
- The user signed the completion message.
- The backend verified the signature.
- D1 stored the completion.
- Journey showed `1/3`.
- The receipt showed the wallet and block height.
- No NIM was charged.

Key deployment commits:

- `70174c0cda76d86a262f35628a48aa954fb1389d` added the production D1 database binding.
- Cloudflare automatic deployment succeeded after the corrected build configuration.

## Milestone 11 - Twenty-Quest Product Layer

Expanded NimQuest from three quests to 20 quests across:

- NIM basics
- Payments
- Wallet safety
- Network
- Staking
- Mini Apps
- Ecosystem

Added:

- Six curated landing-page quests
- Full Quest Trail with grouped paths
- Path filters
- Eight verified badge milestones
- Next incomplete quest recommendations
- Cross-device Journey recovery
- Durable proof receipts
- Native share and copy actions
- Post-completion feedback
- Offline recovery banner
- Proper 404 page
- New reusable SVG NimQuest logo

Security correction:

- The public quest catalog was separated from the backend catalog at build time.
- Browser bundles contain lessons and options but no correct answer indexes.

Verification:

- 24 tests passed
- Production build passed
- Worker dry run passed
- D1 persistence passed
- Journey recovery passed
- Receipt lookup passed
- Feedback persistence passed locally
- Replay protection passed
- Browser bundle answer-key scan passed

Release:

- Commit `d6abc7258d8a034ead26a4de8db765510bd90f37`
- Cloudflare deployed the release automatically.
- Production returned all 20 quests.
- The `completion_feedback` table was added to production D1.

## Milestone 12 - Verified Wallet Leaderboard

Added:

- `GET /api/leaderboard`
- Responsive `/leaderboard` page
- Ranking by verified quest count
- Earliest first proof as the primary tie-breaker
- Wallet address as the final deterministic tie-breaker
- Top-100 result limit
- Loading, empty, offline, and retry states
- Leaderboard links across the app

Leaderboard rules:

- Only D1 records with verified completion status count.
- Wallet addresses categorize users.
- Participation is mandatory after verification.

Release:

- Commit `ec9063eb46dac2fda2730bb5e33b9717e916c136`
- Production initially showed one wallet with one verified quest.

## Milestone 13 - Four-Part Audit

Ran:

- Website UX audit
- UX writing and microcopy audit
- Elite hackathon audit
- Repository audit

Initial scores:

- Website UX: 6.8/10
- Hackathon estimate: 54/105
- Potential after remediation: 85-92/105

Confirmed blockers:

- `/quests` and `/journey` rendered blank from a JavaScript initialization error.
- The repository was private while competition rules required a public MIT repository.
- Data collection lacked clear disclosure.
- “Earned onchain” overstated D1-backed completion records.
- Public full-wallet exposure needed correction.
- Demo and submission materials were unfinished.

Strengths confirmed:

- Strong visual design
- Real Nimiq Pay signature flow
- 20 sourced quests
- D1 persistence
- Clean dependency audit

## Milestone 14 - Audit Remediation

Product choices confirmed:

- Leaderboard participation is mandatory.
- Public ranking has no opt-out.
- Public wallets must be masked.
- Device identifiers are unnecessary and must be removed.
- Rewards remain visible as **Coming soon**.

Code and UX fixes:

- Fixed blank `/quests` and `/journey` routes.
- Delayed route dispatch until badge and page definitions were initialized.
- Removed device-ID collection.
- Added Privacy Notice and Terms of Use pages.
- Added pre-signature disclosure for stored data and public ranking.
- Removed unsupported onchain claims.
- Added opaque public receipt IDs.
- Masked wallet addresses in public API responses.
- Protected feedback writes with a completion-only token hash.
- Added same-origin browser write checks.
- Added D1-backed route rate limits.
- Added a five-active-challenge cap per wallet.
- Added offline, retry, empty, and narrow-screen recovery fixes.
- Added GitHub Actions CI.
- Added rendered browser smoke tests.

Database migration `0003_privacy_and_abuse_controls.sql`:

- Added `public_id` to completions.
- Added `feedback_token_hash` to completions.
- Backfilled opaque public IDs.
- Replaced legacy completion and challenge device values with `removed`.
- Added a unique public-ID index.
- Added D1 request-limit storage and index.

Verification:

- 25 tests passed
- 36 initial route-and-width browser checks passed
- Production build passed
- Worker dry run passed
- All three migrations passed locally
- Full signature, D1, receipt, feedback, leaderboard, and replay integration passed

## Milestone 15 - In-App Documentation and Repository Polish

The documentation requirement was corrected from standalone submission files to real product documentation inside NimQuest.

Added these live routes:

- `/docs`
- `/docs/architecture`
- `/docs/integration`
- `/docs/security`
- `/docs/setup`

Repository work:

- Polished the public README.
- Linked README sections to the live app documentation.
- Added Privacy and Terms links.
- Added CI and contribution guidance.
- Made the GitHub repository public.
- Kept internal submission material out of the product release.

Files intentionally excluded from that release:

- Judge guide
- Demo script
- Submission copy
- Internal audit report
- Temporary screenshots
- Working uploads

Expanded verification:

- 25 tests passed
- 56 route-and-width browser checks passed
- All five documentation routes passed
- Desktop and mobile docs layouts passed
- No page errors or horizontal overflow
- Worker dry run passed
- Full Worker and D1 integration passed
- Zero dependency vulnerabilities

Release process:

- Verified release branch commit: `196a0a331372a9eff3fd8f3870ec6430621a4ac6`
- Production migration `0003` was applied first.
- `main` was fast-forwarded to the verified release.
- Cloudflare deployed automatically.

## Milestone 16 - Production Audit-Fix Verification

The final audit-remediation release was verified in production.

Confirmed live:

- `/quests` renders correctly.
- `/journey` renders correctly.
- `/leaderboard` works.
- Privacy Notice is live.
- Terms of Use is live.
- All five documentation routes are live.
- Wallet labels are masked.
- Existing verified wallet progress showed `2/20`.
- No production page errors were found during the final check.

Current production release:

- Commit `196a0a331372a9eff3fd8f3870ec6430621a4ac6`

## Milestone 17 - Re-Audit and Onboarding Consistency

A four-part re-audit was run against the current live app and GitHub repository.

Updated scores:

- Website UX: 8.7/10, up from 6.8/10
- Hackathon estimate: 68/105
- Potential after final submission work: 86-92/105

Confirmed fixed during the re-audit:

- Core Quest Trail and Journey routes
- Legal and documentation routes
- Masked public wallet labels
- Device-ID removal
- Unsupported onchain claims
- Mobile overflow and recovery states

Remaining issues from the re-audit:

- GitHub reported the repository as private.
- The homepage, Trail, and Journey needed one explicit starter quest.
- Repeated preview actions needed unique accessible names.
- Major routes needed unique document titles.
- Five additional native Nimiq Pay completions were still required for real-device evidence.

Implemented after the re-audit:

- Added STARTER_QUEST_ID with meet-nimiq as the canonical first quest.
- Pointed the announcement, header, hero, final CTA, Trail recommendation, and Journey recommendation to the same starter quest.
- Added unique accessible names to quest preview, start, close, review, and proof actions.
- Added route-specific document titles for Home, Quest Trail, quests, wallet proof, Journey, leaderboard, docs, legal pages, receipts, and 404.
- Added browser regression coverage for canonical starter links, unique preview labels, and route titles.

Verification:

- 25 Node, API, and cryptography tests passed.
- Production frontend build passed.
- Cloudflare Worker dry run passed.
- 56 rendered-route checks passed at 320, 375, 390, and 430 CSS-pixel widths.
- The production Pay with NIM quiz passed server grading and reached the wallet-proof screen.
- The cloud browser correctly received the fallback state because it does not provide the Nimiq Pay Mini App provider.
- No wallet signatures or leaderboard activity were fabricated.
- Five native completions remain pending inside Nimiq Pay on a real device.

Release commits:

- 84acdadcc911f01687fe0ce9f03bd6fde408c092 added the regression checks.
- eb6c0c8c335ace4b13d4bc9e9164bbc0756efdcd added the canonical onboarding and accessibility fixes.

## Database History

Production migrations completed:

1. Initial challenge and completion storage
2. Completion feedback
3. Privacy and abuse controls

Current D1 responsibilities:

- Signing challenges
- Verified completions
- Opaque receipt identifiers
- Feedback authorization hashes
- Completion feedback
- Leaderboard aggregation
- Request-rate counters

## Security and Privacy State

- Private keys remain inside Nimiq Pay.
- NimQuest receives approved public account data, public keys, and signatures.
- Signatures are checked against wallet-bound, expiring challenges.
- Challenges are single-use.
- Correct quiz answers remain server-side.
- Public wallets are masked.
- Public receipts use opaque IDs.
- Feedback requires a completion-only authorization token.
- Raw device identifiers are no longer collected.
- Legacy device values are marked as removed.
- Abuse-control keys use SHA-256 digests instead of raw IP addresses.
- Unsupported browser origins are rejected on write routes.
- Active signing challenges are capped.
- Route requests are rate-limited through D1.

## Current Limits

- Rewards are not funded or distributed.
- No NIM transfer is part of quest completion.
- Completions are stored in D1, not on the Nimiq blockchain.
- Public leaderboard participation is mandatory.
- The quest catalog is maintained in source code.
- There is no quest-authoring dashboard.
- A custom domain has not been recorded as connected.
- Final competition demo, judge material, and submission copy have not been requested for the public release.
- GitHub currently reports the repository as private, which blocks competition eligibility until changed.
- Five additional native Nimiq Pay completions have not yet been signed on a real device.

## Next Work

Recommended next order:

1. Make the GitHub repository public.
2. Open NimQuest inside Nimiq Pay on iPhone and complete five different quests with the same wallet.
3. Confirm Journey and leaderboard progress increase from the current verified count.
4. Prepare the competition submission package when requested.
5. Capture final production screenshots and record the demo video.
6. Write submission copy against the final deployed build.
7. Run the last rules, repository, UX, and end-to-end audit before submission.
8. Add funded rewards only after the payout design and source of NIM are confirmed.

## Commit Timeline

- `70174c0cda76d86a262f35628a48aa954fb1389d` - production D1 binding
- `d6abc7258d8a034ead26a4de8db765510bd90f37` - 20 quests, post-proof layer, and new logo
- `ec9063eb46dac2fda2730bb5e33b9717e916c136` - verified wallet leaderboard
- `196a0a331372a9eff3fd8f3870ec6430621a4ac6` - audit fixes, legal pages, in-app docs, privacy controls, CI, and production release
- `74ba7a3b293bf60946aa572d82cc77194be4a990` - complete public project memory
- `84acdadcc911f01687fe0ce9f03bd6fde408c092` - onboarding and accessibility regression checks
- `eb6c0c8c335ace4b13d4bc9e9164bbc0756efdcd` - canonical first quest, accessible labels, and route titles
