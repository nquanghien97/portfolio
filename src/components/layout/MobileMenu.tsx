'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { X } from 'lucide-react';

const navLinks = [
  { href: '/' as const, key: 'home' },
  { href: '/about' as const, key: 'about' },
  { href: '/services' as const, key: 'services' },
  { href: '/projects' as const, key: 'projects' },
  { href: '/blog' as const, key: 'blog' },
  { href: '/contact' as const, key: 'contact' },
] as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: 'en' | 'vi') => {
    router.replace(pathname as '/', { locale: newLocale });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-lg font-bold uppercase tracking-wider">NEVIN</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={onClose}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-primary hover:bg-gray-50'
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-divider space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchLocale('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold text-center transition-all ${
                  locale === 'en'
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => switchLocale('vi')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold text-center transition-all ${
                  locale === 'vi'
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Tiếng Việt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
