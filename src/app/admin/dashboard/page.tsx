'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, FolderOpen, MessageSquare, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  projectsCount: number;
  postsCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  recentMessages: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          router.push('/admin');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [projectsRes, postsRes, messagesRes] = await Promise.all([
          fetch('/api/projects', { headers }),
          fetch('/api/blog', { headers }),
          fetch('/api/admin/messages', { headers }),
        ]);

        const projects = await projectsRes.json();
        const posts = await postsRes.json();
        const messages = messagesRes.ok ? await messagesRes.json() : { data: [] };

        const msgList = messages.data || [];
        const unread = msgList.filter((m: { read: boolean }) => !m.read).length;

        setData({
          projectsCount: projects.data?.length || 0,
          postsCount: posts.data?.length || 0,
          messagesCount: msgList.length,
          unreadMessagesCount: unread,
          recentMessages: msgList.slice(0, 3), // Get 3 most recent
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [router]);

  const stats = [
    { label: 'Dự án', value: data?.projectsCount || 0, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
    { label: 'Bài viết', value: data?.postsCount || 0, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
    { label: 'Tin nhắn', value: data?.messagesCount || 0, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200' },
    { label: 'Tin nhắn chưa đọc', value: data?.unreadMessagesCount || 0, icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50', border: 'hover:border-orange-200' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1C304A] rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-semibold">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-800 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
          Dashboard Tổng Quan
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-semibold">Chào mừng bạn trở lại trang quản trị hệ thống.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-sm ${stat.border} group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2.5">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/admin/projects"
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:bg-slate-50/50 hover:border-slate-300 transition-all group flex items-start justify-between shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Quản lý Dự án</h3>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Thêm, sửa, hoặc xóa các dự án của bạn.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all mt-1" />
            </Link>

            <Link
              href="/admin/blog"
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:bg-slate-50/50 hover:border-slate-300 transition-all group flex items-start justify-between shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Quản lý Bài viết</h3>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Viết bài mới và quản lý bài đăng Blog.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all mt-1" />
            </Link>

            <Link
              href="/admin/messages"
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:bg-slate-50/50 hover:border-slate-300 transition-all group flex items-start justify-between shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Hòm thư liên hệ</h3>
                  <p className="text-slate-500 text-xs mt-1 font-medium">Xem tin nhắn liên hệ gửi tới website.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all mt-1" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Tin nhắn mới nhận
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {!data?.recentMessages || data.recentMessages.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center text-slate-400 text-sm font-medium shadow-sm">
                Không có tin nhắn liên hệ nào mới.
              </div>
            ) : (
              data.recentMessages.map((msg: any) => (
                <div
                  key={msg.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-950">{msg.name}</span>
                      <span className="text-xs text-slate-400">({msg.email})</span>
                      {!msg.read && (
                        <span className="px-2 py-0.5 bg-orange-100 border border-orange-200 text-orange-700 text-[9px] font-bold rounded-full uppercase tracking-wider">
                          Chưa đọc
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 font-bold">{msg.subject}</div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-xl font-medium">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
