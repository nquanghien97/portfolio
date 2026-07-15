import { ContactPageClient } from '@/components/contact/ContactPageClient';
import { getLocalizedPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return getLocalizedPageMetadata(locale, 'contact', { en: '/contact', vi: '/lien-he' });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
