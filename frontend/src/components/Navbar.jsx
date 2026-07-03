import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Home, BookOpen, Trophy, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  return (
    <>
      {/* Desktop spacer to reserve top height and prevent content jumping */}
      <div className="hidden md:block h-16" />

      {/* 1. TOP NAVBAR (Visible at top of desktop, hidden on mobile) */}
      <nav 
        className={`hidden md:flex glass-navbar z-50 fixed top-0 left-0 w-full h-16 items-center transition-all duration-300 ${
          scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between w-full">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300">
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-bold text-[var(--color-text)] text-sm tracking-tight">BelajarJaringan</span>
              <span className="ml-1.5 text-[9px] font-mono font-bold text-[var(--color-brand-deep)] bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.5 rounded-md">SMP</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                    active
                      ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                }`}
              >
                <GraduationCap className={`w-4 h-4 transition-transform duration-300 ${location.pathname === '/admin' ? 'scale-110' : ''}`} />
                Guru
              </Link>
            )}
          </div>

          {/* Right side / Profile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10">
                {user?.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs leading-tight">
                <div className="font-bold text-[var(--color-text)]">{user?.nama?.split(' ')[0]}</div>
                <div className="text-[var(--color-text-secondary)] font-medium">{user?.role === 'guru' ? 'Guru' : 'Siswa'}</div>
              </div>
              <button 
                onClick={handleLogout} 
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
        className="md:hidden fixed top-4 right-4 w-11 h-11 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg shadow-indigo-500/5 flex items-center justify-center active:scale-95 transition-all z-50 text-[var(--color-text)]"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Floating Mobile Dropdown Menu Card */}
      {open && (
        <div className="md:hidden fixed top-16 right-4 w-52 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl p-3.5 z-50 animate-scale-in">
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
                      ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-slate-50 hover:text-[var(--color-text)]'
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
                    ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-slate-50 hover:text-[var(--color-text)]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Panel Guru
              </Link>
            )}
            <div className="border-t border-slate-100 my-1.5" />
            <button 
              onClick={handleLogout} 
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
        className={`hidden md:flex flex-col items-center gap-5 py-5 px-0 fixed left-5 top-1/2 -translate-y-1/2 w-16 h-auto rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-200/80 bg-white/90 backdrop-blur-xl z-50 transition-all duration-300 ${
          scrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Brand/Logo icon */}
        <Link to="/dashboard" className="flex flex-col items-center justify-center w-full group">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300">
            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </Link>

        {/* Divider */}
        <div className="w-7 h-[1px] bg-slate-100" />

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
                      ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
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
                    ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                }`}
              >
                <GraduationCap className={`w-5 h-5 transition-transform duration-300 ${location.pathname === '/admin' ? 'scale-110' : ''}`} />
                <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                  Panel Guru
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-7 h-[1px] bg-slate-100" />

        {/* Profile / Logout section in Sidebar */}
        <div className="flex flex-col w-full gap-3.5 items-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10" title={user?.nama}>
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)] transition-all duration-200" 
            title="Keluar"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </nav>
    </>
  );
}
