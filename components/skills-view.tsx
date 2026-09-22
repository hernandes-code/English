'use client';

import { useMemo, useState } from 'react';
import { Eyebrow, PageHeading, Panel, ProgressBar, Score, SkillDialog, StatusPill, Trend } from './core-ui';
import { useLearning } from './learning-provider';
import type { SkillState } from '@/lib/types';
import styles from './learning-strategy.module.css';

type Filter = 'screened' | 'due' | 'developing' | 'strong' | 'awaiting' | 'all';

export function SkillsView() {
  const { dashboard } = useLearning();
  const [filter, setFilter] = useState<Filter>('screened');
  const [skillId, setSkillId] = useState<string | null>(null);
  const skills = dashboard?.skill_tree ?? [];
  const summary = dashboard?.coverage?.summary ?? {};
  const screened = Number(summary.screened_skills ?? skills.filter(isScreened).length);
  const total = Number(summary.total_skills ?? skills.length);
  const baseline = Number(summary.baseline_established_skills ?? skills.filter((skill)=>skill.baseline_established).length);
  const awaiting = Number(summary.coverage_debt ?? Math.max(0,total-screened));
  const filtered = useMemo(() => skills.filter((skill) => matchFilter(skill, filter)), [skills, filter]);
  const groups = useMemo(() => groupByDomain(filtered), [filtered]);

  return <>
    <PageHeading eyebrow="SKILLS" title="Skill development" description={screened+' of '+total+' skills have meaningful evidence. Unknown skills are awaiting a valid diagnostic opportunity; they are not counted as weaknesses.'} />
    <Panel className={styles.coverageOverview}>
      <div><Eyebrow>MODEL COVERAGE</Eyebrow><h2>A checkup that closes its own blind spots.</h2><p>One subtle probe is interleaved into selected sessions while coverage debt exists. Once every active skill is screened, that diagnostic slot switches off automatically.</p></div>
      <div className={styles.overviewStats}>
        <span><strong>{screened}/{total}</strong><small>screened</small></span>
        <span><strong>{baseline}</strong><small>baseline established</small></span>
        <span><strong>{awaiting}</strong><small>awaiting evidence</small></span>
        <span><strong>{summary.voice_required_skills ?? 0}</strong><small>voice required</small></span>
      </div>
    </Panel>
    <div className="filter-row" role="group" aria-label="Skill filters">{(['screened','due','developing','strong','awaiting','all'] as Filter[]).map((item)=><button key={item} className={filter===item?'is-active':''} onClick={()=>setFilter(item)}>{item==='awaiting'?'Awaiting evidence ('+awaiting+')':capitalize(item)}</button>)}</div>
    <div className="skill-domain-stack">{Object.entries(groups).map(([domain,items]) => <Panel key={domain} className="skill-domain"><div className="skill-domain__header"><div><Eyebrow>{domain}</Eyebrow><h2>{items.length} {items.length===1?'skill':'skills'}</h2></div><span>{items.filter(isScreened).length} screened</span></div><div className="skill-card-grid">{items.map((skill)=><SkillCard key={skill.skill_id} skill={skill} onOpen={()=>setSkillId(skill.skill_id)}/>)}</div></Panel>)}</div>
    {!filtered.length && <Panel className="empty-panel"><p>No skills match this filter yet.</p></Panel>}
    <SkillDialog skillId={skillId} onClose={()=>setSkillId(null)}/>
  </>;
}

function isScreened(skill:SkillState){return skill.screened ?? Number(skill.observations??0)>0}
function matchFilter(skill:SkillState,filter:Filter){const screened=isScreened(skill);if(filter==='all')return true;if(filter==='screened')return screened;if(filter==='awaiting')return !screened;if(filter==='due')return Boolean(skill.review_due);if(filter==='developing')return skill.status==='Developing';if(filter==='strong')return ['Strong','Mastered','Automatic'].includes(skill.status??'');return true}
function capitalize(value:string){return value[0].toUpperCase()+value.slice(1)}
function groupByDomain(skills:SkillState[]){return skills.reduce<Record<string,SkillState[]>>((acc,skill)=>{(acc[skill.domain]??=[]).push(skill);return acc},{})}

function SkillCard({skill,onOpen}:{skill:SkillState;onOpen:()=>void}){
  const screened=isScreened(skill);
  const coverageLabel=skill.coverage_status ?? (screened?'Screening':'Unobserved');
  return <button className={'skill-card '+(!screened?'skill-card--unobserved':'')} onClick={onOpen}>
    <div className="skill-card__top"><span>{skill.skill_id}</span>{skill.review_due && <span className="review-dot">REVIEW</span>}</div>
    <div className="skill-card__score">{screened?<Score value={skill.current_score} digits={0}/>:<span>?</span>}</div>
    <strong>{skill.skill_name}</strong>
    <div className="skill-card__meta">{screened?<StatusPill status={skill.status??'Screening'}/>:<span className={styles.awaitingBadge}>{coverageLabel==='Voice Required'?'Voice required':'Awaiting evidence'}</span>}{screened && <Trend value={skill.trend}/>}</div>
    {screened?<><ProgressBar value={Number(skill.current_score??0)} muted={skill.confidence==='Very Low'}/><small>{coverageLabel} · {skill.confidence} confidence</small></>:<small>{skill.probe_goal ?? 'No meaningful evidence yet'}</small>}
  </button>
}
