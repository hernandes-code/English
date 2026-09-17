'use client';

import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

type Point = { x: number; y: number };
type LandmarkKind = 'house' | 'barracks' | 'castle' | 'monastery' | 'tower';

const POINTS = {
  baseline: { x: 12, y: 79 },
  sprintOne: { x: 30, y: 70 },
  benchmarkOne: { x: 49, y: 49 },
  sprintTwo: { x: 68, y: 70 },
  benchmarkTwo: { x: 84, y: 49 },
  review: { x: 93, y: 79 },
} satisfies Record<string, Point>;

const LANDMARKS = {
  baseline: { x: 12, y: 64, kind: 'house' as LandmarkKind },
  sprintOne: { x: 30, y: 55, kind: 'barracks' as LandmarkKind },
  benchmarkOne: { x: 49, y: 34, kind: 'castle' as LandmarkKind },
  sprintTwo: { x: 68, y: 55, kind: 'monastery' as LandmarkKind },
  benchmarkTwo: { x: 84, y: 34, kind: 'castle' as LandmarkKind },
  review: { x: 93, y: 64, kind: 'tower' as LandmarkKind },
};

export function JourneyMap({ sprint, benchmarks = [] }: { sprint?: Sprint; benchmarks?: Benchmark[] }) {
  const sprintId = Number(sprint?.sprint_id ?? 1);
  const completed = Number(sprint?.completed_sessions ?? 0);
  const target = Math.max(1, Number(sprint?.sprint_target_max ?? 25));
  const progress = Math.max(0, Math.min(1, completed / target));
  const localSprint = sprintId % 2 === 1 ? 1 : 2;
  const cycleStart = localSprint === 1 ? sprintId : sprintId - 1;
  const firstBenchmarkDone = localSprint === 2 || benchmarks.length > 0;

  const activeRoute = localSprint === 1
    ? { start: POINTS.sprintOne, end: POINTS.benchmarkOne }
    : { start: POINTS.sprintTwo, end: POINTS.benchmarkTwo };
  const avatar = interpolate(activeRoute.start, activeRoute.end, progress);

  return (
    <div className="journey-world" aria-label={`Sprint ${sprintId} journey map`}>
      <div className="journey-world__canvas">
        <div className="journey-world__water" aria-hidden="true" />

        <svg className="journey-world__route" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M144 411 C235 398 294 378 360 364 S500 310 588 255 S730 318 816 364 S938 304 1008 255 S1080 360 1116 411" />
        </svg>

        <Landmark point={LANDMARKS.baseline} />
        <Landmark point={LANDMARKS.sprintOne} />
        <Landmark point={LANDMARKS.benchmarkOne} featured />
        <Landmark point={LANDMARKS.sprintTwo} />
        <Landmark point={LANDMARKS.benchmarkTwo} featured muted />
        <Landmark point={LANDMARKS.review} muted />

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
        <Marker point={POINTS.benchmarkTwo} label="Benchmark" state={localSprint === 2 ? 'next' : 'locked'} marker="B" />
        <Marker point={POINTS.review} label="Strategic Review" state="locked" marker="★" />

        <div className="journey-world__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }}>
          <PixelAvatar size="sm" />
        </div>
      </div>
    </div>
  );
}

function Landmark({ point, featured = false, muted = false }: { point: Point & { kind: LandmarkKind }; featured?: boolean; muted?: boolean }) {
  const src = `/game/${point.kind}.png`;
  return (
    <div
      className={`journey-landmark ${featured ? 'journey-landmark--featured' : ''} ${muted ? 'journey-landmark--muted' : ''}`}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      aria-hidden="true"
    >
      <div className="journey-landmark__ground" />
      <img className="journey-landmark__tree journey-landmark__tree--left" src="/game/tree-1.png" alt="" draggable={false} />
      <img className="journey-landmark__building" src={src} alt="" draggable={false} />
      <img className="journey-landmark__tree journey-landmark__tree--right" src="/game/tree-2.png" alt="" draggable={false} />
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
