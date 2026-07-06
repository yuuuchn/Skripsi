# 🌐 BelajarJaringan

Media pembelajaran interaktif mengenai konsep dasar Jaringan Komputer untuk siswa SMP Kelas IX, dilengkapi dengan sensor kamera pelacakan gerakan tangan (AI Hand Sensor).

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
npm run dev
```

### 2. Jalankan Ngrok Tunnel (Koneksi Database ke Web Online)
```bash
ngrok http --url=valarie-octadic-arboreally.ngrok-free.dev 5000
```

### 3. Jalankan Frontend (Local Testing)
```bash
cd frontend
npm run dev
```
*(Catatan: Versi publik online di-deploy otomatis di Vercel).*
