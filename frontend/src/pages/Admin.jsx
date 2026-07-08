import { useState, useEffect } from 'react';
import api from '../api/axios';
import { GraduationCap, Users, AlertCircle, Award, Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Admin() {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    api.get(`/progress/admin?page=${page}&limit=${limit}`)
      .then((res) => {
        setSiswaList(res.data.siswa);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const filteredSiswa = siswaList.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 border-0 p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/10 animate-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl animate-pulse-soft" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-sm shrink-0">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight">Panel Guru</h1>
            <p className="text-white/80 text-xs md:text-sm font-semibold mt-0.5">Pantau kemajuan belajar dan hasil pencapaian kuis seluruh siswa</p>
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="card p-12 text-center border-slate-200/60 dark:border-slate-700/60 max-w-lg mx-auto shadow-sm animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--color-text)] mb-2">Belum Ada Data Siswa</h2>
          <p className="text-[var(--color-text-secondary)] text-sm font-medium">Belum ada siswa yang mendaftar di sistem.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls & Metrics Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up animate-delay-100">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama atau username siswa..."
                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <span className="tag tag-info bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-100/50 dark:border-indigo-800/50 py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Users className="w-4 h-4" />
                Total Siswa: {total} orang
              </span>
              {searchQuery && filteredSiswa.length < siswaList.length && (
                <span className="tag tag-warning bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-100/50 dark:border-amber-800/50 py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm animate-fade-in">
                  Halaman ini: {filteredSiswa.length} orang
                </span>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div className="card overflow-hidden border-slate-200/60 dark:border-slate-700/60 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <h2 className="font-display font-extrabold text-base text-[var(--color-text)] flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
                Daftar Kemajuan Siswa
              </h2>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                Halaman {page} / {totalPages}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Materi Selesai</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rata-rata Nilai</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-700/80">
                  {filteredSiswa.map((s, idx) => {
                    const pct = s.rata_rata;
                    const tagClass = pct >= 80 ? 'tag-success' : pct >= 60 ? 'tag-warning' : 'tag-danger';
                    const label = pct >= 80 ? 'Sangat Baik' : pct >= 60 ? 'Cukup Baik' : 'Butuh Bimbingan';
                    const averageScoreColor = pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
                    const averageScoreBg = pct >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/30' : pct >= 60 ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-rose-50 dark:bg-rose-900/30';

                    const totalMateriCount = 6;
                    const selesaiCount = s.materi_selesai || 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4.5 text-sm font-semibold text-slate-400 dark:text-slate-500">{(page - 1) * limit + idx + 1}</td>
                        <td className="px-6 py-4.5">
                          <div className="font-bold text-sm text-[var(--color-text)]">{s.nama}</div>
                        </td>
                        <td className="px-6 py-4.5 text-xs text-slate-500 dark:text-slate-400 font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-100/50 dark:border-slate-700/50 rounded-lg px-2 py-1 inline-block mt-2.5">{s.username}</td>
                        <td className="px-6 py-4.5">
                          <span className="tag tag-info text-[10px] font-bold py-1 px-2.5 bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 border-slate-200/80 dark:border-slate-600/80">
                            {s.kelas || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{selesaiCount} / {totalMateriCount}</span>
                            <div className="flex gap-0.5 mt-1.5">
                              {[...Array(totalMateriCount)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < selesaiCount ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 font-bold ${averageScoreBg} ${averageScoreColor}`}>
                            <Award className="w-3.5 h-3.5 fill-current border-0 shrink-0" />
                            <span className="stat-value text-base font-black leading-none">{s.rata_rata}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <span className={`tag ${tagClass} text-[10px] py-1 px-3 font-bold`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredSiswa.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                        Tidak ada siswa yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 animate-fade-in-up">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-ghost py-2.5 px-3.5 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-slate-300 dark:text-slate-600 text-xs font-bold px-1">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        p === page
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn btn-ghost py-2.5 px-3.5 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
