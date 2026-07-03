import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  IlustrasiJaringan,
  IlustrasiLAN,
  IlustrasiMAN,
  IlustrasiWAN,
  IlustrasiMediaKabel,
  IlustrasiTopologi,
  IlustrasiSejarahInternet,
  IlustrasiDampakJaringan,
} from '../components/NetworkIllustration';
import PerangkatJaringan from '../components/PerangkatJaringan';
import { ArrowLeft, ArrowRight, BookOpen, RefreshCw, Pencil, ChevronRight, HelpCircle, Laptop, History, Globe, Cable, Router, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const materiGradients = {
  1: 'from-indigo-600 to-purple-600 shadow-indigo-500/10',
  2: 'from-cyan-600 to-blue-600 shadow-cyan-500/10',
  3: 'from-emerald-600 to-teal-600 shadow-emerald-500/10',
  4: 'from-orange-600 to-amber-600 shadow-amber-500/10',
  5: 'from-violet-600 to-fuchsia-600 shadow-violet-500/10',
  6: 'from-rose-600 to-pink-600 shadow-rose-500/10',
};

export default function DetailMateri() {
  const { id } = useParams();
  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/materi/${id}`)
      .then((res) => setMateri(res.data))
      .catch(() => alert('Materi tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading || !materi) return;

    const ctx = gsap.context(() => {
      // 1. Header (immediate fade-in slide down)
      gsap.fromTo('.materi-header-section',
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      // 2. Illustration Card (ScrollTrigger reveal)
      const illustrationCard = containerRef.current?.querySelector('.materi-illustration-card');
      if (illustrationCard) {
        gsap.fromTo(illustrationCard,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: illustrationCard,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 3. Prose/Content Card (ScrollTrigger reveal)
      const proseCard = containerRef.current?.querySelector('.materi-prose-card');
      if (proseCard) {
        gsap.fromTo(proseCard,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: proseCard,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 4. Footer navigation (ScrollTrigger reveal)
      const navFooter = containerRef.current?.querySelector('.materi-nav-footer');
      if (navFooter) {
        gsap.fromTo(navFooter,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: navFooter,
              start: 'top 95%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [loading, materi]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!materi) {
    return (
      <div className="text-center py-24 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <HelpCircle className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-lg font-bold text-[var(--color-text)]">Materi tidak ditemukan</p>
        <Link to="/materi" className="btn btn-ghost mt-4">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Materi
        </Link>
      </div>
    );
  }

  const gradientClass = materiGradients[materi.id] || 'from-indigo-600 to-purple-600 shadow-indigo-500/10';

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-8">
      {/* Header and Breadcrumb Section */}
      <div className="materi-header-section opacity-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-5">
          <Link to="/materi" className="hover:text-[var(--color-brand-deep)] flex items-center gap-1.5 transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            Materi
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[var(--color-text)] font-extrabold truncate max-w-[200px] sm:max-w-none">{materi.judul}</span>
        </nav>

        {/* Header */}
        <div className={`rounded-2xl bg-gradient-to-r ${gradientClass} p-8 md:p-10 mb-8 text-white relative overflow-hidden shadow-lg`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl animate-pulse-soft" />
          
          <div className="relative z-10 flex items-center gap-4.5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-sm shrink-0">
              {(() => {
                const IconComp = iconMap[materi.icon] || HelpCircle;
                return <IconComp className="w-8 h-8 text-white" />;
              })()}
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest font-mono">Pertemuan {materi.urutan}</div>
              <h1 className="font-display text-2xl md:text-3xl font-black mt-1 leading-tight tracking-tight">{materi.judul}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Illustrations with enhanced premium layout wrapper */}
      <div className="space-y-6 mb-8 materi-illustration-card opacity-0">
        {materi.id === 1 && (
          <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
            <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Visualisasi Jaringan Komputer</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Membantu memahami bagaimana komputer saling terhubung satu sama lain</p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
              <IlustrasiJaringan />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-4 font-semibold">Komputer klien terhubung secara terpusat melalui Switch/Hub ke jaringan internet</p>
          </div>
        )}

        {materi.id === 2 && (
          <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
            <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Garis Waktu Sejarah Internet</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Perjalanan evolusi internet dari tahun 1969 hingga era modern nirkabel</p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto overflow-x-auto">
              <IlustrasiSejarahInternet />
            </div>
          </div>
        )}

        {materi.id === 3 && (
          <div className="space-y-6">
            <div className="card p-6 md:p-8 border-slate-200/60 bg-slate-50/20">
              <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Pengelompokan Jaringan Berdasarkan Jangkauan Geografis</h3>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Membandingkan cakupan area LAN, MAN, dan WAN</p>
              
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { title: 'LAN (Local Area Network)', Component: IlustrasiLAN, desc: 'Jaringan area lokal seperti rumah, sekolah, atau lab.' },
                  { title: 'MAN (Metropolitan Area Network)', Component: IlustrasiMAN, desc: 'Menghubungkan jaringan komputer antar lokasi di satu kota.' },
                  { title: 'WAN (Wide Area Network)', Component: IlustrasiWAN, desc: 'Menghubungkan jaringan komputer skala negara bahkan benua.' },
                ].map(({ title, Component, desc }) => (
                  <div key={title} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-xs text-indigo-950 mb-4 text-center">{title}</h4>
                      <div className="my-2"><Component /></div>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-4 font-medium text-center leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
              <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Jenis Topologi Jaringan</h3>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Bentuk fisik tata letak pemasangan komputer dalam jaringan</p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
                <IlustrasiTopologi />
              </div>
            </div>
          </div>
        )}

        {materi.id === 4 && (
          <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
            <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Media Transmisi Jaringan</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Saluran fisik untuk mengirimkan data/informasi dalam jaringan</p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
              <IlustrasiMediaKabel />
            </div>
          </div>
        )}

        {materi.id === 5 && (
          <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
            <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Perangkat Keras Jaringan Komputer</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Peralatan fisik pendukung operasional sistem jaringan</p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
              <PerangkatJaringan />
            </div>
          </div>
        )}

        {materi.id === 6 && (
          <div className="card p-6 md:p-8 text-center border-slate-200/60 bg-slate-50/20">
            <h3 className="font-display font-extrabold text-base text-[var(--color-text)] mb-1">Perbandingan Dampak Jaringan Komputer</h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-6">Memahami sisi positif (manfaat) dan sisi negatif (bahaya) internet bagi siswa</p>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto overflow-x-auto">
              <IlustrasiDampakJaringan />
            </div>
          </div>
        )}
      </div>

      {/* Content Card with optimized reading typography */}
      <div className="card p-6 md:p-10 mb-8 border-slate-200/60 shadow-sm materi-prose-card opacity-0">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: materi.konten }} />
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mb-12 materi-nav-footer opacity-0">
        {materi.urutan > 1 ? (
          <Link to={`/materi/${materi.urutan - 1}`} className="btn btn-ghost font-bold rounded-xl gap-2 active:scale-95 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </Link>
        ) : <div />}

        {materi.selesai ? (
          <Link to={`/kuis/${materi.id}`} className="btn btn-ghost hover:border-indigo-400 hover:text-indigo-600 bg-white font-bold rounded-xl gap-2 active:scale-95 transition-all">
            <RefreshCw className="w-4 h-4 text-indigo-500" />
            Ulangi Kuis
          </Link>
        ) : (
          <Link to={`/kuis/${materi.id}`} className="btn btn-primary font-bold rounded-xl gap-2 active:scale-95 transition-all shadow-md shadow-indigo-500/10">
            <Pencil className="w-4 h-4 text-white" />
            Kerjakan Kuis
          </Link>
        )}
      </div>
    </div>
  );
}
