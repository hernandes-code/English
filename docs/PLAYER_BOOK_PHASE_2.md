# Player book — phase 2

## Behavior
- Existing Dashboard, Skills, Sessions, Analytics and Profile views render inside the right page, retaining their controls and RPC integrations.
- The left page shows player identity, XP progress, academic skill index, session count, review count, coins, daily mission and current priorities, from the existing dashboard response.
- Each page scrolls independently. On narrow screens the original book is shown one page at a time, with explicit Status / Section controls.
- Dialogs render through a body portal so page scrolling cannot clip evidence or session details.
- Existing views use a scoped paper palette and single-column reading layouts, without modifying scores or learning rules.
- Session archive fetches batches of 100 using the existing limit/offset arguments and displays 20 records per page. Duplicate batches produce an error instead of looping or silently truncating history.
- Profile practice time distinguishes loading/unavailable states from a real zero.
- The visual-only /book-preview remains available. Real learner routes retain the access gate.

## Verification
- Production build and TypeScript checks passed.
- Browser checks used intercepted RPC fixture responses, never real credentials or learner data.
- Tested access-code form, all five chapter routes, skill filters and detail dialog, session detail dialog/Escape, both analytics charts, browser Back, mobile page selection and horizontal overflow, reduced-motion navigation.
- History fixture: 125 records across two RPC batches, 20 records per UI page, final page of five records.
- Screenshots inspected at 1440×1000 and 390×844. No browser runtime errors observed.
- Live private RPC responses were not verified; existing access code is still required on deployment.
