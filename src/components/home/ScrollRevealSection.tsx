'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollRevealSection() {
  const t = useTranslations('reveal');
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const statement = t('text');
  const words = statement.split(' ');

  useGSAP(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const spans = textElement.querySelectorAll('.reveal-word');
    
    gsap.fromTo(
      spans,
      {
        color: 'rgba(255, 255, 255, 0.12)',
      },
      {
        color: 'rgba(255, 255, 255, 1)',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative bg-primary py-24 lg:py-32 overflow-hidden flex items-center justify-center border-y border-white/5"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.25),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
        <p
          ref={textRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.3] select-none"
        >
          {words.map((word, idx) => {
            // Check if this is a key highlight word in Vietnamese or English
            const isHighlight =
              word.includes('VISUALS') ||
              word.includes('PERFORMANCE') ||
              word.includes('OPTIMIZED') ||
              word.includes('XUẤT') ||
              word.includes('SẮC') ||
              word.includes('VƯỢT') ||
              word.includes('TRỘI') ||
              word.includes('TỐI') ||
              word.includes('ƯU');

            return (
              <span
                key={idx}
                className={`reveal-word inline-block mr-[0.25em] transition-colors duration-300 ${
                  isHighlight ? 'hover:text-accent-secondary' : ''
                }`}
                style={{
                  color: 'rgba(255, 255, 255, 0.12)',
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
