import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Calendar, Clock, BookOpen, User, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: 'Article Not Found | Nevin',
    };
  }

  const title = isVi ? post.titleVi : post.titleEn;
  const excerpt = isVi ? post.excerptVi : post.excerptEn;

  return {
    title: `${title} | Nevin Blog`,
    description: excerpt,
    openGraph: {
      title: `${title} | Nevin Blog`,
      description: excerpt,
      images: post.thumbnailUrl ? [{ url: post.thumbnailUrl }] : [],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  
  const t = await getTranslations('blog');

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  const title = isVi ? post.titleVi : post.titleEn;
  const contentHtml = isVi ? post.contentVi : post.contentEn;
  const tagsList = post.tags.split(',').filter(Boolean);

  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-violet-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-orange-500 to-red-500',
  ];
  const gradIndex = post.id % gradients.length;

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('allPosts')}
        </Link>

        {/* Article Meta Header */}
        <header className="space-y-4 mb-8">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight uppercase">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-text-secondary font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              {t('readingTime', { minutes: post.readingTime })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-accent" />
              By Nevin
            </span>
          </div>
        </header>

        {/* Large Media Banner */}
        <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden shadow-lg border border-divider mb-12 bg-slate-900">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradIndex]} flex items-center justify-center`}>
              <span className="text-white/30 font-black text-6xl md:text-8xl uppercase select-none">
                {title[0] || 'B'}
              </span>
            </div>
          )}
        </div>

        {/* Main Body */}
        <article className="bg-white dark:bg-slate-900 border border-divider rounded-3xl p-6 sm:p-12 shadow-sm space-y-8">
          {/* Post Content */}
          <div
            className="prose prose-slate max-w-none dark:prose-invert text-base leading-relaxed text-slate-700 dark:text-slate-300
              prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-h3:text-lg prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-8
              prose-p:mb-5 prose-p:text-justify
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags Footer */}
          {tagsList.length > 0 && (
            <div className="pt-6 border-t border-divider flex items-center gap-3">
              <Tag className="w-4 h-4 text-accent" />
              <div className="flex flex-wrap gap-2">
                {tagsList.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
