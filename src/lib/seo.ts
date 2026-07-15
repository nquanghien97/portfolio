import type { Metadata } from 'next';

type Locale = 'en' | 'vi';

type PageKey = 'home' | 'about' | 'services' | 'projects' | 'blog' | 'contact';
type LocalizedPath = { en: string; vi: string };

const siteName = 'Nevin';
const defaultTitle = 'Nevin | Full-Stack Developer & Designer';
const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
const defaultImage = '/logo.png';

const localizedContent: Record<Locale, Record<PageKey, { title: string; description: string }>> = {
  en: {
    home: {
      title: defaultTitle,
      description:
        'Personal portfolio of Nevin, a full-stack developer and designer building fast, polished, and high-performing web experiences.',
    },
    about: {
      title: 'About Me | Nevin',
      description:
        'Learn more about Nevin, my background, skills, and the way I approach modern web development and design.',
    },
    services: {
      title: 'Services | Nevin',
      description:
        'Explore the web design, development, and optimization services I offer for modern brands and products.',
    },
    projects: {
      title: 'Projects | Nevin',
      description:
        'Browse selected web development projects and case studies that highlight my design and engineering work.',
    },
    blog: {
      title: 'Blog | Nevin',
      description:
        'Read articles and insights about web development, design systems, performance, and modern front-end engineering.',
    },
    contact: {
      title: 'Contact | Nevin',
      description:
        'Get in touch for your next website, product, or redesign project.',
    },
  },
  vi: {
    home: {
      title: defaultTitle,
      description:
        'Portfolio cá nhân của Nevin, một full-stack developer và designer chuyên xây dựng trải nghiệm web nhanh, tinh gọn và hiệu suất cao.',
    },
    about: {
      title: 'Giới thiệu | Nevin',
      description:
        'Tìm hiểu về Nevin, kinh nghiệm, kỹ năng và cách mình tiếp cận phát triển web hiện đại cùng thiết kế sản phẩm.',
    },
    services: {
      title: 'Dịch vụ | Nevin',
      description:
        'Khám phá các dịch vụ thiết kế, phát triển và tối ưu website dành cho thương hiệu và sản phẩm hiện đại.',
    },
    projects: {
      title: 'Dự án | Nevin',
      description:
        'Xem các dự án web và case study tiêu biểu, thể hiện năng lực thiết kế và phát triển của mình.',
    },
    blog: {
      title: 'Bài viết | Nevin',
      description:
        'Đọc các bài viết và chia sẻ về phát triển web, hệ thống thiết kế, tối ưu hiệu năng và front-end hiện đại.',
    },
    contact: {
      title: 'Liên hệ | Nevin',
      description:
        'Liên hệ với mình cho website, sản phẩm hoặc dự án redesign tiếp theo của bạn.',
    },
  },
};

function buildAlternates(pagePath: string, localizedPaths: LocalizedPath) {
  const normalize = (value: string) => (value === '/' ? '' : value);
  const canonicalPath = normalize(pagePath);
  return {
    canonical: canonicalPath,
    languages: {
      en: `/en${normalize(localizedPaths.en)}`,
      vi: `/vi${normalize(localizedPaths.vi)}`,
    },
  };
}

function buildSharedMetadata(title: string, description: string, pagePath: string, localizedPaths: LocalizedPath): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(pagePath, localizedPaths),
    metadataBase,
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: pagePath,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultImage],
    },
  };
}

export function getLocalizedPageMetadata(locale: string, pageKey: PageKey, pagePaths: LocalizedPath): Metadata {
  const normalizedLocale: Locale = locale === 'vi' ? 'vi' : 'en';
  const page = localizedContent[normalizedLocale][pageKey];
  const currentPath = locale === 'vi' ? pagePaths.vi : pagePaths.en;
  const pagePath = `/` + normalizedLocale + (currentPath === '/' ? '' : currentPath);

  return buildSharedMetadata(page.title, page.description, pagePath, pagePaths);
}

export function getLocalizedTitle(locale: string, pageKey: PageKey): string {
  const normalizedLocale: Locale = locale === 'vi' ? 'vi' : 'en';
  return localizedContent[normalizedLocale][pageKey].title;
}
