'use client';

import { PixelAvatar } from './core-ui';
import type { Benchmark, Sprint } from '@/lib/types';

export function JourneyMap({ sprint, benchmarks = [] }: { sprint?: Sprint; benchmarks?: Benchmark[] }) {
  const sprintId = Number(sprint?.sprint_id ?? 1);
  const completed = Number(sprint?.completed_sessions ?? 0);
  const target = Number(sprint?.sprint_target_max ?? 25);
  const progress = Math.max(0, Math.min(1, target ? completed / target : 0));
  const isFirst = sprintId % 2 === 1;
  const localSprint = isFirst ? 1 : 2;
  const start = localSprint === 1 ? { x: 31, y: 66 } : { x: 67, y: 40 };
  const end = localSprint === 1 ? { x: 50, y: 45 } : { x: 83, y: 30 };
  const avatar = { x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress };
  const benchmarkCount = benchmarks.length;
  const firstBenchmarkDone = benchmarkCount >= sprintId - (localSprint === 2 ? 1 : 0) && localSprint === 2;

  return <div className="journey-map">
    <div className="journey-map__stars" />
    <svg className="journey-map__route" viewBox="0 0 1000 350" preserveAspectRatio="none" aria-hidden="true"><path d="M95 245 C210 185 250 260 340 220 S455 135 525 150 S630 205 690 135 S820 70 900 115"/></svg>
    <Island className="journey-map__island journey-map__island--one" />
    <Island className="journey-map__island journey-map__island--two" />
    <Island className="journey-map__island journey-map__island--three" />
    <Island className="journey-map__island journey-map__island--four" />
    <Node x={10} y={69} label="Baseline" state="done" marker="✓" />
    <Node x={31} y={66} label={`Sprint ${sprintId - (localSprint === 2 ? 1 : 0)}`} state={localSprint===1?'current':'done'} marker={localSprint===1?String(sprintId):'✓'} />
    <Node x={50} y={45} label="Benchmark" state={localSprint===2 || firstBenchmarkDone ? 'done':'next'} marker="B" />
    <Node x={67} y={40} label={`Sprint ${localSprint===1?sprintId+1:sprintId}`} state={localSprint===2?'current':'locked'} marker={localSprint===2?String(sprintId):'2'} />
    <Node x={83} y={30} label="Benchmark" state="locked" marker="B" />
    <Node x={91} y={53} label="Strategic Review" state="locked" marker="★" />
    <div className="journey-map__avatar" style={{ left: `${avatar.x}%`, top: `${avatar.y}%` }}><PixelAvatar size="sm"/></div>
  </div>;
}

function Island({ className }: { className: string }) { return <div className={className}><i/><i/><i/></div>; }

function Node({ x,y,label,state,marker }: { x:number;y:number;label:string;state:'done'|'current'|'next'|'locked';marker:string }) {
  return <div className={`journey-node journey-node--${state}`} style={{ left:`${x}%`,top:`${y}%` }}><b>{marker}</b><span>{label}</span></div>;
}
