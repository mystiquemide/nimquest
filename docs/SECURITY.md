# NimQuest Security

## Verification Controls

- Server-side grading runs before and during completion.
- Challenges bind quest, wallet, nonce, issue time, and expiry.
- Challenges expire after five minutes.
- Each challenge can be consumed once.
- The Worker derives the Nimiq address from the submitted public key.
- The signature must match Nimiq’s signed-message format.
- D1 enforces one completion per quest and wallet.

## Privacy Controls

- Device identifiers are not requested.
- Public receipt IDs are random and opaque.
- Public wallet labels show only the address prefix.
- Public responses exclude public keys, signatures, answers, and feedback tokens.
- Migration `0003` replaces legacy device values with a removal marker.

## Feedback Integrity

The completion response returns a random feedback token. D1 stores only its SHA-256 hash. A feedback write must include the matching token. Invalid tokens return `403`.

## Abuse Controls

The Worker applies route-specific request limits and a five-active-challenge cap per wallet. Browser write routes accept same-origin requests and local development origins only. Rate keys use short-lived SHA-256 source digests.

## Secrets

No private keys, recovery data, payout keys, or API secrets belong in the repository or browser bundle.

## Release Checks

```bash
npm test
npm audit --audit-level=high
npm run build:web
npm run test:browser
npm run worker:check
npm run test:worker-integration
```
