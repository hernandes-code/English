'use client';

import type { CSSProperties } from 'react';
import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

type Point = { x: number; y: number };
type LandmarkKind = 'house' | 'barracks' | 'castle' | 'monastery' | 'tower';
type LandmarkPoint = Point & { kind: LandmarkKind; edge?: 'left' | 'right' };
type StopState = 'done' | 'current' | 'next' | 'locked';
type MobileStop = {
  key: string;
  label: string;
  subtitle: string;
  kind: LandmarkKind;
  state: StopState;
  marker: string;
  side: 'left' | 'right';
  muted?: boolean;
};

const POINTS = {
  baseline: { x: 12, y: 79 },
  sprintOne: { x: 30, y: 70 },
  benchmarkOne: { x: 49, y: 49 },
  sprintTwo: { x: 68, y: 70 },
  benchmarkTwo: { x: 84, y: 49 },
  review: { x: 93, y: 79 },
} satisfies Record<string, Point>;

const LANDMARKS = {
  baseline: { x: 12, y: 64, kind: 'house' as LandmarkKind, edge: 'left' as const },
  sprintOne: { x: 30, y: 55, kind: 'barracks' as LandmarkKind },
  benchmarkOne: { x: 49, y: 34, kind: 'castle' as LandmarkKind },
  sprintTwo: { x: 68, y: 55, kind: 'monastery' as LandmarkKind },
  benchmarkTwo: { x: 84, y: 34, kind: 'castle' as LandmarkKind },
  review: { x: 93, y: 64, kind: 'tower' as LandmarkKind, edge: 'right' as const },
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

  const mobileStops: MobileStop[] = [
    {
      key: 'baseline',
      label: 'Baseline',
      subtitle: 'Starting point',
      kind: 'house',
      state: 'done',
      marker: '✓',
      side: 'left',
    },
    {
      key: 'sprint-one',
      label: `Sprint ${cycleStart}`,
      subtitle: localSprint === 1 ? `${completed}/${target} sessions` : 'Completed',
      kind: 'barracks',
      state: localSprint === 1 ? 'current' : 'done',
      marker: localSprint === 1 ? String(cycleStart) : '✓',
      side: 'right',
    },
    {
      key: 'benchmark-one',
      label: 'Benchmark',
      subtitle: firstBenchmarkDone ? 'Checkpoint cleared' : 'Next checkpoint',
      kind: 'castle',
      state: firstBenchmarkDone ? 'done' : 'next',
      marker: 'B',
      side: 'left',
    },
    {
      key: 'sprint-two',
      label: `Sprint ${cycleStart + 1}`,
      subtitle: localSprint === 2 ? `${completed}/${target} sessions` : 'Locked',
      kind: 'monastery',
      state: localSprint === 2 ? 'current' : 'locked',
      marker: localSprint === 2 ? String(cycleStart + 1) : '2',
      side: 'right',
      muted: localSprint !== 2,
    },
    {
      key: 'benchmark-two',
      label: 'Benchmark',
      subtitle: localSprint === 2 ? 'Next checkpoint' : 'Locked',
      kind: 'castle',
      state: localSprint === 2 ? 'next' : 'locked',
      marker: 'B',
      side: 'left',
      muted: localSprint !== 2,
    },
    {
      key: 'review',
      label: 'Strategic Review',
      subtitle: 'After the two-sprint cycle',
      kind: 'tower',
      state: 'locked',
      marker: '★',
      side: 'right',
      muted: true,
    },
  ];

  const mobilePlayerTop = localSprint === 1
    ? 29 + (45 - 29) * progress
    : 62 + (79 - 62) * progress;

  return (
    <div className="journey-world" aria-label={`Sprint ${sprintId} journey map`}>
      <div className="journey-world__canvas journey-world__desktop">
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
        <Marker point={POINTS.sprintOne} label={`Sprint ${cycleStart}`} state={localSprint === 1 ? 'current' : 'done'} marker={localSprint === 1 ? String(cycleStart) : '✓'} />
        <Marker point={POINTS.benchmarkOne} label="Benchmark" state={firstBenchmarkDone ? 'done' : 'next'} marker="B" />
        <Marker point={POINTS.sprintTwo} label={`Sprint ${cycleStart + 1}`} state={localSprint === 2 ? 'current' : 'locked'} marker={localSprint === 2 ? String(cycleStart + 1) : '2'} />
        <Marker point={POINTS.benchmarkTwo} label="Benchmark" state={localSprint === 2 ? 'next' : 'locked'} marker="B" />
        <Marker point={POINTS.review} label="Strategic Review" state="locked" marker="★" />

        <div className="journey-world__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }}>
          <PixelAvatar size="sm" />
        </div>
      </div>

      <div className="journey-mobile" aria-label={`Sprint ${sprintId} mobile journey`}>
        <div className="journey-mobile__water" aria-hidden="true" />
        <div className="journey-mobile__route" aria-hidden="true" />
        <div className="journey-mobile__player" style={{ '--player-top': `${mobilePlayerTop}%` } as CSSProperties}>
          <PixelAvatar size="sm" />
        </div>
        {mobileStops.map((stop) => <MobileJourneyStop key={stop.key} stop={stop} />)}
      </div>
    </div>
  );
}

function Landmark({ point, featured = false, muted = false }: { point: LandmarkPoint; featured?: boolean; muted?: boolean }) {
  const src = `/game/${point.kind}.png`;
  return (
    <div
      className={`journey-landmark journey-landmark--${point.kind} ${point.edge ? `journey-landmark--edge-${point.edge}` : ''} ${featured ? 'journey-landmark--featured' : ''} ${muted ? 'journey-landmark--muted' : ''}`}
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

function MobileJourneyStop({ stop }: { stop: MobileStop }) {
  return (
    <div className={`journey-mobile__stop journey-mobile__stop--${stop.side} journey-mobile__stop--${stop.state} ${stop.muted ? 'journey-mobile__stop--muted' : ''}`}>
      <div className="journey-mobile__node" aria-hidden="true">{stop.marker}</div>
      <div className="journey-mobile__scene" aria-hidden="true">
        <div className="journey-mobile__ground" />
        <img className={`journey-mobile__building journey-mobile__building--${stop.kind}`} src={`/game/${stop.kind}.png`} alt="" draggable={false} />
      </div>
      <div className="journey-mobile__copy">
        <strong>{stop.label}</strong>
        <span>{stop.subtitle}</span>
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

function Marker({ point, label, state, marker }: { point: Point; label: string; state: StopState; marker: string }) {
  return (
    <div className={`journey-marker journey-marker--${state}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
      <b>{marker}</b>
      <span>{label}</span>
    </div>
  );
}
