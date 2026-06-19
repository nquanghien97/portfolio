import { SectionHeader } from '@/components/ui/SectionHeader';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const t = await getTranslations('blog');

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    posts = [];
  }

  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-violet-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-orange-500 to-red-500',
  ];

  return (
    <>
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

      <section className="bg-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Blog posts coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => {
                const title = isVi ? post.titleVi : post.titleEn;
                const excerpt = isVi ? post.excerptVi : post.excerptEn;

                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl border border-divider overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
                  >
                    <Link href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }} className="block h-44 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative">
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                          <span className="text-white/50 font-black text-5xl">{title[0] || 'B'}</span>
                        </div>
                      )}
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {t('readingTime', { minutes: post.readingTime })}
                        </span>
                      </div>

                      <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase mb-3 self-start">
                        {post.category}
                      </span>

                      <Link href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }} className="block group/title">
                        <h3 className="text-lg font-bold text-primary mb-2 group-hover/title:text-accent transition-colors line-clamp-2 uppercase tracking-wide">
                          {title}
                        </h3>
                      </Link>
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {excerpt}
                      </p>

                      <Link
                        href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                        className="inline-flex items-center gap-1 text-accent font-bold text-xs uppercase tracking-wider group/link hover:gap-2 transition-all mt-auto"
                      >
                        {t('readMore')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
