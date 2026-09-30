import { useEffect, useMemo, useState } from 'react';
import { Check, Eye, EyeOff, PenLine, Save, User, Volume2, X } from 'lucide-react';
import { aboutMe, starters, writingTasks } from '../../data/writingTasks.js';
import { ScrollTabs } from '../ScrollTabs';
import { findLtVoice, hasSpeechSynthesis, speak } from '../../lib/speech.js';
import './styles.scss';

const DRAFT_KEY = 'writingDrafts';
const DONE_KEY = 'writingDone';
const CUSTOM_KEY = 'writingCustom';
const CUSTOM_ID = 'custom';

const RUSSIAN_ONLY = /[ыэъёя]/g;
const LT_DIACRITICS = /[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/;
const WORD_RE = /[\p{L}\p{M}ąčęėįšųūž]+/giu;

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

function words(text) {
  return text.match(WORD_RE) ?? [];
}

function stem(word) {
  return word.toLowerCase().slice(0, 5);
}

function similarity(mine, modelText) {
  const mineSet = new Set(mine.map(stem));
  if (!mineSet.size) return 0;
  const modelSet = new Set(words(modelText).map(stem));
  let hits = 0;
  mineSet.forEach((s) => {
    if ([...modelSet].some((m) => m === s || m.startsWith(s) || s.startsWith(m))) hits += 1;
  });
  return Math.round((hits / mineSet.size) * 100);
}

function analyze(text, modelText) {
  const trimmed = text.trim();
  const count = trimmed ? words(trimmed).length : 0;
  return {
    count,
    countOk: count >= 20 && count <= 30,
    capitalOk: !trimmed || /^[A-ZĄČĘĖĮŠŲŪŽ]/.test(trimmed),
    dotOk: !trimmed || /[.!?…]$/.test(trimmed),
    russianLetters: [...new Set(trimmed.match(RUSSIAN_ONLY) ?? [])],
    hasDiacritics: LT_DIACRITICS.test(trimmed),
    overlap: similarity(words(trimmed), modelText),
  };
}

function Facts() {
  return (
    <div className="wri__facts">
      <h3 className="wri__facts-title">
        <User size={15} />
        Tavo duomenys · Твои данные
      </h3>
      <ul className="wri__facts-list">
        {aboutMe.map((f) => (
          <li key={f.lt}>
            <span className="wri__fact-lt">{f.lt}</span>
            <span className="wri__fact-ru">{f.ru}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Writing() {
  const [custom, setCustom] = useState(() => load(CUSTOM_KEY, null));
  const [drafts, setDrafts] = useState(() => load(DRAFT_KEY, {}));
  const [done, setDone] = useState(() => load(DONE_KEY, {}));
  const [customOpen, setCustomOpen] = useState(false);
  const [customBrief, setCustomBrief] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [activeId, setActiveId] = useState(writingTasks[0].id);
  const [showRu, setShowRu] = useState(false);
  const [noVoice, setNoVoice] = useState(() => !hasSpeechSynthesis());

  const tasks = useMemo(() => {
    if (!custom?.brief?.trim()) return writingTasks;
    return [
      ...writingTasks,
      {
        id: CUSTOM_ID,
        emoji: '✍️',
        titleRu: 'Своё задание',
        topic: 'Savo užduotis',
        brief: custom.brief,
        points: custom.points ?? [],
        modelLt: custom.model ?? '',
        modelRu: '',
      },
    ];
  }, [custom]);

  const task = tasks.find((t) => t.id === activeId) ?? tasks[0];
  const text = drafts[task.id] ?? '';
  const report = useMemo(() => analyze(text, task.modelLt), [text, task.modelLt]);
  const doneCount = Object.values(done).filter(Boolean).length;

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

  const setText = (value) => {
    setDrafts((prev) => {
      const next = { ...prev, [task.id]: value };
      save(DRAFT_KEY, next);
      return next;
    });
  };

  const toggleDone = () => {
    setDone((prev) => {
      const next = { ...prev, [task.id]: !prev[task.id] };
      save(DONE_KEY, next);
      return next;
    });
  };

  const openCustom = () => {
    setCustomBrief(custom?.brief ?? '');
    setCustomModel(custom?.model ?? '');
    setCustomOpen(true);
  };

  const saveCustom = () => {
    if (!customBrief.trim()) return;
    const next = { brief: customBrief, model: customModel };
    setCustom(next);
    save(CUSTOM_KEY, next);
    setCustomOpen(false);
    setActiveId(CUSTOM_ID);
  };

  const removeCustom = () => {
    setCustom(null);
    save(CUSTOM_KEY, null);
    setActiveId(writingTasks[0].id);
  };

  const tabs = [
    ...tasks.map((t) => ({ id: t.id, label: `${t.emoji} ${t.titleRu}` })),
    { id: 'new', label: '➕ Своё задание' },
  ];

  const onTab = (id) => {
    if (id === 'new') {
      openCustom();
      return;
    }
    setActiveId(id);
  };

  return (
    <section id="rastai" className="wri">
      <div className="wri__head">
        <h2 className="wri__title">
          <PenLine size={20} />
          Rašto treneris — Письмо
        </h2>
        <p className="wri__sub">
          Слева задание экзамена, справа образец ответа с переводом. Внизу пиши свой ответ — посчитаем
          слова и подскажем, где ошибки. Черновики сохраняются автоматически.
        </p>
      </div>

      <Facts />

      <ScrollTabs items={tabs} activeId={task.id} onSelect={onTab} />

      {customOpen && (
        <div className="wri__custom">
          <div className="wri__custom-head">
            <strong>Savo užduotis · своё задание</strong>
            <button type="button" className="wri__icon" onClick={() => setCustomOpen(false)} aria-label="Закрыть">
              <X size={16} />
            </button>
          </div>
          <label>
            <span>Užduotis (текст задания на литовском)</span>
            <textarea
              value={customBrief}
              onChange={(e) => setCustomBrief(e.target.value)}
              placeholder="pvz. Norite aprašyti savo dieną…"
            />
          </label>
          <label>
            <span>Parašykite žinutę (20–30 žodžių)… · образец ответа</span>
            <textarea
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="pvz. Šiandien aš buvau darbe…"
            />
          </label>
          <div className="wri__custom-actions">
            <button type="button" className="wri__btn wri__btn--primary" onClick={saveCustom}>
              <Save size={15} />
              Išsaugoti
            </button>
            {custom?.brief && (
              <button type="button" className="wri__btn" onClick={removeCustom}>
                Ištrinti
              </button>
            )}
          </div>
        </div>
      )}

      <div className="wri__grid">
        <article className="wri__card wri__card--task">
          <h3 className="wri__card-title">
            {task.emoji} {task.topic}
          </h3>
          <p className="wri__brief">{task.brief}</p>
          {task.points?.length > 0 && (
            <ul className="wri__points">
              {task.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <div className="wri__starter">
            <span>Pradžia · начало</span>
            <strong>{starters[task.id] ?? 'Parašykite žinutę…'}</strong>
          </div>
        </article>

        <article className="wri__card wri__card--model">
          <div className="wri__model-head">
            <h3 className="wri__card-title">Pavyzdys · образец</h3>
            <div className="wri__model-actions">
              <button
                type="button"
                className="wri__icon"
                onClick={() => speak(task.modelLt)}
                aria-label="Озвучить образец"
                title="Озвучить образец"
              >
                <Volume2 size={16} />
              </button>
              <button
                type="button"
                className="wri__btn wri__btn--ghost"
                onClick={() => setShowRu((v) => !v)}
                aria-pressed={showRu}
              >
                {showRu ? <EyeOff size={15} /> : <Eye size={15} />}
                {showRu ? 'Slėpti ver.' : 'Rodyti ver.'}
              </button>
            </div>
          </div>
          <p className="wri__model-lt">{task.modelLt}</p>
          {showRu && <p className="wri__model-ru">{task.modelRu || 'Перевода нет — это ваше задание.'}</p>}
          {task.modelLt && <p className="wri__model-count">{words(task.modelLt).length} žodžiai</p>}
          {noVoice && <p className="wri__warn">⚠ На устройстве нет литовского голоса — текст читается по буквам.</p>}
        </article>
      </div>

      <div className="wri__answer">
        <div className="wri__answer-head">
          <h3 className="wri__card-title">Mano atsakymas · мой ответ</h3>
          <div className="wri__answer-tools">
            <button
              type="button"
              className="wri__btn wri__btn--ghost"
              onClick={() => speak(text)}
              disabled={!text.trim()}
            >
              <Volume2 size={15} />
              Paklausyti
            </button>
            <button
              type="button"
              className={`wri__btn ${done[task.id] ? 'wri__btn--done' : 'wri__btn--accent'}`}
              onClick={toggleDone}
              aria-pressed={Boolean(done[task.id])}
            >
              <Check size={15} />
              {done[task.id] ? 'Padaryta ✓' : 'Baigta'}
            </button>
          </div>
        </div>

        <textarea
          className="wri__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Parašykite savo žinutę čia…"
          rows={6}
          spellCheck={false}
        />

        <div className="wri__report">
          <span className={`wri__chip ${report.countOk ? 'wri__chip--ok' : 'wri__chip--warn'}`}>
            {report.count} žodžiai {report.countOk ? '✓' : '(reikia 20–30)'}
          </span>
          <span className={`wri__chip ${report.capitalOk ? 'wri__chip--ok' : 'wri__chip--bad'}`}>
            {report.capitalOk ? 'Didžioji raidé ✓' : 'Pradžkite didžiaja raide'}
          </span>
          <span className={`wri__chip ${report.dotOk ? 'wri__chip--ok' : 'wri__chip--bad'}`}>
            {report.dotOk ? 'Taškas ✓' : 'Baigkite tašku'}
          </span>
          <span className={`wri__chip ${report.russianLetters.length ? 'wri__chip--bad' : 'wri__chip--ok'}`}>
            {report.russianLetters.length
              ? `Rusiškos raidės: ${report.russianLetters.join(' ')}`
              : 'Tik lietuviškos raidės ✓'}
          </span>
          {!report.hasDiacritics && text.trim() && (
            <span className="wri__chip wri__chip--hint">Pridėkite lietuviškų raidžių: ą č ę ė į š ų ū ž</span>
          )}
          {text.trim() && (
            <span className="wri__chip wri__chip--info">Panaudota pavyzdžio žodžių: {report.overlap}%</span>
          )}
          <span className="wri__chip wri__chip--info">
            Atlikta: {doneCount} / {tasks.length}
          </span>
        </div>
      </div>
    </section>
  );
}