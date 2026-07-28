import "./styles.css";
import heroImage from "./assets/nimquest-hero.jpg";
import brandMark from "./assets/nimquest-mark.svg";
import { init } from "@nimiq/mini-app-sdk";
import { catalogQuests } from "./quest-catalog.generated.js";

const questPresentation = [
  {
    id: "meet-nimiq",
    number: "01",
    title: "Meet Nimiq",
    track: "NIM basics",
    duration: "Under 1 min",
    color: "yellow",
    icon: "✦",
    description: "Meet NIM, learn what your address does, and keep your wallet secrets safe.",
    goals: ["Know what NIM is", "Share an address safely", "Protect wallet secrets"],
    lesson:
      "Nimiq is a payment-focused blockchain designed to make crypto simple. NIM is its native asset. Your public address can receive payments, while your private keys must always stay inside your wallet.",
    sourceUrl: "https://nimiq.com/",
    questions: [
      {
        id: "native-asset",
        prompt: "What is the native asset of the Nimiq network?",
        options: ["NIM", "A wallet password", "A bank account number"]
      },
      {
        id: "safe-to-share",
        prompt: "What can you share when someone wants to send you NIM?",
        options: ["Your Nimiq address", "Your private key", "Your recovery words"]
      },
      {
        id: "wallet-role",
        prompt: "What protects the keys that control your NIM?",
        options: ["Your wallet", "A public quest page", "A transaction recipient"]
      }
    ]
  },
  {
    id: "pay-with-nim",
    number: "02",
    title: "Pay with NIM",
    track: "Payments",
    duration: "1 min",
    color: "blue",
    icon: "↗",
    description: "Learn the three details to check before you approve any NIM payment.",
    goals: ["Check payment details", "Spot unexpected requests", "Approve with confidence"],
    lesson:
      "Every NIM payment has a recipient, amount, and asset. Nimiq Pay asks you to approve sensitive wallet actions, giving you a clear moment to review every detail.",
    sourceUrl: "https://nimiq.dev/mini-apps/api-reference/nimiq-provider",
    questions: [
      {
        id: "payment-review",
        prompt: "Which details should you check before approving a NIM payment?",
        options: ["Recipient, amount, and asset", "Only the page colour", "Only the app name"]
      },
      {
        id: "unexpected-request",
        prompt: "What should you do when a wallet request is unexpected?",
        options: ["Reject it", "Approve it quickly", "Share your recovery words"]
      },
      {
        id: "approval",
        prompt: "Who approves a sensitive action inside Nimiq Pay?",
        options: ["The wallet user", "The Mini App automatically", "Any website visitor"]
      }
    ]
  },
  {
    id: "prove-wallet-control",
    number: "03",
    title: "Prove wallet control",
    track: "Wallet safety",
    duration: "1 min",
    color: "violet",
    icon: "✓",
    description: "See how signing proves wallet control without moving any of your NIM.",
    goals: ["Understand message signing", "Tell proof from payment", "Prevent replay"],
    lesson:
      "A signed message proves your wallet approved a specific statement. It doesn't move NIM. NimQuest uses a short-lived, one-time challenge so old signatures can't be replayed.",
    sourceUrl: "https://nimiq.dev/mini-apps/api-reference/nimiq-provider",
    questions: [
      {
        id: "signing-effect",
        prompt: "What happens when you sign a NimQuest proof message?",
        options: [
          "You prove wallet control without sending NIM",
          "You transfer your full balance",
          "You reveal your private key"
        ]
      },
      {
        id: "read-message",
        prompt: "What should you do before signing a message?",
        options: ["Read and understand it", "Ignore its contents", "Share your recovery words"]
      },
      {
        id: "one-time-challenge",
        prompt: "Why does NimQuest use a one-time challenge?",
        options: [
          "To prevent the same signature from being replayed",
          "To hide the wallet address",
          "To charge a transaction fee"
        ]
      }
    ]
  },
  {
    id: "receive-nim-safely",
    number: "04",
    title: "Receive NIM safely",
    track: "Payments",
    duration: "1 min",
    color: "mint",
    icon: "↓",
    description: "Share the right address and confirm an incoming payment in your own wallet.",
    goals: ["Share a public address", "Choose the intended account", "Confirm funds in your wallet"],
    lesson:
      "Your Nimiq address is public and can be shared with someone who wants to send you NIM. Check that you are showing the address for the account you intend to use. A screenshot or promise is not final proof of payment, so confirm the incoming transfer in your wallet.",
    sourceUrl: "https://wallet.nimiq.com/",
    questions: [
      {
        id: "receive-detail",
        prompt: "What should you share to receive NIM?",
        options: ["Your public Nimiq address", "Your recovery words", "Your private key"]
      },
      {
        id: "receive-account",
        prompt: "What should you check before sharing an address?",
        options: ["It belongs to the account you want to use", "It matches a stranger’s address", "It contains your password"]
      },
      {
        id: "receive-confirmation",
        prompt: "What confirms that an incoming payment arrived?",
        options: ["The transfer appearing in your wallet", "A sender’s screenshot alone", "A message saying it was sent"]
      }
    ]
  },
  {
    id: "protect-recovery-access",
    number: "05",
    title: "Protect recovery access",
    track: "Wallet safety",
    duration: "1 min",
    color: "coral",
    icon: "◆",
    description: "Treat recovery material like full account access and keep it away from strangers.",
    goals: ["Know what recovery can do", "Reject unexpected requests", "Keep a safe backup"],
    lesson:
      "Recovery Words and complete Nimiq Backup Codes can restore control of an account. Anyone who gets them can take the funds. Keep recovery material private, never enter it after following an unexpected link, and maintain a safe recovery option you can still access if your device is lost.",
    sourceUrl: "https://www.nimiq.com/blog/worry-free-backup-codes/",
    questions: [
      {
        id: "recovery-power",
        prompt: "What can complete recovery material allow someone to do?",
        options: ["Take control of the account", "Only view a public address", "Only change the wallet colour"]
      },
      {
        id: "recovery-request",
        prompt: "What should you do if an unexpected site asks for your Recovery Words?",
        options: ["Leave without entering them", "Enter them to continue", "Send them to support"]
      },
      {
        id: "recovery-loss",
        prompt: "Why keep a safe recovery option?",
        options: ["To regain access if a device is lost", "To make payments public", "To avoid checking wallet requests"]
      }
    ]
  },
  {
    id: "read-wallet-requests",
    number: "06",
    title: "Read wallet requests",
    track: "Wallet safety",
    duration: "1 min",
    color: "pink",
    icon: "!",
    description: "Match every approval prompt to an action you deliberately started.",
    goals: ["Match prompts to actions", "Read sensitive details", "Reject unclear requests"],
    lesson:
      "Nimiq Pay shows native approval dialogs for sensitive actions. A Mini App can ask, but it cannot approve for you or access private keys. Read the app origin, action, message, recipient, and amount where relevant. Reject anything you did not intentionally start or do not understand.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [
      {
        id: "request-origin",
        prompt: "When is a wallet request safest to approve?",
        options: ["When it matches an action you intentionally started", "Whenever it appears", "When someone pressures you"]
      },
      {
        id: "request-control",
        prompt: "Who makes the final approval inside Nimiq Pay?",
        options: ["You", "The Mini App", "The website server"]
      },
      {
        id: "request-unclear",
        prompt: "What should you do with an unclear signing or payment request?",
        options: ["Reject it", "Approve it to see what happens", "Share your recovery words"]
      }
    ]
  },
  {
    id: "understand-mini-app-permissions",
    number: "07",
    title: "Mini App permissions",
    track: "Mini Apps",
    duration: "1 min",
    color: "blue",
    icon: "◫",
    description: "See what Mini Apps can request and what always stays inside Nimiq Pay.",
    goals: ["Understand the sandbox", "Recognize native approval", "Know what device IDs mean"],
    lesson:
      "Mini Apps run inside a sandbox and request wallet actions through Nimiq Pay. Viewing accounts, signing messages, and sending NIM require native approval. A device identifier is pseudonymous and scoped to the Mini App origin. It identifies the device, not the person or wallet.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [
      {
        id: "permission-private-key",
        prompt: "Can a Mini App directly read your private key?",
        options: ["No", "Yes, after opening", "Yes, when it knows your address"]
      },
      {
        id: "permission-approval",
        prompt: "Which actions require native approval?",
        options: ["Account access, signing, and payments", "Changing page colour", "Reading public lesson text"]
      },
      {
        id: "device-identifier",
        prompt: "What does a Mini App device identifier represent?",
        options: ["A device scoped to that app origin", "A person’s legal identity", "A wallet private key"]
      }
    ]
  }
];

const presentationById = new Map(questPresentation.map((quest) => [quest.id, quest]));
const trackPresentation = {
  onboarding: { label: "NIM basics", color: "yellow", icon: "✦" },
  payments: { label: "Payments", color: "blue", icon: "↗" },
  security: { label: "Wallet safety", color: "violet", icon: "✓" },
  network: { label: "Network", color: "mint", icon: "◎" },
  staking: { label: "Staking", color: "coral", icon: "◇" },
  ecosystem: { label: "Ecosystem", color: "pink", icon: "◫" },
  "mini-apps": { label: "Mini Apps", color: "blue", icon: "◫" }
};

const STARTER_QUEST_ID = "meet-nimiq";
const trackOrder = [
  "onboarding",
  "payments",
  "security",
  "wallet safety",
  "network",
  "staking",
  "mini-apps",
  "mini apps",
  "ecosystem"
];
const trackRank = new Map(trackOrder.map((track, index) => [track, index]));
const quests = [...catalogQuests]
  .sort((a, b) => {
    if (a.id === STARTER_QUEST_ID) return -1;
    if (b.id === STARTER_QUEST_ID) return 1;
    return (trackRank.get(a.track) ?? trackOrder.length) -
      (trackRank.get(b.track) ?? trackOrder.length);
  })
  .map((quest, index) => {
  const existing = presentationById.get(quest.id);
  const track = trackPresentation[quest.track] || trackPresentation.onboarding;
  return {
    ...quest,
    number: String(index + 1).padStart(2, "0"),
    track: existing?.track || track.label,
    duration: `${Math.max(1, Math.round(quest.estimatedSeconds / 60))} min`,
    color: existing?.color || track.color,
    icon: existing?.icon || track.icon,
    description:
      existing?.description ||
      quest.learningGoals[0].replace(/\.$/, ""),
    goals: existing?.goals || quest.learningGoals,
    questions: quest.questions
    };
  });

function getNextQuest(completedQuestIds) {
  const starterQuest = quests.find((quest) => quest.id === STARTER_QUEST_ID);
  if (starterQuest && !completedQuestIds.has(STARTER_QUEST_ID)) {
    return starterQuest;
  }
  return quests.find((quest) => !completedQuestIds.has(quest.id));
}

function renderCurrentRoute() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const questSessionMatch = normalizedPath.match(/^\/quests\/([^/]+)$/);
  const walletProofMatch = normalizedPath.match(/^\/proof\/([^/]+)$/);
  const completionMatch = normalizedPath.match(/^\/completions\/([^/]+)$/);
  const documentationMatch = normalizedPath.match(/^\/docs(?:\/([^/]+))?$/);
  const isJourney = normalizedPath === "/journey";
  const isLeaderboard = normalizedPath === "/leaderboard";
  const isQuestTrail =
    normalizedPath === "/quests" ||
    new URLSearchParams(window.location.search).get("screen") === "quests";

  setDocumentTitle({
    normalizedPath,
    questSessionMatch,
    walletProofMatch,
    completionMatch,
    documentationMatch,
    isJourney,
    isLeaderboard,
    isQuestTrail
  });

  if (completionMatch) {
    renderCompletionDetail(decodeURIComponent(completionMatch[1]));
  } else if (documentationMatch) {
    renderDocumentationPage(documentationMatch[1] || "overview");
  } else if (isLeaderboard) {
    renderLeaderboard();
  } else if (isJourney) {
    renderJourney();
  } else if (normalizedPath === "/privacy") {
    renderLegalPage("privacy");
  } else if (normalizedPath === "/terms") {
    renderLegalPage("terms");
  } else if (walletProofMatch) {
    renderWalletProof(walletProofMatch[1]);
  } else if (questSessionMatch) {
    renderQuestSession(questSessionMatch[1]);
  } else if (isQuestTrail) {
    renderQuestTrail();
  } else if (normalizedPath === "/") {
const questCards = quests
  .slice(0, 6)
  .map(
    (quest) => `
      <article class="quest-card quest-card--${quest.color}" data-quest="${quest.id}">
        <div class="quest-card__top">
          <span class="quest-card__number">${quest.number}</span>
          <span class="quest-card__icon" aria-hidden="true">${quest.icon}</span>
        </div>
        <div>
          <p class="eyebrow">${quest.track}</p>
          <h3>${quest.title}</h3>
          <p>${quest.description}</p>
        </div>
        <div class="quest-card__bottom">
          <span>${quest.duration}</span>
          <button class="text-button" type="button" data-preview="${quest.id}" aria-expanded="false" aria-label="Preview ${quest.title}">
            Preview quest <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div class="quest-preview" id="preview-${quest.id}" hidden>
          <p>${quest.lesson}</p>
          <div class="quest-preview__actions">
            <button class="preview-close" type="button" data-close="${quest.id}" aria-label="Close ${quest.title} preview">Close preview</button>
            <a class="button button--small" href="/quests/${quest.id}" aria-label="Start ${quest.title}">Start quest <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>
    `
  )
  .join("");

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="announcement">
    <span>New to Nimiq?</span>
    <a href="/quests/${STARTER_QUEST_ID}">Take your first 60-second quest <span aria-hidden="true">→</span></a>
  </div>

  <header class="site-header">
    <a class="brand" href="/" aria-label="NimQuest home">
      <span class="brand-mark" aria-hidden="true"><img src="${brandMark}" alt=""></span>
      <span>NimQuest</span>
    </a>

    <nav aria-label="Main navigation">
      <a href="#how">How it works</a>
      <a href="#quests">Quests</a>
      <a href="/leaderboard">Leaderboard</a>
      <a href="/docs">Docs</a>
    </nav>

    <a class="button button--small" href="/quests/${STARTER_QUEST_ID}">Start Meet Nimiq</a>
    <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false">
      <span></span><span></span>
    </button>
  </header>

  <main id="main">
    <section class="hero">
      <div class="hero__copy">
        <p class="eyebrow eyebrow--large">Nimiq onboarding, made active</p>
        <h1>
          Learn Nimiq
          <span class="word-highlight word-highlight--yellow">by doing.</span>
        </h1>
        <p class="hero__lead">
          Complete quick, friendly quests. Learn how NIM works, verify your completion with your wallet, and build a journey you can trust.
        </p>
        <div class="hero__actions">
          <a class="button" href="/quests/${STARTER_QUEST_ID}">Start Meet Nimiq <span aria-hidden="true">→</span></a>
          <a class="button button--quiet" href="#how">See how it works</a>
        </div>
        <div class="hero__proof" aria-label="Product qualities">
          <span><b>${quests.length}</b> starter quests</span>
          <span><b>60s</b> each</span>
          <span><b>0</b> NIM required</span>
        </div>
      </div>

      <div class="hero__visual">
        <div class="shape shape--yellow" aria-hidden="true"></div>
        <div class="shape shape--violet" aria-hidden="true"></div>
        <div class="image-frame">
          <img
            src="${heroImage}"
            alt="A learner working on her laptop in a colourful room"
          />
        </div>
        <div class="floating-card floating-card--top">
          <span class="floating-card__icon">✓</span>
          <span><b>Quest complete</b>Wallet proof verified</span>
        </div>
        <div class="floating-card floating-card--bottom">
          <span class="mini-badge">NIM</span>
          <span><b>Learn safely</b>No payment required</span>
        </div>
        <span class="spark spark--one" aria-hidden="true">✦</span>
        <span class="spark spark--two" aria-hidden="true">✦</span>
      </div>
    </section>

    <section class="intro-card" aria-label="NimQuest promise">
      <p>
        NimQuest turns Nimiq onboarding into a clear trail of small wins.
        <strong>Learn one thing, prove it, then keep moving.</strong>
      </p>
      <a href="#quests">Explore the trail <span aria-hidden="true">↓</span></a>
    </section>

    <section class="section how" id="how">
      <div class="section-heading">
        <p class="eyebrow">A simple learning loop</p>
        <h2>From curious to confident in <span class="word-highlight word-highlight--pink">three steps.</span></h2>
        <p>No long manuals. Each quest gives you one useful idea and one clear action.</p>
      </div>

      <div class="trail" id="trail">
        <div class="trail__line" aria-hidden="true"></div>
        <article class="step step--one">
          <span class="step__marker">1</span>
          <div class="step__icon">◫</div>
          <h3>Learn</h3>
          <p>Read one short lesson focused on a useful Nimiq skill.</p>
        </article>
        <article class="step step--two">
          <span class="step__marker">2</span>
          <div class="step__icon">?</div>
          <h3>Prove</h3>
          <p>Answer a few questions, then sign a one-time wallet message.</p>
        </article>
        <article class="step step--three">
          <span class="step__marker">3</span>
          <div class="step__icon">✦</div>
          <h3>Grow</h3>
          <p>Keep your verified proof and move to the next useful skill.</p>
        </article>
      </div>
    </section>

    <section class="section quests" id="quests">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">Your first trail</p>
          <h2>Start with what <span class="word-highlight word-highlight--blue">matters.</span></h2>
        </div>
        <p>Six featured quests give you a quick start. The full trail contains 20 wallet-verifiable Nimiq skills.</p>
      </div>
      <div class="quest-grid">${questCards}</div>
      <p class="quest-note"><span aria-hidden="true">✦</span> Every quest is free. No NIM payment is required to learn or create a completion proof.</p>
    </section>

    <section class="section safety" id="safety">
      <div class="safety__visual">
        <span class="orbit orbit--one" aria-hidden="true"></span>
        <span class="orbit orbit--two" aria-hidden="true"></span>
        <div class="proof-card">
          <div class="proof-card__head">
            <span class="proof-card__seal">✓</span>
            <span>Completion proof</span>
            <span class="status">Verified</span>
          </div>
          <div class="proof-card__body">
            <p>QUEST 01</p>
            <h3>Meet Nimiq</h3>
            <div class="proof-row"><span>Method</span><b>Signed message</b></div>
            <div class="proof-row"><span>Payment</span><b>None</b></div>
            <div class="proof-row"><span>Private keys</span><b>Stay in wallet</b></div>
          </div>
        </div>
      </div>
      <div class="safety__copy">
        <p class="eyebrow">Wallet proof, explained</p>
        <h2>Prove progress without <span class="word-highlight word-highlight--yellow">moving your NIM.</span></h2>
        <p>
          NimQuest uses a short-lived message for wallet proof. Signing confirms that you control the wallet. It doesn’t send a payment or expose your private key.
        </p>
        <ul>
          <li><span>✓</span> Read every message before signing</li>
          <li><span>✓</span> One-time challenges prevent replay</li>
          <li><span>✓</span> Sensitive actions need your approval</li>
        </ul>
        <a class="text-link" href="/quests/prove-wallet-control">Try the wallet safety quest <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="final-cta">
      <span class="final-cta__spark final-cta__spark--one" aria-hidden="true">✦</span>
      <span class="final-cta__spark final-cta__spark--two" aria-hidden="true">✦</span>
      <p class="eyebrow">Your first quest is ready</p>
      <h2>One minute can make Nimiq <span>click.</span></h2>
      <p>Start with the basics, keep your wallet safe, and leave with proof you earned.</p>
      <a class="button button--dark" href="/quests/${STARTER_QUEST_ID}">Start Meet Nimiq <span aria-hidden="true">→</span></a>
    </section>
  </main>

  <footer>
    <a class="brand brand--footer" href="/">
      ${brandMarkup()}
    </a>
    <p>Learn Nimiq by doing.</p>
    <div class="footer-links">
      <a href="https://nimiq.com/" target="_blank" rel="noreferrer">Nimiq</a>
      <a href="/quests">Quest Trail</a>
      <a href="/journey">My Journey</a>
      <a href="/leaderboard">Leaderboard</a>
      <a href="/docs">Docs</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="https://github.com/mystiquemide/nimquest" target="_blank" rel="noreferrer">GitHub</a>
    </div>
    <p class="photo-credit">
      Image reference <a href="https://unsplash.com/photos/2WG4jpv0WDY" target="_blank" rel="noreferrer">[1]</a>
      · <a href="https://unsplash.com/@nazinamari" target="_blank" rel="noreferrer">Marina Nazina</a>, Unsplash
    </p>
  </footer>
`;

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("nav--open", !isOpen);
});

navigation.addEventListener("click", () => {
  navigation.classList.remove("nav--open");
  menuButton.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-preview]").forEach((button) => {
  button.addEventListener("click", () => {
    const questId = button.dataset.preview;
    const preview = document.querySelector(`#preview-${questId}`);
    const willOpen = preview.hidden;

    document.querySelectorAll(".quest-preview").forEach((item) => {
      item.hidden = true;
    });
    document.querySelectorAll("[data-preview]").forEach((item) => {
      item.setAttribute("aria-expanded", "false");
    });

    preview.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const questId = button.dataset.close;
    document.querySelector(`#preview-${questId}`).hidden = true;
    document.querySelector(`[data-preview="${questId}"]`).setAttribute("aria-expanded", "false");
  });
});
  } else {
    renderNotFound();
  }
}

function installConnectivityBanner() {
  const banner = document.createElement("div");
  banner.className = "connectivity-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML = `<span>You’re offline. Saved lessons still work, but grading, proof, sync, and shared receipts need a connection.</span><button type="button">Retry</button>`;
  banner.querySelector("button").addEventListener("click", () => window.location.reload());
  document.body.append(banner);

  const update = () => {
    banner.classList.toggle("is-visible", !navigator.onLine);
  };
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

function brandMarkup() {
  return `
    <span class="brand-mark" aria-hidden="true"><img src="${brandMark}" alt=""></span>
    <span>NimQuest</span>
  `;
}

const badgeDefinitions = [
  {
    id: "first-proof",
    name: "First Proof",
    description: "Verify any quest with your wallet.",
    icon: "✦",
    unlock: (completed) => completed.size >= 1
  },
  {
    id: "payment-ready",
    name: "Payment Ready",
    description: "Verify the four payment quests.",
    icon: "↗",
    unlock: (completed) =>
      ["pay-with-nim", "receive-nim-safely", "send-a-cashlink", "choose-payment-method"].every(
        (id) => completed.has(id)
      )
  },
  {
    id: "wallet-guard",
    name: "Wallet Guard",
    description: "Verify the six wallet-safety quests.",
    icon: "◆",
    unlock: (completed) =>
      [
        "prove-wallet-control",
        "protect-recovery-access",
        "read-wallet-requests",
        "use-a-login-file",
        "separate-backup-codes",
        "understand-self-custody"
      ].every((id) => completed.has(id))
  },
  {
    id: "network-aware",
    name: "Network Aware",
    description: "Verify transaction, fee, and Proof-of-Stake basics.",
    icon: "◎",
    unlock: (completed) =>
      ["read-transaction-status", "understand-network-fees", "meet-proof-of-stake"].every((id) =>
        completed.has(id)
      )
  },
  {
    id: "staking-ready",
    name: "Staking Ready",
    description: "Verify all three staking quests.",
    icon: "◇",
    unlock: (completed) =>
      ["stake-nim", "choose-staking-pool", "understand-validators"].every((id) => completed.has(id))
  },
  {
    id: "ecosystem-explorer",
    name: "Ecosystem Explorer",
    description: "Verify NIM, Bitcoin, and atomic swap basics.",
    icon: "◫",
    unlock: (completed) =>
      ["use-nim-and-bitcoin", "understand-atomic-swaps"].every((id) => completed.has(id))
  },
  {
    id: "mini-app-ready",
    name: "Mini App Ready",
    description: "Verify the Mini App permissions quest.",
    icon: "◫",
    unlock: (completed) => completed.has("understand-mini-app-permissions")
  },
  {
    id: "trail-complete",
    name: "Trail Complete",
    description: "Verify all 20 starter quests.",
    icon: "✓",
    unlock: (completed) => completed.size === quests.length
  }
];

function getBadgeStates(completionByQuest) {
  const completed = new Set(completionByQuest.keys());
  return badgeDefinitions.map((badge) => ({
    ...badge,
    unlocked: badge.unlock(completed)
  }));
}

function badgeGridMarkup(completionByQuest) {
  return getBadgeStates(completionByQuest)
    .map(
      (badge) => `
        <article class="achievement ${badge.unlocked ? "is-unlocked" : ""}">
          <span class="achievement__mark" aria-hidden="true">${badge.unlocked ? badge.icon : "·"}</span>
          <div>
            <p>${badge.unlocked ? "Verified badge" : "Locked badge"}</p>
            <h3>${badge.name}</h3>
            <span>${badge.description}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function setDocumentTitle({
  normalizedPath,
  questSessionMatch,
  walletProofMatch,
  completionMatch,
  documentationMatch,
  isJourney,
  isLeaderboard,
  isQuestTrail
}) {
  const questId = questSessionMatch?.[1] || walletProofMatch?.[1];
  const quest = questId ? quests.find((item) => item.id === questId) : null;
  const documentationTitles = {
    overview: "Documentation",
    architecture: "Architecture",
    integration: "Nimiq Pay Integration",
    security: "Security and Privacy",
    setup: "Local Setup"
  };

  let title = "Learn Nimiq by Doing";
  if (completionMatch) title = "Completion Receipt";
  else if (documentationMatch) {
    title = documentationTitles[documentationMatch[1] || "overview"] || "Documentation";
  } else if (isLeaderboard) title = "Leaderboard";
  else if (isJourney) title = "My Journey";
  else if (normalizedPath === "/privacy") title = "Privacy Notice";
  else if (normalizedPath === "/terms") title = "Terms of Use";
  else if (walletProofMatch) title = quest ? `${quest.title} Wallet Proof` : "Wallet Proof";
  else if (questSessionMatch) title = quest?.title || "Quest Unavailable";
  else if (isQuestTrail) title = "Quest Trail";
  else if (normalizedPath !== "/") title = "Page Not Found";

  document.title = `${title} | NimQuest`;
}

function renderNotFound() {
  document.querySelector("#app").innerHTML = `
    <main class="session-not-found">
      <a class="brand not-found-brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <span class="session-not-found__mark">404</span>
      <p class="eyebrow">Trail marker missing</p>
      <h1>This path ends here.</h1>
      <p>The link may be old or incomplete. Return to the verified quest trail and keep moving.</p>
      <div class="not-found-actions">
        <a class="button" href="/quests">Open Quest Trail</a>
        <a class="button button--quiet" href="/">Back home</a>
      </div>
    </main>
  `;
}

function renderQuestTrail() {
  const completions = readVerifiedCompletions();
  const completionByQuest = new Map(completions.map((proof) => [proof.questId, proof]));
  const completedQuestIds = new Set(completionByQuest.keys());
  const completedCount = completedQuestIds.size;
  const recommendedQuest = getNextQuest(completedQuestIds);
  const trailCards = quests
    .map(
      (quest, index) => `
        ${
          index === 0 || quests[index - 1].track !== quest.track
            ? `<div class="quest-path__heading"><span>${quest.track}</span><b>${quests.filter((item) => item.track === quest.track).length} quests</b></div>`
            : ""
        }
        <article class="trail-card trail-card--${quest.color} ${completedQuestIds.has(quest.id) ? "is-complete" : ""}" data-track="${quest.track.toLowerCase()}">
          <div class="trail-card__marker" aria-hidden="true">
            <span>${index + 1}</span>
          </div>
          <div class="trail-card__body">
            <div class="trail-card__meta">
              <span class="availability"><i></i> ${completedQuestIds.has(quest.id) ? "Verified" : "Available now"}</span>
              <span>${quest.duration}</span>
            </div>
            <div class="trail-card__title">
              <span class="trail-card__icon" aria-hidden="true">${quest.icon}</span>
              <div>
                <p class="eyebrow">${quest.track}</p>
                <h2>${quest.title}</h2>
              </div>
            </div>
            <p class="trail-card__description">${quest.description}</p>
            <div class="trail-card__footer">
              <span>3 quick questions</span>
              <a class="trail-action" href="/quests/${quest.id}" aria-label="${completedQuestIds.has(quest.id) ? "Review" : "Start"} ${quest.title}">
                ${completedQuestIds.has(quest.id) ? "Review quest" : "Start quest"} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#quest-list">Skip to quests</a>

    <header class="app-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <div class="app-header__trail" aria-label="${completedCount} of ${quests.length} quests complete">
        <span class="app-header__trail-meter"><i style="width: ${(completedCount / quests.length) * 100}%"></i></span>
        <b>${completedCount} of ${quests.length} complete</b>
      </div>
      <a class="back-link" href="/"><span aria-hidden="true">←</span> Back home</a>
    </header>

    <main class="trail-page">
      <section class="trail-hero">
        <div class="trail-hero__copy">
          <p class="eyebrow eyebrow--large">Your Nimiq Quest Trail</p>
          <h1>Pick a skill.<br><span class="word-highlight word-highlight--yellow">Start moving.</span></h1>
          <p>Twenty short quests cover NIM basics, payments, wallet safety, network concepts, staking, and Mini Apps. Start anywhere, or follow the trail in order.</p>
        </div>
        <aside class="journey-ticket" aria-label="Current journey status">
          <div class="journey-ticket__top">
            <span>YOUR JOURNEY</span>
            <span class="ticket-star">✦</span>
          </div>
          <div class="journey-ticket__score">
            <strong>${completedCount}<span>/${quests.length}</span></strong>
            <p>verified quests</p>
          </div>
          <div class="journey-ticket__bar"><span style="width: ${(completedCount / quests.length) * 100}%"></span></div>
          <p>${completedCount ? "Your verified trail is taking shape." : "Choose your first quest to begin."}</p>
        </aside>
      </section>

      <section class="quest-browser" id="quest-list">
        <div class="quest-browser__top">
          <div>
            <p class="eyebrow">Starter path</p>
            <h2>Twenty skills worth knowing.</h2>
          </div>
          <div class="quest-filters" aria-label="Filter quests">
            <button class="filter-chip is-active" type="button" data-filter="all" aria-pressed="true">All</button>
            <button class="filter-chip" type="button" data-filter="nim basics" aria-pressed="false">Basics</button>
            <button class="filter-chip" type="button" data-filter="payments" aria-pressed="false">Payments</button>
            <button class="filter-chip" type="button" data-filter="wallet safety" aria-pressed="false">Safety</button>
            <button class="filter-chip" type="button" data-filter="network" aria-pressed="false">Network</button>
            <button class="filter-chip" type="button" data-filter="staking" aria-pressed="false">Staking</button>
            <button class="filter-chip" type="button" data-filter="ecosystem" aria-pressed="false">Ecosystem</button>
            <button class="filter-chip" type="button" data-filter="mini apps" aria-pressed="false">Mini Apps</button>
          </div>
        </div>

        ${
          recommendedQuest
            ? `<aside class="recommendation-card">
                <span class="recommendation-card__mark" aria-hidden="true">${recommendedQuest.icon}</span>
                <div>
                  <p class="eyebrow">Recommended next</p>
                  <h3>${recommendedQuest.title}</h3>
                  <p>${completedCount ? "This is the next missing skill in your verified trail." : "Start here for the clearest introduction to Nimiq."}</p>
                </div>
                <a class="button button--small" href="/quests/${recommendedQuest.id}">Start quest <span aria-hidden="true">→</span></a>
              </aside>`
            : `<aside class="recommendation-card recommendation-card--complete">
                <span class="recommendation-card__mark" aria-hidden="true">✓</span>
                <div><p class="eyebrow">Trail complete</p><h3>All 20 quests are verified.</h3><p>Your starter trail is complete and every badge is available.</p></div>
                <a class="button button--small" href="/journey">View Journey</a>
              </aside>`
        }

        <div class="quest-path">
          <div class="quest-path__line" aria-hidden="true"></div>
          ${trailCards}
        </div>
      </section>

      <section class="badge-section" aria-labelledby="trail-badges-title">
        <div class="section-heading section-heading--split">
          <div><p class="eyebrow">Proof-backed achievements</p><h2 id="trail-badges-title">Badges you actually earn.</h2></div>
          <p>Each badge unlocks only when the required quests have verified wallet proofs.</p>
        </div>
        <div class="achievement-grid">${badgeGridMarkup(completionByQuest)}</div>
      </section>

      <section class="trail-help">
        <div class="trail-help__icon" aria-hidden="true">?</div>
        <div>
          <p class="eyebrow">New to wallets?</p>
          <h2>You can learn without paying.</h2>
          <p>Every lesson is free. Wallet signing comes after the quiz and proves control without moving NIM.</p>
        </div>
        <a class="button button--quiet" href="/#safety">How wallet proof works</a>
      </section>
    </main>

  `;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((chip) => {
        const active = chip === button;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
      });
      document.querySelectorAll(".trail-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.track !== filter;
      });
    });
  });
}

function renderQuestSession(questId) {
  const quest = quests.find((item) => item.id === questId);
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || (isLocalPreview ? "http://localhost:8787" : "");

  if (!quest) {
    document.querySelector("#app").innerHTML = `
      <main class="session-not-found">
        <span class="session-not-found__mark">?</span>
        <p class="eyebrow">Trail marker missing</p>
        <h1>That quest isn’t here.</h1>
        <p>Choose one of the 20 available quests and keep moving.</p>
        <a class="button" href="/quests">Return to Quest Trail</a>
      </main>
    `;
    return;
  }

  const savedDraft = readQuestDraft(quest);
  const state = savedDraft || {
    step: "lesson",
    questionIndex: 0,
    answers: Array(quest.questions.length).fill(null)
  };
  state.grading = false;
  state.gradeResult = null;
  state.gradeError = null;
  if (
    !Array.isArray(state.optionOrder) ||
    state.optionOrder.length !== quest.questions.length
  ) {
    state.optionOrder = quest.questions.map((question) =>
      shuffledIndices(question.options.length)
    );
  }

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#session-content">Skip to quest</a>

    <header class="app-header session-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <div class="session-header__context">
        <span class="session-header__quest">${quest.number}</span>
        <span><b>${quest.title}</b>${quest.duration}</span>
      </div>
      <a class="back-link" href="/quests"><span aria-hidden="true">←</span> Quest Trail</a>
    </header>

    <main class="session-page" id="session-content">
      <aside class="session-map" aria-label="Quest progress">
        <div class="session-map__top">
          <p class="eyebrow">Quest ${quest.number}</p>
          <h2>${quest.title}</h2>
          <p>${quest.description}</p>
        </div>
        <ol class="session-steps">
          <li class="is-active" data-session-marker="lesson">
            <span>1</span>
            <div><b>Learn</b><small>One useful idea</small></div>
          </li>
          <li data-session-marker="quiz">
            <span>2</span>
            <div><b>Answer</b><small>Three quick questions</small></div>
          </li>
          <li data-session-marker="review">
            <span>3</span>
            <div><b>Review</b><small>Check before proof</small></div>
          </li>
        </ol>
        <div class="session-map__safety">
          <span aria-hidden="true">✦</span>
          <p><b>No NIM required</b>This quest never asks for a payment.</p>
        </div>
      </aside>

      <section class="session-stage" aria-live="polite"></section>
    </main>
  `;

  const stage = document.querySelector(".session-stage");

  function updateMarkers() {
    const order = ["lesson", "quiz", "review"];
    const current = order.indexOf(state.step);
    document.querySelectorAll("[data-session-marker]").forEach((marker, index) => {
      marker.classList.toggle("is-active", index === current);
      marker.classList.toggle("is-done", index < current);
    });
  }

  function renderLesson() {
    state.step = "lesson";
    saveQuestDraft(quest.id, state);
    updateMarkers();
    stage.innerHTML = `
      <div class="session-progress">
        <span>Lesson</span>
        <div><i style="width: 20%"></i></div>
        <b>1 of 3</b>
      </div>

      <article class="lesson-panel lesson-panel--${quest.color}">
        <div class="lesson-panel__top">
          <span class="lesson-panel__icon" aria-hidden="true">${quest.icon}</span>
          <div>
            <p class="eyebrow">${quest.track}</p>
            <h1>${quest.title}</h1>
          </div>
        </div>

        <p class="lesson-panel__lead">${quest.lesson}</p>

        <div class="lesson-takeaways">
          <p>Keep these three things</p>
          <div>
            ${quest.goals
              .map(
                (goal, index) => `
                  <article>
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    <p>${goal}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>

      </article>

      <div class="session-actions">
        <a class="session-exit" href="/quests">Save and return to Trail</a>
        <button class="button" type="button" data-begin-quiz>
          Begin 3 questions <span aria-hidden="true">→</span>
        </button>
      </div>
    `;

    stage.querySelector("[data-begin-quiz]").addEventListener("click", () => {
      state.step = "quiz";
      state.questionIndex = state.answers.findIndex((answer) => answer === null);
      if (state.questionIndex === -1) {
        state.questionIndex = 0;
      }
      saveQuestDraft(quest.id, state);
      renderQuestion();
    });
  }

  function renderQuestion() {
    state.step = "quiz";
    saveQuestDraft(quest.id, state);
    updateMarkers();
    const question = quest.questions[state.questionIndex];
    const selected = state.answers[state.questionIndex];
    const progress = 36 + state.questionIndex * 17;

    stage.innerHTML = `
      <div class="session-progress">
        <span>Question ${state.questionIndex + 1}</span>
        <div><i style="width: ${progress}%"></i></div>
        <b>${state.questionIndex + 1} of ${quest.questions.length}</b>
      </div>

      <article class="question-panel">
        <div class="question-panel__count">${String(state.questionIndex + 1).padStart(2, "0")}</div>
        <p class="eyebrow">Choose one answer</p>
        <h1>${question.prompt}</h1>
        <div class="answer-list" role="radiogroup" aria-label="${question.prompt}">
          ${state.optionOrder[state.questionIndex]
            .map(
              (originalIndex, displayIndex) => `
                <button
                  class="answer-option ${selected === originalIndex ? "is-selected" : ""}"
                  type="button"
                  role="radio"
                  aria-checked="${selected === originalIndex}"
                  data-answer="${originalIndex}"
                >
                  <span>${String.fromCharCode(65 + displayIndex)}</span>
                  <b>${question.options[originalIndex]}</b>
                  <i aria-hidden="true">✓</i>
                </button>
              `
            )
            .join("")}
        </div>
        <p class="question-panel__truth">Answers are checked by NimQuest’s backend before wallet proof. Correct answers aren’t stored in this page.</p>
      </article>

      <div class="session-actions">
        <button class="session-exit" type="button" data-previous>
          ${state.questionIndex === 0 ? "Back to lesson" : "Previous question"}
        </button>
        <button class="button" type="button" data-next ${selected === null ? "disabled" : ""}>
          ${state.questionIndex === quest.questions.length - 1 ? "Review answers" : "Next question"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    `;

    stage.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        state.answers[state.questionIndex] = Number(button.dataset.answer);
        saveQuestDraft(quest.id, state);
        stage.querySelectorAll("[data-answer]").forEach((option) => {
          const selectedOption = option === button;
          option.classList.toggle("is-selected", selectedOption);
          option.setAttribute("aria-checked", String(selectedOption));
        });
        stage.querySelector("[data-next]").disabled = false;
      });
    });

    stage.querySelector("[data-previous]").addEventListener("click", () => {
      if (state.questionIndex === 0) {
        renderLesson();
        return;
      }
      state.questionIndex -= 1;
      renderQuestion();
    });

    stage.querySelector("[data-next]").addEventListener("click", () => {
      if (state.questionIndex < quest.questions.length - 1) {
        state.questionIndex += 1;
        renderQuestion();
        return;
      }
      renderReview();
    });
  }

  function renderReview() {
    state.step = "review";
    saveQuestDraft(quest.id, state);
    updateMarkers();
    const passed = state.gradeResult?.passed === true;
    const failed = state.gradeResult?.passed === false;
    const feedbackByQuestion = new Map(
      (state.gradeResult?.feedback || []).map((item) => [item.questionId, item])
    );

    stage.innerHTML = `
      <div class="session-progress">
        <span>${passed ? "Quiz passed" : failed ? "Answer correction" : "Answer review"}</span>
        <div><i style="width: ${passed ? "100" : "86"}%"></i></div>
        <b>3 of 3</b>
      </div>

      <article class="review-panel ${failed ? "review-panel--needs-work" : ""}">
        <div class="review-panel__stamp ${failed ? "review-panel__stamp--retry" : ""}" aria-hidden="true">${failed ? "!" : "✓"}</div>
        <p class="eyebrow">${passed ? "Ready for proof" : failed ? `${state.gradeResult.score} of ${state.gradeResult.total} correct` : "Final answer check"}</p>
        <h1>${passed ? "You passed the quiz." : failed ? "A few answers need another look." : "Check your answers before wallet proof."}</h1>
        <p class="review-panel__lead">${
          passed
            ? "Your answers passed the backend check. You can now create a wallet-signed completion proof."
            : failed
              ? "NimQuest marked the questions to revisit. Your wallet hasn’t been opened and nothing has been signed."
              : "NimQuest checks the quiz first. Wallet access is requested only after every answer passes."
        }</p>
        <ol class="review-list">
          ${quest.questions
            .map((question, index) => {
              const feedback = feedbackByQuestion.get(question.id);
              const needsWork = feedback && !feedback.correct;
              return `
                <li class="${needsWork ? "needs-work" : feedback?.correct ? "is-correct" : ""}">
                  <span>${index + 1}</span>
                  <div>
                    <small>${question.prompt}</small>
                    <b>${question.options[state.answers[index]]}</b>
                    ${
                      feedback?.correct
                        ? `<p>${escapeHtml(feedback.explanation)}</p>`
                        : needsWork
                          ? `<p class="review-hint">Not quite. Revisit the lesson and pick again. NimQuest doesn’t reveal the answer.</p>`
                          : ""
                    }
                  </div>
                  ${
                    passed || !failed || needsWork
                      ? `<button type="button" data-edit="${index}">${needsWork ? "Fix answer" : "Edit"}</button>`
                      : `<span class="review-list__status" aria-label="Correct answer">✓</span>`
                  }
                </li>
              `;
            })
            .join("")}
        </ol>
        ${
          passed
            ? `<div class="review-proof-note">
                <span aria-hidden="true">✦</span>
                <p><b>Next: wallet proof</b>Signing proves wallet control. It doesn’t send NIM or reveal your private key.</p>
              </div>`
            : state.gradeError
              ? `<div class="review-grade-error" role="alert">
                  <b>Answer check unavailable</b>
                  <span>${escapeHtml(state.gradeError)}</span>
                </div>`
              : ""
        }
      </article>

      <div class="session-actions">
        <button class="session-exit" type="button" data-back-question>Back to questions</button>
        <button class="button" type="button" ${state.grading ? "disabled" : ""} ${passed ? "data-continue-proof" : "data-check-answers"}>
          ${state.grading ? "Checking answers…" : passed ? "Continue to wallet proof" : failed ? "Check corrected answers" : "Check my answers"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    `;

    stage.querySelectorAll("[data-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        state.questionIndex = Number(button.dataset.edit);
        state.gradeResult = null;
        state.gradeError = null;
        renderQuestion();
      });
    });
    stage.querySelector("[data-back-question]").addEventListener("click", () => {
      state.questionIndex = quest.questions.length - 1;
      renderQuestion();
    });
    const continueButton = stage.querySelector("[data-continue-proof]");
    if (continueButton) {
      continueButton.addEventListener("click", () => {
        sessionStorage.setItem(
          `nimquest:proof:${quest.id}`,
          JSON.stringify({
            questId: quest.id,
            answers: state.answers,
            gradedAt: new Date().toISOString(),
            savedAt: new Date().toISOString()
          })
        );
        sessionStorage.removeItem(`nimquest:draft:${quest.id}`);
        window.location.assign(`/proof/${quest.id}`);
      });
    }

    const checkButton = stage.querySelector("[data-check-answers]");
    if (checkButton) {
      checkButton.addEventListener("click", checkAnswers);
    }
  }

  async function checkAnswers() {
    state.grading = true;
    state.gradeError = null;
    renderReview();

    try {
      const response = await fetch(`${apiBase}/api/grade`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questId: quest.id,
          answers: state.answers
        })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "NimQuest couldn’t check these answers.");
      }

      state.gradeResult = result;
    } catch (error) {
      state.gradeError =
        error instanceof Error
          ? error.message
          : "Check your connection and try the answer check again.";
    } finally {
      state.grading = false;
      renderReview();
    }
  }

  if (state.step === "review") {
    renderReview();
  } else if (state.step === "quiz") {
    renderQuestion();
  } else {
    renderLesson();
  }
}

function renderWalletProof(questId) {
  const quest = quests.find((item) => item.id === questId);
  const stored = readProofSession(questId);
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || (isLocalPreview ? "http://localhost:8787" : "");
  const state = {
    phase: "ready",
    account: null,
    blockHeight: null,
    error: null,
    proof: null,
    feedbackToken: null
  };

  if (!quest) {
    document.querySelector("#app").innerHTML = `
      <main class="session-not-found">
        <span class="session-not-found__mark">?</span>
        <p class="eyebrow">Proof marker missing</p>
        <h1>This proof link is incomplete or unavailable.</h1>
        <p>Choose an available quest and complete its questions first.</p>
        <a class="button" href="/quests">Return to Quest Trail</a>
      </main>
    `;
    return;
  }

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#proof-content">Skip to wallet proof</a>

    <header class="app-header proof-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <div class="proof-header__progress" aria-label="Quest progress">
        <span class="is-done">Learn</span>
        <i></i>
        <span class="is-done">Answer</span>
        <i></i>
        <span class="is-active">Prove</span>
      </div>
      <a class="back-link" href="/quests/${quest.id}"><span aria-hidden="true">←</span> Back to quest</a>
    </header>

    <main class="proof-page" id="proof-content">
      <section class="proof-intro">
        <div class="proof-intro__copy">
          <p class="eyebrow eyebrow--large">Final step · Quest ${quest.number}</p>
          <h1>Turn your learning into <span class="word-highlight word-highlight--yellow">wallet proof.</span></h1>
          <p>Connect Nimiq Pay and approve one clear message. Your wallet signs the completion, NimQuest verifies it, and no NIM moves.</p>

          <div class="proof-promises" aria-label="Wallet proof guarantees">
            <span><i>0</i><b>NIM sent</b></span>
            <span><i>1</i><b>message signed</b></span>
            <span><i>5</i><b>minute expiry</b></span>
          </div>
        </div>

        <aside class="wallet-ticket wallet-ticket--${quest.color}" aria-label="Quest ready for proof">
          <div class="wallet-ticket__top">
            <span>QUEST READY</span>
            <span class="wallet-ticket__mark" aria-hidden="true">${quest.icon}</span>
          </div>
          <p class="eyebrow">${quest.track}</p>
          <h2>${quest.title}</h2>
          <div class="wallet-ticket__score">
            <span>Quiz answers</span>
            <b>${stored ? "3 of 3 ready" : "Not saved"}</b>
          </div>
          <div class="wallet-ticket__line"></div>
          <p><span aria-hidden="true">✓</span> Signing proves wallet control. It never reveals your private key.</p>
        </aside>
      </section>

      <section class="wallet-gate" aria-live="polite"></section>
    </main>
  `;

  const gate = document.querySelector(".wallet-gate");

  function renderGate() {
    if (!stored) {
      gate.innerHTML = `
        <div class="wallet-gate__icon wallet-gate__icon--warning" aria-hidden="true">!</div>
        <div class="wallet-gate__content">
          <p class="eyebrow">Quiz required</p>
          <h2>Finish the quest first.</h2>
          <p>Your answers stay in this browser session until you’re ready to sign.</p>
        </div>
        <a class="button" href="/quests/${quest.id}">Return to quest</a>
      `;
      return;
    }

    if (state.phase === "connecting" || state.phase === "signing" || state.phase === "verifying") {
      const copy = {
        connecting: ["Opening Nimiq Pay", "Choose the wallet you want attached to this proof."],
        signing: ["Review the message", "Nimiq Pay will show the exact one-time completion statement."],
        verifying: ["Verifying your proof", "Checking the signature and saving this completion securely."]
      }[state.phase];

      gate.innerHTML = `
        <div class="wallet-loader" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="wallet-gate__content">
          <p class="eyebrow">One moment</p>
          <h2>${copy[0]}…</h2>
          <p>${copy[1]}</p>
        </div>
        <button class="button" type="button" disabled>Waiting for approval</button>
      `;
      return;
    }

    if (state.phase === "success") {
      const shortAddress = compactAddress(state.proof.walletAddress);
      gate.innerHTML = `
        <div class="proof-success__stamp" aria-hidden="true">✓</div>
        <div class="wallet-gate__content">
          <p class="eyebrow">Proof verified</p>
          <h2>You completed ${quest.title}.</h2>
          <p>Your wallet signature matched <b>${shortAddress}</b>${state.blockHeight ? ` at block ${state.blockHeight.toLocaleString()}` : ""}.</p>
        </div>
        <div class="next-screen-lock">
          <a class="button" href="/journey">View my journey →</a>
        </div>
        <div class="proof-receipt">
          <span>Status <b>Verified</b></span>
          <span>Payment <b>None</b></span>
          <span>Reward <b>Coming soon</b></span>
        </div>
        <div class="completion-feedback">
          <div><p class="eyebrow">One quick check</p><h3>How clear was this quest?</h3></div>
          <div class="completion-feedback__choices" aria-label="Rate this quest">
            <button type="button" data-feedback-rating="1">Needs work</button>
            <button type="button" data-feedback-rating="2">Clear</button>
            <button type="button" data-feedback-rating="3">Very clear</button>
          </div>
          <p data-feedback-status></p>
        </div>
      `;
      gate.querySelectorAll("[data-feedback-rating]").forEach((button) => {
        button.addEventListener("click", async () => {
          const status = gate.querySelector("[data-feedback-status]");
          gate.querySelectorAll("[data-feedback-rating]").forEach((item) => {
            item.disabled = true;
          });
          status.textContent = "Saving feedback…";
          try {
            const response = await fetch(`${apiBase}/api/feedback`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                proofKey: state.proof.key,
                feedbackToken: state.feedbackToken,
                rating: Number(button.dataset.feedbackRating)
              })
            });
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.error || "Feedback couldn’t be saved.");
            }
            status.textContent = "Thanks. Your feedback was saved.";
            button.classList.add("is-selected");
          } catch (error) {
            status.textContent = error instanceof Error ? error.message : "Feedback couldn’t be saved.";
            gate.querySelectorAll("[data-feedback-rating]").forEach((item) => {
              item.disabled = false;
            });
          }
        });
      });
      return;
    }

    const hasError = state.phase === "error";
    gate.innerHTML = `
      <div class="wallet-gate__icon ${hasError ? "wallet-gate__icon--warning" : ""}" aria-hidden="true">
        ${hasError ? "!" : walletShieldMarkup()}
      </div>
      <div class="wallet-gate__content">
        <p class="eyebrow">${hasError ? "Couldn’t finish proof" : "Nimiq Pay required"}</p>
        <h2>${hasError ? escapeHtml(state.error.title) : "Connect. Read. Sign."}</h2>
        <p>${hasError ? escapeHtml(state.error.message) : "You’ll approve account access, then sign a short-lived challenge created for this quest and wallet."}</p>
        ${hasError ? `<small>${escapeHtml(state.error.help)}</small>` : `
          <ul class="wallet-checklist">
            <li><span>✓</span>No transaction or network fee</li>
            <li><span>✓</span>Private keys stay inside Nimiq Pay</li>
            <li><span>✓</span>The challenge can only be used once</li>
          </ul>
          <p class="proof-disclosure">Verification stores your wallet address, public key, quest, and completion time. Every verified completion joins the mandatory public leaderboard with a masked wallet label. <a href="/privacy">Read the Privacy Notice</a>.</p>
        `}
      </div>
      <button class="button" type="button" data-connect-proof>
        ${hasError ? "Try again" : "Verify with Nimiq Pay"} <span aria-hidden="true">→</span>
      </button>
      ${hasError ? `<a class="wallet-fallback" href="https://pay.nimiq.com/" target="_blank" rel="noreferrer">Get the Nimiq Pay app</a>` : ""}
    `;

    gate.querySelector("[data-connect-proof]").addEventListener("click", beginWalletProof);
  }

  async function beginWalletProof() {
    state.phase = "connecting";
    state.error = null;
    renderGate();

    try {
      const nimiq = await init({ timeout: 5000 });
      const consensus = await nimiq.isConsensusEstablished();

      if (!consensus) {
        throw new WalletFlowError(
          "Network still syncing",
          "Nimiq Pay hasn’t established network consensus yet.",
          "Wait a moment, then try again."
        );
      }

      state.blockHeight = await nimiq.getBlockNumber();
      const accountsResult = await nimiq.listAccounts();
      const accounts = unwrapWalletResult(accountsResult, "Account access was rejected.");

      if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new WalletFlowError(
          "No Nimiq account found",
          "Nimiq Pay didn’t return an account for this proof.",
          "Create or select a Nimiq account, then try again."
        );
      }

      state.account = accounts[0];

      const challengeResponse = await fetch(`${apiBase}/api/completion-challenges`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questId: quest.id,
          walletAddress: state.account
        })
      });
      const challengeResult = await challengeResponse.json();

      if (!challengeResponse.ok) {
        throw new WalletFlowError(
          "Challenge unavailable",
          challengeResult.error || "NimQuest couldn’t prepare the signing message.",
          "Check your connection and try again."
        );
      }

      state.phase = "signing";
      renderGate();
      const signedResult = await nimiq.sign(challengeResult.challenge.message);
      const signed = unwrapWalletResult(signedResult, "The signing request was rejected.");

      state.phase = "verifying";
      renderGate();
      const completionResponse = await fetch(`${apiBase}/api/complete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          questId: quest.id,
          answers: stored.answers,
          walletAddress: state.account,
          challengeId: challengeResult.challenge.id,
          publicKey: signed.publicKey,
          signature: signed.signature
        })
      });
      const completion = await completionResponse.json();

      if (!completionResponse.ok) {
        throw new WalletFlowError(
          "Proof rejected",
          completion.error || "The signature couldn’t be verified.",
          "Restart the proof to receive a fresh challenge."
        );
      }

      if (!completion.passed) {
        throw new WalletFlowError(
          "Review your answers",
          "One or more answers need another look.",
          "Return to the quest, edit your answers, and try again."
        );
      }

      state.phase = "success";
      state.proof = completion.proof;
      state.feedbackToken = completion.feedbackToken;
      sessionStorage.removeItem(`nimquest:proof:${quest.id}`);
      sessionStorage.removeItem(`nimquest:draft:${quest.id}`);
      localStorage.setItem(`nimquest:completion:${quest.id}`, JSON.stringify(completion.proof));
      renderGate();
    } catch (error) {
      const flowError = normalizeWalletError(error);
      state.phase = "error";
      state.error = flowError;
      renderGate();
    }
  }

  renderGate();
}

async function renderCompletionDetail(proofKey) {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || (isLocalPreview ? "http://localhost:8787" : "");

  document.querySelector("#app").innerHTML = `
    <header class="app-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <span class="receipt-header-label">Verified receipt</span>
      <a class="back-link" href="/journey"><span aria-hidden="true">←</span> My Journey</a>
    </header>
    <main class="completion-page" aria-live="polite">
      <div class="completion-loading"><span class="wallet-loader" aria-hidden="true"><span></span><span></span><span></span></span><p>Loading verified proof…</p></div>
    </main>
  `;

  const page = document.querySelector(".completion-page");
  let proof = readVerifiedCompletions().find((item) => item.key === proofKey);

  try {
    if (!proof) {
      if (!navigator.onLine) {
        throw new Error("This proof isn’t cached on this device. Reconnect to load it from NimQuest.");
      }
      const response = await fetch(`${apiBase}/api/completions/${encodeURIComponent(proofKey)}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Verified completion not found.");
      }
      proof = result.proof;
    }

    const quest = quests.find((item) => item.id === proof.questId);
    if (!quest || proof.status !== "verified") {
      throw new Error("Verified completion not found.");
    }

    const shareUrl = window.location.href;
    page.innerHTML = `
      <section class="completion-card">
        <div class="completion-card__seal" aria-hidden="true">${brandMarkup()}</div>
        <p class="eyebrow">Wallet-verified completion</p>
        <h1>${quest.title}</h1>
        <p class="completion-card__lead">This quest was completed and verified with a one-time Nimiq wallet signature.</p>
        <div class="completion-card__status"><span aria-hidden="true">✓</span><div><b>Verified</b><small>No NIM was sent</small></div></div>
        <dl>
          <div><dt>Quest</dt><dd>${quest.number} · ${quest.title}</dd></div>
          <div><dt>Wallet</dt><dd>${escapeHtml(compactAddress(proof.walletAddress))}</dd></div>
          <div><dt>Completed</dt><dd>${formatCompletionDate(proof.completedAt)}</dd></div>
          <div><dt>Method</dt><dd>Nimiq signed message</dd></div>
          <div><dt>Receipt ID</dt><dd>${escapeHtml(proof.key)}</dd></div>
          <div><dt>Reward</dt><dd>Coming soon</dd></div>
        </dl>
        <div class="completion-card__actions">
          <button class="button" type="button" data-share-detail>Share verified proof</button>
          <a class="button button--quiet" href="/quests/${quest.id}">Review quest</a>
        </div>
        <p class="completion-card__share-status" data-share-status></p>
      </section>
      <aside class="completion-trust">
        <p class="eyebrow">What this proves</p>
        <h2>A wallet approved this specific completion.</h2>
        <ul>
          <li><span>✓</span>The quiz passed before wallet access.</li>
          <li><span>✓</span>The signature matched the public Nimiq address.</li>
          <li><span>✓</span>The one-time challenge was consumed after verification.</li>
          <li><span>✓</span>No payment or private key was required.</li>
        </ul>
      </aside>
    `;

    page.querySelector("[data-share-detail]").addEventListener("click", async (event) => {
      const copied = await shareProof({ title: quest.title, url: shareUrl });
      page.querySelector("[data-share-status]").textContent = copied
        ? "Proof link copied."
        : "Share sheet opened.";
      if (copied) {
        event.currentTarget.textContent = "Link copied";
      }
    });
  } catch (error) {
    page.innerHTML = `
      <section class="completion-error">
        <span aria-hidden="true">!</span>
        <p class="eyebrow">Receipt unavailable</p>
        <h1>We couldn’t load this proof.</h1>
        <p>${escapeHtml(error instanceof Error ? error.message : "The receipt could not be loaded.")}</p>
        <div><button class="button" type="button" data-retry-proof>Try again</button><a class="button button--quiet" href="/journey">My Journey</a></div>
      </section>
    `;
    page.querySelector("[data-retry-proof]").addEventListener("click", () => window.location.reload());
  }
}

async function shareProof({ title, url }) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${title} · NimQuest`,
        text: `I completed ${title} on NimQuest with a verified Nimiq wallet proof.`,
        url
      });
      return false;
    } catch (error) {
      if (error?.name === "AbortError") {
        return false;
      }
    }
  }

  await navigator.clipboard.writeText(url);
  return true;
}

function renderJourney() {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || (isLocalPreview ? "http://localhost:8787" : "");
  const completions = readVerifiedCompletions();
  const completionByQuest = new Map(completions.map((proof) => [proof.questId, proof]));
  const completedCount = completionByQuest.size;
  const nextQuest = getNextQuest(new Set(completionByQuest.keys()));
  const latestCompletion = [...completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];
  const primaryWallet = latestCompletion?.walletAddress || null;

  const journeyRows = quests
    .map((quest, index) => {
      const proof = completionByQuest.get(quest.id);
      const completedAt = proof ? formatCompletionDate(proof.completedAt) : null;
      return `
        <article class="journey-quest journey-quest--${quest.color} ${proof ? "is-verified" : ""}">
          <div class="journey-quest__marker" aria-hidden="true">
            ${proof ? "✓" : index + 1}
          </div>
          <div class="journey-quest__copy">
            <p class="eyebrow">${quest.track}</p>
            <h3>${quest.title}</h3>
            <p>${proof ? `Verified ${completedAt}` : quest.description}</p>
          </div>
          ${
            proof
              ? `<button class="journey-proof-button" type="button" data-view-proof="${quest.id}" aria-label="View ${quest.title} proof">View proof</button>`
              : `<a class="journey-quest__action" href="/quests/${quest.id}" aria-label="Start ${quest.title}">${nextQuest?.id === quest.id && completedCount > 0 ? "Continue trail" : "Start quest"} <span aria-hidden="true">→</span></a>`
          }
        </article>
      `;
    })
    .join("");

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#journey-content">Skip to journey</a>

    <header class="app-header journey-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <nav class="journey-nav" aria-label="Product navigation">
        <a href="/quests">Quest Trail</a>
        <a href="/journey" aria-current="page">My Journey</a>
        <a href="/leaderboard">Leaderboard</a>
      </nav>
      <a class="back-link" href="/quests"><span aria-hidden="true">←</span> Quest Trail</a>
    </header>

    <main class="journey-page" id="journey-content">
      <section class="journey-hero">
        <div class="journey-hero__copy">
          <p class="eyebrow eyebrow--large">Your verified Nimiq journey</p>
          <h1>Small wins.<br><span class="word-highlight word-highlight--yellow">Real proof.</span></h1>
          <p>${completedCount
            ? `You’ve verified ${completedCount} of ${quests.length} starter quests. Every completed marker below came from a wallet-signed proof.`
            : "Your trail starts empty and fills only when a wallet-signed quest is verified."}</p>
          <div class="journey-summary" aria-label="Journey summary">
            <span><b>${completedCount}</b>verified</span>
            <span><b>${quests.length - completedCount}</b>remaining</span>
            <span><b>0</b>NIM spent</span>
          </div>
        </div>

        <aside class="journey-pass" aria-label="Journey pass">
          <div class="journey-pass__top">
            <span>NIMQUEST PASS</span>
            <span aria-hidden="true">✦</span>
          </div>
          <div class="journey-pass__score">
            <strong>${completedCount}<small>/${quests.length}</small></strong>
            <span>QUESTS VERIFIED</span>
          </div>
          <div class="journey-pass__progress"><span style="width: ${(completedCount / quests.length) * 100}%"></span></div>
          <div class="journey-pass__wallet">
            <span>CONNECTED WALLET</span>
            <b>${primaryWallet ? compactAddress(primaryWallet) : "No proof yet"}</b>
          </div>
        </aside>
      </section>

      <section class="journey-content">
        <div class="journey-content__heading">
          <div>
            <p class="eyebrow">Starter trail</p>
            <h2>${completedCount ? "Your proof trail is growing." : "Twenty markers are waiting."}</h2>
          </div>
          ${nextQuest
            ? `<a class="button button--quiet" href="/quests/${nextQuest.id}">${completedCount ? "Continue journey" : "Start first quest"} <span aria-hidden="true">→</span></a>`
            : `<a class="button button--quiet" href="/quests">Review quests <span aria-hidden="true">→</span></a>`}
        </div>

        <div class="journey-sync" role="status">
          <div>
            <p class="eyebrow">Cross-device recovery</p>
            <h3>Bring back proofs from your wallet.</h3>
            <p>Nimiq Pay shares the selected public account only after you approve access. NimQuest then restores verified D1 records for that address.</p>
          </div>
          <button class="button button--quiet" type="button" data-sync-journey>Sync from Nimiq Pay</button>
          <p class="journey-sync__status" data-sync-status></p>
        </div>

        <div class="journey-list">
          <div class="journey-list__line" aria-hidden="true"></div>
          ${journeyRows}
        </div>
      </section>

      <section class="badge-section badge-section--journey" aria-labelledby="journey-badges-title">
        <div class="section-heading section-heading--split">
          <div><p class="eyebrow">Verified badges</p><h2 id="journey-badges-title">Your earned skills.</h2></div>
          <p>Locked badges show what to learn next. Unlocked badges are backed by your verified completion records.</p>
        </div>
        <div class="achievement-grid">${badgeGridMarkup(completionByQuest)}</div>
      </section>

      <section class="journey-truth">
        <div class="journey-truth__icon" aria-hidden="true">✓</div>
        <div>
          <p class="eyebrow">Proof status</p>
          <h2>${latestCompletion ? "Your latest proof is verified." : "No proof has been created yet."}</h2>
          <p>${latestCompletion
            ? `${quests.find((quest) => quest.id === latestCompletion.questId)?.title || "Quest"} was signed by ${compactAddress(latestCompletion.walletAddress)} on ${formatCompletionDate(latestCompletion.completedAt)}.`
            : "Complete a quest and approve its one-time wallet message. NimQuest will add it here after backend verification."}</p>
        </div>
        <div class="journey-truth__receipt">
          <span>Status <b>${latestCompletion ? "Verified" : "Not started"}</b></span>
          <span>Payment <b>None</b></span>
          <span>Reward <b>Coming soon</b></span>
        </div>
      </section>
    </main>

    <dialog class="journey-proof-dialog" aria-labelledby="journey-proof-title">
      <button class="sheet-close" type="button" aria-label="Close proof">×</button>
      <div class="journey-proof-dialog__stamp" aria-hidden="true">✓</div>
      <p class="eyebrow">Verified completion</p>
      <h2 id="journey-proof-title"></h2>
      <dl>
        <div><dt>Wallet</dt><dd data-proof-wallet></dd></div>
        <div><dt>Completed</dt><dd data-proof-date></dd></div>
        <div><dt>Method</dt><dd>Signed message</dd></div>
        <div><dt>Payment</dt><dd>None</dd></div>
        <div><dt>Reward</dt><dd>Coming soon</dd></div>
      </dl>
      <div class="journey-proof-dialog__actions">
        <a class="button button--small" data-proof-link href="#">Open receipt</a>
        <button class="button button--small button--quiet" type="button" data-share-proof>Share proof</button>
      </div>
    </dialog>
  `;

  const proofDialog = document.querySelector(".journey-proof-dialog");
  document.querySelectorAll("[data-view-proof]").forEach((button) => {
    button.addEventListener("click", () => {
      const quest = quests.find((item) => item.id === button.dataset.viewProof);
      const proof = completionByQuest.get(button.dataset.viewProof);
      proofDialog.querySelector("#journey-proof-title").textContent = quest.title;
      proofDialog.querySelector("[data-proof-wallet]").textContent = compactAddress(proof.walletAddress);
      proofDialog.querySelector("[data-proof-date]").textContent = formatCompletionDate(proof.completedAt);
      const proofUrl = `/completions/${encodeURIComponent(proof.key)}`;
      proofDialog.querySelector("[data-proof-link]").href = proofUrl;
      proofDialog.querySelector("[data-share-proof]").dataset.shareUrl = proofUrl;
      proofDialog.querySelector("[data-share-proof]").dataset.shareTitle = quest.title;
      proofDialog.showModal();
    });
  });
  proofDialog.querySelector(".sheet-close").addEventListener("click", () => proofDialog.close());
  proofDialog.addEventListener("click", (event) => {
    if (event.target === proofDialog) {
      proofDialog.close();
    }
  });

  proofDialog.querySelector("[data-share-proof]").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const shareUrl = new URL(button.dataset.shareUrl, window.location.origin).href;
    const copied = await shareProof({
      title: button.dataset.shareTitle,
      url: shareUrl
    });
    if (copied) {
      button.textContent = "Link copied";
    }
  });

  document.querySelector("[data-sync-journey]").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const status = document.querySelector("[data-sync-status]");
    button.disabled = true;
    status.textContent = "Waiting for Nimiq Pay approval…";

    try {
      if (!navigator.onLine) {
        throw new Error("You’re offline. Reconnect and try again.");
      }
      const nimiq = await init({ timeout: 5000 });
      const accounts = unwrapWalletResult(await nimiq.listAccounts(), "Account access was rejected.");
      if (!Array.isArray(accounts) || !accounts[0]) {
        throw new Error("No Nimiq account was selected.");
      }
      const response = await fetch(
        `${apiBase}/api/completions?wallet=${encodeURIComponent(accounts[0])}`
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "NimQuest couldn’t recover this journey.");
      }
      result.completions.forEach((proof) => {
        localStorage.setItem(`nimquest:completion:${proof.questId}`, JSON.stringify(proof));
      });
      status.textContent = result.completions.length
        ? `${result.completions.length} verified proof${result.completions.length === 1 ? "" : "s"} restored.`
        : "No verified proofs were found for this wallet.";
      if (result.completions.length) {
        window.setTimeout(() => window.location.reload(), 700);
      }
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Journey sync failed.";
      button.disabled = false;
    }
  });
}

async function renderLeaderboard() {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || (isLocalPreview ? "http://localhost:8787" : "");

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#leaderboard-content">Skip to leaderboard</a>
    <header class="app-header journey-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <nav class="journey-nav" aria-label="Product navigation">
        <a href="/quests">Quest Trail</a>
        <a href="/journey">My Journey</a>
        <a href="/leaderboard" aria-current="page">Leaderboard</a>
      </nav>
      <a class="back-link" href="/quests"><span aria-hidden="true">←</span> Quest Trail</a>
    </header>

    <main class="leaderboard-page" id="leaderboard-content">
      <section class="leaderboard-hero">
        <div>
          <p class="eyebrow eyebrow--large">Verified community progress</p>
          <h1>Every place is backed by<br><span class="word-highlight word-highlight--yellow">verified wallet proof.</span></h1>
          <p>Every verified completion joins this public ranking. Wallet labels are masked, and self-reported scores never count.</p>
        </div>
        <aside class="leaderboard-rule">
          <span aria-hidden="true">✦</span>
          <div>
            <p class="eyebrow">Ranking rule</p>
            <h2>The most verified quests win.</h2>
            <p>Ties go to the wallet that earned its first proof earlier.</p>
          </div>
        </aside>
      </section>

      <section class="leaderboard-board" aria-live="polite">
        <div class="leaderboard-board__heading">
          <div>
            <p class="eyebrow">Top learners</p>
            <h2>Wallet leaderboard</h2>
          </div>
          <span class="leaderboard-status">Loading verified proofs…</span>
        </div>
        <div class="leaderboard-loading">
          <span aria-hidden="true">◎</span>
          <p>Counting verified quest proofs.</p>
        </div>
      </section>
    </main>
  `;

  const board = document.querySelector(".leaderboard-board");

  try {
    if (!navigator.onLine) {
      throw new Error("You’re offline. Reconnect to load the live rankings.");
    }

    const response = await fetch(`${apiBase}/api/leaderboard`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "NimQuest couldn’t load the leaderboard.");
    }

    const entries = Array.isArray(result.leaderboard) ? result.leaderboard : [];
    const rows = entries.map((entry) => `
      <li class="leaderboard-row ${entry.rank <= 3 ? `leaderboard-row--top-${entry.rank}` : ""}">
        <span class="leaderboard-rank" aria-label="Rank ${entry.rank}">${entry.rank <= 3 ? ["", "✦", "◆", "●"][entry.rank] : entry.rank}</span>
        <div class="leaderboard-wallet">
          <span>Wallet address</span>
          <b>${escapeHtml(entry.walletLabel || compactAddress(entry.walletAddress))}</b>
        </div>
        <div class="leaderboard-score">
          <strong>${entry.verifiedQuests}<small>/${quests.length}</small></strong>
          <span>verified quests</span>
        </div>
        <div class="leaderboard-date">
          <span>Latest proof</span>
          <b>${escapeHtml(formatCompletionDate(entry.latestVerifiedAt))}</b>
        </div>
      </li>
    `).join("");

    board.innerHTML = `
      <div class="leaderboard-board__heading">
        <div>
          <p class="eyebrow">Top learners</p>
          <h2>Wallet leaderboard</h2>
        </div>
        <span class="leaderboard-status">${entries.length} wallet${entries.length === 1 ? "" : "s"} ranked</span>
      </div>
      ${entries.length
        ? `<ol class="leaderboard-list">${rows}</ol>`
        : `<div class="leaderboard-empty"><span aria-hidden="true">✦</span><h3>The first place is open.</h3><p>Complete a quest with Nimiq Pay to become the first ranked wallet.</p><a class="button" href="/quests">Start a quest</a></div>`}
    `;
  } catch (error) {
    board.innerHTML = `
      <div class="leaderboard-error">
        <span aria-hidden="true">!</span>
        <p class="eyebrow">Rankings unavailable</p>
        <h2>We couldn’t load the leaderboard.</h2>
        <p>${escapeHtml(error instanceof Error ? error.message : "Try again in a moment.")}</p>
        <button class="button" type="button" data-retry-leaderboard>Try again</button>
      </div>
    `;
    board.querySelector("[data-retry-leaderboard]").addEventListener("click", () => window.location.reload());
  }
}

function readVerifiedCompletions() {
  const completions = [];
  const knownQuestIds = new Set(quests.map((quest) => quest.id));

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("nimquest:completion:")) {
        continue;
      }

      const proof = JSON.parse(localStorage.getItem(key));
      if (
        proof?.status === "verified" &&
        knownQuestIds.has(proof.questId) &&
        typeof proof.questId === "string" &&
        typeof proof.walletAddress === "string" &&
        typeof proof.completedAt === "string" &&
        proof.verificationMethod === "nimiq_message_signature"
      ) {
        completions.push(proof);
      }
    }
  } catch {
    return [];
  }

  return completions;
}

function readQuestDraft(quest) {
  try {
    const draft = JSON.parse(sessionStorage.getItem(`nimquest:draft:${quest.id}`));
    const validAnswers =
      Array.isArray(draft?.answers) &&
      draft.answers.length === quest.questions.length &&
      draft.answers.every(
        (answer, index) =>
          answer === null ||
          (Number.isInteger(answer) &&
            answer >= 0 &&
            answer < quest.questions[index].options.length)
      );
    const validStep = ["lesson", "quiz", "review"].includes(draft?.step);
    const validQuestionIndex =
      Number.isInteger(draft?.questionIndex) &&
      draft.questionIndex >= 0 &&
      draft.questionIndex < quest.questions.length;

    if (validAnswers && validStep && validQuestionIndex) {
      if (draft.step === "review" && draft.answers.some((answer) => answer === null)) {
        draft.step = "quiz";
        draft.questionIndex = draft.answers.findIndex((answer) => answer === null);
      }
      return draft;
    }
  } catch {
    return null;
  }

  return null;
}

function saveQuestDraft(questId, state) {
  try {
    sessionStorage.setItem(
      `nimquest:draft:${questId}`,
      JSON.stringify({
        step: state.step,
        questionIndex: state.questionIndex,
        answers: state.answers
      })
    );
  } catch {
    // The quest still works when private browsing blocks session storage.
  }
}

function formatCompletionDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function readProofSession(questId) {
  try {
    const stored = JSON.parse(sessionStorage.getItem(`nimquest:proof:${questId}`));
    if (
      stored?.questId === questId &&
      Array.isArray(stored.answers) &&
      stored.answers.length === 3 &&
      stored.answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 2)
    ) {
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

function unwrapWalletResult(result, fallbackMessage) {
  if (result && typeof result === "object" && "error" in result) {
    throw new WalletFlowError(
      "Approval declined",
      result.error?.message || fallbackMessage,
      "Nothing was signed. You can try again whenever you’re ready."
    );
  }

  return result;
}

function normalizeWalletError(error) {
  if (error instanceof WalletFlowError) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  if (/timeout|inject|provider/i.test(message)) {
    return new WalletFlowError(
      "Open NimQuest inside the Nimiq Pay app",
      "A normal web browser can’t reach your wallet. NimQuest signs your proof inside the Nimiq Pay app.",
      "1. Install Nimiq Pay from your app store. 2. Open Nimiq Pay. 3. Open NimQuest from inside it."
    );
  }

  if (/denied|reject|declin|permission/i.test(message)) {
    return new WalletFlowError(
      "Approval declined",
      "The wallet request was cancelled. Nothing was signed.",
      "Read the request and try again when you’re ready."
    );
  }

  return new WalletFlowError(
    "Wallet proof paused",
    "NimQuest couldn’t finish the wallet proof.",
    "Check your connection and try again."
  );
}

class WalletFlowError extends Error {
  constructor(title, message, help) {
    super(message);
    this.title = title;
    this.help = help;
  }
}

function compactAddress(address) {
  const compact = address.replace(/\s+/g, "");
  return `${compact.slice(0, 8)}${"*".repeat(10)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shuffledIndices(count) {
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function walletShieldMarkup() {
  return `
    <svg viewBox="0 0 64 64" role="img" aria-label="Wallet shield">
      <path d="M32 5 54 14v16c0 14-9 24-22 29C19 54 10 44 10 30V14L32 5Z" fill="currentColor"/>
      <path d="M24 31.5 29.5 37 41 24.5" fill="none" stroke="#19182a" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"/>
    </svg>
  `;
}

function renderLegalPage(page) {
  const isPrivacy = page === "privacy";
  const title = isPrivacy ? "Privacy Notice" : "Terms of Use";
  const content = isPrivacy
    ? `
      <p class="legal-lead">This notice explains what NimQuest stores, why it stores it, and what other people can see.</p>
      <section>
        <h2>Data we use</h2>
        <p>When you verify a quest, NimQuest receives your selected Nimiq wallet address, public key, signature, quest answers, quest identifier, and completion time. Nimiq Pay keeps your private keys and recovery data. NimQuest never receives them.</p>
        <p>NimQuest does not request or store a Nimiq Pay device identifier.</p>
      </section>
      <section>
        <h2>Why we use this data</h2>
        <ul>
          <li>Verify that the selected wallet approved a one-time completion message.</li>
          <li>Prevent the same wallet from claiming the same quest more than once.</li>
          <li>Restore verified progress for the wallet that you approve in Nimiq Pay.</li>
          <li>Rank verified progress on the public leaderboard.</li>
          <li>Protect the service from spam and repeated automated requests.</li>
        </ul>
      </section>
      <section>
        <h2>Public information</h2>
        <p>Leaderboard participation is required for every verified completion. You cannot opt out of public ranking. Public pages show a masked wallet label, verified quest count, completion dates, quest name, and verification method. NimQuest does not show your full wallet address, public key, signature, answers, or security tokens on public pages.</p>
      </section>
      <section>
        <h2>Storage and retention</h2>
        <p>Cloudflare D1 stores verified completions and feedback. One-time signing challenges expire after five minutes. Abuse-prevention counters expire automatically. Completion records remain available while NimQuest operates because they support Journey recovery, receipts, and ranking. You can request correction or deletion through the project repository contact channel, subject to technical and competition record requirements.</p>
      </section>
      <section>
        <h2>Service providers</h2>
        <p>Cloudflare hosts the application, static assets, Worker API, and D1 database. Nimiq Pay supplies wallet account access and message signing after your approval.</p>
      </section>
      <section>
        <h2>Your choice before verification</h2>
        <p>You can use lessons and quizzes without creating a wallet proof. If you verify a completion, the public ranking rules above apply.</p>
      </section>
    `
    : `
      <p class="legal-lead">These terms apply when you use NimQuest.</p>
      <section>
        <h2>Using NimQuest</h2>
        <p>You may use NimQuest to read lessons, answer quizzes, create wallet-verified completions, view public receipts, and compare public leaderboard progress. You must be able to lawfully use Nimiq Pay and the Nimiq network in your location.</p>
      </section>
      <section>
        <h2>Wallet actions</h2>
        <p>NimQuest requests account access and a message signature only after you choose to verify a passed quest. The signature does not transfer NIM. Always read the full Nimiq Pay approval message before you sign it.</p>
      </section>
      <section>
        <h2>Public leaderboard</h2>
        <p>Every verified completion participates in the public leaderboard. Ranking is mandatory and has no opt-out. Public displays mask most of the wallet address. The wallet with the most verified quests ranks first. The earlier first completion breaks a tie.</p>
      </section>
      <section>
        <h2>Rewards</h2>
        <p>Quest rewards are coming soon. NimQuest does not currently promise, fund, or distribute NIM or any other asset for quest completion.</p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>Do not attack, overload, automate abuse of, reverse engineer for abuse, or submit false proof to NimQuest. Do not use another person’s wallet without permission.</p>
      </section>
      <section>
        <h2>Availability and liability</h2>
        <p>NimQuest is provided as available. Features can change, pause, or stop. Verify important wallet information in Nimiq Pay and official Nimiq sources. To the extent allowed by law, the project contributors are not liable for indirect loss caused by use of the service.</p>
      </section>
      <section>
        <h2>Open-source code</h2>
        <p>The NimQuest source code is released under the MIT License. These product terms do not replace the repository license.</p>
      </section>
    `;

  document.querySelector("#app").innerHTML = `
    <header class="app-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <span class="receipt-header-label">${title}</span>
      <a class="back-link" href="/"><span aria-hidden="true">←</span> Back home</a>
    </header>
    <main class="legal-page">
      <p class="eyebrow">Effective 28 July 2026</p>
      <h1>${title}</h1>
      ${content}
      <p class="legal-note">Questions can be raised through the public NimQuest GitHub repository.</p>
    </main>
  `;
}

const documentationPages = {
  overview: {
    eyebrow: "NimQuest documentation",
    title: "Learn how NimQuest works.",
    lead:
      "Use these guides to understand the product, the wallet-proof flow, the security model, and the local development setup.",
    content: `
      <div class="docs-card-grid">
        <a class="docs-card docs-card--yellow" href="/docs/architecture">
          <span>01</span>
          <p class="eyebrow">System design</p>
          <h2>Architecture</h2>
          <p>See the frontend, Nimiq Pay, Worker, and D1 data flow.</p>
          <b>Open guide <span aria-hidden="true">→</span></b>
        </a>
        <a class="docs-card docs-card--blue" href="/docs/integration">
          <span>02</span>
          <p class="eyebrow">Wallet flow</p>
          <h2>Nimiq Pay integration</h2>
          <p>Follow the verified-completion procedure and API contract.</p>
          <b>Open guide <span aria-hidden="true">→</span></b>
        </a>
        <a class="docs-card docs-card--violet" href="/docs/security">
          <span>03</span>
          <p class="eyebrow">Trust boundaries</p>
          <h2>Security and privacy</h2>
          <p>Review proof controls, public data, abuse limits, and retention.</p>
          <b>Open guide <span aria-hidden="true">→</span></b>
        </a>
        <a class="docs-card docs-card--mint" href="/docs/setup">
          <span>04</span>
          <p class="eyebrow">Developer guide</p>
          <h2>Run NimQuest locally</h2>
          <p>Install dependencies, apply migrations, test, and start the app.</p>
          <b>Open guide <span aria-hidden="true">→</span></b>
        </a>
      </div>
      <section class="docs-section">
        <p class="eyebrow">Product truth</p>
        <h2>What the proof means</h2>
        <p>A verified completion means that the learner passed a server-graded quiz and approved a one-time message with the selected Nimiq wallet. The signature does not send NIM. The completion record is stored in Cloudflare D1.</p>
        <div class="docs-facts">
          <article><b>20</b><span>sourced quests</span></article>
          <article><b>5 min</b><span>challenge expiry</span></article>
          <article><b>0 NIM</b><span>required for proof</span></article>
        </div>
      </section>
    `
  },
  architecture: {
    eyebrow: "System design",
    title: "Architecture",
    lead:
      "NimQuest separates learning, wallet approval, verification, and persistence across four clear trust boundaries.",
    content: `
      <section class="docs-section">
        <h2>Components</h2>
        <div class="docs-table-wrap">
          <table class="docs-table">
            <thead><tr><th>Component</th><th>Function</th></tr></thead>
            <tbody>
              <tr><td>Vite frontend</td><td>Renders lessons, quizzes, Journey, receipts, badges, legal pages, and the leaderboard.</td></tr>
              <tr><td>Nimiq Pay</td><td>Provides approved account access, consensus state, block height, and message signing.</td></tr>
              <tr><td>Cloudflare Worker</td><td>Grades quizzes, verifies signatures, applies abuse controls, and serves the API and static app.</td></tr>
              <tr><td>Cloudflare D1</td><td>Stores challenges, verified completions, feedback, and short-lived rate counters.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section">
        <h2>Completion data flow</h2>
        <ol class="docs-steps">
          <li><span>1</span><div><b>Grade the quiz</b><p>The Worker checks all three answers. Correct answer indexes stay on the server.</p></div></li>
          <li><span>2</span><div><b>Approve the wallet</b><p>Nimiq Pay asks the learner to approve the selected public account.</p></div></li>
          <li><span>3</span><div><b>Create a challenge</b><p>The Worker stores a five-minute challenge bound to one quest and wallet.</p></div></li>
          <li><span>4</span><div><b>Sign the message</b><p>Nimiq Pay displays the exact message and asks the learner to approve it.</p></div></li>
          <li><span>5</span><div><b>Verify and store</b><p>The Worker verifies the signer, consumes the challenge, and stores one completion.</p></div></li>
        </ol>
      </section>
      <section class="docs-section">
        <h2>Trust boundaries</h2>
        <ul class="docs-checklist">
          <li>The browser cannot grade itself or create verified proof.</li>
          <li>A wallet address alone does not prove wallet control.</li>
          <li>Account access and signing require native approval in Nimiq Pay.</li>
          <li>Public APIs return masked wallet labels and opaque receipt IDs.</li>
        </ul>
      </section>
    `
  },
  integration: {
    eyebrow: "Wallet flow",
    title: "Nimiq Pay integration",
    lead:
      "Nimiq Pay is part of the completion path. It approves account access and signs the one-time proof message.",
    content: `
      <section class="docs-section">
        <h2>Verified-completion procedure</h2>
        <ol class="docs-steps">
          <li><span>1</span><div><b>Initialize the Mini App SDK.</b><p>Confirm that Nimiq Pay is available and consensus is established.</p></div></li>
          <li><span>2</span><div><b>Request account access.</b><p>Use <code>listAccounts()</code> after the learner passes the quiz.</p></div></li>
          <li><span>3</span><div><b>Request a challenge.</b><p>Send the quest ID and selected wallet address to NimQuest.</p></div></li>
          <li><span>4</span><div><b>Request the signature.</b><p>Use <code>sign()</code>. The learner must read and approve the exact message.</p></div></li>
          <li><span>5</span><div><b>Submit the proof.</b><p>Send the challenge ID, public key, signature, wallet address, quest ID, and answers.</p></div></li>
          <li><span>6</span><div><b>Show the result.</b><p>Store the returned receipt and feedback token only in the active browser flow.</p></div></li>
        </ol>
      </section>
      <section class="docs-section">
        <h2>API routes</h2>
        <div class="docs-endpoints">
          <code>GET /api/quests</code><span>Get the public quest catalog.</span>
          <code>POST /api/grade</code><span>Grade quiz answers without wallet access.</span>
          <code>POST /api/completion-challenges</code><span>Create a five-minute signing challenge.</span>
          <code>POST /api/complete</code><span>Verify the signature and store the completion.</span>
          <code>GET /api/completions?wallet=</code><span>Recover progress for an approved wallet.</span>
          <code>GET /api/leaderboard</code><span>Get rankings with masked wallet labels.</span>
        </div>
      </section>
      <aside class="docs-callout">
        <b>Wallet safety rule</b>
        <p>Message signing proves wallet approval. It does not transfer NIM, reveal a private key, or expose recovery data.</p>
      </aside>
    `
  },
  security: {
    eyebrow: "Trust boundaries",
    title: "Security and privacy",
    lead:
      "NimQuest limits what the browser can claim, what public routes can reveal, and how often write routes can be called.",
    content: `
      <section class="docs-section">
        <h2>Verification controls</h2>
        <ul class="docs-checklist">
          <li>The server grades answers before wallet access and before completion.</li>
          <li>Challenges bind the quest, wallet, nonce, issue time, and expiry.</li>
          <li>Challenges expire after five minutes and can be used once.</li>
          <li>The Worker derives the Nimiq address from the submitted public key.</li>
          <li>D1 enforces one verified completion for each quest and wallet.</li>
        </ul>
      </section>
      <section class="docs-section">
        <h2>Public and private data</h2>
        <div class="docs-split">
          <article>
            <p class="eyebrow">Public</p>
            <ul><li>Masked wallet label</li><li>Quest and completion date</li><li>Verification method</li><li>Rank and verified quest count</li></ul>
          </article>
          <article>
            <p class="eyebrow">Not public</p>
            <ul><li>Full wallet address</li><li>Public key and signature</li><li>Quiz answers</li><li>Feedback token</li><li>Device identifier</li></ul>
          </article>
        </div>
      </section>
      <section class="docs-section">
        <h2>Abuse controls</h2>
        <p>Write routes require an accepted browser origin. D1 counters apply route-specific limits. One wallet can hold no more than five active challenges. Rate keys use short-lived SHA-256 source digests instead of raw IP addresses.</p>
      </section>
      <aside class="docs-callout">
        <b>Mandatory ranking</b>
        <p>Every verified completion joins the public leaderboard. The app discloses this rule before wallet approval. Public pages mask the wallet address.</p>
      </aside>
    `
  },
  setup: {
    eyebrow: "Developer guide",
    title: "Run NimQuest locally",
    lead:
      "Use Node.js 20 or later. Run each command from the repository root.",
    content: `
      <section class="docs-section">
        <h2>Install and verify</h2>
        <ol class="docs-steps">
          <li><span>1</span><div><b>Install dependencies.</b><pre><code>npm ci</code></pre></div></li>
          <li><span>2</span><div><b>Run the Node and API tests.</b><pre><code>npm test</code></pre></div></li>
          <li><span>3</span><div><b>Build the frontend.</b><pre><code>npm run build:web</code></pre></div></li>
          <li><span>4</span><div><b>Start the local app.</b><pre><code>npm start</code></pre><p>Open <code>http://localhost:8787</code>.</p></div></li>
        </ol>
      </section>
      <section class="docs-section">
        <h2>Run the Worker</h2>
        <p>Apply local D1 migrations before you start the Worker.</p>
        <pre><code>npx wrangler d1 migrations apply nimquest --local
npm run dev:worker</code></pre>
      </section>
      <section class="docs-section">
        <h2>Run the release checks</h2>
        <pre><code>npm run qa
npm run test:worker-integration</code></pre>
        <p>The release checks cover the API, cryptography, frontend build, rendered routes, responsive overflow, and Worker bundle.</p>
      </section>
      <aside class="docs-callout docs-callout--warning">
        <b>Production prerequisite</b>
        <p>Apply pending D1 migrations before you deploy Worker code that uses the new schema.</p>
      </aside>
    `
  }
};

function renderDocumentationPage(page) {
  const documentation = documentationPages[page];
  if (!documentation) {
    renderNotFound();
    return;
  }

  const navigation = [
    ["overview", "Overview"],
    ["architecture", "Architecture"],
    ["integration", "Nimiq Pay"],
    ["security", "Security"],
    ["setup", "Local setup"]
  ];

  document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#docs-content">Skip to documentation</a>
    <header class="app-header docs-header">
      <a class="brand" href="/" aria-label="NimQuest home">${brandMarkup()}</a>
      <span class="receipt-header-label">Documentation</span>
      <a class="back-link" href="/"><span aria-hidden="true">←</span> Back home</a>
    </header>
    <div class="docs-layout">
      <aside class="docs-sidebar" aria-label="Documentation navigation">
        <p class="eyebrow">Guides</p>
        <nav>
          ${navigation
            .map(
              ([slug, label]) =>
                `<a class="${slug === page ? "is-active" : ""}" href="${slug === "overview" ? "/docs" : `/docs/${slug}`}">${label}</a>`
            )
            .join("")}
        </nav>
        <a class="docs-sidebar__github" href="https://github.com/mystiquemide/nimquest" target="_blank" rel="noreferrer">View source on GitHub <span aria-hidden="true">↗</span></a>
      </aside>
      <main class="docs-page" id="docs-content">
        <p class="eyebrow">${documentation.eyebrow}</p>
        <h1>${documentation.title}</h1>
        <p class="docs-lead">${documentation.lead}</p>
        ${documentation.content}
        <nav class="docs-bottom-nav" aria-label="More documentation">
          <a href="/docs">Documentation home</a>
          <a href="/privacy">Privacy Notice</a>
          <a href="/terms">Terms of Use</a>
        </nav>
      </main>
    </div>
  `;
}

renderCurrentRoute();
installConnectivityBanner();
