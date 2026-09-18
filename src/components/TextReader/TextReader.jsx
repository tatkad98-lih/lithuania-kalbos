import { useState } from 'react';
import { Button } from '@base-ui/react/button';
import { Languages, Eye, EyeOff, MousePointerClick } from 'lucide-react';
import { Word } from '../Word';
import { translateWord } from '../../data/dictionary.js';
import './styles.scss';

function tokenize(lt) {
  // Делим по пробелам, пунктуацию оставляем внутри токена для отображения
  return lt.split(/\s+/).filter(Boolean);
}

export function TextReader({ paragraphs }) {
  const [activeKey, setActiveKey] = useState(null);
  const [showFullRu, setShowFullRu] = useState(false);

  const handleWordClick = (paraId, idx) => {
    const key = `${paraId}:${idx}`;
    setActiveKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="reader">
      <div className="reader__hint">
        <MousePointerClick size={16} />
        <span>Нажми на любое литовское слово — над ним появится перевод на русский</span>
      </div>

      <div className="reader__controls">
        <Button
          className="reader__btn reader__btn--primary"
          onClick={() => setShowFullRu((v) => !v)}
        >
          {showFullRu ? <EyeOff size={15} /> : <Eye size={15} />}
          {showFullRu ? 'Скрыть весь перевод' : 'Показать весь перевод'}
        </Button>
        <Button className="reader__btn" onClick={() => setActiveKey(null)}>
          <Languages size={15} />
          Сбросить слова
        </Button>
      </div>

      <div className="reader__body">
        {paragraphs.map((p) => (
          <div key={p.id} className="reader__para">
            <p className="reader__lt">
              {tokenize(p.lt).map((token, idx) => {
                const key = `${p.id}:${idx}`;
                const ru = translateWord(token);
                return (
                  <Word
                    key={key}
                    lt={token}
                    ru={ru}
                    active={activeKey === key}
                    onClick={() => handleWordClick(p.id, idx)}
                  />
                );
              })}
            </p>
            {showFullRu && <p className="reader__ru">{p.ru}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
