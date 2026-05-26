import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Zap, BarChart3, ArrowLeftRight, Phone, Layers } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Scale Without Headcount',
    desc: 'Handle multiple projects simultaneously with AI-assisted drawing generation — same team, dramatically more output.',
    impact: 'More output, same headcount.',
  },
  {
    icon: Zap,
    title: 'Deploy in 48 Hours',
    desc: 'Launch your first project in under two days. No CAD training, no 90-day setup, no re-architecture as you grow.',
    impact: 'Time-to-value, not timelines.',
  },
  {
    icon: BarChart3,
    title: 'Revenue-Grade Analytics',
    desc: 'Track project status, revision cycles, and client approval rates — see what converts quotes into signed contracts.',
    impact: 'Outcomes over activity.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Design-First Platform',
    desc: 'Built specifically for bathroom designers and contractors — not a generic CAD tool repurposed for the job.',
    impact: 'One system for every project.',
  },
  {
    icon: Phone,
    title: 'Live Client Portal',
    desc: 'Clients review, comment, and approve drawings online. No email chains, no back-and-forth, no lost attachments.',
    impact: 'Less friction, more approvals.',
  },
  {
    icon: Layers,
    title: 'Smart Drawing Packages',
    desc: 'Auto-generate complete packages — floor plans, plumbing, elevations, tiles, specs — in one click.',
    impact: 'Protects your reputation.',
  },
];

export default function BenefitsSection() {
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
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ab00ff' }}>Our Benefits</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-dm font-bold text-4xl md:text-5xl text-white mb-16"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          Why Choose<br />Designer Pro?
        </motion.h2>

        {/* 3×2 benefit cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.09, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl p-7 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(171,0,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(171,0,255,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(171,0,255,0.1)', border: '1px solid rgba(171,0,255,0.2)' }}>
                  <Icon size={18} style={{ color: '#ab00ff' }} />
                </div>

                <h3 className="font-dm font-semibold text-white mb-2" style={{ fontSize: 16 }}>{b.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>{b.desc}</p>

                {/* Impact line */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.25)' }}>Impact: </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#ab00ff' }}>{b.impact}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}