// Daftar kelas standar SMP dengan format Romawi.Angka (contoh: IX.1)
export const DAFTAR_KELAS = [
  'IX.1',
  'IX.2',
  'IX.3',
  'IX.4',
  'IX.5',
  'IX.6',
  'IX.7',
  'IX.8',
  'VIII.1',
  'VIII.2',
  'VIII.3',
  'VIII.4',
  'VIII.5',
  'VII.1',
  'VII.2',
  'VII.3',
  'VII.4',
  'VII.5',
];

export const KELAS_GROUPS = [
  {
    label: 'Kelas IX (Sembilan)',
    options: ['IX.1', 'IX.2', 'IX.3', 'IX.4', 'IX.5', 'IX.6', 'IX.7', 'IX.8'],
  },
  {
    label: 'Kelas VIII (Delapan)',
    options: ['VIII.1', 'VIII.2', 'VIII.3', 'VIII.4', 'VIII.5'],
  },
  {
    label: 'Kelas VII (Tujuh)',
    options: ['VII.1', 'VII.2', 'VII.3', 'VII.4', 'VII.5'],
  },
];

/**
 * Menyeragamkan input kelas seperti "9.1", "9-1", "IX-1", "ix 1", "8.2", "7-3"
 * menjadi format baku "IX.1", "VIII.2", "VII.3".
 */
export function normalizeKelas(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const cleaned = raw.trim().toUpperCase();
  if (!cleaned || cleaned === 'ADMINISTRATOR' || cleaned === 'GURU') return raw.trim();

  // Tangkap pola tingkat (9/IX, 8/VIII, 7/VII) diikuti pemisah (titik, strip, spasi, atau langsung) dan nomor/huruf kelas
  const match = cleaned.match(/^(IX|VIII|VII|9|8|7)[\s.\-_]*([0-9A-Z]+)$/);
  if (match) {
    const tingkatRaw = match[1];
    const sub = match[2];
    const romanMap = {
      '9': 'IX',
      IX: 'IX',
      '8': 'VIII',
      VIII: 'VIII',
      '7': 'VII',
      VII: 'VII',
    };
    const tingkat = romanMap[tingkatRaw] || tingkatRaw;
    return `${tingkat}.${sub}`;
  }

  return cleaned.replace(/[\s\-_]+/g, '.');
}
