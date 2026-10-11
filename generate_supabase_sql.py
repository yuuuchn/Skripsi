import sqlite3

conn = sqlite3.connect(r'E:\SKRIPSI\backend\database.sqlite')
cur = conn.cursor()

lines = []
lines.append('-- 1. CREATE TABLES')
lines.append('''DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS quiz CASCADE;
DROP TABLE IF EXISTS materi CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  kelas TEXT DEFAULT '',
  role TEXT DEFAULT 'siswa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE materi (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  urutan INT NOT NULL,
  icon TEXT DEFAULT 'BookOpen'
);

CREATE TABLE quiz (
  id BIGSERIAL PRIMARY KEY,
  materi_id BIGINT REFERENCES materi(id) ON DELETE CASCADE,
  soal TEXT NOT NULL,
  opsi_a TEXT NOT NULL,
  opsi_b TEXT NOT NULL,
  opsi_c TEXT NOT NULL,
  opsi_d TEXT NOT NULL,
  jawaban TEXT NOT NULL
);

CREATE TABLE progress (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  materi_id BIGINT REFERENCES materi(id) ON DELETE CASCADE,
  selesai INT DEFAULT 0,
  nilai INT DEFAULT NULL,
  UNIQUE(user_id, materi_id)
);

-- DISABLE ROW LEVEL SECURITY (SUPAYA FRONTEND BISA AKSES TANPA BLOKIR)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE materi DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress DISABLE ROW LEVEL SECURITY;
''')

def esc(s):
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

lines.append('-- 2. INSERT USERS')
for r in cur.execute('SELECT id, nama, username, password, kelas, role, created_at FROM users'):
    lines.append(f"INSERT INTO users (id, nama, username, password, kelas, role, created_at) VALUES ({r[0]}, {esc(r[1])}, {esc(r[2])}, {esc(r[3])}, {esc(r[4])}, {esc(r[5])}, {esc(r[6])});")

lines.append('\n-- 3. INSERT MATERI')
for r in cur.execute('SELECT id, judul, konten, urutan, icon FROM materi'):
    lines.append(f"INSERT INTO materi (id, judul, konten, urutan, icon) VALUES ({r[0]}, {esc(r[1])}, {esc(r[2])}, {r[3]}, {esc(r[4])});")

lines.append('\n-- 4. INSERT QUIZ')
for r in cur.execute('SELECT id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban FROM quiz'):
    lines.append(f"INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES ({r[0]}, {r[1]}, {esc(r[2])}, {esc(r[3])}, {esc(r[4])}, {esc(r[5])}, {esc(r[6])}, {esc(r[7])});")

lines.append('''
-- 5. RESET AUTO-INCREMENT SEQUENCES
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('materi_id_seq', COALESCE((SELECT MAX(id) FROM materi), 1));
SELECT setval('quiz_id_seq', COALESCE((SELECT MAX(id) FROM quiz), 1));
''')

with open(r'E:\SKRIPSI\supabase_schema.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('SUCCESS generated E:\SKRIPSI\supabase_schema.sql')
