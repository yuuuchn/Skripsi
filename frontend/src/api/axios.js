import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://valarie-octadic-arboreally.ngrok-free.dev/api',
  // Batas waktu agar permintaan tidak menggantung saat backend/ngrok tidak aktif.
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pendengar error koneksi (didaftarkan oleh ToastContext) supaya pengguna
// mendapat pesan yang jelas ketika server tidak bisa dihubungi.
const errorListeners = new Set();

export function onApiError(handler) {
  errorListeners.add(handler);
  return () => errorListeners.delete(handler);
}

const ERROR_NOTICE_INTERVAL = 6000;
let lastNoticeAt = 0;

function notifyError(message) {
  const now = Date.now();
  if (now - lastNoticeAt < ERROR_NOTICE_INTERVAL) return;
  lastNoticeAt = now;
  errorListeners.forEach((handler) => handler(message));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      notifyError('Server terlalu lama merespons. Periksa koneksi lalu coba lagi.');
    } else if (!error.response) {
      notifyError('Server tidak terhubung. Pastikan backend sedang aktif, lalu coba lagi.');
    } else if (error.response.status >= 500) {
      notifyError('Terjadi gangguan di server. Silakan coba lagi sebentar lagi.');
    }
    return Promise.reject(error);
  }
);

export default api;
