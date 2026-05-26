import React from 'react';
import { PenTool, Map, Box, Home, FileText } from 'lucide-react';

const SERVICES = [
  { id: 'designs',  label: 'Get Designs Done', price: 'Starting at $99',  icon: PenTool, bg: 'rgba(232,122,90,0.15)', iconColor: '#e87a5a' },
  { id: 'trace',    label: 'Trace Floor Plan', price: 'Starting at $10',  icon: Map,     bg: 'rgba(150,90,200,0.18)', iconColor: '#b07ee8' },
  { id: '3dmodel',  label: 'Custom 3D Model',  price: 'Starting at $25',  icon: Box,     bg: 'rgba(60,90,180,0.2)',   iconColor: '#6a8edb' },
  { id: 'exterior', label: 'Exterior Design',  price: 'Starting at $399', icon: Home,    bg: 'rgba(180,100,60,0.2)',  iconColor: '#d68a5a' },
];

export default function ServicesPanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#1a1a1a' }}>
      <div className="p-3">
        <h3 className="text-sm font-bold mb-1" style={{ color: '#e87a5a' }}>Design Services</h3>
        <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Bring your vision to life quickly with production-ready design support.
        </p>

        {/* Track services banner */}
        <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(255,200,180,0.18), rgba(220,160,210,0.18))', border: '1px solid rgba(232,122,90,0.25)' }}>
          <div className="flex-1">
            <div className="text-[11px] font-semibold text-white leading-snug mb-2">
              Request and Track all your services<br/>in one place
            </div>
            <button className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white transition-all hover:opacity-90" style={{ background: '#1a1a1a' }}>
              Explore Now
            </button>
          </div>
          <FileText size={28} style={{ color: 'rgba(255,255,255,0.5)' }} className="flex-shrink-0" />
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 130 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={20} style={{ color: s.iconColor }} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white leading-tight">{s.label}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.price}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
