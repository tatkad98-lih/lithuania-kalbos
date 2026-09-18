import { useState } from 'react';
import { Button } from '@base-ui/react/button';
import { MousePointerClick, Languages } from 'lucide-react';
import { Word } from '../Word';
import { translateWord } from '../../data/dictionary.js';
import './styles.scss';

const WORD_RE = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/;

function tokenize(lt) {
  
  return lt.split(/([A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+)/g);
}

export function TextReader({ paragraphs = [] }) {
  const [activeKey, setActiveKey] = useState(null);

  const handleWordClick = (key) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };

  const clearActive = () => setActiveKey(null);

  return (
    <div className="reader">
      <div className="reader__hint">
        <MousePointerClick size={16} />
        <span>Нажми на любое литовское слово — над ним появится перевод</span>
      </div>

      <div className="reader__body">
        {paragraphs.map((para, pIdx) => (
          <p key={para.id || pIdx} className="reader__lt">
            {tokenize(para.lt).map((part, tIdx) => {
              if (!part) return null;
              if (WORD_RE.test(part)) {
                const key = `${pIdx}:${tIdx}`;
                return (
                  <Word
                    key={key}
                    lt={part}
                    ru={translateWord(part)}
                    active={activeKey === key}
                    onClick={() => handleWordClick(key)}
                  />
                );
              }
              return <span key={`${pIdx}:${tIdx}`}>{part}</span>;
            })}
          </p>
        ))}
      </div>

      <div className="reader__desktop-controls">
        <Button className="reader__btn" onClick={clearActive}>
          <Languages size={15} />
          Сбросить
        </Button>
      </div>
    </div>
  );
}
