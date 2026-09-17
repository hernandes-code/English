'use client';

import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

type Point = { x: number; y: number };

const POINTS = {
  baseline: { x: 11.5, y: 77 },
  sprintOne: { x: 30.5, y: 69 },
  benchmarkOne: { x: 49, y: 48 },
  sprintTwo: { x: 67.5, y: 69 },
  benchmarkTwo: { x: 83.5, y: 52 },
  review: { x: 92.5, y: 79 },
} satisfies Record<string, Point>;

export function JourneyMap({ sprint, benchmarks = [] }: { sprint?: Sprint; benchmarks?: Benchmark[] }) {
  const sprintId = Number(sprint?.sprint_id ?? 1);
  const completed = Number(sprint?.completed_sessions ?? 0);
  const target = Math.max(1, Number(sprint?.sprint_target_max ?? 25));
  const progress = Math.max(0, Math.min(1, completed / target));
  const localSprint = sprintId % 2 === 1 ? 1 : 2;
  const cycleStart = localSprint === 1 ? sprintId : sprintId - 1;
  const firstBenchmarkDone = localSprint === 2 || benchmarks.length > 0;
  const secondBenchmarkDone = localSprint === 1 && sprintId > cycleStart + 1;

  const activeRoute = localSprint === 1
    ? { start: POINTS.sprintOne, end: POINTS.benchmarkOne }
    : { start: POINTS.sprintTwo, end: POINTS.benchmarkTwo };
  const avatar = interpolate(activeRoute.start, activeRoute.end, progress);

  return (
    <div className="journey-world" aria-label={`Sprint ${sprintId} journey map`}>
      <div className="journey-world__canvas">
        <div className="journey-world__water" aria-hidden="true" />

        <svg className="journey-world__route" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M138 400 C220 390 290 370 366 359 S505 303 588 250 S727 322 810 359 S930 280 1002 270 S1070 350 1110 410" />
        </svg>

        <img
          src="/game-v2/journey-scene.png"
          alt=""
          className="journey-world__art"
          draggable={false}
          aria-hidden="true"
        />

        <Marker point={POINTS.baseline} label="Baseline" state="done" marker="✓" />
        <Marker
          point={POINTS.sprintOne}
          label={`Sprint ${cycleStart}`}
          state={localSprint === 1 ? 'current' : 'done'}
          marker={localSprint === 1 ? String(cycleStart) : '✓'}
        />
        <Marker
          point={POINTS.benchmarkOne}
          label="Benchmark"
          state={firstBenchmarkDone ? 'done' : 'next'}
          marker="B"
        />
        <Marker
          point={POINTS.sprintTwo}
          label={`Sprint ${cycleStart + 1}`}
          state={localSprint === 2 ? 'current' : 'locked'}
          marker={localSprint === 2 ? String(cycleStart + 1) : '2'}
        />
        <Marker
          point={POINTS.benchmarkTwo}
          label="Benchmark"
          state={secondBenchmarkDone ? 'done' : localSprint === 2 ? 'next' : 'locked'}
          marker="B"
        />
        <Marker point={POINTS.review} label="Strategic Review" state="locked" marker="★" />

        <div className="journey-world__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }}>
          <PixelAvatar size="sm" />
        </div>
      </div>
    </div>
  );
}

function interpolate(start: Point, end: Point, amount: number): Point {
  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}

function Marker({ point, label, state, marker }: { point: Point; label: string; state: 'done' | 'current' | 'next' | 'locked'; marker: string }) {
  return (
    <div className={`journey-marker journey-marker--${state}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
      <b>{marker}</b>
      <span>{label}</span>
    </div>
  );
}
