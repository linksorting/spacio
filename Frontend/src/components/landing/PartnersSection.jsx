import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  'Autodesk', 'Revit', 'SketchUp', 'Houzz Pro', 'CoStar', 'BuildZoom',
];

export default function PartnersSection() {
  return (
    <section className="py-10 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm font-medium mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Partnered with:
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {partners.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-sm font-semibold tracking-wide"
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: '"DM Sans", sans-serif' }}
            >
              {p}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}