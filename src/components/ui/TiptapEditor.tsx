'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[160px] px-4 py-3 text-slate-800 bg-white leading-relaxed overflow-y-auto',
      },
    },
  });

  // Sync value from outside (like database load or translation autofill)
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      // Prevent infinite cursor jumping by only updating when content is actually different
      const currentHTML = editor.getHTML();
      if (currentHTML !== value && !(value === '' && currentHTML === '<p></p>')) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border border-slate-200 rounded-xl h-[200px] bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
        Đang khởi tạo trình soạn thảo...
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-primary-light focus-within:ring-1 focus-within:ring-primary-light transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border-b border-slate-200 px-3 py-2 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2.5 py-1.5 rounded text-xs font-bold transition-colors hover:bg-slate-200 ${
            editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="In đậm (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2.5 py-1.5 rounded text-xs italic transition-colors hover:bg-slate-200 ${
            editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2.5 py-1.5 rounded text-xs line-through transition-colors hover:bg-slate-200 ${
            editor.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Gạch ngang"
        >
          S
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1.5 rounded text-xs font-extrabold transition-colors hover:bg-slate-200 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Tiêu đề 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2.5 py-1.5 rounded text-xs font-bold transition-colors hover:bg-slate-200 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Tiêu đề 3"
        >
          H3
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2.5 py-1.5 rounded text-xs transition-colors hover:bg-slate-200 ${
            editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Danh sách dấu chấm"
        >
          • Danh sách
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2.5 py-1.5 rounded text-xs transition-colors hover:bg-slate-200 ${
            editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Danh sách số"
        >
          1. Danh sách
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2.5 py-1.5 rounded text-xs transition-colors hover:bg-slate-200 ${
            editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'
          }`}
          title="Trích dẫn"
        >
          Quote
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2.5 py-1.5 rounded text-xs text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Hoàn tác (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2.5 py-1.5 rounded text-xs text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Làm lại (Ctrl+Y)"
        >
          Redo
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
