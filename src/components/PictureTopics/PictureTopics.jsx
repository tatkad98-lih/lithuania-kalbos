import { Tabs } from '@base-ui/react/tabs';
import { Images } from 'lucide-react';
import { pictureTopics } from '../../data/pictureTopics.js';
import './styles.scss';

const examTopicNumbers = new Set([6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27]);

function sourceFor(topicNumber) {
  return examTopicNumbers.has(topicNumber) ? 'Картинка с экзамена!' : 'Картинка создана ИИ';
}

function TextBlock({ title, children, variant = 'text' }) {
  return (
    <section className={`picture-topics__block picture-topics__block--${variant}`}>
      <h4>{title}</h4>
      <div>{typeof children === 'string' ? <p>{children}</p> : children}</div>
    </section>
  );
}

function PictureVariant({ topic, variant }) {
  const variantTitle = variant.label ? `${topic.title}, ${variant.label}` : topic.title;

  return (
    <article className="picture-topics__variant">
      {variant.label && <h4 className="picture-topics__variant-title">{variant.label}</h4>}

      <div className="picture-topics__layout">
        <figure className="picture-topics__figure">
          <img
            src={variant.image}
            alt={variant.description || `Иллюстрация к теме «${variantTitle}»`}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="picture-topics__content">
          {variant.description && (
            <TextBlock title="Описание экзаменуемого">{variant.description}</TextBlock>
          )}

          {variant.answer && (
            <TextBlock title="Как описать на литовском" variant="answer">
              {variant.answer}
            </TextBlock>
          )}

          {variant.translation && (
            <TextBlock title="Перевод" variant="translation">
              {variant.translation}
            </TextBlock>
          )}

          {variant.notes?.length > 0 && (
            <TextBlock title="Можно добавить" variant="notes">
              <ul>
                {variant.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </TextBlock>
          )}

          {variant.questions?.length > 0 && (
            <TextBlock title="Возможные вопросы" variant="questions">
              <ul>
                {variant.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </TextBlock>
          )}
        </div>
      </div>
    </article>
  );
}

export function PictureTopics() {
  const firstTopic = pictureTopics[0];

  return (
    <section id="paveikslai" className="picture-topics">
      <div className="picture-topics__head">
        <h2 className="picture-topics__title">
          <Images size={20} />
          Paveikslai — Картинки
        </h2>
        <p className="picture-topics__sub">
          Описываем картинки для экзамена A2: сначала рассматриваем сцену, затем читаем готовый ответ.
        </p>
      </div>

      <Tabs.Root className="picture-topics__tabs" defaultValue={firstTopic.id}>
        <Tabs.List className="picture-topics__list" aria-label="Темы картинок">
          {pictureTopics.map((topic) => (
            <Tabs.Tab key={topic.id} value={topic.id} className="picture-topics__tab">
              {topic.nr}. {topic.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {pictureTopics.map((topic) => (
          <Tabs.Panel key={topic.id} value={topic.id} className="picture-topics__panel">
            <h3 className="picture-topics__topic-title">
              {topic.nr}. {topic.title}
              <span>{sourceFor(topic.nr)}</span>
            </h3>
            {topic.variants.map((variant) => (
              <PictureVariant key={variant.image} topic={topic} variant={variant} />
            ))}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}
