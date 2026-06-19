'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectData } from '@/lib/validations';
import { Plus, Pencil, Trash2, X, Save, ExternalLink, Search, AlertCircle, Languages, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(() => import('@/components/ui/TiptapEditor'), { ssr: false });

interface Project {
  id: number;
  slug: string;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  thumbnailUrl: string;
  liveUrl: string;
  githubUrl: string;
  tags: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const emptyForm: z.input<typeof projectSchema> = {
  slug: '',
  titleEn: '',
  titleVi: '',
  descriptionEn: '',
  descriptionVi: '',
  thumbnailUrl: '',
  liveUrl: '',
  githubUrl: '',
  tags: '',
  featured: false,
  order: 0,
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Translation helper
const translateText = async (text: string, from = 'vi', to = 'en') => {
  if (!text) return '';
  // Simple check to strip HTML tags if we want, but Google Translate actually handles HTML nicely
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    );
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data[0].map((x: any) => x[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [translatingTitle, setTranslatingTitle] = useState(false);
  const [translatingDesc, setTranslatingDesc] = useState(false);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: emptyForm,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch('/api/projects', { headers });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Không thể kết nối danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    reset(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      slug: project.slug,
      titleEn: project.titleEn,
      titleVi: project.titleVi,
      descriptionEn: project.descriptionEn,
      descriptionVi: project.descriptionVi,
      thumbnailUrl: project.thumbnailUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      tags: project.tags || '',
      featured: project.featured,
      order: project.order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này không?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success('Xóa dự án thành công!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Xóa dự án thất bại');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Đã xảy ra lỗi mạng');
    }
  };

  const onSubmit = async (data: z.input<typeof projectSchema>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const url = editingProject 
        ? `/api/projects/${editingProject.id}` 
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';

      // Auto generate slug if empty
      const submissionData = { ...data };
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

      const resData = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
        toast.success(editingProject ? 'Cập nhật dự án thành công!' : 'Thêm dự án mới thành công!');
      } else {
        toast.error(resData.error || 'Lưu thông tin thất bại');
      }
    } catch (error) {
      toast.error('Lỗi kết nối mạng, vui lòng thử lại');
      console.error(error);
    }
  };

  // Auto slug generation from Vietnamese title
  const handleAutoSlug = () => {
    const titleVi = watch('titleVi');
    if (!titleVi) {
      toast.warn('Vui lòng nhập Tiêu đề (Tiếng Việt) trước để tạo slug');
      return;
    }
    const slug = titleVi
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese accents
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setValue('slug', slug, { shouldValidate: true });
    toast.info('Tạo slug tự động thành công');
  };

  // Google Translate: Translate Title
  const handleTranslateTitle = async () => {
    const titleVi = watch('titleVi');
    if (!titleVi) {
      toast.warn('Vui lòng nhập Tiêu đề (Tiếng Việt) trước!');
      return;
    }
    setTranslatingTitle(true);
    try {
      const translated = await translateText(titleVi);
      setValue('titleEn', translated, { shouldValidate: true });
      toast.success('Đã dịch tiêu đề sang Tiếng Anh!');
    } catch (error) {
      toast.error('Dịch tự động thất bại. Hãy tự điền thủ công.');
    } finally {
      setTranslatingTitle(false);
    }
  };

  // Google Translate: Translate Description (Rich Text HTML)
  const handleTranslateDescription = async () => {
    const descVi = watch('descriptionVi');
    if (!descVi) {
      toast.warn('Vui lòng nhập nội dung Mô tả (Tiếng Việt) trước!');
      return;
    }
    setTranslatingDesc(true);
    toast.info('Đang gửi bản dịch mô tả chi tiết...');
    try {
      const translated = await translateText(descVi);
      setValue('descriptionEn', translated, { shouldValidate: true });
      toast.success('Đã dịch chi tiết mô tả sang Tiếng Anh!');
    } catch (error) {
      toast.error('Dịch tự động thất bại. Hãy tự điền thủ công.');
    } finally {
      setTranslatingDesc(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.titleEn.toLowerCase().includes(query) ||
      p.titleVi.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.tags.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
            Quản lý Dự án
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Danh sách dự án hoạt động trên Portfolio của bạn
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm dự án mới
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 max-w-md shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề, slug, tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Main List Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1C304A] rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-semibold">Đang tải danh sách...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center text-slate-400 text-sm font-medium shadow-sm">
          Không tìm thấy dự án nào. Nhấp "Thêm dự án mới" để tạo.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <th className="px-6 py-4">Thứ tự / Tiêu đề</th>
                  <th className="px-6 py-4">Slug / Links</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Nổi bật</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-600 border border-slate-200">
                          {project.order}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{project.titleVi}</div>
                          <div className="text-xs text-slate-400 font-semibold">{project.titleEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 font-mono mb-1.5">{project.slug}</div>
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#1E3A8A] transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#1E3A8A] transition-colors"
                            title="GitHub"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tags.split(',').filter(Boolean).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-full uppercase"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="px-2.5 py-0.5 bg-yellow-100 border border-yellow-200 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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

      {/* Edit/Create Drawer (Slide from Right) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Drawer Wrapper */}
          <div className="relative w-full max-w-3xl h-screen bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-hidden text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                  {editingProject ? 'Cập nhật dự án' : 'Tạo dự án mới'}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Điền các thông tin chi tiết của dự án bên dưới
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-150 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Form Validation Global Warning (Optional, errors are shown in place) */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>Vui lòng kiểm tra lại các trường nhập liệu bị lỗi đỏ bên dưới.</span>
                </div>
              )}

              {/* Title VI & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title VI */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Tiêu đề (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    {...register('titleVi')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 text-sm font-medium ${
                      errors.titleVi ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1C304A] focus:ring-[#1C304A]'
                    }`}
                    placeholder="Ví dụ: Website bán hàng"
                  />
                  {errors.titleVi && (
                    <p className="text-red-500 text-[11px] font-semibold">{errors.titleVi.message}</p>
                  )}
                </div>

                {/* Title EN */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Tiêu đề (Tiếng Anh) *
                    </label>
                    <button
                      type="button"
                      onClick={handleTranslateTitle}
                      disabled={translatingTitle}
                      className="text-[10px] font-bold text-primary hover:text-primary-light flex items-center gap-1 cursor-pointer disabled:opacity-50 select-none"
                    >
                      {translatingTitle ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                      Dịch tự động
                    </button>
                  </div>
                  <input
                    type="text"
                    {...register('titleEn')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 text-sm font-medium ${
                      errors.titleEn ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1C304A] focus:ring-[#1C304A]'
                    }`}
                    placeholder="E.g. E-Commerce Website"
                  />
                  {errors.titleEn && (
                    <p className="text-red-500 text-[11px] font-semibold">{errors.titleEn.message}</p>
                  )}
                </div>
              </div>

              {/* Slug & Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Slug */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Slug *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[10px] font-bold text-primary hover:text-primary-light cursor-pointer select-none"
                    >
                      Tạo tự động từ Tiêu đề Việt
                    </button>
                  </div>
                  <input
                    type="text"
                    {...register('slug')}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 text-sm font-mono ${
                      errors.slug ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1C304A] focus:ring-[#1C304A]'
                    }`}
                    placeholder="website-ban-hang"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-[11px] font-semibold">{errors.slug.message}</p>
                  )}
                </div>

                {/* Order */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    {...register('order', { valueAsNumber: true })}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 text-sm font-medium ${
                      errors.order ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1C304A] focus:ring-[#1C304A]'
                    }`}
                  />
                  {errors.order && (
                    <p className="text-red-500 text-[11px] font-semibold">{errors.order.message}</p>
                  )}
                </div>
              </div>

              {/* Detailed Description VI (Tiptap Editor) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Mô tả chi tiết (Tiếng Việt) *
                </label>
                <Controller
                  name="descriptionVi"
                  control={control}
                  render={({ field }) => (
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập mô tả chi tiết bằng tiếng Việt..."
                    />
                  )}
                />
                {errors.descriptionVi && (
                  <p className="text-red-500 text-[11px] font-semibold">{errors.descriptionVi.message}</p>
                )}
              </div>

              {/* Detailed Description EN (Tiptap Editor) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Mô tả chi tiết (Tiếng Anh) *
                  </label>
                  <button
                    type="button"
                    onClick={handleTranslateDescription}
                    disabled={translatingDesc}
                    className="text-[10px] font-bold text-primary hover:text-primary-light flex items-center gap-1 cursor-pointer disabled:opacity-50 select-none"
                  >
                    {translatingDesc ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                    Dịch tự động mô tả
                  </button>
                </div>
                <Controller
                  name="descriptionEn"
                  control={control}
                  render={({ field }) => (
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập mô tả chi tiết bằng tiếng Anh (hoặc dịch tự động)..."
                    />
                  )}
                />
                {errors.descriptionEn && (
                  <p className="text-red-500 text-[11px] font-semibold">{errors.descriptionEn.message}</p>
                )}
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Ảnh đại diện (Thumbnail URL)
                </label>
                <input
                  type="text"
                  {...register('thumbnailUrl')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                  placeholder="https://example.com/project-thumb.jpg"
                />
              </div>

              {/* Live URL & GitHub URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Live URL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Liên kết Live Demo (URL)
                  </label>
                  <input
                    type="text"
                    {...register('liveUrl')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="https://example.com"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Liên kết GitHub Repo (URL)
                  </label>
                  <input
                    type="text"
                    {...register('githubUrl')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              {/* Tags & Featured */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Tags */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Thẻ tags (Ngăn cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1C304A] focus:ring-1 focus:ring-[#1C304A] text-sm font-medium"
                    placeholder="React, Next.js, Tailwind, PostgreSQL"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2.5 pt-5 select-none">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="w-4 h-4 rounded border-slate-300 text-[#1C304A] focus:ring-[#1C304A] cursor-pointer"
                  />
                  <label
                    htmlFor="featured"
                    className="text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Dự án nổi bật
                  </label>
                </div>
              </div>

              {/* Footer Save / Cancel Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
