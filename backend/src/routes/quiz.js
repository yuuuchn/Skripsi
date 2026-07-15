import { Router } from 'express';
import { getDb, saveDb } from '../models/database.js';
import { adminOnly } from '../middleware/auth.js';
import { queryOne, queryAll } from './auth.js';

const router = Router();

// ---- Kelola soal oleh guru (sertakan kunci jawaban) ----
router.get('/manage/:materi_id', adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const soalList = queryAll(db,
      'SELECT id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban FROM quiz WHERE materi_id = ? ORDER BY id',
      [req.params.materi_id]
    );
    res.json(soalList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validasi field soal; kembalikan pesan error atau null bila valid
function validateSoal(body) {
  const { materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban } = body;
  if (!materi_id) return 'Materi wajib dipilih';
  if (!soal?.trim() || !opsi_a?.trim() || !opsi_b?.trim() || !opsi_c?.trim() || !opsi_d?.trim()) {
    return 'Soal dan keempat opsi wajib diisi';
  }
  if (!['a', 'b', 'c', 'd'].includes((jawaban || '').toLowerCase())) {
    return 'Jawaban benar harus salah satu dari a/b/c/d';
  }
  return null;
}

router.post('/', adminOnly, async (req, res) => {
  try {
    const err = validateSoal(req.body);
    if (err) return res.status(400).json({ error: err });
    const { materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban } = req.body;
    const db = await getDb();
    const materi = queryOne(db, 'SELECT id FROM materi WHERE id = ?', [materi_id]);
    if (!materi) return res.status(404).json({ error: 'Materi tidak ditemukan' });
    db.run(
      'INSERT INTO quiz (materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban.toLowerCase()]
    );
    const row = queryOne(db, 'SELECT * FROM quiz WHERE id = last_insert_rowid()');
    saveDb();
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const err = validateSoal(req.body);
    if (err) return res.status(400).json({ error: err });
    const { materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban } = req.body;
    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM quiz WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Soal tidak ditemukan' });
    db.run(
      'UPDATE quiz SET materi_id = ?, soal = ?, opsi_a = ?, opsi_b = ?, opsi_c = ?, opsi_d = ?, jawaban = ? WHERE id = ?',
      [materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban.toLowerCase(), req.params.id]
    );
    saveDb();
    res.json(queryOne(db, 'SELECT * FROM quiz WHERE id = ?', [req.params.id]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM quiz WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Soal tidak ditemukan' });
    db.run('DELETE FROM quiz WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:materi_id', async (req, res) => {
  try {
    const db = await getDb();
    const soalList = queryAll(db,
      'SELECT id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d FROM quiz WHERE materi_id = ? ORDER BY id',
      [req.params.materi_id]
    );

    if (soalList.length === 0) {
      return res.status(404).json({ error: 'Soal tidak ditemukan untuk materi ini' });
    }

    res.json(soalList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { materi_id, jawaban } = req.body;

    if (!materi_id || !jawaban || !Array.isArray(jawaban)) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const db = await getDb();
    const soalList = queryAll(db,
      'SELECT id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban as kunci FROM quiz WHERE materi_id = ? ORDER BY id',
      [materi_id]
    );

    if (soalList.length === 0) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    let benar = 0;
    const detail = soalList.map((s, i) => {
      const jawabUser = (jawaban[i] || '').toLowerCase();
      const isBenar = jawabUser === s.kunci;
      if (isBenar) benar++;
      return {
        id: s.id,
        soal: s.soal,
        opsi_a: s.opsi_a,
        opsi_b: s.opsi_b,
        opsi_c: s.opsi_c,
        opsi_d: s.opsi_d,
        jawaban_user: jawabUser,
        jawaban_benar: s.kunci,
        benar: isBenar,
      };
    });

    const total = soalList.length;
    const nilai = Math.round((benar / total) * 100);

    db.run(
      `INSERT INTO progress (user_id, materi_id, selesai, nilai) VALUES (?, ?, 1, ?)
       ON CONFLICT(user_id, materi_id) DO UPDATE SET selesai = 1, nilai = MAX(nilai, ?)`,
      [req.user.id, materi_id, nilai, nilai]
    );
    saveDb();

    const tersimpan = queryOne(db,
      'SELECT nilai FROM progress WHERE user_id = ? AND materi_id = ?',
      [req.user.id, materi_id]
    );

    res.json({ nilai, nilai_tersimpan: tersimpan?.nilai ?? nilai, benar, total, detail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
