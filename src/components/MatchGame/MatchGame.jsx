import { useState } from 'react';
import { ArrowRight, RotateCcw, Puzzle } from 'lucide-react';
import { wordCategories, wordsByCategory, allWords } from '../../data/words.js';
import { ScrollTabs } from '../ScrollTabs';
import './styles.scss';

const ROUND = 20;
const ALL = 'all';

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function takeRound(pool, n) {
  const s = shuffled(pool);
  let left = s.slice(0, Math.min(n, s.length));
  // Короткие хвосты добиваем словами из пула
  if (left.length < n && pool.length > left.length) {
    const rest = shuffled(pool.filter((w) => !left.includes(w)));
    left = left.concat(rest.slice(0, n - left.length));
  }
  return left;
}

// Делит перемешанный пул категории на чанки по 20 без повторов внутри прохода
function dealDeck(pool) {
  const deck = shuffled(pool);
  const chunks = [];
  for (let i = 0; i < deck.length; i += ROUND) chunks.push(deck.slice(i, i + ROUND));
  const last = chunks[chunks.length - 1];
  if (last && last.length < ROUND && pool.length > last.length) {
    const rest = shuffled(pool.filter((w) => !last.includes(w)));
    chunks[chunks.length - 1] = last.concat(rest.slice(0, ROUND - last.length));
  }
  return chunks;
}

function freshState(cat, chunks, chunkIdx) {
  const left = chunks[chunkIdx].map((w, i) => ({ ...w, id: i }));
  return {
    cat,
    chunks,
    chunkIdx,
    left,
    right: shuffled(left),
    matched: [],
    selLt: null,
    selRu: null,
    err: [],
    roundErrors: 0,
  };
}

function startCat(cat) {
  if (cat === ALL) return freshState(cat, [takeRound(allWords, ROUND)], 0);
  return freshState(cat, dealDeck(wordsByCategory[cat]), 0);
}

export function MatchGame() {
  const [s, setS] = useState(() => startCat(ALL));
  const [totalPairs, setTotalPairs] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [roundsDone, setRoundsDone] = useState(0);

  const done = s.matched.length === s.left.length;

  const pickCat = (cat) => {
    if (cat === s.cat) return;
    setS(startCat(cat));
  };

  const nextRound = () => {
    setRoundsDone((v) => v + 1);
    if (s.cat === ALL) {
      setS(freshState(ALL, [takeRound(allWords, ROUND)], 0));
      return;
    }
    if (s.chunkIdx + 1 < s.chunks.length) {
      const idx = s.chunkIdx + 1;
      setS((prev) => freshState(prev.cat, prev.chunks, idx));
    } else {
      // Проход по категории закончен — тасуем заново
      setS(freshState(s.cat, dealDeck(wordsByCategory[s.cat]), 0));
    }
  };

  const retryRound = () => {
    setS((prev) => ({
      ...prev,
      right: shuffled(prev.left),
      matched: [],
      selLt: null,
      selRu: null,
      err: [],
      roundErrors: 0,
    }));
  };

  const attempt = (ltId, ruId) => {
    if (ltId === ruId) {
      setS((prev) => ({ ...prev, matched: [...prev.matched, ltId], selLt: null, selRu: null }));
      setTotalPairs((v) => v + 1);
    } else {
      setS((prev) => ({ ...prev, err: [ltId, ruId], selLt: null, selRu: null, roundErrors: prev.roundErrors + 1 }));
      setTotalErrors((v) => v + 1);
      setTimeout(() => setS((prev) => ({ ...prev, err: [] })), 450);
    }
  };

  const onLt = (id) => {
    if (s.err.length || s.matched.includes(id)) return;
    if (s.selRu !== null) attempt(id, s.selRu);
    else setS((prev) => ({ ...prev, selLt: prev.selLt === id ? null : id }));
  };

  const onRu = (id) => {
    if (s.err.length || s.matched.includes(id)) return;
    if (s.selLt !== null) attempt(s.selLt, id);
    else setS((prev) => ({ ...prev, selRu: prev.selRu === id ? null : id }));
  };

  return (
    <section id="zodziai" className="match">
      <div className="match__head">
        <h2 className="match__title">
          <Puzzle size={20} />
          Žodžiai — Слова
        </h2>
        <p className="match__sub">
          Соединяй пары: нажми слово слева, затем перевод справа. По {ROUND} слов за раз.
        </p>
      </div>

      <ScrollTabs
        items={[
          { id: ALL, label: `🎲 Все слова · ${allWords.length}` },
          ...wordCategories.map((c) => ({ id: c.id, label: `${c.icon} ${c.titleRu} · ${c.count}` })),
        ]}
        activeId={s.cat}
        onSelect={pickCat}
      />

      <div className="match__stats">
        <span>
          Соединено: <strong>{s.matched.length}/{s.left.length}</strong>
        </span>
        <span>
          Ошибки: <strong>{s.roundErrors}</strong>
        </span>
        <span>
          Всего пар: <strong>{totalPairs}</strong>
        </span>
        <span>
          Всего ошибок: <strong>{totalErrors}</strong>
        </span>
      </div>

      {done ? (
        <div className="match__done">
          <p>
            <strong>Раунд пройден!</strong> Ошибок: {s.roundErrors}. Раундов: {roundsDone + 1}.
          </p>
          <button type="button" className="match__btn match__btn--primary" onClick={nextRound}>
            <ArrowRight size={15} />
            Следующие {ROUND}
          </button>
        </div>
      ) : (
        <div className="match__board">
          <div className="match__col">
            {s.left.map((w) => (
              <button
                key={w.id}
                type="button"
                disabled={s.matched.includes(w.id)}
                onClick={() => onLt(w.id)}
                className={[
                  'match__card',
                  s.selLt === w.id ? 'match__card--sel' : '',
                  s.matched.includes(w.id) ? 'match__card--ok' : '',
                  s.err[0] === w.id ? 'match__card--err' : '',
                ].join(' ')}
              >
                {w.lt}
              </button>
            ))}
          </div>
          <div className="match__col">
            {s.right.map((w) => (
              <button
                key={w.id}
                type="button"
                disabled={s.matched.includes(w.id)}
                onClick={() => onRu(w.id)}
                className={[
                  'match__card',
                  s.selRu === w.id ? 'match__card--sel' : '',
                  s.matched.includes(w.id) ? 'match__card--ok' : '',
                  s.err[1] === w.id ? 'match__card--err' : '',
                ].join(' ')}
              >
                {w.ru}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="match__controls">
        <button type="button" className="match__btn" onClick={retryRound}>
          <RotateCcw size={15} />
          Заново
        </button>
        <button type="button" className="match__btn match__btn--primary" onClick={nextRound}>
          <ArrowRight size={15} />
          Следующие {ROUND}
        </button>
      </div>
    </section>
  );
}
