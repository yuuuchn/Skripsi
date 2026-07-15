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
  * Username: `admin`
  * Password: `admin123`
* **Siswa**:
  * Silakan klik tombol **Daftar sekarang** di halaman awal untuk mendaftar akun siswa baru secara mandiri.

---

## ⚡ Cara Menjalankan Proyek

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

