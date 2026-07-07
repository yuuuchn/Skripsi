import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, Trophy, Send, CheckCircle, XCircle, FileText, Pencil, Eye, ArrowLeft } from 'lucide-react';

export default function Kuis() {
  const { materi_id } = useParams();
  const navigate = useNavigate();
  const [soalList, setSoalList] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    api.get(`/quiz/${materi_id}`)
      .then((res) => setSoalList(res.data))
      .catch(() => navigate('/materi'))
      .finally(() => setLoading(false));
  }, [materi_id, navigate]);

  const handlePilih = (soalId, pilihan) => {
    setJawaban((prev) => ({ ...prev, [soalId]: pilihan }));
  };

  const handleSubmit = async () => {
    const jawabanArr = soalList.map((s) => jawaban[s.id] || '');
    if (jawabanArr.some((j) => !j)) {
      alert('Jawab semua soal dulu ya!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/quiz/submit', { materi_id: parseInt(materi_id), jawaban: jawabanArr });
      setHasil(res.data);
    } catch (err) {
      alert('Gagal mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  };

  const jmlTerjawab = Object.keys(jawaban).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Result screen ──────────────────────────────────────
  if (hasil && !reviewMode) {
    const pct = hasil.nilai;
    const stiker = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
    const pesan = pct >= 80 ? 'Luar biasa! Kamu sangat memahaminya.' : pct >= 60 ? 'Bagus! Sedikit lagi menuju sempurna.' : 'Semangat! Baca kembali materinya dan coba lagi.';
    const tagColor = pct >= 80 ? 'tag-success' : pct >= 60 ? 'tag-warning' : 'tag-danger';
    const strokeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e';
    const ringBg = pct >= 80 ? 'bg-emerald-50' : pct >= 60 ? 'bg-amber-50' : 'bg-rose-50';
    const scoreColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';
    const circumference = 2 * Math.PI * 40;

    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="card p-8 md:p-10 text-center animate-fade-in-up border-slate-200/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 gradient-brand" />
          
          <div className="text-7xl mb-4 animate-float">{stiker}</div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[var(--color-text)] mb-1 tracking-tight">Kuis Selesai!</h2>
          <p className="text-[var(--color-text-secondary)] text-sm font-semibold mb-8 max-w-sm mx-auto">{pesan}</p>

          <div className="relative w-44 h-44 mx-auto mb-8 animate-ring-glow rounded-full p-2">
            <div className={`absolute inset-2 rounded-full ${ringBg} flex items-center justify-center border border-slate-100 shadow-inner`}>
              <div className="z-10 text-center">
                <div className={`stat-value text-5xl font-black ${scoreColor}`}>{pct}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nilai Kuis</div>
              </div>
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 relative z-0">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="7" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={strokeColor} strokeWidth="7.5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>

          <div className="flex justify-center flex-wrap gap-2.5 mb-8">
            <span className={`tag ${tagColor} text-xs font-bold py-1.5 px-3.5`}>
              <CheckCircle className="w-4 h-4" />
              Benar: {hasil.benar}
            </span>
            <span className="tag tag-danger text-xs font-bold py-1.5 px-3.5 bg-rose-50 text-rose-700 border-rose-100">
              <XCircle className="w-4 h-4" />
              Salah: {hasil.total - hasil.benar}
            </span>
            <span className="tag tag-info text-xs font-bold py-1.5 px-3.5 bg-slate-100 text-slate-700 border-slate-200">
              <FileText className="w-4 h-4 text-slate-500" />
              Total Soal: {hasil.total}
            </span>
          </div>

          <button onClick={() => setReviewMode(true)} className="btn btn-ghost font-bold py-3 rounded-xl w-full mb-3 border-indigo-200 hover:border-indigo-400 hover:text-indigo-600 gap-2">
            <Eye className="w-4.5 h-4.5" />
            Lihat Pembahasan
          </button>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(`/materi/${materi_id}`)} className="btn btn-ghost font-bold py-3 rounded-xl w-full sm:w-auto">
              <BookOpen className="w-4.5 h-4.5" />
              Kembali ke Materi
            </button>
            <button onClick={() => navigate('/nilai')} className="btn btn-primary font-bold py-3 rounded-xl shadow-md shadow-indigo-500/10 w-full sm:w-auto">
              <Trophy className="w-4.5 h-4.5 text-white" />
              Lihat Hasil Belajar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Review screen ──────────────────────────────────────
  if (hasil && reviewMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setReviewMode(false)} className="btn btn-ghost font-bold rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center gap-3">
            <span className="tag tag-success text-xs font-bold py-1.5 px-3.5">
              <CheckCircle className="w-4 h-4" />
              Benar {hasil.benar}
            </span>
            <span className="tag tag-danger text-xs font-bold py-1.5 px-3.5">
              <XCircle className="w-4 h-4" />
              Salah {hasil.total - hasil.benar}
            </span>
            <span className="font-display font-black text-lg text-indigo-600">{hasil.nilai}</span>
          </div>
        </div>

        <div className="space-y-6">
          {hasil.detail.map((soal, idx) => {
            const opsi = [
              { key: 'a', label: soal.opsi_a },
              { key: 'b', label: soal.opsi_b },
              { key: 'c', label: soal.opsi_c },
              { key: 'd', label: soal.opsi_d },
            ];

            return (
              <div key={soal.id} className="card p-6 md:p-8 border-slate-200/60 shadow-sm">
                <div className="flex items-start gap-3.5 mb-5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    soal.benar ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
                  }`}>
                    {soal.benar
                      ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                      : <XCircle className="w-5 h-5 text-rose-500" />
                    }
                  </div>
                  <p className="font-bold text-[var(--color-text)] leading-relaxed mt-0.5 text-base">{soal.soal}</p>
                </div>

                <div className="space-y-2.5">
                  {opsi.map((opt) => {
                    const isUserAnswer = soal.jawaban_user === opt.key;
                    const isCorrectAnswer = soal.jawaban_benar === opt.key;

                    let borderColor = 'border-slate-100';
                    let bgColor = '';
                    let textColor = 'text-slate-700';
                    let badgeBg = 'bg-slate-100 text-slate-500';
                    let showBadge = '';

                    if (isCorrectAnswer) {
                      borderColor = 'border-emerald-400';
                      bgColor = 'bg-emerald-50/60';
                      textColor = 'text-emerald-900';
                      badgeBg = 'bg-emerald-100 text-emerald-700';
                      showBadge = '✓ Jawaban Benar';
                    } else if (isUserAnswer && !soal.benar) {
                      borderColor = 'border-rose-300';
                      bgColor = 'bg-rose-50/40';
                      textColor = 'text-rose-900';
                      badgeBg = 'bg-rose-100 text-rose-700';
                      showBadge = '✗ Jawabanmu';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${borderColor} ${bgColor} ${textColor}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCorrectAnswer ? 'border-emerald-600 bg-emerald-600' :
                          isUserAnswer && !soal.benar ? 'border-rose-500 bg-rose-500' :
                          'border-slate-300'
                        }`}>
                          {(isCorrectAnswer || (isUserAnswer && !soal.benar)) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`font-mono font-bold text-xs shrink-0 py-0.5 px-2 rounded ${badgeBg}`}>
                          {opt.key.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold">{opt.label}</span>
                        {showBadge && (
                          <span className={`ml-auto text-[10px] font-bold py-0.5 px-2 rounded-full ${badgeBg}`}>
                            {showBadge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 mb-16 text-center">
          <button onClick={() => navigate(`/materi/${materi_id}`)} className="btn btn-ghost font-bold rounded-xl gap-2">
            <BookOpen className="w-4.5 h-4.5" />
            Kembali ke Materi
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz screen ────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 border-0 p-6 md:p-8 mb-6 text-white relative overflow-hidden shadow-lg animate-fade-in-up">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl animate-pulse-soft" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
              <Pencil className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-black tracking-tight">Kuis Pembelajaran</h1>
              <p className="text-white/80 text-xs font-semibold mt-0.5">Jawablah pertanyaan dengan jujur dan teliti</p>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 backdrop-blur-md text-center shrink-0">
            <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Terjawab</div>
            <div className="font-display font-black text-xl leading-none mt-0.5">{jmlTerjawab}/{soalList.length}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-5 mb-6 border-slate-200/60 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)] font-bold mb-2 ml-1">
          <span>Kuis Progress</span>
          <span className="font-mono">{Math.round((jmlTerjawab / soalList.length) * 100)}%</span>
        </div>
        <div className="bg-slate-100 rounded-full h-3 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(jmlTerjawab / soalList.length) * 100}%`, background: 'linear-gradient(90deg, #4f46e5, #06b6d4)' }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {soalList.map((soal, idx) => {
          const opsi = [
            { key: 'a', label: soal.opsi_a, color: 'hover:border-indigo-200 hover:bg-indigo-50/20', activeColor: 'bg-indigo-50/60 border-indigo-500 text-indigo-950' },
            { key: 'b', label: soal.opsi_b, color: 'hover:border-indigo-200 hover:bg-indigo-50/20', activeColor: 'bg-indigo-50/60 border-indigo-500 text-indigo-950' },
            { key: 'c', label: soal.opsi_c, color: 'hover:border-indigo-200 hover:bg-indigo-50/20', activeColor: 'bg-indigo-50/60 border-indigo-500 text-indigo-950' },
            { key: 'd', label: soal.opsi_d, color: 'hover:border-indigo-200 hover:bg-indigo-50/20', activeColor: 'bg-indigo-50/60 border-indigo-500 text-indigo-950' },
          ];

          return (
            <div key={soal.id} className="card p-6 md:p-8 animate-fade-in-up border-slate-200/60 shadow-sm" style={{ animationDelay: `${(idx + 2) * 0.08}s` }}>
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-sm text-[var(--color-brand-deep)]">{idx + 1}</span>
                </div>
                <p className="font-bold text-[var(--color-text)] leading-relaxed mt-0.5 text-base">{soal.soal}</p>
              </div>

              <div className="space-y-3">
                {opsi.map((opt) => {
                  const selected = jawaban[soal.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        selected
                          ? opt.activeColor + ' shadow-sm border-2'
                          : 'border-slate-100 ' + opt.color + ' text-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected ? 'border-indigo-600 bg-indigo-600 scale-105' : 'border-slate-300'
                      }`}>
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input
                        type="radio"
                        name={`soal-${soal.id}`}
                        className="hidden"
                        checked={selected}
                        onChange={() => handlePilih(soal.id, opt.key)}
                      />
                      <span className={`font-mono font-bold text-xs shrink-0 py-0.5 px-2 rounded ${selected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {opt.key.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="mt-10 mb-16 text-center animate-fade-in-up" style={{ animationDelay: `${(soalList.length + 3) * 0.08}s` }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || jmlTerjawab < soalList.length}
          className="btn btn-primary px-12 py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-indigo-500/15"
        >
          {submitting ? (
            <span className="animate-pulse-soft">Mengirim jawaban...</span>
          ) : jmlTerjawab < soalList.length ? (
            <>Selesaikan Kuis ({jmlTerjawab}/{soalList.length})</>
          ) : (
            <>
              <Send className="w-5 h-5 text-white" />
              Kumpulkan Kuis Anda
            </>
          )}
        </button>
      </div>
    </div>
  );
}
