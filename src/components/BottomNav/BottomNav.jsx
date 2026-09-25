import { BookA, BookOpenText, BookMarked, Images, Layers, Keyboard } from 'lucide-react';
import './styles.scss';

const items = [
  { id: 'tekstai', view: 'tekstai', icon: BookOpenText, label: 'Тексты' },
  { id: 'paveikslai', view: 'paveikslai', icon: Images, label: 'Картинки' },
  { id: 'slovar', view: 'slovar', icon: BookA, label: 'Словарь' },
  { id: 'zodziai', view: 'zodziai', icon: BookMarked, label: 'Слова' },
  { id: 'korteles', view: 'korteles', icon: Layers, label: 'Карточки' },
  { id: 'rasyba', view: 'rasyba', icon: Keyboard, label: 'Rašyba' },
];

export function BottomNav({ view, onNavigate }) {
  return (
    <nav className="bottomnav" aria-label="Основная навигация">
      {items.map((item) => {
        const Icon = item.icon;
        const active = view === item.view;
        return (
          <a
            key={item.id}
            href={`#${item.view}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.view);
            }}
            className={`bottomnav__item ${active ? 'bottomnav__item--active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
