'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Save, Search, AlertCircle, FileText, Clock } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  titleVi: string;
  excerptEn: string;
  excerptVi: string;
  contentEn: string;
  contentVi: string;
  thumbnailUrl: string;
  category: string;
  tags: string;
  published: boolean;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  slug: '',
  titleEn: '',
  titleVi: '',
  excerptEn: '',
  excerptVi: '',
  contentEn: '',
  contentVi: '',
  thumbnailUrl: '',
  category: 'general',
  tags: '',
  published: false,
  readingTime: 5,
};

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch('/api/blog', { headers });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      titleEn: post.titleEn,
      titleVi: post.titleVi,
      excerptEn: post.excerptEn || '',
      excerptVi: post.excerptVi || '',
      contentEn: post.contentEn || '',
      contentVi: post.contentVi || '',
      thumbnailUrl: post.thumbnailUrl || '',
      category: post.category || 'general',
      tags: post.tags || '',
      published: post.published,
      readingTime: post.readingTime,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Xóa bài viết thất bại');
      }
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      alert('Đã có lỗi xảy ra');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const url = editingPost 
        ? `/api/blog/${editingPost.id}` 
        : '/api/blog';
      
      const method = editingPost ? 'PUT' : 'POST';

      // Auto generate slug if empty
      const submissionData = { ...formData };
      if (!submissionData.slug) {
        submissionData.slug = submissionData.titleEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts();
      } else {
        setFormError(data.error || 'Lưu bài viết thất bại');
      }
    } catch (error) {
      setFormError('Lỗi kết nối mạng, vui lòng thử lại');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.titleEn.toLowerCase().includes(query) ||
      p.titleVi.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.tags.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
            Quản lý Bài viết
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Tổng số: <span className="text-[#1C304A] font-bold">{posts.length}</span> bài viết blog
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Viết bài mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Main List Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1C304A] rounded-full animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center text-slate-400 text-sm font-medium shadow-sm">
          Không tìm thấy bài viết nào.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <th className="px-6 py-4">Bài viết</th>
                  <th className="px-6 py-4">Danh mục / Đọc</th>
                  <th className="px-6 py-4">Ngày viết</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mt-1 border border-emerald-100">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 max-w-sm line-clamp-1">{post.titleVi}</div>
                          <div className="text-xs text-slate-400 font-semibold max-w-sm line-clamp-1">{post.titleEn}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-semibold">
                        <Clock className="w-3 h-3" /> {post.readingTime} phút
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {post.published ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Đã đăng
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Nháp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal (Drawer style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-3xl h-screen bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                  {editingPost ? 'Sửa bài viết' : 'Viết bài mới'}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Điền các thông tin bài viết bên dưới</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-150 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {formError}
                </div>
              )}

              {/* Title VI & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tiêu đề (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleVi}
                    onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="Ví dụ: Lập trình Next.js"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tiêu đề (Tiếng Anh) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="Ví dụ: Getting Started with Next.js"
                  />
                </div>
              </div>

              {/* Slug, Category, Reading Time */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Slug (Để trống sẽ tự động tạo)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-mono"
                    placeholder="nextjs-guide"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Danh mục</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="tech, life, general"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Thời gian đọc (phút)</label>
                  <input
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value, 10) || 5 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                  />
                </div>
              </div>

              {/* Excerpt VI */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tóm tắt ngắn (Tiếng Việt)</label>
                <textarea
                  rows={2}
                  value={formData.excerptVi}
                  onChange={(e) => setFormData({ ...formData, excerptVi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                  placeholder="Viết mô tả ngắn để hiển thị ở danh sách bài đăng..."
                />
              </div>

              {/* Excerpt EN */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tóm tắt ngắn (Tiếng Anh)</label>
                <textarea
                  rows={2}
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                  placeholder="Write a brief excerpt for English readers..."
                />
              </div>

              {/* Content VI */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Nội dung bài viết (Tiếng Việt)</label>
                <textarea
                  rows={8}
                  value={formData.contentVi}
                  onChange={(e) => setFormData({ ...formData, contentVi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-mono"
                  placeholder="Nội dung bài viết..."
                />
              </div>

              {/* Content EN */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Nội dung bài viết (Tiếng Anh)</label>
                <textarea
                  rows={8}
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-mono"
                  placeholder="Article content..."
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Link ảnh bài viết (Thumbnail URL)</label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                  placeholder="https://example.com/blog-thumb.jpg"
                />
              </div>

              {/* Tags & Published */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tags (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="react, tutorial, architecture"
                  />
                </div>
                <div className="flex items-center gap-2.5 pt-5 select-none">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#1C304A] focus:ring-[#1C304A] cursor-pointer"
                  />
                  <label htmlFor="published" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Xuất bản bài viết
                  </label>
                </div>
              </div>

              {/* Footer Form Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {formLoading ? (
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {formLoading ? 'Đang lưu...' : 'Lưu bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
