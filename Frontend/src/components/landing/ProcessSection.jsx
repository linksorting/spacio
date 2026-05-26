import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Connect Your Tools',
    desc: 'Upload your sketches, PDFs, or DWG files to Designer Pro. We accept any format from any design tool.',
  },
  {
    num: '02',
    title: 'Define Your Project',
    desc: 'Set your room dimensions, fixture selections, and finish specs. Designer Pro uses them to generate only drawings your contractor needs.',
  },
  {
    num: '03',
    title: 'Build Your Package',
    desc: 'Pick which drawing types to include — floor plan, plumbing, elevations, tile, specs. Customize using built-in templates.',
  },
  {
    num: '04',
    title: 'Review and Approve',
    desc: 'Share the client portal link. Clients review online, leave comments, and approve drawings — no email chains.',
  },
  {
    num: '05',
    title: 'Deliver to Site',
    desc: 'Download construction-ready PDFs or share a direct link with contractors. Every drawing, ready to build from.',
  },
];

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ab00ff' }}>How it Works</span>
        </motion.div>

        {/* Headline + sub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 max-w-xl"
        >
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Your Path from Brief to Live Drawings
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, lineHeight: 1.7 }}>
            Convert rough ideas into construction-ready packages your contractors can actually build from.
          </p>
        </motion.div>

        {/* Two-column: steps list left, visual right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: numbered steps */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(i)}
                className="flex gap-6 py-6 cursor-pointer group"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Number */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-dm transition-all duration-300"
                  style={{
                    background: active === i ? 'rgba(171,0,255,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active === i ? 'rgba(171,0,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: active === i ? '#ab00ff' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {step.num}
                </div>

                <div>
                  <h3
                    className="font-dm font-semibold mb-1 transition-colors duration-300"
                    style={{ fontSize: 16, color: active === i ? '#fff' : 'rgba(255,255,255,0.6)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="transition-all duration-300"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: 'rgba(255,255,255,0.35)',
                      maxHeight: active === i ? 80 : 0,
                      overflow: 'hidden',
                      opacity: active === i ? 1 : 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: visual card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-28"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(30,10,40,0.95) 0%, rgba(15,5,22,0.95) 100%)',
                border: '1px solid rgba(171,0,255,0.15)',
                padding: 32,
                minHeight: 340,
              }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(171,0,255,0.2)', border: '1px solid rgba(171,0,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ab00ff', fontWeight: 700, fontSize: 13 }}>
                  {steps[active].num}
                </div>
                <span style={{ color: '#ddbbf1', fontSize: 14, fontWeight: 500 }}>{steps[active].title}</span>
              </div>

              {/* Progress track */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
                {steps.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActive(i)}
                    style={{
                      flex: 1, height: 3, borderRadius: 2, cursor: 'pointer',
                      background: i <= active ? 'linear-gradient(90deg, #ab00ff, #e100ff)' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>

              {/* Illustration area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Simulated drawing preview */}
                {[
                  { label: 'Floor Plan', width: '80%' },
                  { label: 'Plumbing Layout', width: '60%' },
                  { label: 'Wall Elevations', width: '70%' },
                  { label: 'Tile Schedule', width: '50%' },
                  { label: 'Spec Sheet', width: '65%' },
                ].slice(0, active + 1).map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === active ? '#ab00ff' : 'rgba(171,0,255,0.4)', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: item.width, height: '100%', borderRadius: 3, background: i === 0 ? 'linear-gradient(90deg, #ab00ff, #e100ff)' : 'rgba(171,0,255,0.3)' }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, whiteSpace: 'nowrap' }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Glow */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'radial-gradient(circle at 80% 80%, rgba(171,0,255,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}