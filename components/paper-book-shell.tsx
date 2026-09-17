'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AccessGate, PixelAvatar, ProgressBar, Score } from './core-ui';
import { useLearning } from './learning-provider';

const chapters = [
  { href: '/', label: 'Dashboard', title: 'Current Chapter', note: 'Your learning status and next training focus.' },
  { href: '/skills', label: 'Skills', title: 'Skill Record', note: 'Evidence, scores, and development.' },
  { href: '/sessions', label: 'Sessions', title: 'Training Journal', note: 'Your sessions and learning evidence.' },
  { href: '/analytics', label: 'Analytics', title: 'Progress Record', note: 'Progress, benchmarks, and coverage.' },
  { href: '/profile', label: 'Profile', title: 'Player Status', note: 'Your learning profile and journey.' },
];
const asset = (name: string) => `/player-book/${name}.png`;
type Motion = { kind: 'open' | 'forward' | 'backward'; frame: number };

export function PaperBookShell({ children }: { children: React.ReactNode }) {
  const { dashboard, status, refresh, error } = useLearning();
  const pathname = usePathname();
  const router = useRouter();
  const preview = pathname === '/book-preview';
  const routeIndex = Math.max(0, chapters.findIndex(c => c.href === pathname));
  const [index, setIndex] = useState(routeIndex);
  const [motion, setMotion] = useState<Motion | null>(null);
  const [mobileStatus, setMobileStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pendingRoute = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [assetError, setAssetError] = useState(false);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opened = useRef(false);
  const reduced = useRef(false);
  const visible = preview || (Boolean(dashboard) && status !== 'locked' && status !== 'loading' && status !== 'booting');

  useEffect(() => {
    let alive = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reduced.current = media.matches; };
    update(); media.addEventListener('change', update);
    const names = ['idle-1', ...Array.from({length:7},(_,i)=>`tabs-${i+1}`), ...Array.from({length:5},(_,i)=>`open-${i+1}`), ...['forward','backward'].flatMap(k=>Array.from({length:9},(_,i)=>`${k}-${i+1}`))];
    Promise.all(names.map(name => new Promise<void>((resolve,reject) => {
      const image = new window.Image(); image.onload=()=>resolve(); image.onerror=reject; image.src=asset(name);
    }))).then(()=>{if(alive)setReady(true);}).catch(()=>{if(alive)setAssetError(true);});
    return () => {alive=false;media.removeEventListener('change',update);if(timer.current)clearTimeout(timer.current);};
  }, []);

  function animate(kind: Motion['kind'], target: number, href?: string) {
    if (busy.current) return;
    if (reduced.current) { setIndex(target); if(href){pendingRoute.current=href;router.push(href,{scroll:false});} return; }
    busy.current=true;
    const total=kind==='open'?5:9;
    let frame=1;
    setMotion({kind,frame});
    const tick=()=>{
      if(frame===Math.ceil(total/2))setIndex(target);
      if(frame>=total || reduced.current){
        setIndex(target);setMotion(null);busy.current=false;
        if(href){pendingRoute.current=href;router.push(href,{scroll:false});}
        return;
      }
      frame++;setMotion({kind,frame});timer.current=setTimeout(tick,kind==='open'?100:65);
    };
    timer.current=setTimeout(tick,kind==='open'?100:65);
  }

  useEffect(()=>{
    if(ready && visible && !opened.current){opened.current=true;animate('open',routeIndex);}
    // Opening runs once, after assets and access are ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ready,visible]);
  useEffect(()=>{
    if(pendingRoute.current===pathname)pendingRoute.current=null;
    if(!pendingRoute.current && !preview && ready && opened.current && routeIndex!==index && !busy.current)animate(routeIndex>index?'forward':'backward',routeIndex);
    // Browser history changes use the same animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[routeIndex,preview,ready,motion,pathname,index]);

  if(!preview && (status==='booting'||status==='loading'))return <main className="pb-loading">Opening your learning journal…</main>;
  if(!preview && (!dashboard||status==='locked'))return <AccessGate/>;
  if(assetError)return <main className="pb-loading"><p>The book could not load.</p><button onClick={()=>window.location.reload()}>Try again</button></main>;
  if(!ready)return <main className="pb-loading">Preparing your book…</main>;
  const chapter=chapters[index];
  const player=dashboard?.player ?? {};
  const summary=dashboard?.summary ?? {};
  const mission=dashboard?.daily_mission ?? {};
  function navigate(target:number){
    if(target<0||target>=chapters.length||target===index||busy.current)return;
    setMobileStatus(false);
    animate(target>index?'forward':'backward',target,preview?undefined:chapters[target].href);
  }
  return <main className={`pb-shell ${preview ? "" : "pb-live"}`}>
    <header className="pb-brand"><span>ENGLISH</span><h1>Level Up</h1><p>A learning journal</p></header>
    <div className="pb-scroll"><div className={`pb-book ${mobileStatus ? "pb-book--status" : ""}`} aria-busy={Boolean(motion)}>
      <Image className="pb-art" src={asset(motion?`${motion.kind}-${motion.frame}`:`tabs-${index+2}`)} alt="" width={896} height={720} unoptimized priority draggable={false}/>
      <div className={`pb-content ${motion || (!preview && routeIndex!==index)?'pb-content--hidden':''}`}>
        <section className="pb-page pb-page--left" aria-label="Player status">
          <span className="pb-eyebrow">{preview ? `CHAPTER 0${index+1}` : 'PLAYER STATUS'}</span>
          {preview ? <div className="pb-title"><h2>{chapter.title}</h2><p>{chapter.note}</p></div> : <div className="pb-status-scroll" tabIndex={0}>
            <div className="pb-player"><PixelAvatar size="lg"/><h2>{player.display_name ?? 'Learner'}</h2><span>Level {player.level ?? '—'} · {player.total_xp ?? '—'} XP</span></div>
            <ProgressBar value={Number(player.level_progress_pct ?? 0)}/>
            <dl className="pb-record"><div><dt>Skill index</dt><dd><Score value={summary.current_overall_skill_score_observed}/></dd></div><div><dt>Sessions</dt><dd>{summary.total_sessions ?? '—'}</dd></div><div><dt>Reviews due</dt><dd>{summary.skills_due_for_review ?? '—'}</dd></div><div><dt>Coins</dt><dd>{player.coin_balance ?? '—'}</dd></div></dl>
            <div className="pb-status-section"><span className="pb-eyebrow">DAILY FIVE</span><p>{mission.qualifying_sessions ?? 0} / {mission.target_sessions ?? 5} sessions · {mission.min_session_minutes ?? 10}+ min</p><ProgressBar value={Number(mission.qualifying_sessions ?? 0)/Math.max(1,Number(mission.target_sessions ?? 5))*100}/></div>
            <div className="pb-status-section"><span className="pb-eyebrow">NEXT TRAINING FOCUS</span>{(dashboard?.top_priorities ?? []).slice(0,3).map(skill=><p key={skill.skill_id}><strong>{skill.skill_name}</strong><br/><small>{skill.recommended_focus || skill.main_known_issue || 'Reinforce and retest'}</small></p>)}{!dashboard?.top_priorities?.length && <p>Building baseline evidence.</p>}</div>
            <button className="pb-refresh" disabled={refreshing} onClick={async()=>{setRefreshing(true);try{await refresh();}finally{setRefreshing(false);}}}>{refreshing ? 'Refreshing…' : 'Refresh learning data'}</button>
            {status==='error' && <p role="alert">{error}</p>}
          </div>}
          <span className="pb-folio">{index*2+1}</span>
        </section>
        <section className="pb-page pb-page--right" aria-label={chapter.label}>
          <span className="pb-eyebrow">{chapter.label}</span>
          {preview ? <div className="pb-title"><h3>{chapter.label}</h3><p>A new page in your English journey.</p><p className="pb-preview-note">Book appearance preview</p></div> : <div key={pathname} className="pb-reading" tabIndex={0} aria-label={`${chapter.label} content`}>{children}</div>}
          <span className="pb-folio">{index*2+2}</span>
        </section>
      </div>
      <nav className="pb-tabs" aria-label="Book chapters">{chapters.map((c,i)=><button key={c.href} style={{top:`${(248+i*38-130)/5}%`}} title={c.label} aria-label={c.label} aria-current={index===i?'page':undefined} disabled={Boolean(motion)} onClick={()=>navigate(i)}>{i+1}</button>)}</nav>
    </div></div>
    {!preview && <div className="pb-mobile-pages" role="group" aria-label="Visible book page"><button aria-pressed={mobileStatus} onClick={()=>setMobileStatus(true)} disabled={Boolean(motion)}>Player status</button><button aria-pressed={!mobileStatus} onClick={()=>setMobileStatus(false)} disabled={Boolean(motion)}>{chapter.label}</button></div>}
    <nav className="pb-chapters" aria-label="Chapter names">{chapters.map((c,i)=><button key={c.href} onClick={()=>navigate(i)} disabled={Boolean(motion)} aria-current={index===i?'page':undefined}>{c.label}</button>)}</nav>
    <footer className="pb-controls"><button onClick={()=>navigate(index-1)} disabled={index===0||Boolean(motion)}>← Previous</button><span aria-live="polite">{index+1} / {chapters.length}</span><button onClick={()=>navigate(index+1)} disabled={index===chapters.length-1||Boolean(motion)}>Next →</button></footer>
    {preview && <button className="pb-replay" onClick={()=>animate('open',index)} disabled={Boolean(motion)}>Replay opening</button>}
    {!preview && <Link className="pb-preview-link" href="/book-preview">Visual preview</Link>}
  </main>;
}
