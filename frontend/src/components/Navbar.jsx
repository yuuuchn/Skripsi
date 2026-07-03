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

  // Dynamic classes for responsive morphing navbar
  const navClass = scrolled
    ? "glass-navbar transition-all duration-500 ease-in-out z-50 " +
      "md:fixed md:left-5 md:top-1/2 md:-translate-y-1/2 md:w-16 md:h-[440px] md:rounded-3xl md:flex md:flex-col md:justify-between md:py-6 md:px-0 md:shadow-xl md:shadow-indigo-500/5 md:border md:border-slate-200/80 " +
      "sticky top-0 w-full h-16 flex items-center"
    : "glass-navbar transition-all duration-500 ease-in-out z-50 " +
      "sticky top-0 w-full h-16 flex items-center";

  const containerClass = scrolled
    ? "max-w-6xl mx-auto px-4 flex items-center justify-between w-full h-full " +
      "md:flex-col md:h-full md:px-0 md:py-0 md:justify-between md:items-center"
    : "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between w-full";

  const brandClass = scrolled
    ? "flex items-center gap-2.5 group " +
      "md:flex-col md:gap-0 md:w-full md:justify-center"
    : "flex items-center gap-2.5 group";

  const logoWrapperClass = scrolled
    ? "w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300 " +
      "md:w-10 md:h-10"
    : "w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300";

  const brandTextClass = scrolled
    ? "hidden sm:block md:hidden"
    : "hidden sm:block";

  const menuListClass = scrolled
    ? "hidden md:flex items-center gap-1.5 " +
      "md:flex-col md:gap-4 md:w-full md:items-center"
    : "hidden md:flex items-center gap-1.5";

  const rightSideClass = scrolled
    ? "flex items-center gap-3 md:flex-col md:w-full md:gap-4"
    : "flex items-center gap-3";

  const profileWrapperClass = scrolled
    ? "hidden md:flex items-center gap-3 pl-4 border-l border-[var(--color-border)] " +
      "md:flex-col md:border-l-0 md:pl-0 md:pt-4 md:border-t md:w-full md:items-center"
    : "hidden md:flex items-center gap-3 pl-4 border-l border-[var(--color-border)]";

  const profileDetailsClass = scrolled
    ? "text-xs leading-tight md:hidden"
    : "text-xs leading-tight";

  return (
    <nav className={navClass}>
      <div className={containerClass}>
        {/* Brand */}
        <Link to="/dashboard" className={brandClass}>
          <div className={logoWrapperClass}>
            <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className={brandTextClass}>
            <span className="font-display font-bold text-[var(--color-text)] text-sm tracking-tight">BelajarJaringan</span>
            <span className="ml-1.5 text-[9px] font-mono font-bold text-[var(--color-brand-deep)] bg-indigo-50 border border-indigo-100/80 px-1.5 py-0.5 rounded-md">SMP</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className={menuListClass}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <div key={item.to} className="relative group">
                <Link
                  to={item.to}
                  className={scrolled
                    ? `flex items-center justify-center rounded-xl transition-all duration-250 ${
                        active
                          ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                      } md:w-10 md:h-10 md:px-0 md:py-0`
                    : `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                        active
                          ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                      }`
                  }
                >
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  <span className={scrolled ? "text-sm md:hidden" : "text-sm"}>{item.label}</span>
                  {scrolled && (
                    <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}

          {user?.role === 'guru' && (
            <div className="relative group">
              <Link
                to="/admin"
                className={scrolled
                  ? `flex items-center justify-center rounded-xl transition-all duration-250 ${
                      location.pathname === '/admin'
                        ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                    } md:w-10 md:h-10 md:px-0 md:py-0`
                  : `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-250 ${
                      location.pathname === '/admin'
                        ? 'bg-indigo-50/80 text-[var(--color-brand-deep)] border border-indigo-100/50 shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-slate-100/50'
                    }`
                }
              >
                <GraduationCap className={`w-4.5 h-4.5 transition-transform duration-300 ${location.pathname === '/admin' ? 'scale-110' : ''}`} />
                <span className={scrolled ? "text-sm md:hidden" : "text-sm"}>Guru</span>
                {scrolled && (
                  <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                    Panel Guru
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Right side / Profile */}
        <div className={rightSideClass}>
          <div className={profileWrapperClass}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/10">
              {user?.nama?.charAt(0).toUpperCase()}
            </div>
            <div className={profileDetailsClass}>
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
            className="md:hidden p-2 rounded-xl hover:bg-slate-100/60 active:scale-95 transition-all"
          >
            {open ? <X className="w-5 h-5 text-[var(--color-text)]" /> : <Menu className="w-5 h-5 text-[var(--color-text)]" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white/95 backdrop-blur-xl animate-fade-in shadow-lg w-full">
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
