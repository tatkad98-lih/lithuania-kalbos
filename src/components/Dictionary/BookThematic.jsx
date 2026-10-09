import { useMemo, useState } from 'react';
import { ChevronLeft, Heart, Layers, List, Pencil, Puzzle } from 'lucide-react';
import { knyga3 } from '../../data/knyga3/index.js';
import { knyga4 } from '../../data/knyga4/index.js';
import { wordKey } from '../../hooks/useStarred.js';
import { useKnown } from '../../hooks/useKnown.js';
import { Flashcards } from '../Flashcards';
import { MatchGame } from '../MatchGame';
import { ThemeWrite } from './ThemeWrite.jsx';
import './thematic.scss';

const BOOKS = {
  'knyga-3': knyga3,
  'knyga-4': knyga4,
};

const MODES = [
  { id: 'list', label: 'Sąrašas · Список', icon: List },
  { id: 'cards', label: 'Kortelės · Карточки', icon: Layers },
  { id: 'pairs', label: 'Poros · Пары', icon: Puzzle },
  { id: 'write', label: 'Rašykite · Напиши', icon: Pencil },
];

function percent(stats) {
  return stats.total ? Math.round((stats.known / stats.total) * 100) : 0;
}

function themeName(theme) {
  if (!theme.title) return `Буква ${theme.letter.toUpperCase()}`;
  return theme.nr ? `${theme.nr}. ${theme.title}` : theme.title;
}

function Progress({ stats }) {
  const pct = percent(stats);
  return (
    <span className="thm__progress" title={`${stats.known} из ${stats.total}`}>
      <span className="thm__progress-bar">
        <span className="thm__progress-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="thm__progress-text">{pct}%</span>
    </span>
  );
}

export function BookThematic({ book }) {
  const data = BOOKS[book.id] ?? knyga3;
  const flatBook = data.parts.every((part) => part.themes.length === 1 && part.themes[0].id === part.id);
  const [partId, setPartId] = useState(null);
  const [themeId, setThemeId] = useState(null);
  const [mode, setMode] = useState('list');
  const { knownSet, toggleKnown } = useKnown();

  const statsByTheme = useMemo(() => {
    const map = new Map();
    for (const part of data.parts) {
      for (const theme of part.themes) {
        let known = 0;
        for (const word of theme.words) {
          if (knownSet.has(wordKey(word))) known += 1;
        }
        map.set(theme.id, { known, total: theme.words.length });
      }
    }
    return map;
  }, [data, knownSet]);

  const statsByPart = useMemo(() => {
    const map = new Map();
    for (const part of data.parts) {
      const sum = part.themes.reduce(
        (acc, theme) => {
          const stats = statsByTheme.get(theme.id);
          return { known: acc.known + stats.known, total: acc.total + stats.total };
        },
        { known: 0, total: 0 },
      );
      map.set(part.id, sum);
    }
    return map;
  }, [data.parts, statsByTheme]);

  const part = partId ? data.parts.find((item) => item.id === partId) : null;
  // a part that holds a single unnamed list of words opens straight to it
  const flat = part && part.themes.length === 1 && part.themes[0].id === part.id ? part.themes[0] : null;
  const theme = flat ?? part?.themes.find((item) => item.id === themeId) ?? null;

  const rows = [];
  for (const word of theme?.words ?? []) {
    rows.push({ ...word, key: wordKey(word) });
  }
  // words marked with a heart go to the end of the list
  const knownRows = [...rows.filter((row) => !knownSet.has(row.key)), ...rows.filter((row) => knownSet.has(row.key))];
  const themeStats = theme ? statsByTheme.get(theme.id) : { known: 0, total: 0 };

  const openTheme = (nextPart, nextTheme) => {
    setPartId(nextPart.id);
    setThemeId(nextTheme.id);
    setMode('list');
  };

  if (theme) {
    return (
      <div className="thm">
        <button
          type="button"
          className="thm__back"
          onClick={() => {
            setThemeId(null);
            setMode('list');
          }}
        >
          <ChevronLeft size={16} />
          {flat ? 'Dalys · Части' : part.title}
        </button>

        <div className="thm__head">
          <h3 className="thm__title">{themeName(theme)}</h3>
          <p className="thm__meta">
            {themeStats.known} iš {themeStats.total} žodžių · {percent(themeStats)}% ·{' '}
            <Heart size={13} fill="currentColor" /> значит «знаю хорошо»
          </p>
        </div>

        <div className="thm__modes">
          {MODES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`thm__mode ${item.id === mode ? 'thm__mode--active' : ''}`}
                aria-pressed={item.id === mode}
                onClick={() => setMode(item.id)}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        {mode === 'cards' && (
          <Flashcards
            key={`cards-${theme.id}`}
            pool={rows.map((row) => ({ ...row, lt: row.f ? `${row.lt}, ${row.f}` : row.lt }))}
            title={themeName(theme)}
            mark="heart"
            embedded
          />
        )}

        {mode === 'pairs' && (
          <MatchGame
            key={`pairs-${theme.id}`}
            pool={rows}
            title={themeName(theme)}
            embedded
          />
        )}

        {mode === 'write' && (
          <ThemeWrite key={`write-${theme.id}`} words={theme.words} knownSet={knownSet} onMark={toggleKnown} />
        )}

        {mode === 'list' && (
          <ul className="thm__words">
            {knownRows.map((row) => {
              const known = knownSet.has(row.key);
              return (
                <li key={row.key} className={`thm__word ${known ? 'thm__word--known' : ''}`}>
                  <span className="thm__ru">{row.ru}</span>
                  <span className="thm__lt">
                    {row.lt}
                    {row.f && <em className="thm__forms">{row.f}</em>}
                  </span>
                  <button
                    type="button"
                    className={`thm__heart ${known ? 'thm__heart--on' : ''}`}
                    onClick={() => toggleKnown(row.key)}
                    aria-pressed={known}
                    aria-label={known ? 'Убрать сердечко' : 'Знаю это слово хорошо'}
                    title={known ? 'Убрать сердечко' : 'Знаю это слово хорошо'}
                  >
                    <Heart size={17} fill={known ? 'currentColor' : 'none'} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  if (part) {
    return (
      <div className="thm">
        <button type="button" className="thm__back" onClick={() => setPartId(null)}>
          <ChevronLeft size={16} />
          Dalys · Части
        </button>

        <div className="thm__head">
          <h3 className="thm__title">{part.title}</h3>
          <p className="thm__meta">
            {flat
              ? `${flat.words.length} žodžių`
              : `${part.themes.length} temų · ${part.themes.reduce((sum, item) => sum + item.words.length, 0)} žodžių`}
          </p>
        </div>

        {flat ? null : (
          <div className="thm__themes">
            {part.themes.map((item) => (
              <button
                key={item.id}
                type="button"
                className="thm__theme"
                onClick={() => openTheme(part, item)}
              >
                <span className="thm__theme-name">{themeName(item)}</span>
                <span className="thm__theme-meta">
                  {item.words.length} žodžių · {percent(statsByTheme.get(item.id))}%
                </span>
                <Progress stats={statsByTheme.get(item.id)} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="thm">
      <div className="thm__head">
        <h3 className="thm__title">{book.titleLt}</h3>
        <p className="thm__meta">
          {[
            `${data.parts.length} dalys`,
            flatBook ? null : `${data.parts.reduce((sum, part) => sum + part.themes.length, 0)} temų`,
            `${data.parts.reduce(
              (sum, item) => sum + item.themes.reduce((s, theme) => s + theme.words.length, 0),
              0,
            )} žodžių`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <div className="thm__parts">
        {data.parts.map((item) => (
          <button
            key={item.id}
            type="button"
            className="thm__part"
            onClick={() => {
              setPartId(item.id);
              setThemeId(null);
            }}
          >
            <span className="thm__part-name">{item.title}</span>
            <span className="thm__part-meta">
              {item.themes.length} temų ·{' '}
              {item.themes.reduce((sum, theme) => sum + theme.words.length, 0)} žodžių ·{' '}
              {percent(statsByPart.get(item.id))}%
            </span>
            <Progress stats={statsByPart.get(item.id)} />
          </button>
        ))}
      </div>
    </div>
  );
}