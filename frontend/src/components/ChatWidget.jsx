import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import api from '../api/axios';
import { normalizeKelas } from '../utils/kelasUtils';
import {
  MessageSquare,
  X,
  Send,
  Users,
  GraduationCap,
  ChevronLeft,
  Trash2,
  Search,
  Sparkles,
  CheckCheck,
  Building2,
} from 'lucide-react';

function formatTime(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatWidget() {
  const { user } = useAuth();
  const isGuru = user?.role === 'guru';
  const myKelas = user?.role === 'siswa' ? normalizeKelas(user?.kelas) : '';

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('room'); // 'room' | 'dm'
  const [selectedRoom, setSelectedRoom] = useState('umum');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [contactSearch, setContactSearch] = useState('');

  const [overview, setOverview] = useState({
    teachers: [],
    students: [],
    kelasList: ['IX.1', 'IX.2', 'IX.3', 'IX.4', 'IX.5'],
    unreadCount: 0,
    unreadByUser: {},
  });
  const [messages, setMessages] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);

  const listEndRef = useRef(null);

  const fetchOverview = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get('/chat/overview');
      if (res.data) {
        setOverview(res.data);
      }
    } catch {
      // Abaikan jika tabel belum dibuat
    }
  }, [user?.id]);

  const fetchMessages = useCallback(async () => {
    if (!user?.id) return;
    if (tab === 'dm' && !selectedPartner) return;
    setLoadingMsg(true);
    try {
      const q =
        tab === 'dm'
          ? `/chat/messages?mode=dm&partner_id=${selectedPartner.id}`
          : `/chat/messages?mode=room&room=${encodeURIComponent(selectedRoom)}`;
      const res = await api.get(q);
      if (res.data?.tableMissing) {
        setTableMissing(true);
        setMessages([]);
      } else {
        setTableMissing(false);
        setMessages(Array.isArray(res.data) ? res.data : []);
      }

      if (tab === 'dm' && selectedPartner?.id) {
        await api.put('/chat/read', { sender_id: selectedPartner.id });
        fetchOverview();
      }
    } catch {
      // Abaikan error jaringan sementara
    } finally {
      setLoadingMsg(false);
    }
  }, [user?.id, tab, selectedRoom, selectedPartner, fetchOverview]);

  // Set default room untuk siswa ke kelasnya jika ada
  useEffect(() => {
    if (myKelas) {
      setSelectedRoom(myKelas);
    } else {
      setSelectedRoom('umum');
    }
  }, [myKelas]);

  // Jika siswa dan hanya ada 1 guru, otomatis pilih guru tersebut saat buka tab DM
  useEffect(() => {
    if (!isGuru && tab === 'dm' && !selectedPartner && overview.teachers.length === 1) {
      setSelectedPartner(overview.teachers[0]);
    }
  }, [isGuru, tab, selectedPartner, overview.teachers]);

  // Load overview saat pertama kali mount dan saat widget dibuka
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (open) {
      fetchOverview();
      fetchMessages();
    }
  }, [open, tab, selectedRoom, selectedPartner, fetchOverview, fetchMessages]);

  // Auto-scroll ke pesan paling bawah
  useEffect(() => {
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, open]);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('realtime_messages_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchOverview();
        if (open) {
          fetchMessages();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, open, fetchOverview, fetchMessages]);

  // Listener custom event agar halaman Admin bisa langsung membuka chat ke siswa tertentu
  useEffect(() => {
    const handleOpenDirectChat = (e) => {
      const targetUser = e.detail;
      if (!targetUser) return;
      setOpen(true);
      setTab('dm');
      setSelectedPartner(targetUser);
    };
    window.addEventListener('open-direct-chat', handleOpenDirectChat);
    return () => window.removeEventListener('open-direct-chat', handleOpenDirectChat);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const payload =
        tab === 'dm'
          ? { pesan: text.trim(), receiver_id: selectedPartner?.id }
          : { pesan: text.trim(), kelas: selectedRoom };
      await api.post('/chat/send', payload);
      setText('');
      await fetchMessages();
    } catch {
      // Gagal kirim
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.delete(`/chat/${msgId}`);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      // Abaikan
    }
  };

  if (!user) return null;

  // Daftar kontak untuk tab DM (Siswa melihat daftar Guru, Guru melihat daftar Siswa + Guru lain)
  const dmContacts = isGuru ? overview.students : overview.teachers;
  const filteredContacts = dmContacts.filter((c) => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return (
      c.nama?.toLowerCase().includes(q) ||
      c.username?.toLowerCase().includes(q) ||
      c.kelas?.toLowerCase().includes(q)
    );
  });

  // Urutkan kontak yang punya pesan belum dibaca di paling atas
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const unreadA = overview.unreadByUser[a.id] || 0;
    const unreadB = overview.unreadByUser[b.id] || 0;
    if (unreadB !== unreadA) return unreadB - unreadA;
    return (a.nama || '').localeCompare(b.nama || '');
  });

  // Pilihan room untuk siswa vs guru
  const studentRooms = myKelas ? [myKelas, 'umum'] : ['umum'];
  const teacherRooms = ['umum', ...overview.kelasList];

  return (
    <>
      {/* Tombol Mengambang (Floating Button) di Kiri Bawah agar tidak bentrok dengan tombol Sensor Tangan AI di Kanan Bawah */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Ruang Diskusi & Tanya Guru"
      >
        <div className="relative">
          <MessageSquare className="w-4.5 h-4.5" />
          {overview.unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow">
              {overview.unreadCount > 9 ? '9+' : overview.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">Diskusi & Tanya Guru</span>
      </button>

      {/* Panel Jendela Chat */}
      {open && (
        <div className="fixed bottom-20 left-4 right-4 sm:right-auto sm:left-5 z-50 sm:w-[390px] h-[520px] max-h-[78vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-4 py-3.5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="truncate">
                <h3 className="font-display font-extrabold text-sm leading-tight truncate">
                  Ruang Diskusi & Bimbingan
                </h3>
                <p className="text-[11px] text-white/80 font-medium truncate">
                  {isGuru
                    ? `${user.nama} • Mode Guru`
                    : `${user.nama} • ${myKelas ? `Kelas ${myKelas}` : 'Siswa'}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Tutup Chat"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* 2 Tab Utama: Diskusi Kelas & Japri Guru/Siswa */}
          <div className="grid grid-cols-2 gap-1 p-1.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <button
              type="button"
              onClick={() => setTab('room')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'room'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ruang Kelas</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('dm')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                tab === 'dm'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isGuru ? 'Pesan Siswa' : 'Tanya Guru'}</span>
              {overview.unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {overview.unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Sub-Header untuk Pemilih Kelas (Mode Room) atau Info Lawan Bicara (Mode DM) */}
          {tab === 'room' ? (
            <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Channel:</span>
              </div>
              {isGuru ? (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {teacherRooms.map((r) => (
                    <option key={r} value={r}>
                      {r === 'umum' ? '🌐 Semua Kelas (Umum)' : `🏫 Ruang Kelas ${r}`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  {studentRooms.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRoom(r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedRoom === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {r === 'umum' ? 'Umum' : `Kelas ${r}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            selectedPartner && (
              <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Daftar {isGuru ? 'Siswa' : 'Guru'}</span>
                </button>
                <div className="text-right truncate">
                  <span className="text-xs font-extrabold text-[var(--color-text)]">
                    {selectedPartner.nama}
                  </span>
                  {selectedPartner.kelas && (
                    <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {selectedPartner.kelas}
                    </span>
                  )}
                </div>
              </div>
            )
          )}

          {/* Isi Body */}
          {tableMissing ? (
            <div className="flex-1 p-5 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-xs font-bold text-[var(--color-text)] mb-1">
                Tabel Chat Belum Aktif di Supabase
              </p>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Jalankan query pembuatan tabel <code className="font-mono">messages</code> dari file{' '}
                <code className="font-mono">supabase_schema.sql</code> di SQL Editor Supabase Anda.
              </p>
            </div>
          ) : tab === 'dm' && !selectedPartner ? (
            /* Daftar Kontak untuk Chat Privat */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder={
                      isGuru ? 'Cari nama siswa atau kelas (mis. IX.1)...' : 'Cari nama guru...'
                    }
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
                {sortedContacts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                    Tidak ada kontak ditemukan
                  </div>
                ) : (
                  sortedContacts.map((c) => {
                    const unread = overview.unreadByUser[c.id] || 0;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedPartner(c)}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 ${
                              c.role === 'guru'
                                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                            }`}
                          >
                            {c.nama?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[var(--color-text)] truncate flex items-center gap-1.5">
                              <span>{c.nama}</span>
                              {c.role === 'guru' && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                                  Guru
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium truncate">
                              @{c.username} {c.kelas ? `• ${c.kelas}` : ''}
                            </div>
                          </div>
                        </div>
                        {unread > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0">
                            {unread} baru
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Daftar Pesan + Input Kirim Pesan */
            <>
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                {loadingMsg && messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs font-bold text-slate-400">Belum ada percakapan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tab === 'room'
                        ? `Mulai diskusi di channel ${selectedRoom === 'umum' ? 'Semua Kelas' : `Kelas ${selectedRoom}`}`
                        : `Kirim pesan ke ${selectedPartner?.nama}`}
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.sender_id === user.id;
                    const senderIsGuru = m.sender_role === 'guru';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {!isMine && (
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                              {m.sender_nama}
                            </span>
                            {senderIsGuru ? (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-white">
                                Guru
                              </span>
                            ) : (
                              m.sender_kelas && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {m.sender_kelas}
                                </span>
                              )
                            )}
                          </div>
                        )}
                        <div className="group flex items-center gap-1.5 max-w-[85%]">
                          {isGuru && isMine && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                              title="Hapus pesan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-2xs ${
                              isMine
                                ? 'bg-indigo-600 text-white rounded-br-xs'
                                : senderIsGuru
                                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                                : 'bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{m.pesan}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMine ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            >
                              <span>{formatTime(m.created_at)}</span>
                              {isMine && tab === 'dm' && m.is_read && (
                                <CheckCheck className="w-3 h-3 text-emerald-300" />
                              )}
                            </div>
                          </div>
                          {isGuru && !isMine && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                              title="Hapus pesan siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={listEndRef} />
              </div>

              {/* Form Input Pesan */}
              <form
                onSubmit={handleSend}
                className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Kirim"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
