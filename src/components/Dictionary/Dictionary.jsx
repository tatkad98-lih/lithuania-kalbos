import { useMemo, useState } from 'react';
import { BookA, Star } from 'lucide-react';
import { books, countWords } from '../../data/books.js';
import { ScrollTabs } from '../ScrollTabs';
import { useStarred, wordKey } from '../../hooks/useStarred.js';
import './styles.scss';

export function Dictionary() {
  const [bookId, setBookId] = useState(books[0].id);
  const [sectionId, setSectionId] = useState(books[0].sections[0].id);
  const { starredSet, toggleStar } = useStarred();

  const book = books.find((item) => item.id === bookId) ?? books[0];
  const section = book.sections.find((item) => item.id === sectionId) ?? book.sections[0];

  const tabs = useMemo(
    () => book.sections.map((item) => ({ id: item.id, label: `${item.nr}. ${item.shortRu}` })),
    [book],
  );

  const { pinnedRows, rows, total } = useMemo(() => {
    const pinnedRows = [];
    const rows = [];
    let pendingGroup = null;

    for (const entry of section.words) {
      if (entry.kind === 'group') {
        if (pendingGroup) rows.push(pendingGroup);
        pendingGroup = entry;
        continue;
      }
      if (starredSet.has(wordKey(entry))) {
        pinnedRows.push(entry);
        continue;
      }
      if (pendingGroup) {
        rows.push(pendingGroup);
        pendingGroup = null;
      }
      rows.push(entry);
    }

    return { pinnedRows, rows, total: section.words.filter((w) => w.kind !== 'group').length };
  }, [section, starredSet]);

  const selectBook = (id) => {
    const next = books.find((item) => item.id === id);
    if (!next) return;
    setBookId(id);
    setSectionId(next.sections[0].id);
  };

  const renderWord = (word, index) => {
    const key = wordKey(word);
    const starred = starredSet.has(key);

    return (
      <li key={`${key}-${index}`} className={`dict__item ${starred ? 'dict__item--pinned' : ''}`}>
        <div className="dict__pair">
          <span className="dict__lt">{word.lt}</span>
          <span className="dict__ru">{word.ru}</span>
        </div>
        <button
          type="button"
          className="dict__star"
          onClick={() => toggleStar(key)}
          aria-pressed={starred}
          aria-label={starred ? 'Открепить слово' : 'Закрепить слово'}
        >
          <Star size={18} fill={starred ? 'currentColor' : 'none'} />
        </button>
      </li>
    );
  };

  return (
    <section id="slovar" className="dict">
      <div className="dict__head">
        <h2 className="dict__title">
          <BookA size={20} />
          Žodynas — Словарь
        </h2>
        <p className="dict__sub">
          Словари учебников «Nė dienos be lietuvių kalbos» по урокам и главам. Нажмите на
          звезду — слово закрепится вверху списка.
        </p>
      </div>

      <div className="dict__books">
        {books.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectBook(item.id)}
            className={`dict__book ${item.id === book.id ? 'dict__book--active' : ''}`}
          >
            <span className="dict__book-name">
              <BookA size={16} />
              {item.titleRu}
            </span>
            <span className="dict__book-meta">
              {item.sections.length} {item.id === 'knyga-1' ? 'уроков' : 'глав'} ·{' '}
              {countWords(item)} слов
            </span>
            <span className="dict__book-lt">{item.titleLt}</span>
          </button>
        ))}
      </div>

      <ScrollTabs items={tabs} activeId={section.id} onSelect={setSectionId} />

      <div className="dict__panel">
        <h3 className="dict__section-title">
          {section.nr}. {section.titleLt}
          <span>{section.shortRu}</span>
        </h3>
        <p className="dict__count">
          {total} žodžių · ⭐ {pinnedRows.length}
        </p>

        {pinnedRows.length > 0 && (
          <div className="dict__pinned">
            <h4 className="dict__pinned-title">Закреплённые слова</h4>
            <ul className="dict__list">{pinnedRows.map(renderWord)}</ul>
          </div>
        )}

        <ul className="dict__list">
          {rows.map((entry, index) =>
            entry.kind === 'group' ? (
              <li key={`${entry.lt}-${index}`} className="dict__group">
                {entry.lt} <em>{entry.ru}</em>
              </li>
            ) : (
              renderWord(entry, index)
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
