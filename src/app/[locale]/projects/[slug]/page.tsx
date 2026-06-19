import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ExternalLink, Code, Calendar, Globe, Cpu } from 'lucide-react';
import { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return {
      title: 'Project Not Found | Nevin',
    };
  }

  const title = isVi ? project.titleVi : project.titleEn;
  const rawOverview = isVi ? project.overviewVi : project.overviewEn;
  const fallbackDesc = isVi ? project.descriptionVi : project.descriptionEn;
  const description = rawOverview || fallbackDesc.replace(/<[^>]*>/g, '').substring(0, 150);

  return {
    title: `${title} | Nevin Projects`,
    description,
    openGraph: {
      title: `${title} | Nevin Projects`,
      description,
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  
  const t = await getTranslations('projects');

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const title = isVi ? project.titleVi : project.titleEn;
  const descriptionHtml = isVi ? project.descriptionVi : project.descriptionEn;
  const tagsList = project.tags.split(',').filter(Boolean);

  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-violet-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-orange-500 to-red-500',
  ];
  // Stable gradient index based on project ID
  const gradIndex = project.id % gradients.length;

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToProjects')}
        </Link>

        {/* Hero Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">
              {title}
            </h1>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent/10 text-accent text-[11px] font-bold rounded-full uppercase tracking-wider"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links Card (Top right on desktop) */}
          <div className="flex flex-wrap sm:flex-nowrap gap-4 lg:justify-end">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                {t('liveDemo')}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:text-slate-800 font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Code className="w-4 h-4" />
                {t('sourceCode')}
              </a>
            )}
          </div>
        </div>

        {/* Large Media Banner */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/6] rounded-3xl overflow-hidden shadow-lg border border-divider mb-12 bg-slate-900">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradIndex]} flex items-center justify-center`}>
              <span className="text-white/40 font-black text-8xl md:text-[12rem] uppercase select-none">
                {title[0] || 'P'}
              </span>
            </div>
          )}
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-6 bg-white dark:bg-slate-900 border border-divider rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-divider pb-4 mb-6">
              {isVi ? 'Chi tiết dự án' : 'Project details'}
            </h2>
            
            {/* Rich text output from Tiptap */}
            <div
              className="prose prose-slate max-w-none dark:prose-invert text-base leading-relaxed text-slate-700 dark:text-slate-300
                prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-h3:text-lg prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-8
                prose-p:mb-4 prose-p:text-justify
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-1.5
                prose-strong:text-slate-900 dark:prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>

          {/* Project Meta Sidebar */}
          <div className="space-y-6">
            {/* Project Specs */}
            <div className="bg-white dark:bg-slate-900 border border-divider rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-divider pb-3">
                {isVi ? 'Thông tin chung' : 'General info'}
              </h3>
              
              <div className="space-y-4 text-sm font-semibold">
                {/* Tech Stack Spec */}
                <div className="flex gap-3">
                  <Cpu className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider">{t('techStack')}</div>
                    <div className="text-slate-800 dark:text-slate-200 mt-1 flex flex-wrap gap-1.5">
                      {tagsList.map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Spec */}
                <div className="flex gap-3 pt-2">
                  <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider">
                      {isVi ? 'Ngày đăng ký' : 'Published date'}
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 mt-1 font-bold">
                      {new Date(project.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Help */}
            <div className="bg-gradient-to-br from-[#1C304A] to-[#2B4462] text-white rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="text-base font-black uppercase tracking-wider">
                {isVi ? 'Bạn thích dự án này?' : 'Interested in this project?'}
              </h4>
              <p className="text-xs leading-relaxed text-slate-200">
                {isVi
                  ? 'Liên hệ ngay với tôi để cùng trao đổi về ý tưởng phát triển sản phẩm của bạn.'
                  : 'Contact me now to discuss how we can work together on your product ideas.'}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                {isVi ? 'Liên hệ ngay' : 'Get in touch'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
