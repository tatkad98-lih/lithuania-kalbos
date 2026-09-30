import { Keyboard, MessagesSquare, PenLine } from 'lucide-react';
import { practiceModes } from './modes.js';
import './styles.scss';

const icons = { spelling: Keyboard, writing: PenLine, speaking: MessagesSquare };

export function SubNav({ mode, onSelect }) {
  return (
    <nav className="subnav" aria-label="Практика">
      {practiceModes.map((item) => {
        const Icon = icons[item.id];
        const active = item.id === mode;
        return (
          <a
            key={item.id}
            href={item.hash}
            onClick={(e) => {
              e.preventDefault();
              onSelect(item.id);
            }}
            className={`subnav__item ${active ? 'subnav__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={16} />
            <span className="subnav__label">{item.label}</span>
            <span className="subnav__note">{item.note}</span>
          </a>
        );
      })}
    </nav>
  );
}