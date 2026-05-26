import React, { useState } from 'react';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Dining Room', 'Kitchen', 'Bathroom', 'Office Space', 'Building El...', 'Furniture', 'Staging', 'Lighting', 'Outdoor'];

export default function ShortlistPanel() {
  const [active, setActive] = useState('Lighting');
  const [currentProject, setCurrentProject] = useState(true);

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
      {/* Search */}
      <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input className="bg-transparent text-xs outline-none flex-1 text-white/70" placeholder="Search" />
        </div>
      </div>

      {/* Category chips - 3 cols */}
      <div className="px-3 pt-3 pb-2 grid grid-cols-3 gap-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-2 py-1.5 rounded text-[10px] font-medium transition-all truncate"
            style={{
              background: active === cat ? 'rgba(232,122,90,0.15)' : 'rgba(255,255,255,0.05)',
              color: active === cat ? '#e87a5a' : 'rgba(255,255,255,0.6)',
              border: active === cat ? '1px solid rgba(232,122,90,0.4)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Current Project toggle */}
      <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">Current Project</span>
          <button
            onClick={() => setCurrentProject(!currentProject)}
            className="relative w-9 h-5 rounded-full transition-all"
            style={{ background: currentProject ? '#e87a5a' : 'rgba(255,255,255,0.15)' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
              style={{ left: currentProject ? '18px' : '2px' }}
            />
          </button>
        </div>
        <button className="text-xs text-white/60 flex items-center gap-1">
          All Projects <span className="text-[10px]">▾</span>
        </button>
      </div>

      {/* Empty state */}
      <div className="px-3 py-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>0 Items</div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-12">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mb-4 opacity-30">
          <path d="M30 70 Q30 50 50 50 L70 50 Q90 50 90 70 L90 85 L30 85 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
          <path d="M85 40 Q85 25 100 25" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
          <circle cx="100" cy="22" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
          <path d="M40 30 L42 32 L44 30 L42 28 Z" fill="#e87a5a" opacity="0.6"/>
          <path d="M75 40 L77 42 L79 40 L77 38 Z" fill="#e87a5a" opacity="0.6"/>
          <path d="M55 75 L57 77 L59 75 L57 73 Z" fill="#e87a5a" opacity="0.6"/>
        </svg>
        <div className="text-sm font-semibold text-white">No Products Shortlisted Yet!</div>
      </div>
    </div>
  );
}