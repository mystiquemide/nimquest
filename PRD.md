# NimQuest PRD

## Summary

NimQuest is Nimiq's learn-by-doing onboarding layer. A new user learns one Nimiq concept, answers a short quiz, and signs a one-time Nimiq Pay challenge to create verified completion proof.

## Competition Target

- Competition: Nimiq Mini Apps Competition
- Target cycle: Cycle I
- Primary judging goal: ship one polished, working Nimiq-native flow
- Required integration: Nimiq Pay Mini Apps Framework with NIM support

## Users

Primary user:

- A new or curious Nimiq user who needs a fast way to understand wallet actions, NIM payments, and Mini App safety.

Secondary user:

- Nimiq community members who want a simple onboarding link to share with new users.

## Problem

Nimiq onboarding can be too passive when users only read docs or marketing pages. Users understand faster when they perform small actions, answer simple checks, and see immediate progress.

## Product Thesis

If Nimiq onboarding is split into 60-second quests with wallet-based completion proof, new users can move from curiosity to active wallet use faster.

## MVP Scope

Must have:

- Backend quest catalog.
- Three accurate, sourced onboarding quests.
- Quiz validation without exposing answer keys.
- Cryptographic Nimiq wallet-control proof.
- Short-lived challenges with expiry and replay protection.
- Duplicate completion guard.
- Durable completion storage.
- Basic anti-abuse validation.
- Mobile-first frontend after backend is stable.
- Nimiq Pay wallet/provider integration.
- README, demo story, and submission copy.

Should have:

- Device identifier support.
- Quest streak or completion state.
- Clean browser fallback for judging/demo.
- Public testing evidence.
- Builder/community quest lanes that show the app can grow past one contest demo.

Out of scope for Cycle I:

- Full learning management system.
- Complex admin dashboard.
- Custodial reward wallet.
- Randomized rewards or games of chance.
- Marketplace, escrow, or creator monetization features.

## Success Metrics

- A user can complete the first quest in under 60 seconds.
- App works on mobile-sized screens.
- Backend tests pass.
- Demo shows a real quest completion flow.
- A real Nimiq Pay message signature is verified by the backend.
- README explains setup and judging path clearly.

## Risks

- Real Nimiq Pay testing may be slower than backend/frontend implementation.
- Real NIM reward transfer may require funding and wallet flow confirmation.
- Weak positioning could make the app look like a faucet.

## Positioning

NimQuest is the onboarding layer for Nimiq. It teaches users through short, wallet-verified quests.

## Ecosystem App Angle

NimQuest should feel useful beyond one submission. The backend supports:

- New-user onboarding quests.
- Builder education quests.
- Merchant payment education quests.
- Community-sponsored quest pools.
- Aggregate public progress that can be shown in a demo, README, or community update.
