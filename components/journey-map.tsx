'use client';

import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

export function JourneyMap({ sprint, benchmarks = [] }: { sprint?: Sprint; benchmarks?: Benchmark[] }) {
  const sprintId = Number(sprint?.sprint_id ?? 1);
  const completed = Number(sprint?.completed_sessions ?? 0);
  const target = Number(sprint?.sprint_target_max ?? 25);
  const progress = Math.max(0, Math.min(1, target ? completed / target : 0));
  const localSprint = sprintId % 2 === 1 ? 1 : 2;
  const route = localSprint === 1
    ? { start: { x: 30, y: 67 }, end: { x: 50, y: 48 } }
    : { start: { x: 68, y: 40 }, end: { x: 84, y: 31 } };
  const avatar = {
    x: route.start.x + (route.end.x - route.start.x) * progress,
    y: route.start.y + (route.end.y - route.start.y) * progress,
  };
  const benchmarkCount = benchmarks.length;
  const sprintOneDone = localSprint === 2 || sprintId > 1;

  return (
    <div className="journey-world">
      <div className="journey-world__water" aria-hidden="true" />

      <WorldIsland className="world-island--baseline">
        <Sprite src="/game/house.png" className="world-sprite world-sprite--house" />
        <Sprite src="/game/tree-1.png" className="world-sprite world-sprite--tree world-sprite--tree-a" />
        <Sprite src="/game/tree-2.png" className="world-sprite world-sprite--tree world-sprite--tree-b" />
      </WorldIsland>

      <WorldIsland className="world-island--sprint-one">
        <Sprite src="/game/barracks.png" className="world-sprite world-sprite--barracks" />
        <Sprite src="/game/tree-2.png" className="world-sprite world-sprite--tree world-sprite--tree-c" />
      </WorldIsland>

      <WorldIsland className="world-island--benchmark-one">
        <Sprite src="/game/castle.png" className="world-sprite world-sprite--castle" />
        <Sprite src="/game/tree-1.png" className="world-sprite world-sprite--tree world-sprite--tree-d" />
      </WorldIsland>

      <WorldIsland className="world-island--sprint-two">
        <Sprite src="/game/monastery.png" className="world-sprite world-sprite--monastery" />
        <Sprite src="/game/tree-2.png" className="world-sprite world-sprite--tree world-sprite--tree-e" />
      </WorldIsland>

      <WorldIsland className="world-island--review">
        <Sprite src="/game/tower.png" className="world-sprite world-sprite--tower" />
      </WorldIsland>

      <svg className="journey-world__route" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
        <path d="M125 380 C230 325 285 390 365 345 S505 245 605 260 S735 315 825 220 S1005 145 1080 190" />
      </svg>

      <Marker x={11} y={73} label="Baseline" state="done" marker="✓" />
      <Marker x={30} y={67} label={`Sprint ${sprintId - (localSprint === 2 ? 1 : 0)}`} state={localSprint === 1 ? 'current' : 'done'} marker={localSprint === 1 ? String(sprintId) : '✓'} />
      <Marker x={50} y={48} label="Benchmark" state={sprintOneDone || benchmarkCount > 0 ? 'done' : 'next'} marker="B" />
      <Marker x={68} y={40} label={`Sprint ${localSprint === 1 ? sprintId + 1 : sprintId}`} state={localSprint === 2 ? 'current' : 'locked'} marker={localSprint === 2 ? String(sprintId) : '2'} />
      <Marker x={84} y={31} label="Benchmark" state="locked" marker="B" />
      <Marker x={92} y={60} label="Strategic Review" state="locked" marker="★" />

      <div className="journey-world__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }}>
        <PixelAvatar size="sm" />
      </div>
    </div>
  );
}

function WorldIsland({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`world-island ${className}`} aria-hidden="true"><div className="world-island__top" />{children}</div>;
}

function Sprite({ src, className }: { src: string; className: string }) {
  return <img src={src} alt="" className={className} draggable={false} />;
}

function Marker({ x, y, label, state, marker }: { x: number; y: number; label: string; state: 'done' | 'current' | 'next' | 'locked'; marker: string }) {
  return <div className={`journey-marker journey-marker--${state}`} style={{ left: `${x}%`, top: `${y}%` }}><b>{marker}</b><span>{label}</span></div>;
}
