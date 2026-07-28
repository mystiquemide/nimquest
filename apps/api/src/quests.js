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
  },
  {
    id: "receive-nim-safely",
    title: "Receive NIM Safely",
    track: "payments",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 60,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Use a public Nimiq address to receive NIM.",
      "Check the account and amount before treating a payment as complete."
    ],
    lesson:
      "Your Nimiq address is public and can be shared with someone who wants to send you NIM. Check that you are showing the address for the account you intend to use. A screenshot or promise is not final proof of payment, so confirm the incoming transfer in your wallet.",
    sourceUrl: "https://wallet.nimiq.com/",
    questions: [
      {
        id: "receive-detail",
        prompt: "What should you share to receive NIM?",
        options: ["Your public Nimiq address", "Your recovery words", "Your private key"],
        answerIndex: 0,
        explanation: "A public Nimiq address is designed to receive funds and can be shared."
      },
      {
        id: "receive-account",
        prompt: "What should you check before sharing an address?",
        options: ["It belongs to the account you want to use", "It matches a stranger’s address", "It contains your password"],
        answerIndex: 0,
        explanation: "Confirm that the address belongs to the intended account before sharing it."
      },
      {
        id: "receive-confirmation",
        prompt: "What confirms that an incoming payment arrived?",
        options: ["The transfer appearing in your wallet", "A sender’s screenshot alone", "A message saying it was sent"],
        answerIndex: 0,
        explanation: "Check the receiving wallet rather than relying only on a screenshot or promise."
      }
    ]
  },
  {
    id: "protect-recovery-access",
    title: "Protect Recovery Access",
    track: "wallet safety",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Treat recovery material as full account access.",
      "Keep independent recovery options in safe locations."
    ],
    lesson:
      "Recovery Words and complete Nimiq Backup Codes can restore control of an account. Anyone who gets them can take the funds. Keep recovery material private, never enter it after following an unexpected link, and maintain a safe recovery option you can still access if your device is lost.",
    sourceUrl: "https://www.nimiq.com/blog/worry-free-backup-codes/",
    questions: [
      {
        id: "recovery-power",
        prompt: "What can complete recovery material allow someone to do?",
        options: ["Take control of the account", "Only view a public address", "Only change the wallet colour"],
        answerIndex: 0,
        explanation: "Recovery material can restore account control and must be protected like the funds."
      },
      {
        id: "recovery-request",
        prompt: "What should you do if an unexpected site asks for your Recovery Words?",
        options: ["Leave without entering them", "Enter them to continue", "Send them to support"],
        answerIndex: 0,
        explanation: "Unexpected recovery requests are unsafe. Leave without revealing the words."
      },
      {
        id: "recovery-loss",
        prompt: "Why keep a safe recovery option?",
        options: ["To regain access if a device is lost", "To make payments public", "To avoid checking wallet requests"],
        answerIndex: 0,
        explanation: "A recovery option helps restore access when the normal device or login method is unavailable."
      }
    ]
  },
  {
    id: "read-wallet-requests",
    title: "Read Wallet Requests",
    track: "wallet safety",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Match every wallet prompt to an action you started.",
      "Reject unclear or unexpected account, signing, and payment requests."
    ],
    lesson:
      "Nimiq Pay shows native approval dialogs for sensitive actions. A Mini App can ask, but it cannot approve for you or access private keys. Read the app origin, action, message, recipient, and amount where relevant. Reject anything you did not intentionally start or do not understand.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [
      {
        id: "request-origin",
        prompt: "When is a wallet request safest to approve?",
        options: ["When it matches an action you intentionally started", "Whenever it appears", "When someone pressures you"],
        answerIndex: 0,
        explanation: "A wallet request should match an action you deliberately started and understand."
      },
      {
        id: "request-control",
        prompt: "Who makes the final approval inside Nimiq Pay?",
        options: ["You", "The Mini App", "The website server"],
        answerIndex: 0,
        explanation: "Nimiq Pay requires your explicit approval for sensitive wallet actions."
      },
      {
        id: "request-unclear",
        prompt: "What should you do with an unclear signing or payment request?",
        options: ["Reject it", "Approve it to see what happens", "Share your recovery words"],
        answerIndex: 0,
        explanation: "Reject requests whose purpose or details you do not understand."
      }
    ]
  },
  {
    id: "understand-mini-app-permissions",
    title: "Mini App Permissions",
    track: "mini apps",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand what a Nimiq Pay Mini App can request.",
      "Distinguish a device identifier from a wallet identity."
    ],
    lesson:
      "Mini Apps run inside a sandbox and request wallet actions through Nimiq Pay. Viewing accounts, signing messages, and sending NIM require native approval. A device identifier is pseudonymous and scoped to the Mini App origin. It identifies the device, not the person or wallet.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [
      {
        id: "permission-private-key",
        prompt: "Can a Mini App directly read your private key?",
        options: ["No", "Yes, after opening", "Yes, when it knows your address"],
        answerIndex: 0,
        explanation: "Mini Apps are sandboxed and Nimiq Pay does not expose private keys to them."
      },
      {
        id: "permission-approval",
        prompt: "Which actions require native approval?",
        options: ["Account access, signing, and payments", "Changing page colour", "Reading public lesson text"],
        answerIndex: 0,
        explanation: "Nimiq Pay mediates sensitive wallet actions through native approval dialogs."
      },
      {
        id: "device-identifier",
        prompt: "What does a Mini App device identifier represent?",
        options: ["A device scoped to that app origin", "A person’s legal identity", "A wallet private key"],
        answerIndex: 0,
        explanation: "The identifier is pseudonymous, origin-scoped, and identifies the device rather than the user."
      }
    ]
  },
  {
    id: "read-transaction-status",
    title: "Read Transaction Status",
    track: "network",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Distinguish a submitted payment from a confirmed transaction.",
      "Use your wallet’s transaction history as the primary status check."
    ],
    lesson:
      "A Nimiq transaction changes blockchain state after the network accepts it. A submitted request can still be pending, so check your wallet history for its current status. Do not resend a payment only because confirmation takes longer than expected.",
    sourceUrl: "https://nimiq.dev/protocol/transactions",
    questions: [
      {
        id: "transaction-confirmed",
        prompt: "Where should you check whether a NIM payment was confirmed?",
        options: ["Your wallet transaction history", "A sender’s typing indicator", "The colour of the website"],
        answerIndex: 0,
        explanation: "Your wallet history reflects the transaction’s network status."
      },
      {
        id: "transaction-pending",
        prompt: "What does a pending transaction mean?",
        options: ["It was submitted but is not final yet", "It definitely failed", "Your private key was exposed"],
        answerIndex: 0,
        explanation: "Pending means the transaction has not reached its final network state yet."
      },
      {
        id: "transaction-repeat",
        prompt: "Should you immediately resend a payment that is still pending?",
        options: ["No, check its status first", "Yes, always", "Only after sharing recovery words"],
        answerIndex: 0,
        explanation: "Resending can create an unintended duplicate payment. Check the original status first."
      }
    ]
  },
  {
    id: "understand-network-fees",
    title: "Understand Network Fees",
    track: "network",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 60,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Recognize a network fee as part of a blockchain transaction.",
      "Review the final amount and fee before approving a payment."
    ],
    lesson:
      "Blockchain transactions can include a network fee. A fee is separate from the amount sent to the recipient and helps the network process the transaction. Review both the payment amount and any displayed fee before approval.",
    sourceUrl: "https://nimiq.dev/protocol/transactions",
    questions: [
      {
        id: "fee-purpose",
        prompt: "What is a network fee attached to?",
        options: ["Processing a blockchain transaction", "Reading a public lesson", "Opening the quest list"],
        answerIndex: 0,
        explanation: "Network fees apply to blockchain transactions rather than ordinary page views."
      },
      {
        id: "fee-recipient",
        prompt: "Is the network fee the same as the amount sent to the recipient?",
        options: ["No", "Yes, always", "Only when receiving NIM"],
        answerIndex: 0,
        explanation: "The payment amount and network fee are separate values."
      },
      {
        id: "fee-review",
        prompt: "What should you review before approving a payment?",
        options: ["The amount and displayed fee", "Only the button colour", "Only your wallet balance"],
        answerIndex: 0,
        explanation: "Review the full payment details, including any fee shown."
      }
    ]
  },
  {
    id: "send-a-cashlink",
    title: "Send a Cashlink",
    track: "payments",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand how a Cashlink helps onboard someone without an address.",
      "Treat an unclaimed Cashlink as access to its temporary funds."
    ],
    lesson:
      "A Nimiq Cashlink places NIM in a temporary account and shares access through a link. It is useful when the recipient does not yet have a Nimiq address. Anyone with an unclaimed link may be able to claim it, so send it through a trusted private channel.",
    sourceUrl: "https://nimiq.com/blog/nimiq-cashlinks",
    questions: [
      {
        id: "cashlink-use",
        prompt: "When is a Cashlink most useful?",
        options: ["When the recipient does not have a Nimiq address", "When publishing recovery words", "When checking a wallet balance"],
        answerIndex: 0,
        explanation: "Cashlinks are designed to help recipients who do not yet have an account address."
      },
      {
        id: "cashlink-access",
        prompt: "How should an unclaimed Cashlink be treated?",
        options: ["Like access to the temporary funds", "Like a public blog post", "Like a wallet password reset"],
        answerIndex: 0,
        explanation: "The link controls access to the temporary account until it is claimed."
      },
      {
        id: "cashlink-channel",
        prompt: "Where should you send a Cashlink?",
        options: ["Through a trusted private channel", "In a public comment", "To anyone who asks"],
        answerIndex: 0,
        explanation: "A private channel reduces the risk of someone else claiming the link."
      }
    ]
  },
  {
    id: "choose-payment-method",
    title: "Choose a Payment Method",
    track: "payments",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 60,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Choose a direct transfer when the recipient address is known.",
      "Choose a Cashlink when onboarding someone without an address."
    ],
    lesson:
      "A direct NIM transfer is the simple choice when you already know the recipient’s address. A Cashlink uses a temporary account and two blockchain transactions, so it is best reserved for someone who does not yet have a Nimiq address.",
    sourceUrl: "https://nimiq.com/blog/nimiq-cashlinks",
    questions: [
      {
        id: "direct-known-address",
        prompt: "What should you use when the recipient’s Nimiq address is known?",
        options: ["A direct transfer", "A public Cashlink", "Your Recovery Words"],
        answerIndex: 0,
        explanation: "A direct transfer avoids the temporary Cashlink account when an address is already known."
      },
      {
        id: "cashlink-new-user",
        prompt: "What can help onboard someone without a Nimiq address?",
        options: ["A Cashlink", "A private key screenshot", "A duplicate payment"],
        answerIndex: 0,
        explanation: "Cashlinks let a new recipient claim funds and create an account."
      },
      {
        id: "cashlink-transactions",
        prompt: "Why is a direct transfer simpler when an address is known?",
        options: ["It avoids the Cashlink’s temporary account", "It reveals the recipient’s keys", "It removes wallet approval"],
        answerIndex: 0,
        explanation: "Cashlinks add a temporary account that is unnecessary for a known recipient."
      }
    ]
  },
  {
    id: "use-a-login-file",
    title: "Use a Login File",
    track: "security",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand that a Login File contains encrypted account access.",
      "Keep both the file and its password protected."
    ],
    lesson:
      "A Nimiq Login File is an encrypted account backup used with its password. It is convenient for signing back in, but losing the file and all other recovery methods can mean losing access. Keep the file in a safe location and use a strong password you can remember.",
    sourceUrl: "https://nimiq.com/blog/the-biggest-release-since-mainnet-launch",
    questions: [
      {
        id: "login-file-role",
        prompt: "What does a Nimiq Login File contain?",
        options: ["Encrypted account access", "A public transaction list only", "A Cashlink recipient address"],
        answerIndex: 0,
        explanation: "The Login File stores encrypted key material used to access the account."
      },
      {
        id: "login-file-password",
        prompt: "What is needed with the Login File?",
        options: ["Its password", "A stranger’s wallet", "A public social post"],
        answerIndex: 0,
        explanation: "The password decrypts the protected Login File."
      },
      {
        id: "login-file-storage",
        prompt: "How should a Login File be stored?",
        options: ["In a safe location", "Only in a temporary browser tab", "Publicly for easy access"],
        answerIndex: 0,
        explanation: "The file is sensitive account material and should be kept safely."
      }
    ]
  },
  {
    id: "separate-backup-codes",
    title: "Separate Backup Codes",
    track: "security",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Store Nimiq Backup Codes on two independent platforms.",
      "Know that one code alone does not reveal partial key material."
    ],
    lesson:
      "Nimiq Backup Codes come as Code A and Code B. Both are required to recover the account. Store each code on a different platform, keep both for yourself, and never place the two codes together. Combined, they grant full account access.",
    sourceUrl: "https://www.nimiq.com/blog/worry-free-backup-codes/",
    questions: [
      {
        id: "backup-code-count",
        prompt: "How many Nimiq Backup Codes are required for recovery?",
        options: ["Both Code A and Code B", "Only either code", "No code"],
        answerIndex: 0,
        explanation: "The complete pair is required to recover the account."
      },
      {
        id: "backup-code-storage",
        prompt: "Where should the two codes be stored?",
        options: ["On two different platforms", "Together in one public note", "With an unknown support account"],
        answerIndex: 0,
        explanation: "Independent storage prevents one compromised platform from exposing the full pair."
      },
      {
        id: "backup-code-owner",
        prompt: "Who should you share the two codes with?",
        options: ["No one", "Any wallet app", "Anyone promising rewards"],
        answerIndex: 0,
        explanation: "The complete pair grants full account access and must remain private."
      }
    ]
  },
  {
    id: "understand-self-custody",
    title: "Understand Self-Custody",
    track: "security",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Recognize that wallet recovery depends on your own backup material.",
      "Maintain more than one safe recovery option."
    ],
    lesson:
      "Self-custody means you control the account keys and recovery options. Nimiq does not keep a server-side copy that support can restore for you. Keep at least one reliable backup, and ideally two independent recovery methods, before relying on the wallet for meaningful funds.",
    sourceUrl: "https://www.nimiq.com/blog/worry-free-backup-codes/",
    questions: [
      {
        id: "custody-control",
        prompt: "Who controls recovery in a self-custody wallet?",
        options: ["The wallet owner", "A bank employee", "A quest website"],
        answerIndex: 0,
        explanation: "Self-custody places key and recovery control with the owner."
      },
      {
        id: "custody-server",
        prompt: "Can Nimiq support restore an account without your recovery material?",
        options: ["No", "Yes, from a server copy", "Yes, from a public address"],
        answerIndex: 0,
        explanation: "There is no server-side recovery copy of your private account material."
      },
      {
        id: "custody-backups",
        prompt: "What reduces the risk of losing access?",
        options: ["Independent recovery options", "Sharing keys publicly", "Using no backup"],
        answerIndex: 0,
        explanation: "Independent backups reduce reliance on one device or recovery method."
      }
    ]
  },
  {
    id: "meet-proof-of-stake",
    title: "Meet Proof of Stake",
    track: "network",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Know that Nimiq uses Proof of Stake.",
      "Understand that validators produce blocks and secure the network."
    ],
    lesson:
      "Nimiq’s Proof-of-Stake network uses validators rather than mining. Validators participate in block production and network consensus. Stake helps determine validator participation, while protocol rules and penalties support honest operation.",
    sourceUrl: "https://nimiq.com/blog/nimiq-proof-of-stake-is-now-live",
    questions: [
      {
        id: "pos-network",
        prompt: "Which consensus system does Nimiq use?",
        options: ["Proof of Stake", "Proof of screenshots", "A bank database"],
        answerIndex: 0,
        explanation: "Nimiq’s current network runs on Proof of Stake."
      },
      {
        id: "pos-validator",
        prompt: "Who participates in producing blocks?",
        options: ["Validators", "Cashlink recipients only", "Website designers"],
        answerIndex: 0,
        explanation: "Validators perform block-production and consensus duties."
      },
      {
        id: "pos-stake",
        prompt: "What helps determine validator participation?",
        options: ["Stake", "Page colour", "Wallet nickname"],
        answerIndex: 0,
        explanation: "Stake is part of how Proof of Stake assigns participation."
      }
    ]
  },
  {
    id: "stake-nim",
    title: "Stake NIM",
    track: "staking",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand that staking helps secure Nimiq.",
      "Know that delegated NIM remains under the owner’s control."
    ],
    lesson:
      "Staking delegates NIM to a validator or staking pool so it can help secure the network. Nimiq staking is non-custodial, so ownership remains with you. Rewards can vary, and validator or pool performance and fees matter.",
    sourceUrl: "https://nimiq.com/blog/nimiq-proof-of-stake-is-now-live",
    questions: [
      {
        id: "stake-purpose",
        prompt: "What does staking help do?",
        options: ["Secure the Nimiq network", "Reveal private keys", "Remove wallet approval"],
        answerIndex: 0,
        explanation: "Staked NIM supports validators and network security."
      },
      {
        id: "stake-ownership",
        prompt: "Who owns delegated NIM?",
        options: ["The staker", "The pool operator", "NimQuest"],
        answerIndex: 0,
        explanation: "Nimiq staking is non-custodial and the staker retains ownership."
      },
      {
        id: "stake-reward",
        prompt: "Are staking rewards guaranteed to be identical across pools?",
        options: ["No", "Yes", "Only on weekends"],
        answerIndex: 0,
        explanation: "Performance, fees, stake, and network conditions can affect rewards."
      }
    ]
  },
  {
    id: "choose-staking-pool",
    title: "Choose a Staking Pool",
    track: "staking",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Compare pool performance, fees, and reliability.",
      "Recognize that distributing stake supports decentralization."
    ],
    lesson:
      "A staking pool handles validator operations for delegators. Compare its fee, performance, reliability, and share of total stake. Spreading stake across capable validators helps avoid too much network influence concentrating in one place.",
    sourceUrl: "https://nimiq.com/blog/nimiq-is-migrating-to-proof-of-stake-what-you-need-to-know",
    questions: [
      {
        id: "pool-compare",
        prompt: "What should you compare between staking pools?",
        options: ["Fees, performance, and reliability", "Only the logo", "Only the pool name"],
        answerIndex: 0,
        explanation: "Pool costs and operational performance affect the staking experience."
      },
      {
        id: "pool-operation",
        prompt: "What does a staking pool handle?",
        options: ["Validator operations", "Your Recovery Words", "Your private messages"],
        answerIndex: 0,
        explanation: "Pools handle the technical validator work for delegators."
      },
      {
        id: "pool-decentralization",
        prompt: "Why consider capable pools with less total stake?",
        options: ["To support decentralization", "To expose private keys", "To avoid all rewards"],
        answerIndex: 0,
        explanation: "A broader distribution of stake reduces concentration."
      }
    ]
  },
  {
    id: "understand-validators",
    title: "Understand Validators",
    track: "staking",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand the validator’s role in block production.",
      "Know that running a validator requires secure keys and reliable infrastructure."
    ],
    lesson:
      "Validators produce blocks and vote in Nimiq consensus. Operating one requires technical setup, secure validator keys, and a machine that stays reliably available. Many users delegate to a staking pool instead of running validator infrastructure themselves.",
    sourceUrl: "https://nimiq.dev/nodes/validators/becoming-a-validator",
    questions: [
      {
        id: "validator-duty",
        prompt: "What is a validator responsible for?",
        options: ["Block production and consensus duties", "Creating Recovery Words for users", "Approving every wallet payment"],
        answerIndex: 0,
        explanation: "Validators participate in producing blocks and network consensus."
      },
      {
        id: "validator-keys",
        prompt: "How should validator private keys be handled?",
        options: ["Stored securely", "Published openly", "Shared with delegators"],
        answerIndex: 0,
        explanation: "Validator keys are sensitive operational credentials."
      },
      {
        id: "validator-alternative",
        prompt: "What can a non-technical holder use instead of running a validator?",
        options: ["A staking pool", "A public private key", "A duplicate wallet request"],
        answerIndex: 0,
        explanation: "Staking pools handle the validator operations for delegators."
      }
    ]
  },
  {
    id: "use-nim-and-bitcoin",
    title: "Use NIM and Bitcoin",
    track: "ecosystem",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 65,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Recognize that NIM and BTC are separate assets.",
      "Review the selected asset and address before sending."
    ],
    lesson:
      "The Nimiq Wallet can display both NIM and Bitcoin accounts. They are separate assets with different address systems. Always confirm which asset you selected and use the matching recipient address before sending.",
    sourceUrl: "https://nimiq.com/blog/wallet-update-atomic-swap-nimiq-and-bitcoin",
    questions: [
      {
        id: "asset-separate",
        prompt: "Are NIM and BTC the same asset?",
        options: ["No", "Yes", "Only inside the wallet"],
        answerIndex: 0,
        explanation: "NIM and Bitcoin are separate assets on different networks."
      },
      {
        id: "asset-address",
        prompt: "What must match before sending?",
        options: ["The selected asset and recipient address type", "The page background", "The wallet nickname only"],
        answerIndex: 0,
        explanation: "Sending to the wrong network or address type can cause loss."
      },
      {
        id: "asset-review",
        prompt: "What should you check in the confirmation?",
        options: ["Asset, recipient, and amount", "Only the icon", "Only the time"],
        answerIndex: 0,
        explanation: "The asset, recipient, and amount define the transfer."
      }
    ]
  },
  {
    id: "understand-atomic-swaps",
    title: "Understand Atomic Swaps",
    track: "ecosystem",
    audience: "new-user",
    difficulty: "starter",
    estimatedSeconds: 70,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Understand the all-or-return property of an atomic swap.",
      "Review the rate and fees before approving a swap."
    ],
    lesson:
      "An atomic swap exchanges assets without one party taking custody of both. The swap is designed to complete for both sides or return the assets. Rates and fees still matter, so review the quote and final amounts before approval.",
    sourceUrl: "https://nimiq.com/blog/wallet-update-atomic-swap-nimiq-and-bitcoin",
    questions: [
      {
        id: "swap-result",
        prompt: "What is the key property of an atomic swap?",
        options: ["Both sides complete or the assets return", "One side always keeps both assets", "No wallet approval is needed"],
        answerIndex: 0,
        explanation: "Atomic swaps are designed to avoid one-sided completion."
      },
      {
        id: "swap-custody",
        prompt: "Does an atomic swap require one party to control both assets?",
        options: ["No", "Yes", "Only for NIM"],
        answerIndex: 0,
        explanation: "The exchange is non-custodial and does not give one party control of both sides."
      },
      {
        id: "swap-review",
        prompt: "What should you review before approving a swap?",
        options: ["Rate, fees, and final amounts", "Only the animation", "Only your account name"],
        answerIndex: 0,
        explanation: "The quote and fees determine what you receive and pay."
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
