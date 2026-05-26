import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cases = [
  {
    tag: 'Residential',
    title: 'Sketch to Construction Package',
    challenge: 'Designers received rough hand-drawn bathroom sketches from clients. Translating these into contractor-ready drawings took 2–3 weeks with multiple revisions and email chains.',
    solution: 'Designer Pro digitizes sketches instantly, auto-generates the full drawing package in under 24 hours, and shares a client portal for fast approval — no email back-and-forth.',
    stats: [
      { value: '3x', label: 'faster drawing delivery' },
      { value: '<24h', label: 'to full package' },
      { value: '0', label: 'lost revisions' },
    ],
    quote: 'Before, creating a full bathroom package took us 2 weeks and 4 revision rounds. Now it takes a day and one call. Our clients are blown away.',
    tags: ['Floor Plans', 'Elevations', 'Client Portal'],
  },
  {
    tag: 'Commercial',
    title: 'Hotel Renovation at Scale',
    challenge: 'A hotel renovation with 40 identical bathrooms required the same drawing set replicated, adapted per room, with contractor-ready specs and site notes for every unit.',
    solution: 'Designer Pro\'s bulk generation created all 40 packages from a single master drawing, auto-adapting dimensions and fixture positions per room type — in one afternoon.',
    stats: [
      { value: '40', label: 'packages generated' },
      { value: '1 day', label: 'turnaround' },
      { value: '60%', label: 'fewer site queries' },
    ],
    quote: 'We would have had a team of three spending a month on this. Designer Pro did it in hours, and every drawing was spot-on.',
    tags: ['Bulk Generation', 'Plumbing', 'Spec Sheets'],
  },
  {
    tag: 'Contractor',
    title: 'Site Errors Eliminated',
    challenge: 'Contractors were working from vague elevation sketches and incomplete tile schedules, causing costly on-site corrections and project delays.',
    solution: 'Designer Pro\'s construction-ready packages include precise tile counts, grout line layouts, fixture rough-in dimensions, and plumbing inlets — nothing left to guesswork.',
    stats: [
      { value: '60%', label: 'reduction in site errors' },
      { value: '100%', label: 'construction-ready' },
      { value: '$0', label: 'in rework costs' },
    ],
    quote: 'The tile schedules alone saved us three days of back-and-forth. The drawings were so accurate we didn\'t have a single query on site.',
    tags: ['Tile Schedules', 'Plumbing Plans', 'Construction Notes'],
  },
  {
    tag: 'Enterprise',
    title: 'Replacing Legacy CAD Workflow',
    challenge: 'A design firm was paying for multiple CAD licenses and a freelance drafter on retainer. Output was slow, inconsistent, and hard to share with clients.',
    solution: 'Designer Pro replaced the entire stack — one platform for drawing generation, client review, revision tracking, and final delivery. No more CAD software or freelancers.',
    stats: [
      { value: '2–3', label: 'tools replaced' },
      { value: '80%', label: 'cost reduction' },
      { value: '5x', label: 'more projects per month' },
    ],
    quote: 'We replaced AutoCAD, our freelance drafter, and our file-sharing system with one tool. It\'s the only platform that actually lives up to the hype.',
    tags: ['Workflow', 'Client Portal', 'All Drawing Types'],
  },
];

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const c = cases[active];

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
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#ab00ff' }}>Case Studies</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-dm font-bold text-4xl md:text-5xl text-white mb-12"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          Drawings that Become<br />Built Projects
        </motion.h2>

        {/* Tab row */}
        <div className="flex flex-wrap gap-2 mb-10">
          {cases.map((cs, i) => (
            <button
              key={cs.tag}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: active === i ? 'rgba(171,0,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active === i ? 'rgba(171,0,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: active === i ? '#ab00ff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {cs.tag}
            </button>
          ))}
        </div>

        {/* Active case */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Left: stats + details */}
            <div>
              {/* Stat chips */}
              <div className="flex flex-wrap gap-4 mb-8">
                {c.stats.map(s => (
                  <div key={s.label}
                    className="rounded-xl px-5 py-3"
                    style={{ background: 'rgba(171,0,255,0.08)', border: '1px solid rgba(171,0,255,0.15)' }}>
                    <div className="font-dm font-bold text-2xl text-white">{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {c.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Challenge / Solution */}
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Challenge:</div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>{c.challenge}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Solution:</div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>{c.solution}</p>
                </div>
              </div>

              <button className="flex items-center gap-2 mt-8 text-sm font-semibold" style={{ color: '#ab00ff' }}>
                View details <ArrowRight size={14} />
              </button>
            </div>

            {/* Right: quote card */}
            <div className="flex flex-col justify-center">
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(30,8,42,0.95) 0%, rgba(15,4,22,0.95) 100%)', border: '1px solid rgba(171,0,255,0.15)' }}
              >
                {/* Big quote mark */}
                <div style={{ fontSize: 80, lineHeight: 1, color: 'rgba(171,0,255,0.15)', fontFamily: 'Georgia, serif', marginBottom: -20, marginTop: -10 }}>"</div>
                <p className="font-dm text-white mb-6" style={{ fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>
                  {c.quote}
                </p>
                {/* Author placeholder */}
                <div className="flex items-center gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #ab00ff, #e100ff)' }} />
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>Client Review</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{c.tag} Project</div>
                  </div>
                </div>
                {/* Glow */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'radial-gradient(circle at 10% 90%, rgba(171,0,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}