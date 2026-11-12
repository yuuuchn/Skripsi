import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MateriEditor from '../components/MateriEditor';
import { MATERI_ICONS, getMateriIcon } from '../utils/materiIcons';
import {
  Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowLeft, Save, X,
  ChevronDown, Search, Check,
} from 'lucide-react';

export default function AdminMateri() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=list view, {}=create, {id..}=edit
  const [form, setForm] = useState({ judul: '', konten: '', icon: 'BookOpen' });
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

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
      toast.error('Judul dan isi materi wajib diisi');
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/materi/${editing.id}`, form);
        toast.success('Materi berhasil diperbarui');
      } else {
        await api.post('/materi', form);
        toast.success('Materi baru berhasil ditambahkan');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Gagal menyimpan materi');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/materi/${id}`);
      toast.success('Materi berhasil dihapus');
      setConfirmDel(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Gagal menghapus materi');
    }
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

          <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5">Ikon Materi</label>
          <div className="mb-5">
            {(() => {
              const selectedMeta = MATERI_ICONS.find((ic) => ic.name === form.icon) || {
                name: form.icon || 'BookOpen',
                label: form.icon || 'Buku Materi',
                category: 'Ikon Materi',
                component: getMateriIcon(form.icon),
              };
              const SelectedIc = selectedMeta.component;
              return (
                <button
                  type="button"
                  onClick={() => {
                    setIconSearch('');
                    setShowIconPicker(true);
                  }}
                  className="w-full sm:w-auto min-w-[260px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-brand)] bg-[var(--color-card)] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-deep)] flex items-center justify-center shrink-0">
                      <SelectedIc className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[var(--color-text)]">{selectedMeta.label}</div>
                      <div className="text-[11px] text-[var(--color-text-secondary)]">{selectedMeta.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand)] pl-2">
                    <span>Pilih Ikon</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </button>
              );
            })()}
          </div>

          {showIconPicker && createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
              onClick={() => setShowIconPicker(false)}
            >
              <div
                className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl p-5 md:p-6 animate-scale-in flex flex-col max-h-[82vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-black text-base text-[var(--color-text)]">Pilih Ikon Materi</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Tersedia {MATERI_ICONS.length} pilihan ikon bertema jaringan &amp; pembelajaran
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Cari ikon (mis. router, wifi, server, keamanan, sejarah...)"
                    className="form-input w-full pl-9 py-2 text-xs"
                  />
                </div>

                {/* Grouped Icon Grid */}
                <div className="overflow-y-auto pr-1 space-y-5 flex-1">
                  {(() => {
                    const q = iconSearch.trim().toLowerCase();
                    const filtered = q
                      ? MATERI_ICONS.filter(
                          (ic) =>
                            ic.label.toLowerCase().includes(q) ||
                            ic.name.toLowerCase().includes(q) ||
                            ic.category.toLowerCase().includes(q)
                        )
                      : MATERI_ICONS;

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-10 text-xs text-[var(--color-text-secondary)]">
                          Ikon dengan kata kunci &quot;{iconSearch}&quot; tidak ditemukan.
                        </div>
                      );
                    }

                    const categories = [...new Set(filtered.map((ic) => ic.category))];
                    return categories.map((cat) => (
                      <div key={cat}>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                          {cat}
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {filtered
                            .filter((ic) => ic.category === cat)
                            .map((ic) => {
                              const Ic = ic.component;
                              const active = form.icon === ic.name;
                              return (
                                <button
                                  key={ic.name}
                                  type="button"
                                  onClick={() => {
                                    setForm({ ...form, icon: ic.name });
                                    setShowIconPicker(false);
                                  }}
                                  className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                    active
                                      ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-deep)] ring-2 ring-indigo-500/20'
                                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand)] hover:text-[var(--color-text)] hover:bg-slate-50 dark:hover:bg-slate-700/40'
                                  }`}
                                >
                                  {active && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                  <Ic className="w-5.5 h-5.5 shrink-0" />
                                  <span className="text-[10px] font-bold leading-tight line-clamp-1">
                                    {ic.label.split(' / ')[0]}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>,
            document.body
          )}

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
            const Ic = getMateriIcon(m.icon);
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

      {confirmDel && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  );
}
