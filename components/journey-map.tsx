'use client';

import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

type JourneyNodeState = 'done' | 'current' | 'next' | 'locked';

type JourneyAnchor = {
  x: number;
  y: number;
  label: string;
  marker: string;
  state: JourneyNodeState;
};

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 520;

export function JourneyMap({ sprint, benchmarks = [] }: { sprint?: Sprint; benchmarks?: Benchmark[] }) {
  const sprintId = Number(sprint?.sprint_id ?? 1);
  const completed = Number(sprint?.completed_sessions ?? 0);
  const target = Number(sprint?.sprint_target_max ?? 25);
  const progress = Math.max(0, Math.min(1, target ? completed / target : 0));
  const localSprint = sprintId % 2 === 1 ? 1 : 2;
  const cycleFirstSprint = localSprint === 1 ? sprintId : sprintId - 1;
  const benchmarkCount = benchmarks.length;
  const benchmarkOneDone = benchmarkCount >= cycleFirstSprint;
  const benchmarkTwoDone = benchmarkCount >= cycleFirstSprint + 1;

  const anchors: JourneyAnchor[] = [
    { x: 12.5, y: 67, label: 'Baseline', marker: '✓', state: 'done' },
    { x: 30.5, y: 60, label: `Sprint ${cycleFirstSprint}`, marker: localSprint === 1 ? String(sprintId) : '✓', state: localSprint === 1 ? 'current' : 'done' },
    { x: 49, y: 42, label: 'Benchmark', marker: 'B', state: benchmarkOneDone || localSprint === 2 ? 'done' : 'next' },
    { x: 67.5, y: 60, label: `Sprint ${cycleFirstSprint + 1}`, marker: localSprint === 2 ? String(sprintId) : '2', state: localSprint === 2 ? 'current' : 'locked' },
    { x: 83, y: 42, label: 'Benchmark', marker: 'B', state: benchmarkTwoDone ? 'done' : 'locked' },
    { x: 93, y: 68, label: 'Strategic Review', marker: '★', state: benchmarkTwoDone ? 'next' : 'locked' },
  ];

  const currentStart = localSprint === 1 ? anchors[1] : anchors[3];
  const currentEnd = localSprint === 1 ? anchors[2] : anchors[4];
  const avatar = {
    x: currentStart.x + (currentEnd.x - currentStart.x) * progress,
    y: currentStart.y + (currentEnd.y - currentStart.y) * progress,
  };

  return (
    <div className="journey-world" aria-label={`Sprint ${sprintId} learning journey`}>
      <div className="journey-world__scene" aria-hidden="true">
        <img src="/game-v2/journey-scene.png" alt="" className="journey-world__art" />
      </div>
      <svg className="journey-world__route" viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
        <path d="M150 350 C230 335 290 325 365 310 C455 285 515 220 585 220 C680 220 735 305 810 305 C900 305 935 220 995 220 C1060 225 1095 320 1120 350" />
      </svg>
      {anchors.map((anchor) => <Node key={`${anchor.label}-${anchor.x}`} {...anchor} />)}
      <div className="journey-world__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }} aria-hidden="true">
        <PixelAvatar size="sm" />
      </div>
    </div>
  );
}

function Node({ x, y, label, state, marker }: JourneyAnchor) {
  return (
    <div className={`journey-marker journey-marker--${state}`} style={{ left: `${x}%`, top: `${y}%` }}>
      <b>{marker}</b>
      <span>{label}</span>
    </div>
  );
}
