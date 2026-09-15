'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { JourneyMap } from './journey-map';
import { DomainBars, Eyebrow, Icon, Panel, ProgressBar, Score, SessionDialog, SessionList, SkillDialog, useDomainCoverage } from './core-ui';
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
  const focusLabel = useMemo(() => nextSkills.map((x) => x.skill_name).join(' · '), [nextSkills]);

  return <>
    <div className="dashboard-layout">
      <Panel className="next-focus" elevated>
        <div className="next-focus__top"><div><Eyebrow>NEXT TRAINING FOCUS</Eyebrow><h1>What matters next.</h1><p>The next lesson should start from this live learner state, not a static curriculum.</p></div><div className="next-focus__badge"><Icon name="target"/><span>{summary.skills_due_for_review ?? 0}</span><small>REVIEWS DUE</small></div></div>
        <div className="next-focus__skills">{nextSkills.map((skill, index) => <button key={skill.skill_id} onClick={() => setSkillId(skill.skill_id)}><span>{index+1}</span><div><strong>{skill.skill_name}</strong><small>{skill.recommended_focus || skill.main_known_issue || 'Reinforce and retest'}</small></div><b><Score value={skill.current_score}/></b></button>)}</div>
        <div className="next-focus__footer"><span>{focusLabel || 'Building baseline evidence'}</span><span>Session #{Number(summary.latest_session ?? 0)+1}</span></div>
      </Panel>

      <Panel className="mission-card">
        <div className="card-heading"><div><Eyebrow>DAILY FIVE</Eyebrow><h2>Consistency, lightly rewarded.</h2></div><div className="mission-card__icon"><Icon name="target"/></div></div>
        <p>{mission.target_sessions ?? 5} substantive sessions of at least {mission.min_session_minutes ?? 10} minutes. Shorter sessions still count as learning.</p>
        <div className="mission-slots">{Array.from({length:Number(mission.target_sessions ?? 5)},(_,i)=><span key={i} className={i<Number(mission.qualifying_sessions??0)?'is-done':''}>{i<Number(mission.qualifying_sessions??0)?<Icon name="check" size={14}/>:i+1}</span>)}</div>
        <ProgressBar value={missionPct}/>
        <div className="mission-card__meta"><strong>{mission.qualifying_sessions ?? 0}/{mission.target_sessions ?? 5}</strong><span>+{mission.reward_xp ?? 0} XP · +{mission.reward_coins ?? 0} coins</span></div>
      </Panel>

      <Panel className="journey-card" elevated>
        <div className="card-heading"><div><Eyebrow>YOUR JOURNEY</Eyebrow><h2>Progress mapped to the real learning cycle.</h2></div><span className="soft-chip">SPRINT {sprint.sprint_id ?? 1}</span></div>
        <JourneyMap sprint={sprint} benchmarks={dashboard.benchmark_history ?? []}/>
        <div className="journey-card__footer"><span>Strategic Review appears after the two-sprint cycle, unless evidence triggers an earlier review.</span><Link href="/skills">Explore skills <Icon name="chevronRight" size={14}/></Link></div>
      </Panel>

      <Panel className="domain-card">
        <div className="card-heading"><div><Eyebrow>CURRENT DOMAIN STATE</Eyebrow><h2>Scores with evidence coverage.</h2></div><span className="soft-chip">{assessed}/{total} ASSESSED</span></div>
        <DomainBars coverage={coverage}/>
        <Link className="inline-link" href="/skills">Open full skill map <Icon name="chevronRight" size={14}/></Link>
      </Panel>

      <div className="metric-grid">
        <Metric label="CURRENT SKILL INDEX" value={<Score value={summary.current_overall_skill_score_observed}/>} note={`${assessed}/${total} skills assessed`} />
        <Metric label="SESSIONS" value={summary.total_sessions ?? 0} note={`${summary.total_skill_observations ?? 0} observations`} />
        <Metric label="SPRINT" value={`${sprint.completed_sessions ?? 0}/${sprint.sprint_target_max ?? 25}`} note={`${Math.round(sprintPct)}% toward target`} />
        <Metric label="REVIEWS DUE" value={summary.skills_due_for_review ?? 0} note="spaced retrieval queue" />
      </div>

      <Panel className="checkpoint-card">
        <div><Eyebrow>SPRINT CHECKPOINT</Eyebrow><h2>{sprint.benchmark_candidate ? 'Benchmark signal is becoming ready.' : 'Still building the evidence base.'}</h2><p>Benchmarks stay near the natural sprint boundary so longitudinal comparisons remain meaningful.</p></div>
        <div className="checkpoint-card__progress"><ProgressBar value={sprintPct}/><div><span>{sprint.completed_sessions ?? 0} sessions</span><span>{sprint.sprint_target_min ?? 20}–{sprint.sprint_target_max ?? 25} target</span></div></div>
      </Panel>

      <Panel className="recent-card">
        <div className="card-heading"><div><Eyebrow>RECENT SESSIONS</Eyebrow><h2>Latest evidence.</h2></div><Link className="inline-link" href="/sessions">View archive <Icon name="chevronRight" size={14}/></Link></div>
        <SessionList sessions={recent.slice(0,5)} onOpen={setSessionId} minMinutes={Number(mission.min_session_minutes ?? 10)} compact/>
      </Panel>
    </div>
    <SkillDialog skillId={skillId} onClose={() => setSkillId(null)}/>
    <SessionDialog sessionId={sessionId} onClose={() => setSessionId(null)}/>
  </>;
}

function Metric({ label, value, note }: { label:string; value:React.ReactNode; note:string }) {
  return <article className="metric-card"><Eyebrow>{label}</Eyebrow><strong>{value}</strong><span>{note}</span></article>;
}
