import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import PartnersSection from '../components/landing/PartnersSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import StatsSection from '../components/landing/StatsSection';
import ProcessSection from '../components/landing/ProcessSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import CaseStudiesSection from '../components/landing/CaseStudiesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen font-dm overflow-x-hidden" style={{ background: '#0b040d' }}>
      {/* Subtle fixed ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-glow" style={{ background: 'rgba(171,0,255,0.04)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-glow" style={{ background: 'rgba(171,0,255,0.03)', animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
        <StatsSection />
        <ProcessSection />
        <BenefitsSection />
        <CaseStudiesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}