import { useState } from 'react';
import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { MatchGame } from './components/MatchGame';
import { BottomNav } from './components/BottomNav';

function App() {
  const [view, setView] = useState('tekstai');

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Header view={view} onNavigate={navigate} />
      <main>{view === 'tekstai' ? <TopicTabs /> : <MatchGame />}</main>
      <BottomNav view={view} onNavigate={navigate} />
    </>
  );
}

export default App;
