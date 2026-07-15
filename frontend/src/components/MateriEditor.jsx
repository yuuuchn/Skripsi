import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ImageIcon, Lightbulb, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { CardJenis } from './tiptap/CardJenis';
import { ResizableImage } from './tiptap/ResizableImage';

function Btn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand-deep)]'
          : 'text-[var(--color-text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function MateriEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      CardJenis,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: 'prose max-w-none focus:outline-none min-h-[300px]' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sinkron saat value dari luar berubah (mis. pindah dari create ke edit materi lain)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL gambar (mis. /images/router.png):');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  // Alignment pintar: kalau gambar terseleksi → atur rata gambar,
  // selain itu → atur rata teks (paragraf/judul).
  const setAlign = (dir) => {
    if (editor.isActive('image')) {
      editor.chain().focus().updateAttributes('image', { align: dir }).run();
    } else {
      editor.chain().focus().setTextAlign(dir).run();
    }
  };
  const alignActive = (dir) =>
    editor.isActive('image')
      ? editor.getAttributes('image').align === dir || (dir === 'left' && !editor.getAttributes('image').align)
      : editor.isActive({ textAlign: dir });

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-card)]">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--color-border)] bg-slate-50/60 dark:bg-slate-800/40">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Tebal">
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Miring">
          <Italic className="w-4 h-4" />
        </Btn>
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Judul Besar">
          <Heading2 className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Sub Judul">
          <Heading3 className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Daftar Poin">
          <List className="w-4 h-4" />
        </Btn>
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <Btn onClick={() => setAlign('left')} active={alignActive('left')} title="Rata Kiri">
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => setAlign('center')} active={alignActive('center')} title="Rata Tengah">
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn onClick={() => setAlign('right')} active={alignActive('right')} title="Rata Kanan">
          <AlignRight className="w-4 h-4" />
        </Btn>
        <div className="w-px h-5 bg-[var(--color-border)] mx-1" />
        <Btn onClick={() => editor.chain().focus().insertCardJenis().run()} title="Kotak Analogi">
          <Lightbulb className="w-4 h-4" />
        </Btn>
        <Btn onClick={addImage} title="Sisip Gambar">
          <ImageIcon className="w-4 h-4" />
        </Btn>
      </div>
      <EditorContent editor={editor} className="p-4 md:p-6 max-h-[60vh] overflow-y-auto" />
    </div>
  );
}
