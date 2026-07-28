import fs from "node:fs";
import { runCheck, pass, warn, fail, skip, httpGet, httpPost } from "./lib.mjs";

// ---- Health ----------------------------------------------------------------

export async function healthChecks(base, { live = false } = {}) {
  const results = [];

  results.push(await runCheck("app.reachable", "Application reachable", async () => {
    const res = await httpGet(`${base}/`);
    if (res.status !== 200) return fail(`GET / returned ${res.status}`, "Build the frontend with npm run build:web, then restart.");
    if (!/text\/html/.test(res.headers.get("content-type") || "")) return fail("GET / did not return HTML");
    return pass(`GET / -> 200 (${res.headers.get("content-type")})`);
  }));

  results.push(await runCheck("health.endpoint", "Health endpoint", async () => {
    const res = await httpGet(`${base}/health`);
    if (!res.json?.ok) return fail(`/health did not return ok:true (status ${res.status})`, "Check the server process and logs.");
    return pass(`/health -> ${JSON.stringify(res.json)}`);
  }));

  results.push(await runCheck("api.quests", "Quest catalog", async () => {
    const res = await httpGet(`${base}/api/quests`);
    const count = res.json?.quests?.length;
    if (count !== 20) return fail(`/api/quests returned ${count} quests, expected 20`);
    if (/answerIndex/.test(res.text)) return fail("Answer keys are exposed in /api/quests", "Regenerate the public catalog; answers must stay server-side.");
    return pass(`20 quests, no answer keys leaked`);
  }));

  results.push(await runCheck("api.leaderboard", "Leaderboard masking", async () => {
    const res = await httpGet(`${base}/api/leaderboard`);
    const board = res.json?.leaderboard;
    if (!Array.isArray(board)) return fail("/api/leaderboard did not return an array");
    const unmasked = board.filter((entry) => entry.walletLabel && !entry.walletLabel.includes("*"));
    if (unmasked.length) return fail("A wallet label is not masked", "Mask wallet labels in the leaderboard response.");
    return pass(`${board.length} ranked wallets, all masked`);
  }));

  if (live) {
    results.push(await runCheck("security.headers", "Security headers", async () => {
      const res = await httpGet(`${base}/`);
      const required = ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy"];
      const missing = required.filter((header) => !res.headers.get(header));
      if (missing.length) return fail(`Missing headers: ${missing.join(", ")}`, "Serve them via public/_headers.");
      return pass(`Present: ${required.join(", ")}`);
    }));

    results.push(await runCheck("meta.social", "Social preview metadata", async () => {
      const res = await httpGet(`${base}/`);
      const missing = ["og:image", "twitter:card"].filter((tag) => !res.text.includes(tag));
      if (missing.length) return warn(`Missing meta: ${missing.join(", ")}`, "Add Open Graph and Twitter tags to index.html.");
      return pass("og:image and twitter:card present");
    }));
  }

  return results;
}

// ---- Config ----------------------------------------------------------------

export async function configChecks() {
  const results = [];

  results.push(await runCheck("config.files", "Required files", async () => {
    const required = ["package.json", "wrangler.jsonc", "vite.config.js", ".github/workflows/ci.yml"];
    const missing = required.filter((file) => !fs.existsSync(file));
    if (missing.length) return fail(`Missing: ${missing.join(", ")}`);
    return pass(`Present: ${required.join(", ")}`);
  }));

  results.push(await runCheck("config.wrangler", "Wrangler bindings", async () => {
    const raw = fs.readFileSync("wrangler.jsonc", "utf8");
    const checks = [
      [/"binding":\s*"DB"/, "D1 binding DB"],
      [/"directory":\s*"\.\/dist"/, "assets directory ./dist"],
      [/"\/api\/\*"/, "run_worker_first /api/*"]
    ];
    const missing = checks.filter(([re]) => !re.test(raw)).map(([, name]) => name);
    if (missing.length) return fail(`Missing config: ${missing.join(", ")}`);
    return pass("D1 binding, dist assets, and worker routing configured");
  }));

  results.push(await runCheck("config.secrets", "No tracked secrets", async () => {
    const patterns = /(sk_live_|ghp_[A-Za-z0-9]{20}|-----BEGIN [A-Z ]*PRIVATE KEY|xox[baprs]-)/;
    let hit = false;
    for (const file of ["wrangler.jsonc", "package.json", "index.html"]) {
      if (fs.existsSync(file) && patterns.test(fs.readFileSync(file, "utf8"))) hit = true;
    }
    if (hit) return fail("A secret-like pattern was found in a tracked file", "Remove the secret and rotate it.");
    return pass("No secret patterns in core tracked files");
  }));

  return results;
}

// ---- Doctor ----------------------------------------------------------------

export async function doctorChecks() {
  const results = [];

  results.push(await runCheck("doctor.node", "Node.js version", async () => {
    const major = Number(process.versions.node.split(".")[0]);
    if (major < 20) return fail(`Node ${process.versions.node}, need 20+`, "Install Node.js 20 or later.");
    return pass(`Node ${process.versions.node}`);
  }));

  results.push(await runCheck("doctor.deps", "Dependencies installed", async () => {
    if (!fs.existsSync("node_modules")) return fail("node_modules missing", "Run npm ci.");
    return pass("node_modules present");
  }));

  results.push(await runCheck("doctor.dist", "Frontend build", async () => {
    if (!fs.existsSync("dist/index.html")) return warn("dist not built", "Run npm run build:web before serving or deploying.");
    return pass("dist/index.html present");
  }));

  results.push(await runCheck("doctor.migrations", "D1 migrations", async () => {
    const files = fs.existsSync("migrations") ? fs.readdirSync("migrations").filter((f) => f.endsWith(".sql")) : [];
    if (files.length < 3) return warn(`${files.length} migrations found, expected 3`, "Confirm migrations were not removed.");
    return pass(`${files.length} migrations present`);
  }));

  results.push(await runCheck("doctor.playwright", "Browser test dependency", async () => {
    if (!fs.existsSync("node_modules/playwright")) return warn("playwright not installed", "Run npm ci and npx playwright install chromium for browser tests.");
    return pass("playwright present");
  }));

  return results;
}

// ---- API -------------------------------------------------------------------

export async function apiChecks(base) {
  const results = [];

  results.push(await runCheck("api.grade.correct", "Grade correct answers", async () => {
    const res = await httpPost(`${base}/api/grade`, { questId: "meet-nimiq", answers: [0, 0, 0] });
    if (res.json?.passed !== true) return fail(`Correct answers did not pass (status ${res.status})`);
    return pass("meet-nimiq [0,0,0] -> passed");
  }));

  results.push(await runCheck("api.grade.wrong", "Grade wrong answers", async () => {
    const res = await httpPost(`${base}/api/grade`, { questId: "meet-nimiq", answers: [1, 1, 1] });
    if (res.json?.passed !== false) return fail("Wrong answers did not fail grading");
    return pass("meet-nimiq [1,1,1] -> not passed");
  }));

  results.push(await runCheck("api.grade.invalid", "Reject malformed grade", async () => {
    const res = await httpPost(`${base}/api/grade`, {});
    if (res.status < 400) return fail(`Malformed grade returned ${res.status}, expected 4xx`);
    return pass(`Empty body -> ${res.status}`);
  }));

  results.push(await runCheck("api.quest.detail", "Quest detail hides answers", async () => {
    const res = await httpGet(`${base}/api/quests/meet-nimiq`);
    if (!res.json?.quest) return fail(`/api/quests/meet-nimiq did not return a quest (status ${res.status})`);
    if (/answerIndex/.test(res.text)) return fail("Quest detail leaks answerIndex");
    return pass("Quest detail served without answer keys");
  }));

  results.push(await runCheck("api.unknown.404", "Unknown API route 404", async () => {
    const res = await httpGet(`${base}/api/does-not-exist`);
    if (res.status !== 404) return fail(`Unknown API route returned ${res.status}, expected 404`);
    return pass("Unknown /api route -> 404 JSON");
  }));

  results.push(await runCheck("api.origin.reject", "Cross-origin write rejected", async () => {
    const res = await httpPost(`${base}/api/grade`, { questId: "meet-nimiq", answers: [0, 0, 0] }, { headers: { origin: "https://evil.example.com" } });
    if (res.status !== 403) return fail(`Cross-origin POST returned ${res.status}, expected 403`, "Enforce same-origin on write routes.");
    return pass("Cross-origin POST -> 403");
  }));

  return results;
}

// ---- Flows -----------------------------------------------------------------

export const FLOWS = {
  "quiz-grade": "Read a quest, fail the quiz, then pass it (read-only).",
  "completion-challenge": "Issue a wallet-bound signing challenge (local write, needs --allow-write).",
  "wallet-proof": "Full Nimiq Pay signing flow (skipped: needs a real device)."
};

export async function runFlow(name, base, { allowWrite = false, live = false } = {}) {
  if (name === "quiz-grade") {
    return [await runCheck("flow.quiz-grade", "Flow: quiz grade", async () => {
      const quests = await httpGet(`${base}/api/quests`);
      if (!quests.json?.quests?.length) return fail("Could not load quests");
      const wrong = await httpPost(`${base}/api/grade`, { questId: "meet-nimiq", answers: [2, 2, 2] });
      if (wrong.json?.passed !== false) return fail("Expected the wrong attempt to fail");
      const right = await httpPost(`${base}/api/grade`, { questId: "meet-nimiq", answers: [0, 0, 0] });
      if (right.json?.passed !== true) return fail("Expected the correct attempt to pass");
      return pass("Load quests -> wrong fails -> correct passes -> ready for wallet proof");
    })];
  }

  if (name === "completion-challenge") {
    return [await runCheck("flow.completion-challenge", "Flow: issue challenge", async () => {
      if (live) return skip("Refusing to write to production. Run against a local target.");
      if (!allowWrite) return skip("Write flow. Rerun with --allow-write to issue a local challenge.");
      let KeyPair;
      try {
        ({ KeyPair } = await import("@nimiq/core"));
      } catch {
        return skip("@nimiq/core not available to generate a test address.");
      }
      const address = KeyPair.generate().toAddress().toUserFriendlyAddress();
      const res = await httpPost(`${base}/api/completion-challenges`, { questId: "meet-nimiq", walletAddress: address });
      if (res.status !== 201 || !res.json?.challenge?.id) {
        return fail(`Challenge issuance returned ${res.status}`, "Check the challenge route and local storage.");
      }
      return pass(`Issued a one-time challenge for a fresh local wallet (expires ${res.json.challenge.expiresAt})`);
    })];
  }

  if (name === "wallet-proof") {
    return [await runCheck("flow.wallet-proof", "Flow: wallet proof", async () =>
      skip("Signing requires the Nimiq Pay Mini App provider on a real device and cannot be automated headlessly."))];
  }

  return [await runCheck("flow.unknown", `Flow: ${name}`, async () => fail(`Unknown flow "${name}". Run "flow list".`))];
}

// ---- Deploy ----------------------------------------------------------------

export async function deployChecks(base) {
  const results = await healthChecks(base, { live: true });

  results.push(await runCheck("deploy.routes", "Public routes reachable", async () => {
    const routes = ["/quests", "/journey", "/leaderboard", "/privacy", "/terms", "/docs"];
    const bad = [];
    for (const route of routes) {
      const res = await httpGet(`${base}${route}`);
      if (res.status !== 200) bad.push(`${route} -> ${res.status}`);
    }
    if (bad.length) return fail(`Route failures: ${bad.join(", ")}`);
    return pass(`All ${routes.length} public routes -> 200`);
  }));

  results.push(await runCheck("deploy.bundle", "No answer keys in bundle", async () => {
    const html = await httpGet(`${base}/`);
    const match = html.text.match(/\/assets\/index-[^"']+\.js/);
    if (!match) return warn("Could not locate the JS bundle to scan");
    const bundle = await httpGet(`${base}${match[0]}`);
    if (/answerIndex/.test(bundle.text)) return fail("answerIndex found in the production bundle", "Ensure the browser catalog strips answer keys.");
    return pass("Production bundle has no answerIndex");
  }));

  return results;
}
