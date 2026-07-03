import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BookOpen, CheckCircle, BarChart3, ArrowRight, Star, Trophy, Zap, Clock, Laptop, History, Globe, Cable, Router, ShieldCheck, HelpCircle } from 'lucide-react';

const iconMap = {
  '💻': Laptop,
  '📜': History,
  '🌐': Globe,
  '🔌': Cable,
  '📡': Router,
  '✅': ShieldCheck,
  'Laptop': Laptop,
  'History': History,
  'Globe': Globe,
  'Cable': Cable,
  'Router': Router,
  'ShieldCheck': ShieldCheck
};

const materiColors = [
  { from: '#6366f1', to: '#818cf8', shadow: 'rgba(99, 102, 241, 0.15)' },
  { from: '#06b6d4', to: '#22d3ee', shadow: 'rgba(6, 182, 212, 0.15)' },
  { from: '#10b981', to: '#34d399', shadow: 'rgba(16, 185, 129, 0.15)' },
  { from: '#f59e0b', to: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.15)' },
  { from: '#ec4899', to: '#f472b6', shadow: 'rgba(236, 72, 153, 0.15)' },
  { from: '#8b5cf6', to: '#a78bfa', shadow: 'rgba(139, 92, 246, 0.15)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [materiList, setMateriList] = useState([]);

  useEffect(() => {
    api.get('/materi').then((res) => setMateriList(res.data));
    api.get('/progress').then((res) => setProgress(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="card bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 border-0 p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/10 animate-fade-in-up">
        {/* Glow ornaments */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl animate-pulse-soft delay-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-3 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Platform Pembelajaran</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black mb-3 tracking-tight leading-none">
              Halo, {user?.nama?.split(' ')[0]}!
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed font-medium">
              {user?.kelas ? `Kelas ${user.kelas} — ` : ''}Mari perluas wawasanmu tentang dunia Jaringan Komputer hari ini!
            </p>
          </div>
          <div className="flex flex-row md:flex-col lg:flex-row gap-3 shrink-0">
            <Link to="/materi" className="bg-white text-indigo-800 font-extrabold px-6 py-3 rounded-xl text-sm hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10">
              <BookOpen className="w-4.5 h-4.5" />
              Mulai Belajar
            </Link>
            <Link to="/nilai" className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl text-sm active:scale-95 transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm">
              <Trophy className="w-4.5 h-4.5 text-amber-300" />
              Lihat Nilai
            </Link>
          </div>
        </div>
      </div>

      {/* Stats and Progress Row */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: BookOpen, label: 'Total Materi', value: materiList.length, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100/50' },
          { icon: CheckCircle, label: 'Selesai Dipelajari', value: progress?.selesai || 0, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100/50' },
          { icon: BarChart3, label: 'Kemajuan Belajar', value: `${progress?.progress_persen || 0}%`, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100/50' },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={`w-12 h-12 rounded-2xl ${s.bg} border flex items-center justify-center shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{s.label}</div>
              <div className={`stat-value text-3xl font-black mt-0.5 ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress detail card */}
      {progress && (
        <div className="card p-6 mb-10 border border-slate-200/80 animate-fade-in-up" style={{ animationDelay: '0.24s' }}>
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <h2 className="font-display font-extrabold text-base text-[var(--color-text)] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--color-brand)]" />
                Grafik Kemajuan Anda
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {progress.selesai} dari {progress.total_materi} materi pembelajaran telah diselesaikan
              </p>
            </div>
            <span className="font-display font-black text-indigo-600 text-2xl bg-indigo-50 px-3.5 py-1 rounded-2xl border border-indigo-100/50">{progress.progress_persen}%</span>
          </div>
          <div className="bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress.progress_persen}%`,
                background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
              }}
            />
          </div>
        </div>
      )}

      {/* Materi List */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[var(--color-text)] flex items-center gap-2.5 tracking-tight">
              <BookOpen className="w-6 h-6 text-[var(--color-brand)]" />
              Materi Pembelajaran
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">Materi yang disusun secara sistematis untuk dipahami</p>
          </div>
          <Link to="/materi" className="text-sm font-bold text-[var(--color-brand-deep)] hover:text-[var(--color-brand)] hover:underline flex items-center gap-1 transition-colors">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiList.map((m, idx) => {
            const color = materiColors[idx % materiColors.length];
            return (
              <Link
                key={m.id}
                to={`/materi/${m.id}`}
                className="card card-elevated overflow-hidden animate-fade-in-up group flex flex-col justify-between border-slate-200/60"
                style={{ 
                  animationDelay: `${(idx + 5) * 0.06}s`,
                }}
              >
                <div>
                  <div
                    className="h-2.5"
                    style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {(() => {
                          const IconComp = iconMap[m.icon] || HelpCircle;
                          return <IconComp className="w-5.5 h-5.5" style={{ color: color.from }} />;
                        })()}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Pertemuan {m.urutan}</div>
                        <h3 className="font-display font-extrabold text-sm text-[var(--color-text)] leading-snug mt-0.5 group-hover:text-[var(--color-brand-deep)] transition-colors">{m.judul}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                 <div className="px-6 pb-6 pt-4 border-t border-slate-100/80 flex items-center justify-between bg-slate-50/40">
                  {m.selesai ? (
                    <div className="flex items-center gap-1.5">
                      <span className="tag tag-success text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Selesai
                      </span>
                      {m.nilai !== null && (
                        <span className="tag tag-info text-[10px] font-bold">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 border-0" />
                          Skor: {m.nilai}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="tag tag-info text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      <Clock className="w-3.5 h-3.5" />
                      Mulai Belajar
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[var(--color-brand-deep)] flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-transparent transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
