import { useMemo, useState } from 'react';
import { BookA, Star } from 'lucide-react';
import { nedienosbeSections } from '../../data/nedienosbe/index.js';
import { ScrollTabs } from '../ScrollTabs';
import { useStarred, wordKey } from '../../hooks/useStarred.js';
import './styles.scss';

export function Nedienosbe() {
  const [activeId, setActiveId] = useState(nedienosbeSections[0].id);
  const { starredSet, toggleStar } = useStarred();

  const section = nedienosbeSections.find((s) => s.id === activeId) ?? nedienosbeSections[0];

  const tabs = useMemo(
    () => nedienosbeSections.map((s) => ({ id: s.id, label: `${s.nr}. ${s.shortRu}` })),
    [],
  );

  const { pinnedRows, rows, total } = useMemo(() => {
    const pinnedRows = [];
    const rows = [];
    let pendingGroup = null;

    for (const entry of section.words) {
      if (entry.kind === 'group') {
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

  const renderWord = (word, index) => {
    const key = wordKey(word);
    const starred = starredSet.has(key);

    return (
      <li key={`${key}-${index}`} className={`ned__item ${starred ? 'ned__item--pinned' : ''}`}>
        <div className="ned__pair">
          <span className="ned__lt">{word.lt}</span>
          <span className="ned__ru">{word.ru}</span>
        </div>
        <button
          type="button"
          className="ned__star"
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
    <section id="nedienosbe" className="ned">
      <div className="ned__head">
        <h2 className="ned__title">
          <BookA size={20} />
          Žodynas — Словарь
        </h2>
        <p className="ned__sub">
          Словарь учебника «Nė dienos be lietuvių kalbos» по главам. Нажмите на звезду — слово
          закрепится вверху списка.
        </p>
      </div>

      <ScrollTabs items={tabs} activeId={section.id} onSelect={setActiveId} />

      <div className="ned__panel">
        <h3 className="ned__section-title">
          {section.nr}. {section.titleLt}
          <span>{section.shortRu}</span>
        </h3>
        <p className="ned__count">
          {total} žodžių · ⭐ {pinnedRows.length}
        </p>

        {pinnedRows.length > 0 && (
          <div className="ned__pinned">
            <h4 className="ned__pinned-title">Закреплённые слова</h4>
            <ul className="ned__list">{pinnedRows.map(renderWord)}</ul>
          </div>
        )}

        <ul className="ned__list">
          {rows.map((entry, index) =>
            entry.kind === 'group' ? (
              <li key={`${entry.lt}-${index}`} className="ned__group">
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
