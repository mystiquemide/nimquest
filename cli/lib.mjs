import { spawn } from "node:child_process";
import net from "node:net";

export const DEFAULT_TIMEOUT = 15000;
export const LIVE_URL = "https://nimquest.artistic-chip.workers.dev";

// Status helpers. Every check returns one of these shapes.
export const pass = (evidence) => ({ status: "pass", evidence: asArray(evidence) });
export const warn = (error, suggestedFix, evidence) => ({ status: "warn", error, suggestedFix, evidence: asArray(evidence) });
export const fail = (error, suggestedFix, evidence) => ({ status: "fail", error, suggestedFix, evidence: asArray(evidence) });
export const skip = (reason) => ({ status: "skip", error: reason, evidence: [] });

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

// Wrap a check function with timing and error capture. Never throws.
export async function runCheck(id, name, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    return {
      id,
      name,
      status: result.status,
      durationMs: Date.now() - start,
      evidence: result.evidence || [],
      error: result.error || null,
      suggestedFix: result.suggestedFix || null
    };
  } catch (error) {
    return {
      id,
      name,
      status: "fail",
      durationMs: Date.now() - start,
      evidence: [],
      error: error instanceof Error ? error.message : String(error),
      suggestedFix: "Inspect the error message and rerun with --verbose."
    };
  }
}

async function withTimeout(url, options, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Not JSON, leave null.
    }
    return { ok: response.ok, status: response.status, headers: response.headers, text, json };
  } finally {
    clearTimeout(timer);
  }
}

export function httpGet(url, { timeout = DEFAULT_TIMEOUT, headers } = {}) {
  return withTimeout(url, { method: "GET", headers }, timeout);
}

export function httpPost(url, body, { timeout = DEFAULT_TIMEOUT, headers } = {}) {
  return withTimeout(
    url,
    { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) },
    timeout
  );
}

export function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

// Spawn the local Node server and wait until /health responds.
export async function startLocalServer({ timeout = 15000 } = {}) {
  const port = await findFreePort();
  const proc = spawn(process.execPath, ["apps/api/src/server.js"], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const logs = [];
  proc.stdout.on("data", (data) => logs.push(data.toString()));
  proc.stderr.on("data", (data) => logs.push(data.toString()));

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`Local server exited early: ${logs.join("").slice(-400)}`);
    }
    try {
      const response = await fetch(`${base}/health`);
      if (response.ok) return { proc, base, logs, port };
    } catch {
      // Still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  proc.kill("SIGTERM");
  throw new Error("Local server did not become ready within the timeout.");
}

export function stopLocalServer(server) {
  if (server?.proc && server.proc.exitCode === null) {
    server.proc.kill("SIGTERM");
  }
}
