export const quests = [
  {
    id: "wallet-basics",
    title: "Wallet Basics",
    rewardNim: 1,
    estimatedSeconds: 45,
    lesson:
      "A Nimiq Pay wallet lets you approve account access and payments without exposing private keys to mini apps.",
    questions: [
      {
        id: "wallet-private-keys",
        prompt: "Where do private keys stay during a Nimiq Pay Mini App wallet action?",
        options: [
          "Inside Nimiq Pay",
          "Inside the mini app database",
          "Inside the public GitHub repo"
        ],
        answerIndex: 0
      },
      {
        id: "approval",
        prompt: "What should happen before a sensitive wallet action?",
        options: [
          "The app should bypass approval",
          "The user should approve it in Nimiq Pay",
          "The backend should guess the user's address"
        ],
        answerIndex: 1
      },
      {
        id: "integration",
        prompt: "What counts as real Nimiq Pay integration?",
        options: [
          "Showing a logo only",
          "Using wallet, transaction, or payment infrastructure",
          "Mentioning NIM in the footer"
        ],
        answerIndex: 1
      }
    ]
  },
  {
    id: "nim-payments",
    title: "NIM Payments",
    rewardNim: 1,
    estimatedSeconds: 50,
    lesson:
      "NIM is the native asset of the Nimiq network and is a strong fit for fast, low-friction mini app rewards.",
    questions: [
      {
        id: "native-asset",
        prompt: "Which asset gives a Mini App bonus in the competition?",
        options: ["NIM", "A fake token", "A screenshot"],
        answerIndex: 0
      },
      {
        id: "payments-core",
        prompt: "Where should payments sit in a strong Mini App?",
        options: [
          "At the core of the user flow",
          "Hidden in a logo",
          "Only in a README claim"
        ],
        answerIndex: 0
      },
      {
        id: "reward-cap",
        prompt: "Why cap learning rewards?",
        options: [
          "To reduce farming and keep rewards sustainable",
          "To stop users from learning",
          "To remove wallet use"
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: "mini-app-safety",
    title: "Mini App Safety",
    rewardNim: 1,
    estimatedSeconds: 55,
    lesson:
      "Mini apps should be transparent about wallet actions, avoid secret handling, and fail safely when wallet access is unavailable.",
    questions: [
      {
        id: "secrets",
        prompt: "What should never be committed to the repository?",
        options: ["Private keys or API secrets", "README text", "Public docs"],
        answerIndex: 0
      },
      {
        id: "fallback",
        prompt: "What should the app do if Nimiq Pay provider access is missing?",
        options: [
          "Show a clear fallback state",
          "Crash silently",
          "Fake a transaction"
        ],
        answerIndex: 0
      },
      {
        id: "consent",
        prompt: "Who approves sensitive wallet actions?",
        options: ["The user", "The CSS file", "A random visitor"],
        answerIndex: 0
      }
    ]
  }
];

export function publicQuest(quest) {
  return {
    id: quest.id,
    title: quest.title,
    rewardNim: quest.rewardNim,
    estimatedSeconds: quest.estimatedSeconds,
    lesson: quest.lesson,
    questions: quest.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      options: question.options
    }))
  };
}

export function findQuest(questId) {
  return quests.find((quest) => quest.id === questId);
}
