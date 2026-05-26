import React from 'react';
import { Aperture, Armchair, DoorOpen, LampFloor, Layers3, Ruler, SquareDashed } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';

const collections = [
  ['Rooms', 'rooms', SquareDashed],
  ['Walls', 'walls', Layers3],
  ['Openings', 'openings', DoorOpen],
  ['Furniture', 'furniture', Armchair],
  ['Lights', 'lights', LampFloor],
  ['Measurements', 'measurements', Ruler],
  ['Materials', 'materials', Aperture],
];

export default function SceneFoundationWorkspace({ notify }) {
  const scene = useSceneStore((state) => state.scene);
  const resetToSampleScene = useSceneStore((state) => state.resetToSampleScene);
  const selectObject = useSceneStore((state) => state.selectObject);
  const activeModeLabel = scene.activeView === 'editor3d' ? '3D Editor data is ready' : '2D Floorplan data is ready';

  return (
    <section className="flex h-full flex-col overflow-y-auto bg-[#111014] p-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#211b26] to-[#161419] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-fuchsia-300">Phase 2 Scene Foundation</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">{activeModeLabel}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
              Both future renderers will consume this normalized project scene. Interactive canvas and 3D rendering are intentionally deferred.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { resetToSampleScene(); notify('Sample scene restored'); }}
            className="rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
          >
            Load Sample Living Room
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {collections.map(([label, key, Icon]) => (
          <article key={key} className="rounded-xl border border-white/10 bg-white/[.035] p-4">
            <Icon size={16} className="text-fuchsia-300" />
            <div className="mt-4 text-2xl font-semibold text-white">{Object.keys(scene[key]).length}</div>
            <div className="mt-1 text-xs text-stone-400">{label}</div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_330px]">
        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
          <h2 className="text-sm font-semibold text-white">Scene Entities</h2>
          <p className="mt-1 text-xs text-stone-500">Select an object to inspect it in the properties panel.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Object.values(scene.furniture).map((item) => (
              <button type="button" key={item.id} onClick={() => selectObject(item.id)} className="rounded-xl border border-white/10 bg-white/[.03] p-3 text-left transition hover:border-fuchsia-500/40">
                <div className="text-sm font-medium text-stone-100">{item.name}</div>
                <div className="mt-1 text-[11px] text-stone-500">{item.productId} | {item.dimensionsCm.w} x {item.dimensionsCm.d} x {item.dimensionsCm.h} cm</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
          <h2 className="text-sm font-semibold text-white">Camera & Settings</h2>
          <div className="mt-4 space-y-3 text-xs text-stone-400">
            <div className="rounded-lg bg-white/[.035] p-3">Units: <span className="text-stone-100">{scene.units}</span></div>
            <div className="rounded-lg bg-white/[.035] p-3">Grid: <span className="text-stone-100">{scene.settings.gridSizeCm} cm</span></div>
            <div className="rounded-lg bg-white/[.035] p-3">Ceiling: <span className="text-stone-100">{scene.settings.ceilingHeightCm} cm</span></div>
            <div className="rounded-lg bg-white/[.035] p-3">3D camera: <span className="text-stone-100">{scene.camera.editor3d.position.join(', ')}</span></div>
            <div className="rounded-lg bg-white/[.035] p-3">Active tool: <span className="text-stone-100">{scene.activeTool}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
