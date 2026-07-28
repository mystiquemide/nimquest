# NimQuest

Learn Nimiq by doing, then prove you learned it with your own wallet.

[![CI](https://github.com/mystiquemide/nimquest/actions/workflows/ci.yml/badge.svg)](https://github.com/mystiquemide/nimquest/actions/workflows/ci.yml)

[Open the live Mini App](https://nimquest.artistic-chip.workers.dev) · [In-app docs](https://nimquest.artistic-chip.workers.dev/docs) · [Leaderboard](https://nimquest.artistic-chip.workers.dev/leaderboard)

![NimQuest landing page](docs/assets/hero.png)

## The story

Every time I onboard to a new chain, the "learning" is read-only. I skim a docs page, nod, and close the tab with nothing to show I understood any of it. Quizzes that live in the browser are worse, the answers ship in the page and you can cheat in five seconds.

So I built the opposite. You pass a quiz that is graded on the server, then you sign a one-time message with the wallet you actually control. The receipt is the proof. The real receipt so far: one Meet Nimiq completion signed inside Nimiq Pay on an iPhone, stored in D1, visible on the live leaderboard. No NIM moved.

## One-liner

I did not build a token faucet, an airdrop farm, or a browser quiz you can cheat by reading the source. I built a learn-and-prove Mini App where the only thing that counts as "done" is a signature from your wallet, and correct answers never leave the server.

## How it works

You start a quest freely and read a short sourced lesson. The quiz is graded server-side, so the answer key is never in the browser bundle. Only after you pass do you reach the wallet step. You sign a one-time, wallet-bound, expiring message in Nimiq Pay, the Worker verifies the signature and derives the signer address, and the completion is stored in Cloudflare D1. Signing proves control. It does not send NIM.

| Operation | Result |
|---|---|
| Start a quest and read the lesson | Immediate |
| Submit quiz answers | Graded server-side, answer key stays hidden |
| Reach the wallet step | Only after the quiz passes |
| Request a signing challenge | Wallet-bound, five-minute expiry, single-use |
| Sign the completion message | Signature verified, address derived, no NIM sent |
| Duplicate the same quest | Returns the existing proof, no double record |
| Verified completion | Joins the mandatory masked-wallet leaderboard |

## Product screens

Quest trail with learning paths and the recommended starter quest:

![Quest trail](docs/assets/quest-trail.png)

Verified wallet leaderboard, masked labels, ranked by verified quest count:

![Leaderboard](docs/assets/leaderboard.png)

Wallet proof step, no NIM moves and the quiz gate is enforced before signing:

![Wallet proof step](docs/assets/wallet-proof.png)

Mobile layout:

![Mobile home](docs/assets/mobile-home.png)

## Try it in 2 minutes

Native path (full proof):

1. Open [nimquest.artistic-chip.workers.dev](https://nimquest.artistic-chip.workers.dev) inside Nimiq Pay.
2. Start Meet Nimiq, read the lesson, answer the three questions.
3. Select Verify with Nimiq Pay, approve account access, sign the one-time message.
4. Open My Journey and Leaderboard. The quest shows verified, the count goes up, your masked wallet joins the board. No NIM moves.

No-wallet path (verify the server logic without signing):

```bash
# Correct answers pass and unlock the wallet step
curl -s -X POST https://nimquest.artistic-chip.workers.dev/api/grade \
  -H "content-type: application/json" \
  -d '{"questId":"meet-nimiq","answers":[0,0,0]}'

# Read the live verified leaderboard
curl -s https://nimquest.artistic-chip.workers.dev/api/leaderboard
```

The grade response returns per-question correctness and explanations but never the correct index. The quest catalog at `/api/quests` ships lessons and options with no answer keys.

## Ways I tried to break it

Every row maps to a real automated test in the repo.

| Attempt | Outcome | Proof |
|---|---|---|
| Read answer keys from the browser bundle | Not present, catalog is split at build time | `quest-service.test.js`: grades answers before wallet proof without exposing answer indexes |
| Replay an already-used signing challenge | Rejected | `quest-service.test.js`: blocks replay of an already consumed challenge |
| Use an expired challenge | Rejected | `quest-service.test.js`: blocks expired challenges |
| Sign a different message than the challenge | Rejected | `wallet-proof-worker.test.js`: rejects an altered message |
| Sign with a different wallet | Rejected | `quest-service.test.js`: rejects a signature created by a different wallet |
| Skip the quiz and jump to the wallet step | Blocked, grading runs before wallet access | `server.test.js`: grades a quiz before wallet access is requested |
| Complete the same quest twice | Returns the existing proof, no duplicate | `quest-service.test.js`: returns the existing verified proof for a duplicate quest completion |
| Write from a cross-origin browser | Rejected | `server.test.js`: rejects cross-origin browser writes |
| Submit an EVM address instead of a Nimiq one | Rejected | `quest-service.test.js`: accepts generated Nimiq addresses and rejects EVM addresses |

Run them all: `npm test` (25 tests).

## Live proof

- App: https://nimquest.artistic-chip.workers.dev (Cloudflare Workers with Static Assets)
- Health: https://nimquest.artistic-chip.workers.dev/health
- Public quests API: https://nimquest.artistic-chip.workers.dev/api/quests (20 quests, no answer keys)
- Live leaderboard API: https://nimquest.artistic-chip.workers.dev/api/leaderboard
- Storage: Cloudflare D1, three applied migrations in `migrations/`
- Deploys automatically from `main`, current commit `7866b5f`
- No smart contract. Completions are wallet-signed records in D1, not on-chain writes.

Do not trust the screenshots. The leaderboard is not seeded, verify the real signed completions yourself:

```bash
curl -s https://nimquest.artistic-chip.workers.dev/api/leaderboard
```

## Real usage

The leaderboard is live D1 data, not seeded mock rows. At the time of writing it shows two distinct masked wallets, each with two verified quests, the earliest proof timestamped 2026-07-28. The first Meet Nimiq proof was signed natively inside Nimiq Pay on an iPhone. Query it yourself with the leaderboard curl above.

## Benchmarks

How NimQuest compares to the obvious alternatives, capability by capability.

| Capability | NimQuest | Docs or blog tutorial | Browser quiz app | Airdrop / faucet quest farm | On-chain proof-of-learning |
|---|:---:|:---:|:---:|:---:|:---:|
| Records that you actually learned | Yes | No | Partial | No | Yes |
| Answers hidden from the browser | Yes | n/a | No | n/a | Varies |
| Proves wallet control | Yes | No | No | Partial | Yes |
| No gas or NIM spent to complete | Yes | Yes | Yes | No | No |
| Resistant to payout sybil farming | Yes | Yes | Yes | No | Varies |
| Runs natively in Nimiq Pay | Yes | No | No | Varies | Varies |
| Verifiable public receipt | Yes | No | No | Partial | Yes |

The pattern: a docs page teaches but proves nothing, a browser quiz proves something you can cheat, an airdrop farm pays for clicks and invites sybils, and an on-chain contract proves control but charges gas for every completion. NimQuest keeps the proof and drops the gas, the cheating surface, and the payout farm.

## What's real

The shipped path is real: the quiz grading, the Nimiq signature verification, the address derivation, the D1 persistence, the leaderboard, and the abuse controls all run in this repository. There are no mocked values in the completion flow. Verification owns the pass/fail decision through deterministic code, there is no model deciding truth. What is pending: funded rewards and wider on-device signing coverage.

Boundaries, stated plainly: the code is unaudited, completions are wallet-signed records in Cloudflare D1 rather than on-chain writes, no NIM moves during completion, and the public leaderboard is mandatory after verification with no opt-out.

Verify it:

```bash
npm ci
npm run build:web
npm test            # 25 Node, API, and cryptography tests
npm audit           # 0 vulnerabilities
```

CI runs the same tests plus a Playwright browser smoke suite and a Worker dry run on every push (`.github/workflows/ci.yml`).

## Run locally

```bash
git clone https://github.com/mystiquemide/nimquest
cd nimquest
npm ci
npm run build:web && npm start   # opens http://localhost:8787
```

Run the Worker with local D1:

```bash
npx wrangler d1 migrations apply nimquest --local && npm run dev:worker
```

## API

```text
GET  /health
GET  /api/quests
GET  /api/quests/:id
GET  /api/leaderboard
GET  /api/completions?wallet=:address
GET  /api/completions/:receiptId
POST /api/grade
POST /api/completion-challenges
POST /api/complete
POST /api/feedback
```

Write routes reject unsupported browser origins. D1 rate counters limit grading, challenge, completion, and feedback requests, and each wallet can hold at most five active signing challenges.

## More

- [In-app documentation](https://nimquest.artistic-chip.workers.dev/docs)
- [Privacy Notice](https://nimquest.artistic-chip.workers.dev/privacy) · [Terms of Use](https://nimquest.artistic-chip.workers.dev/terms)
- [Architecture](ARCHITECTURE.md) · [Nimiq Pay integration](INTEGRATION.md) · [Product requirements](PRD.md) · [Security](docs/SECURITY.md) · [Contributing](CONTRIBUTING.md)

## License

MIT
