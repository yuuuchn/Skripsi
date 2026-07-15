import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Network, Home, BookOpen, Trophy, GraduationCap, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Beranda', icon: Home },
  { to: '/materi', label: 'Belajar', icon: BookOpen },
  { to: '/nilai', label: 'Nilai', icon: Trophy },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const linksRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, show: false });
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Aktifkan transisi warna hanya saat user menekan toggle (bukan saat mount),
  // supaya elemen yang baru dirender tidak ikut menganimasikan warnanya.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const root = document.documentElement;
    root.classList.add('theme-transition');
    const t = setTimeout(() => root.classList.remove('theme-transition'), 400);
    return () => clearTimeout(t);
  }, [dark]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Slide the active-tab indicator to the currently-active desktop nav link
  useLayoutEffect(() => {
    const container = linksRef.current;
    if (!container) return;
    const activeEl = container.querySelector('[data-active="true"]');
    if (activeEl) {
      setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth, show: true });
    } else {
      setIndicator((i) => ({ ...i, show: false }));
    }
  }, [location.pathname, user]);

  return (
    <>
      {/* Desktop spacer to reserve top height and prevent content jumping */}
      <div className="hidden md:block h-16" />

      {/* 1. TOP NAVBAR (Visible at top of desktop, hidden on mobile) */}
      <nav
        className="hidden md:flex glass-navbar z-50 fixed top-0 left-0 w-full h-16 items-center"
        style={{
          transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
          transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? 'none' : 'auto',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between w-full">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300">
              <Network className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-bold text-[var(--color-text)] text-sm tracking-tight">BelajarJaringan</span>
              <span className="ml-1.5 text-[9px] font-mono font-bold text-[var(--color-brand-deep)] bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100/80 dark:border-indigo-800/50 px-1.5 py-0.5 rounded-md">SMP</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div ref={linksRef} className="hidden md:flex items-center gap-1.5 relative">
            {/* Sliding active indicator */}
            <div
              className="absolute top-0 h-full rounded-xl bg-indigo-50/80 dark:bg-indigo-900/40 border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.show ? 1 : 0,
              }}
            />
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-active={active}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-250 ${
                    active
                      ? 'text-[var(--color-brand-deep)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  {item.label}
                </Link>
              );
            })}

            {user?.role === 'guru' && (
              <Link
                to="/admin"
                data-active={location.pathname === '/admin'}
                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-250 ${
                  location.pathname === '/admin'
                    ? 'text-[var(--color-brand-deep)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <GraduationCap className={`w-4 h-4 transition-transform duration-300 ${location.pathname === '/admin' ? 'scale-110' : ''}`} />
                Guru
              </Link>
            )}
          </div>

          {/* Right side / Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] transition-all duration-200"
              title={dark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10">
                {user?.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs leading-tight">
                <div className="font-bold text-[var(--color-text)]">{user?.nama?.split(' ')[0]}</div>
                <div className="text-[var(--color-text-secondary)] font-medium">{user?.role === 'guru' ? 'Guru' : 'Siswa'}</div>
              </div>
              <button
                onClick={() => setConfirmLogout(true)}
                className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)] transition-all duration-200"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Menu Button (Top-Right Floating Circle Action Button) */}
      <button 
        onClick={() => setOpen(!open)} 
        className="md:hidden fixed top-4 right-4 w-11 h-11 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-indigo-500/5 flex items-center justify-center active:scale-95 transition-all z-50 text-[var(--color-text)]"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Floating Mobile Dropdown Menu Card */}
      {open && (
        <div className="md:hidden fixed top-16 right-4 w-52 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-3.5 z-50 animate-scale-in">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-indigo-50/80 dark:bg-indigo-900/40 text-[var(--color-brand-deep)] border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[var(--color-text)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            {user?.role === 'guru' && (
              <Link 
                to="/admin" 
                onClick={() => setOpen(false)} 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50/80 dark:bg-indigo-900/40 text-[var(--color-brand-deep)] border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[var(--color-text)]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Panel Guru
              </Link>
            )}
            <div className="border-t border-slate-100 dark:border-slate-700 my-1.5" />
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] w-full transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {dark ? 'Mode Terang' : 'Mode Gelap'}
            </button>
            <button
              onClick={() => { setOpen(false); setConfirmLogout(true); }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)] w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* 2. LEFT FLOATING SIDEBAR (Fades in when scrolled, desktop only) */}
      <nav
        className="hidden md:flex flex-col items-center gap-5 py-5 px-0 fixed left-5 top-1/2 w-16 h-auto rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl z-50"
        style={{
          transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
          transform: scrolled
            ? 'translateY(-50%) translateX(0)'
            : 'translateY(-50%) translateX(-130%)',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        {/* Brand/Logo icon */}
        <Link to="/dashboard" className="flex flex-col items-center justify-center w-full group">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300">
            <Network className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>

        {/* Divider */}
        <div className="w-7 h-[1px] bg-slate-100 dark:bg-slate-700" />

        {/* Sidebar nav links */}
        <div className="flex flex-col gap-3.5 w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <div key={item.to} className="relative group">
                <Link
                  to={item.to}
                  className={`flex items-center justify-center rounded-xl transition-all duration-250 w-10 h-10 ${
                    active
                      ? 'bg-indigo-50/80 dark:bg-indigo-900/40 text-[var(--color-brand-deep)] border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                    {item.label}
                  </div>
                </Link>
              </div>
            );
          })}

          {user?.role === 'guru' && (
            <div className="relative group">
              <Link
                to="/admin"
                className={`flex items-center justify-center rounded-xl transition-all duration-250 w-10 h-10 ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50/80 dark:bg-indigo-900/40 text-[var(--color-brand-deep)] border border-indigo-100/50 dark:border-indigo-800/50'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <GraduationCap className={`w-5 h-5 transition-transform duration-300 ${location.pathname === '/admin' ? 'scale-110' : ''}`} />
                <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                  Panel Guru
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-7 h-[1px] bg-slate-100 dark:bg-slate-700" />

        {/* Profile / Logout section in Sidebar */}
        <div className="flex flex-col w-full gap-3.5 items-center">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] transition-all duration-200"
            title={dark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10" title={user?.nama}>
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={() => setConfirmLogout(true)}
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)] transition-all duration-200"
            title="Keluar"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </nav>

      {/* Logout confirmation dialog */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-6 text-center animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mb-4">
              <LogOut className="w-5.5 h-5.5 text-[var(--color-rose)]" />
            </div>
            <h3 className="font-display font-black text-base text-[var(--color-text)]">Keluar dari akun?</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              Kamu harus login kembali untuk melanjutkan belajar.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors active:scale-95 shadow-md shadow-rose-600/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
