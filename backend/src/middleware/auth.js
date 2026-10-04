import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Secret bawaan versi lama sudah bocor lewat riwayat git — tolak agar tidak
// dipakai lagi di mesin mana pun.
const LEGACY_JWT_SECRET = 'media-pembelajaran-secret-key-2024';

// Tidak ada nilai default: server wajib punya secret sendiri di backend/.env.
// Buat nilai acak: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
if (!JWT_SECRET || JWT_SECRET.trim().length < 16) {
  throw new Error(
    'JWT_SECRET belum diatur (minimal 16 karakter). Isi variabel JWT_SECRET di backend/.env sebelum menjalankan server.'
  );
}

if (JWT_SECRET === LEGACY_JWT_SECRET) {
  throw new Error(
    'JWT_SECRET masih memakai nilai bawaan yang sudah bocor di riwayat git. Ganti dengan nilai acak baru, mis: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'guru') {
    return res.status(403).json({ error: 'Akses hanya untuk guru' });
  }
  next();
}
