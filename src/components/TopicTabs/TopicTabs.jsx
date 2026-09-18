import { Tabs } from '@base-ui/react/tabs';
import { BookOpenText, Clock } from 'lucide-react';
import { topics } from '../../data/topics.js';
import { apieManeParagraphs } from '../../data/textApieMane.js';
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
          Первая вкладка: читаем по-литовски. Кликай на слова, чтобы увидеть перевод.
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

        <Tabs.Panel value={first.id} className="topics__panel">
          <h3 className="topics__topic-title">
            {first.lt} <span>— {first.ru}</span>
          </h3>
          <TextReader paragraphs={apieManeParagraphs} />
        </Tabs.Panel>

        {topics.slice(1).map((t) => (
          <Tabs.Panel key={t.id} value={t.id} className="topics__panel">
            <div className="topics__empty">
              <Clock size={18} />
              <p>
                <strong>
                  {t.nr}. {t.lt} — {t.ru}
                </strong>
                <br />
                Текст ещё переносим из учебника. Сначала разберём первую тему до конца.
              </p>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
