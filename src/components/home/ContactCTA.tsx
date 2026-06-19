'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export function ContactCTA() {
  const t = useTranslations('contact');

  return (
    <section className="relative bg-primary py-24 lg:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(125,211,252,0.15),transparent_60%)]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-6">
          {t('sectionTitle')}
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('sectionDescription')}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow-lg hover:scale-105 transition-all duration-300 group"
        >
          {t('form.submit')}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
