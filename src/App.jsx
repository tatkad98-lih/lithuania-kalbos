import { useState } from 'react';
import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { MatchGame } from './components/MatchGame';
import { Flashcards } from './components/Flashcards';
import { BottomNav } from './components/BottomNav';
import { useTheme } from './hooks/useTheme.js';

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
        {view === 'tekstai' ? <TopicTabs /> : view === 'zodziai' ? <MatchGame /> : <Flashcards />}
      </main>
      <BottomNav view={view} onNavigate={navigate} />
    </>
  );
}

export default App;
