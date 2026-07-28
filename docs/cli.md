# NimQuest QA CLI

A safe, scriptable QA and diagnostics interface for NimQuest. Every check runs against a real server or the live deployment and returns evidence. Nothing reports success from a process status or an HTTP 200 alone.

## Usage

```bash
npm run cli -- <command> [flags]
# or
node cli/index.mjs <command> [flags]
```

## Commands

| Command | What it verifies |
|---|---|
| `health` | Reachability, `/health`, 20-quest catalog with no answer leak, masked leaderboard |
| `doctor` | Node version, dependencies, build, migrations, browser tooling |
| `config check` | Required files, wrangler bindings, secret scan |
| `api check` | Grading (correct and wrong), malformed input, quest detail, 404, cross-origin rejection |
| `flow list` | Lists the product flows |
| `flow run <name>` | Runs a product flow (see below) |
| `test [unit\|browser]` | Runs the existing test suites |
| `deploy check` | Read-only checks against the live production URL |
| `qa` | Fast release-blocking checks against a local server |
| `qa full` | qa plus unit tests, build, browser smoke, local flows, and the live deploy check |
| `diagnose` | Runs config, health, and api checks and lists confirmed failures |
| `report` | Prints the last `artifacts/qa/summary.json` |

## Product flows

- `quiz-grade` — load a quest, fail the quiz, then pass it. Read-only.
- `completion-challenge` — issue a wallet-bound signing challenge. Local write, needs `--allow-write`, generates a fresh throwaway address.
- `wallet-proof` — the full Nimiq Pay signing flow. Skipped, since signing needs a real device.

## Flags

| Flag | Effect |
|---|---|
| `--target local\|live` | Where to run (default `local`; `deploy check` is always live) |
| `--json` | Machine-readable report on stdout |
| `--verbose` | Show warnings and evidence |
| `--quiet` | Suppress the human table |
| `--ci` | Write artifacts and use CI-friendly output |
| `--allow-write` | Permit the local write flow |
| `--timeout <ms>` | Per-request timeout |

## Exit codes

- `0` — no failing checks (warnings and skips do not block)
- `1` — at least one failing check
- `2` — unknown command

## Artifacts

`qa`, `qa full`, `deploy check`, and any run with `--ci` write:

- `artifacts/qa/summary.json` — stable schema for CI and agents
- `artifacts/qa/summary.md` — human-readable table

## Safety

Live and deploy checks are read-only. The CLI never writes to production. The only write flow runs against a local server, creates an isolated short-lived challenge, and requires `--allow-write`. Config checks report presence, never secret values.

## Common commands

```bash
npm run cli -- health              # fast local health
npm run cli -- diagnose            # find and explain failures
npm run cli -- qa                  # release-blocking checks
npm run cli -- qa full             # everything, incl. live deploy check
npm run cli -- deploy check        # verify production only
npm run cli -- flow run quiz-grade # one product flow
```
