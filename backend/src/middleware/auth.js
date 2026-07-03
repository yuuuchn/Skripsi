import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'media-pembelajaran-secret-key-2024';

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
