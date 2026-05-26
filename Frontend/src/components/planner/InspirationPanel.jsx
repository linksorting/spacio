import React, { useState } from 'react';
import { Search, Heart, ChevronLeft, Plus, Check } from 'lucide-react';

// ── Room categories with icons ───────────────────────────────────────────────
const ROOM_CATEGORIES = [
  { id: 'living',   label: 'Living Room',   icon: '🛋️' },
  { id: 'bedroom',  label: 'Bedroom',       icon: '🛏️' },
  { id: 'kitchen',  label: 'Kitchen',       icon: '🍳' },
  { id: 'bathroom', label: 'Bathroom',      icon: '🛁' },
  { id: 'dining',   label: 'Dining Room',   icon: '🍽️' },
  { id: 'office',   label: 'Office',        icon: '💼' },
  { id: 'outdoor',  label: 'Outdoor',       icon: '🌿' },
  { id: 'kids',     label: 'Kids Room',     icon: '🧸' },
];

// ── Inspiration designs per category ─────────────────────────────────────────
const DESIGNS = {
  living: [
    { id: 'l1', name: 'Modern Minimalist Living', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop', tags: ['Modern', 'Minimalist', 'Neutral'] },
    { id: 'l2', name: 'Cozy Scandinavian',        img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop', tags: ['Scandinavian', 'Warm', 'Wood'] },
    { id: 'l3', name: 'Mid-Century Modern',       img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop', tags: ['Retro', 'Mid-Century', 'Bold'] },
    { id: 'l4', name: 'Industrial Loft',          img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop', tags: ['Industrial', 'Urban', 'Raw'] },
  ],
  bedroom: [
    { id: 'b1', name: 'Serene Master Suite',      img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop', tags: ['Serene', 'Master', 'Luxury'] },
    { id: 'b2', name: 'Boho Retreat',             img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop', tags: ['Bohemian', 'Textured', 'Warm'] },
    { id: 'b3', name: 'Contemporary Bedroom',     img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop', tags: ['Contemporary', 'Clean', 'Neutral'] },
  ],
  kitchen: [
    { id: 'k1', name: 'White Shaker Kitchen',     img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop', tags: ['Classic', 'White', 'Shaker'] },
    { id: 'k2', name: 'Modern Dark Kitchen',      img: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop', tags: ['Modern', 'Dark', 'Bold'] },
    { id: 'k3', name: 'Farmhouse Kitchen',        img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop', tags: ['Farmhouse', 'Rustic', 'Warm'] },
  ],
  bathroom: [
    { id: 'ba1', name: 'Spa-Like Bathroom',       img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop', tags: ['Spa', 'Serene', 'Marble'] },
    { id: 'ba2', name: 'Modern Powder Room',      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop', tags: ['Modern', 'Compact', 'Clean'] },
  ],
  dining: [
    { id: 'd1', name: 'Elegant Dining',           img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop', tags: ['Elegant', 'Classic', 'Formal'] },
    { id: 'd2', name: 'Casual Dining Nook',       img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop', tags: ['Casual', 'Cozy', 'Nook'] },
  ],
  office: [
    { id: 'o1', name: 'Executive Office',         img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', tags: ['Executive', 'Professional'] },
  ],
  outdoor: [
    { id: 'ou1', name: 'Tropical Patio',          img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=400&fit=crop', tags: ['Tropical', 'Green', 'Relaxing'] },
  ],
  kids: [
    { id: 'ki1', name: 'Playful Kids Room',       img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&h=400&fit=crop', tags: ['Fun', 'Colorful', 'Playful'] },
  ],
};

// ── Products in a design ─────────────────────────────────────────────────────
const DESIGN_PRODUCTS = [
  { id: 'dp1', name: 'Oslo Sofa 3-Seater',       img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop' },
  { id: 'dp2', name: 'Venice Coffee Table',       img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=300&h=300&fit=crop' },
  { id: 'dp3', name: 'Globe Pendant Light',       img: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=300&fit=crop' },
  { id: 'dp4', name: 'Terrarium Plant Set',       img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&h=300&fit=crop' },
  { id: 'dp5', name: 'Abstract Wall Art',         img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
  { id: 'dp6', name: 'Woven Area Rug',            img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=300&h=300&fit=crop' },
];

export default function InspirationPanel() {
  const [view, setView] = useState('categories'); // 'categories' | 'gallery' | 'detail'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [search, setSearch] = useState('');
  const [likedDesigns, setLikedDesigns] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({});

  const toggleLike = (id) => setLikedDesigns(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleProduct = (id) => setSelectedProducts(prev => ({ ...prev, [id]: !prev[id] }));

  const openCategory = (cat) => {
    setSelectedCategory(cat);
    setView('gallery');
  };

  const openDesign = (design) => {
    setSelectedDesign(design);
    setView('detail');
  };

  const goBack = () => {
    if (view === 'detail') setView('gallery');
    else if (view === 'gallery') { setView('categories'); setSelectedCategory(null); }
  };

  // Search across all designs
  const allDesigns = Object.values(DESIGNS).flat();
  const searchResults = search
    ? allDesigns.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    : [];

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>

      {/* Header */}
      <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-2">
          {view !== 'categories' && (
            <button onClick={goBack} className="text-white/50 hover:text-white transition-all">
              <ChevronLeft size={16} />
            </button>
          )}
          <span className="text-sm font-semibold text-white">
            {view === 'categories' ? 'Inspiration' : view === 'gallery' ? selectedCategory?.label : selectedDesign?.name}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-xs outline-none flex-1"
            placeholder="Search inspiration..."
            style={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </div>
      </div>

      {/* Search results */}
      {search ? (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-[10px] mb-2 px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{searchResults.length} results</div>
          <div className="grid grid-cols-1 gap-2">
            {searchResults.map(d => (
              <DesignCard key={d.id} design={d} liked={likedDesigns[d.id]} onLike={() => toggleLike(d.id)} onClick={() => { setSearch(''); openDesign(d); }} />
            ))}
          </div>
        </div>
      ) : view === 'categories' ? (
        /* ── Category chooser ── */
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {ROOM_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => openCategory(cat)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-all hover:bg-white/5 group"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : view === 'gallery' ? (
        /* ── Design gallery ── */
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-1 gap-2">
            {(DESIGNS[selectedCategory?.id] || []).map(d => (
              <DesignCard key={d.id} design={d} liked={likedDesigns[d.id]} onLike={() => toggleLike(d.id)} onClick={() => openDesign(d)} />
            ))}
          </div>
        </div>
      ) : view === 'detail' && selectedDesign ? (
        /* ── Design detail ── */
        <div className="flex-1 overflow-y-auto">
          {/* Large image */}
          <div className="relative" style={{ aspectRatio: '16/10' }}>
            <img src={selectedDesign.img} alt={selectedDesign.name} className="w-full h-full object-cover" />
            <button
              onClick={() => toggleLike(selectedDesign.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(0,0,0,0.5)', color: likedDesigns[selectedDesign.id] ? '#e87a5a' : 'white' }}
            >
              <Heart size={14} fill={likedDesigns[selectedDesign.id] ? '#e87a5a' : 'none'} />
            </button>
          </div>

          <div className="p-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedDesign.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Add to project button */}
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-white transition-all mb-4" style={{ background: '#e87a5a' }}>
              <Plus size={13} /> Add Inspiration To Project
            </button>

            {/* Products in this design */}
            <div className="text-xs font-semibold text-white mb-2">Products in this design</div>
            <div className="grid grid-cols-2 gap-2">
              {DESIGN_PRODUCTS.map(p => {
                const selected = selectedProducts[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className="relative rounded overflow-hidden group text-left"
                    style={{ background: '#2a2a2a' }}
                  >
                    <div className="relative" style={{ aspectRatio: '1/1' }}>
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      {/* Circle checkbox */}
                      <div
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: selected ? '#e87a5a' : 'rgba(0,0,0,0.4)',
                          border: selected ? '2px solid #e87a5a' : '2px solid rgba(255,255,255,0.4)',
                        }}
                      >
                        {selected && <Check size={10} color="white" strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="text-[10px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DesignCard({ design, liked, onLike, onClick }) {
  return (
    <div className="rounded-lg overflow-hidden cursor-pointer group" style={{ background: '#2a2a2a' }} onClick={onClick}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img src={design.img} alt={design.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <button
          onClick={e => { e.stopPropagation(); onLike(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(0,0,0,0.5)', color: liked ? '#e87a5a' : 'white' }}
        >
          <Heart size={12} fill={liked ? '#e87a5a' : 'none'} />
        </button>
      </div>
      <div className="px-2.5 py-2">
        <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{design.name}</div>
        <div className="flex gap-1 mt-1">
          {design.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}