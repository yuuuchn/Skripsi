import { Router } from 'express';
import { getDb } from '../models/database.js';
import { queryOne, queryAll } from './auth.js';
import { adminOnly } from '../middleware/auth.js';

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

router.get('/admin', adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const where = `WHERE u.role = 'siswa'`;
    const searchClause = search ? ` AND (u.nama LIKE ? OR u.username LIKE ?)` : '';
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

    const totalRow = queryOne(db,
      `SELECT COUNT(*) as total FROM users u ${where}${searchClause}`,
      searchParams
    );
    const total = totalRow ? totalRow.total : 0;

    const siswaList = queryAll(db,
      `SELECT u.id, u.nama, u.username, u.kelas,
              COUNT(p.id) as materi_selesai,
              COALESCE(ROUND(AVG(p.nilai)), 0) as rata_rata
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id AND p.selesai = 1
       ${where}${searchClause}
       GROUP BY u.id
       ORDER BY u.nama
       LIMIT ? OFFSET ?`,
      [...searchParams, limit, offset]
    );

    // Ringkasan kelas dihitung atas SELURUH siswa (bukan hasil filter/paginasi)
    const stats = queryOne(db,
      `SELECT
         COUNT(*) as total_siswa,
         COALESCE(ROUND(AVG(s.rata_rata)), 0) as rata_kelas,
         SUM(CASE WHEN s.selesai = 6 THEN 1 ELSE 0 END) as tuntas,
         SUM(CASE WHEN s.selesai > 0 AND s.rata_rata < 60 THEN 1 ELSE 0 END) as butuh_bimbingan
       FROM (
         SELECT u.id,
                COUNT(p.id) as selesai,
                COALESCE(AVG(p.nilai), 0) as rata_rata
         FROM users u
         LEFT JOIN progress p ON u.id = p.user_id AND p.selesai = 1
         WHERE u.role = 'siswa'
         GROUP BY u.id
       ) s`
    );

    res.json({
      siswa: siswaList,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats: stats || { total_siswa: 0, rata_kelas: 0, tuntas: 0, butuh_bimbingan: 0 },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/export', adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const rows = queryAll(db,
      `SELECT u.nama, u.username, u.kelas,
              COUNT(p.id) as materi_selesai,
              COALESCE(ROUND(AVG(p.nilai)), 0) as rata_rata
       FROM users u
       LEFT JOIN progress p ON u.id = p.user_id AND p.selesai = 1
       WHERE u.role = 'siswa'
       GROUP BY u.id
       ORDER BY u.nama`
    );
    res.json(rows);
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
