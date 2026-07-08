import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, User, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

// Premium Aesthetic Global Network SVG
function IlustrasiLoginHero() {
  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-sm mx-auto animate-float-slow" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="130" r="90" fill="url(#globeGlow)" opacity="0.15" />
      
      {/* Central Globe */}
      <circle cx="200" cy="130" r="55" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
      <ellipse cx="200" cy="130" rx="20" ry="55" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
      <ellipse cx="200" cy="130" rx="55" ry="16" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="200" y1="75" x2="200" y2="185" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />
      <line x1="145" y1="130" x2="255" y2="130" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" />

      {/* Orbit Rings */}
      <ellipse cx="200" cy="130" rx="105" ry="40" stroke="white" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" transform="rotate(-15 200 130)" />
      <ellipse cx="200" cy="130" rx="125" ry="50" stroke="white" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.15" transform="rotate(25 200 130)" />

      {/* Connecting Lines */}
      <line x1="200" y1="75" x2="200" y2="55" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="145" y1="130" x2="105" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="255" y1="130" x2="295" y2="130" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="238" y1="168" x2="270" y2="185" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
      <line x1="162" y1="168" x2="130" y2="185" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />

      {/* Orbiting particles */}
      <circle cx="95" cy="105" r="3" fill="#67e8f9" />
      <circle cx="295" cy="165" r="4" fill="#fbbf24" />
      <circle cx="310" cy="80" r="3" fill="#a78bfa" />

      {/* Nodes */}
      {/* Node 1: Cloud (Top Center) */}
      <g transform="translate(180, 20)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M14 24a3 3 0 0 1-0.75-5.9 4 4 0 0 1 7.8-1.5 2.5 2.5 0 0 1 2.45 2.9A3 3 0 0 1 22.5 26h-8.5Z" fill="white" />
      </g>

      {/* Node 2: Laptop (Left Middle) */}
      <g transform="translate(65, 110)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M13 16h14v8H13v-8Zm-2 9h18v1.5H11V25Z" fill="white" />
      </g>

      {/* Node 3: Mobile Phone (Right Middle) */}
      <g transform="translate(295, 110)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M16 14h8v12h-8V14Zm4 10h.01v.01H20V24Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Node 4: Security Shield (Bottom Left) */}
      <g transform="translate(105, 180)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M20 14s-5 1.5-5 4.5v4.5c0 3 5 6 5 6s5-3 5-6v-4.5c0-3-5-4.5-5-4.5Z" fill="white" />
      </g>

      {/* Node 5: Server / DB (Bottom Right) */}
      <g transform="translate(255, 180)">
        <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M14 17c0-.8 2.7-1.5 6-1.5s6 .7 6 1.5m-12 2.5c0 .8 2.7 1.5 6 1.5s6-.7 6-1.5m-12-2.5v2.5m12-2.5v2.5m-12 2.5c0 .8 2.7 1.5 6 1.5s6-.7 6-1.5m-12-2.5v2.5m12-2.5v2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <defs>
        <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
      </defs>
    </svg>
  );
}

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
    <div className="h-screen overflow-y-auto lg:overflow-hidden flex bg-slate-50/50 dark:bg-slate-950/50 relative">
      {/* Decorative Background Blobs for Entire Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-100/40 dark:bg-indigo-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-100/30 dark:bg-cyan-900/15 blur-3xl" />
      </div>

      {/* Left panel — Edge-to-Edge Premium Gradient Showcase */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand items-center justify-center p-16 relative overflow-hidden shadow-2xl">
        {/* Decorative gradients in card */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl animate-pulse-soft delay-1000" />
          
          {/* Fine Tech Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-md text-center">
          {/* Frosted glass frame for illustration */}
          <div className="p-6 bg-white/5 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-md mb-8">
            <IlustrasiLoginHero />
          </div>
          
          <h2 className="font-display text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Belajar Jaringan Komputer
          </h2>
          <p className="text-white/85 text-sm leading-relaxed font-medium mb-8">
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
              <div className="font-display text-2xl font-black text-white">60</div>
              <div className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">Soal Kuis</div>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="text-center">
              <div className="font-display text-2xl font-black text-white">9</div>
              <div className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">Ilustrasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Aesthetic Card Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md p-8 md:p-10 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-100/80 dark:border-slate-700/80 shadow-2xl shadow-slate-100/50 dark:shadow-black/20 animate-fade-in-up">
          
          {/* Mobile brand (Only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg shadow-indigo-500/20 animate-float-slow">
              <Globe className="w-6.5 h-6.5" />
            </div>
            <h1 className="font-display text-2xl font-black text-[var(--color-text)]">BelajarJaringan</h1>
            <p className="text-[var(--color-text-secondary)] text-xs font-bold uppercase tracking-wider mt-0.5">Media Pembelajaran SMP</p>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-display text-3xl font-black text-[var(--color-text)] tracking-tight">Selamat Datang</h2>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mt-1.5">Silakan masuk untuk mulai belajar jaringan komputer</p>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/50 text-rose-600 dark:text-rose-450 px-4.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-pulse-soft">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-100"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-100"
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
            Belum punya akun?   
            <Link to="/register" className="text-[var(--color-brand-deep)] hover:underline hover:text-[var(--color-brand)] transition-colors ml-1">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
