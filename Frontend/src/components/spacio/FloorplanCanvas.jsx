import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Hand, Minus, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSceneStore } from '@/store/useSceneStore';
import { furnitureCenter, hitTestRoomLabel, hitTestScene, snapPoint, snapScenePoint } from '@/utils/spacioGeometry';
import FloorplanRenderer, { clampFloorplanZoom } from './FloorplanRenderer';

const notify = (message) => toast({ title: message, duration: 3000 });

export default function FloorplanCanvas() {
  const scene = useSceneStore((state) => state.scene);
  const viewport = useSceneStore((state) => state.viewport);
  const transient = useSceneStore((state) => state.transient);
  const setViewport = useSceneStore((state) => state.setViewport);
  const surfaceRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const dragRef = useRef(null);
  const spacePressedRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);

  const renderCanvas = useCallback(() => {
    const surface = surfaceRef.current;
    const canvas = canvasRef.current;
    if (!surface || !canvas) return;
    const width = surface.clientWidth;
    const height = surface.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!rendererRef.current) rendererRef.current = new FloorplanRenderer(ctx);
    rendererRef.current.ctx = ctx;
    rendererRef.current.render(scene, viewport, width, height, transient);
  }, [scene, transient, viewport]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return undefined;
    const observer = new ResizeObserver(() => renderCanvas());
    observer.observe(surface);
    return () => observer.disconnect();
  }, [renderCanvas]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const editingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
      if (event.code === 'Space' && !editingText) {
        spacePressedRef.current = true;
        event.preventDefault();
      }
      if (editingText) return;
      const store = useSceneStore.getState();
      if (event.key === 'Escape') {
        store.endWallChain();
        store.cancelMeasurement();
        store.clearSelection();
        event.preventDefault();
      }
      if (event.key === 'Enter' && store.scene.activeTool === 'drawWall' && store.transient.wallStart) {
        store.endWallChain();
        event.preventDefault();
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && store.scene.selectedIds.length) {
        store.removeSelected();
        event.preventDefault();
      }
      if (event.key.toLowerCase() === 'g') {
        const enabled = !store.scene.settings.snapToGrid;
        store.updateSettings({ snapToGrid: enabled });
        notify(`Grid snap ${enabled ? 'enabled' : 'disabled'}`);
      }
    };
    const handleKeyUp = (event) => {
      if (event.code === 'Space') spacePressedRef.current = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const screenPoint = (event) => {
    const rect = surfaceRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const toWorld = (event) => {
    const point = screenPoint(event);
    return {
      x: (point.x - viewport.pan.x) / viewport.zoom,
      y: (point.y - viewport.pan.y) / viewport.zoom,
    };
  };

  const zoomAtPoint = (nextZoom, point) => {
    const zoom = clampFloorplanZoom(nextZoom);
    const world = {
      x: (point.x - viewport.pan.x) / viewport.zoom,
      y: (point.y - viewport.pan.y) / viewport.zoom,
    };
    setViewport({
      zoom,
      pan: {
        x: point.x - world.x * zoom,
        y: point.y - world.y * zoom,
      },
    });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    zoomAtPoint(viewport.zoom * Math.exp(-event.deltaY * 0.0015), screenPoint(event));
  };

  const startPan = (event) => {
    dragRef.current = {
      mode: 'pan',
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      pan: { ...viewport.pan },
    };
    surfaceRef.current.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const startEntityDrag = (event, hit, point) => {
    const store = useSceneStore.getState();
    const entity = store.scene[hit.collection][hit.id];
    if (!entity || entity.locked) return;
    let offset = null;
    if (hit.collection === 'furniture') {
      offset = hit.handle === 'rotate'
        ? null
        : { x: point.x - entity.position.x, y: point.y - entity.position.y };
    }
    dragRef.current = {
      mode: hit.handle === 'rotate' ? 'rotateFurniture' : hit.collection === 'furniture' ? 'moveFurniture' : 'moveOpening',
      pointerId: event.pointerId,
      id: hit.id,
      offset,
      started: false,
    };
    surfaceRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerDown = (event) => {
    const startsPan = event.button === 1 || (event.button === 0 && spacePressedRef.current);
    if (startsPan) {
      event.preventDefault();
      startPan(event);
      return;
    }
    if (event.button !== 0) return;
    const store = useSceneStore.getState();
    const point = toWorld(event);
    const snapped = snapScenePoint(point, store.scene, viewport.zoom);
    if (store.scene.activeTool === 'drawWall') {
      if (event.detail > 1) {
        store.endWallChain();
        return;
      }
      if (!store.transient.wallStart) {
        store.beginWall(snapped.point);
      } else {
        const result = store.finishWall(snapped.point);
        if (result.id) notify('Wall created');
        if (result.roomsDetected) notify('Room detected');
      }
      store.setTransientPreview(snapped.point, snapped.indicator);
      return;
    }
    if (store.scene.activeTool === 'measure') {
      if (store.addMeasurement(snapped.point)) notify('Measurement added');
      else store.setTransientPreview(snapped.point, snapped.indicator);
      return;
    }
    if (store.scene.activeTool === 'addDoor' || store.scene.activeTool === 'addWindow') {
      const type = store.scene.activeTool === 'addDoor' ? 'door' : 'window';
      if (store.addOpeningAt(type, point)) notify(`${type === 'door' ? 'Door' : 'Window'} added`);
      return;
    }
    const hit = hitTestScene(store.scene, point, viewport.zoom);
    if (!hit) {
      store.clearSelection();
      return;
    }
    store.selectObject(hit.id, event.shiftKey);
    if (!event.shiftKey && (hit.collection === 'furniture' || hit.collection === 'openings')) {
      startEntityDrag(event, hit, point);
    }
  };

  const handlePointerMove = (event) => {
    const store = useSceneStore.getState();
    if (dragRef.current?.pointerId === event.pointerId) {
      const drag = dragRef.current;
      if (drag.mode === 'pan') {
        setViewport({
          pan: {
            x: drag.pan.x + event.clientX - drag.start.x,
            y: drag.pan.y + event.clientY - drag.start.y,
          },
        });
        return;
      }
      const point = toWorld(event);
      if (!drag.started) {
        store.beginEdit();
        drag.started = true;
      }
      if (drag.mode === 'moveOpening') {
        store.updateOpeningOffset(drag.id, point);
      } else if (drag.mode === 'moveFurniture') {
        let position = { x: point.x - drag.offset.x, y: point.y - drag.offset.y };
        if (store.scene.settings.snapToGrid) {
          position = snapPoint(position, store.scene.settings.gridSizeCm || 25);
          store.setTransientPreview(null, { point: position, type: 'grid', label: 'Grid' });
        }
        store.moveFurniture2D(drag.id, position);
      } else if (drag.mode === 'rotateFurniture') {
        const item = store.scene.furniture[drag.id];
        const center = furnitureCenter(item);
        const rotationY = ((Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI) + 90 + 360) % 360;
        store.rotateFurniture2D(drag.id, Math.round(rotationY));
      }
      return;
    }
    if (store.scene.activeTool === 'drawWall' || store.scene.activeTool === 'measure') {
      const snapped = snapScenePoint(toWorld(event), store.scene, viewport.zoom);
      store.setTransientPreview(snapped.point, snapped.indicator);
    }
  };

  const stopPointerAction = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    if (surfaceRef.current.hasPointerCapture(event.pointerId)) surfaceRef.current.releasePointerCapture(event.pointerId);
    if (dragRef.current.mode !== 'pan') useSceneStore.getState().setTransientPreview(null, null);
    dragRef.current = null;
    setIsPanning(false);
  };

  const handleDoubleClick = (event) => {
    const store = useSceneStore.getState();
    if (store.scene.activeTool === 'drawWall') {
      store.endWallChain();
      return;
    }
    if (store.scene.activeTool !== 'select') return;
    const room = hitTestRoomLabel(store.scene, toWorld(event), viewport.zoom);
    if (!room || room.locked) return;
    const name = window.prompt('Room name', room.name);
    if (name?.trim()) store.updateEntity('rooms', room.id, { name: name.trim() });
  };

  const zoomFromCenter = (factor) => {
    const surface = surfaceRef.current;
    if (!surface) return;
    zoomAtPoint(viewport.zoom * factor, { x: surface.clientWidth / 2, y: surface.clientHeight / 2 });
  };

  const cursor = isPanning ? 'grabbing' : scene.activeTool === 'select' ? 'default' : 'crosshair';

  return (
    <section className="relative h-full overflow-hidden bg-[#f5f1ea]">
      <div
        ref={surfaceRef}
        role="img"
        aria-label="2D floorplan canvas"
        className="absolute inset-0 touch-none"
        style={{ cursor }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPointerAction}
        onPointerCancel={stopPointerAction}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
      <div className="pointer-events-none absolute bottom-5 left-12 rounded-xl border border-stone-200/90 bg-white/92 px-3 py-2 text-xs text-stone-600 shadow-sm backdrop-blur">
        <span className="flex items-center gap-2"><Hand size={13} />Middle mouse or Space + drag to pan</span>
        <span className="mt-1 block text-[10px] text-stone-500">G toggles grid snap | Delete removes unlocked selection | Escape clears</span>
      </div>
      <div className="absolute bottom-5 right-[206px] flex items-center gap-1 rounded-xl border border-stone-200/90 bg-white/92 p-1 shadow-sm backdrop-blur">
        <button type="button" aria-label="Zoom out" onClick={() => zoomFromCenter(0.9)} className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
          <Minus size={14} />
        </button>
        <span className="min-w-[50px] text-center text-xs font-medium text-stone-600">{Math.round(viewport.zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomFromCenter(1.1)} className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500">
          <Plus size={14} />
        </button>
      </div>
    </section>
  );
}
