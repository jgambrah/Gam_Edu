# Before and after implementation

| Item | Before (a3706446) | After |
|---|---|---|
| Enrichment-scope tests | 242 total · 240 pass · 2 fail · 1 empty suite | 336 total · 0 fail |
| Whole repo | 3,699 · 1 fail (unrelated) | 3,726 · 1 fail (same unrelated) |
| tsc errors | 423 | 418 (enrichment area 5 → 0) |
| Dot plot | ≤10 dots per value drawn | every observation drawn |
| Pictogram | ≤20 symbols; quarter-unit rounding | no truncation; nearest half-symbol; exact frequency printed |
| Frequency polygon | plotted frequency density, open ends | frequency vs mid-points (density only for unequal widths), closed to axis |
| Histogram / cumulative / bar | no numeric y-axis | 0 / half / max ticks + axis titles |
| Mode of [3,3,3] / [1,1,2,2] | "no mode" | 3 / bimodal 1 and 2 |
| Safeguarding phrases executed by vitest | 0 | 60 |
| Ask-Teacher endpoint | anonymous; header-bypassable limit | verified user required; limit per uid |
| Sanitiser test dependency | dompurify 2.5.8 (drift) | locked 3.5.0 |
| Engines / versions / production versions | — | unchanged |
