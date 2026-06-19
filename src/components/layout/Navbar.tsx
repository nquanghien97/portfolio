'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

const navLinks = [
  { href: '/' as const, key: 'home' },
  { href: '/about' as const, key: 'about' },
  { href: '/services' as const, key: 'services' },
  { href: '/projects' as const, key: 'projects' },
  { href: '/blog' as const, key: 'blog' },
] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: 'en' | 'vi') => {
    router.replace(pathname as '/', { locale: newLocale });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
              isScrolled
                ? 'glassmorphism-light shadow-lg'
                : 'bg-transparent'
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">N</span>
              </div>
              <span
                className={`text-xl font-bold uppercase tracking-wider transition-colors ${
                  isScrolled ? 'text-primary' : 'text-white'
                }`}
              >
                NEVIN
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? isScrolled
                          ? 'text-accent bg-accent/10'
                          : 'text-sky-300'
                        : isScrolled
                        ? 'text-text-primary hover:text-accent'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {t(link.key)}
                    {isActive && (
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full ${isScrolled ? 'bg-accent' : 'bg-sky-300'}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden lg:flex items-center gap-1 text-sm">
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-2 py-1 rounded font-semibold transition-all ${
                    locale === 'en'
                      ? 'bg-accent text-white'
                      : isScrolled
                      ? 'text-text-secondary hover:text-accent'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <span className={isScrolled ? 'text-text-secondary' : 'text-white/40'}>/</span>
                <button
                  onClick={() => switchLocale('vi')}
                  className={`px-2 py-1 rounded font-semibold transition-all ${
                    locale === 'vi'
                      ? 'bg-accent text-white'
                      : isScrolled
                      ? 'text-text-secondary hover:text-accent'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  VI
                </button>
              </div>

              {/* Contact CTA */}
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center px-5 py-2.5 bg-accent text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                {t('contact')}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-text-primary hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
