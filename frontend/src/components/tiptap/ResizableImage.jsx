import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useRef } from 'react';

// Komponen tampilan gambar di dalam editor: gambar + handle drag di pojok
// kanan-bawah untuk ubah ukuran. Lebar disimpan sebagai inline style pada
// <img> agar ikut ter-render di sisi siswa (dangerouslySetInnerHTML).
function ImageView({ node, updateAttributes, selected }) {
  const wrapRef = useRef(null);

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
      className="relative block leading-none"
      style={{ width: w ? `${w}px` : 'auto', maxWidth: '100%', ...alignStyle }}
      data-drag-handle
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        title={node.attrs.title || ''}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        className={selected ? 'ring-2 ring-[var(--color-brand)] rounded' : 'rounded'}
      />
      {selected && (
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
