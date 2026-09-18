import { Header } from './components/Header';
import { TopicTabs } from './components/TopicTabs';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <TopicTabs />
      </main>
      <Footer />
    </>
  );
}

export default App;
