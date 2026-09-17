'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccessGate } from './core-ui';
import { useLearning } from './learning-provider';

const chapters = [
  { href: '/', label: 'Dashboard', number: '01', title: 'Current Chapter', note: 'Your learning status and next training focus.' },
  { href: '/skills', label: 'Skills', number: '02', title: 'Skill Record', note: 'Evidence, scores, review state, and development.' },
  { href: '/sessions', label: 'Sessions', number: '03', title: 'Training Journal', note: 'Your session history and learning evidence.' },
  { href: '/analytics', label: 'Analytics', number: '04', title: 'Progress Record', note: 'Longitudinal progress, benchmarks, and coverage.' },
  { href: '/profile', label: 'Profile', number: '05', title: 'Player Status', note: 'Level, XP, rewards, and learning profile.' },
] as const;

export function PaperBookShell({ children: _children }: { children: React.ReactNode }) {
  const { dashboard, status } = useLearning();
  const pathname = usePathname();

  if (status === 'booting' || status === 'loading') {
    return <main className="paper-loading"><span className="paper-loading__sheet"/><b>Opening your learning journal…</b></main>;
  }
  if (!dashboard || status === 'locked') return <AccessGate />;

  const index = Math.max(0, chapters.findIndex((chapter) => chapter.href === pathname));
  const chapter = chapters[index];
  const previous = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return (
    <main className="paper-app-shell">
      <div className="paper-desk" aria-label="English Level Up learning journal">
        <div className="paper-desk__shade" aria-hidden="true" />
        <header className="paper-book-brand" aria-label="English Level Up">
          <span>ENGLISH</span>
          <strong>LEVEL UP</strong>
          <small>LEARNING JOURNAL</small>
        </header>

        <div className="book-stage">
          <EdgeControl direction="previous" href={previous?.href} label={previous ? `Previous: ${previous.label}` : 'First chapter'} />

          <div className="book-spread" key={pathname}>
            <PaperStackFrame side="left" />
            <PaperStackFrame side="right" />

            <PaperPage className="book-page--left">
              <div className="book-page__chapter-no">CHAPTER {chapter.number}</div>
              <div className="book-page__hero">
                <span>{chapter.label.toUpperCase()}</span>
                <h1>{chapter.title}</h1>
                <p>{chapter.note}</p>
              </div>
              <div className="book-page__rule" />
              <div className="book-page__stage-note">
                <b>BOOK SHELL PREVIEW</b>
                <p>Stage 1 validates the paper system, responsive book structure, chapter navigation, and page controls before learning content is restyled.</p>
              </div>
              <div className="book-page__folio">{index * 2 + 1}</div>
            </PaperPage>

            <PaperPage className="book-page--right">
              <div className="book-page__chapter-no">ENGLISH LEVEL UP</div>
              <div className="book-page__right-copy">
                <span className="book-page__kicker">CURRENT SECTION</span>
                <h2>{chapter.label}</h2>
                <p>The live data layer remains unchanged. This page is intentionally a structural placeholder until the shell is approved.</p>
                <div className="book-page__placeholder-lines" aria-hidden="true"><i/><i/><i/><i/></div>
              </div>
              <div className="book-page__navigation-hint">
                <span>{previous ? `← ${previous.label}` : 'Beginning'}</span>
                <b>{index + 1} / {chapters.length}</b>
                <span>{next ? `${next.label} →` : 'End'}</span>
              </div>
              <div className="book-page__folio">{index * 2 + 2}</div>
            </PaperPage>

            <div className="book-gutter" aria-hidden="true" />
          </div>

          <EdgeControl direction="next" href={next?.href} label={next ? `Next: ${next.label}` : 'Last chapter'} />

          <nav className="book-tabs" aria-label="Book chapters">
            {chapters.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : ''} aria-current={pathname === item.href ? 'page' : undefined}>
                <b>{item.number}</b>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <nav className="book-tabs-mobile" aria-label="Book chapters mobile">
          {chapters.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'is-active' : ''} aria-current={pathname === item.href ? 'page' : undefined}>
              <b>{item.number}</b>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

function PaperPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`book-page ${className}`}>
      <div className="paper-edge paper-edge--top" aria-hidden="true" />
      <div className="paper-edge paper-edge--right" aria-hidden="true" />
      <div className="paper-edge paper-edge--bottom" aria-hidden="true" />
      <div className="paper-edge paper-edge--left" aria-hidden="true" />
      <img className="paper-corner paper-corner--tl" src="/paper-ui/page/11.png" alt="" draggable={false}/>
      <img className="paper-corner paper-corner--tr" src="/paper-ui/page/13.png" alt="" draggable={false}/>
      <img className="paper-corner paper-corner--bl" src="/paper-ui/page/15.png" alt="" draggable={false}/>
      <img className="paper-corner paper-corner--br" src="/paper-ui/page/17.png" alt="" draggable={false}/>
      <div className="book-page__content">{children}</div>
    </section>
  );
}

function PaperStackFrame({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`book-page-stack book-page-stack--${side}`} aria-hidden="true">
      <div className="stack-edge stack-edge--top" />
      <div className="stack-edge stack-edge--right" />
      <div className="stack-edge stack-edge--bottom" />
      <div className="stack-edge stack-edge--left" />
      <img className="stack-corner stack-corner--tl" src="/paper-ui/page-stack/28.png" alt="" />
      <img className="stack-corner stack-corner--tr" src="/paper-ui/page-stack/30.png" alt="" />
      <img className="stack-corner stack-corner--bl" src="/paper-ui/page-stack/32.png" alt="" />
      <img className="stack-corner stack-corner--br" src="/paper-ui/page-stack/34.png" alt="" />
    </div>
  );
}

function EdgeControl({ direction, href, label }: { direction: 'previous' | 'next'; href?: string; label: string }) {
  const pieces = direction === 'next' ? ['16', '17', '18'] : ['28', '29', '30'];
  const content = (
    <span className={`page-control page-control--${direction}`} aria-hidden="true">
      <img src={`/paper-ui/buttons/${pieces[0]}.png`} alt="" draggable={false}/>
      <span style={{ backgroundImage: `url('/paper-ui/buttons/${pieces[1]}.png')` }} />
      <img src={`/paper-ui/buttons/${pieces[2]}.png`} alt="" draggable={false}/>
    </span>
  );

  if (!href) return <button className={`book-edge-control book-edge-control--${direction}`} disabled aria-label={label}>{content}</button>;
  return <Link className={`book-edge-control book-edge-control--${direction}`} href={href} aria-label={label}>{content}</Link>;
}
