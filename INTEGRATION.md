# NimQuest Nimiq Integration Contract

## Goal

Define the contract between the Mini App frontend, Nimiq Pay provider, and NimQuest backend before frontend implementation.

## Frontend Wallet Flow

1. Detect Nimiq Pay provider.
2. Request wallet account access.
3. Request device identifier when available.
4. Submit quest answers plus wallet context to the backend.
5. Receive completion proof.
6. Request claim intent from backend.
7. Ask Nimiq Pay to execute the visible wallet action.
8. Show proof, claim status, and next quest.

## Provider Success State

The frontend should treat provider access as successful when it can collect:

- `walletAddress`
- optional `deviceId`
- provider environment flag, such as `nimiqPayAvailable: true`

## Browser Fallback State

If Nimiq Pay provider access is unavailable:

- Allow demo-mode quiz completion.
- Show a clear fallback message.
- Do not claim a real NIM transfer.
- Mark proof as `demo_wallet_context` only when using a browser fallback.

## Completion Request

Endpoint:

```txt
POST /api/complete
```

Request:

```json
{
  "questId": "wallet-basics",
  "answers": [0, 1, 1],
  "walletAddress": "NQ12 ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456",
  "deviceId": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

## Claim Intent Request

Endpoint:

```txt
POST /api/claim-intents
```

Request:

```json
{
  "proofKey": "wallet-basics:NQ12 ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456",
  "walletAddress": "NQ12 ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456"
}
```

Response:

```json
{
  "claimIntent": {
    "type": "nim_reward_claim",
    "asset": "NIM",
    "amount": 1,
    "recipient": "NQ12 ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456",
    "memo": "NimQuest reward for wallet-basics",
    "status": "prepared"
  }
}
```

## Trust Rules

- Backend grades answers.
- Backend stores completion proof.
- Backend prepares claim metadata.
- Frontend never grades itself.
- Frontend never fabricates reward eligibility.
- Wallet approval must happen inside Nimiq Pay when real claim execution is available.
- No private keys or payout secrets are stored in source control.

## Current MVP Limitation

Checkpoint 3 prepares claim intents only. Real NIM transfer execution is a later integration step after provider behavior is verified in the Mini App frontend.
