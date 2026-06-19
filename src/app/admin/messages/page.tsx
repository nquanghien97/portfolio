'use client';

import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye, X, Clock, MailOpen, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch('/api/admin/messages', { headers });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Không thể kết nối danh sách tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      
      const newReadStatus = !msg.read;

      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ read: newReadStatus }),
      });

      if (res.ok) {
        // Update local state
        setMessages(messages.map((m) => (m.id === msg.id ? { ...m, read: newReadStatus } : m)));
        if (selectedMessage && selectedMessage.id === msg.id) {
          setSelectedMessage({ ...selectedMessage, read: newReadStatus });
        }
        toast.success(newReadStatus ? 'Đã đánh dấu đã đọc' : 'Đã đánh dấu chưa đọc');
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error);
      toast.error('Lỗi thao tác trạng thái');
    }
  };

  const handleOpenDetail = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);

    // If message is unread, mark it as read automatically
    if (!msg.read) {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ read: true }),
        });

        if (res.ok) {
          setMessages(messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
        }
      } catch (error) {
        console.error('Failed to auto-mark message as read:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này không?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }
        toast.success('Xóa tin nhắn thành công!');
      } else {
        toast.error('Xóa tin nhắn thất bại');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Đã xảy ra lỗi mạng');
    }
  };

  // Filters
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
            Hòm thư liên hệ
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">
            Chưa đọc: <span className="text-orange-600 font-bold">{unreadCount}</span> / Tổng số: {messages.length} tin nhắn
          </p>
        </div>

        {/* Filters Tabs */}
        <div className="flex bg-slate-200/60 border border-slate-300/30 rounded-xl p-1 shrink-0 max-w-xs self-start sm:self-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer relative ${
              filter === 'unread' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              filter === 'read' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Đã đọc
          </button>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1C304A] rounded-full animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-24 text-center text-slate-400 text-sm font-medium shadow-sm">
          Không có tin nhắn liên hệ nào trong danh mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-300 shadow-sm hover:border-slate-350 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                !msg.read ? 'border-blue-200/80 bg-blue-50/10' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{msg.name}</span>
                  <span className="text-xs text-slate-400 font-semibold">({msg.email})</span>
                  
                  {!msg.read ? (
                    <span className="px-2 py-0.5 bg-orange-100 border border-orange-200 text-orange-700 text-[9px] font-bold rounded-full uppercase tracking-wider">
                      Chưa đọc
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                      Đã đọc
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-800 line-clamp-1">{msg.subject}</div>
                <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl leading-relaxed font-medium">{msg.message}</p>
              </div>

              {/* Message Actions & Time */}
              <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0 self-stretch md:self-auto justify-between border-t border-slate-100 md:border-0 pt-3 md:pt-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-450 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(msg.createdAt).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDetail(msg)}
                    title="Đọc tin nhắn"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleRead(msg)}
                    title={msg.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      msg.read
                        ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                    }`}
                  >
                    {msg.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    title="Xóa tin nhắn"
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-650 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message View Detail Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-10 animate-fade-in-up overflow-hidden text-slate-850">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1C304A]" />
                Chi tiết liên hệ
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">Người gửi:</div>
                  <div className="text-slate-800 font-extrabold text-sm">{selectedMessage.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">Email:</div>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#1E3A8A] hover:underline font-bold text-sm block"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="space-y-1 md:col-span-2 border-t border-slate-200/60 pt-2 mt-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider">Thời gian:</div>
                  <div className="text-slate-700 font-semibold">
                    {new Date(selectedMessage.createdAt).toLocaleString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tiêu đề</div>
                <div className="text-sm font-black text-slate-900">{selectedMessage.subject}</div>
              </div>

              {/* Message Body */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Nội dung tin nhắn</div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 font-semibold leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa thư
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRead(selectedMessage)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    selectedMessage.read
                      ? 'bg-orange-50 hover:bg-orange-105 text-orange-600 border-orange-200'
                      : 'bg-emerald-50 hover:bg-emerald-105 text-emerald-600 border-emerald-200'
                  }`}
                >
                  {selectedMessage.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 bg-[#1C304A] hover:bg-[#2B4462] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:scale-[1.01] transition-all"
                >
                  Phản hồi
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
