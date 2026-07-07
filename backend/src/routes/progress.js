import { Router } from 'express';
import { getDb } from '../models/database.js';
import { queryOne, queryAll } from './auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const allProgress = queryAll(db,
      `SELECT p.materi_id, m.judul as materi_judul, p.selesai, p.nilai
       FROM progress p
       JOIN materi m ON p.materi_id = m.id
       WHERE p.user_id = ?
       ORDER BY m.urutan`,
      [req.user.id]
    );

    const totalMateri = queryOne(db, 'SELECT COUNT(*) as total FROM materi');
    const total = totalMateri ? totalMateri.total : 0;
    const selesai = allProgress.filter(p => p.selesai === 1).length;
    const progressPersen = total > 0 ? Math.round((selesai / total) * 100) : 0;

    res.json({
      progress: allProgress,
      total_materi: total,
      selesai,
      progress_persen: progressPersen
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/nilai', async (req, res) => {
  try {
    const db = await getDb();
    const nilaiList = queryAll(db,
      `SELECT p.materi_id, m.judul as materi_judul, p.nilai, p.selesai
       FROM progress p
       JOIN materi m ON p.materi_id = m.id
       WHERE p.user_id = ? AND p.nilai IS NOT NULL
       ORDER BY m.urutan`,
      [req.user.id]
    );

    res.json(nilaiList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const db = await getDb();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const totalRow = queryOne(db,
      `SELECT COUNT(*) as total FROM users WHERE role = 'siswa'`
    );
    const total = totalRow ? totalRow.total : 0;

    const siswaList = queryAll(db,
      `SELECT u.id, u.nama, u.username, u.kelas,
              COUNT(p.id) as materi_selesai,
              COALESCE(ROUND(AVG(p.nilai)), 0) as rata_rata
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id AND p.selesai = 1
       WHERE u.role = 'siswa'
       GROUP BY u.id
       ORDER BY u.nama
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      siswa: siswaList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const db = await getDb();
    const leaderboard = queryAll(db,
      `SELECT u.nama, u.kelas,
              COALESCE(SUM(p.nilai), 0) as total_skor,
              COUNT(CASE WHEN p.selesai = 1 THEN 1 END) as materi_selesai,
              COALESCE(ROUND(AVG(p.nilai)), 0) as rata_rata
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id AND p.nilai IS NOT NULL
       WHERE u.role = 'siswa'
       GROUP BY u.id
       ORDER BY total_skor DESC, rata_rata DESC, u.nama ASC
       LIMIT 10`
    );

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
