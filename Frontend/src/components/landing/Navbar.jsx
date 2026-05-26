import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0b040d]/90 backdrop-blur-xl border-b border-white/5' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ab00ff] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="font-dm font-bold text-white text-lg tracking-tight">
            Designer<span style={{ color: '#ab00ff' }}>Pro</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'About Us'].map((item) => (
            <a key={item} href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium">
              {item}
            </a>
          ))}
        </nav>

        {/* CTAs — exact VOXR style */}
        <div className="hidden md:flex items-center gap-3">
          {/* Contact us — dark pill */}
          <Link to="/dashboard" className="btn-contact text-sm">
            Contact us
          </Link>
          {/* Login — white pill with purple circle */}
          <Link to="/dashboard" className="btn-voxr text-sm" style={{ padding: '6px 6px 6px 18px', gap: '10px' }}>
            <span style={{ color: '#000', fontWeight: 600 }}>Login</span>
            <div className="btn-voxr-circle" style={{ width: 34, height: 34 }}>
              <ArrowRight size={16} color="white" />
            </div>
            <div className="btn-voxr-glow" />
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-white">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#140818]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3"
        >
          {['Features', 'Pricing', 'About Us'].map((item) => (
            <a key={item} href="#" className="block text-sm text-white/70 hover:text-white py-2">{item}</a>
          ))}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            <Link to="/dashboard" className="btn-voxr justify-center">
              <span>Start Free Trial</span>
              <div className="btn-voxr-circle"><ArrowRight size={16} color="white" /></div>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}