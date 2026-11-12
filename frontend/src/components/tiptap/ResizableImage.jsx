import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Komponen tampilan gambar di dalam editor: gambar + handle drag di pojok
// kanan-bawah untuk ubah ukuran. Lebar disimpan sebagai inline style pada
// <img> agar ikut ter-render di sisi siswa (dangerouslySetInnerHTML).
function ImageView({ node, updateAttributes, selected }) {
  const wrapRef = useRef(null);
  const [loadError, setLoadError] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = wrapRef.current?.querySelector('img')?.offsetWidth || 0;

    const onMove = (ev) => {
      const next = Math.max(60, startW + (ev.clientX - startX));
      updateAttributes({ width: Math.round(next) });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const w = node.attrs.width;
  const align = node.attrs.align || 'left';
  const alignStyle =
    align === 'center'
      ? { marginLeft: 'auto', marginRight: 'auto' }
      : align === 'right'
      ? { marginLeft: 'auto', marginRight: 0 }
      : { marginLeft: 0, marginRight: 'auto' };

  return (
    <NodeViewWrapper
      ref={wrapRef}
      className="relative my-3 leading-none"
      style={{
        width: w ? `${w}px` : 'fit-content',
        maxWidth: '100%',
        display: 'block',
        ...alignStyle,
      }}
      data-drag-handle
    >
      {loadError ? (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border text-rose-600 dark:text-rose-400 text-xs font-medium leading-normal ${
            selected ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-rose-200 dark:border-rose-900/50'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>
            <div className="font-bold">Gambar tidak dapat dimuat</div>
            <div className="text-[11px] opacity-80 break-all">
              Pastikan link adalah URL gambar langsung (.jpg/.png/.webp), bukan link halaman web: {node.attrs.src}
            </div>
          </div>
        </div>
      ) : (
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || ''}
          referrerPolicy="no-referrer"
          onLoad={() => setLoadError(false)}
          onError={() => setLoadError(true)}
          style={{
            width: w ? `${w}px` : 'auto',
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
          className={selected ? 'ring-2 ring-[var(--color-brand)] rounded-lg' : 'rounded-lg'}
        />
      )}
      {selected && !loadError && (
        <span
          onMouseDown={startResize}
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-brand)] border-2 border-white cursor-nwse-resize shadow"
          title="Tarik untuk ubah ukuran"
        />
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      referrerpolicy: {
        default: 'no-referrer',
        parseHTML: (el) => el.getAttribute('referrerpolicy') || 'no-referrer',
        renderHTML: () => ({ referrerpolicy: 'no-referrer' }),
      },
      width: {
        default: null,
        // Baca lebar dari style="width:...px" saat parse materi lama
        parseHTML: (el) => {
          const m = (el.style?.width || '').match(/^(\d+)px$/);
          return m ? parseInt(m[1], 10) : null;
        },
        // Tulis kembali sebagai inline style agar tampil di sisi siswa
        renderHTML: (attrs) =>
          attrs.width ? { style: `width: ${attrs.width}px; max-width: 100%; height: auto;` } : {},
      },
      align: {
        default: 'left',
        parseHTML: (el) => el.getAttribute('data-align') || 'left',
        renderHTML: (attrs) =>
          attrs.align && attrs.align !== 'left' ? { 'data-align': attrs.align } : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
