import { HeroSection } from '@/components/home/HeroSection';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { ProjectsPreview } from '@/components/home/ProjectsPreview';
import { MarqueeBanner } from '@/components/home/MarqueeBanner';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ScrollRevealSection } from '@/components/home/ScrollRevealSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <ScrollRevealSection />
      <AboutPreview />
      <ServicesPreview />
      <ProjectsPreview />
      <ContactCTA />
    </>
  );
}
