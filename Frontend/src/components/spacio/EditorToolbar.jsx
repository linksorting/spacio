import React from 'react';
import { ArrowLeft, Box, DoorOpen, LayoutGrid, MousePointer2, Ruler, SquareDashed, PanelsTopLeft } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';

const views = [
  ['floorplan', LayoutGrid, '2D Floorplan'],
  ['editor3d', Box, '3D Editor'],
];

const tools = [
  ['select', MousePointer2, 'Select'],
  ['drawWall', SquareDashed, 'Draw Wall'],
  ['addDoor', DoorOpen, 'Add Door'],
  ['addWindow', PanelsTopLeft, 'Add Window'],
  ['measure', Ruler, 'Measure'],
];

export default function EditorToolbar({ onBack }) {
  const scene = useSceneStore((state) => state.scene);
  const saveStatus = useSceneStore((state) => state.saveStatus);
  const setActiveView = useSceneStore((state) => state.setActiveView);
  const setActiveTool = useSceneStore((state) => state.setActiveTool);

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-white/10 bg-[var(--editor-panel-elevated)] px-3 text-stone-200">
      <button type="button" onClick={onBack} title="Back to dashboard" className="rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white">
        <ArrowLeft size={16} />
      </button>
      <div className="min-w-0 border-r border-white/10 pr-4">
        <div className="truncate text-sm font-semibold text-white">{scene.name}</div>
        <div className="text-[10px] uppercase tracking-[.12em] text-stone-500">{scene.id} | {saveStatus}</div>
      </div>
      <div className="flex rounded-lg bg-white/[.04] p-0.5">
        {views.map(([id, Icon, label]) => (
          <button
            type="button"
            key={id}
            title={label}
            onClick={() => setActiveView(id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] transition ${scene.activeView === id ? 'bg-fuchsia-600 text-white' : 'text-stone-400 hover:text-white'}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-0.5 border-l border-white/10 pl-3">
        {tools.map(([id, Icon, label]) => (
          <button
            type="button"
            key={id}
            title={`${label} tool state`}
            onClick={() => setActiveTool(id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] transition ${scene.activeTool === id ? 'bg-fuchsia-600 text-white' : 'text-stone-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>
      <div className="ml-auto rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-[10px] uppercase tracking-[.14em] text-stone-400">
        Data foundation
      </div>
    </header>
  );
}
