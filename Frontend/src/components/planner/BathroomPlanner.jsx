import React, { useState, useRef, useEffect } from 'react';
import ShortlistPanel from './ShortlistPanel';
import InspirationPanel from './InspirationPanel';
import MyLibraryPanel from './MyLibraryPanel';
import ServicesPanel from './ServicesPanel';
import PlannerCanvas from './PlannerCanvas';
import ProductCatalogPanel from './ProductCatalogPanel';
import RoomTexturePanel from './RoomTexturePanel';
import RenderMode from './RenderMode';
import { DragProvider, useDrag } from './DragContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Grid3X3, Undo2, Redo2,
  Square, Upload, Heart,
  Camera, FileText, ChevronDown,
  Utensils, Lightbulb, BookOpen, Star, Cpu, MousePointer, Ruler
} from 'lucide-react';

// ── Left sidebar nav ──────────────────────────────────────────────────────────
const LEFT_NAV = [
  { id: 'catalog',     icon: Grid3X3,      label: 'Catalog' },
  { id: 'kitchen',    icon: Utensils,     label: 'Kitchen' },
  { id: 'shortlist',  icon: Heart,        label: 'Shortlist' },
  { id: 'inspiration',icon: Lightbulb,    label: 'Inspiration' },
  { id: 'library',    icon: BookOpen,     label: 'My Library' },
  { id: 'services',   icon: Star,         label: 'Services' },
  { id: 'aihub',      icon: Cpu,          label: 'AI Hub' },
];

// Product catalog UI and data live in ProductCatalogPanel.jsx and src/data/productCatalog.js.

function AIHubPanel() {
  return (
    <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
      <div className="p-3 text-sm font-semibold text-white flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Cpu size={14} style={{ color: '#ab00ff' }} /> AI Hub
        <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: '#ab00ff' }}>NEW</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {['AI Room Design', 'Auto-generate Floor Plan', 'Smart Furniture Placement', 'Style Recommendations'].map(t => (
          <button key={t} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ border: '1px solid rgba(171,0,255,0.25)', color: '#c060ff', background: 'rgba(171,0,255,0.06)' }}>
            ✦ {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Planner ──────────────────────────────────────────────────────────────
const emptyPlan = { rooms: [], walls: [], items: [] };

const storageKeyForProject = (projectName, floor = 0) => {
  const base = `designer_pro_planner_state_${String(projectName || 'Design').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
  return floor === 0 ? base : `${base}_floor_${floor}`;
};

const readPlannerProject = (projectName, floor = 0) => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(storageKeyForProject(projectName, floor)) || 'null');
  } catch (error) {
    return null;
  }
};

const savePlannerProject = (projectName, data, floor = 0) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKeyForProject(projectName, floor), JSON.stringify(data));
};

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const downloadFile = (filename, mimeType, content) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildPlanSvg = (plan, projectName) => {
  const rooms = plan.rooms || [];
  const walls = plan.walls || [];
  const items = plan.items || [];
  const maxX = Math.max(1200, ...rooms.map(r => r.x + r.w + 80), ...items.map(i => i.x + i.w + 80), ...walls.map(w => Math.max(w.x1, w.x2) + 80));
  const maxY = Math.max(800, ...rooms.map(r => r.y + r.h + 80), ...items.map(i => i.y + i.h + 80), ...walls.map(w => Math.max(w.y1, w.y2) + 80));
  const grid = Array.from({ length: Math.ceil(maxX / 50) + 1 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${maxY}" stroke="#ddd" stroke-width="1"/>`).join('')
    + Array.from({ length: Math.ceil(maxY / 50) + 1 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${maxX}" y2="${i * 50}" stroke="#ddd" stroke-width="1"/>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${maxX}" height="${maxY}" viewBox="0 0 ${maxX} ${maxY}">
  <rect width="100%" height="100%" fill="#f8f8f8"/>
  <g opacity="0.85">${grid}</g>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="20" fill="#182136">${escapeXml(projectName)}</text>
  ${rooms.map(room => `
  <g>
    <rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}" fill="#ffffff" fill-opacity="0.72" stroke="#262626" stroke-width="12"/>
    <text x="${room.x + room.w / 2}" y="${room.y + room.h / 2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#111">Room ${(room.w * room.h / 400).toFixed(1)} sq ft</text>
  </g>`).join('')}
  ${walls.map(wall => `<line x1="${wall.x1}" y1="${wall.y1}" x2="${wall.x2}" y2="${wall.y2}" stroke="#555" stroke-width="6" stroke-linecap="round"/>`).join('')}
  ${items.map(item => `
  <g transform="rotate(${item.rotation || 0} ${item.x + item.w / 2} ${item.y + item.h / 2})">
    <rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" rx="4" fill="#d8d4ce" stroke="#111" stroke-width="1"/>
    <text x="${item.x + item.w / 2}" y="${item.y + item.h / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="10" fill="#111">${escapeXml(item.name)}</text>
  </g>`).join('')}
</svg>`;
};

const formatSavedLabel = (savedAt) => {
  if (!savedAt) return 'Not saved yet';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(savedAt).getTime()) / 1000));
  if (seconds < 5) return 'Saved just now';
  if (seconds < 60) return `Saved ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Saved ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `Saved ${hours}h ago`;
};

export default function BathroomPlanner({ projectName = 'Design' }) {
  return (
    <DragProvider>
      <PlannerInner projectName={projectName} />
    </DragProvider>
  );
}

const FLOOR_LABELS = ['Ground', '1st Floor', '2nd Floor'];

function PlannerInner({ projectName }) {
  const navigate = useNavigate();
  const savedProjectRef = useRef(readPlannerProject(projectName, 0));
  const canvasRef = useRef(null);
  const uploadInputRef = useRef(null);
  const [activeNav, setActiveNav] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [view2D, setView2D] = useState(true);
  const [catalogFullscreen, setCatalogFullscreen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [showTexturePanel, setShowTexturePanel] = useState(false);
  const [wallColor, setWallColor] = useState('#d8d4ce');
  const [floorTexture, setFloorTexture] = useState('oak');
  const [tileSize, setTileSize] = useState({ x: 4, y: 4 });
  const [hOffset, setHOffset] = useState(0);
  const [vOffset, setVOffset] = useState(0);
  const [floorRotation, setFloorRotation] = useState(0);
  const [renderMode, setRenderMode] = useState(false);
  const [planSnapshot, setPlanSnapshot] = useState(savedProjectRef.current?.plan || emptyPlan);
  const [backgroundPlan, setBackgroundPlan] = useState(savedProjectRef.current?.backgroundPlan || null);
  const [savedAt, setSavedAt] = useState(savedProjectRef.current?.savedAt || null);
  // ── Multi-floor ──────────────────────────────────────────────────────────────
  const [currentFloor, setCurrentFloor] = useState(0);
  const [canvasKey, setCanvasKey] = useState('floor-0');
  const [floorInitialPlan, setFloorInitialPlan] = useState(savedProjectRef.current?.plan || emptyPlan);
  const [totalFloors, setTotalFloors] = useState(() => {
    const stored = Number(window.localStorage.getItem(`${storageKeyForProject(projectName, 0)}_totalFloors`) || '1');
    return Math.max(1, Math.min(3, stored));
  });

  const handleFloorSwitch = (newFloor) => {
    if (newFloor === currentFloor) return;
    // Save current floor's plan
    const plan = canvasRef.current?.getPlan?.() || planSnapshot;
    savePlannerProject(projectName, { plan, backgroundPlan, savedAt: new Date().toISOString() }, currentFloor);
    // Load new floor
    const saved = readPlannerProject(projectName, newFloor);
    const nextPlan = saved?.plan || emptyPlan;
    setFloorInitialPlan(nextPlan);
    setPlanSnapshot(nextPlan);
    setCurrentFloor(newFloor);
    setCanvasKey(`floor-${newFloor}`);
    setStatusMessage(`Switched to ${FLOOR_LABELS[newFloor]}`);
  };

  const handleAddFloor = () => {
    if (totalFloors >= 3) return;
    const next = totalFloors;
    const nextTotal = totalFloors + 1;
    setTotalFloors(nextTotal);
    window.localStorage.setItem(`${storageKeyForProject(projectName, 0)}_totalFloors`, String(nextTotal));
    handleFloorSwitch(next);
  };
  const [statusMessage, setStatusMessage] = useState('Ready to design');
  const { drawTool, setDrawTool, draggingProduct, setDraggingProduct } = useDrag();

  const panelMap = {
    catalog:     <ProductCatalogPanel fullscreen={false} onToggleFullscreen={() => setCatalogFullscreen(true)} />,
    kitchen:     <ProductCatalogPanel fullscreen={false} onToggleFullscreen={() => setCatalogFullscreen(true)} />,
    shortlist:   <ShortlistPanel />,
    inspiration: <InspirationPanel />,
    library:     <MyLibraryPanel />,
    services:    <ServicesPanel />,
    aihub:       <AIHubPanel />,
  };
  const activePanelWidth = activeNav === 'catalog' ? 392 : 280;

  useEffect(() => {
    const saveTimer = window.setTimeout(() => {
      const nextSavedAt = new Date().toISOString();
      savePlannerProject(projectName, { plan: planSnapshot, backgroundPlan, savedAt: nextSavedAt }, currentFloor);
      setSavedAt(nextSavedAt);
    }, 450);
    return () => window.clearTimeout(saveTimer);
  }, [projectName, planSnapshot, backgroundPlan, currentFloor]);

  useEffect(() => {
    if (!statusMessage || statusMessage === 'Ready to design') return undefined;
    const timer = window.setTimeout(() => setStatusMessage('Ready to design'), 4000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const handleNavClick = (navId) => {
    setActiveNav(current => current === navId ? null : navId);
  };

  const handleManualSave = () => {
    const nextSavedAt = new Date().toISOString();
    const plan = canvasRef.current?.getPlan?.() || planSnapshot;
    savePlannerProject(projectName, { plan, backgroundPlan, savedAt: nextSavedAt }, currentFloor);
    setPlanSnapshot(plan);
    setSavedAt(nextSavedAt);
    setStatusMessage('Project saved to this browser.');
    setFileMenuOpen(false);
  };

  const handleExport2D = () => {
    const plan = canvasRef.current?.getPlan?.() || planSnapshot;
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'designer-plan';
    downloadFile(`${safeName}-2d-plan.svg`, 'image/svg+xml;charset=utf-8', buildPlanSvg(plan, projectName));
    setStatusMessage('2D plan exported as an SVG.');
    setFileMenuOpen(false);
  };

  const handleExportJson = () => {
    const plan = canvasRef.current?.getPlan?.() || planSnapshot;
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'designer-plan';
    downloadFile(`${safeName}-planner-data.json`, 'application/json;charset=utf-8', JSON.stringify({ projectName, plan, backgroundPlan, savedAt: new Date().toISOString() }, null, 2));
    setStatusMessage('Planner data exported as JSON.');
    setFileMenuOpen(false);
  };

  const handleUploadFloorPlan = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundPlan({
        src: reader.result,
        name: file.name,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      });
      setStatusMessage(`${file.name} loaded as the background plan.`);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Far-left icon nav ── */}
      <div className="flex flex-col items-center py-1 flex-shrink-0" style={{ width: 56, background: '#0e0e0e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {LEFT_NAV.map(item => {
          const Icon = item.icon;
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={item.label}
              className="flex flex-col items-center justify-center gap-0.5 w-full py-2.5 transition-all relative"
              style={{
                color: active ? '#e87a5a' : 'rgba(255,255,255,0.4)',
                background: active ? 'rgba(232,122,90,0.1)' : 'transparent',
                borderLeft: active ? '2px solid #e87a5a' : '2px solid transparent',
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: 8, fontWeight: 500, lineHeight: 1.2 }}>{item.label}</span>
              {item.id === 'aihub' && (
                <span className="absolute top-1 right-1 px-1 rounded-full text-[6px] font-bold text-white" style={{ background: '#e87a5a', lineHeight: '10px' }}>New</span>
              )}
            </button>
          );
        })}
        <div className="flex-1" />
        {/* Services icon */}
        <button className="flex flex-col items-center justify-center gap-0.5 w-full py-2.5 transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="text-[10px] font-black leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>.studio</div>
          <span style={{ fontSize: 8 }}>Services</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-0.5 w-full py-2 transition-all" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <Lightbulb size={12} />
          </div>
          <span style={{ fontSize: 8 }}>Demo</span>
        </button>
        <button className="w-10 mx-auto mb-1 py-1.5 rounded text-center" style={{ background: 'rgba(232,122,90,0.15)', border: '1px solid rgba(232,122,90,0.3)', color: '#e87a5a', fontSize: 8, fontWeight: 700 }}>
          View<br/>Renders
        </button>
      </div>

      {/* ── Side panel (280px) ── */}
      <AnimatePresence initial={false}>
        {activeNav && (
          <motion.div
            key={activeNav}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: activePanelWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-shrink-0 overflow-hidden"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div style={{ width: activePanelWidth, height: '100%' }}>
              {panelMap[activeNav]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadChange}
        />

        {/* Top toolbar */}
        <div className="flex items-center h-11 px-3 gap-2 flex-shrink-0" style={{ background: '#0e0e0e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* File */}
          <div className="relative">
            <button
              onClick={() => setFileMenuOpen(open => !open)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 text-xs text-white/60 transition-all"
            >
              File <ChevronDown size={11} />
            </button>
            {fileMenuOpen && (
              <div
                className="absolute left-0 top-full z-40 mt-2 overflow-hidden"
                style={{
                  minWidth: 172,
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                }}
              >
                <button onClick={handleManualSave} className="block w-full px-3 py-2.5 text-left text-xs text-white/70 hover:bg-white/5">Save project</button>
                <button onClick={handleExport2D} className="block w-full px-3 py-2.5 text-left text-xs text-white/70 hover:bg-white/5">Export 2D SVG</button>
                <button onClick={handleExportJson} className="block w-full px-3 py-2.5 text-left text-xs text-white/70 hover:bg-white/5">Export data JSON</button>
              </div>
            )}
          </div>
          {/* Select + Ruler tools */}
          <button
            onClick={() => {
              setDrawTool(null);
              setStatusMessage('Select mode active.');
            }}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5 transition-all text-white/50"
            title="Select"
          >
            <MousePointer size={14} />
          </button>
          <button
            onClick={() => setStatusMessage('Draw a wall or room to see live measurements on the plan.')}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5 transition-all text-white/50"
            title="Ruler"
          >
            <Ruler size={14} />
          </button>
          <button onClick={() => canvasRef.current?.undo?.()} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5 transition-all text-white/50" title="Undo">
            <Undo2 size={14} />
          </button>
          <button onClick={() => canvasRef.current?.redo?.()} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5 transition-all text-white/50" title="Redo">
            <Redo2 size={14} />
          </button>

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', marginLeft: 4, marginRight: 4 }} />

          {/* Wall / Room / Upload */}
          {[
            { icon: Square,  label: 'Wall', tool: 'wall' },
            { icon: Grid3X3, label: 'Room', tool: 'room' },
            { icon: Upload,  label: 'Upload Floor Plan', tool: null },
          ].map(({ icon: Icon, label, tool }) => {
            const active = tool && drawTool === tool;
            return (
              <button
                key={label}
                onClick={() => {
                  if (tool) {
                    setDrawTool(drawTool === tool ? null : tool);
                    setStatusMessage(`${label} tool ${drawTool === tool ? 'closed' : 'active'}.`);
                    return;
                  }
                  handleUploadFloorPlan();
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-all"
                style={{
                  background: active ? 'rgba(232,122,90,0.15)' : 'transparent',
                  color: active ? '#e87a5a' : 'rgba(255,255,255,0.5)',
                  border: active ? '1px solid rgba(232,122,90,0.4)' : '1px solid transparent',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}

          {/* Center: project name */}
          <div className="flex-1 flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white">{projectName}</span>
            <span className="text-[10px] text-white/30">{formatSavedLabel(savedAt)}</span>
            <span className="text-[10px] text-white/35">{statusMessage}</span>
          </div>

          {/* ── Floor selector ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[10px] text-white/30 hidden sm:block">Floor</span>
            <div
              className="flex items-center overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.14)', borderRadius: 6 }}
            >
              {Array.from({ length: totalFloors }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFloorSwitch(idx)}
                  title={FLOOR_LABELS[idx]}
                  className="px-2.5 py-1 text-[11px] font-bold transition-all"
                  style={{
                    background: currentFloor === idx ? 'rgba(232,122,90,0.22)' : 'transparent',
                    color: currentFloor === idx ? '#e87a5a' : 'rgba(255,255,255,0.38)',
                    borderRight: idx < totalFloors - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    minWidth: 28,
                  }}
                >
                  {idx === 0 ? 'G' : idx}
                </button>
              ))}
              {totalFloors < 3 && (
                <button
                  onClick={handleAddFloor}
                  title="Add floor"
                  className="px-2 py-1 text-[11px] transition-all"
                  style={{
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.28)',
                  }}
                >
                  +
                </button>
              )}
            </div>
            <span
              className="text-[10px] hidden sm:block"
              style={{ color: '#e87a5a', minWidth: 52 }}
            >
              {FLOOR_LABELS[currentFloor]}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/pricing')} className="px-3 py-1 rounded text-xs font-bold text-white/80 hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
              Upgrade ♛
            </button>
            <div className="flex rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              <button onClick={() => setView2D(true)} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: view2D ? '#fff' : 'transparent', color: view2D ? '#111' : 'rgba(255,255,255,0.5)' }}>2D</button>
              <button onClick={() => setView2D(false)} className="px-3 py-1 text-xs font-bold transition-all" style={{ background: !view2D ? '#fff' : 'transparent', color: !view2D ? '#111' : 'rgba(255,255,255,0.5)' }}>3D</button>
            </div>
            <button onClick={() => setRenderMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-white" style={{ background: '#e87a5a' }}>
              <Camera size={12} /> Take Render
            </button>
            <button onClick={handleExport2D} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white/60 hover:text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <FileText size={12} /> Export 2D plans
            </button>
          </div>
        </div>

        {/* Canvas (drawing/placement/selection handled inside) */}
        <div className="flex-1 relative flex flex-col">
          <PlannerCanvas
            key={canvasKey}
            ref={canvasRef}
            view2D={view2D}
            zoom={zoom}
            setZoom={setZoom}
            drawTool={drawTool}
            setDrawTool={setDrawTool}
            draggingProduct={draggingProduct}
            setDraggingProduct={setDraggingProduct}
            wallColor={wallColor}
            floorTexture={floorTexture}
            initialPlan={floorInitialPlan}
            backgroundPlan={backgroundPlan}
            onPlanChange={setPlanSnapshot}
            onSwitchTo3D={() => setView2D(false)}
            onStatus={setStatusMessage}
          />
          {/* Edit Texture button (3D mode) */}
          {!view2D && (
            <button
              onClick={() => setShowTexturePanel(!showTexturePanel)}
              className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded text-xs font-semibold transition-all"
              style={{ background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Edit Texture
            </button>
          )}
          {/* Texture panel (3D mode) */}
          {!view2D && showTexturePanel && (
            <RoomTexturePanel
              wallColor={wallColor} setWallColor={setWallColor}
              floorTexture={floorTexture} setFloorTexture={setFloorTexture}
              tileSize={tileSize} setTileSize={setTileSize}
              hOffset={hOffset} setHOffset={setHOffset}
              vOffset={vOffset} setVOffset={setVOffset}
              rotation={floorRotation} setRotation={setFloorRotation}
            />
          )}
        </div>
      </div>

      {/* ── Render mode overlay ── */}
      {renderMode && (
        <RenderMode
          rooms={planSnapshot.rooms}
          walls={planSnapshot.walls}
          items={planSnapshot.items}
          wallColor={wallColor}
          floorTexture={floorTexture}
          onBack={() => setRenderMode(false)}
        />
      )}

      {/* ── Fullscreen catalog overlay ── */}
      {catalogFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#1a1a1a' }}>
          <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ background: '#0e0e0e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-sm font-semibold text-white">Catalog</span>
            <button
              onClick={() => setCatalogFullscreen(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M5.5 1H1V5.5M1 1L6 6M8.5 13H13V8.5M13 13L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Exit Fullscreen
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProductCatalogPanel fullscreen={true} onToggleFullscreen={() => setCatalogFullscreen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
