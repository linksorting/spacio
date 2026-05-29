import React, { useRef, useState } from 'react';
import { ImagePlus, Palette, Plus, Type, Upload, X } from 'lucide-react';
import { getSpacioProduct } from '@/data/spacioCatalog';
import { useSceneStore } from '@/store/useSceneStore';

const roomSamples = [
  { id: 'scandi', name: 'Scandinavian Living Room', palette: ['#ecdfcc', '#bd9567', '#53634a'], products: ['moderno-sofa', 'arc-lamp', 'carrara-table', 'woven-rug', 'fiddle-leaf', 'gradient-art'] },
  { id: 'japandi', name: 'Japandi Bedroom', palette: ['#eee5d7', '#80715f', '#bba381'], products: ['vale-armchair', 'globe-pendant', 'sol-side-table', 'linen-curtains', 'ceramic-vase', 'succulent'] },
  { id: 'kitchen', name: 'Modern Kitchen', palette: ['#e4ded5', '#222124', '#ba864e'], products: ['alto-stool', 'globe-pendant', 'stringline-shelf', 'ceramic-vase', 'led-strip', 'fiddle-leaf'] },
];

export function AnalyzeRoom({ notify }) {
  const addFurniture = useSceneStore((state) => state.addFurniture);
  const [active, setActive] = useState(roomSamples[0]);
  const [upload, setUpload] = useState(null);
  const [pins, setPins] = useState([]);
  const inputRef = useRef(null);
  const addPin = (event) => {
    if (!upload) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPins((items) => [...items, { x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100, productId: active.products[items.length % active.products.length] }]);
  };
  return (
    <div className="h-full overflow-y-auto bg-[#f5f0ea] p-7 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold">Analyze Room</h1>
        <p className="mt-1 text-sm text-stone-500">Demo analysis using curated sample rooms.</p>
        <div className="mt-6 flex gap-2">{roomSamples.map((room) => <button type="button" key={room.id} onClick={() => { setActive(room); setUpload(null); setPins([]); }} className={`rounded-full px-4 py-2 text-sm ${active.id === room.id && !upload ? 'bg-stone-900 text-white' : 'border border-stone-200 bg-white text-stone-600'}`}>{room.name}</button>)}</div>
        <div className="mt-6 grid grid-cols-[1fr_286px] gap-6">
          <div onClick={addPin} className="relative min-h-[470px] overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            {upload ? <img src={upload} className="absolute inset-0 h-full w-full object-cover" alt="Uploaded room" /> : (
              <>
                <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${active.palette[0]}, #faf8f4)` }} />
                <div className="absolute bottom-10 left-16 h-28 w-64 rounded-3xl bg-stone-300 shadow-xl" />
                <div className="absolute bottom-8 left-56 h-10 w-28 rounded-full bg-stone-200 shadow-xl" />
                <div className="absolute bottom-10 right-20 h-36 w-16 rounded-full bg-green-800/65" />
              </>
            )}
            {(upload ? pins : active.products.map((productId, index) => ({ productId, x: 17 + index * 12, y: 38 + (index % 3) * 17 }))).map((pin, index) => (
              <button type="button" key={`${pin.productId}-${index}`} onClick={(event) => { event.stopPropagation(); addFurniture(pin.productId); notify(`${getSpacioProduct(pin.productId)?.name ?? pin.productId} added to scene`); }} title={getSpacioProduct(pin.productId)?.name ?? pin.productId} className="absolute flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-fuchsia-600 text-sm font-semibold text-white shadow-lg" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{index + 1}</button>
            ))}
          </div>
          <div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0]; if (!file) return;
              const reader = new FileReader(); reader.onload = () => setUpload(reader.result); reader.readAsDataURL(file);
            }} />
            <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white p-3 text-sm font-medium hover:bg-stone-50"><Upload size={15} />Upload room image</button>
            {upload ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">Automatic detection is coming soon. For now, use sample rooms or manually add pins.</p> : null}
            <h2 className="mb-3 mt-6 text-sm font-semibold">Shop This Room</h2>
            <div className="space-y-2">
              {active.products.map((id) => {
                const product = getSpacioProduct(id);
                return <button type="button" key={id} onClick={() => { addFurniture(id); notify(`${product?.name ?? id} added to scene`); }} className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left hover:border-fuchsia-300"><span className="h-10 w-10 rounded-lg bg-stone-100" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{product?.name ?? id}</span><span className="text-[11px] text-stone-500">${product?.price?.toLocaleString() ?? ''}</span></span><Plus size={14} /></button>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const boardTemplates = {
  'Warm Minimal': [{ type: 'swatch', x: 56, y: 60, width: 112, height: 112, data: { color: '#d8c3a5' } }, { type: 'text', x: 58, y: 190, width: 210, height: 48, data: { text: 'Warm Minimal' } }],
  'Japandi Calm': [{ type: 'swatch', x: 56, y: 60, width: 112, height: 112, data: { color: '#b3a28d' } }, { type: 'text', x: 58, y: 190, width: 210, height: 48, data: { text: 'Japandi Calm' } }],
  'Luxe Contemporary': [{ type: 'swatch', x: 56, y: 60, width: 112, height: 112, data: { color: '#302a2b' } }, { type: 'text', x: 58, y: 190, width: 240, height: 48, data: { text: 'Luxe Contemporary' } }],
};

export function Moodboard({ notify }) {
  const elements = useSceneStore((state) => state.scene.moodboards.primary.elements);
  const add = useSceneStore((state) => state.addMoodboardElement);
  const update = useSceneStore((state) => state.updateMoodboardElement);
  const remove = useSceneStore((state) => state.removeMoodboardElement);
  const [drag, setDrag] = useState(null);
  const create = (type, data) => add({ id: `board_${Date.now()}_${Math.random()}`, type, x: 80 + elements.length * 24, y: 80 + elements.length * 16, width: type === 'text' ? 190 : 130, height: type === 'text' ? 56 : 130, rotation: 0, zIndex: elements.length + 1, data });
  const template = (name) => {
    boardTemplates[name].forEach((item, index) => add({ ...item, id: `template_${Date.now()}_${index}`, rotation: 0, zIndex: elements.length + index + 1 }));
    notify(`${name} moodboard template loaded`);
  };
  return (
    <div className="flex h-full bg-[#f5f0ea] text-stone-900">
      <aside className="w-56 border-r border-stone-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Moodboard</h2>
        <div className="mt-5 space-y-2">
          <button type="button" onClick={() => create('swatch', { color: '#c79767' })} className="flex w-full items-center gap-2 rounded-lg border p-2 text-sm"><Palette size={15} />Add swatch</button>
          <button type="button" onClick={() => create('text', { text: 'Material story' })} className="flex w-full items-center gap-2 rounded-lg border p-2 text-sm"><Type size={15} />Add text</button>
          <button type="button" onClick={() => create('product', { productId: 'moderno-sofa' })} className="flex w-full items-center gap-2 rounded-lg border p-2 text-sm"><ImagePlus size={15} />Add product</button>
        </div>
        <div className="mt-7 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Templates</div>
        <div className="mt-3 space-y-2">{Object.keys(boardTemplates).map((name) => <button type="button" key={name} onClick={() => template(name)} className="block w-full rounded-lg bg-stone-50 p-2 text-left text-xs hover:bg-stone-100">{name}</button>)}</div>
      </aside>
      <div className="flex-1 p-7">
        <div
          className="relative h-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
          onPointerMove={(event) => {
            if (!drag) return;
            const rect = event.currentTarget.getBoundingClientRect();
            update(drag.id, { x: event.clientX - rect.left - drag.offsetX, y: event.clientY - rect.top - drag.offsetY });
          }}
          onPointerUp={() => setDrag(null)}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              onPointerDown={(event) => setDrag({ id: element.id, offsetX: event.nativeEvent.offsetX, offsetY: event.nativeEvent.offsetY })}
              className="absolute cursor-move overflow-hidden rounded-xl border border-stone-200 shadow-sm"
              style={{ left: element.x, top: element.y, width: element.width, height: element.height, transform: `rotate(${element.rotation}deg)`, zIndex: element.zIndex, background: element.type === 'swatch' ? element.data.color : '#fff' }}
            >
              {element.type === 'text' ? <div className="p-4 text-lg font-semibold">{element.data.text}</div> : null}
              {element.type === 'product' ? <div className="flex h-full flex-col items-center justify-center bg-stone-50 text-xs"><div className="mb-2 h-12 w-16 rounded-lg bg-stone-200" />{getSpacioProduct(element.data.productId)?.name ?? element.data.productId}</div> : null}
              <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => remove(element.id)} className="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-stone-600"><X size={12} /></button>
            </div>
          ))}
          {!elements.length ? <div className="flex h-full items-center justify-center text-sm text-stone-400">Add products, swatches and notes to compose a client concept board.</div> : null}
        </div>
      </div>
    </div>
  );
}

