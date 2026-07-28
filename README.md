# NimQuest

NimQuest is a backend-first Nimiq Pay Mini App project for 60-second onboarding quests.

The goal is simple: help a new Nimiq user learn one concept, prove completion with wallet context, and prepare a tiny NIM reward or badge claim.

## Current Scope

- Backend API for quests.
- Seven onboarding and ecosystem quests.
- Ecosystem metadata for tracks, audiences, and use cases.
- Sponsor-ready quest pools.
- Public progress stats.
- Quiz validation without exposing answer keys.
- Wallet-address completion proof.
- Duplicate completion guard per quest and wallet.
- Durable JSON completion store.
- Wallet and device identifier validation.
- Frontend comes last.

## Backend API

```txt
GET  /health
GET  /api/quests
GET  /api/quests/:id
GET  /api/pools
GET  /api/pools/:id
GET  /api/progress
POST /api/complete
POST /api/claim-intents
```

## Run

```bash
npm test
npm start
```

## Competition Fit

NimQuest is built around Nimiq onboarding, NIM-native completion, and a mobile-first Mini App flow.

## Project Docs

- `PRD.md`
- `ARCHITECTURE.md`
- `INTEGRATION.md`
- `TASKS.md`
- `MEMORY.md`

## License

MIT
