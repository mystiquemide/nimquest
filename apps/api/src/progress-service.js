import { quests } from "./quests.js";

export function getPublicProgress(completionStore) {
  const completions = completionStore.values();
  const uniqueWallets = new Set(completions.map((completion) => completion.walletAddress));
  const rewardNimPrepared = completions.reduce((total, completion) => total + Number(completion.rewardNim || 0), 0);

  return {
    totalQuests: quests.length,
    totalCompletions: completions.length,
    uniqueWallets: uniqueWallets.size,
    rewardNimPrepared,
    quests: quests.map((quest) => {
      const questCompletions = completions.filter((completion) => completion.questId === quest.id);

      return {
        id: quest.id,
        title: quest.title,
        track: quest.track,
        completions: questCompletions.length,
        rewardNimPrepared: questCompletions.reduce(
          (total, completion) => total + Number(completion.rewardNim || 0),
          0
        )
      };
    })
  };
}
