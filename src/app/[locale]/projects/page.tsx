import { SectionHeader } from '@/components/ui/SectionHeader';
import { prisma } from '@/lib/db';
import { ExternalLink, Code } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const t = await getTranslations('projects');

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  } catch {
    projects = [];
  }

  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-violet-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
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
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">Projects coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => {
                const title = isVi ? project.titleVi : project.titleEn;
                const rawOverview = isVi ? project.overviewVi : project.overviewEn;
                const fallbackDesc = isVi ? project.descriptionVi : project.descriptionEn;
                const overview = rawOverview || fallbackDesc.replace(/<[^>]*>/g, '').substring(0, 150) + (fallbackDesc.length > 150 ? '...' : '');

                return (
                  <div
                    key={project.id}
                    className="group bg-white rounded-2xl border border-divider overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <Link href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }} className="block relative h-48 overflow-hidden bg-slate-900">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                          <span className="text-white/60 font-black text-6xl">
                            {title[0] || 'P'}
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-6">
                      <Link href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }} className="block group/title">
                        <h3 className="text-lg font-bold text-primary uppercase tracking-wide mb-2 group-hover/title:text-accent transition-colors line-clamp-1">
                          {title}
                        </h3>
                      </Link>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
                        {overview}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4 h-14 overflow-hidden content-start">
                        {project.tags.split(',').filter(Boolean).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-accent/10 text-accent text-[11px] font-semibold rounded-full uppercase">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-2 border-t border-divider">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
                            <ExternalLink className="w-3.5 h-3.5" /> {t('liveDemo')}
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent">
                            <Code className="w-3.5 h-3.5" /> {t('sourceCode')}
                          </a>
                        )}
                        <Link href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }} className="ml-auto inline-flex items-center text-xs font-bold text-primary hover:text-accent transition-colors">
                          {isVi ? 'Chi tiết' : 'Details'} &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
