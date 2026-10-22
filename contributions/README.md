# Contribute a NimQuest lesson

NimQuest accepts maintainer-reviewed merchant and Mini App developer lessons. Contributors do not need to edit the core quest implementation, the web catalog or the quiz verifier.

## 1. Create a draft

Use Node.js 22 and install dependencies with `npm ci`:

```bash
npm run quest:new -- review-merchant-receipt
```

This creates `contributions/drafts/review-merchant-receipt.json`. Drafts are gitignored by default. Edit the file to remove every TODO and write a real, sourced lesson and three questions. Do not copy recovery words or user data into a quest.

## 2. Validate and stage

```bash
npm run quest:validate -- contributions/drafts/review-merchant-receipt.json
npm run quest:stage -- contributions/drafts/review-merchant-receipt.json
npm test
npm run build:web
```

The stage command appends the validated quest to `contributions/published-quests.json`. It does **not** deploy or publish a live quest. Open a pull request containing the changed published JSON file. The developer draft can remain local; it is not needed in the PR. Publishing happens only after maintainer review, CI, and merge into the production branch.

## Review requirements

- Link to a real HTTPS Nimiq source that supports the lesson and correct answers.
- Use a unique lowercase slug, one of the existing Merchants or Builders tracks, exactly two learning goals, and three questions with three distinct options each.
- Keep the answer index and explanations in the published source. The existing API and generated browser catalog remove that metadata until a learner submits answers for grading.
- Clearly distinguish pending transactions from confirmed payments and do not promise unapproved NIM payouts, sponsorship, or on-chain receipts.
- No HTML, unsafe markup, placeholder text, unsupported properties, or sensitive user information.
- Confirm that learning and wallet signing work as expected after CI, ideally in the native Nimiq Pay environment.

The package's `pretest` and `prebuild:web` steps validate contributions in CI and stop malformed catalog entries before bundling. The runtime loader also validates the published JSON before using it. The existing proof, privacy and wallet-verification flow remains unchanged.

**Current state:** The intake and review tooling is implemented; `published-quests.json` is initially empty. External contributor submissions have not yet been reviewed or shipped.
