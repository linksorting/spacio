import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, RotateCcw, Maximize2, Camera, Palette, Sliders } from 'lucide-react';

const presets = [
  { id: 'day', label: 'Daylight', icon: '☀️' },
  { id: 'evening', label: 'Evening', icon: '🌅' },
  { id: 'studio', label: 'Studio', icon: '💡' },
  { id: 'night', label: 'Nighttime', icon: '🌙' },
];

const materials = [
  { label: 'Marble White', color: '#f0ede8', border: '#d4cfc9' },
  { label: 'Slate Gray', color: '#6b7280', border: '#4b5563' },
  { label: 'Brass Gold', color: '#b45309', border: '#92400e' },
  { label: 'Matte Black', color: '#1f2937', border: '#111827' },
  { label: 'Chrome', color: '#9ca3af', border: '#6b7280' },
  { label: 'Sandstone', color: '#d4a96a', border: '#b08a50' },
];

const renderViews = [
  { label: 'Perspective', active: true },
  { label: 'Front', active: false },
  { label: 'Side', active: false },
  { label: 'Top', active: false },
];

export default function ThreeDViewer() {
  const [lighting, setLighting] = useState('day');
  const [selectedMat, setSelectedMat] = useState(0);
  const [activeView, setActiveView] = useState('Perspective');

  return (
    <div className="flex h-full bg-dp-black">
      {/* Main viewport */}
      <div className="flex-1 flex flex-col">
        {/* Viewport toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-dp-surface/60 border-b border-white/5 backdrop-blur-md">
          <div className="flex gap-1 glass rounded-lg p-1">
            {renderViews.map((v) => (
              <button
                key={v.label}
                onClick={() => setActiveView(v.label)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeView === v.label
                    ? 'bg-dp-blue/20 text-dp-blue'
                    : 'text-white/30 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <RotateCcw size={14} />
          </button>
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
          <button className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Camera size={12} />
            Render
          </button>
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#0a0a12] to-[#050508] flex items-center justify-center">
          {/* Ambient grid floor */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(400px) rotateX(60deg)',
              transformOrigin: 'bottom',
            }}
          />

          {/* Glow center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-dp-blue/3 rounded-full blur-3xl animate-pulse-glow" />

          {/* 3D Room mockup (CSS-based) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            style={{ perspective: '800px' }}
          >
            <div
              style={{
                width: 300,
                height: 220,
                position: 'relative',
                transform: 'rotateX(15deg) rotateY(-15deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Floor */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-sm"
                style={{
                  transform: 'translateZ(0px)',
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 30px)',
                }}
              />

              {/* Back wall */}
              <div
                className="absolute left-0 right-0 top-0 bg-gradient-to-b from-white/8 to-white/3 border border-white/10"
                style={{ height: 180, transform: 'translateY(-180px) rotateX(90deg)', transformOrigin: 'top' }}
              />

              {/* Left wall */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-white/6 to-white/2 border border-white/8"
                style={{ width: 180, transform: 'translateX(-180px) rotateY(-90deg)', transformOrigin: 'left' }}
              />

              {/* Fixtures suggestion boxes */}
              <div className="absolute top-8 left-8 w-16 h-14 border border-dp-blue/40 bg-dp-blue/10 rounded-sm flex items-center justify-center">
                <span className="text-[8px] text-dp-blue/60">SHOWER</span>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-18 border border-dp-violet/40 bg-dp-violet/10 rounded-full flex items-center justify-center" style={{ height: 60 }}>
                <span className="text-[8px] text-dp-violet/60">TUB</span>
              </div>
            </div>
          </motion.div>

          {/* Camera control hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 glass rounded-xl px-5 py-2.5">
            <span className="text-[10px] text-white/30">🖱 Drag to orbit · Scroll to zoom · Right-click to pan</span>
          </div>

          {/* Corner watermark */}
          <div className="absolute top-4 left-4 glass rounded-lg px-3 py-1.5">
            <div className="text-[10px] text-white/40 font-mono">3D PREVIEW · Willow Creek</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-56 bg-dp-surface border-l border-white/5 flex flex-col overflow-y-auto">
        {/* Lighting presets */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={13} className="text-dp-blue" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Lighting</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setLighting(p.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg text-center transition-all ${
                  lighting === p.id
                    ? 'bg-dp-blue/15 border border-dp-blue/25 text-dp-blue'
                    : 'glass-card text-white/40 hover:text-white'
                }`}
              >
                <span>{p.icon}</span>
                <span className="text-[9px] font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={13} className="text-dp-violet" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Materials</span>
          </div>
          <div className="space-y-1.5">
            {materials.map((m, i) => (
              <button
                key={m.label}
                onClick={() => setSelectedMat(i)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                  selectedMat === i ? 'bg-white/8 border border-white/12' : 'hover:bg-white/4'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border flex-shrink-0"
                  style={{ background: m.color, borderColor: m.border }}
                />
                <span className={`text-[10px] font-medium ${selectedMat === i ? 'text-white' : 'text-white/40'}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Render settings */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={13} className="text-dp-cyan" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Render</span>
          </div>
          {[
            { label: 'Quality', value: 'High' },
            { label: 'Resolution', value: '2K' },
            { label: 'Format', value: 'PNG' },
          ].map((s) => (
            <div key={s.label} className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-white/30">{s.label}</span>
              <span className="text-[10px] text-dp-blue font-medium">{s.value}</span>
            </div>
          ))}
          <button className="w-full btn-primary py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
            <Camera size={12} />
            Start Render
          </button>
        </div>
      </div>
    </div>
  );
}
