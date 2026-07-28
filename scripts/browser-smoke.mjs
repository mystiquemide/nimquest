import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number.parseInt(process.env.NIMQUEST_SMOKE_PORT || "8791", 10);
const baseUrl = process.env.NIMQUEST_SMOKE_URL || `http://127.0.0.1:${port}`;
const ownsServer = !process.env.NIMQUEST_SMOKE_URL;
const server = ownsServer
  ? spawn(process.execPath, ["apps/api/src/server.js"], {
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"]
    })
  : null;

if (server) {
  await waitForHealth();
}

const executablePath = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const routes = [
  ["/", /Nimiq/],
  ["/quests", /Pick a skill/],
  ["/quests/meet-nimiq", /Meet Nimiq/],
  ["/proof/meet-nimiq", /wallet proof/i],
  ["/journey", /Small wins/],
  ["/leaderboard", /verified wallet proof/i],
  ["/docs", /Learn how NimQuest works/],
  ["/docs/architecture", /Architecture/],
  ["/docs/integration", /Nimiq Pay integration/],
  ["/docs/security", /Security and privacy/],
  ["/docs/setup", /Run NimQuest locally/],
  ["/privacy", /Privacy Notice/],
  ["/terms", /Terms of Use/],
  ["/does-not-exist", /This path ends here/]
];
const widths = [320, 375, 390, 430];
const evidence = [];

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const [route, heading] of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const h1 = page.locator("h1").first();
      await h1.waitFor({ state: "visible" });
      assert.match(await h1.textContent(), heading, `${route} has the wrong heading`);

      if (route === "/") {
        const menu = page.locator(".menu-button");
        if (await menu.isVisible()) {
          await menu.click();
          assert.equal(await menu.getAttribute("aria-expanded"), "true");
          await menu.click();
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
        }
      }

      if (route === "/quests") {
        const paymentsFilter = page.locator('[data-filter="payments"]');
        await paymentsFilter.click();
        assert.equal(await paymentsFilter.getAttribute("aria-pressed"), "true");
        assert.ok(await page.locator('.trail-card[data-track="payments"]:visible').count() > 0);
        await page.locator('[data-filter="all"]').click();
      }

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (overflows) {
        const offenders = await page.evaluate(() =>
          Array.from(document.querySelectorAll("*"))
            .map((element) => {
              const bounds = element.getBoundingClientRect();
              return {
                element: `${element.tagName.toLowerCase()}.${String(element.className || "")}`,
                left: Math.round(bounds.left),
                right: Math.round(bounds.right),
                width: Math.round(bounds.width)
              };
            })
            .filter((item) => item.left < 0 || item.right > document.documentElement.clientWidth)
            .slice(0, 12)
        );
        console.error(JSON.stringify({ route, width, offenders }, null, 2));
      }
      assert.equal(overflows, false, `${route} overflows at ${width}px`);
      evidence.push({ route, width, heading: (await h1.textContent()).trim() });
    }

    assert.deepEqual(errors, [], `browser errors at ${width}px`);
    await page.close();
  }

  console.log(JSON.stringify({
    status: "passed",
    routes: routes.length,
    widths,
    checks: evidence.length
  }, null, 2));
} finally {
  await browser.close();
  if (server) server.kill("SIGTERM");
}

async function waitForHealth() {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error("NimQuest smoke server stopped before it became ready.");
    }
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("NimQuest smoke server did not become ready.");
}
