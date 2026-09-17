# English Level Up — Paper UI Asset Guide

## Purpose
This file is the canonical visual implementation guide for the Paper UI redesign of English Level Up.

Use this guide before browsing the original asset pack again. The goal is to avoid repeatedly re-auditing 1,410 PNGs, prevent ad-hoc asset choices, and keep every screen inside one coherent visual system.

Source pack: `Humble Gift - Paper UI System v1.1`
Creator: Humble Pixel / `@Humblepixel`
License summary: commercial and non-commercial use allowed; modification allowed; redistribution/resale of the assets themselves is not allowed; assets cannot be used as a logo/trademark; credit appreciated but not mandatory.

## Product direction

**Concept:** English Level Up is a personal learning journal / player-status book.

- Desktop: an open two-page book on a desk.
- Mobile: a single full-width page, not a compressed two-page spread.
- Page-turn animation is visual feedback only. Navigation must also work through persistent chapter tabs and previous/next controls.
- Existing Supabase data, pedagogy, Daily Five, XP, coins, sprints, benchmarks, skills, sessions, analytics, and profile logic remain unchanged.
- Tiny Swords is not part of the new visual system.
- Do not mix asset packs.

## Asset-pack inventory

- `Sprites/Book Desk`: 7 backgrounds, each 768×560.
- `Sprites/Paper UI Pack/Folding & Cutout`: 69 modular/composite UI PNGs.
- `Sprites/Paper UI Pack/Plain`: 68 modular/composite UI PNGs.
- `Sprites/Content`: 240 PNGs.
- `Sprites/Content Appear Animation`: 884 PNG frames.
- `Sprites/Day & Night Cycle`: 140 PNG frames.
- `SpriteSheet`: 2 full sprite sheets.
- `Aseprite`: source files plus animated source files.

---

# 1. Global shell / Book system

## 1.1 Desktop background
Primary asset:
- `Sprites/Book Desk/5.png` — warm wooden desk, neutral enough to keep the book readable.

Fallback:
- `Sprites/Book Desk/4.png` — more decorative corners.

Avoid as default:
- `Book Desk/1.png`, `2.png`, `3.png` because their central circle competes with the rectangular book.
- `6.png`, `7.png` because their palette is less aligned with the cream-paper system.

Runtime alias planned:
- `/paper-ui/desk-main.png` ← `Book Desk/5.png`

## 1.2 Book pages
Do **not** stretch a precomposed PNG to become a full page. Build the page as a responsive HTML/CSS surface using the pack's modular paper pieces.

Primary page border set (`Paper UI Pack/Plain/1 Paper`):
- left edge: `10.png`
- top-left corner: `11.png`
- top edge: `12.png`
- top-right corner: `13.png`
- right edge: `14.png`
- bottom-left corner: `15.png`
- bottom edge: `16.png`
- bottom-right corner: `17.png`

These eight assets form a consistent edge/corner system and should be treated like a 9-slice frame around a CSS paper fill.

Secondary/darker frame set:
- `Plain/1 Paper/27.png` through `34.png`

Page fold accents / decorative curl pieces:
- `Folding & Cutout/1 Paper/43.png` through `56.png`
Use sparingly at corners, page-turn affordances, or overlays. Do not use them as stretched page backgrounds.

Planned runtime aliases:
- `/paper-ui/page/edge-left.png`
- `/paper-ui/page/corner-tl.png`
- `/paper-ui/page/edge-top.png`
- `/paper-ui/page/corner-tr.png`
- `/paper-ui/page/edge-right.png`
- `/paper-ui/page/corner-bl.png`
- `/paper-ui/page/edge-bottom.png`
- `/paper-ui/page/corner-br.png`

## 1.3 Book spine / gutter
No source PNG is a complete book spine. Construct it with CSS shadow + paper-edge accents from the same pack.

Rules:
- Desktop only: central gutter shadow between left/right pages.
- No faux 3D perspective that distorts text.
- Mobile: gutter removed entirely because only one page is rendered.

## 1.4 Chapter tabs
Primary family:
- `Sprites/Content/10 Banners & Headers/Cutout/9.png`
- `10.png`
- `12.png`
- `13.png`
- `15.png`
- `16.png`
- `18.png`
- `19.png`

Planned mapping:
- Dashboard: tab shape `9.png`
- Skills: `12.png`
- Sessions: `13.png`
- Analytics: `15.png`
- Profile: `18.png`

Text remains HTML, never baked into images. Selected tab gets stronger contrast and green accent.

## 1.5 Previous / next page controls
Use sliced button pieces instead of arbitrary CSS arrows.

Right/next candidates (`Content/4 Buttons/Sliced`):
- normal: `16.png` + `17.png` + `18.png`
- highlighted: `19.png` + `20.png` + `21.png`

Left/previous candidates:
- normal: `28.png` + `29.png` + `30.png`
- highlighted: `31.png` + `32.png` + `33.png`

The three pieces assemble horizontally so the control can scale without distorting the arrow end cap.

## 1.6 Mobile shell
At `<= 720px`:
- render one page only;
- no two-page spread;
- no forced book aspect ratio;
- chapter tabs remain directly accessible;
- previous/next controls remain visible but secondary;
- page transition is short and optional under `prefers-reduced-motion`.

Validation widths: 360, 390, 430, and 768 px.

---

# 2. Dashboard chapter

Working title: **Current Chapter / Current Status**.

## Left page — Player / Learning Status
Header:
- `Paper UI Pack/Folding & Cutout/2 Headers/1.png`

Primary status frame:
- `Paper UI Pack/Folding & Cutout/6 Player HUD/1.png` (288×160)

Use for:
- learner level
- XP summary
- current skill index
- Sprint ID/progress summary

XP/progress bar:
- green set: `Content/3 Progress Bars/10.png`, `11.png`, `12.png`
- alternate teal set: `13.png`, `14.png`, `15.png`

Coins icon:
- `Content/2 Icons/21.png`

Book/learning icon:
- `Content/2 Icons/23.png` or `24.png`

Small circular stat holders:
- `Content/5 Holders/1.png`, `2.png`, `3.png`, or `23.png`

## Right page — Next Training
Header:
- `Folding & Cutout/2 Headers/4.png`

Priority skill rows:
- visual reference: `Folding & Cutout/3 Item Holder/1.png`
- implementation should use a responsive paper-row component in the same visual language rather than vertically stretching the 592×144 PNG.

Reviews Due callout:
- `Folding & Cutout/4 Notification/2.png`

Daily Five:
- `Folding & Cutout/9 Rewards/2.png`
- five slots based on `Content/5 Holders/5.png` / `25.png`
- completion check: `Content/2 Icons/10.png`

No Journey Map. Sprint progression is represented through status/progress and later Sprint/Benchmark records.

---

# 3. Skills chapter

Working title: **Skill Record**.

Primary header:
- `Folding & Cutout/2 Headers/2.png` or `3.png` depending on title width.

Domain section title:
- `Content/10 Banners & Headers/Cutout/4.png` or `7.png`.

Skill row/card:
- visual language from `Folding & Cutout/3 Item Holder/1.png`.
- score/status holder: `Content/5 Holders/5.png` or `25.png`.

Review highlight:
- `Content/6 Highlighter/5.png` or `6.png`, only for meaningful review state.

Observed/completed state:
- `Content/2 Icons/10.png`.

Skill detail overlay:
- `Folding & Cutout/7 Dialogue Box/1.png`.

Score, observations, confidence, due-review state, and trend remain normal HTML text.

---

# 4. Sessions chapter

Working title: **Training Journal**.

Header:
- `Folding & Cutout/2 Headers/3.png`

Calendar/day navigation:
- `Folding & Cutout/10 Calander/1.png` (656×544), only if it improves navigation.

Session row:
- paper-row component based on `Folding & Cutout/3 Item Holder/1.png`.

Date/day callout:
- `Folding & Cutout/4 Notification/1.png`.

Session detail:
- `Folding & Cutout/7 Dialogue Box/1.png`.

Completion mark:
- `Content/9 Stamp/Stamp Mark/1.png`.

Session Detail keeps Objective, Main Difficulty, Strongest Improvement, Corrections, Skills Observed, Duration, and qualifying status.

---

# 5. Analytics chapter

Working title: **Progress Record**.

This is the least decorative chapter.

Header:
- `Paper UI Pack/Plain/2 Headers/4.png`.

Large data panels:
- `Plain/9 Rewards/1.png` visual language.
- `Plain/9 Rewards/2.png` for compact horizontal summaries.

Graph background:
- plain CSS parchment using the Plain page-frame set (`Plain/1 Paper/10–17`).

Charts remain normal SVG/CSS/chart components. Do not pixel-art the data.

Benchmark callout:
- `Plain/4 Notification/2.png`.

Use Plain rather than Folding & Cutout here to protect readability.

---

# 6. Profile chapter

Working title: **Player Status**.

Primary frame:
- `Folding & Cutout/6 Player HUD/1.png`.

Header:
- `Folding & Cutout/2 Headers/1.png`.

Stats/reward area:
- `Folding & Cutout/9 Rewards/1.png`.

XP bar:
- `Content/3 Progress Bars/13.png`, `14.png`, `15.png`.

Coins:
- `Content/2 Icons/21.png`.

Future cosmetics/equipment slots, visual preparation only:
- `Content/8 Equipment/1.png` through `18.png`
- holders: `Content/5 Holders/1–8.png`

Do not add a shop or cosmetics feature during this redesign phase.

---

# 7. Reserved assets / not used in V1

Reserved:
- `Paper UI Pack/*/8 Shop/1.png`
- `Paper UI Pack/*/5 Mini Map/1.png`
- most `Content/1 Items`
- `Day & Night Cycle`
- most `Content Appear Animation`
- equipment mechanics

Reason: cohesion and function come first; we do not use assets just because they exist.

---

# 8. Animation policy

Permitted:
- short page-turn/fold transition on navigation;
- opening Session Detail / Skill Detail with subtle paper unfold;
- selected chapter-tab micro-transition.

Not permitted:
- continuous decorative animation;
- animations tied to lesson completion while the user is not on the site;
- long transitions delaying information;
- motion that changes content dimensions and causes layout shift.

Timing target: 220–400 ms.
Respect `prefers-reduced-motion: reduce`.

---

# 9. Technical implementation rules

1. Never use `background-size: 100% 100%` on a framed paper asset if it changes aspect ratio.
2. Prefer 9-slice/border-image, repeating edge sprites, sliced button assembly, and CSS paper fill + pack corners/edges.
3. Before positioning a new PNG, inspect its alpha bounding box. This specifically prevents the clipping problems seen in the Tiny Swords experiment.
4. Keep source assets and runtime aliases separate.
5. Only copy selected runtime assets into `public/paper-ui/`; do not dump all 1,410 PNGs into the app.
6. Maintain one component vocabulary: `PaperShell`, `BookSpread`, `BookPage`, `BookTab`, `PageControls`, `PaperHeader`, `PaperPanel`, `PaperButton`, `PaperProgress`, `PaperHolder`, `PaperStamp`, `PaperDialog`.
7. No Tiny Swords imports inside Paper Book components.
8. Data components remain semantic HTML and responsive; assets frame/decorate them rather than define their content dimensions.

---

# 10. Implementation order / approval gates

## Stage 1 — Book Shell + Navigation
Build only:
- desk background
- responsive open-book shell
- two desktop pages
- one mobile page
- chapter tabs
- previous/next controls
- page-transition skeleton
- placeholder page content only

Do **not** redesign Dashboard content until this shell is approved on desktop and mobile.

## Stage 2 — Dashboard
Use the mapping in section 2.

## Stage 3 — Skills
Use section 3.

## Stage 4 — Sessions
Use section 4.

## Stage 5 — Analytics + Profile
Use sections 5 and 6.

## Stage 6 — QA / Cleanup
Validate 1366×768, 1440×900, 1920×1080, 360px, 390px, 430px, and tablet. No horizontal overflow, no distorted images, no clipped alpha content, key state understandable in <5 seconds. Remove old Tiny Swords/theme CSS only after the Paper Book branch is approved.

---

# 11. Branch and source-of-truth policy

Branch: `paper-book-v1`

`main` stays untouched until the complete redesign is approved.

This guide is the canonical design/asset source of truth for the branch. If implementation needs an asset not listed here, update this guide first with source path, intended screen/component, reason, and runtime alias; only then implement it.
