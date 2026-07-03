import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Building2, ArrowRight, AlertTriangle, Globe } from 'lucide-react';

// Premium Aesthetic Registration SVG
function IlustrasiRegisterHero() {
  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-sm mx-auto animate-float-slow" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="130" r="90" fill="url(#registerGlow)" opacity="0.15" />
      
      {/* Center frosted card symbol representing user identity creation */}
      <rect x="145" y="85" width="110" height="90" rx="18" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
      <circle cx="200" cy="115" r="14" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M185 148c0-5 5-8 15-8s15 3 15 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      
      {/* Network branch connection paths */}
      <line x1="200" y1="85" x2="200" y2="60" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="145" y1="130" x2="110" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="255" y1="130" x2="290" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="230" y1="165" x2="260" y2="190" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="170" y1="165" x2="140" y2="190" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />

      {/* Orbiting Node 1: Laptop */}
      <g transform="translate(65, 110)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M13 16h14v8H13v-8Zm-2 9h18v1.5H11V25Z" fill="white" />
      </g>

      {/* Orbiting Node 2: Database Server */}
      <g transform="translate(250, 180)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M14 17c0-.8 2.7-1.5 6-1.5s6 .7 6 1.5m-12 2.5c0 .8 2.7 1.5 6 1.5s6-.7 6-1.5m-12-2.5v2.5m12-2.5v2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Orbiting Node 3: Cloud network */}
      <g transform="translate(180, 20)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M14 24a3 3 0 0 1-0.75-5.9 4 4 0 0 1 7.8-1.5 2.5 2.5 0 0 1 2.45 2.9A3 3 0 0 1 22.5 26h-8.5Z" fill="white" />
      </g>

      {/* Orbiting Node 4: Mobile device */}
      <g transform="translate(290, 110)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M16 14h8v12h-8V14Zm4 10h.01v.01H20V24Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Orbiting Node 5: School Building class */}
      <g transform="translate(100, 180)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M14 15h12v11H14V15Zm3 4h6v2h-6v-2Z" fill="white" />
      </g>

      <defs>
        <radialGradient id="registerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#06b6d4" />
        </radialGradient>
      </defs>
    </svg>
  );
}

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
    <div className="h-screen overflow-y-auto lg:overflow-hidden flex bg-slate-50/50 relative">
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-100/30 blur-3xl" />
      </div>

      {/* Left panel — Edge-to-Edge Premium Gradient Showcase */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand items-center justify-center p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl animate-pulse-soft delay-1000" />
          
          {/* Fine Tech Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Frosted glass frame for illustration */}
          <div className="p-6 bg-white/5 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-md mb-8">
            <IlustrasiRegisterHero />
          </div>
          <h2 className="font-display text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Mulai Belajar Jaringan
          </h2>
          <p className="text-white/85 text-sm leading-relaxed font-medium">
            Daftar untuk mengakses semua materi pembelajaran, menjawab kuis interaktif, dan melacak kemajuan belajarmu secara langsung!
          </p>
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
            <h2 className="font-display text-3xl font-black text-[var(--color-text)] tracking-tight">Buat Akun Baru 📝</h2>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mt-1.5">Lengkapi data di bawah ini untuk mendaftar</p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200/50 text-rose-600 px-4.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-pulse-soft">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Masukkan nama lengkap Anda"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Buat nama pengguna unik"
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
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Kelas <span className="text-slate-400 font-normal lowercase">(opsional)</span></label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                  placeholder="Contoh: IX-A"
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/15 group hover:scale-[1.01] active:scale-95 transition-all mt-2"
            >
              {loading ? (
                <span className="animate-pulse-soft">Membuat akun...</span>
              ) : (
                <>
                  Daftar
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-5 text-xs font-bold text-[var(--color-text-secondary)]">
            Sudah punya akun?
            <Link to="/login" className="text-[var(--color-brand-deep)] hover:underline hover:text-[var(--color-brand)] transition-colors ml-1">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
