import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

const RESOLUTIONS = [
  { id: 'hd', label: 'HD', credits: 1 },
  { id: '2k', label: '2K', credits: 2 },
  { id: '4k', label: '4K', credits: 3 },
  { id: '12k', label: '12K', credits: 5 },
];

export default function RenderSettingsDialog({ onClose, onRender }) {
  const [resolution, setResolution] = useState('hd');
  const selected = RESOLUTIONS.find(r => r.id === resolution);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="relative w-full max-w-md rounded-xl overflow-hidden" style={{ background: '#1e1218', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <X size={16} />
        </button>

        <div className="px-8 pt-8 pb-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-1" style={{ color: '#e8d4c8' }}>Render Settings</h2>

          {/* Resolution label */}
          <div className="text-center text-sm font-semibold mb-4" style={{ color: '#e87a5a' }}>Resolution</div>

          {/* Resolution options */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {RESOLUTIONS.map(r => (
              <button
                key={r.id}
                onClick={() => setResolution(r.id)}
                className="px-5 py-2 rounded text-sm font-bold transition-all"
                style={{
                  background: resolution === r.id ? '#fff' : 'transparent',
                  color: resolution === r.id ? '#111' : 'rgba(255,255,255,0.6)',
                  border: resolution === r.id ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Credits info */}
          <div className="flex items-center justify-center gap-8 text-sm mb-6">
            <span style={{ color: '#e87a5a' }}>Credits Required Per Render: <span className="font-bold">{selected.credits}</span></span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Available Credits: <span className="font-bold text-white">5</span></span>
          </div>

          {/* Checklist */}
          <div className="rounded-lg px-5 py-4 mb-6 space-y-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <CheckCircle2 size={15} style={{ color: '#4ade80' }} />
              Materials automatically set and materialised
            </div>
            <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <CheckCircle2 size={15} style={{ color: '#4ade80' }} />
              Auto - lighting set
            </div>
            <div className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <span>
                Camera position Warning: Ceiling or Floor is not visible in the current view{' '}
                <button className="font-semibold" style={{ color: '#e87a5a' }}>Resolve</button>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="text-sm font-medium transition-all hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Cancel
            </button>
            <button
              onClick={() => onRender(resolution)}
              className="px-8 py-2.5 rounded-lg text-sm font-bold text-white transition-all"
              style={{ background: '#e87a5a' }}
            >
              Render
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}