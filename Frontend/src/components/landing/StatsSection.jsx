import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 30, suffix: '%+', label: 'Improvement in qualified leads reaching your closers' },
  { value: 0, suffix: '', label: 'Leads lost to slow follow-up or forgotten tasks', display: '0' },
  { value: 24, suffix: '/7', label: 'Coverage — nights, weekends, holidays — always on' },
  { value: 60, suffix: ' sec', prefix: '<', label: 'Response time to new leads — before interest goes cold' },
];

function CountUp({ target, suffix, prefix = '', display, active }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (display !== undefined) { setCount(target); return; }
    let start = 0;
    const duration = 2000;
    const step = Math.max((target / duration) * 16, 1);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, display]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 relative" style={{ borderTop: '1px solid rgba(171,0,255,0.1)', borderBottom: '1px solid rgba(171,0,255,0.1)' }}>
      {/* Subtle purple glow center */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(171,0,255,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Tag + headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ab00ff' }}>Key Stats</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            The Impact,
          </h2>
          <h2 className="font-dm font-bold text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em', lineHeight: 1.1, background: 'linear-gradient(135deg, #ab00ff, #e100ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Quantified
          </h2>
        </motion.div>

        {/* 4-col stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-dm font-bold text-5xl md:text-6xl mb-3" style={{ background: 'linear-gradient(135deg, #ab00ff, #e100ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <CountUp target={s.value} suffix={s.suffix} prefix={s.prefix || ''} display={s.display} active={inView} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.6 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}