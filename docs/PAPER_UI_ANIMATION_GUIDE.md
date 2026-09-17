# Paper UI Animation Guide

This file is the canonical motion reference for the `paper-book-v1` redesign. Check it before searching the source ZIP again.

## Stage 1.3 decision

The Paper UI pack exports **component appear/disappear sequences**, not a dedicated full-book page-turn image sequence.

The Aseprite source includes the tags/layers `Content Appear Animation` and `Appear Animation`. The exported PNG sequences behave as component unfolds: frame 1 is the complete component and the last frame is empty, so **play the frames in reverse order to create an appearance animation**.

Because there is no dedicated page-turn export, the chapter page turn is implemented with CSS 3D using the existing Paper UI page surface and edge assets. This avoids stretching animation frames and keeps the book responsive on desktop/mobile.

## Page turn primitive — Stage 1.3

Purpose: chapter navigation only.

Implementation:
- persistent desk/book shell
- forward = right leaf rotates from right to left around the gutter
- backward = left leaf rotates from left to right around the gutter
- moving leaf reuses `/paper-ui/page/10.png`, `/paper-ui/page/12.png`, `/paper-ui/page/14.png`
- paper color/surface matches the existing book page
- chapter copy swaps only around the edge-on midpoint
- desktop duration: ~470 ms
- mobile duration: ~420 ms
- `prefers-reduced-motion`: no 3D page turn
- navigation locked only during the short turn, preventing queued/double turns

No new licensed animation PNG frames are required for the page-turn primitive.

## Exported component animation inventory

All paths below are relative to:
`Sprites/Content Appear Animation/`

### Folding & Cutout
- `1 Headers/1`: 35 frames, 448×112
- `1 Headers/2`: 28 frames, 336×112
- `1 Headers/3`: 28 frames, 336×96
- `1 Headers/4`: 28 frames, 352×64
- `2 item Holder`: 40 frames, 560×80
- `3 Rewards/1`: 32 frames, 384×144
- `3 Rewards/2`: 34 frames, 384×80
- `4 Notification/1`: 23 frames, 240×48
- `4 Notification/2`: 24 frames, 272×48
- `5 Mini Map`: 20 frames, 160×160
- `6 Player HUD`: 22 frames, 224×96
- `7 Dialogue Box`: 44 frames, 624×128
- `8 Shop`: 36 frames, 288×336
- `9 Calender`: 49 frames, 560×432

### Plain
- `1 Headers/1`: 35 frames, 480×112
- `1 Headers/2`: 28 frames, 336×112
- `1 Headers/3`: 28 frames, 336×96
- `1 Headers/4`: 28 frames, 352×80
- `2 item Holder`: 40 frames, 560×80
- `3 Rewards/1`: 32 frames, 384×144
- `3 Rewards/2`: 34 frames, 384×80
- `4 Notification/1`: 23 frames, 240×48
- `4 Notification/2`: 22 frames, 240×48
- `5 Mini Map`: 20 frames, 160×160
- `6 Player HUD`: 22 frames, 224×96
- `7 Dialogue Box`: 44 frames, 624×128
- `8 Shop`: 36 frames, 288×336
- `9 Calender`: 49 frames, 560×432

## Planned motion ownership

Do not add an animation because it looks interesting. Each family has one job.

- **Page Turn** → chapter navigation. Custom responsive CSS 3D using the pack's page assets.
- **Headers** → section/header reveal after page turn. Consider reverse PNG sequence when the real Dashboard/Skills content exists.
- **Item Holder** → reveal/select skill/session holder components.
- **Player HUD** → Profile / player-status reveal.
- **Dialogue Box** → opening Session Detail / Skill Detail.
- **Rewards** → future reward/achievement reveal only.
- **Calendar** → Sessions history/calendar opening.
- **Shop** → future cosmetics/collection feature only.
- **Notification** → small contextual system notices if needed.
- **Mini Map** → currently unused. Do not reintroduce a journey map just because the animation exists.

## Motion rules

1. Physical page turn happens first.
2. Component appear animation starts only after the page turn is mostly clear.
3. Never animate every component on a page at once.
4. Prefer one focal reveal plus static data.
5. Do not run completion animations when the user is away in ChatGPT; motion is for interactions that happen while the site is open.
6. Keep navigation fast. A page turn must never become a loading screen.
7. Preserve native aspect ratio for frame sequences.
8. If using exported frames, preload only the exact sequence needed by that screen.
9. Mobile may use fewer frames / simpler transitions if needed for performance.
10. Reduced-motion mode always gets a static or short-opacity alternative.

## Next review point

After Stage 1.3 is visually approved, Stage 2 may introduce one real component reveal on the Dashboard. The first candidates are:
- Folding & Cutout `6 Player HUD`
- Folding & Cutout `1 Headers/*`

Do not import their full sequences until the Dashboard composition is approved.
