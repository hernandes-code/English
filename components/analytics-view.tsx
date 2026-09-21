'use client';

import { useEffect, useMemo, useState } from 'react';
import { DomainBars, Eyebrow, PageHeading, Panel, Score, SimpleLineChart, StatusPill, Trend } from './core-ui';
import { useLearning } from './learning-provider';
import type { LearningAnalytics } from '@/lib/types';

export function AnalyticsView(){
  const {loadAnalytics}=useLearning();
  const [data,setData]=useState<LearningAnalytics|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{let active=true;void loadAnalytics().then((value)=>{if(active)setData(value)}).catch((cause)=>{console.error(cause);if(active)setError('Could not load analytics.')});return()=>{active=false}},[loadAnalytics]);
  const evidencePoints=useMemo(()=> (data?.session_series??[]).filter(x=>x.evidence_score!=null).map(x=>({x:x.session_id,y:Number(x.evidence_score),date:x.session_date,displayValue:Number(x.evidence_score).toFixed(1)})),[data]);
  const independencePoints=useMemo(()=> (data?.session_series??[]).filter(x=>x.avg_independence!=null).map(x=>({x:x.session_id,y:Number(x.avg_independence)*20,date:x.session_date,displayValue:`${Number(x.avg_independence).toFixed(2)}/5`})),[data]);
  if(error)return <Panel className="error-panel">{error}</Panel>;
  if(!data)return <Panel className="loading-panel">Loading learning analytics…</Panel>;
  const practice=data.practice??{};
  const benchmarks=data.benchmark_history??[];
  const latest=benchmarks.at(-1);
  return <>
    <PageHeading eyebrow="ANALYTICS" title="Evidence-based progress" description="Current state, longitudinal evidence and practice consistency are separated so short-term variation is not mistaken for a real trend."/>
    <div className="analytics-metrics"><Metric label="TOTAL PRACTICE" value={`${Math.round(Number(practice.total_minutes??0))}m`} note={`${practice.total_sessions??0} sessions`} /><Metric label="AVG. SESSION" value={`${Number(practice.avg_minutes??0).toFixed(1)}m`} note={`${practice.qualifying_sessions??0} Daily Five qualifiers`} /><Metric label="SKILLS ASSESSED" value={`${data.assessed_skills??0}/${data.total_skills??0}`} note="coverage matters for confidence" /><Metric label="BENCHMARKS" value={benchmarks.length} note={benchmarks.length<2?'trend after Benchmark 2':'longitudinal trend available'} /></div>
    <div className="analytics-grid">
      <Panel className="chart-card" elevated><Eyebrow>SESSION EVIDENCE SCORE</Eyebrow><h2>How evidence quality is moving.</h2><p>Average scored observations per session. This is not a replacement for Current State; it is a session-level signal.</p><SimpleLineChart points={evidencePoints} metricLabel="Evidence score"/></Panel>
      <Panel className="chart-card"><Eyebrow>INDEPENDENCE</Eyebrow><h2>How independently the language is produced.</h2><p>Average independence per session, normalized to a 0–100 visual scale.</p><SimpleLineChart points={independencePoints} color="var(--cyan)" metricLabel="Independence"/></Panel>
      <Panel className="coverage-card"><Eyebrow>DOMAIN COVERAGE</Eyebrow><h2>Score + evidence coverage.</h2><DomainBars coverage={data.domain_coverage??[]}/></Panel>
      <Panel className="benchmark-card"><Eyebrow>LATEST BENCHMARK</Eyebrow><h2>{latest?.benchmark_id??'No benchmark yet'}</h2>{latest?<><div className="benchmark-score"><Score value={latest.overall_score}/> <span>/ 5</span></div><p>{latest.top_strength}</p>{benchmarks.length<2&&<div className="benchmark-note">One benchmark is recorded. A trend line would be misleading until Benchmark 2.</div>}</>:<p>Benchmark data will appear here when available.</p>}</Panel>
      <Panel className="movers-card"><div className="card-heading"><div><Eyebrow>SKILL MOVERS</Eyebrow><h2>Largest recent changes.</h2></div><span className="soft-chip">SIGNAL, NOT VERDICT</span></div><div className="movers-list">{(data.skill_movers??[]).slice(0,8).map((skill)=><div key={skill.skill_id}><div><strong>{skill.skill_name}</strong><small>{skill.domain} · {skill.confidence} confidence</small></div><StatusPill status={skill.status}/><Trend value={skill.trend}/></div>)}</div></Panel>
      <Panel className="confidence-card"><Eyebrow>MODEL CONFIDENCE</Eyebrow><h2>How much evidence exists behind the model.</h2><div className="confidence-bars">{(data.confidence_distribution??[]).map((item)=><div key={item.confidence}><span>{item.confidence??'Unknown'}</span><b>{item.skills??0} skills</b></div>)}</div></Panel>
    </div>
  </>
}

function Metric({label,value,note}:{label:string;value:React.ReactNode;note:string}){return <article className="analytics-metric"><Eyebrow>{label}</Eyebrow><strong>{value}</strong><span>{note}</span></article>}
