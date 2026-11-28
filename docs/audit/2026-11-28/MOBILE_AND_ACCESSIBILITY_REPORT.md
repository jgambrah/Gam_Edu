# Mobile usability & accessibility

**No browser, device, screen-reader or keyboard-only testing was performed this session; no screenshots exist.** Presence of ARIA attributes in code is not treated as evidence of accessibility.

## What the code/tests show (read or existing tests)
- Measurement-lab has an existing test asserting a **non-visual alternative that does not leak the answer in `aria-label`** (passes).
- Data-visualisation charts expose `role="img"` and `aria-label`s; pictogram rows have `aria-label="<label>: <frequency>"`. After this audit the pictogram also prints the exact frequency visibly and charts print numeric y-axis ticks.
- Colour independence: pie/legend use colour **and** printed label + percentage; histogram bars carry class labels. Pictogram and dot plot do not rely on colour alone.
- Low-Data Mode exists in the player settings popover and is covered by an existing test (zero pointer network requests).
- Reduced-motion CSS for the teacher pointer is asserted by an existing test.
- The Teacher Pointer / Low-Data controls live inside a collapsed "Lesson settings" popover (two tests had to be updated for that — D-001). Whether that popover is keyboard/focus-trap correct was **not tested**.

## Not verified
360 px portrait, landscape, tablet, touch-target size (especially young-learner engines), focus management, screen-reader announcements, zoom/large text, drag-and-drop non-drag alternatives for sort-classify and geometry, chart legibility on small screens (SVG text at `fontSize` 7–8 in a 360-unit viewBox may be too small on phones — **likely issue, unconfirmed**).
