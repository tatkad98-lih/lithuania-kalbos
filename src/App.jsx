import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { PictureTopics } from './components/PictureTopics';
import { Footer } from './components/Footer';
import { MatchGame } from './components/MatchGame';
import { Flashcards } from './components/Flashcards';
import { Spelling } from './components/Spelling';
import { BottomNav } from './components/BottomNav';
import { useTheme } from './hooks/useTheme.js';

const Dictionary = lazy(() =>
  import('./components/Dictionary').then((m) => ({ default: m.Dictionary })),
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
        ) : view === 'slovar' ? (
          <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
            <Dictionary />
          </Suspense>
        ) : view === 'zodziai' ? (
          <MatchGame />
        ) : view === 'korteles' ? (
          <Flashcards />
        ) : (
          <Spelling />
        )}
      </main>
      <Footer />
      <BottomNav view={view} onNavigate={navigate} />
    </>
  );
}

export default App;
