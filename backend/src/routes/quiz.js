import { Router } from 'express';
import { getDb, saveDb } from '../models/database.js';
import { queryOne, queryAll } from './auth.js';

const router = Router();

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
