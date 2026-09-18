import { googleTranslateUrl } from '../../data/dictionary.js';
import './styles.scss';

export function Word({ lt, ru, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`word ${active ? 'word--active' : ''}`}
      title={ru ? `${lt} — ${ru}` : lt}
    >
      {active && (
        <span className={`word__tooltip ${ru ? '' : 'word__tooltip--fallback'}`}>
          {ru || (
            <>
              Перевод не найден
              <a
                className="word__gt"
                href={googleTranslateUrl(lt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Google Translate ↗
              </a>
            </>
          )}
        </span>
      )}
      <span className="word__lt">{lt}</span>
    </button>
  );
}
