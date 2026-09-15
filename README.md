# English Level Up

A learning-first Business English progression system with a restrained game-inspired interface.

## Product principle

The educational model is the product. Gamification is only a visual engagement layer.

- Learning scores come from evidence, not XP.
- Benchmarks, Current State, transfer, independence and confidence remain academic metrics.
- XP, coins, levels, streaks, missions and future cosmetics never modify proficiency.
- The interface should feel lightly inspired by the 64-bit / pixel era while staying clean, modern and readable.

## Current architecture

- Supabase: source of truth, learning model, derived state, session context and gamification ledger.
- Frontend: current V1 static dashboard, moving toward Next.js + TypeScript.
- Vercel: deployment target.
- ChatGPT / Voice Coach: training interface and session orchestration.

## Daily Five

Default weekday mission: complete 5 substantive sessions of at least 10 minutes each. Shorter substantive sessions remain valid learning sessions but do not advance the mission.

## Status

The original Google Sheet history has already been migrated losslessly to Supabase and remains preserved as backup.
