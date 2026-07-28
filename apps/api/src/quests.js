export const quests = [
  {
    id: "meet-nimiq",
    title: "Meet Nimiq",
    track: "onboarding",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 55,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Recognize NIM as the native asset of the Nimiq network.",
      "Understand that Nimiq addresses can be shared without revealing wallet secrets."
    ],
    lesson:
      "Nimiq is a payment-focused blockchain designed to make crypto simple to use. NIM is its native asset. Your Nimiq address identifies your account for receiving payments, while your private keys remain inside your wallet and must never be shared.",
    sourceUrl: "https://nimiq.com/",
    questions: [
      {
        id: "native-asset",
        prompt: "What is the native asset of the Nimiq network?",
        options: ["NIM", "A wallet password", "A bank account number"],
        answerIndex: 0,
        explanation: "NIM is the native asset used on the Nimiq network."
      },
      {
        id: "safe-to-share",
        prompt: "What can you share when someone wants to send you NIM?",
        options: ["Your Nimiq address", "Your private key", "Your recovery words"],
        answerIndex: 0,
        explanation: "A public Nimiq address can receive funds. Private keys and recovery words must stay secret."
      },
      {
        id: "wallet-role",
        prompt: "What protects the keys that control your NIM?",
        options: ["Your wallet", "A public quest page", "A transaction recipient"],
        answerIndex: 0,
        explanation: "Your wallet protects the keys used to authorize account actions."
      }
    ]
  },
  {
    id: "pay-with-nim",
    title: "Pay with NIM",
    track: "payments",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 60,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Review the recipient, amount, and asset before approving a payment.",
      "Recognize that Nimiq Pay asks for approval for sensitive wallet actions."
    ],
    lesson:
      "A NIM payment names a recipient and an amount. Nimiq Pay shows a confirmation before a Mini App can submit a payment from your account. Check the recipient, amount, and asset every time. Reject the request if any detail is unexpected.",
    sourceUrl: "https://nimiq.dev/mini-apps/api-reference/nimiq-provider",
    questions: [
      {
        id: "payment-review",
        prompt: "Which details should you check before approving a NIM payment?",
        options: [
          "Recipient, amount, and asset",
          "Only the page colour",
          "Only the app name"
        ],
        answerIndex: 0,
        explanation: "The recipient, amount, and asset determine what the payment will do."
      },
      {
        id: "unexpected-request",
        prompt: "What should you do when a wallet request is unexpected?",
        options: ["Reject it", "Approve it quickly", "Share your recovery words"],
        answerIndex: 0,
        explanation: "Reject wallet actions you did not intentionally start."
      },
      {
        id: "approval",
        prompt: "Who approves a sensitive action inside Nimiq Pay?",
        options: ["The wallet user", "The Mini App automatically", "Any website visitor"],
        answerIndex: 0,
        explanation: "Nimiq Pay requires the user to confirm sensitive wallet actions."
      }
    ]
  },
  {
    id: "prove-wallet-control",
    title: "Prove Wallet Control",
    track: "security",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand how message signing proves control without sending NIM.",
      "Distinguish a signed message from a payment transaction."
    ],
    lesson:
      "A signed message proves that your wallet approved a specific statement. It does not move NIM. NimQuest uses a short-lived, one-time challenge so the backend can verify wallet control and reject replayed signatures. Read the message before signing it.",
    sourceUrl: "https://nimiq.dev/mini-apps/api-reference/nimiq-provider",
    questions: [
      {
        id: "signing-effect",
        prompt: "What happens when you sign a NimQuest proof message?",
        options: [
          "You prove wallet control without sending NIM",
          "You transfer your full balance",
          "You reveal your private key"
        ],
        answerIndex: 0,
        explanation: "Message signing creates a signature and does not transfer funds."
      },
      {
        id: "read-message",
        prompt: "What should you do before signing a message?",
        options: ["Read and understand it", "Ignore its contents", "Share your recovery words"],
        answerIndex: 0,
        explanation: "Only sign a message whose purpose and contents you understand."
      },
      {
        id: "one-time-challenge",
        prompt: "Why does NimQuest use a one-time challenge?",
        options: [
          "To prevent the same signature from being replayed",
          "To hide the wallet address",
          "To charge a transaction fee"
        ],
        answerIndex: 0,
        explanation: "A consumed or expired challenge cannot be reused for another completion."
      }
    ]
  }
];

export function findQuest(questId) {
  return quests.find((quest) => quest.id === questId);
}

export function publicQuest(quest) {
  return {
    ...quest,
    questions: quest.questions.map(({ answerIndex, ...question }) => question)
  };
}
