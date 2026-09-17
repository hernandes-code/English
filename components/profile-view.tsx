'use client';

import { useEffect, useState } from 'react';
import { Eyebrow, Icon, PageHeading, Panel, PixelAvatar, ProgressBar } from './core-ui';
import { useLearning } from './learning-provider';
import type { LearningAnalytics } from '@/lib/types';

export function ProfileView(){
  const {dashboard,logout,loadAnalytics}=useLearning();
  const [analytics,setAnalytics]=useState<LearningAnalytics|null>(null);
  useEffect(()=>{void loadAnalytics().then(setAnalytics).catch(console.error)},[loadAnalytics]);
  if(!dashboard)return null;
  const player=dashboard.player??{};
  const summary=dashboard.summary??{};
  return <>
    <PageHeading eyebrow="PROFILE" title="Your learning identity." description="The game layer lives here. Academic progression remains controlled by evidence in the learning model."/>
    <div className="profile-grid">
      <Panel className="profile-hero" elevated>
        <div className="character-stage" aria-hidden="true">
          <img src="/game-v2/profile-stage.png" alt="" className="character-stage__scene"/>
          <div className="character-stage__avatar"><PixelAvatar size="lg"/></div>
        </div>
        <Eyebrow>BUSINESS ENGLISH PLAYER</Eyebrow>
        <h2>{player.display_name??'Hernandes'}</h2>
        <div className="profile-level">LEVEL {player.level??1}</div>
        <ProgressBar value={Number(player.level_progress_pct??0)}/>
        <div className="profile-stats"><span><Icon name="bolt"/> {player.total_xp??0} XP</span><span><Icon name="coin"/> {player.coin_balance??0} coins</span><span><Icon name="flame"/> {dashboard.current_weekday_streak??0} streak</span></div>
      </Panel>
      <Panel className="profile-learning"><Eyebrow>LEARNING RECORD</Eyebrow><h2>What exists behind the avatar.</h2><div className="record-grid"><Record label="Sessions" value={summary.total_sessions??0}/><Record label="Observations" value={summary.total_skill_observations??0}/><Record label="Practice time" value={`${Math.round(Number(analytics?.practice?.total_minutes??0))} min`}/><Record label="Current Sprint" value={dashboard.current_sprint?.sprint_id??1}/></div></Panel>
      <Panel className="cosmetics-card"><div className="card-heading"><div><Eyebrow>COSMETICS</Eyebrow><h2>Optional, visual, never academic.</h2></div><span className="soft-chip">FUTURE</span></div><p>Coins are reserved for skins, avatars and world decoration. They will never unlock higher scores, easier benchmarks or learning advantages.</p><div className="cosmetic-preview"><span>SKIN SLOT</span><span>WORLD DECOR</span><span>BADGES</span></div></Panel>
      <Panel className="access-card"><div><Eyebrow>LOCAL ACCESS</Eyebrow><h2>Forget this browser.</h2><p>This only removes the access code from this device. Supabase learning data remains intact.</p></div><button className="button button--secondary" onClick={logout}><Icon name="lock"/> Lock dashboard</button></Panel>
    </div>
  </>
}
function Record({label,value}:{label:string;value:React.ReactNode}){return <div><span>{label}</span><strong>{value}</strong></div>}
