#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { LIVE_URL, startLocalServer, stopLocalServer, runCheck, pass, fail } from "./lib.mjs";
import { healthChecks, configChecks, doctorChecks, apiChecks, deployChecks, runFlow, FLOWS } from "./checks.mjs";

const ARTIFACT_DIR = "artifacts/qa";

function parseArgs(argv) {
  const positional = [];
  const flags = { target: null, json: false, verbose: false, quiet: false, ci: false, allowWrite: false, timeout: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") flags.json = true;
    else if (arg === "--verbose") flags.verbose = true;
    else if (arg === "--quiet") flags.quiet = true;
    else if (arg === "--ci") flags.ci = true;
    else if (arg === "--allow-write") flags.allowWrite = true;
    else if (arg === "--target") flags.target = argv[++i];
    else if (arg === "--timeout") flags.timeout = Number(argv[++i]);
    else if (!arg.startsWith("--")) positional.push(arg);
  }
  return { positional, flags };
}

async function withTarget(target, fn) {
  if (target === "live") return fn(LIVE_URL, { live: true });
  const server = await startLocalServer();
  try {
    return await fn(server.base, { live: false, server });
  } finally {
    stopLocalServer(server);
  }
}

function spawnCheck(id, name, command, args) {
  return runCheck(id, name, () =>
    new Promise((resolve) => {
      const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
      const output = [];
      child.stdout.on("data", (data) => output.push(data.toString()));
      child.stderr.on("data", (data) => output.push(data.toString()));
      child.on("close", (code) => {
        const tail = output.join("").trim().split("\n").slice(-6).join("\n");
        if (code === 0) resolve(pass(`${command} ${args.join(" ")} -> exit 0`));
        else resolve(fail(`${command} ${args.join(" ")} exited ${code}`, "Run the command directly to see full output.", tail));
      });
    })
  );
}

// ---- Reporting -------------------------------------------------------------

const LABEL = { pass: "PASS", fail: "FAIL", warn: "WARN", skip: "SKIP" };

function humanReport(command, results, flags) {
  if (flags.quiet) return;
  const lines = [`\nNimQuest QA  ·  ${command}\n`];
  for (const r of results) {
    lines.push(`${LABEL[r.status].padEnd(4)}  ${r.name.padEnd(32)} ${String(r.durationMs) + "ms"}`);
  }
  const summary = summarize(results);
  const overall = summary.failed > 0 ? "FAILED" : summary.warnings > 0 ? "PASSED WITH WARNINGS" : "PASSED";
  lines.push(`\nResult: ${overall}  (${summary.passed} pass, ${summary.failed} fail, ${summary.warnings} warn, ${summary.skipped} skip)`);
  const problems = results.filter((r) => r.status === "fail" || (flags.verbose && r.status === "warn"));
  for (const r of problems) {
    lines.push(`\n${LABEL[r.status]}  ${r.name}`);
    if (r.error) lines.push(`  Reason: ${r.error}`);
    if (r.evidence?.length) lines.push(`  Evidence: ${r.evidence.join(" | ")}`);
    if (r.suggestedFix) lines.push(`  Fix: ${r.suggestedFix}`);
  }
  console.log(lines.join("\n"));
}

function summarize(results) {
  return {
    passed: results.filter((r) => r.status === "pass").length,
    failed: results.filter((r) => r.status === "fail").length,
    warnings: results.filter((r) => r.status === "warn").length,
    skipped: results.filter((r) => r.status === "skip").length
  };
}

function buildReport(command, results, startedAt, environment) {
  return {
    command,
    status: summarize(results).failed > 0 ? "failed" : "passed",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: results.reduce((total, r) => total + r.durationMs, 0),
    environment,
    summary: summarize(results),
    checks: results,
    artifacts: [`${ARTIFACT_DIR}/summary.json`, `${ARTIFACT_DIR}/summary.md`]
  };
}

function writeArtifacts(report) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.writeFileSync(path.join(ARTIFACT_DIR, "summary.json"), JSON.stringify(report, null, 2));
  const md = [
    `# NimQuest QA report`,
    ``,
    `- Command: \`${report.command}\``,
    `- Environment: ${report.environment}`,
    `- Status: ${report.status.toUpperCase()}`,
    `- Completed: ${report.completedAt}`,
    ``,
    `| Check | Status | Duration | Notes |`,
    `|---|---|---:|---|`,
    ...report.checks.map((r) => `| ${r.name} | ${LABEL[r.status]} | ${r.durationMs}ms | ${(r.error || r.evidence?.[0] || "").replace(/\|/g, "/")} |`)
  ].join("\n");
  fs.writeFileSync(path.join(ARTIFACT_DIR, "summary.md"), md + "\n");
}

function finish(command, results, flags, environment) {
  const startedAt = new Date().toISOString();
  const report = buildReport(command, results, startedAt, environment);
  if (flags.json) console.log(JSON.stringify(report, null, 2));
  else humanReport(command, results, flags);
  if (flags.ci || command.startsWith("qa") || command === "deploy check") writeArtifacts(report);
  process.exitCode = report.summary.failed > 0 ? 1 : 0;
}

// ---- Commands --------------------------------------------------------------

const HELP = `NimQuest QA CLI

Usage: npm run cli -- <command> [flags]

Commands:
  health [--target local|live]   Reachability, health, catalog, leaderboard masking
  doctor                         Runtime, deps, build, migrations, browser tooling
  config check                   Files, wrangler bindings, secret scan
  api check [--target ...]       Grading, schemas, 404s, cross-origin rejection
  flow list                      List product flows
  flow run <name> [--allow-write] Run a product flow
  test [unit|browser]            Run existing test suites
  deploy check                   Read-only checks against the live deployment
  qa                             Fast release-blocking checks (local)
  qa full                        Full suite: qa + tests + build + smoke + deploy check
  diagnose                       Collect failures with evidence
  report                         Print the last QA report

Flags: --target, --json, --verbose, --quiet, --ci, --allow-write, --timeout <ms>
Flows: ${Object.keys(FLOWS).join(", ")}`;

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const cmd = positional.join(" ") || "help";
  const target = flags.target || "local";

  if (cmd === "help" || cmd === "--help") return console.log(HELP);

  if (cmd === "health") {
    return withTarget(target, async (base, ctx) => finish("health", await healthChecks(base, ctx), flags, target));
  }
  if (cmd === "doctor") return finish("doctor", await doctorChecks(), flags, "local");
  if (cmd === "config check" || cmd === "config") return finish("config check", await configChecks(), flags, "local");
  if (cmd === "api check" || cmd === "api") {
    return withTarget(target, async (base) => finish("api check", await apiChecks(base), flags, target));
  }
  if (cmd === "flow list") {
    console.log("Product flows:");
    for (const [name, desc] of Object.entries(FLOWS)) console.log(`  ${name.padEnd(22)} ${desc}`);
    return;
  }
  if (positional[0] === "flow" && positional[1] === "run") {
    const name = positional[2];
    return withTarget(target, async (base, ctx) =>
      finish(`flow run ${name}`, await runFlow(name, base, { allowWrite: flags.allowWrite, live: ctx.live }), flags, target));
  }
  if (positional[0] === "test") {
    const which = positional[1];
    const script = which === "browser" ? "test:browser" : which === "unit" || !which ? "test" : null;
    if (!script) return console.error(`Unknown test suite "${which}"`);
    const child = spawn("npm", ["run", script === "test" ? "test" : script].filter(Boolean), { stdio: "inherit", shell: false });
    child.on("close", (code) => { process.exitCode = code || 0; });
    return;
  }
  if (cmd === "deploy check" || cmd === "deploy") {
    return finish("deploy check", await deployChecks(LIVE_URL), flags, "production");
  }
  if (cmd === "diagnose") {
    return withTarget(target, async (base, ctx) => {
      const results = [...await configChecks(), ...await healthChecks(base, ctx), ...await apiChecks(base)];
      const failures = results.filter((r) => r.status === "fail");
      finish("diagnose", results, flags, target);
      if (!flags.json) {
        console.log(`\nFailures: ${failures.length}`);
        for (const r of failures) console.log(`  [confirmed] ${r.name}: ${r.error}`);
      }
    });
  }
  if (cmd === "qa") {
    return withTarget(target, async (base, ctx) => {
      const results = [
        ...await configChecks(),
        ...await doctorChecks(),
        ...await healthChecks(base, ctx),
        ...await apiChecks(base),
        ...await runFlow("quiz-grade", base, {})
      ];
      finish("qa", results, flags, target);
    });
  }
  if (cmd === "qa full") {
    const results = [...await configChecks(), ...await doctorChecks()];
    results.push(await spawnCheck("test.unit", "Unit and API tests", "npm", ["test"]));
    results.push(await spawnCheck("build.web", "Frontend build", "npm", ["run", "build:web"]));
    results.push(await spawnCheck("test.browser", "Browser smoke tests", "npm", ["run", "test:browser"]));
    const local = await startLocalServer();
    try {
      results.push(...await healthChecks(local.base, { live: false }));
      results.push(...await apiChecks(local.base));
      results.push(...await runFlow("quiz-grade", local.base, {}));
      results.push(...await runFlow("completion-challenge", local.base, { allowWrite: true }));
    } finally {
      stopLocalServer(local);
    }
    results.push(...await deployChecks(LIVE_URL));
    return finish("qa full", results, flags, "local+production");
  }
  if (cmd === "report") {
    const file = path.join(ARTIFACT_DIR, "summary.json");
    if (!fs.existsSync(file)) return console.error("No report found. Run qa first.");
    return console.log(fs.readFileSync(file, "utf8"));
  }

  console.error(`Unknown command "${cmd}". Run: npm run cli -- help`);
  process.exitCode = 2;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
