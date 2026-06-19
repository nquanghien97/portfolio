import type { Metadata } from 'next';
import { Tektur } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

const tektur = Tektur({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-tektur',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Nevin',
    default: 'Nevin | Full-Stack Developer & Designer',
  },
  description:
    'Personal portfolio of Nevin — a passionate full-stack developer crafting beautiful, high-performance web experiences.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'vi')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={tektur.variable}>
      <body className="font-tektur antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
