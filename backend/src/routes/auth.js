import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from '../models/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = Router();

function queryOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

router.post('/register', async (req, res) => {
  try {
    const { nama, username, password, kelas } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({ error: 'Nama, username, dan password harus diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM users WHERE username = ?', [username]);

    if (existing) {
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (nama, username, password, kelas) VALUES (?, ?, ?, ?)',
      [nama, username, hashedPassword, kelas || '']);
    saveDb();

    const userData = queryOne(db, 'SELECT id, nama, username, kelas, role FROM users WHERE username = ?', [username]);
    const token = generateToken(userData);

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password harus diisi' });
    }

    const db = await getDb();
    const user = queryOne(db, 'SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        kelas: user.kelas,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const user = queryOne(db, 'SELECT id, nama, username, kelas, role FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { queryOne, queryAll };
export default router;
