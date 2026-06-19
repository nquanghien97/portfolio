'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function AboutPreview() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const stats = gsap.utils.toArray<HTMLElement>('.stat-number');
    stats.forEach((stat) => {
      const targetVal = parseInt(stat.getAttribute('data-target') || '0', 10);
      const obj = { val: 0 };
      
      gsap.to(obj, {
        val: targetVal,
        duration: 2.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        onUpdate: () => {
          stat.innerText = Math.floor(obj.val) + '+';
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-surface py-24 lg:py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Quote side */}
          <div className="flex flex-col justify-center">
            <div className="relative">
              {/* Large decorative quote mark */}
              <div
                className="absolute -left-4 -top-12 lg:-left-16 lg:-top-24 text-primary/10 text-[120px] lg:text-[200px] leading-none pointer-events-none select-none"
                style={{ fontFamily: 'serif' }}
              >
                &ldquo;
              </div>

              <blockquote className="relative z-10">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-primary leading-[1.15] tracking-tight">
                  {t('quote')}
                </p>
              </blockquote>

              <div className="mt-6">
                <p className="text-base font-semibold text-accent">
                  — {t('quoteAuthor')}
                </p>
              </div>
            </div>

            <p className="mt-8 text-text-secondary leading-relaxed text-base">
              {t('description')}
            </p>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all duration-300 group"
              >
                {t('readMore')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stats side */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: 3, label: t('experience') },
              { value: 20, label: t('projects_done') },
              { value: 15, label: t('clients') },
              { value: 10, label: t('technologies') },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-surface-dim rounded-2xl p-6 lg:p-8 border border-divider hover:border-accent/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className="stat-number text-3xl lg:text-4xl font-black gradient-text mb-2"
                  data-target={stat.value}
                >
                  0+
                </div>
                <div className="text-text-secondary text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
