import { BookOpenText, BookMarked, GraduationCap } from 'lucide-react';
import './styles.scss';

const items = [
  { id: 'tekstai', view: 'tekstai', icon: BookOpenText, label: 'Тексты' },
  { id: 'zodziai', view: 'zodziai', icon: BookMarked, label: 'Слова' },
  { id: 'gramatika', view: null, icon: GraduationCap, label: 'Грамматика' },
];

export function BottomNav({ view, onNavigate }) {
  return (
    <nav className="bottomnav" aria-label="Основная навигация">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.view !== null ? view === item.view : false;
        return (
          <a
            key={item.id}
            href={item.view === 'zodziai' ? '#zodziai' : item.view === 'tekstai' ? '#tekstai' : '#'}
            onClick={
              item.view
                ? (e) => {
                    e.preventDefault();
                    onNavigate(item.view);
                  }
                : undefined
            }
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
