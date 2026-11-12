# 🌐 BelajarJaringan

Media Pembelajaran Interaktif E-Learning Mata Pelajaran **Informatika** (Elemen **Jaringan Komputer dan Internet** — Kurikulum Merdeka) untuk siswa **SMP Kelas IX**, dilengkapi inovasi navigasi tanpa sentuh menggunakan kamera berbasis kecerdasan buatan (**AI Hand Sensor / Touchless Hand Tracking**).

---

## 🎓 Informasi Penelitian (Skripsi)
* **Peneliti / Pengembang**: Tegar Fahrezi (NIM: `2222015`)
* **Program Studi**: Teknologi Pendidikan — Fakultas Keguruan dan Ilmu Pendidikan (FKIP)
* **Perguruan Tinggi**: Universitas Baturaja
* **Lokasi Uji Coba**: SMP Negeri 01 Belitang Mulya, Kab. Ogan Komering Ulu Timur, Sumatera Selatan
* **Model Pengembangan**: Research & Development (R&D) — Model Prosedural **ADDIE** (*Analysis, Design, Development, Implementation, Evaluation*)

---

## ✨ Fitur Utama
* 📚 **Materi Interaktif** — 6 modul jaringan komputer terstruktur lengkap dengan ilustrasi topologi/perangkat, kotak analogi, dan indikator progres baca.
* ✋ **AI Hand Sensor (Touchless Control)** — kendali media tanpa menyentuh mouse/layar lewat webcam (*on-device AI*):
  * **Arahkan Kursor**: gerakkan ujung jari telunjuk.
  * **Klik (Pinch)**: satukan ujung jempol dan telunjuk seperti mencubit.
  * **Scroll Halaman**: angkat/turunkan tangan ke area atas atau bawah kamera.
  * Dilengkapi jendela pratinjau kamera *Picture-in-Picture* (PiP) yang dapat digeser (*draggable*), diminimalkan, disembunyikan (*collapse*), serta panduan gestur interaktif.
* 📝 **Kuis Evaluasi Responsif** — latihan soal pilihan ganda per materi dengan navigasi nomor soal (*sticky sidebar* pada desktop & *sticky bar* pada perangkat mobile) serta ulasan jawaban.
* 🏆 **Rapor Nilai, Lencana & Leaderboard** — rekap nilai siswa, koleksi lencana (*achievement badges*), dan papan peringkat kelas secara *real-time*.
* 📊 **Panel Guru & Analitik** — pantau ketuntasan siswa, statistik rata-rata kelas, visualisasi grafik distribusi nilai (*Recharts*), rincian progres per siswa, serta fitur **Ekspor CSV**.
* 🛠️ **CMS Kelola Materi & Bank Soal Kuis** — guru dapat menambah, mengubah, menghapus, dan mengurutkan materi melalui editor **WYSIWYG (Tiptap)** serta mengelola soal pilihan ganda tiap materi.
* ℹ️ **Informasi Media (`/tentang`)** — memuat profil pengembang, Capaian & Tujuan Pembelajaran (CP/TP), petunjuk penggunaan sensor, dan spesifikasi media.
* 🌗 **Mode Gelap (Dark Mode)** — antarmuka responsif dengan dukungan tema terang/gelap dan animasi interaktif.

---

## 🧰 Spesifikasi Teknologi
* **Frontend**: React 19, Vite 8, React Router v7, Tailwind CSS v4, GSAP, Lucide React.
* **AI Hand Tracking**: Google MediaPipe Vision (`@mediapipe/tasks-vision` — 21 3D Hand Landmarks, diproses 100% lokal di browser demi privasi siswa).
* **Rich Text Editor & Chart**: Tiptap Editor (WYSIWYG) & Recharts.
* **Database & Backend Cloud**: **Supabase (PostgreSQL Cloud)** via `@supabase/supabase-js` & `bcryptjs` — berjalan penuh di cloud 24/7 tanpa memerlukan server lokal atau tunnel Ngrok. *(Folder `backend/` Express + SQLite disimpan sebagai arsip pengembangan awal).*
* **Deployment**: **Vercel** (Frontend SPA).

---

## 🔑 Akun Uji Coba Default
Untuk pengujian sistem oleh Dosen Penguji maupun Guru:

* **Guru (Administrator)**:
  * **Username**: `admin`
  * **Password**: `GuruJaringan2026!`
* **Siswa**:
  * Klik tombol **Daftar sekarang** pada halaman login untuk membuat akun siswa baru secara mandiri.

---

## ⚡ Cara Menjalankan Proyek (Lokal)

Karena basis data sudah bermigrasi penuh ke **Supabase Cloud**, Anda cukup menjalankan sisi **Frontend**:

### 1. Masuk ke Folder Frontend & Instal Dependensi
```bash
cd frontend
npm install
```

### 2. Konfigurasi Variabel Lingkungan (Opsional)
Secara bawaan aplikasi sudah terhubung ke instance Supabase proyek. Jika ingin menggunakan proyek Supabase sendiri, buat file `frontend/.env`:
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<supabase-anon-atau-publishable-key>
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka alamat `http://localhost:5173` di browser (disarankan menggunakan Google Chrome / Microsoft Edge pada Laptop/PC yang memiliki webcam untuk mencoba fitur **AI Hand Sensor**).

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 📁 Struktur Direktori Utama
```text
├── frontend/               # Aplikasi utama React + Vite (terhubung ke Supabase Cloud)
│   ├── src/
│   │   ├── api/            # Adapter API & konfigurasi Supabase Client
│   │   ├── components/     # Komponen UI, Navbar, & AI HandCursor
│   │   ├── context/        # AuthContext & ToastContext
│   │   ├── hooks/          # Custom hooks (useHandTracking, usePipWindow, dll.)
│   │   └── pages/          # Halaman Siswa, Guru (CMS Materi/Kuis), & Tentang
├── backend/                # (Arsip) Server lokal Express + SQLite versi terdahulu
└── README.md               # Dokumentasi proyek
```
