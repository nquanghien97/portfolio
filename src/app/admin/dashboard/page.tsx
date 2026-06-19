'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, FolderOpen, MessageSquare, LogOut } from 'lucide-react';

interface DashboardData {
  projects: number;
  posts: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [projectsRes, postsRes, messagesRes] = await Promise.all([
          fetch('/api/projects', { headers }),
          fetch('/api/blog', { headers }),
          fetch('/api/admin/messages', { headers }),
        ]);

        const projects = await projectsRes.json();
        const posts = await postsRes.json();
        const messages = messagesRes.ok ? await messagesRes.json() : { data: [] };

        setData({
          projects: projects.data?.length || 0,
          posts: posts.data?.length || 0,
          messages: messages.data?.length || 0,
          unreadMessages: messages.data?.filter((m: { read: boolean }) => !m.read).length || 0,
        });
      } catch {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin');
  };

  const stats = [
    { label: 'Projects', value: data?.projects || 0, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Blog Posts', value: data?.posts || 0, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Messages', value: data?.messages || 0, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Unread', value: data?.unreadMessages || 0, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-[#1C304A]">
          {/* Header */}
          <header className="border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-[#7C3AED] flex items-center justify-center">
                  <span className="text-white font-black text-sm">N</span>
                </div>
                <span className="text-white font-bold uppercase tracking-wider">Admin Panel</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#7DD3FC] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                          </div>
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                        <div className="text-white/50 text-sm font-medium">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a href="/admin/projects" className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#7DD3FC]/30 transition-all group">
                    <FolderOpen className="w-6 h-6 text-[#7DD3FC] mb-3" />
                    <h3 className="text-white font-semibold">Manage Projects</h3>
                    <p className="text-white/50 text-sm mt-1">Add, edit, or remove projects</p>
                  </a>
                  <a href="/admin/blog" className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#7DD3FC]/30 transition-all group">
                    <FileText className="w-6 h-6 text-[#7DD3FC] mb-3" />
                    <h3 className="text-white font-semibold">Manage Blog</h3>
                    <p className="text-white/50 text-sm mt-1">Write and publish blog posts</p>
                  </a>
                  <a href="/admin/messages" className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-[#7DD3FC]/30 transition-all group">
                    <MessageSquare className="w-6 h-6 text-[#7DD3FC] mb-3" />
                    <h3 className="text-white font-semibold">Messages</h3>
                    <p className="text-white/50 text-sm mt-1">View contact form messages</p>
                  </a>
                </div>
              </>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
