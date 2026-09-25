import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { PictureTopics } from './components/PictureTopics';
import { BookHub } from './components/BookHub';
import { Footer } from './components/Footer';
import { MatchGame } from './components/MatchGame';
import { Flashcards } from './components/Flashcards';
import { Spelling } from './components/Spelling';
import { BottomNav } from './components/BottomNav';
import { useTheme } from './hooks/useTheme.js';

const Nedienosbe = lazy(() =>
  import('./components/Nedienosbe').then((m) => ({ default: m.Nedienosbe })),
);

function App() {
  const [view, setView] = useState('tekstai');
  const [theme, toggleTheme] = useTheme();

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Header view={view} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        {view === 'tekstai' ? (
          <TopicTabs />
        ) : view === 'paveikslai' ? (
          <PictureTopics />
        ) : view === 'nedienosbe' ? (
          <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
            <Nedienosbe />
          </Suspense>
        ) : view === 'zodziai' ? (
          <MatchGame />
        ) : view === 'korteles' ? (
          <Flashcards />
        ) : (
          <Spelling />
        )}
      </main>
      <BookHub view={view} onNavigate={navigate} />
      <Footer />
      <BottomNav view={view} onNavigate={navigate} />
    </>
  );
}

export default App;
