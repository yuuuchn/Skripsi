import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Building2, ArrowRight, AlertTriangle, Globe } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ nama: '', username: '', password: '', kelas: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl animate-pulse-soft delay-1000" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-lg animate-float">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Mulai Belajar Jaringan
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed font-medium">
            Daftar untuk mengakses semua materi pembelajaran, menjawab kuis interaktif, dan melacak kemajuan belajarmu secara langsung!
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/30 animate-float-slow">
              <Globe className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--color-text)]">Belajar Jaringan</h1>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-[var(--color-text)] tracking-tight">Buat Akun Baru</h2>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mt-1">Lengkapi data di bawah ini untuk mendaftar</p>
          </div>

          {error && (
            <div className="mt-5 bg-rose-50 border border-rose-200/60 text-rose-600 px-4.5 py-3.5 rounded-2xl text-sm flex items-center gap-3 animate-pulse-soft">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Buat nama pengguna unik"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5 ml-1">Kelas <span className="text-slate-400 font-normal lowercase">(opsional)</span></label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Contoh: IX-A"
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3.5 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/10 mt-2"
            >
              {loading ? (
                <span className="animate-pulse-soft">Membuat akun...</span>
              ) : (
                <>
                  Daftar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm font-semibold text-[var(--color-text-secondary)]">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[var(--color-brand-deep)] hover:underline hover:text-[var(--color-brand)] transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
