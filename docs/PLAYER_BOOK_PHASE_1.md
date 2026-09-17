# Player book — phase 1

Replaces the Paper UI approximation with the original green Inventory Book from Pocket Inventory Series #5 Player Status v1.1.

- Original 896×720 PNG frames; shared coordinates and pixelated rendering.
- Style 1 Cover 1 opening: five frames, 100 ms per frame.
- Style 1 forward/backward turn: nine frames, 65 ms per frame.
- These playback timings are implementation choices; original PNGs contain no timing metadata.
- Six original tabs are drawn by the pack; five mapped chapter buttons and a labelled chapter navigation row provide access to existing sections. The remaining drawn tab is decorative.
- All frames preload before opening; navigation locks during playback. Content stays hidden during the turn and returns on completion.
- Reduced motion skips animation. Replay opening is available for review.
- /book-preview is a visual-only preview without learner data. Existing routes retain the access gate.
- Phase 2 will integrate the existing views. Learning provider, API and data rules are unchanged.

The prior Stage 1.3 inventory refers to the free Paper UI ZIP only. The premium pack does contain dedicated page-turn frames.

Validation: production build passed. Browser verification results are recorded in the implementation handoff.
