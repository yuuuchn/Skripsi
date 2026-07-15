import { Node, mergeAttributes } from '@tiptap/core';

// Node blok custom untuk <div class="card-jenis"> — kotak "Analogi" pada materi.
// Tiptap default membuang div tanpa handler; node ini mempertahankannya saat
// parse (edit materi lama) & render (materi baru).
export const CardJenis = Node.create({
  name: 'cardJenis',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div.card-jenis' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'card-jenis' }), 0];
  },

  addCommands() {
    return {
      insertCardJenis:
        () =>
        ({ commands }) =>
          commands.insertContent(
            '<div class="card-jenis"><h3>🔎 Analogi Sederhana</h3><p>Tulis analogimu di sini...</p></div>'
          ),
    };
  },
});
