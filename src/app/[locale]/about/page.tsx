import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Code, Database, Globe, Smartphone, Cloud, GitBranch } from 'lucide-react';

const skills = [
  { name: 'React / Next.js', level: 95, icon: Code },
  { name: 'TypeScript', level: 90, icon: Code },
  { name: 'Node.js / NestJS', level: 85, icon: Database },
  { name: 'PostgreSQL / MongoDB', level: 80, icon: Database },
  { name: 'TailwindCSS / CSS', level: 92, icon: Globe },
  { name: 'Docker / CI/CD', level: 75, icon: Cloud },
  { name: 'React Native', level: 70, icon: Smartphone },
  { name: 'Git / GitHub', level: 90, icon: GitBranch },
];

const timeline = [
  { year: '2024 - Present', titleEn: 'Full-Stack Developer', titleVi: 'Full-Stack Developer', descEn: 'Building scalable web applications for various clients and startups.', descVi: 'Xây dựng ứng dụng web mở rộng cho nhiều khách hàng và startup.' },
  { year: '2023 - 2024', titleEn: 'Frontend Developer', titleVi: 'Frontend Developer', descEn: 'Specialized in React and Next.js development for enterprise clients.', descVi: 'Chuyên phát triển React và Next.js cho khách hàng doanh nghiệp.' },
  { year: '2021 - 2023', titleEn: 'Junior Developer', titleVi: 'Junior Developer', descEn: 'Started my journey in web development, learning modern frameworks.', descVi: 'Bắt đầu hành trình phát triển web, học các framework hiện đại.' },
];

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      {/* Hero */}
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

      {/* Skills */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <h3 className="text-2xl font-bold uppercase tracking-tight text-primary mb-10">
            Tech Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.name} className="flex items-center gap-4 p-4 rounded-xl bg-surface-dim border border-divider hover:border-accent/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-primary">{skill.name}</span>
                      <span className="text-xs font-bold text-accent">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface-dim py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <h3 className="text-2xl font-bold uppercase tracking-tight text-primary mb-10">
            Experience
          </h3>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-accent/20" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-glow" />
                  <div className="bg-white rounded-xl p-6 border border-divider hover:shadow-lg transition-all">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">{item.year}</span>
                    <h4 className="text-lg font-bold text-primary mt-1">{item.titleEn}</h4>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed">{item.descEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
