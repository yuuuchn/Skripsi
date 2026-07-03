import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Trophy, BarChart3, Medal, FileText, BookOpen, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Nilai() {
  const [nilaiList, setNilaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    api.get('/progress/nilai')
      .then((res) => setNilaiList(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || nilaiList.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Header (immediate fade-in slide down)
      gsap.fromTo('.nilai-header-section',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      // 2. Stats cards staggered reveal on scroll
      const stats = containerRef.current?.querySelectorAll('.nilai-stats-card');
      if (stats && stats.length > 0) {
        gsap.fromTo(stats,
          { opacity: 0, y: 25, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.nilai-stats-container',
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 3. Leaderboard wrapper card reveal
      const boardCard = containerRef.current?.querySelector('.nilai-leaderboard-card');
      if (boardCard) {
        gsap.fromTo(boardCard,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: boardCard,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 4. Leaderboard rows staggered reveal inside card
      const rows = containerRef.current?.querySelectorAll('.nilai-leaderboard-item');
      if (rows && rows.length > 0) {
        gsap.fromTo(rows,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: boardCard,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [loading, nilaiList]);

  const rataRata = nilaiList.length > 0
    ? Math.round(nilaiList.reduce((a, b) => a + b.nilai, 0) / nilaiList.length)
    : 0;
  const tertinggi = nilaiList.length > 0
    ? Math.max(...nilaiList.map(n => n.nilai))
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 nilai-header-section opacity-0">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-text)] flex items-center gap-3 tracking-tight">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <Trophy className="w-5.5 h-5.5 fill-amber-400 border-0" />
          </div>
          Nilai Kuis
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base mt-2 font-medium">Lacak rekam jejak prestasi dan hasil kuis yang telah Anda kerjakan</p>
      </div>

      {nilaiList.length === 0 ? (
        <div className="card p-12 text-center border-slate-200/60 max-w-lg mx-auto shadow-sm animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-2">Belum Ada Nilai</h2>
          <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-6">Anda belum mengerjakan kuis apa pun. Silakan mulai mempelajari materi dan selesaikan kuisnya!</p>
          <Link to="/materi" className="btn btn-primary font-bold shadow-md shadow-indigo-500/10 inline-flex">
            <BookOpen className="w-4.5 h-4.5 text-white" />
            Mulai Belajar
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mb-8 nilai-stats-container">
            {[
              { icon: BarChart3, label: 'Rata-rata', value: rataRata, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100/50' },
              { icon: Medal, label: 'Tertinggi', value: tertinggi, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100/50' },
              { icon: FileText, label: 'Kuis Selesai', value: nilaiList.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100/50' },
            ].map((s, i) => (
              <div key={i} className="card p-5 text-center nilai-stats-card opacity-0">
                <div className={`w-10 h-10 rounded-2xl ${s.bg} border flex items-center justify-center mx-auto mb-2.5`}>
                  <s.icon className={`w-5.5 h-5.5 ${s.color}`} />
                </div>
                <div className={`stat-value text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Detail list (Leaderboard Style) */}
          <div className="card overflow-hidden border-slate-200/60 shadow-sm nilai-leaderboard-card opacity-0">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="font-display font-extrabold text-base text-[var(--color-text)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                Papan Prestasi Kuis Anda
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Daftar Nilai</span>
            </div>
            
            <div className="divide-y divide-slate-100/80">
              {nilaiList.map((n, idx) => {
                const pct = n.nilai;
                const tagClass = pct >= 80 ? 'tag-success' : pct >= 60 ? 'tag-warning' : 'tag-danger';
                const label = pct >= 80 ? 'Sangat Baik' : pct >= 60 ? 'Cukup Baik' : 'Perlu Belajar Lagi';
                const rankBg = pct >= 80 ? 'bg-emerald-500 text-white shadow-emerald-500/10' : pct >= 60 ? 'bg-amber-500 text-white shadow-amber-500/10' : 'bg-rose-500 text-white shadow-rose-500/10';

                return (
                  <div key={idx} className="px-5 py-4.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors nilai-leaderboard-item opacity-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${rankBg}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--color-text)] leading-snug">{n.materi_judul}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`tag ${tagClass} text-[9px] py-0.5 px-2 font-bold`}>{label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                      <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <Star className={`w-4 h-4 ${pct >= 80 ? 'text-emerald-500 fill-emerald-500' : pct >= 60 ? 'text-amber-500 fill-amber-500' : 'text-rose-500 fill-rose-500'} border-0`} />
                        <span className={`stat-value text-lg font-black ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {n.nilai}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
