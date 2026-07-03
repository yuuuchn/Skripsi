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
      'SELECT id, jawaban as kunci FROM quiz WHERE materi_id = ? ORDER BY id',
      [materi_id]
    );

    if (soalList.length === 0) {
      return res.status(404).json({ error: 'Soal tidak ditemukan' });
    }

    let benar = 0;
    for (let i = 0; i < soalList.length; i++) {
      if (jawaban[i] && jawaban[i].toLowerCase() === soalList[i].kunci) {
        benar++;
      }
    }

    const total = soalList.length;
    const nilai = Math.round((benar / total) * 100);

    db.run(
      `INSERT INTO progress (user_id, materi_id, selesai, nilai) VALUES (?, ?, 1, ?)
       ON CONFLICT(user_id, materi_id) DO UPDATE SET selesai = 1, nilai = ?`,
      [req.user.id, materi_id, nilai, nilai]
    );
    saveDb();

    res.json({ nilai, benar, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
