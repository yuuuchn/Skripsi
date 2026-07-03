import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, User, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { IlustrasiJaringan } from '../components/NetworkIllustration';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      navigate(data.user.role === 'guru' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal masuk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50 relative overflow-hidden">
      {/* Decorative Background Blobs for Entire Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-100/30 blur-3xl" />
      </div>

      {/* Left panel — Premium Branding Card Showcase */}
      <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative">
        <div className="absolute inset-8 rounded-3xl gradient-brand overflow-hidden shadow-2xl shadow-indigo-500/10 flex items-center justify-center p-12">
          {/* Decorative gradients in card */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl animate-pulse-soft delay-1000" />
            
            {/* Fine Tech Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative z-10 max-w-md text-center">
            {/* Frosted glass frame for illustration */}
            <div className="p-6 bg-white/5 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-md animate-float mb-8">
              <IlustrasiJaringan />
            </div>
            
            <h2 className="font-display text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Belajar Jaringan Komputer
            </h2>
            <p className="text-white/80 text-sm leading-relaxed font-medium mb-8">
              Media pembelajaran interaktif untuk siswa SMP. Pelajari konsep jaringan komputer dengan cara yang seru, mudah dipahami, dan menyenangkan!
            </p>
            
            {/* Frosted Glass Stats Dock */}
            <div className="flex justify-center gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-xl">
              <div className="text-center">
                <div className="font-display text-2xl font-black text-white">6</div>
                <div className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">Materi</div>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="text-center">
                <div className="font-display text-2xl font-black text-white">32</div>
                <div className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">Soal Kuis</div>
              </div>
              <div className="w-[1px] bg-white/10" />
              <div className="text-center">
                <div className="font-display text-2xl font-black text-white">5</div>
                <div className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">Ilustrasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Aesthetic Card Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md p-8 md:p-10 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100/80 shadow-2xl shadow-slate-100/50 animate-fade-in-up">
          
          {/* Mobile brand (Only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg shadow-indigo-500/20 animate-float-slow">
              <Globe className="w-6.5 h-6.5" />
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--color-text)]">BelajarJaringan</h1>
            <p className="text-[var(--color-text-secondary)] text-xs font-bold uppercase tracking-wider mt-0.5">Media Pembelajaran SMP</p>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-display text-3xl font-black text-[var(--color-text)] tracking-tight">Selamat Datang 👋</h2>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mt-1.5">Silakan masuk untuk mulai belajar jaringan komputer</p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200/50 text-rose-600 px-4.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-pulse-soft">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/15 group hover:scale-[1.01] active:scale-95 transition-all mt-2"
            >
              {loading ? (
                <span className="animate-pulse-soft">Memverifikasi masuk...</span>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-xs font-bold text-[var(--color-text-secondary)]">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[var(--color-brand-deep)] hover:underline hover:text-[var(--color-brand)] transition-colors ml-1">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
