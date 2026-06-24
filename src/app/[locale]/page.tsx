import { HeroSection } from '@/components/home/HeroSection';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { ProjectsPreview } from '@/components/home/ProjectsPreview';
import { MarqueeBanner } from '@/components/home/MarqueeBanner';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ScrollRevealSection } from '@/components/home/ScrollRevealSection';
import { prisma } from '@/lib/db';

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load projects for homepage:', error);
  }

  const projectsData = projects.map(p => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleVi: p.titleVi,
    overviewEn: p.overviewEn,
    overviewVi: p.overviewVi,
    descriptionEn: p.descriptionEn,
    descriptionVi: p.descriptionVi,
    thumbnailUrl: p.thumbnailUrl,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    tags: p.tags,
    featured: p.featured,
    order: p.order,
  }));

  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <ScrollRevealSection />
      <AboutPreview />
      <ServicesPreview />
      <ProjectsPreview initialProjects={projectsData} />
      <ContactCTA />
    </>
  );
}
