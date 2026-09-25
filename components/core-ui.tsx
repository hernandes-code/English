'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './icons';
export { Icon } from './icons';
import { useLearning } from './learning-provider';
import type { DomainCoverage, Observation, SessionDetail, SessionRow, SkillDetail, SkillState } from '@/lib/types';

export function Score({ value, digits = 1 }: { value?: number | null; digits?: number }) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return <>—</>;
  return <>{Number(value).toFixed(digits)}</>;
}

export function Panel({ children, className = '', elevated = false }: { children: React.ReactNode; className?: string; elevated?: boolean }) {
  return <section className={`panel ${elevated ? 'panel--elevated' : ''} ${className}`}>{children}</section>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function ProgressBar({ value, muted = false }: { value: number; muted?: boolean }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className={`progress ${muted ? 'progress--muted' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safe)}><span style={{ width: `${safe}%` }} /></div>;
}

export function Trend({ value }: { value?: number | null }) {
  const n = Number(value || 0);
  if (!n) return <span className="trend trend--flat">→ 0.0</span>;
  const up = n > 0;
  return <span className={`trend ${up ? 'trend--up' : 'trend--down'}`}><Icon name={up ? 'arrowUp' : 'arrowDown'} size={13} /> {Math.abs(n).toFixed(1)}</span>;
}

export function StatusPill({ status = 'Unobserved' }: { status?: string }) {
  const slug = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-pill status-pill--${slug}`}>{status}</span>;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'home' as const },
  { href: '/skills', label: 'Skills', icon: 'skills' as const },
  { href: '/sessions', label: 'Sessions', icon: 'sessions' as const },
  { href: '/analytics', label: 'Analytics', icon: 'analytics' as const },
  { href: '/profile', label: 'Profile', icon: 'profile' as const },
];

export function AccessGate() {
  const { login, status, error } = useLearning();
  const [value, setValue] = useState('');
  const busy = status === 'loading';

  return (
    <main className="gate-shell">
      <Panel className="gate-card" elevated>
        <div className="gate-mark" aria-hidden="true">EP</div>
        <div className="gate-brand"><strong>English Progress</strong><small>Learning analytics</small></div>
        <div className="gate-copy"><Eyebrow>PRIVATE DASHBOARD</Eyebrow><h1>Welcome back</h1><p>Enter your access code to view your current learning state.</p></div>
        <form className="gate-form" onSubmit={async (event) => { event.preventDefault(); if (value.trim()) await login(value.trim()); }}>
          <label className="sr-only" htmlFor="access-code">Access code</label>
          <input id="access-code" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" spellCheck={false} placeholder="Enter access code" />
          <button className="button button--primary" disabled={busy}>{busy ? 'Loading…' : 'Continue'}</button>
        </form>
        <div className="gate-error" role="alert">{error}</div>
      </Panel>
    </main>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dashboard, status, refresh } = useLearning();
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState(false);

  if (status === 'booting' || status === 'loading') return <main className="loading-screen"><div className="loading-pixel"/><span>Loading learning state…</span></main>;
  if (!dashboard || status === 'locked') return <AccessGate />;

  const player = dashboard.player ?? {};
  const summary = dashboard.summary ?? {};
  const activeItem = navItems.find((item) => item.href === pathname) ?? navItems[0];
  const initial = String(player.display_name ?? 'H').trim().charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand"><span className="sidebar__logo">EP</span><div><strong>English Progress</strong><small>Learning analytics</small></div></div>
        <div className="sidebar__section-label">Workspace</div>
        <nav className="sidebar__nav" aria-label="Main navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={pathname === item.href ? 'is-active' : ''}><Icon name={item.icon}/><span>{item.label}</span></Link>)}
        </nav>
        <div className="sidebar__account"><span>{initial}</span><div><strong>{player.display_name ?? 'Hernandes'}</strong><small>{summary.total_sessions ?? 0} recorded sessions</small></div></div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="topbar__title"><strong>{activeItem.label}</strong><span>Business English learning dashboard</span></div>
          <div className="topbar__actions">
            <span className="live-status"><i/>Live data</span>
            <button
              className={`refresh-button ${refreshing ? 'is-refreshing' : ''}`}
              disabled={refreshing}
              aria-busy={refreshing}
              onClick={async () => {
                setRefreshing(true);
                try { await refresh(); } finally { setRefreshing(false); }
              }}
            ><Icon name="refresh" size={16}/>{refreshing ? 'Syncing…' : 'Refresh'}</button>
          </div>
        </header>
        <main className="page-content"><div className="page-stage" key={pathname}>{children}</div></main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={pathname === item.href ? 'is-active' : ''}><Icon name={item.icon}/><span>{item.label}</span></Link>)}</nav>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

export function DomainBars({ coverage, compact = false }: { coverage: DomainCoverage[]; compact?: boolean }) {
  return <div className={`domain-list ${compact ? 'domain-list--compact' : ''}`}>
    {coverage.map((item) => {
      const assessed = item.observed_skills ?? 0;
      const total = item.total_skills ?? 0;
      const coveragePct = total ? assessed / total : 0;
      const lowCoverage = coveragePct < 0.5;
      return <div className="domain-row" key={item.domain}>
        <div className="domain-row__label"><strong>{item.domain}</strong><span>{assessed}/{total} assessed</span></div>
        <ProgressBar value={Number(item.current_score ?? 0)} muted={lowCoverage || !assessed}/>
        <b className={!assessed ? 'muted-value' : ''}>{assessed ? <Score value={item.current_score}/> : '—'}</b>
      </div>;
    })}
  </div>;
}

export function computeCoverage(skills: SkillState[], scores: { domain: string; current_score?: number | null }[] = []): DomainCoverage[] {
  const scoreMap = new Map(scores.map((item) => [item.domain, item.current_score]));
  const groups = new Map<string, SkillState[]>();
  skills.forEach((skill) => groups.set(skill.domain, [...(groups.get(skill.domain) ?? []), skill]));
  return Array.from(groups.entries()).map(([domain, group]) => ({
    domain,
    total_skills: group.length,
    observed_skills: group.filter((item) => Number(item.observations ?? 0) > 0).length,
    current_score: scoreMap.get(domain) ?? null,
  })).sort((a,b) => a.domain.localeCompare(b.domain));
}

export function Dialog({ open, onClose, titleId, children, wide = false }: { open: boolean; onClose: () => void; titleId: string; children: React.ReactNode; wide?: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(<div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><div className={`dialog ${wide ? 'dialog--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}><button ref={closeRef} className="dialog__close" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button>{children}</div></div>, document.body);
}

export function SkillDialog({ skillId, onClose }: { skillId: string | null; onClose: () => void }) {
  const { loadSkill } = useLearning();
  const [detail, setDetail] = useState<SkillDetail | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!skillId) return;
    let active = true;
    setDetail(null); setError('');
    void loadSkill(skillId).then((value) => { if (active) setDetail(value); }).catch((cause) => { console.error(cause); if (active) setError('Could not load this skill.'); });
    return () => { active = false; };
  }, [skillId, loadSkill]);
  const state = detail?.state;
  return <Dialog open={Boolean(skillId)} onClose={onClose} titleId="skill-dialog-title" wide>
    {!state && !error && <div className="dialog-loading">Loading skill evidence…</div>}
    {error && <div className="error-state">{error}</div>}
    {state && <>
      <Eyebrow>{state.skill_id} · {state.domain}</Eyebrow>
      <h2 id="skill-dialog-title">{state.skill_name}</h2>
      <div className="skill-dialog-score"><strong><Score value={state.current_score}/></strong><div><StatusPill status={state.status}/><Trend value={state.trend}/></div></div>
      <ProgressBar value={Number(state.current_score ?? 0)} muted={!state.observations}/>
      <div className="detail-metrics">
        <DetailMetric label="Confidence" value={state.confidence ?? '—'} />
        <DetailMetric label="Evidence" value={`${state.observations ?? 0} obs.`} />
        <DetailMetric label="Independence" value={state.latest_independence == null ? '—' : `${state.latest_independence}/5`} />
        <DetailMetric label="Transfer" value={state.transfer_success_rate == null ? '—' : `${Math.round(Number(state.transfer_success_rate) * 100)}%`} />
      </div>
      <div className="detail-section"><Eyebrow>CURRENT FOCUS</Eyebrow><p>{state.recommended_focus ?? 'Establish baseline'}</p></div>
      <div className="detail-section"><Eyebrow>LATEST EVIDENCE</Eyebrow><div className="evidence-list">{(detail?.observations ?? []).slice(0,6).map((observation) => <EvidenceCard key={observation.observation_id ?? `${observation.session_id}-${observation.skill_id}`} observation={observation}/>)}</div></div>
    </>}
  </Dialog>;
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return <div className="detail-metric"><span>{label}</span><b>{value}</b></div>;
}

function EvidenceCard({ observation }: { observation: Observation }) {
  return <article className="evidence-card"><div><strong>Session {observation.session_id}</strong><span><Score value={observation.observation_score}/></span></div><p>{observation.evidence || 'No written evidence.'}</p>{observation.correction_natural_version && <small>Target: {observation.correction_natural_version}</small>}</article>;
}

export function SessionDialog({ sessionId, onClose }: { sessionId: number | null; onClose: () => void }) {
  const { loadSession } = useLearning();
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (sessionId == null) return;
    let active = true;
    setDetail(null); setError('');
    void loadSession(sessionId).then((value) => { if (active) setDetail(value); }).catch((cause) => { console.error(cause); if (active) setError('Could not load this session.'); });
    return () => { active = false; };
  }, [sessionId, loadSession]);
  const session = detail?.session;
  return <Dialog open={sessionId != null} onClose={onClose} titleId="session-dialog-title" wide>
    {!session && !error && <div className="dialog-loading">Loading session evidence…</div>}
    {error && <div className="error-state">{error}</div>}
    {session && <>
      <Eyebrow>SESSION #{session.session_id} · {session.session_date}</Eyebrow>
      <h2 id="session-dialog-title">{session.primary_language_topic ?? session.session_type ?? 'Learning session'}</h2>
      <div className="session-dialog-meta"><span><Icon name="clock" size={15}/>{session.duration_min ?? '—'} min</span><span>{session.skills_observed_count ?? 0} skills observed</span>{session.daypart && <span>{session.daypart}</span>}</div>
      <div className="session-detail-grid">
        <DetailBlock title="Objective" text={String(session.main_objective ?? '—')} />
        <DetailBlock title="Strongest improvement" text={String(session.strongest_improvement ?? '—')} positive />
        <DetailBlock title="Main difficulty" text={String(session.main_difficulty ?? '—')} />
        <DetailBlock title="Next priority" text={String(session.next_priority ?? '—')} />
      </div>
      {session.marketing_context && <div className="detail-section"><Eyebrow>CONTEXT</Eyebrow><p>{session.marketing_context}</p></div>}
      <div className="detail-section"><Eyebrow>OBSERVATIONS</Eyebrow><div className="evidence-list">{(detail?.observations ?? []).map((observation) => <EvidenceCard key={observation.observation_id ?? `${observation.session_id}-${observation.skill_id}`} observation={observation}/>)}</div></div>
    </>}
  </Dialog>;
}

function DetailBlock({ title, text, positive = false }: { title: string; text: string; positive?: boolean }) {
  return <article className={`detail-block ${positive ? 'detail-block--positive' : ''}`}><span>{title}</span><p>{text}</p></article>;
}

export function SessionList({ sessions, onOpen, minMinutes = 10, compact = false }: { sessions: SessionRow[]; onOpen: (id: number) => void; minMinutes?: number; compact?: boolean }) {
  return <div className={`session-list ${compact ? 'session-list--compact' : ''}`}>{sessions.map((session) => <button className="session-row" key={session.session_id} onClick={() => onOpen(session.session_id)}><span className="session-row__id">#{String(session.session_id).padStart(2,'0')}</span><div className="session-row__copy"><strong>{session.primary_language_topic ?? session.session_type ?? 'Learning session'}</strong><span>{session.marketing_context || session.session_date}</span></div><div className="session-row__meta"><span className={Number(session.duration_min ?? 0) >= minMinutes ? 'qualifies' : ''}>{session.duration_min ?? '—'} min</span><Icon name="chevronRight" size={16}/></div></button>)}</div>;
}

type ChartPoint = {
  x: number;
  y: number;
  date?: string;
  displayValue?: string;
  sampleCount?: number;
};

type LineChartProps = {
  points: ChartPoint[];
  height?: number;
  color?: string;
  metricLabel?: string;
  yMin?: number;
  yMax?: number;
  ticks?: number[];
};

const DEFAULT_CHART_TICKS = [0, 25, 50, 75, 100];

export function SimpleLineChart({
  points,
  height = 210,
  color = 'var(--primary)',
  metricLabel = 'Score',
  yMin = 0,
  yMax = 100,
  ticks = DEFAULT_CHART_TICKS,
}: LineChartProps) {
  const width = 600;
  const pad = { top: 22, right: 22, bottom: 26, left: 42 };
  const usableW = width - pad.left - pad.right;
  const usableH = height - pad.top - pad.bottom;
  const valid = points.filter((point) => Number.isFinite(point.y));
  if (valid.length < 2) return <div className="chart-empty"><Icon name="info"/><span>More evidence is needed before a trend line is meaningful.</span></div>;
  const minX = Math.min(...valid.map((p) => p.x));
  const maxX = Math.max(...valid.map((p) => p.x));
  const minY = Math.min(yMin, ...valid.map((p) => p.y));
  const maxY = Math.max(yMax, ...valid.map((p) => p.y));
  const visibleTicks = [...new Set([
    ...ticks.filter((tick) => tick >= minY && tick <= maxY),
    ...(minY < yMin ? [minY] : []),
    ...(maxY > yMax ? [maxY] : []),
  ])].sort((a, b) => a - b);
  const mapX = (x:number) => pad.left + ((x-minX)/(maxX-minX || 1))*usableW;
  const mapY = (y:number) => pad.top + usableH - ((y-minY)/(maxY-minY || 1))*usableH;
  const path = valid.map((p,i) => `${i===0?'M':'L'} ${mapX(p.x).toFixed(2)} ${mapY(p.y).toFixed(2)}`).join(' ');
  const hasLimitedSamples = valid.some((point) => point.sampleCount != null && point.sampleCount < 3);
  return <div className="line-chart">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metricLabel} by learning session`}>
      <g className="line-chart__grid">{visibleTicks.map((tick) => <g key={tick}><path d={`M ${pad.left} ${mapY(tick)} H ${width-pad.right}`}/><text x={pad.left-10} y={mapY(tick)+3} textAnchor="end">{tick}</text></g>)}</g>
      <path className="line-chart__path" style={{ stroke: color }} d={path}/>
      {valid.map((point) => {
        const x = mapX(point.x);
        const y = mapY(point.y);
        const sampleCount = point.sampleCount;
        const hasSample = sampleCount != null;
        const limitedSample = hasSample && sampleCount < 3;
        const tooltipHeight = hasSample ? 68 : 52;
        const tooltipX = Math.max(8, Math.min(width - 198, x - 95));
        const tooltipY = y < tooltipHeight + 24 ? y + 16 : y - tooltipHeight - 14;
        const date = point.date ? formatChartDate(point.date) : 'Date unavailable';
        const value = point.displayValue ?? point.y.toFixed(1);
        const sampleLabel = hasSample ? `${sampleCount} observation${sampleCount === 1 ? '' : 's'}${limitedSample ? ', limited sample' : ''}` : '';
        return <g className="line-chart__point" key={`${point.x}-${point.y}`} tabIndex={0} role="img" aria-label={`Session ${point.x}, ${date}, ${metricLabel}: ${value}${sampleLabel ? `, ${sampleLabel}` : ''}`}>
          <circle className="line-chart__hit-area" cx={x} cy={y} r="13"/>
          {limitedSample ? <circle className="line-chart__sample-ring" cx={x} cy={y} r="8"/> : null}
          <circle className={`line-chart__dot ${limitedSample ? 'line-chart__dot--limited' : ''}`} cx={x} cy={y} r="4.5" style={{ fill: color }}/>
          <g className="line-chart__tooltip" transform={`translate(${tooltipX} ${tooltipY})`}>
            <rect width="190" height={tooltipHeight} rx="8"/>
            <text x="11" y="18"><tspan className="line-chart__tooltip-title">Session {point.x}</tspan><tspan x="11" dy="18">{date} · {value}</tspan>{hasSample ? <tspan className={limitedSample ? 'line-chart__tooltip-warning' : ''} x="11" dy="17">{sampleLabel}</tspan> : null}</text>
          </g>
        </g>;
      })}
    </svg>
    <div className="line-chart__axis"><span>S{minX}</span><span>S{maxX}</span></div>
    <div className="line-chart__hint"><Icon name="info" size={13}/><span>Hover, tap or focus a point to see details.{hasLimitedSamples ? ' Outlined points have fewer than 3 observations.' : ''}</span></div>
  </div>;
}

function formatChartDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function useDomainCoverage() {
  const { dashboard } = useLearning();
  return useMemo(() => computeCoverage(dashboard?.skill_tree ?? [], dashboard?.domains ?? []), [dashboard]);
}
