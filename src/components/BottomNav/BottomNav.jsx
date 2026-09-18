import { BookOpenText, BookMarked, GraduationCap } from 'lucide-react';
import './styles.scss';

const items = [
  { id: 'tekstai', href: '#tekstai', icon: BookOpenText, label: 'Тексты', active: true },
  { id: 'zodziai', href: '#', icon: BookMarked, label: 'Слова', active: false },
  { id: 'gramatika', href: '#', icon: GraduationCap, label: 'Грамматика', active: false },
];

export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Основная навигация">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            className={`bottomnav__item ${item.active ? 'bottomnav__item--active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
