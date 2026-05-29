import { ChevronLeft, ChevronRight, Image, LayoutTemplate, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import RoomFloorPlan from '@/components/inspiration/RoomFloorPlan';
import { inspirationLibrary, ROOM_TYPES } from '@/data/inspirationLibrary';
import { CATALOG_CATEGORIES } from '@/lib/catalogData';
import { getThumbnail } from '@/lib/thumbnails';
import styles from './InspirationPanel.module.css';

const fallbackImage = (label) =>
  `https://placehold.co/720x440/282828/a3a3a3?text=${encodeURIComponent(label)}`;

const normalizeToken = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/^obj[-_]/, '')
    .replace(/^imported[-_]/, '')
    .replace(/[^a-z0-9]+/g, '');

const groupByRoomType = () => ROOM_TYPES
  .filter((roomType) => roomType !== 'All')
  .map((roomType) => ({
    id: normalizeToken(roomType),
    label: roomType,
    rooms: inspirationLibrary.filter((item) => item.roomType === roomType),
  }))
  .filter((category) => category.rooms.length);

/**
 * @param {{
 *   onClose: () => void,
 *   onLoadRoom?: (room: object) => void,
 *   onAddItem?: (item: import('@/lib/catalogData').FurnitureItem) => void,
 * }} props
 */
export default function InspirationPanel({ onClose, onLoadRoom, onAddItem }) {
  const [drillCategory, setDrill] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('photo');
  const [query, setQuery] = useState('');

  const catalogIndexes = useMemo(() => {
    const catalogItems = CATALOG_CATEGORIES.flatMap((category) => category.items);
    return {
      byThumbnail: new Map(catalogItems.map((item) => [item.thumbnail, item])),
      byId: new Map(catalogItems.map((item) => [normalizeToken(item.id), item])),
      byName: new Map(catalogItems.map((item) => [normalizeToken(item.name), item])),
    };
  }, []);

  const categories = useMemo(groupByRoomType, []);

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories
      .map((category) => ({
        ...category,
        rooms: category.rooms.filter((room) => (
          room.title.toLowerCase().includes(term)
          || room.style.toLowerCase().includes(term)
          || room.description.toLowerCase().includes(term)
          || room.searchTerms?.some((tag) => tag.toLowerCase().includes(term))
        )),
      }))
      .filter((category) => category.rooms.length);
  }, [categories, query]);

  const visibleRooms = drillCategory
    ? filteredCategories.find((category) => category.id === drillCategory.id)?.rooms ?? []
    : [];

  const selectedProducts = useMemo(() => {
    const quantities = new Map();
    (selectedRoom?.products ?? []).forEach((product) => {
      if (!product) return;
      const matched = catalogIndexes.byThumbnail.get(product.img)
        ?? catalogIndexes.byId.get(normalizeToken(product.id))
        ?? catalogIndexes.byName.get(normalizeToken(product.name));
      const current = quantities.get(product.id);
      quantities.set(product.id, current
        ? { ...current, quantity: current.quantity + 1 }
        : { product, catalogItem: matched, quantity: 1 });
    });
    return [...quantities.values()];
  }, [catalogIndexes, selectedRoom]);

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setActiveTab('photo');
  };

  const back = () => {
    if (selectedRoom) {
      setSelectedRoom(null);
      return;
    }
    setDrill(null);
  };

  const title = selectedRoom
    ? 'Shop The Look'
    : drillCategory
      ? drillCategory.label
      : 'Inspiration';

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        {drillCategory || selectedRoom ? (
          <button type="button" className={styles.backBtn} onClick={back} aria-label="Back">
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
        ) : null}
        <span className={styles.panelTitle}>{title}</span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {!selectedRoom ? (
        <div className={styles.searchWrap}>
          <label className={styles.searchBox}>
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search inspiration"
            />
          </label>
        </div>
      ) : null}

      {selectedRoom ? (
        <div className={styles.roomDetail}>
          <div className={styles.mediaTabs} role="tablist" aria-label="Inspiration media">
            <button
              type="button"
              className={`${styles.mediaTab} ${activeTab === 'photo' ? styles.mediaTabActive : ''}`}
              onClick={() => setActiveTab('photo')}
            >
              <Image size={13} /> Photo
            </button>
            <button
              type="button"
              className={`${styles.mediaTab} ${activeTab === 'floorplan' ? styles.mediaTabActive : ''}`}
              onClick={() => setActiveTab('floorplan')}
            >
              <LayoutTemplate size={13} /> Floor Plan
            </button>
          </div>

          {activeTab === 'photo' ? (
            <div className={styles.hero}>
              <img
                src={selectedRoom.image}
                alt={selectedRoom.title}
                className={styles.heroImage}
                onError={(event) => {
                  event.currentTarget.src = fallbackImage(selectedRoom.title);
                }}
              />
              <span className={styles.heroBadge}>{selectedRoom.style}</span>
            </div>
          ) : (
            <div className={styles.floorPlanShell}>
              <RoomFloorPlan roomType={selectedRoom.roomType} />
            </div>
          )}

          <div className={styles.detailBody}>
            <h2 className={styles.roomName}>{selectedRoom.title}</h2>
            <p className={styles.roomDescription}>{selectedRoom.description}</p>

            <div className={styles.roomMetaGrid}>
              <span>{selectedRoom.roomType}</span>
              <span>{selectedRoom.category}</span>
              <span>{selectedRoom.productCount} products</span>
            </div>

            <div className={styles.detailActions}>
              <button
                type="button"
                className={styles.primaryAction}
                onClick={() => onLoadRoom?.(selectedRoom)}
              >
                Add editable look to canvas
              </button>
            </div>

            <div className={styles.productsHeader}>
              <span>Products in this look</span>
              <span>{selectedProducts.length} styles</span>
            </div>

            <div className={styles.productList}>
              {selectedProducts.map(({ product, catalogItem, quantity }) => (
                <div className={styles.productCard} key={product.id}>
                  <img
                    className={styles.productImage}
                    src={catalogItem ? getThumbnail(catalogItem.modelUrl) || catalogItem.thumbnail : product.img}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage(product.name);
                    }}
                  />
                  <div className={styles.productMeta}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productCount}>
                      {quantity > 1 ? `${quantity} used` : product.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.addProduct}
                    disabled={!catalogItem}
                    onClick={() => catalogItem && onAddItem?.(catalogItem)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : drillCategory ? (
        <div className={styles.grid}>
          {visibleRooms.map((room) => (
            <div
              key={room.id}
              className={styles.tile}
              onClick={() => selectRoom(room)}
              onKeyDown={(event) => event.key === 'Enter' && selectRoom(room)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.tileImageBox}>
                <img
                  src={room.image}
                  alt={room.title}
                  className={styles.tileImage}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage(room.style);
                  }}
                />
                <span className={styles.tileBadge}>{room.style}</span>
              </div>
              <div className={styles.tileLabel}>{room.title}</div>
            </div>
          ))}

          {visibleRooms.length === 0 && (
            <div className={styles.emptyState}>No matching rooms in this category.</div>
          )}
        </div>
      ) : (
        <div className={styles.catList}>
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={styles.catRow}
              onClick={() => setDrill(cat)}
            >
              <span className={styles.catLabel}>{cat.label}</span>
              <span className={styles.catCount}>{cat.rooms.length}</span>
              <ChevronRight size={18} strokeWidth={2} className={styles.catArrow} aria-hidden />
            </button>
          ))}
          {filteredCategories.length === 0 && (
            <div className={styles.emptyState}>No inspiration matches that search.</div>
          )}
        </div>
      )}
    </div>
  );
}
