import axios from 'axios';
//ngrok http --url=valarie-octadic-arboreally.ngrok-free.dev 5000
const api = axios.create({
  baseURL: 'https://valarie-octadic-arboreally.ngrok-free.dev/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
