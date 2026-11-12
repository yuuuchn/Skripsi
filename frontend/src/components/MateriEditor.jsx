import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Heading2, Heading3, List, ImageIcon, Lightbulb,
  AlignLeft, AlignCenter, AlignRight, Link2, Upload, X, Check, AlertCircle,
} from 'lucide-react';
import { CardJenis } from './tiptap/CardJenis';
import { ResizableImage } from './tiptap/ResizableImage';

// Normalisasi link gambar umum (Google Drive, Dropbox, Google imgres) menjadi direct image URL
function normalizeImageUrl(rawUrl) {
  const url = (rawUrl || '').trim();
  if (!url) return '';

  // 1. Google Drive: https://drive.google.com/file/d/FILE_ID/view... atau open?id=FILE_ID atau uc?id=FILE_ID
  const gdriveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveFileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveFileMatch[1]}`;
  }
  const gdriveIdMatch = url.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?.*?id=([a-zA-Z0-9_-]+)/);
  if (gdriveIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveIdMatch[1]}`;
  }

  // 2. Google Images copy link (https://www.google.com/imgres?imgurl=...)
  if (url.includes('google.') && url.includes('imgurl=')) {
    try {
      const parsed = new URL(url);
      const imgurl = parsed.searchParams.get('imgurl');
      if (imgurl) return imgurl;
    } catch {
      // ignore
    }
  }

  // 3. Dropbox share link -> direct raw link
  if (url.includes('dropbox.com/')) {
    return url.replace(/\?dl=0$/, '?raw=1').replace(/www\.dropbox\.com/, 'dl.dropboxusercontent.com');
  }

  return url;
}

// Kompres gambar yang di-upload dari perangkat agar ukuran HTML tetap ringan di database
function compressImageFile(file, maxWidth = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      // Jika SVG atau GIF, langsung pakai tanpa kompresi canvas agar animasi/vektor terjaga
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(dataUrl);
        return;
      }
      const img = new window.Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/webp';
        resolve(canvas.toDataURL(outType, quality));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTab, setImageTab] = useState('url'); // 'url' | 'upload'
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [previewState, setPreviewState] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

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

  const normalizedUrl = normalizeImageUrl(imageUrlInput);

  const openImageModal = () => {
    setImageUrlInput('');
    setPreviewState('idle');
    setUploadError('');
    setImageTab('url');
    setShowImageModal(true);
  };

  const handleInsertUrl = (e) => {
    e?.preventDefault();
    if (!normalizedUrl) return;
    editor.chain().focus().setImage({ src: normalizedUrl }).run();
    setShowImageModal(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Pilih file berformat gambar (PNG, JPG, WEBP, SVG, atau GIF).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 8 MB.');
      return;
    }
    try {
      const dataUrl = await compressImageFile(file);
      editor.chain().focus().setImage({ src: dataUrl, alt: file.name }).run();
      setShowImageModal(false);
    } catch (err) {
      setUploadError(err.message || 'Gagal memproses gambar');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        <Btn onClick={openImageModal} title="Sisip Gambar (Link URL / Upload File)">
          <ImageIcon className="w-4 h-4" />
        </Btn>
      </div>
      <EditorContent editor={editor} className="p-4 md:p-6 max-h-[60vh] overflow-y-auto" />

      {showImageModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                  <ImageIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-[var(--color-text)]">Sisipkan Gambar</h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">Tempel link gambar atau unggah dari perangkat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Pilihan Metode */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/70 mb-4">
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  imageTab === 'url'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" /> Link URL
              </button>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  imageTab === 'upload'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload Perangkat
              </button>
            </div>

            {imageTab === 'url' ? (
              <form onSubmit={handleInsertUrl} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">
                    Alamat URL Gambar
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      setPreviewState(e.target.value.trim() ? 'loading' : 'idle');
                    }}
                    placeholder="https://... atau link Google Drive / /images/router.png"
                    className="form-input w-full text-xs"
                  />
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                    Tips: Klik kanan pada gambar di internet lalu pilih <strong>&quot;Salin Alamat Gambar&quot; (Copy Image Address)</strong>, atau tempel link share Google Drive (pastikan akses publik).
                  </p>
                </div>

                {/* Live Preview Box */}
                {normalizedUrl && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Pratinjau Gambar
                    </div>
                    <img
                      src={normalizedUrl}
                      alt="Pratinjau"
                      referrerPolicy="no-referrer"
                      onLoad={() => setPreviewState('ok')}
                      onError={() => setPreviewState('error')}
                      className={`max-h-40 mx-auto rounded-lg object-contain ${previewState === 'error' ? 'hidden' : 'block'}`}
                    />
                    {previewState === 'error' && (
                      <div className="flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400 text-xs py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Link ini tidak mengarah ke file gambar langsung atau aksesnya terkunci.</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="btn btn-ghost text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!normalizedUrl}
                    className="btn btn-primary text-xs rounded-xl gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Sisipkan
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/70 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    Klik untuk Pilih Gambar dari Laptop / HP
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Mendukung PNG, JPG, WEBP, SVG, GIF (Otomatis dioptimasi)
                  </span>
                </button>

                {uploadError && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="btn btn-ghost text-xs rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
