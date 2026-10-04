# 🌐 BelajarJaringan

Media pembelajaran interaktif mengenai konsep dasar Jaringan Komputer untuk siswa SMP Kelas IX, dilengkapi dengan sensor kamera pelacakan gerakan tangan (AI Hand Sensor).

---

## ✨ Fitur Utama
* 📚 **Materi Interaktif** — materi jaringan komputer yang tersusun rapi dan mudah dipahami.
* ✋ **AI Hand Sensor** — navigasi materi menggunakan pelacakan gerakan tangan lewat kamera.
* 📝 **Kuis** — latihan soal pilihan ganda per materi untuk mengukur pemahaman siswa.
* 📊 **Panel Guru** — rekap progres & analitik belajar siswa.
* 🛠️ **Kelola Materi (CMS)** — guru dapat menambah, mengedit, menghapus, dan mengurutkan materi lewat editor **WYSIWYG** (teks berformat, kotak analogi, sisip gambar via URL dengan *resize* & pengaturan perataan kiri/tengah/kanan).

---

## 🧰 Teknologi
* **Frontend**: React + Vite, React Router, Tailwind CSS v4, Tiptap (editor WYSIWYG), MediaPipe (hand tracking), Recharts, GSAP.
* **Backend**: Node.js + Express, SQLite (via sql.js), autentikasi JWT (peran `guru` & `siswa`).
* **Deployment**: Frontend di **Vercel**, backend lokal diekspos via **Ngrok**.

---

## 🔑 Akun Uji Coba Default
Untuk pengujian sistem oleh Dosen Penguji / Guru:

* **Guru (Admin)**:
  * Username: `admin` (mengikuti `ADMIN_USERNAME` di `backend/.env`)
  * Password: `GuruJaringan2026!` (mengikuti `ADMIN_PASSWORD` di `backend/.env`)
  * ⚠️ Ganti password ini sebelum media digunakan di sekolah. Cukup ubah `ADMIN_PASSWORD` di `backend/.env`, lalu jalankan ulang backend — password akun otomatis disinkronkan.
* **Siswa**:
  * Silakan klik tombol **Daftar sekarang** di halaman awal untuk mendaftar akun siswa baru secara mandiri.

---

## ⚡ Cara Menjalankan Proyek

### 0. Siapkan Variabel Lingkungan (sekali saja)
```bash
cd backend
copy .env.example .env      # Windows (Linux/macOS: cp .env.example .env)
```
Isi `JWT_SECRET` di `backend/.env` dengan nilai acak minimal 16 karakter:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
> Backend akan **menolak dijalankan** bila `JWT_SECRET` kosong atau masih memakai nilai bawaan lama, sebagai pengaman agar token tidak bisa dipalsukan.
> `ADMIN_USERNAME` & `ADMIN_PASSWORD` pada file yang sama menentukan akun guru yang dibuat otomatis saat pertama kali dijalankan.

### 1. Jalankan Backend (Port 5000)
```bash
cd backend
npm install   # cukup sekali di awal
npm start
```

### 2. Jalankan Ngrok Tunnel (Koneksi Database ke Web Online)
```bash
ngrok http --url=valarie-octadic-arboreally.ngrok-free.dev 5000
```

### 3. Jalankan Frontend (Local Testing)
```bash
cd frontend
npm install   # cukup sekali di awal
npm run dev
```
*(Catatan: Versi publik online di-deploy otomatis di Vercel).*

> 💡 **Tips:** Jika saat menjalankan backend muncul error `EADDRINUSE: address already in use :::5000`, artinya masih ada proses backend lama yang aktif. Matikan dulu:
> ```bash
> netstat -ano | findstr :5000        # lihat PID di kolom paling kanan
> taskkill //PID <PID> //F            # ganti <PID> dengan angka tadi
> ```

