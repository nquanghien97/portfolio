import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-primary text-white px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
          {t('notFound')}
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          {t('notFoundDescription')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
        >
          {t('backToHome')}
        </Link>
      </div>
    </section>
  );
}
