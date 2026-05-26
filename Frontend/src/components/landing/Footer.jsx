import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-dp-blue to-dp-violet flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <span className="font-space font-bold text-white">Designer<span className="text-dp-blue">Pro</span></span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Construction-ready bathroom drawing packages for designers and contractors.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: ['Features', 'Planner', '3D Viewer', 'Packages'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">© 2026 Designer Pro. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built for architects, designers, and contractors.</p>
        </div>
      </div>
    </footer>
  );
}
