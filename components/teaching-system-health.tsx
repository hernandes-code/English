'use client';

import { useEffect, useState } from 'react';
import { Dialog } from './core-ui';
import { useLearning } from './learning-provider';
import type { TeachingSystemHealth, TeachingSystemSignal, TeachingSystemState } from '@/lib/types';
import styles from './teaching-system-health.module.css';

const stateLabels: Record<string, string> = {
  awaiting_benchmark: 'Awaiting benchmark',
  disabled: 'Not active',
  healthy: 'Healthy',
  monitoring: 'Monitoring',
  review_recommended: 'Review recommended',
  architecture_review_needed: 'Architecture review needed',
};

function stateCopy(state?: TeachingSystemState | null) {
  if (!state) return 'System health data is not available yet. Do not interpret this as healthy.';
  switch (state.overall_status) {
    case 'awaiting_benchmark':
      return 'Self-checks begin after the Sprint 2 benchmark. The existing benchmark remains unchanged.';
    case 'healthy':
      return 'No active system signals or pending session self-checks were detected.';
    case 'monitoring':
      return 'The coach is collecting evidence or has an issue under observation.';
    case 'review_recommended':
      return 'A Teacher Check is due, or recurring issues or missing self-checks need review.';
    case 'architecture_review_needed':
      return 'At least one issue needs human review before changing system architecture.';
    default:
      return 'Monitoring is disabled; no health conclusion can be drawn.';
  }
}

function SignalItem({ signal }: { signal: TeachingSystemSignal }) {
  return (
    <article className={styles.signal}>
      <div className={styles.signalTop}>
        <strong>{signal.title}</strong>
        <span className={styles.signalOwner}>{signal.owner_scope === 'architecture' ? 'Architecture review' : 'Coach action'}</span>
      </div>
      <p>{signal.description}</p>
      <div className={styles.signalMeta}>
        <span>{signal.category.replaceAll('_', ' ')}</span>
        {signal.last_detected_session != null && <span>Last seen: session {signal.last_detected_session}</span>}
      </div>
      <div className={styles.signalAction}><b>Next action:</b> {signal.recommended_action}</div>
    </article>
  );
}

export function TeachingSystemHealthCard({ summary }: { summary?: TeachingSystemHealth }) {
  const { loadTeachingSystemHealth } = useLearning();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<TeachingSystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const state = summary?.state;
  const signals = summary?.active_signals ?? [];
  const legacyIssues = summary?.historical_data_issues ?? [];

  useEffect(() => {
    if (!open) return;
    let active = true;
    setDetail(null);
    setError('');
    setLoading(true);
    void loadTeachingSystemHealth()
      .then((data) => { if (active) setDetail(data); })
      .catch(() => { if (active) setError('Unable to load system health details. Try again after refreshing.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, loadTeachingSystemHealth]);

  return (
    <>
      <section className={styles.card} aria-label="Teaching system health">
        <div className={styles.head}>
          <div className={styles.heading}>
            <span>TEACHING SYSTEM HEALTH</span>
            <strong>How the teaching system is performing</strong>
          </div>
          <span className={styles.stateChip} data-status={state?.overall_status ?? 'unavailable'}>
            {stateLabels[state?.overall_status ?? ''] ?? 'Unavailable'}
          </span>
        </div>
        <p className={styles.intro}>{stateCopy(state)}</p>
        {signals.slice(0, 2).map((signal) => (
          <div className={styles.previewSignal} key={signal.signal_key}>
            <strong>{signal.title}</strong>
            <span>{signal.owner_scope === 'architecture' ? 'Needs your review' : 'Coach monitoring'}</span>
          </div>
        ))}
        {(state?.pending_teacher_check_count ?? 0) > 0 && (
          <p className={styles.pending}>{state?.pending_teacher_check_count} Teacher Check{state?.pending_teacher_check_count === 1 ? '' : 's'} due. The coach must complete and save the checkpoint review.</p>
        )}
        {state?.benchmark_completed && (state.pending_checks ?? 0) > 0 && (
          <p className={styles.pending}>{state.pending_checks} completed session{state.pending_checks === 1 ? '' : 's'} awaiting self-check.</p>
        )}
        {legacyIssues.length > 0 && (
          <p className={styles.legacy}>{legacyIssues.length} older session{legacyIssues.length === 1 ? '' : 's'} flagged for evidence review.</p>
        )}
        <button type="button" className={styles.detailButton} onClick={() => setOpen(true)}>
          View system health details <span aria-hidden="true">↗</span>
        </button>
      </section>
      <Dialog open={open} onClose={() => setOpen(false)} titleId="teaching-health-dialog-title" wide>
        <div className={styles.dialogBody}>
          <div className={styles.dialogHeading}>
            <span>TEACHING QUALITY & GOVERNANCE</span>
            <h2 id="teaching-health-dialog-title">Teaching System Health</h2>
            <p>System signals are separate from your English proficiency scores and never change the benchmark.</p>
          </div>
          {loading && <p role="status" className={styles.notice}>Loading live system evidence…</p>}
          {error && <p role="alert" className={styles.error}>{error}</p>}
          {detail && (
            <div className={styles.sections}>
              <section className={styles.section}>
                <div className={styles.sectionHead}><h3>Current status</h3><span className={styles.stateChip} data-status={detail.state?.overall_status ?? 'unavailable'}>{stateLabels[detail.state?.overall_status ?? ''] ?? 'Unavailable'}</span></div>
                <p>{stateCopy(detail.state)}</p>
                {detail.state?.benchmark_completed ? (
                  <div className={styles.metrics}>
                    <div><strong>{detail.state.tracked_sessions}</strong><span>Sessions tracked</span></div>
                    <div><strong>{detail.state.completed_checks}</strong><span>Self-checks saved</span></div>
                    <div><strong>{detail.state.pending_checks}</strong><span>Checks pending</span></div>
                  </div>
                ) : <p className={styles.notice}>Activation is gated on the Sprint 2 benchmark. No retroactive teaching evaluations will be invented.</p>}
              </section>
              {(detail.teacher_check_obligations ?? []).length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHead}><h3>Teacher Check schedule</h3><span>Checkpoints, not learner scores</span></div>
                  <div className={styles.stack}>
                    {detail.teacher_check_obligations?.map(item => (
                      <div className={styles.event} key={`${item.sprint_id}-${item.checkpoint_position}`}>
                        <strong>Sprint {item.sprint_id} · {item.checkpoint_position}-session checkpoint</strong>
                        <span>{item.obligation_status === 'historical_gap'
                          ? 'Historical gap — not backfilled with a fictional check'
                          : item.obligation_status === 'pending'
                            ? 'Pending: coach must record a real Teacher Check'
                            : 'Benchmark handoff — no duplicate check is required if the Sprint closes'}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className={styles.section}>
                <div className={styles.sectionHead}><h3>Active signals</h3><span>{(detail.active_signals ?? []).length} active</span></div>
                {(detail.active_signals ?? []).length > 0
                  ? <div className={styles.stack}>{detail.active_signals?.map(signal => <SignalItem key={signal.signal_key} signal={signal}/>)}</div>
                  : <p className={styles.empty}>No active recorded signals. This is not proof of health while self-checks are unavailable or pending.</p>}
              </section>
              <section className={styles.section}>
                <div className={styles.sectionHead}><h3>Recent session self-checks</h3><span>Evidence, not learner scores</span></div>
                {(detail.recent_checks ?? []).length > 0
                  ? <div className={styles.stack}>{detail.recent_checks?.map(check => (
                      <article className={styles.check} key={check.session_id}>
                        <div><strong>Session {check.session_id}</strong><span>{check.check_status === 'completed' ? 'Saved' : 'Insufficient evidence'}</span></div>
                        <p>{check.summary}</p>
                      </article>
                    ))}</div>
                  : <p className={styles.empty}>There are no post-benchmark self-check records yet.</p>}
              </section>
              <section className={styles.section}>
                <div className={styles.sectionHead}><h3>Recent evidence and governance</h3></div>
                {(detail.signal_events ?? []).length > 0
                  ? <div className={styles.stack}>{detail.signal_events?.slice(0, 12).map(event => (
                    <div className={styles.event} key={event.event_id}>
                      <strong>{event.signal_key}</strong><span>{event.evidence_summary}</span>
                      <small>{event.source_kind.replaceAll('_', ' ')}{event.session_id != null ? ` · Session ${event.session_id}` : ''}</small>
                    </div>
                  ))}</div>
                  : <p className={styles.empty}>No system signal events recorded yet.</p>}
                {(detail.historical_data_issues ?? []).length > 0 && (
                  <div className={styles.legacyList}>
                    <strong>Historical data-health issues (before activation)</strong>
                    {detail.historical_data_issues?.map(issue => (
                      <span key={issue.session_id}>Session {issue.session_id}: {issue.health_status.replaceAll('_', ' ')}</span>
                    ))}
                  </div>
                )}
                <p className={styles.governance}>The coach can adapt teaching methods. Changes to scoring, skill taxonomy, benchmark or system architecture still require your explicit approval.</p>
              </section>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
