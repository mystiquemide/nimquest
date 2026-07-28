import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number.parseInt(process.env.NIMQUEST_CAPTURE_PORT || "8792", 10);
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = path.resolve("docs/screenshots");
const completionStore = path.join(os.tmpdir(), `nimquest-capture-${crypto.randomUUID()}.json`);
const server = spawn(process.execPath, ["apps/api/src/server.js"], {
  env: {
    ...process.env,
    PORT: String(port),
    NIMQUEST_COMPLETION_STORE: completionStore
  },
  stdio: ["ignore", "pipe", "pipe"]
});

fs.mkdirSync(outputDir, { recursive: true });
await waitForHealth();

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const routes = [
  ["landing", "/"],
  ["quest-trail", "/quests"],
  ["journey", "/journey"],
  ["leaderboard", "/leaderboard"],
  ["docs", "/docs"],
  ["privacy", "/privacy"],
  ["terms", "/terms"]
];
const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }]
];

try {
  for (const [viewportName, viewport] of viewports) {
    const page = await browser.newPage({ viewport });
    for (const [routeName, route] of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.locator("h1").first().waitFor({ state: "visible" });
      await page.screenshot({
        path: path.join(outputDir, `${routeName}-${viewportName}.png`),
        fullPage: true
      });
    }
    await page.close();
  }

  console.log(JSON.stringify({
    status: "captured",
    files: routes.length * viewports.length,
    outputDir
  }, null, 2));
} finally {
  await browser.close();
  server.kill("SIGTERM");
  fs.rmSync(completionStore, { force: true });
}

async function waitForHealth() {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error("NimQuest capture server stopped before it became ready.");
    }
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("NimQuest capture server did not become ready.");
}
