import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Purple glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(171,0,255,0.08)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(225,0,255,0.06)' }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Big question mark like VOXR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span style={{ fontSize: 80, fontWeight: 800, background: 'linear-gradient(135deg, #ab00ff, #e100ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>?</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-dm font-bold text-4xl md:text-5xl text-white mb-6"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Ready for More<br />Construction-Ready Drawings,<br />
          <span style={{ background: 'linear-gradient(135deg, #ab00ff, #e100ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>and Less Manual Work?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link to="/dashboard" className="btn-voxr" style={{ padding: '10px 10px 10px 28px', fontSize: 17 }}>
            <span style={{ color: '#000', fontWeight: 700 }}>Try it now</span>
            <div className="btn-voxr-circle" style={{ width: 46, height: 46 }}>
              <ArrowRight size={20} color="white" />
            </div>
            <div className="btn-voxr-glow" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 20 }}
        >
          No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}