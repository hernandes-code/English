'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DomainBars, Eyebrow, Icon, PageHeading, Panel, ProgressBar, Score, SessionDialog, SessionList, SkillDialog, useDomainCoverage } from './core-ui';
import { useLearning } from './learning-provider';

export function DashboardView() {
  const { dashboard } = useLearning();
  const coverage = useDomainCoverage();
  const [skillId, setSkillId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  if (!dashboard) return null;

  const mission = dashboard.daily_mission ?? {};
  const summary = dashboard.summary ?? {};
  const sprint = dashboard.current_sprint ?? {};
  const priorities = dashboard.top_priorities ?? [];
  const recent = dashboard.recent_sessions ?? [];
  const assessed = (dashboard.skill_tree ?? []).filter((skill) => Number(skill.observations ?? 0) > 0).length;
  const total = (dashboard.skill_tree ?? []).length;
  const missionPct = Number(mission.target_sessions ?? 5) ? Number(mission.qualifying_sessions ?? 0) / Number(mission.target_sessions ?? 5) * 100 : 0;
  const sprintPct = Number(sprint.sprint_target_max ?? 25) ? Number(sprint.completed_sessions ?? 0) / Number(sprint.sprint_target_max ?? 25) * 100 : 0;
  const nextSkills = priorities.slice(0,3);

  return <>
    <PageHeading eyebrow="OVERVIEW" title={`Welcome back, ${dashboard.player?.display_name ?? 'Hernandes'}.`} description="A clear view of your current Business English progress, priorities and recent practice." />
    <div className="metric-grid metric-grid--top">
      <Metric label="SKILL INDEX" value={<Score value={summary.current_overall_skill_score_observed}/>} note={`${assessed}/${total} skills assessed`} icon="analytics" />
      <Metric label="TOTAL SESSIONS" value={summary.total_sessions ?? 0} note={`${summary.total_skill_observations ?? 0} observations`} icon="sessions" />
      <Metric label="CURRENT SPRINT" value={`${sprint.completed_sessions ?? 0}/${sprint.sprint_target_max ?? 25}`} note={`${Math.round(sprintPct)}% completed`} icon="flag" />
      <Metric label="REVIEWS DUE" value={summary.skills_due_for_review ?? 0} note="spaced retrieval queue" icon="clock" />
    </div>
    <div className="dashboard-layout">
      <Panel className="next-focus" elevated>
        <div className="card-heading"><div><Eyebrow>NEXT TRAINING FOCUS</Eyebrow><h2>Highest-priority skills</h2></div><Link className="inline-link" href="/skills">View all skills <Icon name="chevronRight" size={14}/></Link></div>
        <p className="card-description">Your next lesson should start from the live evidence below, not a static curriculum.</p>
        <div className="next-focus__skills">{nextSkills.map((skill, index) => <button key={skill.skill_id} onClick={() => setSkillId(skill.skill_id)}><span>{index+1}</span><div><strong>{skill.skill_name}</strong><small>{skill.recommended_focus || skill.main_known_issue || 'Reinforce and retest'}</small></div><b><Score value={skill.current_score}/></b></button>)}</div>
        {!nextSkills.length && <div className="empty-inline">Building baseline evidence.</div>}
      </Panel>

      <Panel className="mission-card">
        <div className="card-heading"><div><Eyebrow>DAILY GOAL</Eyebrow><h2>Practice consistency</h2></div><span className="goal-value">{mission.qualifying_sessions ?? 0}/{mission.target_sessions ?? 5}</span></div>
        <p>{mission.target_sessions ?? 5} sessions of at least {mission.min_session_minutes ?? 10} minutes. Shorter sessions remain in your history but do not complete this goal.</p>
        <div className="mission-slots">{Array.from({length:Number(mission.target_sessions ?? 5)},(_,i)=><span key={i} className={i<Number(mission.qualifying_sessions??0)?'is-done':''}>{i<Number(mission.qualifying_sessions??0)?<Icon name="check" size={14}/>:i+1}</span>)}</div>
        <ProgressBar value={missionPct}/>
        <div className="mission-card__meta"><strong>{mission.remaining_sessions ?? Math.max(0, Number(mission.target_sessions ?? 5)-Number(mission.qualifying_sessions ?? 0))} remaining</strong><span>{mission.total_minutes ?? 0} min today</span></div>
      </Panel>

      <Panel className="domain-card">
        <div className="card-heading"><div><Eyebrow>DOMAIN PERFORMANCE</Eyebrow><h2>Score and evidence coverage</h2></div><span className="soft-chip">{assessed}/{total} assessed</span></div>
        <DomainBars coverage={coverage}/>
        <Link className="inline-link" href="/skills">Open full skill map <Icon name="chevronRight" size={14}/></Link>
      </Panel>

      <Panel className="checkpoint-card">
        <div><Eyebrow>SPRINT PROGRESS</Eyebrow><h2>{sprint.benchmark_candidate ? 'Benchmark readiness is approaching' : 'Building the evidence base'}</h2><p>Benchmarks remain near the natural Sprint boundary so comparisons stay meaningful.</p></div>
        <div className="checkpoint-card__progress"><ProgressBar value={sprintPct}/><div><span>{sprint.completed_sessions ?? 0} sessions</span><span>{sprint.sprint_target_min ?? 20}–{sprint.sprint_target_max ?? 25} target</span></div></div>
      </Panel>

      <Panel className="recent-card">
        <div className="card-heading"><div><Eyebrow>RECENT SESSIONS</Eyebrow><h2>Latest practice</h2></div><Link className="inline-link" href="/sessions">View archive <Icon name="chevronRight" size={14}/></Link></div>
        <SessionList sessions={recent.slice(0,5)} onOpen={setSessionId} minMinutes={Number(mission.min_session_minutes ?? 10)} compact/>
      </Panel>
    </div>
    <SkillDialog skillId={skillId} onClose={() => setSkillId(null)}/>
    <SessionDialog sessionId={sessionId} onClose={() => setSessionId(null)}/>
  </>;
}

function Metric({ label, value, note, icon }: { label:string; value:React.ReactNode; note:string; icon:'analytics'|'sessions'|'flag'|'clock' }) {
  return <article className="metric-card"><div className="metric-card__head"><Eyebrow>{label}</Eyebrow><span><Icon name={icon} size={18}/></span></div><strong>{value}</strong><small>{note}</small></article>;
}
