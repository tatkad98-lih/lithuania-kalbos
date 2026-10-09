import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { PictureTopics } from './components/PictureTopics';
import { Footer } from './components/Footer';
import { MatchGame } from './components/MatchGame';
import { Flashcards } from './components/Flashcards';
import { Spelling } from './components/Spelling';
import { SubNav } from './components/SubNav';
import { HASH_BY_MODE, MODE_BY_HASH } from './components/SubNav/modes.js';
import { BottomNav } from './components/BottomNav';
import { useTheme } from './hooks/useTheme.js';

const Dictionary = lazy(() =>
  import('./components/Dictionary').then((m) => ({ default: m.Dictionary })),
);

const Writing = lazy(() => import('./components/Writing').then((m) => ({ default: m.Writing })));

const Speaking = lazy(() =>
  import('./components/Speaking').then((m) => ({ default: m.Speaking })),
);

const VIEW_IDS = ['tekstai', 'paveikslai', 'slovar', 'zodziai', 'korteles', 'rasyba'];

function currentHash() {
  return typeof window === 'undefined' ? '' : window.location.hash;
}

function modeFromHash(hash = currentHash()) {
  return MODE_BY_HASH[hash] ?? 'spelling';
}

function viewFromHash(hash = currentHash()) {
  if (hash.startsWith('#slovar-')) return 'slovar';
  if (MODE_BY_HASH[hash]) return 'rasyba';
  const id = hash.replace('#', '');
  return VIEW_IDS.includes(id) ? id : 'tekstai';
}

function bookFromHash(hash = currentHash()) {
  const match = /^#slovar-(.+)$/.exec(hash);
  return match ? match[1] : null;
}

function applyHash(hash) {
  if (currentHash() !== hash) window.history.pushState(null, '', hash);
}

function App() {
  const [view, setView] = useState(() => viewFromHash());
  const [mode, setMode] = useState(() => modeFromHash());
  const [bookId, setBookId] = useState(() => bookFromHash());
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const onHashChange = () => {
      setMode(modeFromHash());
      setBookId(bookFromHash());
      setView(viewFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (v) => {
    setView(v);
    if (v === 'rasyba') setMode('spelling');
    if (v === 'slovar') setBookId(null);
    applyHash(v === 'rasyba' ? HASH_BY_MODE.spelling : `#${v}`);
    window.scrollTo({ top: 0 });
  };

  const openBook = useCallback(
    (id) => {
      setBookId(id);
      setView('slovar');
      applyHash(`#slovar-${id}`);
      window.scrollTo({ top: 0 });
    },
    [],
  );

  const closeBook = useCallback(() => {
    setBookId(null);
    applyHash('#slovar');
    window.scrollTo({ top: 0 });
  }, []);

  const selectMode = useCallback((next) => {
    setMode(next);
    setView('rasyba');
    applyHash(HASH_BY_MODE[next]);
    window.scrollTo({ top: 0 });
  }, []);

  const renderPractice = () => {
    if (mode === 'writing') {
      return (
        <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
          <Writing />
        </Suspense>
      );
    }
    if (mode === 'speaking') {
      return (
        <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
          <Speaking />
        </Suspense>
      );
    }
    return <Spelling />;
  };

  return (
    <>
      <Header view={view} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        {view === 'tekstai' ? (
          <TopicTabs />
        ) : view === 'paveikslai' ? (
          <PictureTopics />
        ) : view === 'slovar' ? (
          <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
            <Dictionary bookId={bookId} onOpenBook={openBook} onBack={closeBook} />
          </Suspense>
        ) : view === 'zodziai' ? (
          <MatchGame />
        ) : view === 'korteles' ? (
          <Flashcards />
        ) : (
          <>
            <SubNav mode={mode} onSelect={selectMode} />
            {renderPractice()}
          </>
        )}
      </main>
      <Footer />
      <BottomNav view={view} onNavigate={navigate} />
    </>
  );
}

export default App;