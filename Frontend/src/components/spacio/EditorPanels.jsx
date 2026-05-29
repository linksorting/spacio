import React, { useMemo, useState } from 'react';
import {
  Armchair, Box, DoorOpen, Eye, EyeOff, Heart, LampFloor, Layers3, Lock, LockOpen,
  Ruler, Search, SquareDashed, Trash2, Wallpaper, X,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { assetCategories, getSpacioProduct, placementFilterOptions, roomFilterOptions, spacioProducts, styleFilterOptions } from '@/data/spacioCatalog';
import { filterProducts, ROOM_TYPE_LABELS } from '@/data/spacioProductMeta';
import { materialOptions } from '@/data/spacioMaterials';
import { templates } from '@/data/spacioTemplates';
import { useSceneStore } from '@/store/useSceneStore';
import { distance2D } from '@/utils/spacioGeometry';
import { getActiveRoomType } from '@/utils/placementValidation';

const groupMap = [
  ['Rooms', 'rooms', SquareDashed],
  ['Walls', 'walls', Wallpaper],
  ['Doors & Windows', 'openings', DoorOpen],
  ['Furniture', 'furniture', Armchair],
  ['Lights', 'lights', LampFloor],
  ['Measurements', 'measurements', Ruler],
];

function LayersPanel() {
  const scene = useSceneStore((state) => state.scene);
  const selectObject = useSceneStore((state) => state.selectObject);
  const toggleEntityFlag = useSceneStore((state) => state.toggleEntityFlag);
  return (
    <div className="space-y-4 p-3">
      {groupMap.map(([title, collection, Icon]) => {
        const entities = Object.values(scene[collection]);
        if (!entities.length) return null;
        return (
          <section key={collection}>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-stone-500"><Icon size={12} />{title}<span className="ml-auto rounded-full bg-white/5 px-1.5 py-0.5 text-[9px]">{entities.length}</span></h3>
            <div className="space-y-0.5">
              {entities.map((entity) => (
                <div key={entity.id} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition ${!entity.visible ? 'opacity-40' : ''} ${scene.selectedIds.includes(entity.id) ? 'bg-fuchsia-500/15 text-fuchsia-200' : 'text-stone-300 hover:bg-white/5'}`}>
                  <button type="button" className="min-w-0 flex-1 truncate text-left" onClick={() => selectObject(entity.id)}>{entity.name || entity.type}</button>
                  <button
                    type="button"
                    aria-label={entity.visible ? 'Hide layer' : 'Show layer'}
                    title={entity.visible ? 'Hide' : 'Show'}
                    onClick={(event) => { event.stopPropagation(); toggleEntityFlag(collection, entity.id, 'visible'); }}
                    className={`rounded p-1 transition ${entity.visible ? 'text-stone-300 hover:bg-white/10 hover:text-white' : 'text-fuchsia-300 hover:bg-fuchsia-500/10'}`}
                  >
                    {entity.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    type="button"
                    aria-label={entity.locked ? 'Unlock layer' : 'Lock layer'}
                    onClick={(event) => { event.stopPropagation(); toggleEntityFlag(collection, entity.id, 'locked'); }}
                    className="rounded p-1 text-stone-500 transition hover:bg-white/10 hover:text-stone-200"
                  >
                    {entity.locked ? <Lock size={12} /> : <LockOpen size={12} />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {!Object.values(scene.rooms).length && !Object.values(scene.walls).length && !Object.values(scene.furniture).length && !Object.values(scene.lights).length ? (
        <p className="px-1 text-xs leading-5 text-stone-500">No layers yet. Draw walls or add products to get started.</p>
      ) : null}
    </div>
  );
}

function ProductThumbnail({ product, className = '' }) {
  return (
    <img
      src={product.thumbnailUrl}
      alt={product.name}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
        event.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  );
}

function ProductDetail({ product, open, setOpen, addProduct, notify }) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl overflow-hidden border-stone-700 bg-[#171418] p-0 text-stone-100">
        <div className="grid min-h-[600px] grid-cols-[46%_54%]">
          <div className="relative flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-950 p-10">
            <div className="absolute left-6 top-6 text-xs uppercase tracking-[.2em] text-stone-400">Product Preview</div>
            <div className="relative h-64 w-72 overflow-hidden rounded-[2rem] border border-white/10 bg-[#f5f2ec] shadow-2xl">
              <ProductThumbnail product={product} />
              <div className="hidden flex h-full w-full items-center justify-center bg-stone-800"><Box size={48} className="text-stone-500" /></div>
            </div>
          </div>
          <div className="p-9">
            <div className="text-xs uppercase tracking-[.18em] text-fuchsia-300">{product.brand} | {product.collection}</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">{product.name}</h2>
            <div className="mt-3 text-sm text-amber-300">4.7 stars | 143 reviews</div>
            <div className="mt-5 text-3xl font-semibold">${product.price.toLocaleString()}</div>
            <p className="mt-5 text-sm leading-7 text-stone-300">{product.description}</p>
            <div className="mt-7 rounded-xl border border-white/10 bg-white/[.03] p-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-stone-400">Dimensions</span><span>{product.dimensionsCm.w} x {product.dimensionsCm.d} x {product.dimensionsCm.h} cm</span></div>
              <div className="flex justify-between border-b border-white/10 py-3"><span className="text-stone-400">Placement</span><span className="capitalize">{product.placementType}</span></div>
              <div className="flex justify-between border-b border-white/10 py-3"><span className="text-stone-400">Rooms</span><span>{product.roomTypes?.map((room) => room.replace('_', ' ')).join(', ')}</span></div>
              <div className="flex justify-between border-b border-white/10 py-3"><span className="text-stone-400">Imperial</span><span>{product.dimensionsIn.w} x {product.dimensionsIn.d} x {product.dimensionsIn.h} in</span></div>
              <div className="flex justify-between pt-3"><span className="text-stone-400">Materials</span><span>{product.materials.join(', ')}</span></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.styleTags?.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-stone-400">{tag}</span>)}
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">Procedural</span>
            </div>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => { addProduct(product.id); setOpen(false); }} className="rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500">Add to Room</button>
              <button type="button" onClick={() => notify(`${product.name} saved to wishlist`)} className="rounded-xl border border-white/15 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/10"><Heart size={14} className="mr-2 inline" />Save</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssetsPanel({ notify }) {
  const scene = useSceneStore((state) => state.scene);
  const assetFilters = useSceneStore((state) => state.assetFilters);
  const setAssetFilters = useSceneStore((state) => state.setAssetFilters);
  const addFurniture = useSceneStore((state) => state.addFurniture);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState(null);
  const activeRoomType = getActiveRoomType(scene);
  const products = useMemo(() => filterProducts(spacioProducts, {
    roomFilter: assetFilters.room,
    category: assetFilters.category,
    style: assetFilters.style,
    placement: assetFilters.placement,
    query,
    activeRoomType,
    showAllOverride: assetFilters.showAllOverride,
  }), [activeRoomType, assetFilters, query]);
  const addProduct = (id) => {
    const result = addFurniture(id, { allowRoomMismatch: assetFilters.showAllOverride });
    if (!result.ok) {
      notify(result.message);
      return;
    }
    notify(result.message || `${getSpacioProduct(id)?.name ?? id} added to scene`);
  };
  const filterButton = (value, current, label, onClick) => (
    <button key={value} type="button" onClick={onClick} className={`rounded-full px-2 py-0.5 text-[10px] ${current === value ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-stone-400 hover:text-white'}`}>{label}</button>
  );
  return (
    <>
      <div className="p-4">
        <label className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-stone-400">
          <Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${spacioProducts.length} products`} className="w-full bg-transparent text-xs text-stone-100 outline-none" />
        </label>
        <div className="mb-2 text-[10px] uppercase tracking-[.12em] text-stone-500">Room filter</div>
        <div className="mb-3 flex flex-wrap gap-1">
          {roomFilterOptions.map((item) => filterButton(item, assetFilters.room, ROOM_TYPE_LABELS[item] || item, () => setAssetFilters({ room: item, showAllOverride: item === 'all' })))}
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[.12em] text-stone-500">Category</div>
        <div className="mb-3 flex flex-wrap gap-1">
          {assetCategories.map((item) => filterButton(item, assetFilters.category, item, () => setAssetFilters({ category: item })))}
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[.12em] text-stone-500">Style</div>
        <div className="mb-3 flex flex-wrap gap-1">
          {styleFilterOptions.map((item) => filterButton(item, assetFilters.style, item, () => setAssetFilters({ style: item })))}
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[.12em] text-stone-500">Placement</div>
        <div className="mb-4 flex flex-wrap gap-1">
          {placementFilterOptions.map((item) => filterButton(item, assetFilters.placement, item, () => setAssetFilters({ placement: item })))}
        </div>
        <p className="mb-3 text-[10px] text-stone-500">{products.length} items · {ROOM_TYPE_LABELS[assetFilters.room === 'auto' ? activeRoomType : assetFilters.room] || 'All'}</p>
        <div className="grid grid-cols-2 gap-2">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[.035]">
              <div className="relative h-20 overflow-hidden bg-[#f5f2ec]">
                <ProductThumbnail product={product} />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-[#29232b]"><Box size={22} className="text-stone-500" /></div>
                <span className="absolute left-1 top-1 rounded bg-black/45 px-1.5 py-0.5 text-[9px] text-stone-200">{product.placementType}</span>
              </div>
              <div className="p-2.5">
              <h3 className="line-clamp-2 text-xs font-semibold text-stone-100">{product.name}</h3>
              <p className="mt-1 truncate text-[10px] text-stone-400">{product.brand}</p>
              <p className="mt-1 text-[10px] text-stone-500">{product.dimensionsCm.w}×{product.dimensionsCm.d}×{product.dimensionsCm.h} cm</p>
              <p className="mt-2 text-xs text-stone-200">${product.price.toLocaleString()}</p>
              <div className="mt-2 flex gap-1">
                <button type="button" onClick={() => addProduct(product.id)} className="flex-1 rounded-md bg-fuchsia-600 py-1.5 text-[10px] font-medium text-white hover:bg-fuchsia-500">Add</button>
                <button type="button" onClick={() => setDetail(product)} className="rounded-md border border-white/10 px-2 text-[10px] text-stone-300 hover:bg-white/10">View</button>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ProductDetail product={detail} open={!!detail} setOpen={(open) => !open && setDetail(null)} addProduct={addProduct} notify={notify} />
    </>
  );
}

function TemplatesPanel({ notify }) {
  const applyTemplate = useSceneStore((state) => state.applyTemplate);
  const [pending, setPending] = useState(null);
  return (
    <div className="p-4">
      <p className="mb-4 text-xs leading-5 text-stone-400">Load a professionally styled room with furniture already placed. Existing scene contents will be replaced.</p>
      <div className="space-y-2">
        {templates.map((template) => (
          <button type="button" key={template.id} onClick={() => setPending(template)} className="block w-full rounded-xl border border-white/10 bg-white/[.035] p-3 text-left hover:border-fuchsia-500/50">
            <span className="block text-sm font-medium text-stone-100">{template.name}</span>
            <span className="mt-1 block text-xs text-stone-400">{template.summary}</span>
            {template.furnitureCount != null ? (
              <span className="mt-2 block text-[10px] text-stone-500">
                {template.style || 'Styled'} · {template.roomType?.replace('_', ' ') || 'Room'} · {template.furnitureCount} pieces · {template.areaM2 ? `${template.areaM2} m²` : 'Blank'}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent className="border-stone-700 bg-[#171418] text-stone-100">
          <h2 className="text-xl font-semibold">Load {pending?.name}?</h2>
          <p className="text-sm text-stone-400">This replaces the current scene and can be undone from the toolbar.</p>
          {pending?.furnitureCount ? <p className="mt-2 text-xs text-stone-500">Includes {pending.furnitureCount} placed products with professional spacing.</p> : null}
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setPending(null)} className="rounded-lg px-4 py-2 text-sm text-stone-300 hover:bg-white/5">Cancel</button>
            <button type="button" onClick={() => { applyTemplate(pending.id); notify('Template loaded'); setPending(null); }} className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white">Load Room</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function LeftSidebar({ notify }) {
  return (
    <aside className="w-[210px] shrink-0 overflow-hidden border-r border-white/10 bg-[var(--editor-panel)]">
      <Tabs defaultValue="layers" className="flex h-full flex-col">
        <TabsList className="mx-2 mt-2 grid h-9 grid-cols-3 bg-white/5 text-stone-400">
          <TabsTrigger value="layers" className="text-[11px] data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white">Layers</TabsTrigger>
          <TabsTrigger value="assets" className="text-[11px] data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white">Assets</TabsTrigger>
          <TabsTrigger value="templates" className="text-[11px] data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="layers" className="m-0 flex-1 overflow-y-auto"><LayersPanel /></TabsContent>
        <TabsContent value="assets" className="m-0 flex-1 overflow-y-auto"><AssetsPanel notify={notify} /></TabsContent>
        <TabsContent value="templates" className="m-0 flex-1 overflow-y-auto"><TemplatesPanel notify={notify} /></TabsContent>
      </Tabs>
    </aside>
  );
}

function Field({ title, children }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] uppercase tracking-[.12em] text-stone-500">{title}</span>{children}</label>;
}

const inputClass = 'w-full rounded-lg border border-white/10 bg-white/[.045] px-3 py-2 text-sm text-stone-100 outline-none focus:border-fuchsia-500';

export function RightSidebar({ notify }) {
  const scene = useSceneStore((state) => state.scene);
  const updateSettings = useSceneStore((state) => state.updateSettings);
  const updateEntity = useSceneStore((state) => state.updateEntity);
  const updateFurnitureTransform = useSceneStore((state) => state.updateFurnitureTransform);
  const setWallLength = useSceneStore((state) => state.setWallLength);
  const removeSelected = useSceneStore((state) => state.removeSelected);
  const selected = scene.selectedIds[0];
  const entity = ['rooms', 'walls', 'openings', 'furniture', 'lights', 'measurements'].reduce((found, collection) => found || (scene[collection][selected] ? { collection, value: scene[collection][selected] } : null), null);
  const updateNumber = (collection, id, key) => (event) => updateEntity(collection, id, { [key]: Number(event.target.value) });
  const wallLength = entity?.collection === 'walls' ? Math.round(distance2D(entity.value.start, entity.value.end)) : 0;
  return (
    <aside className="w-[260px] shrink-0 overflow-y-auto border-l border-white/10 bg-[var(--editor-panel)] p-4 text-stone-100">
      <div className="mb-4 flex items-center gap-2"><Layers3 size={14} className="text-fuchsia-400" /><h2 className="text-sm font-semibold">{entity ? 'Properties' : 'Scene'}</h2></div>
      {!entity ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[.03] p-3">
            <div className="text-sm font-semibold">{scene.name}</div>
            <p className="mt-1 text-[11px] text-stone-500">{Object.keys(scene.walls).length} walls | {Object.keys(scene.openings).length} openings | {Object.keys(scene.lights).length} lights</p>
            <p className="mt-2 text-[10px] uppercase tracking-[.12em] text-fuchsia-300">{scene.activeView} | {scene.activeTool}</p>
            <p className="mt-1 text-[11px] text-stone-500">{Object.keys(scene.rooms).length} rooms · {Object.keys(scene.furniture).length} products</p>
          </div>
          <Field title="Wall thickness"><input type="number" min="10" max="40" value={scene.settings.wallThicknessCm} onChange={(event) => updateSettings({ wallThicknessCm: Number(event.target.value) })} className={inputClass} /></Field>
          <Field title="Ceiling height"><input type="number" value={scene.settings.ceilingHeightCm} onChange={(event) => updateSettings({ ceilingHeightCm: Number(event.target.value) })} className={inputClass} /></Field>
          <label className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-sm">Show ceiling<input type="checkbox" checked={scene.settings.showCeiling} onChange={(event) => updateSettings({ showCeiling: event.target.checked })} /></label>
        </div>
      ) : (
        <div className="space-y-4">
          <Field title="Name"><input value={entity.value.name || entity.value.type} onChange={(event) => updateEntity(entity.collection, entity.value.id, { name: event.target.value })} className={inputClass} /></Field>
          {entity.collection === 'walls' ? (
            <>
              <Field title="Length cm"><input type="number" min="20" value={wallLength} onChange={(event) => setWallLength(entity.value.id, Number(event.target.value))} className={inputClass} /></Field>
              <p className="text-[11px] leading-5 text-stone-500">Drag the purple handles on the plan to move or resize this wall.</p>
              <Field title="Thickness cm"><input type="number" min="10" max="40" value={entity.value.thicknessCm} onChange={updateNumber('walls', entity.value.id, 'thicknessCm')} className={inputClass} /></Field>
              <Field title="Height cm"><input type="number" value={entity.value.heightCm} onChange={updateNumber('walls', entity.value.id, 'heightCm')} className={inputClass} /></Field>
            </>
          ) : null}
          {entity.collection === 'rooms' ? (
            <>
              <p className="rounded-lg bg-white/[.04] p-3 text-xs text-stone-300">{entity.value.areaM2?.toFixed(1) || '0.0'} m² · {entity.value.roomType?.replace('_', ' ') || 'generic'}</p>
              <Field title="Room type"><select value={entity.value.roomType || 'generic'} onChange={(event) => updateEntity('rooms', entity.value.id, { roomType: event.target.value })} className={inputClass}>{Object.entries(ROOM_TYPE_LABELS).filter(([key]) => key !== 'auto' && key !== 'all').map(([key, label]) => <option key={key} value={key} className="bg-stone-900">{label}</option>)}</select></Field>
              <p className="text-[11px] leading-5 text-stone-500">Drag corner handles to resize. Drag inside the room to move it. Room type filters the asset library.</p>
            </>
          ) : null}
          {entity.collection === 'openings' ? (
            <>
              <p className="rounded-lg bg-white/[.04] p-3 text-xs text-stone-300">Attached to {scene.walls[entity.value.wallId]?.name}</p>
              <Field title="Width cm"><input type="number" value={entity.value.widthCm} onChange={updateNumber('openings', entity.value.id, 'widthCm')} className={inputClass} /></Field>
              <Field title="Height cm"><input type="number" value={entity.value.heightCm} onChange={updateNumber('openings', entity.value.id, 'heightCm')} className={inputClass} /></Field>
              {entity.value.type === 'window' ? <Field title="Sill height cm"><input type="number" value={entity.value.sillHeightCm} onChange={updateNumber('openings', entity.value.id, 'sillHeightCm')} className={inputClass} /></Field> : null}
            </>
          ) : null}
          {entity.collection === 'furniture' ? (
            <>
              {getSpacioProduct(entity.value.productId)?.thumbnailUrl ? (
                <img src={getSpacioProduct(entity.value.productId).thumbnailUrl} alt="" className="h-28 w-full rounded-xl border border-white/10 object-cover" />
              ) : null}
              <p className="text-xs text-stone-400">{getSpacioProduct(entity.value.productId)?.brand ?? ''} | ${getSpacioProduct(entity.value.productId)?.price?.toLocaleString() ?? ''}</p>
              <div className="grid grid-cols-2 gap-2">
                <Field title="X cm"><input type="number" value={entity.value.position.x} onChange={(event) => updateFurnitureTransform(entity.value.id, { position: { ...entity.value.position, x: Number(event.target.value) } })} className={inputClass} /></Field>
                <Field title="Y cm"><input type="number" value={entity.value.position.y} onChange={(event) => updateFurnitureTransform(entity.value.id, { position: { ...entity.value.position, y: Number(event.target.value) } })} className={inputClass} /></Field>
              </div>
              <Field title="Rotation"><input type="range" min="0" max="360" value={entity.value.rotationY} onChange={(event) => updateFurnitureTransform(entity.value.id, { rotationY: Number(event.target.value) })} className="w-full accent-fuchsia-500" /><span className="text-xs text-stone-400">{entity.value.rotationY} degrees</span></Field>
            </>
          ) : null}
          {entity.collection === 'lights' ? (
            <>
              <p className="rounded-lg bg-white/[.04] p-3 text-xs text-stone-300">{entity.value.type} | {entity.value.kelvin} K</p>
              <Field title="Intensity"><input type="number" step="0.1" value={entity.value.intensity} onChange={updateNumber('lights', entity.value.id, 'intensity')} className={inputClass} /></Field>
            </>
          ) : null}
          {entity.collection === 'measurements' ? (
            <p className="rounded-lg bg-white/[.04] p-3 text-xs text-stone-300">{Math.round(distance2D(entity.value.start, entity.value.end))} cm measured distance</p>
          ) : null}
          {(entity.collection === 'walls' || entity.collection === 'rooms') ? <Field title="Material"><select value={entity.value.materialId || entity.value.floorMaterialId} onChange={(event) => updateEntity(entity.collection, entity.value.id, entity.collection === 'rooms' ? { floorMaterialId: event.target.value } : { materialId: event.target.value })} className={inputClass}>{materialOptions.map((material) => <option key={material.id} value={material.id} className="bg-stone-900">{material.name}</option>)}</select></Field> : null}
          <button type="button" onClick={() => { removeSelected(); notify('Selection deleted'); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 py-2.5 text-sm text-red-300 hover:bg-red-500/10"><Trash2 size={14} />Delete</button>
        </div>
      )}
    </aside>
  );
}

export function ProductStrip() {
  const scene = useSceneStore((state) => state.scene);
  const selectObject = useSceneStore((state) => state.selectObject);
  const deleteFurniture = useSceneStore((state) => state.deleteFurniture);
  return (
    <div className="flex h-[72px] shrink-0 items-center gap-2 overflow-x-auto border-t border-white/10 bg-[var(--editor-panel)] px-3">
      <div className="w-20 shrink-0 text-[11px] font-medium text-stone-400">Placed</div>
      {Object.values(scene.furniture).map((item) => {
        const product = getSpacioProduct(item.productId);
        return (
        <button type="button" key={item.id} onClick={() => selectObject(item.id)} className={`group relative flex h-14 w-36 shrink-0 items-center gap-2 rounded-lg border p-1.5 text-left transition ${scene.selectedIds.includes(item.id) ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-white/10 bg-white/[.03] hover:border-white/20'}`}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[#f5f2ec]">
            {product?.thumbnailUrl ? <img src={product.thumbnailUrl} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-black/20"><Box size={16} className="text-stone-500" /></span>}
          </span>
          <span className="min-w-0 line-clamp-2 text-[10px] font-medium text-stone-200">{item.name}</span>
          <span onClick={(event) => { event.stopPropagation(); deleteFurniture(item.id); }} className="absolute right-1 top-1 hidden rounded bg-black/50 p-1 text-stone-300 group-hover:block"><X size={11} /></span>
        </button>
        );
      })}
    </div>
  );
}
