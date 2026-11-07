# Story Library: access control and revocation — proposal

Status: **proposal for approval. Nothing here is implemented, deployed or billed.**
Scope: the production design for per-school access to central-library *files* (the catalogue is already per-school gated).
Decision requested at the end.

## 1. The problem, stated precisely

Hiding a catalogue entry does not stop someone who already holds a file URL, and a file path that is learnable stays
learnable. So "disable a school" has to be defined for files, not only for the catalogue. We distinguish:

| Term | Meaning |
|---|---|
| **R_new** | After a school is disabled, how long until it can no longer obtain *new* access to protected files. |
| **R_inflight** | How long a credential the school *already obtained* (URL, token) keeps working. |
| **R_offline** | How long a copy already *downloaded to a device* stays usable. Technically unrevocable; only a client-side lease can limit it, best effort. |

The user's requirement: for restricted content, disabling a school must prevent new access to protected files within a
**clearly defined revocation period**. We therefore define it as **R = max(R_new, R_inflight)** and state R_offline separately.

### Two kinds of content (new field `access`, already carried by the seeder and the schema)

| Tier | What it is | Protection goal |
|---|---|---|
| `open` | Freely available educational content (public domain, CC0/CC-BY, our own free stories). | Signed-in school members only, to keep the service ours and cost predictable. Revocation is *not* a licensing matter. |
| `licensed` | Content a school pays for, or that a partner licenses to us for named schools only. | Real revocation: a disabled or lapsed school must stop receiving files within a defined period. |

Most of the library is expected to be `open`; the stronger (and costlier in complexity) machinery applies only to `licensed`.

## 2. What exists today (Stage 1, emulator-only)

* Storage rule `story_library/published/**`: a signed-in user with a `users` or `staff` document containing a `schoolId` may read; nobody writes.
  It does **not** consult the school's `storyLibraryEnabled` switch (the school switch only gates the catalogue and library metadata).
* Files are content-addressed (`…/assets/<hh>/<sha256>.<ext>`): the path is unguessable without the catalogue/package, but is not a secret once learned.
* No Firebase *download-token* URLs are used, and none must be: they are permanent until manually regenerated and bypass rules entirely.
* No code sets custom claims for school membership (finding S5), so any claims-based option needs new server code first.

Result today: `R_new` and `R_inflight` are **unbounded** for any user who already knows a path and still has a school profile.
That is acceptable for emulator development with synthetic data. It is **not** acceptable for production `licensed` content.

## 3. The three approaches

### A. Server-mediated access (ticket endpoint + short-lived signed URLs, the hybrid we recommend for `licensed`)

The app asks our server for a *ticket* when a story is opened: the server verifies the learner's Firebase ID token, checks the school's
entitlement, and returns signed URLs (Google Cloud Storage V4) for the package and the files the learner needs, valid for minutes.
Licensed objects live under a prefix whose Storage rule is `allow read: if false`, so the only way in is a URL our server signed.

Pure *proxying* (server streams the bytes) is rejected: `apphosting.yaml` runs `maxInstances: 1`, so media bytes through the app server would make it the bottleneck and add egress twice.

### B. Short-lived signed URLs alone (no entitlement server)

Same signed-URL mechanism, but issued by something that does not check entitlement per request (for example a batch job pre-signing everything). Included for completeness: it cannot revoke before the TTL and gives no
per-school control, so it is only "A without the check". Not recommended on its own.

### C. Claims-based access (custom claims, enforced in Storage rules)

The server stamps each user's ID token with a claim (for example `libraryLicensed: true`) and the Storage rule checks it with no Firestore lookup.
Files are fetched through the SDK (`getBytes`/`getBlob` send the user's token with every request) — never through a download URL.

## 4. Comparison

Costs use the Stage 1 model (`src/lib/story-library/cost-model.ts`, pricing verified 2026-11-07), 100,000 learners / 1,000 schools,
Option B storage design. Latency figures are **structural, not measured** (no production access); the pilot measures them (§7).

| | A. Server-mediated tickets (signed URLs) | B. Signed URLs, no entitlement check | C. Claims in Storage rules | Today's rule (`inAnySchool` lookup) |
|---|---|---|---|---|
| **R_new** | ≈ entitlement-cache TTL (server cache 60 s → **≤ 1 min**) | up to the issuing job's cadence | ≤ ID-token life (**≤ 60 min**) unless the client is forced to refresh; plus time to fan out a claim change to every user of the school | the next request after the profile changes; **does not look at the school switch at all** |
| **R_inflight** | = URL TTL (**10 min** proposed; max 1 h) | = URL TTL | none (no URL exists) — the token itself is the credential | none (no URL) |
| **R_offline** | lease only (below) | lease only | lease only | lease only |
| **Revocation scope** | per school, per story, per licence — whatever the server checks | per TTL only | per user; a school-wide change means updating every user's claims | per user profile |
| **Added latency** | +1 round trip at story open (not per file); signing 21 URLs locally ≈ negligible; then files load directly from GCS | none at open | none | +1–2 internal rules lookups per file (server side; not measured) |
| **Device caching** | Unaffected if the device cache is keyed by content hash, **not by URL** (the signed query string changes every time; the browser HTTP cache would miss, ours does not) | same | Unaffected | Unaffected |
| **Security strengths** | Entitlement checked server-side on every ticket; protected prefix unreachable otherwise; URLs expire in minutes | URLs expire | No URLs to leak; revocation does not depend on remembering to expire anything | Simple |
| **Security weaknesses** | A leaked URL works for ≤ TTL (by design); needs a signing identity (IAM) | leaked URL works for TTL; no entitlement | Up to an hour of stale access; claim-setting fan-out is new, privileged code; 1,000-byte claim budget | Unbounded stale access; school switch not enforced for files |
| **Firestore reads** | ≈ 1 entitlement read per ticket worst case: 0.96 M/month = **$0.29** (at 60% device hits); the 60 s server cache bounds it lower | 0 | 0 | 1.5 reads per file: 42.0 M reads vs 19.2 M (**+$6.8/month** of ≈ $116) |
| **New infrastructure** | App Hosting API route, a signing service account (IAM), rate limits | batch signer | claims-setting function + login/refresh flow | none |
| **Emulator testability** | Ticket logic, clock and entitlement are unit-testable with a fake signer; real signing cannot be exercised against the Storage emulator | partial | Storage rules + claims tested in the emulator exactly like Stage 1 | yes (done) |
| **Hosting load** | 0.96 M tickets/month ≈ **0.37 req/s average** at 60% hits; the *peak* (school hours) is unmeasured and must be load-tested before `maxInstances: 1` is trusted | – | none | none |

Observation that should settle the cost argument: media egress is ≈ $94 of the ≈ $109–$116 monthly estimate at 100,000 learners.
The access mechanism moves the total by **single-digit dollars**. The choice should be made on revocation, security and operational risk — not on cost.

### R_offline: copies already on a device

A child's tablet that already cached a licensed story keeps it. No server can delete a file on a device. What we *can* do, best effort:

* store licensed assets in the device cache with a **lease** (proposal: 7 days, renewed each time the learner's school entitlement is confirmed);
* refuse to open licensed content when the lease has expired and the device is online and entitlement is refused; allow it while offline until the lease ends;
* never claim this is a security boundary: a determined user can read the browser storage. It limits casual reuse and gives a defined, contractual period.

## 5. Recommendation

1. **`open` tier** — keep the Stage 1 Storage rule (signed-in school member). Optionally replace the per-file profile lookups (1.5 reads/file, +$6.8/month) with a claim later; not required. No signed URLs.
2. **`licensed` tier** — **Option A**: a separate prefix `story_library/licensed/**` with `allow read: if false`; a server **ticket endpoint** that verifies the ID token, checks the school's entitlement (school document, cached server-side for 60 s), and returns signed URLs valid **10 minutes**; the client fetches directly from GCS and caches by content hash; device lease 7 days.
   * **Defined revocation period: R_new ≤ 60 s; R_inflight ≤ 10 min; therefore R = 11 minutes** (state it as "within 15 minutes" in contracts to allow clock skew). R_offline = 7 days, best effort.
3. **Fallback if the signing infrastructure is not approved** — Option C for licensed content, with **R = 60 minutes** (ID-token life), forced client refresh on disable, and the claim fan-out job. Weaker and needs the claims code that does not exist today.
4. Do **not** adopt B on its own; do **not** use Firebase download-token URLs for anything.

## 6. What this needs before production (all require your explicit approval — none was done)

| Item | Why | Cost/IAM implication |
|---|---|---|
| A signing identity for V4 URLs (service account with signing permission, preferably keyless `signBlob`, not a downloaded key) | to mint signed URLs | IAM change; the IAM signing API has quotas to confirm |
| A ticket route in the App Hosting app + rate limiting + entitlement cache | the server side of Option A | compute on the existing app; peak load unmeasured |
| Storage rules for the `licensed` prefix (`read: if false`, publisher create-only staging like today) | blocks every other path in | rules deploy (not done) |
| Load test of the ticket route at school-hours peak against `maxInstances: 1` | the one hosting risk | a production-like test; **not run, needs approval** |
| Contract wording for R (11 min, quote 15) and R_offline (7 days, best effort) | the revocation period must be defined in writing | – |
| Content-tier labelling process: who decides `open` vs `licensed` per story, recorded in the licence block the seeder already requires | prevents licensed content landing in the open tier by mistake | process only |

## 7. Measurement plan for the unmeasured parts

In the pilot (see `docs/STORY-LIBRARY-PILOT-MEASUREMENT.md`): ticket latency p50/p95 from Ghanaian networks, ticket error rate, signed-URL expiry
mid-download rate (a child on a slow connection with a 10-minute URL), rules-lookup latency for the current rule, and the school-hours peak request rate.
Acceptance gate for Option A: ticket p95 under 1 s on a typical school connection and mid-download expiry under 0.5%; otherwise raise TTL to 30 min before changing the architecture.

## 8. Decision requested

Approve in principle: **two tiers; Option A for `licensed`; R = 11 minutes (quoted 15), R_offline = 7 days best effort; Option C as the documented fallback.**
Implementation (Stage 3+) would be emulator-first, with the IAM, rules deploy and load test each waiting on separate approvals.
