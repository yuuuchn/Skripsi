import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BookOpen, CheckCircle, BarChart3, ArrowRight, Star, Trophy, Zap, Clock, HelpCircle, RefreshCw, AlertCircle, Users, Award, TrendingDown, UserRoundCheck, ClipboardList, GraduationCap } from 'lucide-react';
import BorderGlow from '../components/BorderGlow';
import ScrollReveal from '../components/ScrollReveal';
import useTilt from '../hooks/useTilt';
import { iconMap } from '../utils/materiIcons';
import MateriThumbnail from '../components/MateriThumbnail';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const materiColors = [
  { from: '#6366f1', to: '#818cf8', shadow: 'rgba(99, 102, 241, 0.15)' },
  { from: '#06b6d4', to: '#22d3ee', shadow: 'rgba(6, 182, 212, 0.15)' },
  { from: '#10b981', to: '#34d399', shadow: 'rgba(16, 185, 129, 0.15)' },
  { from: '#f59e0b', to: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.15)' },
  { from: '#ec4899', to: '#f472b6', shadow: 'rgba(236, 72, 153, 0.15)' },
  { from: '#8b5cf6', to: '#a78bfa', shadow: 'rgba(139, 92, 246, 0.15)' },
];

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-44 mb-8" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-28" />
        ))}
      </div>
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-28 mb-10" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-52" />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isGuru = user?.role === 'guru';
  const [progress, setProgress] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [teacherStats, setTeacherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const statsContainerRef = useRef(null);
  const progressCardRef = useRef(null);
  const materiContainerRef = useRef(null);
  const tilt = useTilt();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    const requests = isGuru
      ? [api.get(`/progress/admin?page=1&limit=1`), api.get('/progress/admin/chart'), api.get('/materi')]
      : [api.get('/materi'), api.get('/progress')];
    Promise.all(requests).then((results) => {
      if (!active) return;
      if (isGuru) {
        const [summaryRes, chartRes, materiRes] = results;
        setTeacherStats({ ...summaryRes.data.stats, chart: chartRes.data });
        setMateriList(materiRes.data);
      } else {
        const [materiRes, progressRes] = results;
        setMateriList(materiRes.data);
        setProgress(progressRes.data);
      }
    }).catch(() => {
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [reloadKey, isGuru]);

  useEffect(() => {
    if (isGuru || materiList.length === 0 || !progress) return;

    // 1. Stats Cards staggered reveal on scroll
    const statsCards = statsContainerRef.current?.querySelectorAll('.stats-card');
    if (statsCards && statsCards.length > 0) {
      gsap.fromTo(statsCards,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 2. Progress card reveal on scroll
    if (progressCardRef.current) {
      gsap.fromTo(progressCardRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: progressCardRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Animate progress bar fill inside progress card
      const barFill = progressCardRef.current.querySelector('.progress-bar-fill');
      if (barFill) {
        gsap.fromTo(barFill,
          { width: '0%' },
          {
            width: `${progress.progress_persen || 0}%`,
            duration: 1.2,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: progressCardRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    // 3. Materi card staggered reveal on scroll
    const materiCards = materiContainerRef.current?.querySelectorAll('.materi-card');
    if (materiCards && materiCards.length > 0) {
      gsap.fromTo(materiCards,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.15)', // springy bounce
          scrollTrigger: {
            trigger: materiContainerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [materiList, progress, isGuru]);

  if (loading) return <DashboardSkeleton />;

  if (loadError && (isGuru ? !teacherStats : !progress || materiList.length === 0)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="font-display text-xl font-extrabold text-[var(--color-text)]">Dashboard belum dapat dimuat</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Periksa koneksi internet, lalu coba muat data kembali.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn btn-primary mt-5 gap-2 rounded-xl">
          <RefreshCw className="h-4 w-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  if (isGuru) {
    const stats = teacherStats || {};
    const statusRows = [
      { label: 'Sangat Baik', value: stats.chart?.distribusi?.sangat_baik || 0, color: 'bg-emerald-500' },
      { label: 'Cukup Baik', value: stats.chart?.distribusi?.cukup_baik || 0, color: 'bg-amber-500' },
      { label: 'Butuh Bimbingan', value: stats.chart?.distribusi?.butuh_bimbingan || 0, color: 'bg-rose-400' },
      { label: 'Belum Mulai', value: stats.chart?.distribusi?.belum_mulai || 0, color: 'bg-slate-400' },
    ];
    const totalStatus = statusRows.reduce((sum, row) => sum + row.value, 0);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-cyan-50/80 via-indigo-50/50 to-transparent dark:from-cyan-950/20 dark:via-indigo-950/20 md:block" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300">
                <GraduationCap className="h-4 w-4" /> Ruang kerja pengajar
              </div>
              <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
                Selamat datang, {user?.nama?.split(' ')[0] || 'Guru'}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                Pantau capaian belajar dan lanjutkan pengelolaan pembelajaran jaringan komputer.
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/admin" className="btn btn-primary w-full gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 md:w-auto">
                <BarChart3 className="h-4 w-4 shrink-0" /> Lihat Kemajuan Siswa
              </Link>
            </div>
          </div>
        </section>

        <section aria-label="Ringkasan kelas" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { label: 'Total Siswa', value: stats.total_siswa ?? 0, detail: 'Siswa terdaftar', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', surface: 'bg-indigo-50 dark:bg-indigo-950/40' },
            { label: 'Rata-rata Kelas', value: stats.rata_kelas ?? 0, detail: 'Skala nilai 0–100', icon: Award, color: 'text-amber-600 dark:text-amber-400', surface: 'bg-amber-50 dark:bg-amber-950/40' },
            { label: 'Selesai Semua Materi', value: stats.tuntas ?? 0, detail: `Dari ${stats.total_siswa ?? 0} siswa`, icon: UserRoundCheck, color: 'text-emerald-600 dark:text-emerald-400', surface: 'bg-emerald-50 dark:bg-emerald-950/40' },
            { label: 'Butuh Bimbingan', value: stats.butuh_bimbingan ?? 0, detail: 'Sudah mulai, nilai < 60', icon: TrendingDown, color: 'text-rose-600 dark:text-rose-300', surface: 'bg-rose-50 dark:bg-rose-950/40' },
          ].map((item) => (
            <div key={item.label} className="card flex min-h-28 flex-col items-start gap-3 p-4 xl:flex-row xl:items-center">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.surface} ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-black leading-none text-[var(--color-text)]">{item.value}</span>
                <span className="mt-2 block text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.detail}</span>
              </span>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="card p-5 lg:col-span-3">
            <div className="mb-5">
              <div>
                <h2 className="font-display text-base font-extrabold text-[var(--color-text)]">Kondisi capaian siswa</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stats.total_siswa ?? 0} siswa terdaftar. Distribusi berdasarkan progres dan nilai kuis.</p>
              </div>
            </div>
            {totalStatus === 0 ? (
              <div className="flex min-h-32 items-center justify-center text-sm text-[var(--color-text-secondary)]">Belum ada data capaian untuk ditampilkan.</div>
            ) : (
              <div className="space-y-4">
                {statusRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{row.label}</span>
                      <span className="text-xs font-bold text-[var(--color-text)]">{row.value} siswa · {Math.round((row.value / totalStatus) * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.value / totalStatus) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5 lg:col-span-2">
            <div className="mb-4">
              <h2 className="font-display text-base font-extrabold text-[var(--color-text)]">Akses cepat</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Kelola konten pembelajaran</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { to: '/admin/materi', icon: BookOpen, title: 'Kelola materi', description: `${materiList.length} materi tersedia` },
                { to: '/admin/kuis', icon: ClipboardList, title: 'Kelola kuis', description: 'Atur soal evaluasi per materi' },
              ].map((action) => (
                <Link key={action.to} to={action.to} className="group flex items-center gap-3 rounded-lg py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-300">
                    <action.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[var(--color-text)]">{action.title}</span>
                    <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">{action.description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero with ReactBits-style Border Glow (White Card Theme) */}
      <BorderGlow className="mb-8 shadow-md border border-slate-100 dark:border-slate-700/50 animate-fade-in-up z-10">
        <div className="p-8 md:p-12 relative">
          {/* Subtle light glow ornaments */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl animate-pulse-soft delay-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 mb-3 bg-indigo-50/80 border border-indigo-100/50 dark:bg-indigo-900/40 dark:border-indigo-800/50 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-100 dark:fill-indigo-800" />
                <span className="text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">Platform Pembelajaran</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-black mb-3 tracking-tight leading-none text-indigo-950 dark:text-white">
                Halo, {user?.nama?.split(' ')[0]}!
              </h1>
              <ScrollReveal
                baseOpacity={1}
                blurStrength={0}
                textClassName="text-slate-600 dark:text-slate-100 text-sm md:text-base leading-relaxed font-semibold block"
              >
                {`${user?.kelas ? `Kelas ${user.kelas} — ` : ''}Mari perluas wawasanmu tentang dunia Jaringan Komputer hari ini!`}
              </ScrollReveal>
            </div>
            <div className="flex flex-row md:flex-col lg:flex-row gap-3 shrink-0">
              <Link to="/materi" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/15">
                <BookOpen className="w-4.5 h-4.5" />
                Mulai Belajar
              </Link>
              <Link to="/nilai" className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 font-bold px-6 py-3 rounded-xl text-sm active:scale-95 transition-all flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50">
                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                Lihat Nilai
              </Link>
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Stats and Progress Row */}
      <div ref={statsContainerRef} className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: BookOpen, label: 'Total Materi', value: materiList.length, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 border-indigo-100/50 dark:bg-indigo-900/30 dark:border-indigo-800/40' },
          { icon: CheckCircle, label: 'Selesai Dipelajari', value: progress?.selesai || 0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 border-emerald-100/50 dark:bg-emerald-900/30 dark:border-emerald-800/40' },
          { icon: BarChart3, label: 'Kemajuan Belajar', value: `${progress?.progress_persen || 0}%`, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 border-cyan-100/50 dark:bg-cyan-900/30 dark:border-cyan-800/40' },
        ].map((s, i) => (
          <div key={i} className="card p-6 flex items-center gap-4 stats-card opacity-0">
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
        <div ref={progressCardRef} className="card p-6 mb-10 border border-slate-200/80 dark:border-slate-700/60 progress-card opacity-0">
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
            <span className="font-display font-black text-indigo-600 dark:text-indigo-400 text-2xl bg-indigo-50 dark:bg-indigo-900/40 px-3.5 py-1 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">{progress.progress_persen}%</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full progress-bar-fill"
              style={{
                width: '0%',
                background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
              }}
            />
          </div>
        </div>
      )}

      {/* Materi List */}
      <div ref={materiContainerRef}>
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
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className="card card-elevated overflow-hidden group flex flex-col justify-between border-slate-200/60 dark:border-slate-700/50 materi-card opacity-0"
              >
                <div>
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }} />
                  <MateriThumbnail materiId={m.id} index={idx} />
                  <div className="p-6">
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
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
                    <p className="text-xs text-[var(--color-text-secondary)] font-medium line-clamp-2 leading-relaxed">
                      Pelajari konsep {m.judul.toLowerCase()} untuk siswa kelas IX secara interaktif.
                    </p>
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
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 border-0" />
                          Skor: {m.nilai}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="tag tag-info text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      Mulai Belajar
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 group-hover:bg-[var(--color-brand-deep)] flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600 group-hover:border-transparent transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
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
