import React, { useMemo, useState } from 'react';
import {
  Archive, Armchair, Bed, Box, Camera, ChevronLeft, DoorOpen,
  GalleryHorizontalEnd, Heart, ImageOff, LampFloor, PanelTop,
  Search, Settings2, SlidersHorizontal, Sofa, Sparkles, Table2
} from 'lucide-react';
import { catalogProducts, getCategoryLabel, productCategories } from '@/data/productCatalog';
import { useDrag } from './DragContext';

const FAVORITES_KEY = 'designer_pro_catalog_favorites';

const categoryIcons = {
  sofa: Sofa,
  armchair: Armchair,
  table: Table2,
  bed: Bed,
  lighting: LampFloor,
  storage: Archive,
  door: DoorOpen,
  window: PanelTop,
  decor: Sparkles,
};

const readFavorites = () => {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '{}');
  } catch (error) {
    return {};
  }
};

const persistFavorites = (favorites) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const matchesProduct = (product, query, exactMatch) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchable = [
    product.name,
    product.category,
    getCategoryLabel(product.category),
    product.subcategory,
    product.brand,
    ...(product.materials || []),
    ...(product.colors || []),
  ].filter(Boolean).map(value => String(value).toLowerCase());

  return exactMatch
    ? searchable.some(value => value === normalizedQuery)
    : searchable.some(value => value.includes(normalizedQuery));
};

function ProductImage({ product }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: 118,
        background: '#ffffff',
        borderBottom: '1px solid #f0eeec',
      }}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(90deg, #eeeeec, #fafaf9, #eeeeec)' }} />
      )}
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
          <ImageOff size={22} />
        </div>
      ) : (
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}

function ProductCard({ product, selected, favorite, onSelect, onToggleFavorite }) {
  const { setDraggingProduct } = useDrag();
  const categoryLabel = getCategoryLabel(product.category);

  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      onMouseDown={(event) => {
        event.preventDefault();
        setDraggingProduct(product);
      }}
      className="group cursor-grab overflow-hidden text-left transition-all active:cursor-grabbing"
      style={{
        borderRadius: 8,
        background: selected ? 'rgba(232,122,90,0.14)' : '#242221',
        border: selected ? '1px solid rgba(232,122,90,0.65)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? '0 0 0 1px rgba(232,122,90,0.18), 0 14px 36px rgba(0,0,0,0.28)' : '0 10px 24px rgba(0,0,0,0.16)',
      }}
    >
      <ProductImage product={product} />
      <div className="min-h-[86px] px-2.5 py-2">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="line-clamp-2 text-[12px] font-semibold leading-snug" style={{ color: '#f4ded8' }}>
              {product.name}
            </div>
            <div className="mt-1 truncate text-[10px]" style={{ color: 'rgba(255,255,255,0.42)' }}>
              {categoryLabel}
            </div>
          </div>
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(product.id);
            }}
            onMouseDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                onToggleFavorite(product.id);
              }
            }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors"
            style={{
              color: favorite ? '#f29d82' : 'rgba(255,255,255,0.58)',
              background: favorite ? 'rgba(232,122,90,0.14)' : 'rgba(255,255,255,0.05)',
            }}
            aria-label={favorite ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            <Heart size={15} fill={favorite ? '#f29d82' : 'none'} />
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
          <Box size={11} />
          <span>{product.dimensions.width} x {product.dimensions.depth} x {product.dimensions.height} in</span>
        </div>
      </div>
    </button>
  );
}

export default function ProductCatalogPanel({ fullscreen = false, onToggleFullscreen }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [exactMatch, setExactMatch] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => readFavorites());
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter(product => {
      if (activeCategory && product.category !== activeCategory) return false;
      if (favoritesOnly && !favorites[product.id]) return false;
      return matchesProduct(product, query, exactMatch);
    });
  }, [activeCategory, exactMatch, favorites, favoritesOnly, query]);

  const visibleSubcategories = useMemo(() => {
    return [...new Set(filteredProducts.map(product => product.subcategory))].slice(0, 6);
  }, [filteredProducts]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const next = { ...prev, [productId]: !prev[productId] };
      persistFavorites(next);
      return next;
    });
  };

  const activeCategoryLabel = activeCategory ? getCategoryLabel(activeCategory) : 'Product Catalog';

  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: '#1d1b1a',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="px-4 pb-3 pt-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-shadow"
          style={{
            background: '#f7f2ed',
            border: searchFocused ? '1px solid rgba(232,122,90,0.75)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: searchFocused ? '0 0 0 3px rgba(232,122,90,0.16), 0 0 24px rgba(232,122,90,0.34)' : 'none',
          }}
        >
          <Search size={15} style={{ color: '#292524' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
            placeholder="Search products"
            style={{ color: '#292524' }}
          />
          <button
            type="button"
            title={fullscreen ? 'Exit expanded catalog' : 'Expand catalog'}
            onClick={onToggleFullscreen}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-black/10"
            style={{ color: '#292524' }}
          >
            <Camera size={14} />
          </button>
          <button
            type="button"
            title="Catalog filters"
            onClick={() => setFavoritesOnly(value => !value)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-black/10"
            style={{ color: favoritesOnly ? '#b5533e' : '#292524' }}
          >
            <SlidersHorizontal size={14} />
          </button>
          <button
            type="button"
            title="Display settings"
            onClick={() => setExactMatch(value => !value)}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-black/10"
            style={{ color: exactMatch ? '#b5533e' : '#292524' }}
          >
            <Settings2 size={14} />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.46)' }}>
            <input
              type="checkbox"
              checked={exactMatch}
              onChange={(event) => setExactMatch(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-transparent"
            />
            Exact match
          </label>
          <button
            type="button"
            onClick={() => setFavoritesOnly(value => !value)}
            className="rounded-full px-2.5 py-1 text-[11px] transition-colors"
            style={{
              background: favoritesOnly ? 'rgba(232,122,90,0.16)' : 'rgba(255,255,255,0.05)',
              color: favoritesOnly ? '#f4b09c' : 'rgba(255,255,255,0.5)',
            }}
          >
            Favorites
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {activeCategory && (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: '#f1b4a3' }}
          >
            <ChevronLeft size={15} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold" style={{ color: '#f1c0b4' }}>
            {activeCategoryLabel}
          </div>
          <div className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {filteredProducts.length} products
          </div>
        </div>
        <GalleryHorizontalEnd size={16} style={{ color: 'rgba(255,255,255,0.35)' }} />
      </div>

      {!activeCategory && !query && (
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="grid grid-cols-3 gap-2">
            {productCategories.map(category => {
              const Icon = categoryIcons[category.icon] || Box;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="group flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-lg px-2 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f1c0b4',
                  }}
                >
                  <Icon size={20} strokeWidth={1.4} />
                  <span className="text-center text-[10px] font-semibold leading-tight">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!!visibleSubcategories.length && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {visibleSubcategories.map(subcategory => (
            <span
              key={subcategory}
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px]"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              {subcategory}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredProducts.length ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedProductId === product.id}
                favorite={!!favorites[product.id]}
                onSelect={setSelectedProductId}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center" style={{ color: 'rgba(255,255,255,0.36)' }}>
            <ImageOff size={24} />
            <div className="text-xs">No products match</div>
          </div>
        )}
      </div>
    </div>
  );
}
