import { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, Star, RotateCcw, Repeat } from 'lucide-react';
import { wordCategories, wordsByCategory, allWords } from '../../data/words.js';
import { ScrollTabs } from '../ScrollTabs';
import { useStarred, wordKey } from '../../hooks/useStarred.js';
import './styles.scss';

const ROUND = 20;
const ALL = 'all';
const STARRED = 'starred';
const SWIPE_X = 100;
// Direction-lock threshold (px): h = card swipe, v = page scroll.
const LOCK_PX = 10;

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

export function Flashcards() {
  const { starredSet, toggleStar, isStarred } = useStarred();
  const [cat, setCat] = useState(ALL);
  const [queue, setQueue] = useState(() => freshQueue(allWords));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [repeatPile, setRepeatPile] = useState([]);
  const [leaving, setLeaving] = useState(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [roundsDone, setRoundsDone] = useState(0);
  const startRef = useRef(null);
  const draggingRef = useRef(false);
  // 'h' = horizontal card swipe, 'v' = vertical page scroll.
  const lockRef = useRef(null);
  const touchStartRef = useRef(null);
  const cardRef = useRef(null);

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

  const resetFor = (pool) => {
    setQueue(freshQueue(pool));
    setIdx(0);
    setFlipped(false);
    setKnown(0);
    setRepeatPile([]);
    setLeaving(null);
    setDrag({ x: 0, y: 0 });
  };

  const pickCat = (next) => {
    if (next === cat) return;
    setCat(next);
    resetFor(poolFor(next, starredSet));
  };

  const newSet = () => {
    resetFor(poolFor(cat, starredSet));
    setRoundsDone((v) => v + 1);
  };

  const repeatHard = () => {
    if (!repeatPile.length) return;
    setQueue(shuffled(repeatPile));
    setIdx(0);
    setFlipped(false);
    setKnown(0);
    setRepeatPile([]);
    setLeaving(null);
    setDrag({ x: 0, y: 0 });
    setRoundsDone((v) => v + 1);
  };

  const grade = (know) => {
    if (leaving || done || isEmpty || !current) return;
    const word = current;
    setLeaving(know ? 'right' : 'left');
    window.setTimeout(() => {
      if (know) setKnown((v) => v + 1);
      else setRepeatPile((prev) => [...prev, word]);
      setIdx((v) => v + 1);
      setFlipped(false);
      setLeaving(null);
      setDrag({ x: 0, y: 0 });
    }, 220);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (done || isEmpty) return;
      if (e.key === 'ArrowRight') grade(true);
      else if (e.key === 'ArrowLeft') grade(false);
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Non-passive touchmove: React listeners are passive, but the horizontal
  // lock needs preventDefault to stop page scroll from stealing the swipe.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (e.touches.length > 1) {
        draggingRef.current = false;
        lockRef.current = 'v';
        touchStartRef.current = null;
        return;
      }
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      lockRef.current = null;
    };

    const onTouchMove = (e) => {
      const s = touchStartRef.current;
      if (!s) return;
      if (e.touches.length > 1) {
        draggingRef.current = false;
        lockRef.current = 'v';
        return;
      }
      const t = e.touches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (!lockRef.current) {
        if (Math.abs(dx) > LOCK_PX && Math.abs(dx) > Math.abs(dy)) lockRef.current = 'h';
        else if (Math.abs(dy) > LOCK_PX && Math.abs(dy) > Math.abs(dx)) lockRef.current = 'v';
      }
      if (lockRef.current === 'h') e.preventDefault();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [done, isEmpty, idx]);

  const onPointerDown = (e) => {
    if (leaving || done || isEmpty) return;
    draggingRef.current = true;
    lockRef.current = null;
    startRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || leaving || done || isEmpty) return;
    if (lockRef.current === 'v') return;
    const s = startRef.current;
    if (!s) return;
    setDrag({ x: e.clientX - s.x, y: (e.clientY - s.y) * 0.25 });
  };

  const onPointerUp = (e) => {
    if (!draggingRef.current) {
      lockRef.current = null;
      return;
    }
    draggingRef.current = false;
    const s = startRef.current;
    startRef.current = null;
    const lock = lockRef.current;
    lockRef.current = null;
    if (lock === 'v' || leaving || done || isEmpty || !s) {
      setDrag({ x: 0, y: 0 });
      return;
    }
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (dx >= SWIPE_X) {
      setDrag({ x: 0, y: 0 });
      grade(true);
    } else if (dx <= -SWIPE_X) {
      setDrag({ x: 0, y: 0 });
      grade(false);
    } else if (Math.hypot(dx, dy) < 10) {
      setDrag({ x: 0, y: 0 });
      setFlipped((f) => !f);
    } else {
      setDrag({ x: 0, y: 0 });
    }
  };

  const onPointerCancel = () => {
    draggingRef.current = false;
    startRef.current = null;
    lockRef.current = null;
    setDrag({ x: 0, y: 0 });
  };

  const rot = Math.max(-14, Math.min(14, drag.x / 18));
  const cardStyle = leaving
    ? {
        transform: `translateX(${leaving === 'right' ? 480 : -480}px) rotate(${leaving === 'right' ? 22 : -22}deg)`,
        transition: 'transform 0.22s ease, opacity 0.22s ease',
        opacity: 0,
      }
    : drag.x !== 0 || drag.y !== 0
      ? { transform: `translateX(${drag.x}px) translateY(${drag.y}px) rotate(${rot}deg)` }
      : { transform: 'translateX(0px)', transition: 'transform 0.18s ease' };

  const starred = current ? isStarred(current.key) : false;

  return (
    <section id="korteles" className="cards">
      <div className="cards__head">
        <h2 className="cards__title">
          <Layers size={20} />
          Kortelės — Карточки
        </h2>
        <p className="cards__sub">
          Если знаешь сразу — смахни вправо / нажми Žinojau. Хочешь проверить себя — нажми на карточку,
          там литовский перевод.
        </p>
      </div>

      <ScrollTabs items={tabItems} activeId={cat} onSelect={pickCat} />

      <div className="cards__pills">
        <span className="cards__pill">Liko: {left}</span>
        <span className="cards__pill">Žinau: {known}</span>
        <span className="cards__pill">Kartosiu: {repeatPile.length}</span>
      </div>

      {isEmpty ? (
        <div className="cards__empty">
          <p>
            <strong>Žvaigždutės tuščios.</strong> Отмечай сложные слова звёздочкой ⭐ на карточке —
            они сохранятся и будут ждать тебя здесь после перезагрузки.
          </p>
          <button type="button" className="cards__btn cards__btn--accent" onClick={() => pickCat(ALL)}>
            <RotateCcw size={15} />
            К словам
          </button>
        </div>
      ) : done ? (
        <div className="cards__done">
          <p>
            <strong>Rinkinys baigtas!</strong> Žinau: {known}, Kartosiu: {repeatPile.length}. Раундов:{' '}
            {roundsDone + 1}.
          </p>
          <div className="cards__controls">
            {repeatPile.length > 0 && (
              <button type="button" className="cards__btn cards__btn--primary" onClick={repeatHard}>
                <Repeat size={15} />
                Pakartoti ({repeatPile.length})
              </button>
            )}
            <button type="button" className="cards__btn cards__btn--accent" onClick={newSet}>
              <RotateCcw size={15} />
              Naujas rinkinys
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cards__stage">
            <div
              className="fcard"
              ref={cardRef}
              style={cardStyle}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
            >
              <button
                type="button"
                className={`fcard__star ${starred ? 'fcard__star--on' : ''}`}
                title={starred ? 'Убрать звёздочку' : 'Отметить звёздочкой'}
                aria-label={starred ? 'Убрать звёздочку' : 'Отметить звёздочкой'}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (current) toggleStar(current.key);
                }}
              >
                <Star size={18} fill={starred ? 'currentColor' : 'none'} />
              </button>
              <div className={`fcard__inner ${flipped ? 'fcard__inner--flip' : ''}`}>
                <div className="fcard__face fcard__face--front">
                  <span className="fcard__emoji">{current.emoji}</span>
                  <span className="fcard__word">{current.ru}</span>
                  <span className="fcard__hint">Palieskite = atsakymas</span>
                </div>
                <div className="fcard__face fcard__face--back">
                  <span className="fcard__emoji">{current.emoji}</span>
                  <span className="fcard__word">{current.lt}</span>
                  <span className="fcard__word-sub">{current.ru}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="cards__swipe-hint">
            ↔ Iš kart nustumkite, jei žinote · 👆 Palieskite, jei norite pasitikrinti
          </p>

          <div className="cards__controls">
            <button type="button" className="cards__btn cards__btn--no" onClick={() => grade(false)}>
              ✕ Nežinojau
            </button>
            <button type="button" className="cards__btn cards__btn--yes" onClick={() => grade(true)}>
              ✓ Žinojau
            </button>
          </div>

          <div className="cards__controls cards__controls--center">
            <span className="cards__progress">
              Kortelė {Math.min(idx + 1, queue.length)} / {queue.length}
            </span>
            <button type="button" className="cards__btn cards__btn--accent" onClick={newSet}>
              <RotateCcw size={15} />
              Naujas rinkinys
            </button>
          </div>
        </>
      )}
    </section>
  );
}
