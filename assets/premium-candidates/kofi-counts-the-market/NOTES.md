# Ultra-Plan Candidate Test: *Kofi Counts the Market* (Pages 1 & 2)

- **Status**: `CANDIDATE ONLY — UNAPPROVED` (none of these files are marked approved or wired into the live library).
- **Date Generated**: `2026-11-08` (`2026-11-08T00:07:35Z` – `2026-11-08T00:09:28Z` UTC)
- **Branch**: `story-spark-2.0-central-library` ONLY

---

## 1. Tool, Model & Plan Used

| Field | Exact Value |
| :--- | :--- |
| **Plan** | **Google AI Ultra** (Antigravity built-in agent environment under the user's Ultra subscription; no external `GEMINI_API_KEY` or Cloud/API billing used) |
| **Tool** | Antigravity `image-generator` subagent (`generate_image` tool) |
| **Underlying Model / Service** | Google Imagen 3 via Gemini / Antigravity Media Processing Services (`Google C2PA Core Generator Library v1015218911`) |
| **Date (UTC)** | `2026-11-08` (C2PA timestamp authority token: `20261108000735Z0`) |

---

## 2. Watermark & SynthID / "AI-Generated" Label Inspection

### A. Visible Watermarks or Labels on Image Pixels
- **Visible watermark, logo, corner badge, or text label**: **NONE** (`0` of `6` images contain any visible watermark, corner icon, text, letters, or numbers anywhere in the frame).

### B. Imperceptible SynthID & Embedded File Metadata (C2PA / IPTC)
- **Raw Generator Output (`1200×896` JPEG before WebP conversion)**:
  - Contains a cryptographically signed **C2PA v2 JUMBF manifest** (`Google LLC` / `Google C2PA Media Services 1P ICA G3`) in the JPEG header with two verbatim `c2pa.actions.v2` assertions:
    1. `c2pa.created`: `"Created by Google Generative AI."` (`digitalSourceType: http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`)
    2. `c2pa.edited`: `"Applied imperceptible SynthID watermark."` (`digitalSourceType: http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`)
- **Converted WebP Candidates (`960×717` WebP, `quality: 78`)**:
  - Standard `sharp` WebP encoding does not copy the JPEG JUMBF/C2PA header container (`RIFF/WEBP/VP8` bitstream only), while the **imperceptible pixel-level SynthID watermark** remains embedded in the image pixels.

---

## 3. Verbatim Plan & Service Terms (Commercial Use, School Use, Automated Generation)

1. **Ownership of Generated Content & Commercial Use** — [Google Terms of Service](https://policies.google.com/terms?hl=en) (*Content in Google services → Your content*):
   > *"Some of our services allow you to generate original content. Google won’t claim ownership over that content."*
   >
   > *"Your content remains yours, which means that you retain any intellectual property rights that you have in your content."*
   - **Consumer Definition Note** ([Google Terms of Service — Definitions](https://policies.google.com/terms?hl=en)):
     > *"consumer: An individual who uses Google services for personal, non-commercial purposes outside of their trade, business, craft, or profession."*
   - **What could not be found**: The public [Google One Terms of Service](https://one.google.com/terms-of-service?hl=en) and [Generative AI Additional Terms of Service](https://policies.google.com/terms/generative-ai?hl=en) do not contain a separate clause explicitly granting or restricting commercial resale/redistribution of consumer-tier Ultra outputs beyond Google's statement above that *"Google won’t claim ownership over that content."*

2. **School & Organizational Use** — [Google Terms of Service](https://policies.google.com/terms?hl=en) (*Using Google services on behalf of an organization or business*) & [Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy?hl=en):
   > *"Many organizations, such as businesses, non-profits, and schools, take advantage of our services. To use our services on behalf of an organization: an authorized representative of that organization must agree to these terms; your organization’s administrator may assign a Google Account to you. That administrator might require you to follow additional rules and may be able to access or disable your Google Account."*
   >
   > *"We may make exceptions to these policies based on educational, documentary, scientific, or artistic considerations, or where harms are outweighed by substantial benefits to the public."*

3. **Automated Generation & Abuse Restrictions** — [Google Terms of Service](https://policies.google.com/terms?hl=en) (*Don’t abuse our services*):
   > *"You must not abuse, harm, interfere with, or disrupt our services or systems — for example, by: ... misleading others into thinking that generative AI content was created by a human; providing services that appear to originate from you (or someone else) when they actually originate from us; ... using automated means to access content from any of our services in violation of the machine-readable instructions on our web pages (for example, robots.txt files that disallow crawling, training, or other activities); using AI-generated content from our services to develop machine learning models or related AI technology."*

---

## 4. Usage Limits & Cost Outside Ultra Subscription

- **Images Generated**: `6` of `6` requested (`3` for Page 1, `3` for Page 2) in a single batch.
- **Usage / Rate Limits Hit**: **None** (`0` rate-limit errors, `0` quota blocks, `0` retries).
- **Cost Charged Outside the Ultra Subscription**: **`$0.00`** (no paid Gemini API key or Google Cloud billing was called).

---

## 5. Candidate Files, Sizes & Raw Visual Notes (Unedited / Unretouched)

All 6 files were converted directly from the raw `1200×896` generator output to `960×717` (`4:3` landscape) WebP at `quality = 78` with **no cropping, retouching, or pixel edits**:

| File | Page | Dimensions | Quality | Size (Bytes) | Size (KB) | SHA-256 | Raw Visual Notes for Reviewer |
| :--- | :---: | :---: | :---: | ---: | ---: | :--- | :--- |
| `kofi-p1-a.webp` | 1 | `960×717` | `78` | `74,334` | `72.6 KB` | `3a1f758696be32c24959100f2bde91312d836cedc29857861de0c3c0ed385105` | Full body Kofi & Mama holding hands at market entrance; striped umbrellas, tomatoes, onions, mangoes, plantains. No text. |
| `kofi-p1-b.webp` | 1 | `960×717` | `78` | `67,120` | `65.5 KB` | `59625de684df32031b307100d3da12d1de6525c19317e05ba3a36bfd16c88fbd` | Warm golden market lane; Kofi & Mama holding hands; consistent clothing and basket. No text. |
| `kofi-p1-c.webp` | 1 | `960×717` | `78` | `68,738` | `67.1 KB` | `fb8659cb48c3ff4d56f25bcb9f0753935daeece9e231c8cec411ba4895aa9022` | Bright market entrance; Kofi looking up at Mama excitedly; stalls of tomatoes, onions, mangoes, plantains. No text. |
| `kofi-p2-a.webp` | 2 | `960×717` | `78` | `45,706` | `44.6 KB` | `bf72695c41b36de0d94740028642e510dcb55f4d16b3dd6f1906adad8127642a` | One large red tomato in center of wooden table with Kofi pointing and Mama behind; note a woven basket of extra tomatoes is visible at the right edge of the table. |
| `kofi-p2-b.webp` | 2 | `960×717` | `78` | `52,136` | `50.9 KB` | `939b9f26a9e2c82ae15de72b5cab0c1e106aaadcf10082306537507e7be2966b` | One single large red tomato on the wooden table in front of Kofi; note 2 small tomatoes sit on a separate cloth-covered stall at the far left edge. |
| `kofi-p2-c.webp` | 2 | `960×717` | `78` | `54,250` | `53.0 KB` | `b5df8b77fa4f2ededa5dc80280a48b82e818d00fc6c3b7a37d94d803564d8756` | One large red tomato on the center wooden table with Kofi pointing; note an out-of-focus basket of tomatoes in the bottom-right foreground. |
