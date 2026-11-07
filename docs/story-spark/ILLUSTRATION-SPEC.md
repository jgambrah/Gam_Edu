# Premium illustration specification and pipeline

*Status: specification only. No image has been generated, bought or approved. The preview shows labelled placeholders (emoji on a gradient) and says so on every picture and in the story’s status panel.*

Code: `src/lib/story-library/illustration/plan.ts` (types, prompt assembly, validation, status, dry-run cost) and `style.ts` (the shared style bible). Efua’s plan: `pilot/efua-premium.ts`. Tests: `pilot/efua-premium.test.ts`.

## 1. The look: "Story Spark Cinematic 3D"

Warm, cinematic 3D-rendered storybook illustration: soft global illumination, rounded appealing character design, expressive faces, richly detailed Ghanaian environments, gentle depth of field. **Original design: not imitating any studio, film or existing character.**

* **Lighting:** warm natural light (golden hour, soft window light, lamp light), gentle rim light, never harsh or frightening.
* **Camera:** child-eye or slightly low storybook camera (35-50 mm equivalent), clear foreground / midground / background, one focal point per image.
* **Palette:** laterite red `#B5532F`, golden groundnut `#E0A030`, forest green `#2F6B3F`, kente indigo `#2E3F8F`, cream `#FBF1DD`, deep cocoa `#4A2C20`.
* **Must have:** consistent character designs; authentic everyday Ghanaian detail shown with dignity; natural variety in skin tones, hair and body types among background characters.
* **Must avoid:** emoji, icons or clip-art; stereotyped or demeaning depictions; poverty as spectacle; readable text, signs, logos, watermarks, brand names; existing characters or recognisable studio styles; frightening imagery; malformed hands and faces.

## 2. Consistency system

Each story has **character sheets** (age, build, face, hair, skin, clothing, props, personality, expression range, *consistency anchors*, do-not list), **setting sheets**, and a **shot list** (cover plus every page: setting, characters with expression and pose, action, camera, lighting, must-show details, calm zone for text, alt text). `assemblePrompt()` combines them deterministically, so the same inputs give the same prompt and a comparable prompt hash. Characters that recur (`recurringCharacters()`) get a **reference image generated and approved first**; every later page is generated against that reference.

Efua’s plan: four characters (Efua, Nana Ama, Kwabena, Auntie Dede), four settings (kitchen, bedroom at night, school gate, market), 13 shots. Anchors include Efua’s two hair puffs, dimple and blue exercise book; Nana Ama’s indigo-and-gold wrapper and spectacles on a cord; Kwabena’s close-cropped hair and untucked shirt; Auntie Dede’s red-and-gold head-tie and tomato pyramid. The uniform is a **fictional** one (cream and green), so no real school is depicted.

## 3. Mobile and low-bandwidth delivery

* Master 1600×1200 (4:3). Delivered as AVIF (preferred) with WebP fallback at widths 480, 960 and 1440.
* Budgets: at most 90 KB at 960 px and 30 KB at 480 px per image; a story’s low-bandwidth set at most 450 KB (13 images × 30 KB = 390 KB).
* The reader’s existing cache and look-ahead loader fetch the next page’s image; the 480 px set is used on slow connections.
* Text sits in a calm zone; no text is baked into any image, so highlighting and translation work.

## 4. Status model (nothing is "illustrated" until it truly is)

`brief → placeholder → candidate → approved | rejected`. `illustrationStatus()` counts a page as illustrated **only when an approved image *file* exists**. An "approved" record with no file counts as nothing. The reader’s status panel shows, for Efua today: **0 of 13 approved image files exist, 0 candidates, 13 placeholders**. Emoji and generic placeholders are never publishable; readiness blocks a page without an approved illustration and alt text.

## 5. Sample-first process (the gate you asked for)

1. You approve the style bible and Efua’s character sheets in writing (they are in the repository to edit).
2. **One** sample is generated: Efua, page 1 (kitchen with Nana Ama) because it carries the two main characters, the setting and the lighting. Dry-run estimate for the whole of Efua: 65 images, about $4.36 at 1K (about $6.57 at 2K). The single sample is about $0.40 including retries. **Needs your approval of the model, the billing project and the spend.**
3. An art reviewer checks: face and hand quality, skin-tone rendering and dignity, cultural accuracy of cloth and kitchen, consistency with the sheet, readability on a phone, file size.
4. Only after approval are the 12 other pages generated, then compressed and reviewed in the preview.
5. Every approved file records its prompt hash, generator, reviewer and date, and the licence/terms of the generator for commercial use must be checked and stored with it.

## 6. Open risks

* Image models can drift on faces and clothing between pages. The reference-image-first approach reduces this; it does not remove it. Budget retries and reviewer time.
* AI-generated skin tones, hair and cultural dress can be rendered poorly or stereotypically. A Ghanaian reviewer must approve every image.
* The model named in the current code (`imagen-4.0-fast-generate-001`) may be retired; the Gemini image models are the likely replacement. Verify Google’s current terms, pricing and availability before approving spend.
* A human illustrator (or an art director guiding generation) will produce a stronger result for flagship titles. Quotes are needed; none has been invented here.
