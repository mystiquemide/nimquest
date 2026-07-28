# NimQuest

NimQuest is Nimiq's learn-by-doing onboarding layer. Users complete short, sourced quests and sign a one-time Nimiq Pay challenge to create a cryptographically verified completion proof.

## Current Backend

- Three sourced Nimiq onboarding quests.
- Server-side quiz grading with hidden answer keys.
- Five-minute, wallet-bound signing challenges.
- Official `@nimiq/core` signature verification.
- Public-key-derived Nimiq address matching.
- Nonce expiry and replay protection.
- Durable verified completion records.
- Honest unavailable reward state until a payout rail is funded.

## API

```txt
GET  /health
GET  /api/quests
GET  /api/quests/:id
POST /api/completion-challenges
POST /api/complete
```

## Run

```bash
npm install
npm test
npm start
```

Current verification: 17 passing tests, including real Nimiq signatures, address derivation, expiry, replay protection, duplicate handling, and HTTP integration.

## Project Docs

- `PRD.md`
- `ARCHITECTURE.md`
- `INTEGRATION.md`
- `TASKS.md`
- `MEMORY.md`

## License

MIT
