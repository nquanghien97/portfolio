import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      vi: '/gioi-thieu',
    },
    '/services': {
      en: '/services',
      vi: '/dich-vu',
    },
    '/projects': {
      en: '/projects',
      vi: '/du-an',
    },
    '/projects/[slug]': {
      en: '/projects/[slug]',
      vi: '/du-an/[slug]',
    },
    '/blog': {
      en: '/blog',
      vi: '/bai-viet',
    },
    '/blog/[slug]': {
      en: '/blog/[slug]',
      vi: '/bai-viet/[slug]',
    },
    '/contact': {
      en: '/contact',
      vi: '/lien-he',
    },
  },
});
