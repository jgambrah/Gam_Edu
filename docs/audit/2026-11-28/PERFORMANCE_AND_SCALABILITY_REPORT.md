# Performance & scalability

**Nothing was measured in a browser this session.** No bundle analysis, compressed transfer sizes, Core Web Vitals, low-end Android runs or load tests were performed. Source-file sizes below are *not* browser transfer sizes.

## What is known (source facts)
- Engines are selected through `InteractiveEngineRegistry.tsx`; construction-lab adapters are intended to be independently lazy-loaded (per the engine description). Lazy-loading was **read, not measured**.
- Largest enrichment source files (KB, uncompressed): GeometryConstructorLab 48.3 · MeasurementLab 43.5 · AtomBondLab 43.2 · DataStatsLab 40.7 · ProcessStepperEngine 33.2 · DiagramHotspotsEngine 29.3 · GraphSliderEngine 28.0 · SortClassifyEngine 24.2.
- `NarratedLessonPlayer.tsx` is 2,312 lines (the player loads for every lesson).
- Math oracle throughput: 10,000 evaluations in ~1.3 s on the audit machine (≈0.13 ms/case; p95 ≈ 1.2 ms for multi-step) — evaluator CPU cost is negligible.
- Data-stats: datasets capped at 200; trials 5,000; dot-plot stacks now compress rather than draw unbounded dots (max 200 circles per value).
- The Ask-Teacher endpoint's in-memory caches/counters are per serverless instance.
- `jspdf` is bundled for the finance statement PDF (core feature, not enrichment).

## Not done (see register)
Per-route bundle measurement, compressed transfer, cold/warm load timing, hydration cost, low-data mode measurement, Firestore read/write accounting for enrichment progress, CDN caching headers review, AI-credit cost model, scalability model for 1,000 lessons / 10,000 learners / multiple schools. **No cost model is offered because no assumptions were validated.** Suggested next step: `next build` with `@next/bundle-analyzer`, then Lighthouse (mobile, throttled) on one lesson route per engine.
