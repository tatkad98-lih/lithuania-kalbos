import { Header } from './components/Header';
import { Greeting } from './components/Greeting';
import { TopicTabs } from './components/TopicTabs';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Greeting />
        <TopicTabs />
      </main>
      <Footer />
    </>
  );
}

export default App;
