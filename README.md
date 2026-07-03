# BelajarJaringan - Media Pembelajaran Jaringan Komputer Interaktif (SMP)

Aplikasi pembelajaran interaktif jaringan komputer yang dirancang khusus untuk siswa Sekolah Menengah Pertama (SMP) sebagai media bantu ajar guru.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibagi menjadi dua bagian: **Backend** (server API & database) dan **Frontend** (antarmuka pengguna).

### 1. Menjalankan Backend (Server API & Database)
1. Buka terminal baru dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Pasang dependensi proyek (jika pertama kali):
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   node src/index.js
   ```
   *Server backend akan berjalan di port `5000` (`http://localhost:5000`).*

### 2. Menjalankan Frontend (Aplikasi React)
1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Pasang dependensi proyek (jika pertama kali):
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend dapat diakses di browser pada port yang tertera di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`).*

---

## 🔑 Akun Uji Coba Default (Kredensial)

Untuk keperluan pengujian sistem oleh dosen penguji atau guru, gunakan akun guru bawaan berikut:

* **Role Guru (Admin)**
  * **Username**: `admin`
  * **Password**: `admin123`
  * *Akun ini memiliki hak akses penuh ke **Panel Guru** untuk memantau nilai kuis dan kemajuan belajar seluruh siswa.*

* **Role Siswa**
  * Siswa dapat langsung membuat akun baru dengan mengeklik tombol **Daftar sekarang** di halaman Login.

---

## 🌟 Fitur Utama Aplikasi
1. **6 Pertemuan Materi Jaringan Komputer**: Disusun sistematis lengkap dengan ilustrasi visual diagram SVG (seperti topologi jaringan, jenis kabel, perangkat keras, timeline sejarah internet, dan komparasi dampak positif/negatif).
2. **Kuis Interaktif**: Kuis pilihan ganda untuk setiap pertemuan materi yang langsung dinilai oleh sistem secara real-time.
3. **Papan Rekam Prestasi (Leaderboard)**: Mengukur peringkat dan riwayat nilai kuis yang dikerjakan siswa.
4. **Dashboard Guru**: Guru dapat menyaring, mencari, dan memantau rata-rata nilai serta kemajuan penyelesaian materi seluruh siswa secara realtime.
