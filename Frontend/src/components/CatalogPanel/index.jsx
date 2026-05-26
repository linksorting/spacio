import {
  ArrowLeft,
  Camera,
  Info,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { CATALOG_FILTERS } from '@/lib/catalogData';
import styles from './CatalogPanel.module.css';

/**
 * @param {{
 *   categories: import('@/lib/catalogData').CategoryCard[],
 *   onClose: () => void,
 *   onAddItem: (item: import('@/lib/catalogData').FurnitureItem) => void,
 *   onDragItemStart?: (event: DragEvent, item: import('@/lib/catalogData').FurnitureItem) => void,
 * }} props
 */
export default function CatalogPanel({ categories, onClose, onAddItem, onDragItemStart }) {
  const [query, setQuery] = useState('');
  const [exactMatch, setExact] = useState(false);
  const [activeFilter, setFilter] = useState('All');
  const [drillCategory, setDrill] = useState(null);

  const filteredCategories = categories.filter((c) => {
    const q = query.toLowerCase();
    if (!q) return true;
    if (exactMatch) return c.name.toLowerCase() === q;
    return c.name.toLowerCase().includes(q)
      || c.items.some((item) => item.name.toLowerCase().includes(q));
  });

  const isLegacy = (sourceOrId) => (
    sourceOrId === 'legacy' || String(sourceOrId).startsWith('legacy-')
  );

  return (
    <div className={styles.panel}>
      {drillCategory ? (
        <div className={styles.panelHeader}>
          <button type="button" className={styles.backBtn} onClick={() => setDrill(null)}>
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </button>
          <span className={styles.panelTitle}>{drillCategory.name}</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Catalog</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search size={15} strokeWidth={2} className={styles.searchIcon} aria-hidden />
          <input
            className={styles.searchInput}
            placeholder="Search products or explore by image"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className={styles.cameraBtn} title="Search by image" aria-label="Search by image">
            <Camera size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {!drillCategory && (
        <label className={styles.exactMatch}>
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExact(e.target.checked)}
          />
          <span>Exact Match</span>
          <Info size={12} strokeWidth={2} className={styles.helpIcon} aria-hidden />
        </label>
      )}

      {!drillCategory && (
        <div className={styles.filterRow}>
          {CATALOG_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`${styles.filterChip} ${activeFilter === f ? styles.filterChipActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {!drillCategory && (
        <div className={styles.categoryCount}>
          {filteredCategories.length} Categories
        </div>
      )}

      <div className={styles.grid}>
        {drillCategory ? (
          drillCategory.items.length > 0 ? (
            drillCategory.items
              .filter((item) => {
                const q = query.toLowerCase();
                if (!q) return true;
                if (exactMatch) return item.name.toLowerCase() === q;
                return item.name.toLowerCase().includes(q);
              })
              .map((item) => (
                <div
                  key={item.id}
                  className={styles.tile}
                  onClick={() => onAddItem(item)}
                  onKeyDown={(e) => e.key === 'Enter' && onAddItem(item)}
                  role="button"
                  tabIndex={0}
                  draggable
                  onDragStart={(event) => onDragItemStart?.(event, item)}
                  title={`Add ${item.name} to scene`}
                >
                  <div className={`${styles.tileImageBox} ${isLegacy(item.source) ? styles.tileImageBoxLegacy : ''}`}>
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className={styles.tileImage}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          `https://placehold.co/200x200/e8e4df/666666?text=${encodeURIComponent(item.name.slice(0, 8))}`;
                      }}
                    />
                  </div>
                  <div className={styles.tileLabel}>
                    <span className={styles.tileName}>{item.name}</span>
                    <span className={styles.tileSub}>
                      {item.widthCm}×{item.depthCm} cm
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <div className={styles.emptyState}>
              No items in this category yet.
            </div>
          )
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={styles.tile}
              onClick={() => setDrill(cat)}
              onKeyDown={(e) => e.key === 'Enter' && setDrill(cat)}
              role="button"
              tabIndex={0}
            >
              <div className={`${styles.tileImageBox} ${isLegacy(cat.id) ? styles.tileImageBoxLegacy : ''}`}>
                <img
                  src={cat.thumbnail}
                  alt={cat.name}
                  className={styles.tileImage}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      `https://placehold.co/200x200/e8e4df/666666?text=${encodeURIComponent(cat.name.slice(0, 8))}`;
                  }}
                />
              </div>
              <div className={styles.tileLabel}>
                <span className={styles.tileName}>{cat.name}</span>
                <span className={styles.tileSub}>{cat.itemCount} items</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
