import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import {
  Move, Copy, Trash2, RotateCw, Maximize2, Box,
  Upload, Eye, Grid3X3, ChevronDown, Sliders, ZoomIn, ZoomOut,
  Check, Layers
} from 'lucide-react';
import FloorPlanSymbol, { getFloorPlanFootprint } from './FloorPlanSymbol';
import ThreeDRoomView from './ThreeDRoomView';

// ── Utility: convert pixels → ft string (50 px ≈ 1 ft at base zoom) ──────────
const PX_PER_FT = 20;
const INCHES_PER_FT = 12;
const pxToFtStr = (px) => {
  const ft = px / PX_PER_FT;
  const whole = Math.floor(ft);
  const inches = Math.round((ft - whole) * 12 * 100) / 100;
  return `${whole}' ${inches}"`;
};

const getProductFootprint = (product) => {
  if (product?.dimensions?.width && product?.dimensions?.depth) {
    return {
      w: Math.max(24, (product.dimensions.width / INCHES_PER_FT) * PX_PER_FT),
      h: Math.max(24, (product.dimensions.depth / INCHES_PER_FT) * PX_PER_FT),
    };
  }

  return getFloorPlanFootprint(product?.name);
};

// ── Drag preview while dragging product from catalog ─────────────────────────
function DragPreview({ product, mouse, canvasRect }) {
  if (!product || !canvasRect) return null;
  const inside = mouse.x >= canvasRect.left && mouse.x <= canvasRect.right
              && mouse.y >= canvasRect.top  && mouse.y <= canvasRect.bottom;
  if (!inside) return null;

  const footprint = getProductFootprint(product);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: mouse.x - footprint.w / 2,
        top: mouse.y - footprint.h / 2,
        width: footprint.w,
        height: footprint.h,
        opacity: 0.9,
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))',
      }}
    >
      <FloorPlanSymbol name={product.name} />
      {product.topViewUrl && (
        <img
          src={product.topViewUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          onError={(event) => event.currentTarget.remove()}
        />
      )}
    </div>
  );
}

// ── Floating "Click anywhere for starting point" tooltip ─────────────────────
function StartPointTooltip({ x, y, label }) {
  return (
    <div className="absolute pointer-events-none flex items-center gap-2" style={{ left: x + 12, top: y - 14 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <line x1="9" y1="2" x2="9" y2="16" stroke="#333" strokeWidth="1.5"/>
        <line x1="2" y1="9" x2="16" y2="9" stroke="#333" strokeWidth="1.5"/>
        <circle cx="9" cy="9" r="2.5" stroke="#333" strokeWidth="1.5" fill="none"/>
      </svg>
      <div className="px-2.5 py-1 rounded text-[10px] font-medium text-white whitespace-nowrap" style={{ background: '#222' }}>
        {label}
      </div>
    </div>
  );
}

// ── Contextual top toolbar (appears when item selected) ──────────────────────
function ItemToolbar({ onMove, onCopy, onDelete, onRotate, onResize, on3D, onAdd, onAR, onSimilar }) {
  const Btn = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      title={label}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all hover:bg-white/10"
      style={{ color: 'rgba(255,255,255,0.85)' }}
    >
      <Icon size={14} />
      {label && <span className="text-xs font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center px-3 h-11" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-1">
        <Btn icon={Move} onClick={onMove} label="" />
        <Btn icon={Copy} onClick={onCopy} label="" />
        <Btn icon={Trash2} onClick={onDelete} label="" />
        <Btn icon={RotateCw} onClick={onRotate} label="" />
        <Btn icon={Maximize2} onClick={onResize} label="" />
        <Btn icon={Box} onClick={on3D} label="" />
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', margin: '0 6px' }} />
        <Btn icon={Upload} onClick={onAdd} label="Add to Library" />
        <Btn icon={Eye} onClick={onAR} label="AR View" />
        <Btn icon={Grid3X3} onClick={onSimilar} label="Similar Items" />
      </div>
    </div>
  );
}

// ── Main canvas ──────────────────────────────────────────────────────────────
const PLAN_MODES = [
  { id: 'floor', label: 'Floor Plan Mode' },
  { id: 'ceiling', label: 'Ceiling Plan Mode' },
  { id: 'background', label: 'Background Plan Mode' },
];

const samePlan = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const clonePlan = (plan) => ({
  rooms: plan.rooms || [],
  walls: plan.walls || [],
  items: plan.items || [],
});

const createItemLibraryEntry = (item) => ({
  id: `library_${Date.now()}`,
  name: item.name,
  productId: item.productId,
  width: item.w,
  depth: item.h,
  savedAt: new Date().toISOString(),
});

const saveItemToLibrary = (item) => {
  if (typeof window === 'undefined') return 0;
  const key = 'designer_pro_my_library_items';
  const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
  const next = [createItemLibraryEntry(item), ...existing].slice(0, 50);
  window.localStorage.setItem(key, JSON.stringify(next));
  return next.length;
};

const PlannerCanvas = React.forwardRef(function PlannerCanvas({
  view2D, zoom, setZoom,
  drawTool, setDrawTool,        // 'wall' | 'room' | null
  draggingProduct, setDraggingProduct, // product being dragged from catalog
  wallColor, floorTexture,
  initialPlan,
  backgroundPlan,
  onPlanChange,
  onSwitchTo3D,
  onStatus,
}, ref) {
  const canvasRef = useRef(null);
  const startingPlan = clonePlan(initialPlan || {});
  const [rooms, setRooms]     = useState(startingPlan.rooms); // {id, x, y, w, h}
  const [walls, setWalls]     = useState(startingPlan.walls); // {id, x1,y1, x2,y2}
  const [items, setItems]     = useState(startingPlan.items); // {id, productId, name, img, x, y, w, h, rotation}
  const [selected, setSelected] = useState(null); // {type: 'room'|'wall'|'item', id}
  const [drawStart, setDrawStart] = useState(null); // {x,y} after first click
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [canvasMouse, setCanvasMouse] = useState({ x: 0, y: 0 });
  const [canvasRect, setCanvasRect] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [plannerMode, setPlannerMode] = useState('floor');
  const [modeOpen, setModeOpen] = useState(false);

  const currentPlan = { rooms, walls, items };

  const applyPlan = (plan) => {
    const next = clonePlan(plan);
    setRooms(next.rooms);
    setWalls(next.walls);
    setItems(next.items);
    setSelected(null);
  };

  const commitPlan = (updater) => {
    const previous = clonePlan(currentPlan);
    const next = clonePlan(typeof updater === 'function' ? updater(previous) : updater);

    if (samePlan(previous, next)) return;

    setHistory(prev => [...prev.slice(-49), previous]);
    setFuture([]);
    applyPlan(next);
  };

  const undo = () => {
    setHistory(prev => {
      if (!prev.length) return prev;
      const previous = prev[prev.length - 1];
      setFuture(next => [clonePlan(currentPlan), ...next].slice(0, 50));
      applyPlan(previous);
      onStatus?.('Undid the last planner change.');
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture(prev => {
      if (!prev.length) return prev;
      const nextPlan = prev[0];
      setHistory(next => [...next.slice(-49), clonePlan(currentPlan)]);
      applyPlan(nextPlan);
      onStatus?.('Redid the planner change.');
      return prev.slice(1);
    });
  };

  useImperativeHandle(ref, () => ({
    undo,
    redo,
    clear: () => {
      commitPlan({ rooms: [], walls: [], items: [] });
      onStatus?.('Canvas cleared.');
    },
    getPlan: () => clonePlan(currentPlan),
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  }));

  useEffect(() => {
    onPlanChange?.(clonePlan(currentPlan));
  }, [rooms, walls, items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track global mouse for drag preview
  useEffect(() => {
    if (!draggingProduct) return;
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleUp = (e) => {
      // Check if drop is inside canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right
         && e.clientY >= rect.top  && e.clientY <= rect.bottom) {
          const footprint = getProductFootprint(draggingProduct);
          const x = (e.clientX - rect.left - footprint.w / 2);
          const y = (e.clientY - rect.top - footprint.h / 2);
          commitPlan(plan => ({
            ...plan,
            items: [...plan.items, {
            id: 'item_' + Date.now(),
            productId: draggingProduct.id,
            name: draggingProduct.name,
            img: draggingProduct.thumbnailUrl || draggingProduct.img,
            thumbnailUrl: draggingProduct.thumbnailUrl || draggingProduct.img,
            topViewUrl: draggingProduct.topViewUrl,
            model3dUrl: draggingProduct.model3dUrl,
            dimensions: draggingProduct.dimensions,
            category: draggingProduct.category,
            subcategory: draggingProduct.subcategory,
            materials: draggingProduct.materials,
            colors: draggingProduct.colors,
            x, y,
            w: footprint.w, h: footprint.h,
            rotation: 0,
            }],
          }));
          onStatus?.(`${draggingProduct.name} added to the floor plan.`);
        }
      }
      setDraggingProduct(null);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggingProduct, setDraggingProduct, rooms, walls, items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track canvas rect for drag preview check
  useEffect(() => {
    const update = () => {
      if (canvasRef.current) setCanvasRect(canvasRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Mouse move on canvas (for drawing preview + start-point tooltip)
  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCanvasMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Click on canvas — drawing logic
  const handleCanvasClick = (e) => {
    if (!drawTool || !canvasRef.current) return;
    // Don't trigger if clicked an item
    if (e.target.closest('[data-canvas-item]')) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!drawStart) {
      // First click → set start point
      setDrawStart({ x, y });
      return;
    }

    // Second click → finish shape
    if (drawTool === 'room') {
      const x1 = Math.min(drawStart.x, x);
      const y1 = Math.min(drawStart.y, y);
      const w  = Math.abs(x - drawStart.x);
      const h  = Math.abs(y - drawStart.y);
      if (w > 20 && h > 20) {
        commitPlan(plan => ({
          ...plan,
          rooms: [...plan.rooms, { id: 'room_' + Date.now(), x: x1, y: y1, w, h }],
        }));
        onStatus?.(`Room added: ${pxToFtStr(w)} by ${pxToFtStr(h)}.`);
      }
    } else if (drawTool === 'wall') {
      commitPlan(plan => ({
        ...plan,
        walls: [...plan.walls, { id: 'wall_' + Date.now(), x1: drawStart.x, y1: drawStart.y, x2: x, y2: y }],
      }));
      onStatus?.(`Wall added: ${pxToFtStr(Math.hypot(x - drawStart.x, y - drawStart.y))}.`);
    }
    setDrawStart(null);
    setDrawTool(null);
  };

  // Cancel drawing on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setDrawStart(null); setDrawTool(null); setSelected(null); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]); // eslint-disable-line

  // ── Item action handlers ──────────────────────────────────────
  const deleteSelected = () => {
    if (!selected) return;
    commitPlan(plan => ({
      rooms: selected.type === 'room' ? plan.rooms.filter(r => r.id !== selected.id) : plan.rooms,
      walls: selected.type === 'wall' ? plan.walls.filter(w => w.id !== selected.id) : plan.walls,
      items: selected.type === 'item' ? plan.items.filter(i => i.id !== selected.id) : plan.items,
    }));
    setSelected(null);
    onStatus?.('Selection deleted.');
  };
  const copySelected = () => {
    if (!selected || selected.type !== 'item') return;
    const orig = items.find(i => i.id === selected.id);
    if (!orig) return;
    const copy = { ...orig, id: 'item_' + Date.now(), x: orig.x + 20, y: orig.y + 20 };
    commitPlan(plan => ({ ...plan, items: [...plan.items, copy] }));
    setSelected({ type: 'item', id: copy.id });
    onStatus?.(`${orig.name} duplicated.`);
  };
  const rotateSelected = () => {
    if (!selected || selected.type !== 'item') return;
    commitPlan(plan => ({
      ...plan,
      items: plan.items.map(i => i.id === selected.id ? { ...i, rotation: (i.rotation + 90) % 360 } : i),
    }));
  };
  const resizeSelected = () => {
    if (!selected || selected.type !== 'item') return;
    commitPlan(plan => ({
      ...plan,
      items: plan.items.map(i => i.id === selected.id ? { ...i, w: i.w * 1.2, h: i.h * 1.2 } : i),
    }));
  };

  const saveSelectedToLibrary = () => {
    if (!selected || selected.type !== 'item') return;
    const item = items.find(i => i.id === selected.id);
    if (!item) return;
    const total = saveItemToLibrary(item);
    onStatus?.(`${item.name} saved to My Library (${total} saved items).`);
  };

  // Render preview shape while drawing
  const renderDrawPreview = () => {
    if (!drawStart || !drawTool) return null;
    if (drawTool === 'room') {
      const x = Math.min(drawStart.x, canvasMouse.x);
      const y = Math.min(drawStart.y, canvasMouse.y);
      const w = Math.abs(canvasMouse.x - drawStart.x);
      const h = Math.abs(canvasMouse.y - drawStart.y);
      return (
        <>
          <div className="absolute pointer-events-none" style={{
            left: x, top: y, width: w, height: h,
            border: '2px dashed #e87a5a',
            background: 'rgba(232,122,90,0.06)',
          }} />
          {/* Dimension labels */}
          {w > 30 && (
            <div className="absolute pointer-events-none px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ left: x + w/2 - 30, top: y - 18, background: '#fff', color: '#333', border: '1px solid #ddd' }}>
              {pxToFtStr(w)}
            </div>
          )}
          {h > 30 && (
            <div className="absolute pointer-events-none px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ left: x - 50, top: y + h/2 - 8, background: '#fff', color: '#333', border: '1px solid #ddd' }}>
              {pxToFtStr(h)}
            </div>
          )}
        </>
      );
    }
    if (drawTool === 'wall') {
      return (
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <line x1={drawStart.x} y1={drawStart.y} x2={canvasMouse.x} y2={canvasMouse.y}
            stroke="#e87a5a" strokeWidth="4" strokeDasharray="6 4" />
        </svg>
      );
    }
    return null;
  };

  const tooltipLabel = drawTool && !drawStart
    ? 'Click anywhere for starting point'
    : drawTool && drawStart
      ? `Click to finish ${drawTool}`
      : null;

  return (
    <>
      {/* Item action toolbar (shows over canvas when item is selected) */}
      {selected?.type === 'item' && (
        <ItemToolbar
          onMove={() => onStatus?.('Drag the selected item to move it on the plan.')}
          onCopy={copySelected}
          onDelete={deleteSelected}
          onRotate={rotateSelected}
          onResize={resizeSelected}
          on3D={() => onSwitchTo3D?.()}
          onAdd={saveSelectedToLibrary}
          onAR={() => {
            onSwitchTo3D?.();
            onStatus?.('3D preview opened for the selected item.');
          }}
          onSimilar={() => onStatus?.('Use the catalog search to filter similar furniture by name or room type.')}
        />
      )}

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={{
          background: '#f8f8f8',
          cursor: drawTool ? 'crosshair' : (draggingProduct ? 'copy' : 'default'),
          marginTop: selected?.type === 'item' ? 44 : 0,
        }}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
      >
        {/* Grid */}
        {view2D && (
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.09) 2px, transparent 2px)',
            backgroundSize: `${zoom}px ${zoom}px`,
          }} />
        )}

        {view2D && backgroundPlan?.src && (
          <img
            src={backgroundPlan.src}
            alt={backgroundPlan.name || 'Uploaded floor plan'}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              opacity: plannerMode === 'background' ? 0.9 : 0.32,
              mixBlendMode: plannerMode === 'background' ? 'normal' : 'multiply',
            }}
          />
        )}

        {/* 3D view */}
        {!view2D && (
          <ThreeDRoomView rooms={rooms} walls={walls} items={items} wallColor={wallColor} floorTexture={floorTexture} />
        )}

        {view2D && (
          <div className="absolute inset-0" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>

            {/* Existing rooms */}
            {rooms.map(room => {
              const isSel = selected?.type === 'room' && selected.id === room.id;
              return (
                <div
                  key={room.id}
                  data-canvas-item
                  className="absolute cursor-pointer"
                  style={{
                    left: room.x, top: room.y, width: room.w, height: room.h,
                    border: isSel ? '2px solid #22c55e' : '12px solid #bdbdbd',
                    outline: isSel ? 'none' : '2px solid #222',
                    outlineOffset: '-1px',
                    background: 'rgba(255,255,255,0.72)',
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelected({ type: 'room', id: room.id }); }}
                >
                  {/* Foyr-style inner dimension rails */}
                  <div className="absolute pointer-events-none" style={{ left: 10, right: 10, top: 18, height: 1, background: '#8b8b8b' }} />
                  <div className="absolute pointer-events-none" style={{ left: 10, right: 10, bottom: 18, height: 1, background: '#8b8b8b' }} />
                  <div className="absolute pointer-events-none" style={{ top: 10, bottom: 10, left: 18, width: 1, background: '#8b8b8b' }} />
                  <div className="absolute pointer-events-none" style={{ top: 10, bottom: 10, right: 18, width: 1, background: '#8b8b8b' }} />
                  <span className="absolute px-2 text-[10px] bg-white" style={{ color: '#222', top: 10, left: '50%', transform: 'translateX(-50%)' }}>{pxToFtStr(room.w)}</span>
                  <span className="absolute px-2 text-[10px] bg-white" style={{ color: '#222', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>{pxToFtStr(room.w)}</span>
                  <span className="absolute px-1 text-[10px] bg-white" style={{ color: '#222', top: '50%', left: 2, transform: 'translateY(-50%)' }}>{pxToFtStr(room.h)}</span>
                  <span className="absolute px-1 text-[10px] bg-white" style={{ color: '#222', top: '50%', right: 2, transform: 'translateY(-50%)' }}>{pxToFtStr(room.h)}</span>
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-sm font-medium" style={{ color: '#111' }}>Room</div>
                    <div className="text-xs" style={{ color: '#111' }}>
                      {((room.w * room.h) / (PX_PER_FT * PX_PER_FT)).toFixed(1)} ft²
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Walls */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
              {walls.map(wall => {
                const isSel = selected?.type === 'wall' && selected.id === wall.id;
                return (
                  <line
                    key={wall.id}
                    x1={wall.x1} y1={wall.y1} x2={wall.x2} y2={wall.y2}
                    stroke={isSel ? '#22c55e' : '#555'} strokeWidth="6" strokeLinecap="round"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); setSelected({ type: 'wall', id: wall.id }); }}
                  />
                );
              })}
            </svg>

            {/* Placed items (products) */}
            {items.map(item => {
              const isSel = selected?.type === 'item' && selected.id === item.id;
              return (
                <motion.div
                  key={item.id}
                  data-canvas-item
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragEnd={(e, info) => {
                    commitPlan(plan => ({
                      ...plan,
                      items: plan.items.map(i => i.id === item.id ? { ...i, x: i.x + info.offset.x, y: i.y + info.offset.y } : i),
                    }));
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: item.rotation }}
                  className="absolute cursor-move overflow-hidden"
                  style={{
                    left: item.x, top: item.y, width: item.w, height: item.h,
                    border: isSel ? '1px solid rgba(0,0,0,0.55)' : '1px solid transparent',
                    boxShadow: isSel ? '0 0 0 1px rgba(255,255,255,0.8)' : 'none',
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelected({ type: 'item', id: item.id }); }}
                >
                  <div className="relative w-full h-full pointer-events-none">
                    <FloorPlanSymbol name={item.name} />
                    {item.topViewUrl && (
                      <img
                        src={item.topViewUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain"
                        draggable={false}
                        onError={(event) => event.currentTarget.remove()}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Drawing preview overlay */}
            {renderDrawPreview()}
          </div>
        )}

        {/* Start point tooltip */}
        {tooltipLabel && (
          <StartPointTooltip x={canvasMouse.x} y={canvasMouse.y} label={tooltipLabel} />
        )}

        {/* Bottom-left controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <button className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.1)' }}>
            <Sliders size={12} style={{ color: '#555' }} />
          </button>
          <span className="px-3 py-1 rounded text-xs" style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>Grid Box : 25 ft</span>
        </div>

        {/* Top-right (only when not selected) */}
        {selected?.type !== 'item' && (
          <div className="absolute top-3 right-3 z-30">
            <button
              onClick={() => setModeOpen(open => !open)}
              className="flex items-center gap-3 px-3 py-2 text-xs"
              style={{
                minWidth: 216,
                background: '#fff',
                border: '1px solid #e8b4a6',
                color: '#182136',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              }}
            >
              <Layers size={15} />
              <span className="flex-1 text-left">{PLAN_MODES.find(mode => mode.id === plannerMode)?.label}</span>
              <ChevronDown size={13} style={{ transform: modeOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {modeOpen && (
              <div
                className="absolute right-0 top-full overflow-hidden"
                style={{
                  width: 216,
                  background: '#fff',
                  border: '1px solid #e8b4a6',
                  borderTop: 0,
                  boxShadow: '0 12px 30px rgba(24,33,54,0.12)',
                }}
              >
                {PLAN_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setPlannerMode(mode.id);
                      setModeOpen(false);
                      onStatus?.(`${mode.label} selected.`);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 text-xs text-left transition-colors hover:bg-slate-50"
                    style={{ color: '#182136' }}
                  >
                    <span className="w-4">{plannerMode === mode.id && <Check size={14} />}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Zoom */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
            <ZoomIn size={13} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 10, 30))} className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
            <ZoomOut size={13} />
          </button>
        </div>
      </div>

      {/* Drag preview (follows cursor while dragging product) */}
      <DragPreview product={draggingProduct} mouse={mousePos} canvasRect={canvasRect} />
    </>
  );
});

export default PlannerCanvas;
