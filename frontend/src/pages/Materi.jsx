import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, CheckCircle, ArrowRight, Clock, Star, ChevronRight, Laptop, History, Globe, Cable, Router, ShieldCheck, HelpCircle } from 'lucide-react';

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
  { from: '#6366f1', to: '#818cf8' },
  { from: '#06b6d4', to: '#22d3ee' },
  { from: '#10b981', to: '#34d399' },
  { from: '#f59e0b', to: '#fbbf24' },
  { from: '#ec4899', to: '#f472b6' },
  { from: '#8b5cf6', to: '#a78bfa' },
];

export default function Materi() {
  const [materiList, setMateriList] = useState([]);

  useEffect(() => {
    api.get('/materi').then((res) => setMateriList(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header / Breadcrumb */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          <Link to="/dashboard" className="hover:text-[var(--color-brand-deep)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[var(--color-brand-deep)] font-extrabold">Materi</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-text)] flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          Materi Pembelajaran
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base mt-2 font-medium">Pelajari jaringan komputer dari tingkat dasar hingga mahir dengan modul interaktif</p>
      </div>

      {/* Materi grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {materiList.map((m, idx) => {
          const color = materiColors[idx % materiColors.length];
          return (
            <Link
              key={m.id}
              to={`/materi/${m.id}`}
              className="card card-elevated overflow-hidden group flex flex-col justify-between border-slate-200/60 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div>
                <div className="h-2.5" style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }} />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100/80 shrink-0 group-hover:scale-108 group-hover:rotate-3 transition-transform duration-300">
                      {(() => {
                        const IconComp = iconMap[m.icon] || HelpCircle;
                        return <IconComp className="w-6 h-6" style={{ color: color.from }} />;
                      })()}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Pertemuan {m.urutan}</div>
                      <h3 className="font-display font-extrabold text-lg text-[var(--color-text)] leading-snug mt-1 group-hover:text-[var(--color-brand-deep)] transition-colors">{m.judul}</h3>
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
                    Belum dipelajari
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-[var(--color-brand-deep)] flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-transparent transition-all duration-300">
                  <ArrowRight className="w-4.5 h-4.5 text-[var(--color-brand-deep)] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
