import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Heart, Volume2, X } from 'lucide-react';
import { wordKey } from '../../hooks/useStarred.js';
import { speak } from '../../lib/speech.js';
import './thematic.scss';

const FOLD = { ą: 'a', č: 'c', ę: 'e', ė: 'e', į: 'i', š: 's', ų: 'u', ū: 'u', ž: 'z' };
const SIGNS = 'ą č ę ė į š ų ū ž';

function fold(value) {
  return [...value.toLowerCase()]
    .map((ch) => FOLD[ch] ?? ch)
    .join('')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ThemeWrite({ words, knownSet, onMark }) {
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [doneCount, setDoneCount] = useState(0);

  const queue = useMemo(() => words, [words]);
  const safeIdx = Math.min(idx, queue.length - 1);
  const current = queue[safeIdx];
  const key = current ? wordKey(current) : '';

  const check = () => {
    if (!current || !value.trim()) return;
    const typed = fold(value);
    const exact = value.trim().toLowerCase() === current.lt.toLowerCase();
    if (exact) setResult({ kind: 'ok' });
    else if (typed === fold(current.lt)) setResult({ kind: 'diacritics' });
    else setResult({ kind: 'wrong' });
  };

  const next = (delta) => {
    setIdx((p) => Math.min(Math.max(p + delta, 0), queue.length - 1));
    setValue('');
    setResult(null);
  };

  const mark = () => {
    if (!current) return;
    if (!knownSet.has(key)) {
      onMark(key);
      setDoneCount((v) => v + 1);
    } else {
      onMark(key);
    }
  };

  if (!current) return null;

  const known = knownSet.has(key);

  return (
    <div className="thm__write">
      <div className="thm__write-top">
        <span>
          {safeIdx + 1} / {queue.length}
        </span>
        <span>Atpažinta: {doneCount}</span>
        <button type="button" className="thm__speak" onClick={() => speak(current.lt)}>
          <Volume2 size={15} />
          Klausyti
        </button>
      </div>

      <p className="thm__write-ru">{current.ru}</p>

      <div className="thm__write-row">
        <input
          className="thm__write-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check();
          }}
          placeholder="Rašykite lietuviškai…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="button" className="thm__btn thm__btn--primary" onClick={check}>
          <Check size={15} />
          Tikrinti
        </button>
      </div>

      {result?.kind === 'ok' && (
        <p className="thm__feedback thm__feedback--ok">
          <Check size={15} /> Teisingai! {current.lt}
        </p>
      )}
      {result?.kind === 'diacritics' && (
        <p className="thm__feedback thm__feedback--warn">
          Beveik! Patikrink raides: {SIGNS} → {current.lt}
        </p>
      )}
      {result?.kind === 'wrong' && (
        <p className="thm__feedback thm__feedback--bad">
          <X size={15} /> Neteisingai. Teisingai: {current.lt}
        </p>
      )}

      <div className="thm__write-nav">
        <button type="button" className="thm__btn" onClick={() => next(-1)} disabled={safeIdx === 0}>
          <ChevronLeft size={16} />
          Atgal
        </button>
        <button
          type="button"
          className={`thm__btn ${known ? 'thm__btn--on' : 'thm__btn--heart'}`}
          onClick={mark}
          aria-pressed={known}
        >
          <Heart size={15} fill={known ? 'currentColor' : 'none'} />
          {known ? 'Žinau ✓' : 'Žinau'}
        </button>
        <button
          type="button"
          className="thm__btn"
          onClick={() => next(1)}
          disabled={safeIdx >= queue.length - 1}
        >
          Pirmyn
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}