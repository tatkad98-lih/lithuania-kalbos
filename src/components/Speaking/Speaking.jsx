import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessagesSquare,
  Mic,
  MicOff,
  RotateCcw,
  Shuffle,
  Volume2,
} from 'lucide-react';
import { speakingQuestions, speakingTopics } from '../../data/speakingQuestions.js';
import { aboutMe } from '../../data/writingTasks.js';
import { ScrollTabs } from '../ScrollTabs';
import { findLtVoice, hasSpeechSynthesis, speak, stopSpeaking } from '../../lib/speech.js';
import './styles.scss';

const ANSWERED_KEY = 'speakingAnswered';
const NOTES_KEY = 'speakingNotes';
const ALL = 'all';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function Speaking() {
  const Recognition = useMemo(() => getRecognition(), []);
  const [topic, setTopic] = useState(ALL);
  const [shuffledMode, setShuffledMode] = useState(false);
  const [pos, setPos] = useState(0);
  const [answered, setAnswered] = useState(() => load(ANSWERED_KEY, {}));
  const [notes, setNotes] = useState(() => load(NOTES_KEY, {}));
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [noVoice, setNoVoice] = useState(() => !hasSpeechSynthesis());
  const [rec, setRec] = useState(null);

  const pool = useMemo(() => {
    if (topic === ALL) return speakingQuestions;
    return speakingQuestions.filter((q) => q.topicId === topic);
  }, [topic]);

  const order = useMemo(() => {
    const indexes = pool.map((_, i) => i);
    return shuffledMode ? shuffled(indexes) : indexes;
  }, [pool, shuffledMode]);

  useEffect(() => {
    if (!hasSpeechSynthesis()) return undefined;
    const update = () => setNoVoice(findLtVoice() == null);
    window.speechSynthesis.addEventListener('voiceschanged', update);
    const t = window.setTimeout(update, 0);
    return () => {
      window.clearTimeout(t);
      window.speechSynthesis.removeEventListener('voiceschanged', update);
    };
  }, []);

  useEffect(
    () => () => {
      rec?.abort?.();
      stopSpeaking();
    },
    [rec],
  );

  const safePos = Math.min(pos, pool.length - 1);
  const index = order[safePos] ?? 0;
  const current = pool[index];
  const currentKey = current?.question ?? '';
  const topicMeta = speakingTopics.find((t) => t.id === current?.topicId);
  const doneCount = Object.keys(answered).length;
  const note = notes[currentKey] ?? '';

  if (!current) return null;

  const play = () => speak(current.question);

  const startMic = () => {
    if (!Recognition) {
      setMicError('Naršyklė nepalaiko garso įrašymo — parašykite atsakymą ranka.');
      return;
    }
    stopSpeaking();
    const instance = new Recognition();
    instance.lang = 'lt-LT';
    instance.interimResults = false;
    instance.maxAlternatives = 1;
    setMicError('');
    setRec(instance);
    setListening(true);
    instance.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();
      setNotes((prev) => {
        const next = { ...prev, [currentKey]: text };
        save(NOTES_KEY, next);
        return next;
      });
    };
    instance.onerror = (event) => {
      setMicError(
        event.error === 'not-allowed'
          ? 'Mikrofonas neleidžiamas — leiskite prieigos puslapyje.'
          : `Klaida: ${event.error}`,
      );
      setListening(false);
    };
    instance.onend = () => setListening(false);
    instance.start();
  };

  const stopMic = () => {
    rec?.stop?.();
    setListening(false);
  };

  const setNote = (value) => {
    setNotes((prev) => {
      const next = { ...prev, [currentKey]: value };
      save(NOTES_KEY, next);
      return next;
    });
  };

  const markAnswered = (value) => {
    setAnswered((prev) => {
      const next = { ...prev };
      if (value) next[currentKey] = true;
      else delete next[currentKey];
      save(ANSWERED_KEY, next);
      return next;
    });
  };

  const go = (delta) => {
    stopMic();
    setPos((p) => Math.min(Math.max(p + delta, 0), pool.length - 1));
  };

  const reshuffle = () => {
    stopMic();
    setShuffledMode((v) => !v);
    setPos(0);
  };

  const pickTopic = (next) => {
    stopMic();
    setTopic(next);
    setPos(0);
  };

  const resetAll = () => {
    setAnswered({});
    setNotes({});
    save(ANSWERED_KEY, {});
    save(NOTES_KEY, {});
    setPos(0);
  };

  const tabs = [
    { id: ALL, label: `🎲 Visi · ${speakingQuestions.length}` },
    ...speakingTopics.map((t) => ({
      id: t.id,
      label: `${t.emoji} ${t.titleRu} · ${t.questions.length}`,
    })),
  ];

  return (
    <section id="pokalbiai" className="spk">
      <div className="spk__head">
        <h2 className="spk__title">
          <MessagesSquare size={20} />
          Pokalbio valanda — Разговорная практика
        </h2>
        <p className="spk__sub">
          Преподаватель задаёт вопрос на литовском: 🔊 читает вслух, 🎤 записывает твой голосовой
          ответ. Ответы и отметки сохраняются автоматически.
        </p>
      </div>

      <div className="spk__hints">
        {aboutMe.map((f) => (
          <span key={f.lt} className="spk__hint">
            <b>{f.lt}:</b> {f.ru}
          </span>
        ))}
      </div>

      <ScrollTabs items={tabs} activeId={topic} onSelect={pickTopic} />

      <div className="spk__pills">
        <span className="spk__pill">
          Klausimas {safePos + 1} / {pool.length}
        </span>
        <span className="spk__pill">Atsakyta: {doneCount}</span>
        <button
          type="button"
          className={`spk__btn spk__btn--sm ${shuffledMode ? 'spk__btn--active' : ''}`}
          onClick={reshuffle}
          aria-pressed={shuffledMode}
        >
          <Shuffle size={14} />
          Maišyti
        </button>
        <button type="button" className="spk__btn spk__btn--sm" onClick={resetAll}>
          <RotateCcw size={14} />
          Išvalyti
        </button>
      </div>

      <div className="spk__card">
        <span className="spk__topic">
          {topicMeta?.emoji} {topicMeta?.titleRu}
        </span>
        <p className="spk__question">{current.question}</p>
        {noVoice && <p className="spk__warn">⚠ Нет литовского голоса — вопрос читается по буквам.</p>}

        <div className="spk__actions">
          <button type="button" className="spk__play" onClick={play} aria-label="Озвучить вопрос">
            <Volume2 size={30} />
            <span>Klausyti</span>
          </button>

          {listening ? (
            <button type="button" className="spk__mic spk__mic--live" onClick={stopMic}>
              <MicOff size={26} />
              <span>Stabdyti</span>
            </button>
          ) : (
            <button
              type="button"
              className="spk__mic"
              onClick={startMic}
              disabled={!Recognition}
              title={Recognition ? 'Записать ответ голосом' : 'Браузер не поддерживает распознавание'}
            >
              <Mic size={26} />
              <span>Atsakyti</span>
            </button>
          )}

          <button
            type="button"
            className={`spk__btn ${answered[currentKey] ? 'spk__btn--done' : 'spk__btn--primary'}`}
            onClick={() => markAnswered(!answered[currentKey])}
            aria-pressed={Boolean(answered[currentKey])}
          >
            <Check size={15} />
            {answered[currentKey] ? 'Atsakyta ✓' : 'Pažymėti'}
          </button>
        </div>

        {micError && <p className="spk__err">{micError}</p>}

        <label className="spk__answer">
          <span>Mano atsakymas · мой ответ</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Parašykite arba pasakykite balsu…"
            rows={3}
            spellCheck={false}
          />
        </label>

        <div className="spk__nav">
          <button type="button" className="spk__btn" onClick={() => go(-1)} disabled={safePos === 0}>
            <ChevronLeft size={16} />
            Atgal
          </button>
          <button
            type="button"
            className="spk__btn"
            onClick={() => go(1)}
            disabled={safePos >= pool.length - 1}
          >
            Pirmyn
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {!Recognition && (
        <p className="spk__note">
          В этом браузере нет распознавания речи — вопросы озвучиваются, а ответ пиши текстом. Для
          голосовых ответов лучше всего подходит Chrome.
        </p>
      )}
    </section>
  );
}