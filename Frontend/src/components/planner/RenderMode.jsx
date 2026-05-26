import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Sun, Camera, Eye, Settings, X } from 'lucide-react';
import ThreeDRoomView from './ThreeDRoomView';
import RenderSettingsDialog from './RenderSettingsDialog';

// Slider popover shown below a toolbar button
function SliderPopover({ label, value, onChange, min, max, step, unit, anchorRef }) {
  return (
    <div
      className="absolute z-50 flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        top: 48,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: 220,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Triangle */}
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '7px solid #1a1a1a',
      }} />
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-orange-400"
        style={{ accentColor: '#e87a5a' }}
      />
      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#e87a5a', minWidth: 54, textAlign: 'right' }}>
        {value}{unit}
      </span>
    </div>
  );
}

// Aspect ratio popover
function AspectPopover({ value, onChange }) {
  const ratios = ['9:16', '16:9', '4:3', '2:1', '1:1', 'Custom'];
  return (
    <div
      className="absolute z-50 flex items-center gap-1 px-2 py-2 rounded-xl"
      style={{
        top: 48,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{
        position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '7px solid #1a1a1a',
      }} />
      {ratios.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className="px-3 py-1.5 rounded text-xs font-bold transition-all"
          style={{
            background: value === r ? '#e87a5a' : 'rgba(255,255,255,0.07)',
            color: value === r ? '#fff' : 'rgba(255,255,255,0.7)',
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// Save View dropdown
function SaveViewDropdown({ onClose }) {
  return (
    <div
      className="absolute z-50 rounded-lg overflow-hidden"
      style={{
        top: 44,
        right: 0,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: 160,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {['Save View', 'Save as New View'].map(opt => (
        <button
          key={opt}
          onClick={onClose}
          className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-all"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Hide panel sidebar
function HidePanel({ onClose }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 z-40 flex flex-col" style={{ width: 300, background: '#161116', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-sm font-semibold" style={{ color: '#e87a5a' }}>Hidden Objects (0)</span>
        <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <X size={14} />
        </button>
      </div>
      <div className="flex items-center justify-end px-4 py-2">
        <button className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Unhide all</button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>No hidden objects</span>
      </div>
      {/* Floating tooltip hint */}
      <div className="absolute top-1/3 right-0 translate-x-full ml-2 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap" style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
        Click on the product to hide
      </div>
    </div>
  );
}

export default function RenderMode({ rooms, walls, items, wallColor, floorTexture, onBack }) {
  const [showSettings, setShowSettings] = useState(false);
  const [activeControl, setActiveControl] = useState(null); // 'cameraHeight'|'fov'|'clipView'|'aspectRatio'|'saveView'
  const [showHide, setShowHide] = useState(false);

  const [cameraHeight, setCameraHeight] = useState(20.7);
  const [fov, setFov] = useState(70);
  const [clipView, setClipView] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('Custom');

  const toggle = (name) => setActiveControl(prev => prev === name ? null : name);

  // Close popovers on outside click
  const toolbarRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setActiveControl(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRender = (resolution) => {
    setShowSettings(false);
    alert(`Render started at ${resolution.toUpperCase()} resolution!`);
  };

  const centerControls = [
    {
      id: 'cameraHeight',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="9" height="7" rx="1"/>
          <path d="M11 8l3-2v4l-3-2z"/>
          <line x1="8" y1="2" x2="8" y2="5"/>
          <polyline points="6,3 8,1 10,3"/>
        </svg>
      ),
      label: 'Camera Height',
      popover: <SliderPopover label="Camera Height" value={cameraHeight} onChange={setCameraHeight} min={0} max={100} step={0.1} unit=" ft" />,
    },
    {
      id: 'fov',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2"/>
          <path d="M3.5 3.5l1.5 1.5M11 11l1.5 1.5M11 5l1.5-1.5M3.5 12.5l1.5-1.5"/>
        </svg>
      ),
      label: 'Field of view',
      popover: <SliderPopover label="Field of view" value={fov} onChange={setFov} min={20} max={120} step={1} unit="" />,
    },
    {
      id: 'clipView',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="12" height="12" rx="1"/>
          <path d="M2 6h12M6 2v12"/>
        </svg>
      ),
      label: 'Clip View',
      popover: <SliderPopover label="Clip View" value={clipView} onChange={setClipView} min={0} max={100} step={1} unit="" />,
    },
    {
      id: 'aspectRatio',
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="12" height="8" rx="1"/>
          <path d="M5 4v8M11 4v8"/>
        </svg>
      ),
      label: 'Aspect Ratio',
      popover: <AspectPopover value={aspectRatio} onChange={(v) => { setAspectRatio(v); setActiveControl(null); }} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#1a1a1a' }}>

      {/* Top toolbar */}
      <div
        ref={toolbarRef}
        className="flex items-center h-11 px-3 gap-1 flex-shrink-0 relative"
        style={{ background: '#0e0e0e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium hover:bg-white/5 transition-all" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <ChevronLeft size={14} /> Back
        </button>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 6px' }} />

        {/* Hide */}
        <button
          onClick={() => { setShowHide(h => !h); setActiveControl(null); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium hover:bg-white/5 transition-all"
          style={{ color: showHide ? '#e87a5a' : 'rgba(255,255,255,0.5)', background: showHide ? 'rgba(232,122,90,0.1)' : 'transparent' }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/>
            <circle cx="8" cy="8" r="2.5"/>
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Hide
        </button>

        {/* Lighting */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium hover:bg-white/5 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Sun size={13} /> Lighting
        </button>

        {/* Project name center */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs font-semibold text-white">Design</span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Last saved 2 minutes ago</span>
        </div>

        {/* Center camera controls */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1" style={{ top: 0, height: '100%' }}>
          {centerControls.map(ctrl => (
            <div key={ctrl.id} className="relative flex items-center">
              <button
                onClick={() => toggle(ctrl.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  background: activeControl === ctrl.id ? '#2a2a2a' : 'transparent',
                  color: activeControl === ctrl.id ? '#e87a5a' : 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {ctrl.icon} {ctrl.label}
              </button>
              {activeControl === ctrl.id && ctrl.popover}
            </div>
          ))}
        </div>

        {/* Right: Save View + Views */}
        <div className="relative flex items-center gap-1">
          <button
            onClick={() => toggle('saveView')}
            className="px-4 py-1.5 rounded text-xs font-bold transition-all"
            style={{ background: activeControl === 'saveView' ? '#e8c4a8' : '#e8c4a8', color: '#5a3020', border: 'none' }}
          >
            Save View
          </button>
          {activeControl === 'saveView' && <SaveViewDropdown onClose={() => setActiveControl(null)} />}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium hover:bg-white/5 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="6" height="6" rx="1"/>
              <rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/>
              <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
            Views
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Hide panel */}
        {showHide && <HidePanel onClose={() => setShowHide(false)} />}

        {/* New View badge */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded text-xs font-semibold" style={{ background: '#e87a5a', color: '#fff' }}>
          New View
        </div>

        <ThreeDRoomView rooms={rooms} walls={walls} items={items} wallColor={wallColor} floorTexture={floorTexture} />

        {/* Bottom left: Gallery */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#e8c4a8', border: '2px solid rgba(255,255,255,0.2)' }}>
              <Eye size={16} style={{ color: '#5a3a2a' }} />
            </div>
            <span className="text-[9px] font-medium" style={{ color: '#e87a5a' }}>Gallery</span>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Settings size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>

        {/* Center bottom: Preview + Take Render */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all" style={{ background: 'rgba(30,20,25,0.9)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Eye size={14} /> Preview Render
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all"
            style={{ background: 'rgba(30,20,25,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Camera size={14} /> Take Render
          </button>
        </div>
      </div>

      {/* Render Settings Dialog */}
      {showSettings && (
        <RenderSettingsDialog onClose={() => setShowSettings(false)} onRender={handleRender} />
      )}
    </div>
  );
}