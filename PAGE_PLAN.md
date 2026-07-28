# NimQuest Page Plan

## Product model

- Primary user: a new or curious Nimiq user.
- Primary job: learn one useful Nimiq concept and create wallet-verified completion proof.
- Secondary job: return later and continue a verified learning trail.
- Core objects: quest, quiz attempt, signing challenge, completion proof, wallet, journey.
- Current permissions: public learning, wallet-approved account access, wallet-approved message signing.
- Current business goal: prove a complete, consumer-friendly Nimiq onboarding loop.

## Current route inventory

| Route | User goal | Current status | Exit paths |
|---|---|---|---|
| `/` | Understand NimQuest and start quickly | Complete | First quest, Quest Trail, wallet-safety quest |
| `/quests` | Choose a quest and see verified progress | Complete | Quest Session, landing-page safety section |
| `/quests/:id` | Learn, answer, review, and prepare proof | Complete | Wallet Proof, Quest Trail |
| `/proof/:id` | Sign and verify quest completion | Implemented, real Nimiq Pay validation pending | My Journey, Quest Session |
| `/journey` | Review verified completions and continue | Complete for local-device proof cache | Quest Session, Quest Trail, proof dialog |
| Unknown route | Recover from a bad or expired URL | Missing | Must offer home and Quest Trail |

## Current journey

1. Landing page introduces the product.
2. A primary CTA opens `Meet Nimiq` directly.
3. Quest Session saves unfinished answers in the browser session.
4. Answer review prepares the Wallet Proof handoff.
5. Nimiq Pay supplies the account and signs a one-time challenge.
6. The backend verifies the signature and stores completion.
7. My Journey shows the verified proof cached on the current device.
8. The next incomplete quest remains actionable.

## Current gaps

### Foundation gaps

1. Real Nimiq Pay runtime proof still needs validation inside the host app.
2. Pre-wallet quiz grading and correction guidance are complete.
3. My Journey depends on the proof returned to one browser. A returning user on another device cannot recover backend-stored proofs.
4. Unknown routes render the landing page instead of a clear not-found state.
5. Offline and API-unavailable states are handled as general wallet errors rather than distinct recovery states.
6. A completion proof exists only in the Journey dialog. There is no durable, linkable proof detail surface.

### Later product gaps

- More quest tracks and recommendations.
- Badge collection based on verified completions.
- Real funded rewards and transaction receipts.
- Public community progress based on durable production data.
- Sponsored quest campaigns.
- Quest authoring and review tools.
- Multilingual content.

## Required next surfaces

### P0: finish the core product

| Surface | Route or state | Why it is needed | Dependency |
|---|---|---|---|
| Not found | Catch-all route | Prevents unknown URLs from silently becoming the landing page | Frontend only |
| Quiz feedback | State inside `/quests/:id` | Complete locally: users fix marked answers before wallet approval | `POST /api/grade` |
| Offline recovery | State inside current screens | Gives a clear retry path when API access fails | Connectivity detection |
| Journey recovery | State inside `/journey` | Restores verified proofs for the connected wallet | Authenticated proof-list API |
| Completion proof detail | `/completions/:proofKey` | Gives each verified completion a durable, inspectable record | Authenticated proof-read API |

No settings page is needed yet. Wallet context and disconnect controls should remain inside Journey until the app has more user preferences.

### P1: Cycle II expansion

- Expand from three to seven polished quests.
- Add track filters and progress-based recommendations to `/quests`.
- Add verified badges inside `/journey`.
- Add a share action to completion proof detail.
- Add funded reward status and transaction receipt only after the payout rail is real.
- Add lightweight feedback collection after a verified completion.

### P2: ecosystem expansion

Only add these after real usage and funding exist:

- `/community` for privacy-safe aggregate progress.
- `/pools` and `/pools/:id` for genuinely funded quest campaigns.
- Sponsor campaign management.
- Quest authoring, review, and publishing tools.
- Merchant, builder, and organisation-specific onboarding.

## State matrix

| Surface | Loading | Empty | Error | Success | Recovery |
|---|---|---|---|---|---|
| Landing | Image loading | Not applicable | Image fallback | CTA enters quest | Quest Trail link |
| Quest Trail | Quest loading when API-backed | No available quests | Catalog unavailable | Three quest choices | Retry |
| Quest Session | Draft restore | Fresh lesson | Quest missing, grading failed | Answers pass review | Edit answers, return to trail |
| Wallet Proof | Connecting, signing, verifying | Quiz not saved | Rejected, expired, offline, provider unavailable | Verified completion | Retry, return to quest, open in Nimiq Pay |
| My Journey | Proof recovery | Zero verified quests | Recovery unavailable | Verified trail | Retry, start first quest |
| Completion detail | Proof loading | Not applicable | Missing or unauthorized proof | Verified receipt | Return to Journey |

## Navigation model

- Landing primary action: first quest.
- Landing secondary action: learn how the flow works.
- Product header: home brand, current context, back to Quest Trail.
- Journey: Quest Trail and current Journey destination.
- Every completion: Journey.
- Every failure: retry plus one safe exit.
- No global dashboard navigation until more than two persistent product destinations exist.

## Priority acceptance criteria

### Runtime proof

- A real Nimiq Pay account completes `Meet Nimiq`.
- Consensus, block height, account access, signing, and backend verification succeed.
- Rejection, timeout, expired challenge, and normal-browser fallback are recorded.

### Pre-proof quiz feedback

- Incorrect answers are returned without answer keys.
- A user can edit only the questions that need attention.
- Wallet access is requested only after the quiz passes.
- The backend still grades again before storing completion.

### Journey recovery

- Proofs are fetched from durable backend storage after wallet authentication.
- Another wallet cannot read them.
- Local cache is treated as a performance cache, not the source of truth.
- Empty, loading, offline, and unauthorized states are distinct.

### Completion detail

- The page shows quest, wallet, completion time, verification method, payment, reward, and proof status.
- It never exposes public key or device identifier unless there is a clear user need.
- Unknown and unauthorized proof keys fail safely.

## Recommended build order

1. Validate the existing Wallet Proof flow inside real Nimiq Pay.
2. Add pre-proof quiz grading and correction states.
3. Add authenticated completion retrieval.
4. Upgrade My Journey to backend-backed recovery.
5. Add the completion proof detail route.
6. Add the catch-all not-found screen and explicit offline recovery.
7. Run full mobile, accessibility, and real-device QA.
8. Use real user evidence to choose the first Cycle II expansion.
