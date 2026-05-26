import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Droplets, BarChart3, Grid3X3, Package, GitBranch } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Technical Drawings',
    desc: 'Precision floor plans, elevations, and sections built to construction standards — ready for permit submission.',
  },
  {
    icon: Droplets,
    title: 'Plumbing Plans',
    desc: 'Detailed supply, drain, and waste layouts with fixture connection diagrams and fixture callouts.',
  },
  {
    icon: BarChart3,
    title: 'Elevations',
    desc: 'Wall-by-wall elevation drawings with tile layouts and fixture positions for every surface.',
  },
  {
    icon: Grid3X3,
    title: 'Tile Layouts',
    desc: 'Calculated tile plans with grout lines, patterns, and material callouts down to the last piece.',
  },
  {
    icon: Package,
    title: 'Product Specs',
    desc: 'Linked specification sheets with dimensions, finishes, and ordering info for every product.',
  },
  {
    icon: GitBranch,
    title: 'Revision Tracking',
    desc: 'Full version history with approval workflows and change documentation for every revision.',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ab00ff' }}>Main features</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-dm font-bold text-4xl md:text-5xl text-white mb-16"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          Power Up Your<br />Pipeline
        </motion.h2>

        {/* 3×2 grid — exact VOXR layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 group cursor-pointer"
                style={{ background: '#0b040d' }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(171,0,255,0.12)', border: '1px solid rgba(171,0,255,0.2)' }}
                >
                  <Icon size={18} style={{ color: '#ab00ff' }} />
                </div>

                <h3 className="font-dm font-semibold text-white mb-2" style={{ fontSize: 16 }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>

                {/* Bottom purple line — grows on hover */}
                <div
                  className="mt-6 h-0.5 rounded-full transition-all duration-300 group-hover:w-12"
                  style={{ background: '#ab00ff', width: 28 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}