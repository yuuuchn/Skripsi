import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    if (token.startsWith('user_')) {
      const id = parseInt(token.replace('user_', ''), 10);
      return { id };
    }
    // Backward compatibility for JWT: parse payload if possible
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
}

export const api = {
  get: async (url) => {
    const curUser = getCurrentUser();
    const cleanUrl = url.split('?')[0];
    const params = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');

    // 1. Stats publik
    if (cleanUrl === '/stats') {
      const { count: materiCount } = await supabase.from('materi').select('*', { count: 'exact', head: true });
      const { count: soalCount } = await supabase.from('quiz').select('*', { count: 'exact', head: true });
      return { data: { materi: materiCount || 0, soal: soalCount || 0 } };
    }

    // 2. Auth me
    if (cleanUrl === '/auth/me') {
      if (!curUser?.id) {
        const err = new Error('Token tidak valid');
        err.response = { status: 401 };
        throw err;
      }
      const { data: user, error } = await supabase
        .from('users')
        .select('id, nama, username, kelas, role')
        .eq('id', curUser.id)
        .single();
      if (error || !user) {
        const err = new Error('User tidak ditemukan');
        err.response = { status: 404 };
        throw err;
      }
      return { data: user };
    }

    // 3. Materi list
    if (cleanUrl === '/materi') {
      const { data: materiList, error } = await supabase
        .from('materi')
        .select('id, judul, urutan, icon')
        .order('urutan', { ascending: true });
      if (error) throw error;

      if (curUser?.id) {
        const { data: progList } = await supabase
          .from('progress')
          .select('materi_id, selesai, nilai')
          .eq('user_id', curUser.id);
        const map = new Map((progList || []).map((p) => [p.materi_id, p]));
        for (const m of materiList) {
          const p = map.get(m.id);
          m.selesai = p ? p.selesai : 0;
          m.nilai = p ? p.nilai : null;
        }
      }
      return { data: materiList };
    }

    // 4. Detail Materi (/materi/:id)
    if (cleanUrl.startsWith('/materi/')) {
      const id = parseInt(cleanUrl.split('/')[2], 10);
      const { data: materi, error } = await supabase.from('materi').select('*').eq('id', id).single();
      if (error || !materi) {
        const err = new Error('Materi tidak ditemukan');
        err.response = { status: 404 };
        throw err;
      }
      if (curUser?.id) {
        const { data: progress } = await supabase
          .from('progress')
          .select('selesai, nilai')
          .eq('user_id', curUser.id)
          .eq('materi_id', id)
          .maybeSingle();
        materi.selesai = progress ? progress.selesai : 0;
        materi.nilai = progress ? progress.nilai : null;
      }
      return { data: materi };
    }

    // 5. Quiz for student (/quiz/:materi_id)
    if (cleanUrl.startsWith('/quiz/') && !cleanUrl.startsWith('/quiz/manage/')) {
      const materi_id = parseInt(cleanUrl.split('/')[2], 10);
      const { data: soalList, error } = await supabase
        .from('quiz')
        .select('id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d')
        .eq('materi_id', materi_id)
        .order('id', { ascending: true });
      if (error || !soalList || soalList.length === 0) {
        const err = new Error('Soal tidak ditemukan untuk materi ini');
        err.response = { status: 404 };
        throw err;
      }
      return { data: soalList };
    }

    // 6. Quiz manage for teacher (/quiz/manage/:materi_id)
    if (cleanUrl.startsWith('/quiz/manage/')) {
      const materi_id = parseInt(cleanUrl.split('/')[3], 10);
      const { data: soalList, error } = await supabase
        .from('quiz')
        .select('id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban')
        .eq('materi_id', materi_id)
        .order('id', { ascending: true });
      if (error) throw error;
      return { data: soalList || [] };
    }

    // 7. Progress user (/progress)
    if (cleanUrl === '/progress') {
      if (!curUser?.id) return { data: { progress: [], total_materi: 0, selesai: 0, progress_persen: 0 } };
      const { data: materiList } = await supabase.from('materi').select('id, judul, urutan').order('urutan');
      const { data: userProg } = await supabase.from('progress').select('materi_id, selesai, nilai').eq('user_id', curUser.id);
      const progMap = new Map((userProg || []).map((p) => [p.materi_id, p]));

      const allProgress = (materiList || []).map((m) => {
        const p = progMap.get(m.id);
        return {
          materi_id: m.id,
          materi_judul: m.judul,
          selesai: p ? p.selesai : 0,
          nilai: p ? p.nilai : null,
        };
      });
      const total = materiList ? materiList.length : 0;
      const selesai = allProgress.filter((p) => p.selesai === 1).length;
      const progressPersen = total > 0 ? Math.round((selesai / total) * 100) : 0;

      return {
        data: {
          progress: allProgress,
          total_materi: total,
          selesai,
          progress_persen: progressPersen,
        },
      };
    }

    // 8. Progress nilai (/progress/nilai)
    if (cleanUrl === '/progress/nilai') {
      if (!curUser?.id) return { data: [] };
      const { data: userProg } = await supabase
        .from('progress')
        .select('materi_id, selesai, nilai')
        .eq('user_id', curUser.id)
        .not('nilai', 'is', null);
      const { data: materiList } = await supabase.from('materi').select('id, judul, urutan').order('urutan');
      const matMap = new Map((materiList || []).map((m) => [m.id, m]));

      const list = (userProg || [])
        .map((p) => {
          const m = matMap.get(p.materi_id);
          return {
            materi_id: p.materi_id,
            materi_judul: m ? m.judul : '',
            urutan: m ? m.urutan : 999,
            nilai: p.nilai,
            selesai: p.selesai,
          };
        })
        .sort((a, b) => a.urutan - b.urutan);

      return { data: list };
    }

    // 9. Leaderboard (/progress/leaderboard)
    if (cleanUrl === '/progress/leaderboard') {
      const { data: students } = await supabase.from('users').select('id, nama, kelas').eq('role', 'siswa');
      const { data: allProg } = await supabase.from('progress').select('user_id, selesai, nilai');

      const progByUser = new Map();
      (allProg || []).forEach((p) => {
        if (!progByUser.has(p.user_id)) progByUser.set(p.user_id, []);
        progByUser.get(p.user_id).push(p);
      });

      const leaderboard = (students || []).map((u) => {
        const progs = progByUser.get(u.id) || [];
        const validScores = progs.filter((p) => p.nilai !== null).map((p) => p.nilai);
        const total_skor = validScores.reduce((a, b) => a + b, 0);
        const materi_selesai = progs.filter((p) => p.selesai === 1).length;
        const rata_rata = validScores.length > 0 ? Math.round(total_skor / validScores.length) : 0;
        return {
          nama: u.nama,
          kelas: u.kelas,
          total_skor,
          materi_selesai,
          rata_rata,
        };
      });

      leaderboard.sort((a, b) => {
        if (b.total_skor !== a.total_skor) return b.total_skor - a.total_skor;
        if (b.rata_rata !== a.rata_rata) return b.rata_rata - a.rata_rata;
        return a.nama.localeCompare(b.nama);
      });

      return { data: leaderboard.slice(0, 10) };
    }

    // 10. Admin progress list (/progress/admin)
    if (cleanUrl === '/progress/admin') {
      const page = Math.max(1, parseInt(params.get('page') || '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '20', 10)));
      const search = (params.get('search') || '').trim().toLowerCase();

      const { data: allStudents } = await supabase.from('users').select('id, nama, username, kelas').eq('role', 'siswa').order('nama');
      const { data: allProg } = await supabase.from('progress').select('user_id, selesai, nilai');
      const { data: allMateri } = await supabase.from('materi').select('id');
      const totalMateriCount = allMateri ? allMateri.length : 0;

      const progMap = new Map();
      (allProg || []).forEach((p) => {
        if (!progMap.has(p.user_id)) progMap.set(p.user_id, []);
        progMap.get(p.user_id).push(p);
      });

      const fullList = (allStudents || []).map((u) => {
        const progs = progMap.get(u.id) || [];
        const selesai = progs.filter((p) => p.selesai === 1).length;
        const scores = progs.filter((p) => p.nilai !== null).map((p) => p.nilai);
        const rata_rata = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return {
          id: u.id,
          nama: u.nama,
          username: u.username,
          kelas: u.kelas,
          materi_selesai: selesai,
          rata_rata,
        };
      });

      // Overall stats
      const total_siswa = fullList.length;
      const sumRata = fullList.reduce((a, b) => a + b.rata_rata, 0);
      const rata_kelas = total_siswa > 0 ? Math.round(sumRata / total_siswa) : 0;
      const tuntas = fullList.filter((s) => s.materi_selesai === totalMateriCount && totalMateriCount > 0).length;
      const butuh_bimbingan = fullList.filter((s) => s.materi_selesai > 0 && s.rata_rata < 60).length;

      // Filtered for table
      const filtered = search
        ? fullList.filter((s) => s.nama.toLowerCase().includes(search) || s.username.toLowerCase().includes(search))
        : fullList;
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paged = filtered.slice(offset, offset + limit);

      return {
        data: {
          siswa: paged,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
          stats: { total_siswa, rata_kelas, tuntas, butuh_bimbingan },
        },
      };
    }

    // 11. Admin chart (/progress/admin/chart)
    if (cleanUrl === '/progress/admin/chart') {
      const { data: materiList } = await supabase.from('materi').select('id, judul, urutan').order('urutan');
      const { data: allProg } = await supabase.from('progress').select('materi_id, selesai, nilai');
      const { data: allStudents } = await supabase.from('users').select('id').eq('role', 'siswa');

      const progByMateri = new Map();
      (allProg || []).forEach((p) => {
        if (!progByMateri.has(p.materi_id)) progByMateri.set(p.materi_id, []);
        progByMateri.get(p.materi_id).push(p);
      });

      const per_materi = (materiList || []).map((m) => {
        const progs = (progByMateri.get(m.id) || []).filter((p) => p.selesai === 1 && p.nilai !== null);
        const scores = progs.map((p) => p.nilai);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return {
          judul: m.judul,
          urutan: m.urutan,
          rata_rata: avg,
          jumlah_pengerjaan: progs.length,
        };
      });

      const progByUser = new Map();
      (allProg || []).forEach((p) => {
        if (!progByUser.has(p.user_id)) progByUser.set(p.user_id, []);
        progByUser.get(p.user_id).push(p);
      });

      let belum_mulai = 0,
        butuh_bimbingan = 0,
        cukup_baik = 0,
        sangat_baik = 0;
      (allStudents || []).forEach((u) => {
        const progs = progByUser.get(u.id) || [];
        const selesai = progs.filter((p) => p.selesai === 1).length;
        const scores = progs.filter((p) => p.nilai !== null).map((p) => p.nilai);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        if (selesai === 0) belum_mulai++;
        else if (avg < 60) butuh_bimbingan++;
        else if (avg < 80) cukup_baik++;
        else sangat_baik++;
      });

      return {
        data: {
          per_materi,
          distribusi: { belum_mulai, butuh_bimbingan, cukup_baik, sangat_baik },
        },
      };
    }

    // 12. Admin student detail (/progress/admin/student/:id)
    if (cleanUrl.startsWith('/progress/admin/student/')) {
      const studentId = parseInt(cleanUrl.split('/')[4], 10);
      const { data: student, error } = await supabase
        .from('users')
        .select('id, nama, username, kelas, created_at')
        .eq('id', studentId)
        .eq('role', 'siswa')
        .single();
      if (error || !student) {
        const err = new Error('Siswa tidak ditemukan');
        err.response = { status: 404 };
        throw err;
      }
      const { data: materiList } = await supabase.from('materi').select('id, judul, urutan, icon').order('urutan');
      const { data: userProg } = await supabase.from('progress').select('materi_id, selesai, nilai').eq('user_id', studentId);
      const map = new Map((userProg || []).map((p) => [p.materi_id, p]));

      const progress = (materiList || []).map((m) => {
        const p = map.get(m.id);
        return {
          materi_id: m.id,
          judul: m.judul,
          urutan: m.urutan,
          icon: m.icon,
          selesai: p ? p.selesai : 0,
          nilai: p ? p.nilai : null,
        };
      });

      const total_materi = progress.length;
      const materi_selesai = progress.filter((m) => m.selesai === 1).length;
      const scores = progress.filter((m) => m.nilai !== null).map((m) => m.nilai);
      const rata_rata = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      return {
        data: {
          student,
          progress,
          total_materi,
          materi_selesai,
          rata_rata,
        },
      };
    }

    // 13. Admin export (/progress/admin/export)
    if (cleanUrl === '/progress/admin/export') {
      const { data: students } = await supabase.from('users').select('id, nama, username, kelas').eq('role', 'siswa').order('nama');
      const { data: allProg } = await supabase.from('progress').select('user_id, selesai, nilai');
      const { data: allMateri } = await supabase.from('materi').select('id');
      const total_materi = allMateri ? allMateri.length : 0;

      const progMap = new Map();
      (allProg || []).forEach((p) => {
        if (!progMap.has(p.user_id)) progMap.set(p.user_id, []);
        progMap.get(p.user_id).push(p);
      });

      const rows = (students || []).map((u) => {
        const progs = progMap.get(u.id) || [];
        const selesai = progs.filter((p) => p.selesai === 1).length;
        const scores = progs.filter((p) => p.nilai !== null).map((p) => p.nilai);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return {
          nama: u.nama,
          username: u.username,
          kelas: u.kelas,
          materi_selesai: selesai,
          total_materi,
          rata_rata: avg,
        };
      });
      return { data: rows };
    }

    throw new Error(`Endpoint GET not implemented: ${url}`);
  },

  post: async (url, payload) => {
    const curUser = getCurrentUser();

    // 1. Auth login
    if (url === '/auth/login') {
      const { username, password } = payload;
      if (!username || !password) {
        const err = new Error('Username dan password harus diisi');
        err.response = { status: 400, data: { error: err.message } };
        throw err;
      }
      const { data: user, error } = await supabase.from('users').select('*').eq('username', username).maybeSingle();
      if (error || !user) {
        const err = new Error('Username atau password salah');
        err.response = { status: 401, data: { error: err.message } };
        throw err;
      }
      const isValid = bcrypt.compareSync(password, user.password) || password === user.password;
      if (!isValid) {
        const err = new Error('Username atau password salah');
        err.response = { status: 401, data: { error: err.message } };
        throw err;
      }
      return {
        data: {
          token: `user_${user.id}`,
          user: { id: user.id, nama: user.nama, username: user.username, kelas: user.kelas, role: user.role },
        },
      };
    }

    // 2. Auth register
    if (url === '/auth/register') {
      const { nama, username, password, kelas } = payload;
      if (!nama || !username || !password) {
        const err = new Error('Nama, username, dan password harus diisi');
        err.response = { status: 400, data: { error: err.message } };
        throw err;
      }
      if (password.length < 6) {
        const err = new Error('Password minimal 6 karakter');
        err.response = { status: 400, data: { error: err.message } };
        throw err;
      }
      const { data: existing } = await supabase.from('users').select('id').eq('username', username).maybeSingle();
      if (existing) {
        const err = new Error('Username sudah digunakan');
        err.response = { status: 400, data: { error: err.message } };
        throw err;
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ nama, username, password: hashedPassword, kelas: kelas || '', role: 'siswa' }])
        .select()
        .single();
      if (error) throw error;
      return {
        data: {
          token: `user_${newUser.id}`,
          user: { id: newUser.id, nama: newUser.nama, username: newUser.username, kelas: newUser.kelas, role: newUser.role },
        },
      };
    }

    // 3. Quiz submit
    if (url === '/quiz/submit') {
      const { materi_id, jawaban } = payload;
      if (!curUser?.id) {
        const err = new Error('Harus login');
        err.response = { status: 401 };
        throw err;
      }
      const { data: soalList } = await supabase
        .from('quiz')
        .select('id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban')
        .eq('materi_id', materi_id)
        .order('id');
      if (!soalList || soalList.length === 0) {
        const err = new Error('Soal tidak ditemukan');
        err.response = { status: 404 };
        throw err;
      }

      let benar = 0;
      const detail = soalList.map((s, i) => {
        const jawabUser = (jawaban[i] || '').toLowerCase();
        const kunci = (s.jawaban || '').toLowerCase();
        const isBenar = jawabUser === kunci;
        if (isBenar) benar++;
        return {
          id: s.id,
          soal: s.soal,
          opsi_a: s.opsi_a,
          opsi_b: s.opsi_b,
          opsi_c: s.opsi_c,
          opsi_d: s.opsi_d,
          jawaban_user: jawabUser,
          jawaban_benar: kunci,
          benar: isBenar,
        };
      });

      const total = soalList.length;
      const nilai = Math.round((benar / total) * 100);

      const { data: existProg } = await supabase
        .from('progress')
        .select('nilai')
        .eq('user_id', curUser.id)
        .eq('materi_id', materi_id)
        .maybeSingle();
      const nilaiTersimpan = existProg?.nilai !== null && existProg?.nilai !== undefined ? Math.max(existProg.nilai, nilai) : nilai;

      await supabase.from('progress').upsert(
        {
          user_id: curUser.id,
          materi_id,
          selesai: 1,
          nilai: nilaiTersimpan,
        },
        { onConflict: 'user_id,materi_id' }
      );

      return {
        data: {
          nilai,
          nilai_tersimpan: nilaiTersimpan,
          benar,
          total,
          detail,
        },
      };
    }

    // 4. Admin create materi
    if (url === '/materi') {
      const { judul, konten, icon } = payload;
      const { data: maxRow } = await supabase.from('materi').select('urutan').order('urutan', { ascending: false }).limit(1);
      const nextUrutan = maxRow && maxRow.length > 0 ? (maxRow[0].urutan || 0) + 1 : 1;
      const { data: created, error } = await supabase
        .from('materi')
        .insert([{ judul, konten, urutan: nextUrutan, icon: icon || 'BookOpen' }])
        .select()
        .single();
      if (error) throw error;
      return { data: created };
    }

    // 5. Admin create quiz
    if (url === '/quiz') {
      const { data: created, error } = await supabase.from('quiz').insert([payload]).select().single();
      if (error) throw error;
      return { data: created };
    }

    throw new Error(`Endpoint POST not implemented: ${url}`);
  },

  put: async (url, payload) => {
    // 1. Reorder materi
    if (url === '/materi/reorder') {
      const { order } = payload;
      for (let i = 0; i < order.length; i++) {
        await supabase.from('materi').update({ urutan: i + 1 }).eq('id', order[i]);
      }
      return { data: { ok: true } };
    }

    // 2. Update materi (/materi/:id)
    if (url.startsWith('/materi/')) {
      const id = parseInt(url.split('/')[2], 10);
      const { judul, konten, icon } = payload;
      const { data: updated, error } = await supabase
        .from('materi')
        .update({ judul, konten, icon: icon || 'BookOpen' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return { data: updated };
    }

    // 3. Update quiz (/quiz/:id)
    if (url.startsWith('/quiz/')) {
      const id = parseInt(url.split('/')[2], 10);
      const { data: updated, error } = await supabase.from('quiz').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return { data: updated };
    }

    throw new Error(`Endpoint PUT not implemented: ${url}`);
  },

  delete: async (url) => {
    // 1. Delete materi (/materi/:id)
    if (url.startsWith('/materi/')) {
      const id = parseInt(url.split('/')[2], 10);
      await supabase.from('quiz').delete().eq('materi_id', id);
      await supabase.from('progress').delete().eq('materi_id', id);
      const { error } = await supabase.from('materi').delete().eq('id', id);
      if (error) throw error;
      return { data: { ok: true } };
    }

    // 2. Delete quiz (/quiz/:id)
    if (url.startsWith('/quiz/')) {
      const id = parseInt(url.split('/')[2], 10);
      const { error } = await supabase.from('quiz').delete().eq('id', id);
      if (error) throw error;
      return { data: { ok: true } };
    }

    throw new Error(`Endpoint DELETE not implemented: ${url}`);
  },
};

export const onApiError = () => () => {};
export default api;
