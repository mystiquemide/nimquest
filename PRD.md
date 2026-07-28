# NimQuest Product Requirements

## Product

NimQuest teaches Nimiq through short lessons, three-question quizzes, and wallet-verified completion records.

## Users

Primary user: a new or curious Nimiq user who wants clear guidance before approving wallet actions.

Secondary user: a Nimiq community member who needs a reliable onboarding link to share.

## Problem

Passive documentation does not confirm understanding. New users can reach wallet prompts before they understand addresses, signatures, payments, recovery, staking, or Mini App permissions.

## Product Rule

A verified completion requires:

1. A passed server-side quiz.
2. A five-minute challenge bound to one quest and wallet.
3. A valid Nimiq signed message.
4. Successful challenge consumption.
5. A unique quest-and-wallet record.

## Current Scope

- 20 sourced quests across seven paths
- Nimiq Pay account approval and message signing
- Server-side grading
- D1 completion persistence
- Journey recovery
- Opaque receipts
- Eight verified badges
- Mandatory public leaderboard with masked wallet labels
- Protected completion feedback
- Privacy Notice and Terms of Use

## Product Decisions

| Question | Decision |
| --- | --- |
| Is leaderboard participation required? | Yes. Every verified completion is ranked. |
| Can a learner opt out of ranking? | No. The rule is disclosed before wallet verification. |
| Is a device identifier collected? | No. Wallet plus quest already prevents duplicate completion. |
| Does a public receipt show the full wallet? | No. It shows the address prefix and asterisks. |
| Are rewards active? | No. The interface says **Coming soon**. |

## Out of Scope

- Custodial reward wallet
- Funded NIM payouts
- Random rewards or games of chance
- Quest authoring dashboard
- Sponsored campaigns
- Full learning-management features

## Success Checks

- A first-time learner can reach wallet verification in about one minute.
- Every primary route renders on a fresh mobile browser.
- Nimiq Pay verifies a completion without transferring NIM.
- Browser bundles do not contain answer indexes.
- Public responses do not expose a full wallet address.
- Unauthorized feedback updates return an authorization error.
- Tests, browser smoke checks, build, and Worker checks pass before release.
