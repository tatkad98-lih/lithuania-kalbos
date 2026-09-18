import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <>
      <Header />
      <main>
        <TopicTabs />
      </main>
      <BottomNav />
    </>
  );
}

export default App;
