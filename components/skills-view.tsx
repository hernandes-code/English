'use client';

import { useMemo, useState } from 'react';
import { Eyebrow, PageHeading, Panel, ProgressBar, Score, SkillDialog, StatusPill, Trend } from './core-ui';
import { useLearning } from './learning-provider';
import type { SkillState } from '@/lib/types';

type Filter = 'observed' | 'due' | 'developing' | 'strong' | 'unobserved' | 'all';

export function SkillsView() {
  const { dashboard } = useLearning();
  const [filter, setFilter] = useState<Filter>('observed');
  const [skillId, setSkillId] = useState<string | null>(null);
  const skills = dashboard?.skill_tree ?? [];
  const observed = skills.filter((skill)=>Number(skill.observations??0)>0).length;
  const unobserved = skills.length - observed;
  const filtered = useMemo(() => skills.filter((skill) => matchFilter(skill, filter)), [skills, filter]);
  const groups = useMemo(() => groupByDomain(filtered), [filtered]);

  return <>
    <PageHeading eyebrow="SKILLS" title="Skill development" description={`${observed} of ${skills.length} skills currently have evidence. Scores are shown with coverage and confidence so you can separate established ability from early signals.`} />
    <div className="filter-row" role="group" aria-label="Skill filters">{(['observed','due','developing','strong','unobserved','all'] as Filter[]).map((item)=><button key={item} className={filter===item?'is-active':''} onClick={()=>setFilter(item)}>{item==='unobserved'?`Unassessed (${unobserved})`:capitalize(item)}</button>)}</div>
    <div className="skill-domain-stack">{Object.entries(groups).map(([domain,items]) => <Panel key={domain} className="skill-domain"><div className="skill-domain__header"><div><Eyebrow>{domain}</Eyebrow><h2>{items.length} {items.length===1?'skill':'skills'}</h2></div><span>{items.filter(x=>Number(x.observations??0)>0).length} assessed</span></div><div className="skill-card-grid">{items.map((skill)=><SkillCard key={skill.skill_id} skill={skill} onOpen={()=>setSkillId(skill.skill_id)}/>)}</div></Panel>)}</div>
    {!filtered.length && <Panel className="empty-panel"><p>No skills match this filter yet.</p></Panel>}
    <SkillDialog skillId={skillId} onClose={()=>setSkillId(null)}/>
  </>;
}

function matchFilter(skill:SkillState,filter:Filter){const observed=Number(skill.observations??0)>0;if(filter==='all')return true;if(filter==='observed')return observed;if(filter==='unobserved')return !observed;if(filter==='due')return Boolean(skill.review_due);if(filter==='developing')return skill.status==='Developing';if(filter==='strong')return ['Strong','Mastered','Automatic'].includes(skill.status??'');return true}
function capitalize(value:string){return value[0].toUpperCase()+value.slice(1)}
function groupByDomain(skills:SkillState[]){return skills.reduce<Record<string,SkillState[]>>((acc,skill)=>{(acc[skill.domain]??=[]).push(skill);return acc},{})}

function SkillCard({skill,onOpen}:{skill:SkillState;onOpen:()=>void}){
  const observed=Number(skill.observations??0)>0;
  return <button className={`skill-card ${!observed?'skill-card--unobserved':''}`} onClick={onOpen}>
    <div className="skill-card__top"><span>{skill.skill_id}</span>{skill.review_due && <span className="review-dot">REVIEW</span>}</div>
    <div className="skill-card__score">{observed?<Score value={skill.current_score} digits={0}/>:<span>?</span>}</div>
    <strong>{skill.skill_name}</strong>
    <div className="skill-card__meta"><StatusPill status={observed?(skill.status??'Unobserved'):'Unobserved'}/>{observed && <Trend value={skill.trend}/>}</div>
    {observed?<><ProgressBar value={Number(skill.current_score??0)} muted={skill.confidence==='Very Low'}/><small>{skill.confidence} confidence · {skill.observations} obs.</small></>:<small>No meaningful evidence yet</small>}
  </button>
}
