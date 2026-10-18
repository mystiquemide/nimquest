import assert from "node:assert/strict";
import test from "node:test";
import worker from "../../../worker/index.js";

function databaseWithMissingTables(missing = []) {
  const errors = new Set(missing);
  return {
    prepare(sql) {
      return {
        async first() {
          const table = ["completions", "learning_funnel_daily", "completion_feedback"]
            .find((name) => sql.includes(`FROM ${name}`));
          if (!table) throw new Error("Unexpected query");
          if (errors.has(table)) throw new Error(`SECRET D1 DETAILS: no such table ${table}`);
          return { "1": 1 };
        }
      };
    }
  };
}

function inspect(missing) {
  return worker.fetch(new Request("https://nimquest.midelabs.xyz/api/health/dependencies"), {
    DB: databaseWithMissingTables(missing)
  });
}

test("readiness is healthy with all required tables", async () => {
  const response = await inspect([]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    ok: true,
    service: "nimquest-worker",
    status: "healthy",
    components: { completionStore: true, learningFunnel: true, learnerFeedback: true }
  });
});

test("readiness stays degraded when a learning migration is missing", async () => {
  const response = await inspect(["learning_funnel_daily"]);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "degraded");
  assert.equal(body.ok, true);
  assert.deepEqual(body.components, {
    completionStore: true, learningFunnel: false, learnerFeedback: true
  });
  assert.doesNotMatch(JSON.stringify(body), /SECRET D1 DETAILS/);
});

test("readiness fails when the core completion table is unavailable", async () => {
  const response = await inspect(["completions"]);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.status, "unavailable");
  assert.equal(body.ok, false);
  assert.equal(body.components.completionStore, false);
  assert.doesNotMatch(JSON.stringify(body), /SECRET D1 DETAILS/);
});

test("readiness does not leak errors when its D1 binding is absent", async () => {
  const response = await worker.fetch(
    new Request("https://nimquest.midelabs.xyz/api/health/dependencies"),
    { DB: undefined }
  );
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Unexpected server error." });
});
