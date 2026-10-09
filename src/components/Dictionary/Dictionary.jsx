import { lazy, Suspense, useMemo, useState } from 'react';
import { BookA, ChevronLeft, Star } from 'lucide-react';
import { books, countSections, countWords } from '../../data/books.js';
import { ScrollTabs } from '../ScrollTabs';
import { useStarred, wordKey } from '../../hooks/useStarred.js';
import './styles.scss';

const BookThematic = lazy(() =>
  import('./BookThematic.jsx').then((m) => ({ default: m.BookThematic })),
);

const SECTIONS_KEY = 'dictionarySections';

function loadSections() {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY);
    const value = raw ? JSON.parse(raw) : null;
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

function buildRows(section, starredSet) {
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
}

function Shelf({ items, starredPerBook, sectionByBook, onOpenBook }) {
  return (
    <>
      <div className="dict__head">
        <h2 className="dict__title">
          <BookA size={20} />
          Žodynas — Словарь
        </h2>
        <p className="dict__sub">
          Два учебника «Nė dienos be lietuvių kalbos». Выберите книгу — внутри словарь по урокам
          и главам, а звезда закрепляет слово вверху списка.
        </p>
      </div>

      <div className="dict__shelf">
        {items.map((book) => {
          const saved = book.sections?.find((item) => item.id === sectionByBook[book.id]);
          const savedIndex = book.sections
            ? book.sections.findIndex((item) => item.id === saved?.id)
            : -1;

          return (
            <button
              key={book.id}
              type="button"
              className={`dict__book dict__book--${book.tone}`}
              onClick={() => onOpenBook(book.id)}
            >
              <span className="dict__cover">
                <span className="dict__cover-spine" />
                <span className="dict__cover-nr">{book.nr}</span>
                <span className="dict__cover-title">{book.titleLt}</span>
                <span className="dict__cover-subtitle">{book.subtitleLt}</span>
                <span className="dict__cover-rule" />
                <span className="dict__cover-year">{book.year}</span>
              </span>

              <span className="dict__book-caption">
                <b className="dict__book-name">{book.titleRu}</b>
                <span className="dict__book-meta">
                  {countSections(book)} {book.wordUnit} · {countWords(book)} слов
                </span>
                {starredPerBook[book.id] > 0 && (
                  <span className="dict__book-stars">⭐ {starredPerBook[book.id]}</span>
                )}
                {savedIndex > 0 && (
                  <span className="dict__book-next">
                    Продолжить: {saved.nr}. {saved.shortRu}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function Dictionary({ bookId = null, onOpenBook, onBack }) {
  const [sectionByBook, setSectionByBook] = useState(loadSections);
  const { starredSet, toggleStar } = useStarred();

  const starredPerBook = useMemo(() => {
    const counts = {};
    for (const book of books) {
      if (book.kind === 'thematic') {
        counts[book.id] = 0;
        continue;
      }
      counts[book.id] = book.sections.reduce(
        (sum, section) =>
          sum +
          section.words.filter((word) => word.kind !== 'group' && starredSet.has(wordKey(word)))
            .length,
        0,
      );
    }
    return counts;
  }, [starredSet]);

  const book = bookId ? books.find((item) => item.id === bookId) : null;
  const isThematic = book?.kind === 'thematic';
  const section =
    book && !isThematic
      ? (book.sections.find((item) => item.id === sectionByBook[book.id]) ?? book.sections[0])
      : null;

  const tabs = useMemo(
    () =>
      book && !isThematic
        ? book.sections.map((item) => ({ id: item.id, label: `${item.nr}. ${item.shortRu}` }))
        : [],
    [book, isThematic],
  );

  const { pinnedRows, rows, total } = useMemo(
    () => (section ? buildRows(section, starredSet) : { pinnedRows: [], rows: [], total: 0 }),
    [section, starredSet],
  );

  const selectSection = (id) => {
    if (!book) return;
    setSectionByBook((prev) => {
      const next = { ...prev, [book.id]: id };
      try {
        localStorage.setItem(SECTIONS_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
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

  if (!book) {
    return (
      <section id="slovar" className="dict">
        <Shelf
          items={books}
          starredPerBook={starredPerBook}
          sectionByBook={sectionByBook}
          onOpenBook={onOpenBook}
        />
      </section>
    );
  }

  return (
    <section id="slovar" className="dict">
      <button type="button" className="dict__back" onClick={onBack}>
        <ChevronLeft size={16} />
        Книги
      </button>

      <div className={`dict__open-head dict__book--${book.tone}`}>
        <span className="dict__open-cover">{book.nr}</span>
        <div className="dict__open-titles">
          <h2 className="dict__title">
            {book.titleRu}
            <span className="dict__open-lt">
              {book.titleLt} · {book.subtitleLt}
            </span>
          </h2>
          <p className="dict__sub">
            {book.year} · {countSections(book)} {book.wordUnit} · {countWords(book)} слов
          </p>
        </div>
      </div>

      {isThematic ? (
        <Suspense fallback={<p className="topics__sub">Kraunama…</p>}>
          <BookThematic book={book} />
        </Suspense>
      ) : (
        <>
          <ScrollTabs items={tabs} activeId={section.id} onSelect={selectSection} />

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
        </>
      )}
    </section>
  );
}