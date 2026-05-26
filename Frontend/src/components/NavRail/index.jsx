import {
  Armchair,
  Sparkles,
  FolderOpen,
  Bookmark,
} from 'lucide-react';
import styles from './NavRail.module.css';

/** @typedef {'catalog' | 'inspiration' | 'library' | 'shortlist'} NavId */

/** @type {{ id: NavId, Icon: typeof Armchair, label: string }[]} */
const NAV_ITEMS = [
  { id: 'catalog', Icon: Armchair, label: 'Catalog' },
  { id: 'inspiration', Icon: Sparkles, label: 'Inspiration' },
  { id: 'library', Icon: FolderOpen, label: 'My Library' },
  { id: 'shortlist', Icon: Bookmark, label: 'Shortlist' },
];

/**
 * @param {{ activeNav: NavId | null, onNavClick: (id: NavId) => void }} props
 */
export default function NavRail({ activeNav, onNavClick }) {
  return (
    <nav className={styles.rail}>
      {NAV_ITEMS.map(({ id, Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`${styles.navBtn} ${activeNav === id ? styles.navBtnActive : ''}`}
          onClick={() => onNavClick(id)}
          title={label}
        >
          <Icon size={20} strokeWidth={1.75} className={styles.navIcon} aria-hidden />
          <span className={styles.navLabel}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export { NAV_ITEMS };
