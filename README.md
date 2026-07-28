# NimQuest

NimQuest is Nimiq's learn-by-doing onboarding layer. Users complete short, sourced quests and sign a one-time Nimiq Pay challenge to create a cryptographically verified completion proof.

## Current Product

- Twenty sourced Nimiq quests across basics, payments, safety, network, staking, Mini Apps, and ecosystem topics.
- Server-side quiz grading with hidden answer keys.
- Five-minute, wallet-bound signing challenges.
- Nimiq Ed25519 signature verification in Node and Cloudflare Workers.
- Public-key-derived Nimiq address matching.
- Nonce expiry and replay protection.
- Cloudflare D1 persistence for challenges and verified completion records.
- Backend-backed Journey recovery by approved wallet address.
- Durable completion receipts and proof sharing.
- Proof-linked completion feedback.
- Wallet-address leaderboard ranked by verified quest count.
- Eight verified badge milestones.
- Honest unavailable reward state until a payout rail is funded.

## API

```txt
GET  /health
GET  /api/quests
GET  /api/quests/:id
GET  /api/leaderboard
GET  /api/completions?wallet=:address
GET  /api/completions/:proofKey
POST /api/completion-challenges
POST /api/complete
POST /api/feedback
```

## Run

```bash
npm install
npm test
npm run build:web
npm start
```

`npm start` serves the production frontend and API from one origin. Deep links such as `/proof/meet-nimiq` fall back to the built application while unknown `/api/*` routes remain JSON 404 responses.

For the Cloudflare Worker:

```bash
npm run build:web
npx wrangler d1 migrations apply nimquest --local
npm run dev:worker
```

`wrangler.jsonc` deploys the Vite build as Workers Static Assets, routes the API through `worker/index.js`, and binds the `nimquest` D1 database.

Current verification: 24 passing Node tests plus a full local Worker runtime flow covering all 20 quests, a real Nimiq signature, D1 persistence, Journey recovery, shared receipts, feedback, replay protection, pre-wallet grading, and SPA deep links.

## Project Docs

- `PRD.md`
- `ARCHITECTURE.md`
- `INTEGRATION.md`
- `TASKS.md`
- `MEMORY.md`

## License

MIT
