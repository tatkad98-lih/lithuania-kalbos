import { Tabs } from '@base-ui/react/tabs';
import { BookOpenText } from 'lucide-react';
import { topics } from '../../data/topics.js';
import { examTextsById } from '../../data/examTexts.js';
import { TextReader } from '../TextReader';
import './styles.scss';

export function TopicTabs() {
  const first = topics[0];

  return (
    <section id="tekstai" className="topics">
      <div className="topics__head">
        <h2 className="topics__title">
          <BookOpenText size={20} />
          Tekstai — Тексты
        </h2>
        <p className="topics__sub">
          Читаем по-литовски. Кликай на слова, чтобы увидеть перевод.
        </p>
      </div>

      <Tabs.Root className="topics__tabs" defaultValue={first.id}>
        <Tabs.List className="topics__list">
          {topics.map((t) => (
            <Tabs.Tab key={t.id} value={t.id} className="topics__tab">
              {t.nr}. {t.lt}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {topics.map((t) => (
          <Tabs.Panel key={t.id} value={t.id} className="topics__panel">
            <h3 className="topics__topic-title">
              {t.lt} <span>— {t.ru}</span>
            </h3>
            <TextReader paragraphs={examTextsById[t.id] || []} />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
