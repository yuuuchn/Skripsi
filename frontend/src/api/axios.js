// Supabase API Adapter (Menggantikan backend Express lokal & Ngrok)
import api, { onApiError } from './supabaseApi';

export { onApiError };
export default api;
