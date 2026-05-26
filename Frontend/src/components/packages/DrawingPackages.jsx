import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Eye, CheckCircle, Clock, Zap,
  Layers, Droplets, BarChart3, Grid3X3, Package, List
} from 'lucide-react';

const packageSections = [
  { id: 'floor', icon: Layers, label: 'Floor Plans', pages: 2, status: 'ready', desc: 'Overall layout with dimensions' },
  { id: 'plumbing', icon: Droplets, label: 'Plumbing Layout', pages: 1, status: 'ready', desc: 'Supply, drain & waste diagram' },
  { id: 'elevations', icon: BarChart3, label: 'Wall Elevations', pages: 4, status: 'generating', desc: '4 wall views with fixtures' },
  { id: 'tiles', icon: Grid3X3, label: 'Tile Schedule', pages: 1, status: 'ready', desc: 'Tile layout & quantities' },
  { id: 'specs', icon: Package, label: 'Specification Sheet', pages: 3, status: 'ready', desc: 'Product & material specs' },
  { id: 'notes', icon: List, label: 'Installation Notes', pages: 1, status: 'draft', desc: 'Builder reference notes' },
];

const statusConfig = {
  ready: { class: 'bg-green-500/15 text-green-400', icon: CheckCircle, label: 'Ready' },
  generating: { class: 'bg-yellow-500/15 text-yellow-400', icon: Clock, label: 'Generating...' },
  draft: { class: 'bg-white/8 text-white/40', icon: FileText, label: 'Draft' },
};

export default function DrawingPackages() {
  const [selected, setSelected] = useState('floor');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-space font-bold text-2xl text-white">Drawing Packages</h1>
          <p className="text-white/40 text-sm mt-1">Willow Creek — Master Bath</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-glass flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm">
            <Eye size={15} />
            Preview All
          </button>
          <button
            onClick={handleGenerate}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-dp-black/30 border-t-dp-black rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap size={15} />
                Generate Package
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package sections list */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-4">Package Sections</div>
          {packageSections.map((section, i) => {
            const Icon = section.icon;
            const sc = statusConfig[section.status];
            const StatusIcon = sc.icon;
            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => setSelected(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  selected === section.id
                    ? 'bg-dp-blue/15 border border-dp-blue/25'
                    : 'glass-card hover:border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected === section.id ? 'bg-dp-blue/20' : 'bg-white/5'}`}>
                  <Icon size={15} className={selected === section.id ? 'text-dp-blue' : 'text-white/40'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${selected === section.id ? 'text-white' : 'text-white/70'}`}>{section.label}</div>
                  <div className="text-[10px] text-white/30">{section.pages} page{section.pages > 1 ? 's' : ''}</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.class}`}>
                  <StatusIcon size={9} />
                  {sc.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-2">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Preview header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <div className="text-sm font-semibold text-white">
                  {packageSections.find(s => s.id === selected)?.label}
                </div>
                <div className="text-xs text-white/30 mt-0.5">
                  {packageSections.find(s => s.id === selected)?.desc}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                  <Eye size={12} /> Preview
                </button>
                <button className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-semibold">
                  <Download size={12} /> Download
                </button>
              </div>
            </div>

            {/* Drawing preview area */}
            <div className="relative bg-dp-black min-h-[400px] flex items-center justify-center">
              {/* Grid background */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />

              {/* Mock drawing */}
              <div className="relative w-72 h-72 border border-white/15">
                {selected === 'floor' && (
                  <>
                    <div className="absolute inset-6 border border-dp-blue/30">
                      <div className="absolute top-4 left-4 w-20 h-16 border border-dp-blue/40 bg-dp-blue/5 flex items-center justify-center">
                        <span className="text-[8px] text-dp-blue/50">SHOWER</span>
                      </div>
                      <div className="absolute bottom-4 right-4 w-14 h-20 border border-dp-violet/40 bg-dp-violet/5 flex items-center justify-center">
                        <span className="text-[8px] text-dp-violet/50 rotate-90">BATH</span>
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-14 border border-white/20 bg-white/3 rounded-sm flex items-center justify-center">
                        <span className="text-[7px] text-white/30">WC</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-5 left-0 right-0 text-center text-[8px] text-white/25">3.2m</div>
                    <div className="absolute -right-10 top-0 bottom-0 flex items-center">
                      <span className="text-[8px] text-white/25" style={{ writingMode: 'vertical-rl' }}>2.8m</span>
                    </div>
                  </>
                )}
                {selected === 'plumbing' && (
                  <div className="absolute inset-6">
                    <div className="w-full h-full border border-dashed border-dp-cyan/20">
                      {/* Pipe lines */}
                      <div className="absolute top-8 left-0 right-0 h-px bg-dp-blue/40" />
                      <div className="absolute bottom-8 left-0 right-0 h-px bg-dp-violet/40" />
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-dp-blue/30" />
                      <div className="absolute right-8 top-0 bottom-0 w-px bg-dp-violet/30" />
                      {[{ x: '20%', y: '25%' }, { x: '70%', y: '25%' }, { x: '20%', y: '70%' }].map((pos, i) => (
                        <div key={i} className="absolute w-3 h-3 rounded-full bg-dp-blue/60 -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }} />
                      ))}
                    </div>
                  </div>
                )}
                {(selected === 'tiles') && (
                  <div className="absolute inset-6 grid" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`${i % 7 === 0 || i % 11 === 0 ? 'bg-dp-blue/15' : 'bg-white/3'}`} />
                    ))}
                  </div>
                )}
                {(selected === 'elevations' || selected === 'specs' || selected === 'notes') && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white/20 text-sm mb-2">
                        {packageSections.find(s => s.id === selected)?.icon && React.createElement(packageSections.find(s => s.id === selected).icon, { size: 32, className: 'text-white/15 mx-auto mb-3' })}
                      </div>
                      <div className="text-xs text-white/25">
                        {statusConfig[packageSections.find(s => s.id === selected)?.status]?.label}
                      </div>
                    </div>
                  </div>
                )}

                {/* Watermark */}
                <div className="absolute bottom-2 right-2 text-[7px] text-white/15 font-mono">DESIGNER PRO</div>
              </div>
            </div>

            {/* Page indicator */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-white/5">
              <div className="flex gap-1">
                {Array.from({ length: packageSections.find(s => s.id === selected)?.pages || 1 }).map((_, i) => (
                  <div key={i} className={`w-5 h-1 rounded-full ${i === 0 ? 'bg-dp-blue' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="text-[10px] text-white/25">
                Page 1 of {packageSections.find(s => s.id === selected)?.pages || 1}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
