import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Home, BookOpen, Trophy, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-navbar transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300">
            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-[var(--color-text)] text-sm tracking-tight">BelajarJaringan</span>
            <span className="ml-1.5 text-[9px] font-mono font-bold text-[var(--color-brand-deep)] bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.5 rounded-md">SMP</span>
          </div>
        </Link>

        {/* Desktop nav */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
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

          {/* Mobile menu button */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden p-2 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
          >
            {open ? <X className="w-5 h-5 text-[var(--color-text)]" /> : <Menu className="w-5 h-5 text-[var(--color-text)]" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl animate-fade-in shadow-lg">
          <div className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
            {user?.role === 'guru' && (
              <Link 
                to="/admin" 
                onClick={() => setOpen(false)} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50'
                    : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4.5 h-4.5" />
                Panel Guru
              </Link>
            )}
            <div className="border-t border-[var(--color-border)] my-2" />
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)] w-full transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
