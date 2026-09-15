'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon, PageHeading, Panel, SessionDialog } from './core-ui';
import { useLearning } from './learning-provider';
import type { SessionRow } from '@/lib/types';

export function SessionsView(){
  const {dashboard,loadSessions}=useLearning();
  const [sessions,setSessions]=useState<SessionRow[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [sessionId,setSessionId]=useState<number|null>(null);
  const min=Number(dashboard?.daily_mission?.min_session_minutes??10);
  useEffect(()=>{let active=true;void loadSessions().then((rows)=>{if(active){setSessions(rows);setLoading(false)}}).catch((cause)=>{console.error(cause);if(active){setError('Could not load the session archive.');setLoading(false)}});return()=>{active=false}},[loadSessions]);
  const groups=useMemo(()=>groupSessions(sessions),[sessions]);
  const totalMinutes=sessions.reduce((sum,s)=>sum+Number(s.duration_min??0),0);
  return <>
    <PageHeading eyebrow="SESSION ARCHIVE" title="Every substantive session remains auditable." description="Open a session to review objectives, evidence, corrections, difficulties and the exact next priority that was recorded." action={<div className="page-heading-metrics"><span>{sessions.length} sessions</span><span>{Math.round(totalMinutes)} min</span></div>}/>
    {loading&&<Panel className="loading-panel">Loading session history…</Panel>}
    {error&&<Panel className="error-panel">{error}</Panel>}
    {!loading&&!error&&<div className="session-timeline">{Object.entries(groups).map(([date,rows])=><section key={date} className="session-day"><div className="session-day__date"><span>{formatDate(date)}</span><small>{rows.length} {rows.length===1?'session':'sessions'}</small></div><Panel className="session-day__panel">{rows.map((session)=><button key={session.session_id} className="archive-row" onClick={()=>setSessionId(session.session_id)}><span className="archive-row__number">#{String(session.session_id).padStart(2,'0')}</span><div className="archive-row__copy"><strong>{session.primary_language_topic??session.session_type??'Learning session'}</strong><span>{session.marketing_context||'Professional English practice'}</span></div><div className="archive-row__tags"><span className={Number(session.duration_min??0)>=min?'is-qualifying':''}><Icon name="clock" size={14}/>{session.duration_min??'—'} min</span>{session.is_benchmark&&<span>Benchmark</span>}<Icon name="chevronRight" size={16}/></div></button>)}</Panel></section>)}</div>}
    <SessionDialog sessionId={sessionId} onClose={()=>setSessionId(null)}/>
  </>
}

function groupSessions(sessions:SessionRow[]){return sessions.reduce<Record<string,SessionRow[]>>((acc,session)=>{(acc[session.session_date]??=[]).push(session);return acc},{})}
function formatDate(value:string){return new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric'}).format(new Date(`${value}T12:00:00`))}
