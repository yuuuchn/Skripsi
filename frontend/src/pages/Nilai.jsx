import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { 
  Trophy, 
  BarChart3, 
  Medal, 
  FileText, 
  BookOpen, 
  Star, 
  Sparkles, 
  AlertCircle,
  Flame,
  Crown,
  Target,
  Award,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Nilai() {
  const [nilaiList, setNilaiList] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'leaderboard'
  const containerRef = useRef(null);

  useEffect(() => {
    api.get('/progress/nilai')
      .then((res) => setNilaiList(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      setLeaderboardLoading(true);
      api.get('/progress/leaderboard')
        .then((res) => setLeaderboard(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // 1. Header (immediate fade-in slide down)
      gsap.fromTo('.nilai-header-section',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      if (activeTab === 'personal') {
        if (nilaiList.length > 0) {
          // 2. Stats cards staggered reveal
          const stats = containerRef.current?.querySelectorAll('.nilai-stats-card');
          if (stats && stats.length > 0) {
            gsap.fromTo(stats,
              { opacity: 0, y: 25, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
          }

          // 3. Achievements cards staggered reveal
          const achievements = containerRef.current?.querySelectorAll('.nilai-achievement-card');
          if (achievements && achievements.length > 0) {
            gsap.fromTo(achievements,
              { opacity: 0, y: 20, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.1)' }
            );
          }

          // 4. Leaderboard wrapper card reveal
          const boardCard = containerRef.current?.querySelector('.nilai-leaderboard-card');
          if (boardCard) {
            gsap.fromTo(boardCard,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
            );
          }

          // 5. Leaderboard rows staggered reveal inside card
          const rows = containerRef.current?.querySelectorAll('.nilai-leaderboard-item');
          if (rows && rows.length > 0) {
            gsap.fromTo(rows,
              { opacity: 0, x: -15 },
              { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
            );
          }
        }
      } else if (activeTab === 'leaderboard') {
        if (leaderboard.length > 0) {
          // 1. Leaderboard scoreboard card reveal
          const boardCard = containerRef.current?.querySelector('.nilai-scoreboard-card');
          if (boardCard) {
            gsap.fromTo(boardCard,
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
            );
          }

          // 2. Leaderboard ranks staggered rows reveal
          const rows = containerRef.current?.querySelectorAll('.nilai-scoreboard-item');
          if (rows && rows.length > 0) {
            gsap.fromTo(rows,
              { opacity: 0, x: -15 },
              { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
            );
          }
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [loading, activeTab, nilaiList, leaderboard]);

  const rataRata = nilaiList.length > 0
    ? Math.round(nilaiList.reduce((a, b) => a + b.nilai, 0) / nilaiList.length)
    : 0;
  const tertinggi = nilaiList.length > 0
    ? Math.max(...nilaiList.map(n => n.nilai))
    : 0;

  // Dynamic achievement badges list based on quiz data
  const achievementsList = [
    {
      title: 'Pemberani',
      desc: 'Mengerjakan kuis pertama Anda',
      icon: Flame,
      unlocked: nilaiList.length >= 1,
      bg: 'bg-amber-50 border-amber-100/50',
      color: 'text-amber-500 fill-amber-400 border-0'
    },
    {
      title: 'Siswa Teladan',
      desc: 'Mendapat kuis sempurna 100',
      icon: Crown,
      unlocked: tertinggi === 100,
      bg: 'bg-yellow-50 border-yellow-100/50',
      color: 'text-yellow-600 fill-yellow-400 border-0'
    },
    {
      title: 'Ahli Jaringan',
      desc: 'Menuntaskan seluruh 6 kuis',
      icon: Award,
      unlocked: nilaiList.length === 6,
      bg: 'bg-indigo-50 border-indigo-100/50',
      color: 'text-indigo-600 fill-indigo-400 border-0'
    },
    {
      title: 'Pembelajar Tangguh',
      desc: 'Rata-rata nilai kuis minimal 80',
      icon: Target,
      unlocked: rataRata >= 80,
      bg: 'bg-emerald-50 border-emerald-100/50',
      color: 'text-emerald-600 fill-emerald-400 border-0'
    }
  ];

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
          Nilai & Pencapaian Kuis
        </h1>
        <ScrollReveal
          baseOpacity={0.2}
          blurStrength={4}
          textClassName="text-[var(--color-text-secondary)] text-sm md:text-base mt-2 font-medium block"
        >
          Lacak rekam jejak prestasi, buka lencana kejuaraan, dan lihat peringkat Anda
        </ScrollReveal>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'personal'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Award className="w-4 h-4" />
          Skor & Pencapaian
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'leaderboard'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Peringkat Kelas
        </button>
      </div>

      {activeTab === 'personal' ? (
        nilaiList.length === 0 ? (
          <div className="card p-12 text-center border-slate-200/60 max-w-lg mx-auto shadow-sm animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-2">Belum Ada Nilai</h2>
            <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-6">Anda belum mengerjakan kuis apa pun. Silakan mulai mempelajari materi dan selesaikan kuisnya untuk membuka lencana prestasi!</p>
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

            {/* Achievements/Badges Grid */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h2 className="font-display font-extrabold text-base text-[var(--color-text)]">Lencana Pencapaian Kuis</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievementsList.map((ach, i) => {
                  const Icon = ach.icon;
                  return (
                    <div 
                      key={i} 
                      className={`card p-4.5 text-center flex flex-col items-center justify-between border-slate-200/50 shadow-sm transition-all duration-300 nilai-achievement-card opacity-0 ${
                        ach.unlocked 
                          ? 'bg-gradient-to-b from-white to-slate-50/20 border-indigo-100/60 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5' 
                          : 'opacity-55 bg-slate-50/30 border-slate-200/30 select-none'
                      }`}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm ${
                          ach.unlocked ? ach.bg : 'bg-slate-100 text-slate-400 shadow-none border border-slate-200/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${ach.unlocked ? ach.color : 'text-slate-400'}`} />
                        </div>
                        {!ach.unlocked && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-350 border-2 border-white flex items-center justify-center text-white">
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className={`font-display font-bold text-[11px] tracking-tight ${ach.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{ach.title}</h4>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal font-medium">{ach.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail list (Leaderboard Style) */}
            <div className="card overflow-hidden border-slate-200/60 shadow-sm nilai-leaderboard-card opacity-0">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="font-display font-extrabold text-base text-[var(--color-text)] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Papan Riwayat Kuis Anda
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
                            {pct}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )
      ) : (
        /* Class Leaderboard Scoreboard Tab */
        <div className="card overflow-hidden border-slate-200/60 shadow-sm nilai-scoreboard-card opacity-0">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-base text-[var(--color-text)] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
              Peringkat 10 Besar Kelas
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Papan Juara</span>
          </div>

          {leaderboardLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center">
              <AlertCircle className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">Belum ada peringkat terkumpul.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100/80">
              {leaderboard.map((item, idx) => {
                const isTop3 = idx < 3;
                const rankBg = idx === 0 
                  ? 'bg-amber-400 text-white shadow-amber-400/20' 
                  : idx === 1 
                  ? 'bg-slate-400 text-white shadow-slate-400/20' 
                  : idx === 2 
                  ? 'bg-amber-600 text-white shadow-amber-600/20' 
                  : 'bg-slate-100 text-slate-600';
                
                return (
                  <div key={idx} className={`px-5 py-4.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors nilai-scoreboard-item opacity-0 ${
                    idx === 0 ? 'bg-amber-50/10' : ''
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${rankBg}`}>
                        {idx === 0 ? (
                          <Trophy className="w-4.5 h-4.5 text-white" />
                        ) : idx === 1 ? (
                          <Medal className="w-4.5 h-4.5 text-white" />
                        ) : idx === 2 ? (
                          <Medal className="w-4.5 h-4.5 text-white" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--color-text)] leading-snug">{item.nama}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.kelas || 'Siswa'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">Pelajaran</span>
                        <span className="text-xs font-extrabold text-slate-700 mt-1 block">{item.materi_selesai} / 6</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400 border-0" />
                        <div>
                          <span className="stat-value text-base font-black text-indigo-600">{item.total_skor}</span>
                          <span className="text-[9px] font-bold text-slate-400 ml-1">total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
