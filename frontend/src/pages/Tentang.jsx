import { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Hand, 
  School, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MousePointer,
  Camera
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Tentang() {
  const [activeTab, setActiveTab] = useState('profil'); // 'profil' | 'tujuan' | 'panduan' | 'teknologi'

  const tabs = [
    { id: 'profil', label: 'Profil Pengembang', icon: User },
    { id: 'tujuan', label: 'Tujuan Pembelajaran', icon: Target },
    { id: 'panduan', label: 'Petunjuk Media & Sensor', icon: Hand },
    { id: 'teknologi', label: 'Spesifikasi Media', icon: Cpu },
  ];

  const tujuanList = [
    {
      no: 1,
      materi: 'Apa Itu Jaringan Komputer?',
      tujuan: 'Peserta didik mampu menjelaskan konsep dasar dan fungsi jaringan komputer dalam menghubungkan perangkat dan berbagi sumber daya secara tepat.',
      indikator: ['Menjelaskan definisi jaringan komputer', 'Menyebutkan tujuan & manfaat jaringan dalam kehidupan sehari-hari']
    },
    {
      no: 2,
      materi: 'Perjalanan Internet: Dari ARPANET sampai WiFi',
      tujuan: 'Peserta didik mampu menguraikan sejarah singkat perkembangan internet dari ARPANET hingga teknologi nirkabel modern.',
      indikator: ['Mengetahui tonggak sejarah lahirnya ARPANET', 'Memahami evolusi jaringan kabel menuju nirkabel']
    },
    {
      no: 3,
      materi: 'LAN, MAN, WAN — Kenali Jenis Jaringannya!',
      tujuan: 'Peserta didik mampu mengklasifikasikan jenis jaringan komputer berdasarkan jangkauan geografisnya (PAN, LAN, MAN, WAN).',
      indikator: ['Membedakan karakteristik LAN, MAN, dan WAN', 'Memberikan contoh penerapan masing-masing tipe jaringan']
    },
    {
      no: 4,
      materi: 'Media Transmisi: Kabel vs Nirkabel',
      tujuan: 'Peserta didik mampu membandingkan media transmisi berkabel (guided) dan nirkabel (unguided) beserta kelebihan dan kekurangannya.',
      indikator: ['Menganalisis perbedaan kabel UTP, Fiber Optic, dan Gelombang Radio/WiFi', 'Menentukan media transmisi yang sesuai untuk kebutuhan tertentu']
    },
    {
      no: 5,
      materi: 'Perangkat Jaringan yang Sering Kamu Temui',
      tujuan: 'Peserta didik mampu mengidentifikasi nama, fungsi, dan wujud fisik perangkat keras jaringan komputer.',
      indikator: ['Mengenali router, switch/hub, access point, modem, dan kabel/konektor RJ45', 'Menjelaskan peran tiap perangkat dalam lalu lintas data']
    },
    {
      no: 6,
      materi: 'Manfaat & Dampak Jaringan Komputer',
      tujuan: 'Peserta didik mampu menganalisis dampak positif serta menyadari potensi bahaya dan etika keamanan dalam penggunaan jaringan/internet.',
      indikator: ['Menjelaskan manfaat jaringan di bidang pendidikan dan komunikasi', 'Menerapkan prinsip etika digital (cyber security & privasi data)']
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
      {/* Header Banner */}
      <div className="card bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 border-0 p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-xl animate-fade-in-up">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-purple-500/20 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md mb-3">
            <School className="w-3.5 h-3.5" />
            SMP Negeri 01 Belitang Mulya
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight">
            Informasi Media & Profil Pengembang
          </h1>
          <p className="text-white/85 text-xs md:text-sm font-medium mt-1.5 max-w-2xl leading-relaxed">
            Media Pembelajaran Interaktif E-Learning Mata Pelajaran Informatika (Elemen Jaringan Komputer & Internet) berbasis Web dan Hand Tracking Sensor.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                  : 'bg-white dark:bg-slate-800 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profil Pengembang */}
      {activeTab === 'profil' && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Biodata Peneliti */}
          <div className="card p-6 md:p-8 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-500/25 shrink-0 border-2 border-white dark:border-slate-800">
                <User className="w-12 h-12" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] mb-2 border border-indigo-100 dark:border-indigo-900/50">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Peneliti / Pengembang Media
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[var(--color-text)]">
                  Tegar Fahrezi
                </h2>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">
                  Mahasiswa Program Studi Teknologi Pendidikan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-semibold">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">NIM</span>
                    <span className="text-[var(--color-text)] font-mono text-sm">06031282126048</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Program Studi</span>
                    <span className="text-[var(--color-text)]">Teknologi Pendidikan</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Fakultas</span>
                    <span className="text-[var(--color-text)]">Keguruan dan Ilmu Pendidikan (FKIP)</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Universitas</span>
                    <span className="text-[var(--color-text)]">Universitas Sriwijaya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Informasi Pembimbing & Lokasi Penelitian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dosen Pembimbing */}
            <div className="card p-6 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/50">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[var(--color-text)]">Dosen Pembimbing</h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">Pembimbing Skripsi & R&D</p>
                </div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">Dosen Pembimbing I</span>
                  <div className="font-bold text-[var(--color-text)] mt-0.5 text-sm">Dr. Dedi Nurhadiat, M.Pd.</div>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Dosen Teknologi Pendidikan FKIP</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider block">Dosen Pembimbing II</span>
                  <div className="font-bold text-[var(--color-text)] mt-0.5 text-sm">Drs. Lisnani, M.Pd.</div>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">Dosen Teknologi Pendidikan FKIP</span>
                </div>
              </div>
            </div>

            {/* Lokasi Penelitian */}
            <div className="card p-6 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-100 dark:border-cyan-900/50">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[var(--color-text)]">Lokasi & Subjek Penelitian</h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">Tempat Uji Coba Produk</p>
                </div>
              </div>
              <div className="space-y-2.5 text-xs font-medium text-[var(--color-text-secondary)]">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider block">Sekolah Mitra</span>
                  <div className="font-bold text-[var(--color-text)] text-sm mt-0.5">SMP Negeri 01 Belitang Mulya</div>
                  <p className="text-[11px] text-slate-500 mt-1">Kab. Ogan Komering Ulu Timur, Sumatera Selatan</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Sasaran Pengguna</span>
                    <span className="font-bold text-[var(--color-text)]">Siswa Kelas IX & Guru Informatika</span>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-bold rounded-lg text-[10px]">
                    Kurikulum Merdeka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Capaian & Tujuan Pembelajaran */}
      {activeTab === 'tujuan' && (
        <div className="space-y-6 animate-fade-in">
          {/* Capaian Pembelajaran (CP) Box */}
          <div className="card p-6 md:p-7 border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-800 dark:to-slate-800 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Capaian Pembelajaran (CP) — Fase D (SMP)
                </span>
                <h3 className="font-display font-black text-lg text-[var(--color-text)] mt-0.5">
                  Elemen: Jaringan Komputer dan Internet (JKI)
                </h3>
                <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                  Pada akhir fase D, peserta didik mampu <strong>memahami konektivitas jaringan komputer</strong>, baik lokal maupun internet, mengenal berbagai <strong>media transmisi serta perangkat keras jaringan</strong>, serta mampu memahami <strong>keamanan data dan dampak penggunaan teknologi jaringan</strong> dalam kehidupan sehari-hari secara aman dan bertanggung jawab.
                </p>
              </div>
            </div>
          </div>

          {/* List Tujuan Pembelajaran per Materi */}
          <div>
            <h3 className="font-display font-bold text-base text-[var(--color-text)] mb-3 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
              Tujuan Pembelajaran Khusus (TP)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tujuanList.map((item) => (
                <div key={item.no} className="card p-5 border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                        {item.no}
                      </span>
                      <h4 className="font-display font-bold text-sm text-[var(--color-text)]">
                        {item.materi}
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                      {item.tujuan}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Indikator Ketercapaian:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)]">
                      {item.indikator.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Petunjuk Penggunaan Media & Sensor Tangan */}
      {activeTab === 'panduan' && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Cara Belajar */}
          <div className="card p-6 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="font-display font-bold text-base text-[var(--color-text)] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Alur Pembelajaran Siswa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/60 dark:border-indigo-900/40">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-3">1</div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">Pelajari Materi</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Buka menu <strong>Belajar</strong>. Baca konsep, amati ilustrasi topologi jaringan, dan cermati contoh perangkat keras.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100/60 dark:border-purple-900/40">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs mb-3">2</div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">Kerjakan Kuis Evaluasi</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Selesaikan 10 butir soal kuis di setiap materi. Tombol <em>Kumpulkan</em> akan aktif otomatis saat semua soal terjawab.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-3">3</div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">Cek Nilai & Rapor</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Lihat rekap skor dan progres ketuntasan belajarmu di menu <strong>Nilai</strong>, serta ulas kembali pembahasan soal.
                </p>
              </div>
            </div>
          </div>

          {/* Card Panduan Hand Sensor (Inovasi Media) */}
          <div className="card p-6 md:p-8 border-slate-200/80 dark:border-slate-700/80 shadow-sm bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-800 dark:to-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Hand className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-[var(--color-text)]">
                  Panduan Fitur Sensor Tangan (Touchless Hand Tracking)
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                  Mengendalikan media pembelajaran tanpa menyentuh mouse atau layar menggunakan kamera webcam
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gestur 1 */}
              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <MousePointer className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">1. Menggerakkan Kursor</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Arahkan <strong>ujung jari telunjuk</strong> ke kamera laptop/webcam. Titik kursor ungu di layar akan mengikuti posisi jarimu secara realtime.
                </p>
              </div>

              {/* Gestur 2 */}
              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Hand className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">2. Klik / Memilih (Pinch)</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Satukan <strong>ujung jempol dan jari telunjuk</strong> (seperti mencubit/cubit kecil). Kursor akan membesar dan mengeksekusi klik pada tombol/pilihan jawaban.
                </p>
              </div>

              {/* Gestur 3 */}
              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-xs text-[var(--color-text)] mb-1">3. Jarak & Pencahayaan</h4>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  Posisikan tangan berjarak <strong>40 – 70 cm</strong> dari kamera dengan pencahayaan ruangan yang cukup agar sensor mendeteksi tangan dengan akurat.
                </p>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600" />
              <span>
                <strong>Jaminan Privasi Siswa:</strong> Video webcam diproses sepenuhnya secara lokal di browser perangkat Anda (*on-device AI*) dan tidak pernah disimpan atau dikirim ke server mana pun.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Spesifikasi & Desain Instruksional Media */}
      {activeTab === 'teknologi' && (
        <div className="space-y-6 animate-fade-in">
          {/* Model Pengembangan */}
          <div className="card p-6 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="font-display font-bold text-base text-[var(--color-text)] mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Model Pengembangan Instruksional: ADDIE
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Media pembelajaran ini dikembangkan dengan pendekatan <strong>Research and Development (R&D)</strong> mengacu pada model prosedural <strong>ADDIE (Branch, 2009)</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-black text-indigo-600 dark:text-indigo-400 block text-sm">A</span>
                <span className="font-bold text-[var(--color-text)] block text-[11px] mt-0.5">Analysis</span>
                <span className="text-[10px] text-slate-400">Analisis Kebutuhan Siswa & Kurikulum</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-black text-purple-600 dark:text-purple-400 block text-sm">D</span>
                <span className="font-bold text-[var(--color-text)] block text-[11px] mt-0.5">Design</span>
                <span className="text-[10px] text-slate-400">Perancangan UI, Naskah Materi, & Kuis</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-black text-pink-600 dark:text-pink-400 block text-sm">D</span>
                <span className="font-bold text-[var(--color-text)] block text-[11px] mt-0.5">Development</span>
                <span className="text-[10px] text-slate-400">Pemrograman Web & Integrasi Sensor</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-black text-emerald-600 dark:text-emerald-400 block text-sm">I</span>
                <span className="font-bold text-[var(--color-text)] block text-[11px] mt-0.5">Implementation</span>
                <span className="text-[10px] text-slate-400">Uji Coba di SMPN 01 Belitang Mulya</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-black text-amber-600 dark:text-amber-400 block text-sm">E</span>
                <span className="font-bold text-[var(--color-text)] block text-[11px] mt-0.5">Evaluation</span>
                <span className="text-[10px] text-slate-400">Evaluasi Formatif & Uji Kelayakan</span>
              </div>
            </div>
          </div>

          {/* Spesifikasi Teknis */}
          <div className="card p-6 border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="font-display font-bold text-base text-[var(--color-text)] mb-3 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              Spesifikasi Perangkat Lunak & Teknologi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Frontend UI</span>
                <span className="font-bold text-[var(--color-text)] block mt-0.5">React 19 & Tailwind CSS v4</span>
                <span className="text-[10px] text-slate-500">Single Page Application (Vite)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Hand Tracking AI</span>
                <span className="font-bold text-[var(--color-text)] block mt-0.5">Google MediaPipe Vision</span>
                <span className="text-[10px] text-slate-500">21 3D Hand Landmark Detection</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Backend & API</span>
                <span className="font-bold text-[var(--color-text)] block mt-0.5">Node.js + Express.js</span>
                <span className="text-[10px] text-slate-500">REST API & JWT Authentication</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Basis Data</span>
                <span className="font-bold text-[var(--color-text)] block mt-0.5">SQLite (sql.js)</span>
                <span className="text-[10px] text-slate-500">File-based Relational Database</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
