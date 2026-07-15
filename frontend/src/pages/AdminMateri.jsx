import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MateriEditor from '../components/MateriEditor';
import {
  BookOpen, Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft, Save, X,
  Laptop, History, Globe, Cable, Router, ShieldCheck, HelpCircle,
} from 'lucide-react';

const iconMap = {
  Laptop, History, Globe, Cable, Router, ShieldCheck, BookOpen,
};
const iconOptions = Object.keys(iconMap);

export default function AdminMateri() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=list view, {}=create, {id..}=edit
  const [form, setForm] = useState({ judul: '', konten: '', icon: 'BookOpen' });
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'guru') navigate('/dashboard');
  }, [user, navigate]);

  const load = () => {
    setLoading(true);
    api.get('/materi').then((res) => setList(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setForm({ judul: '', konten: '', icon: 'BookOpen' });
    setEditing({});
  };
  const openEdit = async (m) => {
    const res = await api.get(`/materi/${m.id}`);
    setForm({ judul: res.data.judul, konten: res.data.konten, icon: res.data.icon || 'BookOpen' });
    setEditing(res.data);
  };

  const save = async () => {
    if (!form.judul.trim() || !form.konten.trim()) {
      alert('Judul dan isi materi wajib diisi');
      return;
    }
    setSaving(true);
    try {
      if (editing.id) await api.put(`/materi/${editing.id}`, form);
      else await api.post('/materi', form);
      setEditing(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    await api.delete(`/materi/${id}`);
    setConfirmDel(null);
    load();
  };

  const move = async (idx, dir) => {
    const next = [...list];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setList(next);
    await api.put('/materi/reorder', { order: next.map((m) => m.id) });
  };

  // ---------- FORM VIEW ----------
  if (editing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button onClick={() => setEditing(null)} className="btn btn-ghost gap-2 mb-4 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="card p-6 md:p-8">
          <h1 className="font-display text-xl font-black text-[var(--color-text)] mb-6">
            {editing.id ? 'Edit Materi' : 'Tambah Materi Baru'}
          </h1>

          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Judul Materi</label>
          <input
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="form-input w-full mb-4"
            placeholder="mis. Apa Itu Jaringan Komputer?"
          />

          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Ikon</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {iconOptions.map((name) => {
              const Ic = iconMap[name];
              const active = form.icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setForm({ ...form, icon: name })}
                  title={name}
                  className={`p-2.5 rounded-xl border transition-all ${
                    active
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-deep)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand)]'
                  }`}
                >
                  <Ic className="w-5 h-5" />
                </button>
              );
            })}
          </div>

          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Isi Materi</label>
          <MateriEditor value={form.konten} onChange={(html) => setForm((f) => ({ ...f, konten: html }))} />

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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="btn btn-ghost gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Panel Guru
          </button>
          <h1 className="font-display text-xl font-black text-[var(--color-text)]">Kelola Materi</h1>
        </div>
        <button onClick={openCreate} className="btn btn-primary gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[var(--color-text-secondary)] py-16">Memuat...</div>
      ) : list.length === 0 ? (
        <div className="card p-10 text-center text-[var(--color-text-secondary)]">Belum ada materi. Klik "Tambah".</div>
      ) : (
        <div className="space-y-2.5">
          {list.map((m, i) => {
            const Ic = iconMap[m.icon] || HelpCircle;
            return (
              <div key={m.id} className="card p-4 flex items-center gap-3">
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="p-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="p-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-soft)] flex items-center justify-center text-[var(--color-brand-deep)] shrink-0">
                  <Ic className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[var(--color-text)] truncate">{m.judul}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">Materi {i + 1}</div>
                </div>
                <button onClick={() => openEdit(m)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirmDel(m)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-rose)] hover:bg-[var(--color-rose-soft)]" title="Hapus">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setConfirmDel(null)}>
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-6 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-[var(--color-rose)]" />
            </div>
            <h3 className="font-display font-black text-base text-[var(--color-text)]">Hapus materi ini?</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
              "{confirmDel.judul}" beserta kuis & progres siswa terkait akan dihapus permanen.
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
