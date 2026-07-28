# NimQuest Privacy Notice

Effective: 28 July 2026

NimQuest stores the selected Nimiq wallet address, public key, signature verification result, quest, completion time, and optional feedback when a learner verifies a quest. Nimiq Pay keeps private keys and recovery data. NimQuest never receives them.

NimQuest does not request or store a Nimiq Pay device identifier.

Every verified completion joins the public leaderboard. Ranking is mandatory and has no opt-out. Public pages show a masked wallet label, verified quest count, quest, completion date, verification method, and rank. Public pages do not show a full wallet address, public key, signature, quiz answers, or feedback token.

Cloudflare hosts the application, Worker API, static assets, and D1 database. One-time signing challenges expire after five minutes. Abuse-prevention counters store a short-lived SHA-256 digest instead of a raw source IP.

Learners can use lessons and quizzes without creating a wallet proof. Wallet-linked storage begins only after the learner chooses verification and approves Nimiq Pay access.

Completion records remain available while NimQuest operates because they support Journey recovery, receipts, and ranking. Questions or deletion requests can be raised through the project repository contact channel, subject to technical and competition record requirements.
