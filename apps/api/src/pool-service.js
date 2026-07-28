import { quests } from "./quests.js";

const DEFAULT_POOL_NIM = 25;

export function listQuestPools() {
  return [
    createPool({
      id: "starter-onboarding",
      title: "Starter Onboarding Pool",
      sponsor: "NimQuest Demo Pool",
      questIds: ["wallet-basics", "nim-payments", "mini-app-safety", "nimiq-pay-flow"],
      purpose: "Help new users learn wallet safety, NIM payments, and Mini App approvals."
    }),
    createPool({
      id: "ecosystem-growth",
      title: "Ecosystem Growth Pool",
      sponsor: "Community Ready",
      questIds: ["merchant-payments", "community-quests", "mini-app-builder"],
      purpose: "Show how Nimiq teams and community members could sponsor reusable onboarding paths."
    })
  ];
}

export function getQuestPool(poolId) {
  return listQuestPools().find((pool) => pool.id === poolId) || null;
}

function createPool({ id, title, sponsor, questIds, purpose }) {
  const poolQuests = questIds.map((questId) => quests.find((quest) => quest.id === questId)).filter(Boolean);
  const totalRewardNim = poolQuests.reduce((total, quest) => total + quest.rewardNim, 0);

  return {
    id,
    title,
    sponsor,
    purpose,
    asset: "NIM",
    status: "demo_ready",
    fundingModel: "sponsor-funded quest pool",
    budgetNim: Math.max(DEFAULT_POOL_NIM, totalRewardNim),
    totalRewardNim,
    questIds
  };
}
