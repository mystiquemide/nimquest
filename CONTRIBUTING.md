# Contributing to NimQuest

NimQuest accepts focused fixes, new tests, accessibility improvements, and corrections to sourced Nimiq learning content.

## Before You Start

1. Check the open issues for related work.
2. Open an issue before you propose a large product or data-model change.
3. Use official Nimiq sources for factual lesson changes.
4. Do not add private keys, recovery data, wallet secrets, or production credentials.

## Local Verification

Use Node.js 20 or later.

```bash
npm ci
npm test
npm run build:web
npm run test:browser
npm run worker:check
```

If you change D1 behavior, also run:

```bash
npm run test:worker-integration
```

## Pull Requests

Keep each pull request focused. Explain the user impact and list the checks that passed.

For quest content, include the official source URL and confirm that correct answer indexes remain server-only.

By contributing, you agree that your contribution is available under the MIT License.
