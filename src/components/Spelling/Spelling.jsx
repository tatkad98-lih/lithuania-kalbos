import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Volume2, RotateCcw, Repeat } from 'lucide-react';
import { wordCategories, wordsByCategory, allWords } from '../../data/words.js';
import { ScrollTabs } from '../ScrollTabs';
import { useStarred, wordKey } from '../../hooks/useStarred.js';
import './styles.scss';

const ROUND = 20;
const ALL = 'all';
const STARRED = 'starred';

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function takeWords(pool, n) {
  return shuffled(pool).slice(0, Math.min(n, pool.length));
}

function poolFor(cat, starredSet) {
  if (cat === ALL) return allWords;
  if (cat === STARRED) return allWords.filter((w) => starredSet.has(wordKey(w)));
  return wordsByCategory[cat] ?? [];
}

function freshQueue(pool) {
  return takeWords(pool, ROUND).map((w) => ({ ...w, key: wordKey(w) }));
}

function norm(s) {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function speak(lt) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(lt);
    u.lang = 'lt-LT';
    synth.speak(u);
  } catch {
    // no TTS available
  }
}

export function Spelling() {
  const { starredSet } = useStarred();
  const [cat, setCat] = useState(ALL);
  const [mode, setMode] = useState('see');
  const [queue, setQueue] = useState(() => freshQueue(allWords));
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(null);
  const [strict, setStrict] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [known, setKnown] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [roundsDone, setRoundsDone] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const starredCount = starredSet.size;
  const done = idx >= queue.length;
  const isEmpty = queue.length === 0;
  const current = !done && !isEmpty ? queue[idx] : null;
  const left = queue.length - Math.min(idx, queue.length);

  const tabItems = useMemo(
    () => [
      { id: ALL, label: `🎲 Все слова · ${allWords.length}` },
      ...wordCategories.map((c) => ({ id: c.id, label: `${c.icon} ${c.titleRu} · ${c.count}` })),
      { id: STARRED, label: `⭐ Žvaigždutės · ${starredCount}` },
    ],
    [starredCount],
  );

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetFor = (pool) => {
    clearTimer();
    setQueue(freshQueue(pool));
    setIdx(0);
    setValue('');
    setStatus(null);
    setKnown(0);
    setMistakes([]);
  };

  const pickCat = (next) => {
    if (next === cat) return;
    setCat(next);
    resetFor(poolFor(next, starredSet));
  };

  const pickMode = (next) => {
    if (next === mode) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMode(next);
    resetFor(poolFor(cat, starredSet));
  };

  const newSet = () => {
    resetFor(poolFor(cat, starredSet));
    setRoundsDone((v) => v + 1);
  };

  const repeatMistakes = () => {
    if (!mistakes.length) return;
    clearTimer();
    setQueue(shuffled(mistakes));
    setIdx(0);
    setValue('');
    setStatus(null);
    setKnown(0);
    setMistakes([]);
    setRoundsDone((v) => v + 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [idx, mode, cat, done]);

  useEffect(() => {
    if (mode === 'hear' && current) speak(current.lt);
  }, [mode, current]);

  useEffect(
    () => () => {
      clearTimer();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    },
    [],
  );

  const pushMistake = (word) => {
    setMistakes((prev) => (prev.some((w) => w.key === word.key) ? prev : [...prev, word]));
  };

  const check = (e) => {
    e?.preventDefault();
    if (!current || status === 'ok') return;
    const good = strict
      ? value.toLowerCase().trim() === current.lt
      : norm(value) === norm(current.lt);
    if (good) {
      setStatus('ok');
      setKnown((v) => v + 1);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setIdx((v) => v + 1);
        setValue('');
        setStatus(null);
      }, 750);
    } else {
      setStatus('err');
      pushMistake(current);
    }
  };

  const skip = () => {
    if (!current || status === 'ok') return;
    clearTimer();
    pushMistake(current);
    setIdx((v) => v + 1);
    setValue('');
    setStatus(null);
  };

  return (
    <section id="rasyba" className="spell">
      <div className="spell__head">
        <h2 className="spell__title">
          <Keyboard size={20} />
          Rašyba — Правописание
        </h2>
        <p className="spell__sub">Пиши слова правильно: с русского или на слух. По 20 слов за раз.</p>
      </div>

      <div className="spell__modes">
        <button
          type="button"
          className={`spell__mode ${mode === 'see' ? 'spell__mode--active' : ''}`}
          onClick={() => pickMode('see')}
        >
          👁 Matau · пишу
        </button>
        <button
          type="button"
          className={`spell__mode ${mode === 'hear' ? 'spell__mode--active' : ''}`}
          onClick={() => pickMode('hear')}
        >
          🔊 Klausau · слушаю
        </button>
      </div>

      <ScrollTabs items={tabItems} activeId={cat} onSelect={pickCat} />

      <div className="spell__pills">
        <span className="spell__pill">Teisingai: {known}</span>
        <span className="spell__pill">Klaidos: {mistakes.length}</span>
        <span className="spell__pill">Liko: {left}</span>
      </div>

      {isEmpty ? (
        <div className="spell__empty">
          <p>
            <strong>Žvaigždutės tuščios.</strong> Отмечай сложные слова звёздочкой ⭐ на карточках —
            они сохранятся и будут ждать тебя здесь после перезагрузки.
          </p>
          <button type="button" className="spell__btn spell__btn--accent" onClick={() => pickCat(ALL)}>
            <RotateCcw size={15} />
            К словам
          </button>
        </div>
      ) : done ? (
        <div className="spell__done">
          <p>
            <strong>Rinkinys baigtas!</strong> Teisingai: {known}, klaidos: {mistakes.length}. Раундов:{' '}
            {roundsDone + 1}.
          </p>
          <div className="spell__controls">
            {mistakes.length > 0 && (
              <button type="button" className="spell__btn spell__btn--primary" onClick={repeatMistakes}>
                <Repeat size={15} />
                Pakartoti klaidas ({mistakes.length})
              </button>
            )}
            <button type="button" className="spell__btn spell__btn--accent" onClick={newSet}>
              <RotateCcw size={15} />
              Naujas rinkinys
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="spell__card">
            {mode === 'see' ? (
              <>
                <span className="spell__emoji">{current.emoji}</span>
                <span className="spell__word">{current.ru}</span>
                <span className="spell__hint">Parašyk lietuviškai</span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="spell__play"
                  onClick={() => speak(current.lt)}
                  title="Paklausyti dar kartą"
                  aria-label="Прослушать ещё раз"
                >
                  <Volume2 size={34} />
                </button>
                <span className="spell__hint">
                  Paklausyk ir parašyk · <strong>{current.ru}</strong>
                </span>
              </>
            )}
            <form onSubmit={check}>
              <input
                ref={inputRef}
                className={`spell__input ${status ? `spell__input--${status}` : ''}`}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (status === 'err') setStatus(null);
                }}
                placeholder={mode === 'see' && showHint ? `${current.lt.slice(0, 2)}…` : '…'}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={status === 'ok'}
              />
              <div className="spell__controls">
                <button type="submit" className="spell__btn spell__btn--primary" disabled={status === 'ok'}>
                  Tikrinti ✓
                </button>
                <button type="button" className="spell__btn" onClick={skip}>
                  Praleisti →
                </button>
              </div>
            </form>
            <div className={`spell__feedback ${status ? `spell__feedback--${status}` : ''}`}>
              {status === 'ok' && 'Teisingai! 🎉'}
              {status === 'err' && `Neteisingai. Teisingas: ${current.lt}`}
            </div>
            {mode === 'see' && (
              <div className="spell__toggles">
                <label className="spell__toggle">
                  <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
                  Griežtas režimas
                </label>
                <label className="spell__toggle">
                  <input
                    type="checkbox"
                    checked={showHint}
                    onChange={(e) => setShowHint(e.target.checked)}
                  />
                  Rodyti užuominą
                </label>
              </div>
            )}
          </div>

          <div className="spell__controls spell__controls--center">
            <span className="spell__progress">
              Žodis {Math.min(idx + 1, queue.length)} / {queue.length}
            </span>
            <button type="button" className="spell__btn spell__btn--accent" onClick={newSet}>
              <RotateCcw size={15} />
              Naujas rinkinys
            </button>
          </div>
        </>
      )}
    </section>
  );
}
