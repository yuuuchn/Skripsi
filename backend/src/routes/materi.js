import { Router } from 'express';
import { getDb, saveDb } from '../models/database.js';
import { adminOnly } from '../middleware/auth.js';
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

router.post('/', adminOnly, async (req, res) => {
  try {
    const { judul, konten, icon } = req.body;
    if (!judul || !konten) {
      return res.status(400).json({ error: 'Judul dan konten wajib diisi' });
    }
    const db = await getDb();
    const max = queryOne(db, 'SELECT COALESCE(MAX(urutan), 0) AS m FROM materi');
    db.run('INSERT INTO materi (judul, konten, urutan, icon) VALUES (?, ?, ?, ?)',
      [judul, konten, max.m + 1, icon || 'BookOpen']);
    const row = queryOne(db, 'SELECT * FROM materi WHERE id = last_insert_rowid()');
    saveDb();
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/reorder', adminOnly, async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order harus berupa array id' });
    }
    const db = await getDb();
    order.forEach((id, i) => {
      db.run('UPDATE materi SET urutan = ? WHERE id = ?', [i + 1, id]);
    });
    saveDb();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { judul, konten, icon } = req.body;
    if (!judul || !konten) {
      return res.status(400).json({ error: 'Judul dan konten wajib diisi' });
    }
    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM materi WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }
    db.run('UPDATE materi SET judul = ?, konten = ?, icon = ? WHERE id = ?',
      [judul, konten, icon || 'BookOpen', req.params.id]);
    saveDb();
    res.json(queryOne(db, 'SELECT * FROM materi WHERE id = ?', [req.params.id]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM materi WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }
    db.run('DELETE FROM quiz WHERE materi_id = ?', [req.params.id]);
    db.run('DELETE FROM progress WHERE materi_id = ?', [req.params.id]);
    db.run('DELETE FROM materi WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
