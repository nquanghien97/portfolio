'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectType {
  id: number;
  slug: string;
  titleEn: string;
  titleVi: string;
  overviewEn: string;
  overviewVi: string;
  descriptionEn: string;
  descriptionVi: string;
  thumbnailUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string;
  featured: boolean;
  order: number;
}

interface ProjectsPreviewProps {
  initialProjects?: ProjectType[];
}

const placeholderProjects = [
  {
    slug: 'ecommerce-platform',
    titleEn: 'E-Commerce Platform',
    titleVi: 'Nền tảng Thương mại Điện tử',
    descEn: 'A modern, full-featured e-commerce platform with real-time inventory management.',
    descVi: 'Nền tảng thương mại điện tử hiện đại với quản lý kho hàng thời gian thực.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
    gradient: 'from-blue-600 to-cyan-500',
    thumbnailUrl: '',
  },
  {
    slug: 'saas-dashboard',
    titleEn: 'SaaS Analytics Dashboard',
    titleVi: 'Dashboard Phân tích SaaS',
    descEn: 'Real-time analytics dashboard with interactive charts and data visualization.',
    descVi: 'Dashboard phân tích thời gian thực với biểu đồ tương tác và trực quan hóa dữ liệu.',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    gradient: 'from-violet-600 to-purple-500',
    thumbnailUrl: '',
  },
  {
    slug: 'ai-content-generator',
    titleEn: 'AI Content Generator',
    titleVi: 'Trình tạo nội dung AI',
    descEn: 'An AI-powered tool that generates marketing content, blog posts, and social media copy.',
    descVi: 'Công cụ AI tạo nội dung marketing, bài blog và nội dung mạng xã hội.',
    tags: ['Next.js', 'OpenAI', 'TailwindCSS', 'Vercel'],
    gradient: 'from-emerald-600 to-teal-500',
    thumbnailUrl: '',
  },
];

export function ProjectsPreview({ initialProjects = [] }: ProjectsPreviewProps) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const isVi = locale === 'vi';

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Map database projects or fallback to placeholders
  const displayProjects = initialProjects.length > 0
    ? initialProjects.map((p, i) => {
        const gradients = [
          'from-blue-600 to-cyan-500',
          'from-violet-600 to-purple-500',
          'from-emerald-600 to-teal-500',
          'from-orange-500 to-red-500',
          'from-pink-500 to-rose-500',
          'from-indigo-500 to-blue-500',
        ];
        
        const fallbackDescVi = p.descriptionVi ? p.descriptionVi.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '';
        const fallbackDescEn = p.descriptionEn ? p.descriptionEn.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '';

        return {
          slug: p.slug,
          titleEn: p.titleEn,
          titleVi: p.titleVi,
          descEn: p.overviewEn || fallbackDescEn,
          descVi: p.overviewVi || fallbackDescVi,
          tags: p.tags.split(',').filter(Boolean),
          gradient: gradients[i % gradients.length],
          thumbnailUrl: p.thumbnailUrl,
        };
      })
    : placeholderProjects;

  useGSAP(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const getScrollAmount = () => {
      return -(track.scrollWidth - window.innerWidth);
    };

    gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-surface w-full overflow-hidden"
    >
      <div className="h-screen sticky top-0 flex flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-24">
        
        {/* Mobile/Tablet Header: Fixed at the top, stays visible during pinning */}
        <div className="lg:hidden w-full mb-6 shrink-0">
          <SectionHeader
            label={t('sectionLabel')}
            title={t('sectionTitle')}
            description={t('sectionDescription')}
          />
          <div className="mt-2 flex items-center gap-3 text-accent font-bold text-sm uppercase tracking-wider animate-pulse">
            <span>{isVi ? 'Cuộn tiếp để xem' : 'Scroll to explore'}</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex flex-row items-stretch gap-6 lg:gap-12 whitespace-nowrap min-w-max"
        >
          {/* Slide 1: Desktop Header (Only visible on Desktop lg, slides horizontally) */}
          <div className="hidden lg:flex shrink-0 lg:w-[450px] whitespace-normal flex-col justify-center pr-6 lg:pr-12">
            <SectionHeader
              label={t('sectionLabel')}
              title={t('sectionTitle')}
              description={t('sectionDescription')}
            />
            <div className="mt-4 flex items-center gap-3 text-accent font-bold text-sm uppercase tracking-wider animate-pulse">
              <span>{isVi ? 'Cuộn tiếp để xem' : 'Scroll to explore'}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Slides 2-4: Projects */}
          {displayProjects.map((project, i) => (
            <div
              key={i}
              className="group shrink-0 w-[320px] sm:w-[420px] lg:w-[500px] bg-white rounded-3xl border border-divider overflow-hidden hover:shadow-2xl transition-shadow duration-500 whitespace-normal flex flex-col"
            >
              {/* Thumbnail image or placeholder gradient */}
              <Link
                href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                className="block relative h-48 sm:h-56 md:h-64 overflow-hidden bg-slate-900 shrink-0"
              >
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={isVi ? project.titleVi : project.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-linear-to-br ${project.gradient} flex items-center justify-center`}>
                    <span className="text-white/80 font-black text-6xl uppercase select-none">
                      {project.titleEn[0]}
                    </span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-8 h-8 text-accent" />
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <Link
                    href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
                    className="block group/title mb-3"
                  >
                    <h3 className="text-xl font-bold text-primary uppercase tracking-wide group-hover/title:text-accent transition-colors">
                      {isVi ? project.titleVi : project.titleEn}
                    </h3>
                  </Link>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {isVi ? project.descVi : project.descEn}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-accent/10 text-accent text-[11px] font-semibold rounded-full uppercase tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Slide 5: CTA / Link to all projects */}
          <div className="shrink-0 w-[240px] sm:w-[320px] lg:w-[360px] flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 border-2 border-dashed border-accent/30 rounded-3xl group transition-all duration-300 whitespace-normal p-6 text-center">
            <Link
              href="/projects"
              className="flex flex-col items-center gap-4 text-accent font-bold text-sm sm:text-base uppercase tracking-wider group-hover:gap-6 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
              <span>{t('viewAll')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
