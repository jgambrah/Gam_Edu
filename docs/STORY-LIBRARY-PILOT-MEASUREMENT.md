# Story Library: pilot measurement strategy

Status: **strategy for approval. Nothing is instrumented, deployed or collected.**

## Why

The 60% device cache-hit rate is a **planning figure only**. Our simulation (provisional behaviour assumptions, library of 1,000 stories) gives about **39% of story opens served with no network on personal devices and about 76% on shared class devices**, so
the real blend depends on the share of learners on shared devices and on reading behaviour — both unknown. The pilot's job is to replace those assumptions with data, and to validate the cost model against a real bill.

## Definitions (fixed before the pilot so numbers are comparable)

* **Zero-network open**: a story open that issued **no** Storage request (package and every viewed asset came from the device cache). This is what `deviceCacheHit` in the cost model means.
* **Object hit rate**: share of requested objects served from cache (finer; includes partly cached opens).
* **Device class**: `shared` (≥ 3 distinct learner accounts used the device in the period) or `personal` (1–2). Declared by the school at onboarding as a prior, **verified by the observed learner count**, never assumed.

## What the app records (aggregate counters only — no child identifiers, no content of reading)

Per device per day, held locally and sent as **one batched document per device-day** (not per event):

| Counter | Used for |
|---|---|
| opens, zero-network opens | deviceCacheHit by stratum |
| storage requests, bytes, cache hits (by package / image / audio) | requests and egress per learner-month; lazy-loading factors |
| catalogue Firestore reads (meta, pages, delta) | reads per session at the real library size |
| distinct learner accounts seen on this device (a count, not ids) | shared/personal classification |
| cache size and eviction/cleared-storage events | cache-loss rate assumption |
| story popularity (per-story open counts, bucketed) | fit the popularity skew and assigned/re-read shares |
| ticket latency and expiry-mid-download (licensed content, once built) | access-control gate |

Privacy: counters are not linked to a child or a name; the device-day record carries `schoolId`, an opaque device id that rotates monthly, a device class, app version and date.
Kept 13 months; school admins can see their own school's totals. Needs a short school-facing notice and your sign-off before collection.

## Pilot design

* **10 schools, stratified**: 4 shared-device-heavy (class tablets/computer lab), 4 personal-device-heavy (phones/tablets at home or school), 2 mixed. Vary connectivity (strong, weak, intermittent) and school size.
* **Duration**: 6 weeks minimum, including at least one new-story publish and one term-boundary week (devices get reset/re-shared).
* **Library**: the real size at pilot time; record it, because hit rate falls as the library grows (simulation: 51% at 100 stories → 39% at 1,000 → 32% at 10,000 on personal devices).
* **No special load**: normal use only; no production load test is part of the pilot.

## Analysis and decision rules

1. Report `deviceCacheHit` per stratum with a 95% confidence interval; **replace the planning figure only when the interval half-width is ≤ 5 points** in each stratum.
2. Blend by the schools' actual shared/personal learner counts; keep 60% as the planning figure until then.
3. Re-run the simulation with the measured popularity skew, assigned share, re-read share and cache-loss rate; compare predicted to observed per stratum. If any metric is off by more than 15%, the model — not the app — gets corrected.
4. Reconcile the real invoice (Firestore reads/writes, Storage operations and egress) against the model per learner-month; investigate any line more than 25% from the model.
5. Pass criteria carried into the go/no-go: catalogue reads per session flat vs library size, progress writes per open ≤ 1.5, Storage requests per learner-month within the modelled range.

## What the pilot does not decide

Region/CDN choice (D8, deferred), the licensed-content access mechanism's production parameters (gated separately in the access-control proposal), and any paid AI generation (not approved).

## Decision requested

Approve the definitions, the counter set and the stratified design. Collection would start only after a later, separately approved production step.
