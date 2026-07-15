import { getLocale, getTranslations } from 'next-intl/server';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  Code,
  Database,
  Globe,
  Smartphone,
  Cloud,
  GitBranch,
  Zap,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import { getLocalizedPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return getLocalizedPageMetadata(locale, 'about', { en: '/about', vi: '/gioi-thieu' });
}

const expertiseCards = [
  {
    icon: Code,
    titleEn: 'Frontend Engineering',
    titleVi: 'Frontend Engineering',
    descEn: 'I build fast, accessible interfaces with Next.js, React, and a strong attention to interaction details.',
    descVi: 'Mình xây dựng giao diện nhanh, dễ truy cập với Next.js, React và chú trọng đến từng chi tiết tương tác.',
  },
  {
    icon: LayoutGrid,
    titleEn: 'Product Thinking',
    titleVi: 'Tư duy sản phẩm',
    descEn: 'I care about structure, user flow, and how the interface supports real business goals.',
    descVi: 'Mình quan tâm đến cấu trúc, luồng người dùng và cách giao diện hỗ trợ mục tiêu kinh doanh thực tế.',
  },
  {
    icon: ShieldCheck,
    titleEn: 'Reliable Delivery',
    titleVi: 'Triển khai ổn định',
    descEn: 'I aim for clean handoff, consistent design systems, and code that is easy to maintain and scale.',
    descVi: 'Mình ưu tiên bàn giao rõ ràng, hệ thống thiết kế nhất quán và code dễ bảo trì, dễ mở rộng.',
  },
];

const skillGroups = [
  {
    icon: Code,
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
  },
  {
    icon: Database,
    title: 'Backend',
    items: ['Node.js', 'NestJS', 'Prisma', 'REST API'],
  },
  {
    icon: Globe,
    title: 'Web Quality',
    items: ['SEO', 'Performance', 'Accessibility', 'Responsive UI'],
  },
  {
    icon: Cloud,
    title: 'Infrastructure',
    items: ['Docker', 'CI/CD', 'PostgreSQL', 'MongoDB'],
  },
  {
    icon: Smartphone,
    title: 'Multi-platform',
    items: ['Responsive Design', 'React Native', 'Mobile UX', 'PWA'],
  },
  {
    icon: GitBranch,
    title: 'Workflow',
    items: ['Git', 'GitHub', 'Team Collaboration', 'Iteration'],
  },
];

const timeline = [
  {
    year: '2024 - Present',
    titleEn: 'Full-Stack Developer',
    titleVi: 'Full-Stack Developer',
    descEn: 'Building scalable web applications for clients and startups with a focus on performance and clarity.',
    descVi: 'Xây dựng ứng dụng web mở rộng cho khách hàng và startup, tập trung vào hiệu năng và tính rõ ràng.',
  },
  {
    year: '2023 - 2024',
    titleEn: 'Frontend Developer',
    titleVi: 'Frontend Developer',
    descEn: 'Focused on crafting interfaces, design systems, and polished user experiences for production products.',
    descVi: 'Tập trung vào giao diện, hệ thống thiết kế và trải nghiệm người dùng chỉn chu cho sản phẩm thực tế.',
  },
  {
    year: '2021 - 2023',
    titleEn: 'Junior Developer',
    titleVi: 'Junior Developer',
    descEn: 'Started with modern web foundations, learning how to turn ideas into reliable digital products.',
    descVi: 'Bắt đầu với nền tảng web hiện đại, học cách biến ý tưởng thành sản phẩm số đáng tin cậy.',
  },
];

export default async function AboutPage() {
  const [t, locale] = await Promise.all([getTranslations('about'), getLocale()]);
  const isVi = locale === 'vi';

  return (
    <>
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.12),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <SectionHeader
            label={t('sectionLabel')}
            title={t('sectionTitle')}
            description={t('description')}
            dark
          />
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-divider bg-white p-6 sm:p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                  <Zap className="h-3.5 w-3.5" />
                  {isVi ? 'Cách mình làm việc' : 'How I work'}
                </div>
                <p className="text-sm leading-7 text-text-secondary">
                  {isVi
                    ? 'Mình thích xây dựng giao diện rõ ràng, có cấu trúc và đủ linh hoạt để phát triển lâu dài. Ưu tiên của mình là trải nghiệm người dùng, tốc độ tải và tính dễ bảo trì.'
                    : 'I like building interfaces that feel clear, structured, and flexible enough to grow over time. My priorities are user experience, load speed, and maintainability.'}
                </p>
              </div>

              {expertiseCards.map((card) => {
                const Icon = card.icon;
                const title = isVi ? card.titleVi : card.titleEn;
                const desc = isVi ? card.descVi : card.descEn;

                return (
                  <div
                    key={title}
                    className="group rounded-3xl border border-white shadow-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary uppercase tracking-wide">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-3xl border border-divider bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-primary">
                      {isVi ? 'Năng lực chính' : 'Core Stack'}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {isVi
                        ? 'Các nhóm công nghệ mình dùng nhiều nhất khi thiết kế, phát triển và tối ưu sản phẩm web.'
                        : 'The technologies I use most often to design, build, and optimize web products.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skillGroups.map((group) => {
                    const Icon = group.icon;

                    return (
                      <div
                        key={group.title}
                        className="rounded-2xl border border-divider shadow-xl p-5 hover:border-accent/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-accent" />
                          </div>
                          <h4 className="text-sm font-bold text-primary uppercase tracking-wide">
                            {group.title}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center rounded-full border border-divider bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-divider shadow-xl bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-primary">
                      {isVi ? 'Hành trình' : 'Journey'}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {isVi
                        ? 'Một vài cột mốc giúp định hình cách mình làm sản phẩm và phối hợp với khách hàng.'
                        : 'A few milestones that shaped how I build products and work with clients.'}
                    </p>
                  </div>
                </div>

                <div className="relative pl-2 sm:pl-4">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-accent/20" />
                  <div className="space-y-5">
                    {timeline.map((item) => {
                      const title = isVi ? item.titleVi : item.titleEn;
                      const desc = isVi ? item.descVi : item.descEn;

                      return (
                        <article key={item.year} className="relative pl-10">
                          <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-glow" />
                          <div className="rounded-2xl border border-divider bg-white p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                                {item.year}
                              </span>
                              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                                {title}
                              </h4>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-text-secondary">
                              {desc}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
