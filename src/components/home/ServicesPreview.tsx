'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Code, Palette, Rocket, Gauge, Server, RefreshCw, Zap, Monitor, Search, Shield } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}

const serviceIcons = [Code, Palette, Rocket, Gauge, Server, RefreshCw];

export function ServicesPreview() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);

  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    features: [t(`items.${i}.features.0`), t(`items.${i}.features.1`), t(`items.${i}.features.2`)],
    icon: serviceIcons[i],
  }));

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.service-card');
    if (cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 639px)",
      isDesktop: "(min-width: 640px)"
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };
      const yOffset = isMobile ? 12 : 20;

      // Initial setup for stacked cards, progress bars, and text colors
      gsap.set(cards, { transformOrigin: 'top center' });
      cards.forEach((card, index) => {
        const inner = card.querySelector('.card-inner');
        if (index === 0) {
          gsap.set(card, { y: 0, scale: 1, opacity: 1, zIndex: 10, visibility: 'visible' });
          gsap.set(inner, { opacity: 1 });
          gsap.set(`.service-num-0`, { color: '#ffffff' });
          gsap.set(`.service-title-0`, { color: '#ffffff' });
          gsap.set(`.service-progress-0`, { width: '100%' });
        } else {
          if (index === 1) {
            gsap.set(card, { y: yOffset, scale: 0.95, opacity: 0.6, zIndex: 9, visibility: 'visible' });
          } else if (index === 2) {
            gsap.set(card, { y: yOffset * 2, scale: 0.9, opacity: 0.3, zIndex: 8, visibility: 'visible' });
          } else {
            gsap.set(card, { y: yOffset * 3, scale: 0.85, opacity: 0, zIndex: 1, visibility: 'hidden' });
          }
          gsap.set(inner, { opacity: 0 });
          gsap.set(`.service-num-${index}`, { color: 'rgba(255, 255, 255, 0.4)' });
          gsap.set(`.service-title-${index}`, { color: 'rgba(255, 255, 255, 0.4)' });
          gsap.set(`.service-progress-${index}`, { width: '0%' });
        }
      });

      const totalDuration = 20;
      // Snap to the middle of each card's active phase to ensure stability
      const snapPoints = [1.25, 4.75, 8.25, 11.75, 15.25, 18.75].map((time) => time / totalDuration);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.8}`,
          pin: true,
          scrub: 0.3,
          snap: {
            snapTo: snapPoints,
            duration: { min: 0.1, max: 0.3 },
            delay: 0.05,
            ease: 'power1.inOut',
          },
          invalidateOnRefresh: true,
        },
      });

      // Build timeline with active resting phase and transition phase
      for (let i = 0; i < cards.length - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const secondNextCard = cards[i + 2];
        const thirdNextCard = cards[i + 3];

        const transStart = i * 3.5 + 2.5;

        tl.to(currentCard, {
            y: -100,
            opacity: 0,
            scale: 0.9,
            zIndex: 1,
            visibility: 'hidden',
            duration: 1,
            ease: 'none',
          }, transStart)
          .to(currentCard.querySelector('.card-inner'), {
            opacity: 0,
            duration: 0.5,
          }, transStart)
          .to([`.service-num-${i}`, `.service-title-${i}`], {
            color: 'rgba(255, 255, 255, 0.4)',
            duration: 0.5,
          }, transStart)
          
          .to(nextCard, {
            y: 0,
            scale: 1,
            opacity: 1,
            zIndex: 10,
            visibility: 'visible',
            duration: 1,
            ease: 'none',
          }, transStart)
          .to(nextCard.querySelector('.card-inner'), {
            opacity: 1,
            duration: 0.8,
          }, transStart)
          .to([`.service-num-${i + 1}`, `.service-title-${i + 1}`], {
            color: '#ffffff',
            duration: 0.5,
          }, transStart)
          .to(`.service-progress-${i + 1}`, {
            width: '100%',
            duration: 1,
            ease: 'none',
          }, transStart);

          if (secondNextCard) {
            tl.to(secondNextCard, {
              y: yOffset,
              scale: 0.95,
              opacity: 0.6,
              zIndex: 9,
              visibility: 'visible',
              duration: 1,
              ease: 'none',
            }, transStart)
            .to(secondNextCard.querySelector('.card-inner'), {
              opacity: 0,
              duration: 0.5,
            }, transStart);
          }

          if (thirdNextCard) {
            tl.to(thirdNextCard, {
              y: yOffset * 2,
              scale: 0.9,
              opacity: 0.3,
              zIndex: 8,
              visibility: 'visible',
              duration: 1,
              ease: 'none',
            }, transStart)
            .to(thirdNextCard.querySelector('.card-inner'), {
              opacity: 0,
            }, transStart);
          }
        }
        
        // Add a dummy hold at the end of the timeline to make its duration exactly 20
        tl.to({}, { duration: 2.5 }, 17.5);
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-primary w-full overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="h-dvh sticky top-0 flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl w-full flex flex-col gap-6 lg:gap-12 relative z-10">
          
          {/* Main Grid: Info/Stepper on Left, Cards on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-24 items-center relative z-10">
            
            {/* Left Column: Info & Indicators */}
            <div className="flex flex-col justify-center">
              <SectionHeader
                label={t('sectionLabel')}
                title={t('sectionTitle')}
                description={t('sectionDescription')}
                dark
              />

              {/* Stepper progress bars */}
              <div className="hidden lg:flex flex-col gap-4 mt-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 group">
                    <span className={`service-num-${i} font-semibold tracking-wider w-8 transition-colors duration-300`}>
                      0{i + 1}
                    </span>
                    <span className={`service-title-${i} truncate w-1/2 text-left transition-colors duration-300`}>
                      {item.title}
                    </span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`service-progress-${i} w-0 h-full bg-accent`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Stacked Cards */}
            <div className="h-full flex items-end">
              <div className="h-80 sm:h-90 lg:h-105 relative w-full flex items-center justify-center">
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="service-card absolute w-full max-w-105 bg-primary-light border border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col justify-between"
                    style={{
                      height: '100%',
                      zIndex: i === 0 ? 10 : i === 1 ? 9 : i === 2 ? 8 : 1,
                      opacity: i === 0 ? 1 : i === 1 ? 0.6 : i === 2 ? 0.3 : 0,
                      transform: `translateY(${i === 0 ? 0 : i === 1 ? 12 : i === 2 ? 24 : 36}px) scale(${i === 0 ? 1 : i === 1 ? 0.95 : i === 2 ? 0.9 : 0.85})`,
                      visibility: i < 3 ? 'visible' : 'hidden',
                    }}
                  >
                    <div
                      className="card-inner flex flex-col justify-between h-full w-full"
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    >
                      <div>
                        {/* Number */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <span className="text-white/40 text-xs sm:text-sm font-semibold tracking-wider">
                            0{i + 1}
                          </span>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-wide">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Features/Deliverables List */}
                      <div className="border-t border-white/5 pt-3 sm:pt-4">
                        <ul className="flex flex-col gap-1.5 sm:gap-2">
                          {item.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
                              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>

          </div>

          {/* Service Commitments Grid (Horizontal Full-width at the bottom) */}
          <div className="pt-4 lg:pt-6 border-t border-white/10 block">
            <h4 className="text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 lg:mb-4 opacity-50 text-center">
              {t('commitments.title')}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {[0, 1, 2, 3].map((idx) => {
                const icons = [Zap, Monitor, Search, Shield];
                const IconComp = icons[idx];
                return (
                  <div key={idx} className="flex gap-2 lg:gap-3 items-center lg:items-start p-2 lg:p-3 bg-white/5 rounded-xl lg:rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/10 hover:shadow-lg transition-all duration-300">
                    <div className="p-1 lg:p-1.5 bg-accent/20 rounded-lg shrink-0">
                      <IconComp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-sky-400" />
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-[10px] lg:text-xs uppercase tracking-wider">
                        {t(`commitments.items.${idx}.title`)}
                      </h5>
                      <p className="text-white/40 text-xs leading-relaxed hidden lg:block mt-1">
                        {t(`commitments.items.${idx}.desc`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
