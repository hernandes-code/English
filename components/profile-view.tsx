'use client';

import { useEffect, useState } from 'react';
import { Eyebrow, Icon, PageHeading, Panel, ProgressBar, Score } from './core-ui';
import { useLearning } from './learning-provider';
import type { LearningAnalytics } from '@/lib/types';

export function ProfileView(){
  const {dashboard,logout,loadAnalytics}=useLearning();
  const [analyticsError,setAnalyticsError]=useState(false);
  const [analytics,setAnalytics]=useState<LearningAnalytics|null>(null);
  useEffect(()=>{let active=true;void loadAnalytics().then(value=>{if(active)setAnalytics(value)}).catch(()=>{if(active)setAnalyticsError(true)});return()=>{active=false}},[loadAnalytics]);
  if(!dashboard)return null;
  const player=dashboard.player??{};
  const summary=dashboard.summary??{};
  const mission=dashboard.daily_mission??{};
  const sprint=dashboard.current_sprint??{};
  const assessed=(dashboard.skill_tree??[]).filter(skill=>Number(skill.observations??0)>0).length;
  const total=(dashboard.skill_tree??[]).length;
  const sprintPct=Number(sprint.sprint_target_max??25)?Number(sprint.completed_sessions??0)/Number(sprint.sprint_target_max??25)*100:0;
  return <>
    <PageHeading eyebrow="PROFILE" title="Learning profile" description="Your study configuration, academic record and local access controls."/>
    <div className="profile-grid">
      <Panel className="profile-summary" elevated><div className="profile-monogram">{String(player.display_name??'H').charAt(0).toUpperCase()}</div><div><Eyebrow>BUSINESS ENGLISH LEARNER</Eyebrow><h2>{player.display_name??'Hernandes'}</h2><p>Professional communication for paid media and DTC marketing.</p></div><div className="profile-score"><span>Skill index</span><strong><Score value={summary.current_overall_skill_score_observed}/></strong></div></Panel>
      <Panel className="profile-learning"><Eyebrow>LEARNING RECORD</Eyebrow><h2>Academic overview</h2><div className="record-grid"><Record label="Sessions" value={summary.total_sessions??0}/><Record label="Observations" value={summary.total_skill_observations??0}/><Record label="Practice time" value={analytics ? `${Math.round(Number(analytics.practice?.total_minutes??0))} min` : analyticsError ? 'Unavailable' : 'Loading…'}/><Record label="Skills assessed" value={`${assessed}/${total}`}/></div></Panel>
      <Panel className="routine-card"><div className="card-heading"><div><Eyebrow>STUDY ROUTINE</Eyebrow><h2>Daily target</h2></div><span className="soft-chip">{mission.qualifying_sessions??0}/{mission.target_sessions??5} today</span></div><p>{mission.target_sessions??5} sessions per day with at least {mission.min_session_minutes??10} minutes each.</p><ProgressBar value={Number(mission.qualifying_sessions??0)/Math.max(1,Number(mission.target_sessions??5))*100}/></Panel>
      <Panel className="sprint-profile-card"><div className="card-heading"><div><Eyebrow>CURRENT SPRINT</Eyebrow><h2>Sprint {sprint.sprint_id??1}</h2></div><span className="soft-chip">{Math.round(sprintPct)}%</span></div><p>{sprint.completed_sessions??0} sessions completed toward a target of {sprint.sprint_target_min??20}–{sprint.sprint_target_max??25}.</p><ProgressBar value={sprintPct}/></Panel>
      <Panel className="access-card"><div><Eyebrow>LOCAL ACCESS</Eyebrow><h2>Lock this dashboard</h2><p>This removes the access code only from this browser. Your Supabase learning data remains unchanged.</p></div><button className="button button--secondary" onClick={logout}><Icon name="lock"/> Lock dashboard</button></Panel>
    </div>
  </>
}
function Record({label,value}:{label:string;value:React.ReactNode}){return <div><span>{label}</span><strong>{value}</strong></div>}
