export const quests = [
  {
    id: "wallet-basics",
    title: "Wallet Basics",
    track: "onboarding",
    audience: "new-user",
    difficulty: "starter",
    ecosystemUseCase: "Teaches safe wallet approval before the user tries payments.",
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
    track: "payments",
    audience: "new-user",
    difficulty: "starter",
    ecosystemUseCase: "Shows why NIM belongs inside the core Mini App flow.",
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
    track: "security",
    audience: "new-user",
    difficulty: "starter",
    ecosystemUseCase: "Reinforces consent, fallback states, and secret hygiene for Mini Apps.",
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
  },
  {
    id: "nimiq-pay-flow",
    title: "Nimiq Pay Flow",
    track: "wallet-action",
    audience: "new-user",
    difficulty: "starter",
    ecosystemUseCase: "Prepares users to approve account access and understand wallet prompts.",
    rewardNim: 1,
    estimatedSeconds: 50,
    lesson:
      "A strong Mini App makes wallet prompts clear, expected, and tied to the task the user just chose.",
    questions: [
      {
        id: "wallet-prompt",
        prompt: "When should a wallet prompt appear?",
        options: [
          "After the user starts a clear wallet action",
          "Before the app explains anything",
          "Randomly on every page load"
        ],
        answerIndex: 0
      },
      {
        id: "provider-proof",
        prompt: "What should the Mini App prove during judging?",
        options: [
          "That wallet access is part of the product flow",
          "That the logo is visible",
          "That answers are stored in the browser only"
        ],
        answerIndex: 0
      },
      {
        id: "fallback-truth",
        prompt: "What should a browser fallback avoid doing?",
        options: [
          "Pretending a wallet transaction happened",
          "Explaining the missing provider",
          "Letting users preview a quest"
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: "merchant-payments",
    title: "Merchant Payments",
    track: "ecosystem",
    audience: "merchant",
    difficulty: "starter",
    ecosystemUseCase: "Turns NimQuest into a path for teaching payment acceptance and merchant value.",
    rewardNim: 1,
    estimatedSeconds: 55,
    lesson:
      "Nimiq can help small merchants accept fast digital payments when the app keeps the checkout flow simple and transparent.",
    questions: [
      {
        id: "merchant-value",
        prompt: "What should merchant onboarding focus on first?",
        options: [
          "A simple payment acceptance flow",
          "A complex trading dashboard",
          "Hidden fees"
        ],
        answerIndex: 0
      },
      {
        id: "payment-clarity",
        prompt: "What makes checkout safer for a user?",
        options: [
          "Clear amount, asset, and recipient",
          "A blank approval screen",
          "No confirmation"
        ],
        answerIndex: 0
      },
      {
        id: "nim-fit",
        prompt: "Why does NIM fit small payment demos?",
        options: [
          "It is native to the Nimiq network",
          "It is a private key",
          "It removes the need for consent"
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: "community-quests",
    title: "Community Quests",
    track: "distribution",
    audience: "community",
    difficulty: "starter",
    ecosystemUseCase: "Frames NimQuest as reusable onboarding infrastructure for community campaigns.",
    rewardNim: 1,
    estimatedSeconds: 60,
    lesson:
      "Community quests can turn announcements, docs, and campaigns into short actions that teach users and prove engagement.",
    questions: [
      {
        id: "community-use",
        prompt: "What is the best use for community quests?",
        options: [
          "Teaching and activating users",
          "Farming unlimited rewards",
          "Hiding product instructions"
        ],
        answerIndex: 0
      },
      {
        id: "sponsor-pools",
        prompt: "Who could fund a quest pool later?",
        options: [
          "Community members, teams, or sponsors",
          "Only anonymous fake wallets",
          "Nobody"
        ],
        answerIndex: 0
      },
      {
        id: "repeatable",
        prompt: "Why should quests be reusable?",
        options: [
          "So onboarding can scale beyond one demo",
          "So users never finish",
          "So the backend can expose answers"
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: "mini-app-builder",
    title: "Mini App Builder Basics",
    track: "builders",
    audience: "builder",
    difficulty: "starter",
    ecosystemUseCase: "Makes NimQuest useful for future builders who need Mini App integration guidance.",
    rewardNim: 1,
    estimatedSeconds: 60,
    lesson:
      "Builders should keep Mini Apps narrow, wallet-aware, mobile-first, and honest about what is real versus fallback.",
    questions: [
      {
        id: "builder-focus",
        prompt: "What should a strong hackathon Mini App prioritize?",
        options: [
          "One polished wallet-native loop",
          "Ten unfinished features",
          "A landing page only"
        ],
        answerIndex: 0
      },
      {
        id: "server-trust",
        prompt: "Where should quiz grading happen?",
        options: [
          "On the backend",
          "In exposed answer keys",
          "In screenshots"
        ],
        answerIndex: 0
      },
      {
        id: "mini-app-truth",
        prompt: "What should builders avoid claiming?",
        options: [
          "Unverified wallet actions",
          "Clear limits",
          "Known risks"
        ],
        answerIndex: 0
      }
    ]
  }
];

export function publicQuest(quest) {
  return {
    id: quest.id,
    title: quest.title,
    track: quest.track,
    audience: quest.audience,
    difficulty: quest.difficulty,
    ecosystemUseCase: quest.ecosystemUseCase,
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
