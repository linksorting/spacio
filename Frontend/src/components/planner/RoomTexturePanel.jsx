import React, { useState } from 'react';
import { Plus, Check, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const FLOOR_TEXTURES = [
  { id: 'oak',       label: 'Oak Wood',        color: '#c89b60', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop' },
  { id: 'walnut',    label: 'Walnut',           color: '#6a4e30', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=120&fit=crop' },
  { id: 'maple',     label: 'Maple',            color: '#d4b896', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=120&h=120&fit=crop' },
  { id: 'marble',    label: 'Marble',           color: '#e8e0d8', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=120&h=120&fit=crop' },
  { id: 'concrete',  label: 'Concrete',         color: '#b0a8a0', img: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=120&h=120&fit=crop' },
  { id: 'herring',   label: 'Herringbone',      color: '#a0845a', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=120&h=120&fit=crop' },
  { id: 'tile_wht',  label: 'White Tile',       color: '#f0ece8', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=120&h=120&fit=crop' },
  { id: 'tile_grey', label: 'Grey Tile',        color: '#9a9590', img: 'https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=120&h=120&fit=crop' },
];

const WALL_COLORS = [
  { id: 'white',     label: 'White',      hex: '#ffffff' },
  { id: 'off_white', label: 'Off White',   hex: '#f5f0e8' },
  { id: 'cream',     label: 'Cream',       hex: '#f5e6c8' },
  { id: 'beige',     label: 'Beige',       hex: '#e8dcc8' },
  { id: 'light_grey',label: 'Light Grey',  hex: '#d8d4ce' },
  { id: 'grey',      label: 'Grey',        hex: '#a8a4a0' },
  { id: 'sage',      label: 'Sage',        hex: '#b0b8a0' },
  { id: 'blue',      label: 'Soft Blue',   hex: '#c0ccd8' },
  { id: 'blush',     label: 'Blush',       hex: '#e8c8c0' },
  { id: 'navy',      label: 'Navy',        hex: '#2a3040' },
  { id: 'charcoal',  label: 'Charcoal',    hex: '#4a4a4a' },
  { id: 'black',     label: 'Black',       hex: '#1a1a1a' },
];

export default function RoomTexturePanel({ wallColor, setWallColor, floorTexture, setFloorTexture, tileSize, setTileSize, hOffset, setHOffset, vOffset, setVOffset, rotation, setRotation }) {
  const [showTexSize, setShowTexSize] = useState(true);

  const activeFloor = FLOOR_TEXTURES.find(t => t.id === floorTexture) || FLOOR_TEXTURES[0];

  return (
    <div className="absolute top-0 right-0 bottom-0 z-20 flex flex-col" style={{ width: 240, background: '#1a1a1a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Floor texture preview */}
      <div className="flex-shrink-0" style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
        <img src={activeFloor.img} alt={activeFloor.label} className="w-full h-full object-cover" />
        <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 1.5L12.5 4 4.5 12H2V9.5L10 1.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Room header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="text-sm font-semibold text-white">Room</span>
          <button className="text-xs font-semibold" style={{ color: '#e87a5a' }}>Replace</button>
        </div>

        {/* Select Color — Wall Colors */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-semibold text-white mb-2.5">Select Color</div>
          <div className="flex flex-wrap gap-1.5">
            {WALL_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setWallColor(c.hex)}
                title={c.label}
                className="w-7 h-7 rounded-sm flex items-center justify-center transition-all"
                style={{
                  background: c.hex,
                  border: wallColor === c.hex ? '2px solid #e87a5a' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: wallColor === c.hex ? '0 0 0 1px #e87a5a' : 'none',
                }}
              >
                {wallColor === c.hex && <Check size={12} style={{ color: c.hex === '#1a1a1a' || c.hex === '#2a3040' || c.hex === '#4a4a4a' ? '#fff' : '#333' }} />}
              </button>
            ))}
            <button className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
              <Plus size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          </div>
        </div>

        {/* Floor Texture */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-semibold text-white mb-2.5">Floor Texture</div>
          <div className="grid grid-cols-4 gap-1.5">
            {FLOOR_TEXTURES.map(t => (
              <button
                key={t.id}
                onClick={() => setFloorTexture(t.id)}
                className="relative rounded overflow-hidden transition-all"
                style={{
                  aspectRatio: '1/1',
                  border: floorTexture === t.id ? '2px solid #e87a5a' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <img src={t.img} alt={t.label} className="w-full h-full object-cover" />
                {floorTexture === t.id && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(232,122,90,0.25)' }}>
                    <Check size={14} style={{ color: '#fff' }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Texture Size checkbox */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white">Texture Size</span>
            <Checkbox checked={showTexSize} onCheckedChange={setShowTexSize} className="border-[#e87a5a] data-[state=checked]:bg-[#e87a5a]" />
          </div>
        </div>

        {/* Tile Size */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">Tile Size</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60">X <span className="text-white font-medium">{tileSize.x}'</span></span>
              <span className="text-xs text-white/60">Y <span className="text-white font-medium">{tileSize.y}'</span></span>
            </div>
          </div>
        </div>

        {/* Horizontal Offset */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white">Horizontal Offset</span>
            <span className="text-xs font-semibold text-white">{hOffset}</span>
          </div>
          <Slider value={[hOffset]} min={-100} max={100} step={1} onValueChange={([v]) => setHOffset(v)} className="w-full" />
        </div>

        {/* Vertical Offset */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white">Vertical Offset</span>
            <span className="text-xs font-semibold text-white">{vOffset}</span>
          </div>
          <Slider value={[vOffset]} min={-100} max={100} step={1} onValueChange={([v]) => setVOffset(v)} className="w-full" />
        </div>

        {/* Rotate */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white">Rotate</span>
            <span className="text-xs font-semibold text-white">{rotation}</span>
          </div>
          <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={([v]) => setRotation(v)} className="w-full" />
        </div>

        {/* Reset */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold transition-all hover:bg-white/5" style={{ color: '#e87a5a', border: '1px solid rgba(232,122,90,0.3)' }}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}