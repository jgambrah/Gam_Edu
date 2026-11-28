# Recommendations for the remaining roadmap

1. **Pause new engines briefly; close verification first.** The defects found were in rendering/tests, so the next risk is *other engines' renderers* (measurement-lab rendered scales, atom-bond, circuits, geometry SVG) never being checked against their own maths. Run the same "render-vs-model" audit on each before Step 5F/5G.
2. **Step 5F (primary manipulatives): proceed after** (a) a shared pointer-based non-drag interaction pattern is chosen, (b) large-touch-target requirements are written into the standard, (c) exact rational/integer-pesewa models are unit-tested independently as done for cube nets.
3. **Step 5G (physics workbench): proceed, bounded.** Use closed-form models (reflection, refraction/critical angle, moments); no general physics engine; independent hand fixtures first.
4. **Step 5H (visual programming): wait** until D-010 (worker isolation) is settled — a block-to-Python bridge multiplies the same-origin execution risk. Reuse the legacy `BlocklyEditor.tsx` history only after review.
5. **Step 6 (comprehensive verification): schedule browser/mobile/a11y/performance work now** — it is the largest unverified area (see register) and should not wait for Step 6.
6. **CI hardening (cheap, high value):** `npm ci`; run the math oracle and assert zero discrepancies; run `svg-sanitizer*` and `architecture-boundaries` as a required gate; ratchet tsc error count (418) downward; add `next build` to CI.
7. **Owner decisions needed:** activate construction-lab 1.4.0–1.6.0 and sort-classify in production (D-013); confirm whether `dashboard/clubs` and `dashboard/resources` belong behind the gate (D-017); supply earlier kits (D-018); choose a shared store for Ask-Teacher global cap.
