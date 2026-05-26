import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ── Stagger helpers ── */
const fromBottom = (delay = 0) => ({
  initial: { opacity: 0, y: '1rem' },
  animate: { opacity: 1, y: '0rem' },
  transition: { duration: 0.7, delay, ease: [0.215, 0.61, 0.355, 1] },
});

const fromRight = (delay = 0) => ({
  initial: { opacity: 0, x: '1rem' },
  animate: { opacity: 1, x: '0rem' },
  transition: { duration: 0.7, delay, ease: [0.215, 0.61, 0.355, 1] },
});

/* ── Hero label — exact VOXR glass-label ── */
function HeroLabel({ icon, text, style = {}, delay = 0 }) {
  return (
    <motion.div
      {...fromRight(delay)}
      className="voxr-glass-label"
      style={style}
    >
      <div
        className="hero-label"
        style={{ background: 'rgba(20, 6, 24, 0.85)', gap: 8 }}
      >
        <span style={{ color: '#ab00ff', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ color: '#ddbbf1', fontSize: 14, fontWeight: 400 }}>{text}</span>
        {/* glow bg */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'radial-gradient(circle at 30% 50%, rgba(171,0,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>
    </motion.div>
  );
}

/* ── Purple star/sparkle SVG (VOXR exact) ── */
const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M9.97075 5.57456L10.573 7.24706C11.242 9.10331 12.7038 10.5651 14.56 11.2341L16.2325 11.8363C16.3832 11.8911 16.3832 12.1048 16.2325 12.1588L14.56 12.7611C12.7038 13.4301 11.242 14.8918 10.573 16.7481L9.97075 18.4206C9.916 18.5713 9.70225 18.5713 9.64825 18.4206L9.046 16.7481C8.377 14.8918 6.91525 13.4301 5.059 12.7611L3.3865 12.1588C3.23575 12.1041 3.23575 11.8903 3.3865 11.8363L5.059 11.2341C6.91525 10.5651 8.377 9.10331 9.046 7.24706L9.64825 5.57456C9.70225 5.42306 9.916 5.42306 9.97075 5.57456Z" fill="#AB00FF"/>
    <path d="M17.4993 1.55794L17.8045 2.40469C18.1435 3.34444 18.8838 4.08469 19.8235 4.42369L20.6703 4.72894C20.7468 4.75669 20.7468 4.86469 20.6703 4.89244L19.8235 5.19769C18.8838 5.53669 18.1435 6.27694 17.8045 7.21669L17.4993 8.06344C17.4715 8.13994 17.3635 8.13994 17.3358 8.06344L17.0305 7.21669C16.6915 6.27694 15.9513 5.53669 15.0115 5.19769L14.1648 4.89244C14.0883 4.86469 14.0883 4.75669 14.1648 4.72894L15.0115 4.42369C15.9513 4.08469 16.6915 3.34444 17.0305 2.40469L17.3358 1.55794C17.3635 1.48069 17.4723 1.48069 17.4993 1.55794Z" fill="#AB00FF"/>
    <path d="M17.4993 15.9402L17.8045 16.7869C18.1435 17.7267 18.8838 18.4669 19.8235 18.8059L20.6703 19.1112C20.7468 19.1389 20.7468 19.2469 20.6703 19.2747L19.8235 19.5799C18.8838 19.9189 18.1435 20.6592 17.8045 21.5989L17.4993 22.4457C17.4715 22.5222 17.3635 22.5222 17.3358 22.4457L17.0305 21.5989C16.6915 20.6592 15.9513 19.9189 15.0115 19.5799L14.1648 19.2747C14.0883 19.2469 14.0883 19.1389 14.1648 19.1112L15.0115 18.8059C15.9513 18.4669 16.6915 17.7267 17.0305 16.7869L17.3358 15.9402C17.3635 15.8637 17.4723 15.8637 17.4993 15.9402Z" fill="#AB00FF"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M19.6062 6.40349C20.1313 6.94175 20.1313 7.81426 19.6062 8.35224L10.588 17.5965C10.0629 18.1345 9.21195 18.1345 8.68684 17.5965L4.39383 13.1957C3.86872 12.6577 3.86872 11.7852 4.39383 11.2472C4.91867 10.709 5.76987 10.709 6.29472 11.2472L9.63728 14.6735L17.705 6.40349C18.2301 5.8655 19.0813 5.8655 19.6062 6.40349Z" fill="#AB00FF"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.3875 1.79414C22.3687 1.70977 22.3031 1.64414 22.2234 1.62071C19.4765 0.950394 13.1343 3.34102 9.6984 6.77696C9.08434 7.38633 8.52653 8.04727 8.02966 8.75039C6.97028 8.65664 5.91091 8.73633 5.00622 9.13008C2.45622 10.2504 1.71559 13.1801 1.50466 14.4363C1.46247 14.6801 1.62653 14.9145 1.87497 14.9566L6.09372 14.5113C6.09841 14.8207 6.11716 15.1301 6.14997 15.4348C6.16872 15.6457 6.26715 15.8473 6.41715 15.9973L8.00153 17.577C8.15153 17.727 8.35309 17.8254 8.56403 17.8441C8.86872 17.877 9.17341 17.8957 9.48278 17.9004L9.03278 21.9879C9.00465 22.2363 9.18747 22.4613 9.43591 22.4848C10.814 22.2785 13.7484 21.5379 14.864 18.9879C15.2578 18.0832 15.3375 17.0285 15.2484 15.9738C15.9562 15.477 16.6172 14.9145 17.2265 14.3051C20.6718 10.8785 23.0484 4.67696 22.3875 1.79414ZM16.964 10.2129C16.0875 11.0895 14.6625 11.0941 13.7859 10.2129C12.9047 9.33633 12.9047 7.91133 13.7859 7.03008C14.6625 6.14883 16.0875 6.14883 16.9687 7.03008C17.8453 7.91133 17.8453 9.33633 16.964 10.2129Z" fill="#AB00FF"/>
    <path d="M7.89375 18.7239C7.63594 18.9817 7.22344 19.0802 6.72656 19.1692C5.61094 19.3567 4.62656 18.3958 4.82812 17.2708C4.90313 16.8442 5.13281 16.2442 5.27344 16.1036C5.35313 16.0239 5.35781 15.8927 5.27812 15.813C5.23125 15.7661 5.17031 15.7427 5.10469 15.752C4.48125 15.827 3.9 16.113 3.45938 16.5536C2.35313 17.6598 2.25 21.752 2.25 21.752C2.25 21.752 6.34687 21.6489 7.44844 20.5427C7.89375 20.0974 8.175 19.5208 8.25 18.8927C8.26875 18.7005 8.02969 18.5833 7.89375 18.7239Z" fill="#AB00FF"/>
  </svg>
);

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-start overflow-hidden"
      style={{ background: '#0b040d' }}
    >
      {/* Deep purple atmospheric glow — bottom center like VOXR */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0, left: 0, right: 0, height: '60%',
          background: 'radial-gradient(ellipse 80% 60% at 60% 100%, rgba(171,0,255,0.18) 0%, rgba(80,0,120,0.08) 40%, transparent 70%)',
        }}
      />
      {/* Top subtle glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, right: 0, height: '40%',
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(171,0,255,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-36 pb-20">
        <div className="flex items-start justify-between gap-12">

          {/* LEFT: Headline + body + CTA */}
          <div className="flex flex-col gap-12 max-w-[500px]">
            <div className="flex flex-col gap-6">
              {/* H1 — exact VOXR font size and weight */}
              <motion.h1
                {...fromBottom(0.1)}
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                Construction-Ready Bathroom Drawings.
                <span
                  style={{
                    display: 'inline',
                    background: 'linear-gradient(135deg, #ab00ff 0%, #e100ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                > Delivered Fast.</span>
              </motion.h1>

              {/* Body text */}
              <motion.p
                {...fromBottom(0.25)}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, fontFamily: '"DM Sans", sans-serif' }}
              >
                Technical layouts, plumbing plans, elevations, specifications, and visuals — delivered fast for designers and contractors.
              </motion.p>
            </div>

            {/* CTA button — exact VOXR white pill */}
            <motion.div {...fromBottom(0.38)} style={{ position: 'relative', display: 'inline-block' }}>
              <Link to="/dashboard" className="btn-voxr">
                <span style={{ color: '#000', fontWeight: 600, fontSize: 16, fontFamily: '"DM Sans", sans-serif' }}>
                  Start Project
                </span>
                <div className="btn-voxr-circle">
                  <ArrowRight size={18} color="white" />
                </div>
                <div className="btn-voxr-glow" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Floating hero labels — exact VOXR layout */}
          <div
            className="hidden lg:flex flex-col gap-4 flex-shrink-0"
            style={{ paddingTop: '2rem', alignItems: 'flex-start' }}
          >
            {/* Label 1 — offset right like VOXR */}
            <motion.div
              {...fromRight(0.45)}
              style={{ marginLeft: 40, animation: 'hero-label-float 7s ease-in-out infinite', animationDelay: '0s' }}
            >
              <div className="voxr-glass-label">
                <div className="hero-label">
                  <SparkleIcon />
                  <span style={{ color: '#ddbbf1', fontSize: 14 }}>Your technical drawing assistant</span>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'radial-gradient(circle at 30% 50%, rgba(171,0,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Label 2 — further right */}
            <motion.div
              {...fromRight(0.58)}
              style={{ marginLeft: 160, animation: 'hero-label-float 8s ease-in-out infinite', animationDelay: '1.5s' }}
            >
              <div className="voxr-glass-label">
                <div className="hero-label">
                  <CheckIcon />
                  <span style={{ color: '#ddbbf1', fontSize: 14 }}>Construction-ready packages only</span>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'radial-gradient(circle at 30% 50%, rgba(171,0,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            </motion.div>

            {/* Label 3 — back to left */}
            <motion.div
              {...fromRight(0.71)}
              style={{ marginLeft: 0, animation: 'hero-label-float 9s ease-in-out infinite', animationDelay: '3s' }}
            >
              <div className="voxr-glass-label">
                <div className="hero-label">
                  <RocketIcon />
                  <span style={{ color: '#ddbbf1', fontSize: 14 }}>Reduces site errors by 60%</span>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'radial-gradient(circle at 30% 50%, rgba(171,0,255,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom: 3D visual / hero image area — VOXR has 3D objects here */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          className="relative mt-16 flex justify-center"
          style={{ height: 320 }}
        >
          {/* Glowing platform ring like VOXR */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 60,
            background: 'radial-gradient(ellipse at center, rgba(171,0,255,0.25) 0%, rgba(171,0,255,0.08) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
          }} />

          {/* Floating 3D-like CAD card objects */}
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: '35%',
              top: '10%',
              background: 'linear-gradient(135deg, rgba(40,15,55,0.95) 0%, rgba(20,8,28,0.95) 100%)',
              border: '1px solid rgba(171,0,255,0.25)',
              borderRadius: 20,
              padding: '20px 24px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(171,0,255,0.1)',
              minWidth: 200,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 10, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Drawing Package</div>
            {[
              { label: 'Floor Plan', done: true },
              { label: 'Plumbing', done: true },
              { label: 'Elevations', done: true },
              { label: 'Tile Schedule', done: true },
              { label: 'Spec Sheet', done: false },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 40 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{item.label}</span>
                <span style={{ color: item.done ? '#22c55e' : '#ab00ff', fontSize: 12, fontWeight: 600 }}>{item.done ? '✓' : '●●●'}</span>
              </div>
            ))}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'radial-gradient(circle at 20% 80%, rgba(171,0,255,0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          </motion.div>

          {/* Second floating card */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute',
              right: '25%',
              top: '30%',
              background: 'linear-gradient(135deg, rgba(40,15,55,0.9) 0%, rgba(20,8,28,0.9) 100%)',
              border: '1px solid rgba(171,0,255,0.2)',
              borderRadius: 16,
              padding: '16px 20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(171,0,255,0.08)',
              minWidth: 170,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }}>Client Approved</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>Willow Creek · Master Bath</div>
            <div style={{ color: '#ab00ff', fontSize: 11, marginTop: 4, fontFamily: '"DM Sans", sans-serif' }}>2 revisions · Delivered</div>
          </motion.div>

          {/* Purple orb decorations — exact VOXR */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{
              position: 'absolute', right: '15%', top: '5%',
              width: 60, height: 60, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,160,220,0.7) 0%, rgba(150,100,180,0.3) 60%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 0.8 }}
            style={{
              position: 'absolute', right: '10%', top: '35%',
              width: 40, height: 40, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(180,140,200,0.5) 0%, rgba(130,80,160,0.2) 60%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />
          <motion.div
            animate={{ y: [0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute', right: '5%', top: '15%',
              width: 30, height: 30, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(160,120,185,0.4) 0%, transparent 70%)',
              filter: 'blur(1px)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
