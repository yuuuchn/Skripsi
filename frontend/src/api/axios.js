import axios from 'axios';

const api = axios.create({
  baseURL: 'https://15f1-114-10-98-174.ngrok-free.app.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
