'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';
import { Be_Vietnam_Pro } from "next/font/google";

const beVietNam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin';

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (token) {
      if (isLoginPage) {
        router.replace('/admin/dashboard');
      } else {
        setTimeout(() => {
          setAuthorized(true);
        }, 0);
      }
      return;
    }

    if (isLoginPage) {
      setTimeout(() => {
        setAuthorized(false);
      }, 0);
    } else {
      router.replace('/admin');
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    setAuthorized(false);
    localStorage.removeItem('admin_token');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Dự án', href: '/admin/projects', icon: FolderOpen },
    { label: 'Bài viết', href: '/admin/blog', icon: FileText },
    { label: 'Liên hệ', href: '/admin/messages', icon: MessageSquare },
  ];

  let pageTitle = 'Bảng điều khiển';
  if (pathname === '/admin/projects') {
    pageTitle = 'Quản lý Dự án';
  } else if (pathname === '/admin/blog') {
    pageTitle = 'Quản lý Bài viết';
  } else if (pathname === '/admin/messages') {
    pageTitle = 'Hòm thư liên hệ';
  } else if (pathname === '/admin') {
    pageTitle = 'Đăng nhập Admin';
  }

  if (authorized === null) {
    return (
      <html lang="vi">
        <head>
          <title>Đang tải... | Admin Panel</title>
        </head>
        <body className={`${beVietNam.className} bg-gray-100 text-slate-800 min-h-screen`}>
          <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center text-slate-800">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-slate-400 text-xs font-semibold">Đang kiểm tra quyền truy cập...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (isLoginPage) {
    return (
      <html lang="vi">
        <head>
          <title>{`${pageTitle} | Nevin Portfolio`}</title>
        </head>
        <body className={`${beVietNam.className} bg-gray-100 text-slate-800 min-h-screen`}>
          <div className="bg-gray-100 min-h-screen w-full text-slate-800">
            {children}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="vi">
      <head>
        <title>{`${pageTitle} | Admin Panel`}</title>
      </head>
      <body className={`${beVietNam.className} bg-gray-100 text-slate-800 min-h-screen`}>
        <div className="flex min-h-screen flex-col md:flex-row bg-gray-100 text-slate-800 w-full">
          {/* Mobile Top Navbar */}
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 md:hidden sticky top-0 z-45 shadow-sm">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C304A] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-extrabold uppercase tracking-wider text-sm text-[#1C304A]">Admin Panel</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>

          {/* Sidebar Nav - Desktop */}
          <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white p-6 sticky top-0 h-screen shrink-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C304A] to-[#7C3AED] flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-lg">N</span>
              </div>
              <div>
                <span className="font-black uppercase tracking-wider text-sm text-[#1C304A] block">Admin Panel</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nevin Portfolio</span>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-100 text-[#1C304A] border border-slate-200 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1C304A]' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-gray-200 space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Về Website
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </aside>

          {/* Mobile Menu Drawer Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden" onClick={() => setMobileMenuOpen(false)} />
          )}

          {/* Mobile Menu Drawer */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-6 flex flex-col transition-transform duration-300 md:hidden ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C304A] to-[#7C3AED] flex items-center justify-center">
                  <span className="text-white font-black text-sm">N</span>
                </div>
                <span className="font-extrabold uppercase tracking-wider text-sm text-[#1C304A]">Admin Panel</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-100 text-[#1C304A] border border-slate-200 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-gray-200 space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Về Website
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto bg-gray-100 text-slate-800">
            {children}
          </main>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
      </body>
    </html>
  );
}
