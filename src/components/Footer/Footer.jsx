import { Heart } from 'lucide-react';
import './styles.scss';

export function Footer() {
  return (
    <footer className="footer">
      <p>
        Sukurta su <Heart size={13} /> for Tatsiana — mokomės lietuvių kalbos
      </p>
      <span className="footer__tech">React • Vite • SCSS • Base UI • Lucide</span>
    </footer>
  );
}
