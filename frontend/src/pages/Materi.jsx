import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, CheckCircle, ArrowRight, Clock, Star, ChevronRight, Laptop, History, Globe, Cable, Router, ShieldCheck, HelpCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

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

function MateriSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-3" />
        <div className="h-8 w-64 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-44" />
        ))}
      </div>
    </div>
  );
}

export default function Materi() {
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    api.get('/materi').then((res) => {
      setMateriList(res.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    // 1. Header reveal runs only once when loading is complete
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, force3D: true, ease: 'power2.out' }
      );
    }
  }, [loading]);

  useEffect(() => {
    if (loading || materiList.length === 0) return;

    // 2. Cards staggered reveal on scroll
    const cards = gridRef.current?.querySelectorAll('.materi-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'back.out(1.15)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading, materiList]);

  if (loading) return <MateriSkeleton />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header / Breadcrumb */}
      <div ref={headerRef} className="mb-8 opacity-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          <Link to="/dashboard" className="hover:text-[var(--color-brand-deep)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="text-[var(--color-brand-deep)] font-extrabold">Materi</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-text)] flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          Materi Pembelajaran
        </h1>
        <ScrollReveal
          baseOpacity={1}
          blurStrength={0}
          textClassName="text-[var(--color-text-secondary)] text-sm md:text-base mt-2 font-medium block"
        >
          Pelajari jaringan komputer dari tingkat dasar hingga mahir dengan modul interaktif
        </ScrollReveal>
      </div>

      {/* Materi grid */}
      <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
        {materiList.map((m, idx) => {
          const color = materiColors[idx % materiColors.length];
          return (
            <Link
              key={m.id}
              to={`/materi/${m.id}`}
              className="card card-elevated overflow-hidden group flex flex-col justify-between border-slate-200/60 dark:border-slate-700/50 materi-card opacity-0"
            >
              <div>
                <div className="h-2.5" style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }} />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100/80 dark:border-slate-700/80 shrink-0 group-hover:scale-108 group-hover:rotate-3 transition-transform duration-300">
                      {(() => {
                        const IconComp = iconMap[m.icon] || HelpCircle;
                        return <IconComp className="w-6 h-6" style={{ color: color.from }} />;
                      })()}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">Pertemuan {m.urutan}</div>
                      <h3 className="font-display font-extrabold text-lg text-[var(--color-text)] leading-snug mt-1 group-hover:text-[var(--color-brand-deep)] transition-colors">{m.judul}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1.5 line-clamp-2 leading-relaxed">
                        Materi pembelajaran bab {m.urutan} mengenai konsep {m.judul.toLowerCase()} untuk siswa kelas IX.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-slate-100/80 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/40 dark:bg-slate-800/40">
                {m.selesai ? (
                  <div className="flex items-center gap-1.5">
                    <span className="tag tag-success text-[10px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Selesai
                    </span>
                    {m.nilai !== null && (
                      <span className="tag tag-info text-[10px] font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 border-0" />
                        Skor: {m.nilai}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="tag tag-info text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    Belum dipelajari
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 group-hover:bg-[var(--color-brand-deep)] flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600 group-hover:border-transparent transition-all duration-300">
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
