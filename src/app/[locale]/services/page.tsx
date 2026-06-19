import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Code, Palette, Rocket, Gauge, Server, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const serviceIcons = [Code, Palette, Rocket, Gauge, Server, RefreshCw];

export default function ServicesPage() {
  const t = useTranslations('services');

  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    icon: serviceIcons[i],
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.12),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <SectionHeader
            label={t('sectionLabel')}
            title={t('sectionTitle')}
            description={t('sectionDescription')}
            dark
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl border border-divider p-8 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <span className="absolute top-6 right-6 text-primary/10 text-3xl font-black">
                    0{i + 1}
                  </span>

                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:shadow-glow transition-all duration-500">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  <h3 className="text-xl font-bold text-primary uppercase tracking-wide mb-4">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-text-secondary mb-6">Interested in working together?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300 group"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
