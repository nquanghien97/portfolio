'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.hero-animate');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in-up');
        (el as HTMLElement).style.opacity = '1';
      }, 300 + i * 200);
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,211,252,0.15),transparent_70%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <span
          className="hero-animate opacity-0 text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] text-white/80 uppercase mb-4"
        >
          {t('prefix')}
        </span>

        <h1
          className="hero-animate opacity-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-[1.1] tracking-tight drop-shadow-lg max-w-3xl"
        >
          {t('title')}
        </h1>

        <p
          className="hero-animate opacity-0 mt-6 text-sm sm:text-base font-medium text-white/80 leading-relaxed max-w-2xl"
        >
          {t('description')}
        </p>

        <div className="hero-animate opacity-0 mt-10 flex flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            {t('cta_contact')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            {t('cta_explore')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-gentle">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
    </section>
  );
}
