import { BookA, Library, GraduationCap, Languages } from 'lucide-react';
import { nedienosbeCards } from '../../data/nedienosbeCards.js';
import './styles.scss';

const ICONS = {
  book: BookA,
  library: Library,
  study: GraduationCap,
  languages: Languages,
};

export function BookHub({ view, onNavigate }) {
  return (
    <section className="book-hub">
      <div className="book-hub__head">
        <h2 className="book-hub__title">Nė dienos be lietuvių kalbos</h2>
        <p className="book-hub__sub">Материалы к учебнику: словарь, тексты, задания.</p>
      </div>

      <div className="book-hub__grid">
        {nedienosbeCards.map((card) => {
          const Icon = ICONS[card.icon] ?? BookA;
          const isActive = view === card.view;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.view)}
              className={`book-hub__card ${isActive ? 'book-hub__card--active' : ''}`}
            >
              <span className="book-hub__cover">
                <Icon size={34} />
              </span>
              <span className="book-hub__card-title">
                {card.titleRu}
                <em>{card.titleLt}</em>
              </span>
              <span className="book-hub__card-note">{card.note}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
