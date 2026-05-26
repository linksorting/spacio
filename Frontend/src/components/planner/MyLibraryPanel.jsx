import React, { useState } from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'ai',     label: 'AI Models', sparkle: true },
  { id: 'custom', label: 'Custom Models' },
  { id: 'saved',  label: 'Saved Models' },
  { id: 'uploads',label: 'Uploads' },
  { id: 'all',    label: 'All' },
];

export default function MyLibraryPanel() {
  const [tab, setTab] = useState('ai');

  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
      {/* Search */}
      <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input className="bg-transparent text-xs outline-none flex-1 text-white/70" placeholder="Search" />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all"
            style={{
              background: tab === t.id ? 'rgba(232,122,90,0.15)' : 'rgba(255,255,255,0.05)',
              color: tab === t.id ? '#e87a5a' : 'rgba(255,255,255,0.6)',
              border: tab === t.id ? '1px solid rgba(232,122,90,0.4)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {t.sparkle && <Sparkles size={10} />}
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload button */}
      <div className="px-3 py-3">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(90deg, #ff8a4c, #e87a5a)' }}>
          <Plus size={14} /> Upload Image
        </button>
      </div>

      {/* AI Models tab content */}
      {tab === 'ai' && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold" style={{ color: '#e87a5a' }}>AI Models</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Credits used: 0 / 5</div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Promo pill */}
            <div className="px-3 py-2 flex justify-center">
              <div className="px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: '#000', color: '#e87a5a', border: '1px solid rgba(232,122,90,0.3)' }}>
                Launch offer : 10 FREE Model credits 🎉
              </div>
            </div>

            {/* Chair illustration with grid */}
            <div className="relative h-32 flex items-center justify-center overflow-hidden" style={{
              backgroundImage: 'linear-gradient(rgba(232,122,90,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,122,90,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}>
              <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                <path d="M15 35 Q15 18 30 18 L50 18 Q65 18 65 35 L65 65 L15 65 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <path d="M15 65 L15 80 M65 65 L65 80" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                <path d="M22 35 L22 60 M58 35 L58 60" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              </svg>
            </div>

            {/* Body */}
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm font-bold" style={{ color: '#e87a5a' }}>AI Models</span>
                <Sparkles size={12} style={{ color: '#e87a5a' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Upload an image — AI converts it to<br/>a 3D model in minutes.
              </p>
            </div>
          </div>

          <p className="text-[10px] italic mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Note: Only full model textures can be edited, not individual parts.
          </p>
        </div>
      )}

      {/* Other tabs - empty state */}
      {tab !== 'ai' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}>
            <Plus size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
          </div>
          <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>No {TABS.find(t => t.id === tab)?.label} yet</div>
          <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Upload an image to get started</div>
        </div>
      )}
    </div>
  );
}