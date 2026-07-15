import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Pencil, Trash2, ArrowLeft, Save, X, HelpCircle, CheckCircle2, AlertTriangle,
} from 'lucide-react';

const OPSI = ['a', 'b', 'c', 'd'];
const emptyForm = () => ({ soal: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban: 'a' });

export default function AdminKuis() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [materiList, setMateriList] = useState([]);
  const [materiId, setMateriId] = useState('');
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null=list, {}=create, {id..}=edit
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'guru') navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    api.get('/materi').then((res) => {
      setMateriList(res.data);
      if (res.data.length) setMateriId(String(res.data[0].id));
    });
  }, []);

  const load = () => {
    if (!materiId) return;
    setLoading(true);
    api.get(`/quiz/manage/${materiId}`).then((res) => setSoalList(res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); setEditing(null); }, [materiId]);

  const openCreate = () => { setForm(emptyForm()); setEditing({}); };
  const openEdit = (s) => {
    setForm({ soal: s.soal, opsi_a: s.opsi_a, opsi_b: s.opsi_b, opsi_c: s.opsi_c, opsi_d: s.opsi_d, jawaban: s.jawaban });
    setEditing(s);
  };

  const save = async () => {
    if (!form.soal.trim() || OPSI.some((o) => !form[`opsi_${o}`].trim())) {
      alert('Soal dan keempat opsi wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, materi_id: Number(materiId) };
      if (editing.id) await api.put(`/quiz/${editing.id}`, payload);
      else await api.post('/quiz', payload);
      setEditing(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    await api.delete(`/quiz/${id}`);
    setConfirmDel(null);
    load();
  };

  // ---------- FORM VIEW ----------
  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => setEditing(null)} className="btn btn-ghost gap-2 mb-4 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="card p-6 md:p-8">
          <h1 className="font-display text-xl font-black text-[var(--color-text)] mb-6">
            {editing.id ? 'Edit Soal' : 'Tambah Soal Baru'}
          </h1>

          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Pertanyaan</label>
          <textarea
            value={form.soal}
            onChange={(e) => setForm({ ...form, soal: e.target.value })}
            rows={3}
            className="form-input w-full mb-4 resize-y"
            placeholder="Tulis pertanyaan di sini..."
          />

          {OPSI.map((o) => (
            <div key={o} className="mb-3">
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-2">
                <span className="uppercase">Opsi {o}</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, jawaban: o })}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    form.jawaban === o
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-brand-soft)]'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" /> {form.jawaban === o ? 'Jawaban benar' : 'Tandai benar'}
                </button>
              </label>
              <input
                value={form[`opsi_${o}`]}
                onChange={(e) => setForm({ ...form, [`opsi_${o}`]: e.target.value })}
                className={`form-input w-full ${form.jawaban === o ? 'ring-2 ring-emerald-400/60' : ''}`}
                placeholder={`Isi opsi ${o.toUpperCase()}`}
              />
            </div>
          ))}

          <div className="flex gap-2.5 mt-6">
            <button onClick={save} disabled={saving} className="btn btn-primary gap-2 rounded-xl disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => setEditing(null)} className="btn btn-ghost gap-2 rounded-xl">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- LIST VIEW ----------
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="btn btn-ghost gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Panel Guru
          </button>
          <h1 className="font-display text-xl font-black text-[var(--color-text)]">Kelola Kuis</h1>
        </div>
        <button onClick={openCreate} disabled={!materiId} className="btn btn-primary gap-2 rounded-xl disabled:opacity-50">
          <Plus className="w-4 h-4" /> Tambah Soal
        </button>
      </div>

      <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Pilih Materi</label>
      <select
        value={materiId}
        onChange={(e) => setMateriId(e.target.value)}
        className="form-input w-full mb-5"
      >
        {materiList.map((m) => (
          <option key={m.id} value={m.id}>{m.judul}</option>
        ))}
      </select>

      {loading ? (
        <div className="text-center text-[var(--color-text-secondary)] py-16">Memuat...</div>
      ) : soalList.length === 0 ? (
        <div className="card p-6 flex items-start gap-3 text-[var(--color-text-secondary)]">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            Materi ini belum punya soal kuis. Siswa tidak akan melihat kuis di halaman materi ini.
            Klik <span className="font-bold">"Tambah Soal"</span> untuk membuat.
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {soalList.map((s, i) => (
            <div key={s.id} className="card p-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-brand-soft)] flex items-center justify-center text-[var(--color-brand-deep)] text-xs font-black shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[var(--color-text)] mb-1">{s.soal}</div>
                <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Jawaban: <span className="font-bold uppercase">{s.jawaban}</span> — {s[`opsi_${s.jawaban}`]}
                </div>
              </div>
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]" title="Edit">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setConfirmDel(s)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)]" title="Hapus">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setConfirmDel(null)}>
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-6 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-[var(--color-rose)]" />
            </div>
            <h3 className="font-display font-black text-base text-[var(--color-text)]">Hapus soal ini?</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              "{confirmDel.soal}" akan dihapus permanen.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button onClick={() => setConfirmDel(null)} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors active:scale-95">
                Batal
              </button>
              <button onClick={() => del(confirmDel.id)} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors active:scale-95 shadow-md shadow-rose-600/20">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
