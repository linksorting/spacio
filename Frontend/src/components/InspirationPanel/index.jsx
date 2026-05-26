import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { INSPIRATION_CATEGORIES } from '@/lib/catalogData';
import styles from './InspirationPanel.module.css';

/**
 * @param {{
 *   onClose: () => void,
 *   onLoadRoom: (room: import('@/lib/catalogData').InspirationRoom) => void,
 * }} props
 */
export default function InspirationPanel({ onClose, onLoadRoom }) {
  const [drillCategory, setDrill] = useState(null);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        {drillCategory ? (
          <button type="button" className={styles.backBtn} onClick={() => setDrill(null)} aria-label="Back">
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
        ) : null}
        <span className={styles.panelTitle}>
          {drillCategory ? drillCategory.label : 'Inspiration'}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {drillCategory ? (
        <div className={styles.grid}>
          {drillCategory.rooms.map((room) => (
            <div
              key={room.id}
              className={styles.tile}
              onClick={() => onLoadRoom(room)}
              onKeyDown={(e) => e.key === 'Enter' && onLoadRoom(room)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.tileImageBox}>
                <img
                  src={room.thumbnail}
                  alt={room.name}
                  className={styles.tileImage}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      `https://placehold.co/200x200/323232/888888?text=${encodeURIComponent(room.style)}`;
                  }}
                />
                <span className={styles.tileBadge}>{room.style}</span>
              </div>
              <div className={styles.tileLabel}>{room.name}</div>
            </div>
          ))}

          {drillCategory.rooms.length === 0 && (
            <div className={styles.emptyState}>
              No rooms yet.
            </div>
          )}
        </div>
      ) : (
        <div className={styles.catList}>
          {INSPIRATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={styles.catRow}
              onClick={() => setDrill(cat)}
            >
              <span className={styles.catLabel}>{cat.label}</span>
              <ChevronRight size={18} strokeWidth={2} className={styles.catArrow} aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
