import assert from "node:assert/strict";
import test from "node:test";
import worker from "../../../worker/index.js";

function fakeDatabase({ funnelAvailable, feedbackAvailable }) {
  return {
    prepare(query) {
      const isFunnel = query.includes("FROM learning_funnel_daily");
      const isFeedback = query.includes("FROM completion_feedback");
      return {
        async first() {
          if (isFunnel && !funnelAvailable) throw new Error("no such table: learning_funnel_daily");
          if (isFunnel) {
            return {
              tracking_since: "2026-09-16",
              quiz_attempts: 3,
              quiz_passes: 2,
              proof_starts: 1,
              verified_completions: 1
            };
          }
          return {
            verified_completions: 55,
            participating_wallets: 20,
            active_quests: 20,
            latest_verified_at: "2026-10-04T17:55:25.718Z"
          };
        },
        async all() {
          if (isFunnel && !funnelAvailable) throw new Error("no such table: learning_funnel_daily");
          if (isFeedback && !feedbackAvailable) throw new Error("no such table: completion_feedback");
          return { results: [] };
        }
      };
    }
  };
}

test("community preserves verified totals when optional analytics tables are missing", async () => {
  const response = await worker.fetch(
    new Request("https://nimquest.midelabs.xyz/api/community"),
    { DB: fakeDatabase({ funnelAvailable: false, feedbackAvailable: false }) }
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.summary.verifiedCompletions, 55);
  assert.equal(payload.summary.participatingWallets, 20);
  assert.deepEqual(payload.availability, { funnel: false, feedback: false });
  assert.equal(payload.funnel, null);
  assert.deepEqual(payload.questFunnels, []);
  assert.deepEqual(payload.feedbackInsights, []);
});

test("community keeps real analytics when tables are available", async () => {
  const response = await worker.fetch(
    new Request("https://nimquest.midelabs.xyz/api/community"),
    { DB: fakeDatabase({ funnelAvailable: true, feedbackAvailable: true }) }
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(payload.availability, { funnel: true, feedback: true });
  assert.equal(payload.funnel.quizAttempts, 3);
  assert.equal(payload.funnel.quizPasses, 2);
  assert.equal(payload.funnel.passRate, 66.7);
});
