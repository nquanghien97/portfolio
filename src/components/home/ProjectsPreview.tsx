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

const placeholderProjects = [
  {
    slug: 'ecommerce-platform',
    titleEn: 'E-Commerce Platform',
    titleVi: 'Nền tảng Thương mại Điện tử',
    descEn: 'A modern, full-featured e-commerce platform with real-time inventory management.',
    descVi: 'Nền tảng thương mại điện tử hiện đại với quản lý kho hàng thời gian thực.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    slug: 'saas-dashboard',
    titleEn: 'SaaS Analytics Dashboard',
    titleVi: 'Dashboard Phân tích SaaS',
    descEn: 'Real-time analytics dashboard with interactive charts and data visualization.',
    descVi: 'Dashboard phân tích thời gian thực với biểu đồ tương tác và trực quan hóa dữ liệu.',
    tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    gradient: 'from-violet-600 to-purple-500',
  },
  {
    slug: 'ai-content-generator',
    titleEn: 'AI Content Generator',
    titleVi: 'Trình tạo nội dung AI',
    descEn: 'An AI-powered tool that generates marketing content, blog posts, and social media copy.',
    descVi: 'Công cụ AI tạo nội dung marketing, bài blog và nội dung mạng xã hội.',
    tags: ['Next.js', 'OpenAI', 'TailwindCSS', 'Vercel'],
    gradient: 'from-emerald-600 to-teal-500',
  },
];

export function ProjectsPreview() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const isVi = locale === 'vi';

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
      <div className="h-screen sticky top-0 flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-row items-center gap-12 px-12 md:px-24 whitespace-nowrap min-w-max"
        >
          {/* Slide 1: Header */}
          <div className="flex-shrink-0 w-[350px] sm:w-[450px] whitespace-normal flex flex-col justify-center pr-8 sm:pr-12">
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
          {placeholderProjects.map((project, i) => (
            <div
              key={i}
              className="group flex-shrink-0 w-[320px] sm:w-[420px] md:w-[500px] bg-white rounded-3xl border border-divider overflow-hidden hover:shadow-2xl transition-shadow duration-500 whitespace-normal"
            >
              {/* Thumbnail placeholder */}
              <div className={`relative h-48 sm:h-56 md:h-64 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 font-black text-6xl uppercase select-none">
                    {project.titleEn[0]}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-8 h-8 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-primary uppercase tracking-wide mb-3">
                  {isVi ? project.titleVi : project.titleEn}
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  {isVi ? project.descVi : project.descEn}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
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
          <div className="flex-shrink-0 w-[240px] sm:w-[320px] md:w-[360px] aspect-[16/11] flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 border-2 border-dashed border-accent/30 rounded-3xl group transition-all duration-300 whitespace-normal p-6 text-center">
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
