# English Level Up

A learning-first Business English progression system with a restrained game-inspired interface.

## Product principle

The educational model is the product. Gamification is only a visual engagement layer.

- Learning scores come from evidence, not XP.
- Benchmarks, Current State, transfer, independence and confidence remain academic metrics.
- XP, coins, levels, streaks, missions and future cosmetics never modify proficiency.
- The interface is lightly inspired by the 64-bit / pixel era while keeping learning data clean and readable.

## Architecture

- **Supabase**: canonical source of truth, learning model, derived Current State, session history, benchmarks, teaching state, analytics APIs and gamification ledger.
- **Next.js + TypeScript**: learner-facing dashboard and interaction layer.
- **GitHub**: versioned application source and CI build validation.
- **Vercel**: deployment target.
- **ChatGPT / Voice Coach**: teaching interface and session orchestration. At session start it reads the consolidated learner state; at session end it writes the educational evidence back to Supabase.
- **Google Sheet**: historical backup and migration audit source only.

## App routes

- `/` — learning-first dashboard, next focus, Daily Five, journey and recent evidence
- `/skills` — evidence-aware skill map with status, trend, confidence and drill-down
- `/sessions` — chronological session archive with evidence and corrections
- `/analytics` — real learning trends, domain coverage, benchmark state and model confidence
- `/profile` — player identity, practice record and cosmetic/game layer

## Daily Five

Default weekday mission: complete 5 substantive sessions of at least 10 minutes each. Shorter substantive sessions remain valid learning sessions but do not advance the mission.

## Development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
```

The public Supabase publishable key can be supplied with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The temporary dashboard access code is never committed to this repository.

## Data integrity

The original Google Sheet history was migrated to Supabase with the original session, skill, observation and benchmark identifiers preserved. Raw migration snapshots remain available for audit/recovery.
