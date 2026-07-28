# NimQuest Nimiq Pay Integration Contract

## Verified Completion Flow

1. Initialize `@nimiq/mini-app-sdk`.
2. Check consensus and read the current block height.
3. Request an account with `listAccounts()`.
4. Request a one-time challenge from NimQuest.
5. Sign the exact challenge with `sign()`.
6. Submit answers, challenge ID, public key, and signature.
7. Backend derives the signer address and verifies the signature.
8. Backend consumes the nonce and persists verified completion.

## Challenge

```txt
POST /api/completion-challenges
```

```json
{
  "questId": "meet-nimiq",
  "walletAddress": "NQ...",
  "deviceId": "optional 64-character hex value"
}
```

The challenge expires after five minutes and can be used once.

## Completion

```txt
POST /api/complete
```

```json
{
  "questId": "meet-nimiq",
  "answers": [0, 0, 0],
  "walletAddress": "NQ...",
  "challengeId": "server-issued UUID",
  "publicKey": "64-character hex public key",
  "signature": "128-character hex signature"
}
```

## Truth Rules

- Browser fallback may preview lessons and quizzes but cannot create verified proof.
- Message signing does not transfer NIM.
- Rewards cannot appear funded or paid without a real payout transaction.
- Nimiq Pay approval is required for account access and signing.
- Private keys, payout keys, and API secrets never enter client code or source control.

## Runtime Acceptance

One real user must complete `meet-nimiq` inside Nimiq Pay, approve the challenge signature, and receive a backend proof with `status: "verified"`.
