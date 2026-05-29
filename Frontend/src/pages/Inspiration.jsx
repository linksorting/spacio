import { useState, useMemo } from 'react';
import { ArrowLeft, Check, Plus, Search, X, LayoutTemplate, Image } from 'lucide-react';
import AppLayout from '../components/app/AppLayout';
import { inspirationLibrary, ROOM_TYPES, ROOM_TYPE_META } from '@/data/inspirationLibrary';
import RoomFloorPlan from '@/components/inspiration/RoomFloorPlan';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STYLE_PILLS = {
  Contemporary:     '#0ea5e9',
  Japandi:          '#92400e',
  Maximalist:       '#7c3aed',
  Industrial:       '#374151',
  Coastal:          '#0369a1',
  Classic:          '#b45309',
  Luxe:             '#9d174d',
  Nordic:           '#4b5563',
  'Warm Contemporary': '#c2410c',
  'Open Plan':      '#059669',
  Mediterranean:    '#d97706',
  Bohemian:         '#7e22ce',
  Dramatic:         '#1e1b4b',
  'Spa Luxury':     '#0f766e',
  Minimalist:       '#334155',
  'Earthy Warm':    '#92400e',
  'Boutique Hotel': '#881337',
  Formal:           '#3730a3',
  Farmhouse:        '#78350f',
  Scandinavian:     '#1e3a5f',
  'Compact Modern': '#0f4c75',
  Luxury:           '#713f12',
  'Classic':        '#7c2d12',
};

const bannerGradient = `
  linear-gradient(135deg, #1a0a07 0%, #2d1410 40%, #3b1f0f 70%, #1a0a07 100%)
`.trim();

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function Inspiration() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [shortlistedProducts, setShortlistedProducts] = useState({});

  const filtered = useMemo(() => {
    return inspirationLibrary.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.roomType === activeCategory;
      if (!matchesCategory) return false;
      if (!search.trim()) return true;
      const haystack = [
        item.title, item.category, item.style, item.segment,
        item.description, item.wallPalette, ...(item.searchTerms || [])
      ].join(' ').toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map = { All: inspirationLibrary.length };
    ROOM_TYPES.slice(1).forEach((rt) => {
      map[rt] = inspirationLibrary.filter((i) => i.roomType === rt).length;
    });
    return map;
  }, []);

  const toggleShortlist = (productId) =>
    setShortlistedProducts((c) => ({ ...c, [productId]: !c[productId] }));

  if (selectedInspiration) {
    return (
      <AppLayout>
        <InspirationDetail
          inspiration={selectedInspiration}
          shortlistedProducts={shortlistedProducts}
          onBack={() => setSelectedInspiration(null)}
          onToggleShortlist={toggleShortlist}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-full" style={{ background: '#f7f4f1', fontFamily: '"DM Sans", sans-serif' }}>
        <HeroBanner search={search} onSearchChange={setSearch} />
        <CategoryTabs
          active={activeCategory}
          counts={counts}
          onChange={(cat) => { setActiveCategory(cat); setSearch(''); }}
        />
        <InspirationGrid results={filtered} onSelect={setSelectedInspiration} />
      </div>
    </AppLayout>
  );
}

// ─── HERO BANNER ─────────────────────────────────────────────────────────────

function HeroBanner({ search, onSearchChange }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: bannerGradient, minHeight: 220 }}
    >
      {/* decorative noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(239,194,182,0.12) 0%, transparent 70%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)
          `
        }}
      />

      <div className="relative px-6 pt-12 pb-10 flex flex-col items-center text-center">
        <div
          className="text-[11px] uppercase tracking-[0.22em] font-medium mb-3"
          style={{ color: 'rgba(239,194,182,0.7)' }}
        >
          Interior Inspiration Library
        </div>
        <h1
          className="text-[38px] md:text-[52px] leading-none font-light mb-4"
          style={{
            color: '#f5ede8',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 32px rgba(0,0,0,0.4)'
          }}
        >
          Find Your Perfect Room
        </h1>
        <p className="text-[15px] mb-8 max-w-lg" style={{ color: 'rgba(239,194,182,0.6)' }}>
          Professionally designed rooms across every style — ready to inspire your next project.
        </p>

        {/* search bar */}
        <div className="w-full max-w-xl flex overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(239,194,182,0.2)' }}>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by style, room, mood — e.g. japandi, dark kitchen, coastal..."
            className="flex-1 h-12 px-5 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#f5ede8' }}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="w-10 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(239,194,182,0.7)' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            className="w-14 h-12 flex items-center justify-center"
            style={{ background: '#efc2b6', color: '#2c1810' }}
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY TABS ────────────────────────────────────────────────────────────

function CategoryTabs({ active, counts, onChange }) {
  return (
    <div
      className="sticky top-0 z-10 px-4 overflow-x-auto"
      style={{ background: '#1a0a07', borderBottom: '1px solid rgba(239,194,182,0.12)' }}
    >
      <div className="flex items-center gap-1 h-12 min-w-max mx-auto" style={{ maxWidth: 1100 }}>
        {ROOM_TYPES.map((rt) => {
          const meta = ROOM_TYPE_META[rt];
          const isActive = active === rt;
          return (
            <button
              key={rt}
              type="button"
              onClick={() => onChange(rt)}
              className="flex items-center gap-1.5 px-4 h-8 text-[12px] font-medium whitespace-nowrap transition-all"
              style={{
                borderRadius: 6,
                background: isActive ? (meta?.bg || 'rgba(239,194,182,0.15)') : 'transparent',
                color: isActive ? (meta?.color || '#efc2b6') : 'rgba(239,194,182,0.5)',
                border: isActive ? `1px solid ${meta?.color || '#efc2b6'}` : '1px solid transparent',
              }}
            >
              {meta?.icon && <span style={{ fontSize: 13 }}>{meta.icon}</span>}
              {rt}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full ml-0.5"
                style={{
                  background: isActive ? (meta?.color || '#efc2b6') : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#fff' : 'rgba(239,194,182,0.5)',
                }}
              >
                {counts[rt] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── INSPIRATION GRID ────────────────────────────────────────────────────────

function InspirationGrid({ results, onSelect }) {
  if (results.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <div className="text-3xl mb-3">🔍</div>
        <div className="text-lg font-medium" style={{ color: '#3d2820' }}>No designs found</div>
        <div className="text-sm mt-1" style={{ color: '#9a7b71' }}>
          Try a broader search: kitchen, japandi, dark, coastal…
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 md:py-8" style={{ maxWidth: 1440, margin: '0 auto' }}>
      <div className="flex items-baseline justify-between mb-5">
        <div className="text-[13px]" style={{ color: '#9a7b71' }}>
          <span className="font-semibold" style={{ color: '#3d2820' }}>{results.length}</span> designs
        </div>
      </div>

      {/* Pinterest-style masonry grid — 2 cols md, 3 cols lg, 4 cols xl */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {results.map((item, i) => (
          <InspirationCard
            key={item.id}
            item={item}
            onSelect={onSelect}
            tall={i % 7 === 0 || i % 7 === 4}
          />
        ))}
      </div>
    </div>
  );
}

// ─── INSPIRATION CARD ────────────────────────────────────────────────────────

function InspirationCard({ item, onSelect, tall }) {
  const meta = ROOM_TYPE_META[item.roomType] || {};
  const styleColor = STYLE_PILLS[item.style] || '#7a4d42';

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group relative w-full overflow-hidden block mb-4 text-left"
      style={{
        borderRadius: 12,
        breakInside: 'avoid',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(44,18,10,0.08)',
        transition: 'box-shadow 0.22s, transform 0.22s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(44,18,10,0.2)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(44,18,10,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: tall ? '3/4' : '4/3' }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* dark gradient on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(20,8,4,0.82) 0%, rgba(20,8,4,0.2) 55%, transparent 100%)',
            opacity: 0,
          }}
          ref={(el) => {
            if (!el) return;
            const parent = el.closest('button');
            if (!parent) return;
            parent.addEventListener('mouseenter', () => { el.style.opacity = '1'; });
            parent.addEventListener('mouseleave', () => { el.style.opacity = '0'; });
          }}
        />

        {/* "Explore Room" pill on hover */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 text-[12px] font-semibold whitespace-nowrap transition-all duration-300"
          style={{
            background: '#efc2b6',
            color: '#2c1810',
            borderRadius: 999,
            opacity: 0,
            transform: 'translateX(-50%) translateY(8px)',
            pointerEvents: 'none',
          }}
          ref={(el) => {
            if (!el) return;
            const parent = el.closest('button');
            if (!parent) return;
            parent.addEventListener('mouseenter', () => {
              el.style.opacity = '1';
              el.style.transform = 'translateX(-50%) translateY(0)';
            });
            parent.addEventListener('mouseleave', () => {
              el.style.opacity = '0';
              el.style.transform = 'translateX(-50%) translateY(8px)';
            });
          }}
        >
          Explore Room →
        </div>

        {/* room type badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold"
          style={{
            background: 'rgba(20,8,4,0.65)',
            color: meta.color || '#efc2b6',
            backdropFilter: 'blur(6px)',
            borderRadius: 6,
            border: `1px solid ${meta.color || '#efc2b6'}30`,
          }}
        >
          {meta.icon} {item.roomType}
        </div>

        {/* product count */}
        <div
          className="absolute top-3 right-3 px-2 py-1 text-[10px] font-medium"
          style={{
            background: 'rgba(20,8,4,0.6)',
            color: 'rgba(239,194,182,0.85)',
            backdropFilter: 'blur(6px)',
            borderRadius: 6,
          }}
        >
          {item.productCount} products
        </div>
      </div>

      {/* card footer */}
      <div className="px-3.5 pt-3 pb-3.5">
        <div
          className="text-[13px] font-semibold leading-5 capitalize mb-1.5 line-clamp-2"
          style={{ color: '#2c1810' }}
        >
          {item.title}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* style pill */}
          <span
            className="text-[10px] font-medium px-2 py-0.5"
            style={{
              borderRadius: 4,
              background: `${styleColor}15`,
              color: styleColor,
              border: `1px solid ${styleColor}30`,
            }}
          >
            {item.style}
          </span>
          {/* wall palette hint */}
          <span
            className="text-[10px] leading-4 line-clamp-1 flex-1"
            style={{ color: '#b59d96' }}
          >
            {item.wallPalette?.split(',')[0]}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── INSPIRATION DETAIL ──────────────────────────────────────────────────────

function InspirationDetail({ inspiration, shortlistedProducts, onBack, onToggleShortlist }) {
  const [activeTab, setActiveTab] = useState('photo');
  const meta = ROOM_TYPE_META[inspiration.roomType] || {};
  const styleColor = STYLE_PILLS[inspiration.style] || '#7a4d42';
  const shortlistedCount = inspiration.products.filter((p) => shortlistedProducts[p?.id]).length;
  const uniqueProducts = inspiration.products.filter(
    (p, i, arr) => p && arr.findIndex((x) => x?.id === p?.id) === i
  );

  return (
    <div className="min-h-full" style={{ background: '#f7f4f1', fontFamily: '"DM Sans", sans-serif' }}>
      {/* top nav */}
      <div
        className="sticky top-0 z-20 flex items-center gap-4 px-6 h-14 border-b"
        style={{ background: '#fff', borderColor: '#ede5e0' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-slate-900"
          style={{ color: '#7a4d42' }}
        >
          <ArrowLeft size={15} /> Back to Inspirations
        </button>
        <div className="flex-1 h-px" style={{ background: '#ede5e0' }} />
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium"
          style={{
            borderRadius: 6,
            background: meta.bg || 'rgba(239,194,182,0.15)',
            color: meta.color || '#c17b6a',
            border: `1px solid ${meta.color || '#c17b6a'}30`,
          }}
        >
          {meta.icon} {inspiration.roomType}
        </div>
      </div>

      <div className="px-6 py-8 max-w-screen-xl mx-auto">
        {/* heading block */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 uppercase tracking-wide"
              style={{
                borderRadius: 4,
                background: `${styleColor}15`,
                color: styleColor,
                border: `1px solid ${styleColor}30`,
              }}
            >
              {inspiration.style}
            </span>
            <span className="text-[11px]" style={{ color: '#b59d96' }}>
              {inspiration.category} · {inspiration.segment}
            </span>
          </div>
          <h1
            className="text-[32px] md:text-[40px] leading-tight font-light capitalize mb-3"
            style={{ color: '#2c1810', letterSpacing: '-0.01em' }}
          >
            {inspiration.title}
          </h1>
          <p className="text-[14px] leading-7 max-w-2xl" style={{ color: '#6b4f46' }}>
            {inspiration.description}
          </p>
          {inspiration.wallPalette && (
            <div
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-[12px]"
              style={{ borderRadius: 6, background: 'rgba(239,194,182,0.25)', color: '#7a4d42' }}
            >
              🎨 <span className="font-medium">Palette:</span> {inspiration.wallPalette}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* left col — hero image / floor plan + product mix */}
          <div className="xl:col-span-2 space-y-4">
            {/* tab bar */}
            <div
              className="flex items-center gap-1 p-1"
              style={{ background: '#fff', borderRadius: 10, border: '1px solid #ede5e0', width: 'fit-content' }}
            >
              {[
                { id: 'photo',     icon: <Image size={13} />,         label: 'Photo' },
                { id: 'floorplan', icon: <LayoutTemplate size={13} />, label: 'Floor Plan' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 h-8 text-[12px] font-medium transition-all"
                  style={{
                    borderRadius: 8,
                    background: activeTab === tab.id ? '#2c1810' : 'transparent',
                    color: activeTab === tab.id ? '#efc2b6' : '#9a7b71',
                  }}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'photo' ? (
              <div
                className="overflow-hidden"
                style={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(44,18,10,0.14)' }}
              >
                <img
                  src={inspiration.image}
                  alt={inspiration.title}
                  className="w-full object-cover"
                  style={{ aspectRatio: '16/10', display: 'block' }}
                />
              </div>
            ) : (
              <RoomFloorPlan roomType={inspiration.roomType} />
            )}

            {/* product mix breakdown */}
            <div
              className="p-5"
              style={{ background: '#fff', borderRadius: 12, border: '1px solid #ede5e0' }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[14px] font-semibold" style={{ color: '#2c1810' }}>
                  Product Mix
                </span>
                <span className="text-[12px]" style={{ color: '#b59d96' }}>
                  {inspiration.productCount} products total
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {inspiration.productTypes.map((pt) => (
                  <div
                    key={pt.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium"
                    style={{
                      borderRadius: 8,
                      background: '#faf5f2',
                      color: '#5c3d34',
                      border: '1px solid #ede5e0',
                    }}
                  >
                    <span>{pt.label}</span>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: meta.color || '#c17b6a', color: '#fff' }}
                    >
                      {pt.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right col — product shortlist panel */}
          <aside className="xl:col-span-1">
            <div
              className="p-5 xl:sticky xl:top-20"
              style={{ background: '#fff', borderRadius: 12, border: '1px solid #ede5e0' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-semibold" style={{ color: '#2c1810' }}>
                  Products
                </span>
                <span className="text-[12px]" style={{ color: '#b59d96' }}>
                  ({uniqueProducts.length})
                </span>
              </div>

              {shortlistedCount > 0 && (
                <div
                  className="flex items-center justify-between px-3 py-2.5 mb-4 text-[12px] font-medium"
                  style={{
                    borderRadius: 8,
                    background: 'rgba(171,0,255,0.06)',
                    border: '1px solid rgba(171,0,255,0.25)',
                    color: '#7c00cc',
                  }}
                >
                  <span>✓ {shortlistedCount} shortlisted</span>
                  <span style={{ color: '#ab00ff' }}>View list →</span>
                </div>
              )}

              <div
                className="grid grid-cols-2 gap-2.5"
                style={{ maxHeight: 640, overflowY: 'auto', paddingRight: 2 }}
              >
                {uniqueProducts.map((product) => {
                  if (!product) return null;
                  const isShortlisted = Boolean(shortlistedProducts[product.id]);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => onToggleShortlist(product.id)}
                      className="text-left overflow-hidden transition-all"
                      style={{
                        borderRadius: 8,
                        border: isShortlisted ? '1.5px solid #ab00ff' : '1px solid #ede5e0',
                        background: '#fff',
                        boxShadow: isShortlisted ? '0 4px 16px rgba(171,0,255,0.12)' : 'none',
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: '1', background: '#f4efec' }}
                      >
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: isShortlisted ? '#ab00ff' : 'rgba(17,17,17,0.65)',
                            color: '#fff',
                          }}
                        >
                          {isShortlisted ? <Check size={10} /> : <Plus size={10} />}
                        </div>
                        <div
                          className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[8px] uppercase tracking-wide font-medium"
                          style={{
                            background: 'rgba(255,255,255,0.88)',
                            color: '#7a645d',
                            borderRadius: 3,
                          }}
                        >
                          {product.type}
                        </div>
                      </div>
                      <div className="px-2 pt-1.5 pb-2">
                        <div
                          className="text-[10px] leading-[14px] font-medium line-clamp-2"
                          style={{ color: '#3d2820' }}
                        >
                          {product.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* use design CTA */}
              <button
                type="button"
                className="w-full mt-4 h-11 text-[13px] font-semibold transition-colors"
                style={{
                  borderRadius: 8,
                  background: '#2c1810',
                  color: '#efc2b6',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#3d2820'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2c1810'; }}
              >
                Use This Design →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
