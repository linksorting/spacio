import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNewProject } from '@/lib/NewProjectContext';
import {
  FolderOpen, Lightbulb, Image, User, BarChart2,
  Menu, Plus
} from 'lucide-react';

const navItems = [
  { label: 'Projects', icon: FolderOpen, path: '/projects' },
  { label: 'Inspiration', icon: Lightbulb, path: '/inspiration' },
  { label: 'Gallery', icon: Image, path: '/gallery' },
  { label: 'My Account', icon: User, path: '/account' },
  { label: 'Plans & Pricing', icon: BarChart2, path: '/pricing' },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openNewProjectModal } = useNewProject();

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif', background: '#0b040d' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar — Foyr style: dark, narrow */}
      <aside
        className={`
          fixed md:relative z-50 h-full flex flex-col
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: 164, background: '#111', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#ab00ff' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-bold text-white text-sm whitespace-nowrap">
            Designer<span style={{ color: '#ab00ff' }}>Pro</span>
          </span>
        </div>

        {/* New Project button */}
        <div className="px-3 py-3">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openNewProjectModal();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white text-sm font-semibold transition-all"
            style={{ border: '1px solid rgba(171,0,255,0.5)', background: 'rgba(171,0,255,0.08)' }}
          >
            <Plus size={15} style={{ color: '#ab00ff' }} />
            New Project
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                style={{
                  background: active ? 'rgba(171,0,255,0.12)' : 'transparent',
                  color: active ? '#ab00ff' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: services + demo */}
        <div className="px-3 py-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Explore more with</div>
          <a href="#" className="text-sm font-semibold" style={{ color: '#ab00ff' }}>designer services</a>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ab00ff, #e100ff)' }}>
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">D</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Get a FREE</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Demo now</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-12 flex-shrink-0" style={{ background: '#0b040d', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
              En
            </div>
            <button className="px-4 py-1.5 rounded text-sm font-bold text-white" style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
              D
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: '#ffffff' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
