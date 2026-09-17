# Stage 1.3 — Page Transition System

Scope: motion only. Do not redesign Dashboard data or change Supabase/learning logic.

Implemented goals:
- persistent Book Shell remains stationary
- directional chapter transitions
- forward navigation turns the right leaf toward the left
- backward navigation turns the left leaf toward the right
- chapter text swaps only near the animation midpoint
- direct chapter tabs and previous/next controls use the same motion system
- browser back/forward can trigger the same visual transition
- navigation is briefly locked to prevent double turns
- desktop and mobile use separate page-turn timing/geometry
- reduced-motion mode skips the 3D turn
- no layout/scroll reset is introduced

Important audit result:
The source pack's exported `Content Appear Animation` folders are component unfold/reveal sequences. There is no dedicated exported full-page-turn PNG sequence. Stage 1.3 therefore uses CSS 3D with the pack's existing paper/edge assets, while the component animation sequences are reserved for later screen-specific stages.

Canonical motion inventory: `docs/PAPER_UI_ANIMATION_GUIDE.md`.
