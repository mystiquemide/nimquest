# Nimiq Pay Integration

## Verified Completion Procedure

Prerequisite: the learner has passed the server-side quiz.

1. Initialize `@nimiq/mini-app-sdk`.
2. Confirm Nimiq consensus.
3. Read the current block height.
4. Request the selected account with `listAccounts()`.
5. Request a one-time challenge from NimQuest.
6. Show the exact message in Nimiq Pay.
7. Ask the learner to approve `sign()`.
8. Submit the quiz answers, challenge ID, public key, and signature.
9. Verify the signer address and signed-message format.
10. Consume the challenge and store the completion.

NimQuest does not request a device identifier.

## Grade Request

```http
POST /api/grade
Content-Type: application/json
```

```json
{
  "questId": "meet-nimiq",
  "answers": [0, 0, 0]
}
```

The response includes pass status, score, and correction guidance. It does not include answer indexes.

## Challenge Request

```http
POST /api/completion-challenges
Content-Type: application/json
```

```json
{
  "questId": "meet-nimiq",
  "walletAddress": "NQ..."
}
```

The challenge expires after five minutes and can be used once.

## Completion Request

```http
POST /api/complete
Content-Type: application/json
```

```json
{
  "questId": "meet-nimiq",
  "answers": [0, 0, 0],
  "walletAddress": "NQ...",
  "challengeId": "server-issued UUID",
  "publicKey": "64-character hexadecimal value",
  "signature": "128-character hexadecimal value"
}
```

The response contains:

- Verified completion record
- Opaque public receipt ID
- One-time feedback token

Store the feedback token only in the active browser flow. Do not put it in a receipt URL or public record.

## Feedback Request

```http
POST /api/feedback
Content-Type: application/json
```

```json
{
  "proofKey": "opaque receipt ID",
  "feedbackToken": "completion-only token",
  "rating": 3
}
```

The Worker hashes the submitted token and compares it with the stored hash. An invalid token returns `403`.

## Truth Rules

- Message signing does not transfer NIM.
- Private keys and recovery data stay inside Nimiq Pay.
- Every verified completion joins the mandatory public leaderboard.
- Public wallet values are masked.
- Rewards are coming soon. No current payout is promised.
- Browser lessons can load outside Nimiq Pay, but wallet proof requires the Nimiq Pay provider.

## Mini App Link

```text
nimiqpay://miniapp?url=https%3A%2F%2Fnimquest.artistic-chip.workers.dev
```
