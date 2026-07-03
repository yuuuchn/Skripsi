import { Router } from 'express';
import { getDb } from '../models/database.js';
import { queryOne, queryAll } from './auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const materiList = queryAll(db, 'SELECT id, judul, urutan, icon FROM materi ORDER BY urutan');

    if (req.user) {
      for (const m of materiList) {
        const progress = queryOne(db,
          'SELECT selesai, nilai FROM progress WHERE user_id = ? AND materi_id = ?',
          [req.user.id, m.id]);
        m.selesai = progress ? progress.selesai : 0;
        m.nilai = progress ? progress.nilai : null;
      }
    }

    res.json(materiList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const materi = queryOne(db, 'SELECT * FROM materi WHERE id = ?', [req.params.id]);

    if (!materi) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }

    if (req.user) {
      const progress = queryOne(db,
        'SELECT selesai, nilai FROM progress WHERE user_id = ? AND materi_id = ?',
        [req.user.id, materi.id]);
      materi.selesai = progress ? progress.selesai : 0;
      materi.nilai = progress ? progress.nilai : null;
    }

    res.json(materi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
