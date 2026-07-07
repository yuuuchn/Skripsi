import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'database.sqlite');

let db = null;

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      kelas TEXT DEFAULT '',
      role TEXT DEFAULT 'siswa',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS materi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judul TEXT NOT NULL,
      konten TEXT NOT NULL,
      urutan INTEGER NOT NULL,
      icon TEXT DEFAULT '📖'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS quiz (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materi_id INTEGER NOT NULL,
      soal TEXT NOT NULL,
      opsi_a TEXT NOT NULL,
      opsi_b TEXT NOT NULL,
      opsi_c TEXT NOT NULL,
      opsi_d TEXT NOT NULL,
      jawaban TEXT NOT NULL,
      FOREIGN KEY (materi_id) REFERENCES materi(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      materi_id INTEGER NOT NULL,
      selesai INTEGER DEFAULT 0,
      nilai INTEGER DEFAULT NULL,
      UNIQUE(user_id, materi_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (materi_id) REFERENCES materi(id)
    )
  `);

  saveDb();
  return db;
}

export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

export function seedMateri() {
  const existing = db.exec('SELECT COUNT(*) as count FROM materi');
  const count = existing[0]?.values[0][0] || 0;
  if (count > 0) return;

  const insert = db.prepare(
    'INSERT INTO materi (judul, konten, urutan, icon) VALUES (?, ?, ?, ?)'
  );

  const materiList = [
    {
      judul: 'Apa Itu Jaringan Komputer?',
      icon: 'Laptop',
      konten: `<h2>Apa Itu Jaringan Komputer?</h2>

<p>Halo! Pasti kamu sering dengar kata "jaringan" atau "internet", kan? Tapi sebenarnya apa sih jaringan komputer itu?</p>

<p><strong>Jaringan komputer</strong> adalah dua atau lebih komputer yang saling terhubung satu sama lain. Kenapa dihubungkan? Supaya mereka bisa saling berbagi data, berkomunikasi, dan memakai perangkat bersama-sama.</p>

<div class="card-jenis">
  <h3>🔎 Analogi Sederhana</h3>
  <p>Bayangkan kamu dan teman-temanmu punya handphone masing-masing. Kalau handphone kalian tidak punya sinyal atau kuota internet, kalian tidak bisa saling kirim pesan, kan? Nah, jaringan komputer itu seperti "sinyal" yang menghubungkan komputer satu dengan yang lain.</p>
</div>

<h3>🎯 Tujuan Jaringan Komputer</h3>
<ul>
  <li><strong>Berbagi Perangkat:</strong> Satu printer bisa dipakai bareng-bareng, tidak perlu beli printer untuk tiap komputer.</li>
  <li><strong>Berkomunikasi:</strong> Bisa chatting, video call, atau kirim email ke teman.</li>
  <li><strong>Mengakses Data:</strong> Bisa mengambil data dari komputer lain atau dari internet.</li>
</ul>

<h3>💡 Contoh dalam Kehidupan Sehari-hari</h3>
<ul>
  <li><strong>Di Sekolah:</strong> Laboratorium komputer yang komputer-komputernya terhubung satu sama lain.</li>
  <li><strong>Di Rumah:</strong> WiFi yang menghubungkan HP, laptop, dan TV kamu ke internet.</li>
  <li><strong>Di Kantor:</strong> Karyawan bisa mencetak dokumen menggunakan printer yang sama.</li>
</ul>

<h3>❓ Kenapa Penting Belajar Jaringan Komputer?</h3>
<p>Karena hampir semua aktivitas kita sekarang menggunakan jaringan! Mulai dari belajar online, main game, nonton YouTube, sampai kirim tugas ke guru. Semua itu bisa terjadi karena adanya jaringan komputer.</p>`
    },
    {
      judul: 'Perjalanan Internet: Dari ARPANET sampai WiFi',
      icon: 'History',
      konten: `<h2>Cerita di Balik Internet</h2>

<p>Tahukah kamu, internet yang kita pakai sekarang tidak langsung jadi seperti ini? Ada cerita panjang di belakangnya, lho! Yuk, kita lihat perjalanannya.</p>

<h3>Awal Mula: Tahun 1960-an</h3>
<p>Semua bermula dari proyek bernama <strong>ARPANET</strong> (Advanced Research Projects Agency Network) buatan Amerika Serikat. Tahun 1969, mereka berhasil menghubungkan <strong>4 komputer</strong> di 4 universitas berbeda. Ini adalah internet pertama di dunia!</p>

<div class="card-jenis">
  <h3>Fun Fact!</h3>
  <p>Komputer jaman dulu ukurannya sebesar satu ruangan! Bandingkan dengan HP-mu sekarang yang bisa digenggam.</p>
</div>

<h3>📅 Garis Waktu Perkembangan Internet</h3>
<ul>
  <li><strong>1969:</strong> ARPANET lahir — 4 komputer terhubung untuk pertama kalinya.</li>
  <li><strong>1970-an:</strong> Lahir protokol <strong>TCP/IP</strong> (bahasa komunikasi antar komputer) oleh Vint Cerf & Bob Kahn.</li>
  <li><strong>1983:</strong> ARPANET resmi pakai TCP/IP sebagai bahasa standar internet.</li>
  <li><strong>1990:</strong> Tim Berners-Lee menemukan <strong>World Wide Web (WWW)</strong> — kita bisa lihat gambar dan teks di internet!</li>
  <li><strong>2000-an:</strong> Internet masuk ke Indonesia, muncul WiFi, dan HP mulai bisa internetan.</li>
  <li><strong>Sekarang:</strong> Internet super cepat, video call, game online, sampai TV streaming.</li>
</ul>

<h3>🇮🇩 Internet Masuk ke Indonesia</h3>
<p>Indonesia pertama kali terhubung ke internet pada <strong>tahun 1994</strong> melalui ISP (Penyedia Layanan Internet) pertama bernama <strong>IndoNet</strong>. Waktu itu, internet masih sangat lambat dan mahal. Sekarang, hampir semua orang Indonesia bisa menikmati internet dengan mudah!</p>

<h3>⚡ Dari Kabel ke Nirkabel</h3>
<p>Dulu, komputer harus dihubungkan dengan kabel panjang untuk bisa internetan. Sekarang? Tinggal colok WiFi atau pakai data seluler, langsung terhubung! Perkembangan teknologi sungguh luar biasa.</p>`
    },
    {
      judul: 'LAN, MAN, WAN — Kenali Jenis Jaringannya!',
      icon: 'Globe',
      konten: `<h2>Jenis-Jenis Jaringan Komputer</h2>

<p>Jaringan komputer itu ada beberapa jenis, tergantung seberapa luas area yang dicakupnya. Mulai dari yang kecil (satu ruangan) sampai yang sangat besar (seluruh dunia). Yuk, kita kenali satu per satu!</p>

<div class="card-jenis">
  <h3>1. LAN (Local Area Network)</h3>
  <p>LAN adalah jaringan yang mencakup area <strong>kecil</strong>, seperti satu ruangan, satu sekolah, atau satu gedung.</p>
  <ul>
    <li><strong>Jarak:</strong> 10 meter sampai 1 km</li>
    <li><strong>Kecepatan:</strong> Sangat cepat!</li>
    <li><strong>Contoh:</strong> Lab komputer sekolah, WiFi rumah, jaringan kantor</li>
    <li><strong>Biaya:</strong> Relatif murah</li>
  </ul>
  <p><em>Bayangin LAN itu seperti grup WA satu kelas — cuma anggotanya orang-orang di kelas itu saja.</em></p>
</div>

<div class="card-jenis">
  <h3>2. MAN (Metropolitan Area Network)</h3>
  <p>MAN adalah jaringan yang mencakup area <strong>satu kota</strong> atau wilayah metropolitan.</p>
  <ul>
    <li><strong>Jarak:</strong> 1 sampai 10 km</li>
    <li><strong>Kecepatan:</strong> Sedang sampai cepat</li>
    <li><strong>Contoh:</strong> Jaringan antar sekolah dalam satu kota, jaringan kantor pemerintah kota</li>
  </ul>
  <p><em>Bayangin MAN seperti grup WA antar semua sekolah di satu kota — anggotanya dari sekolah yang berbeda-beda, tapi masih satu kota yang sama.</em></p>
</div>

<div class="card-jenis">
  <h3>3. WAN (Wide Area Network)</h3>
  <p>WAN adalah jaringan yang mencakup area <strong>sangat luas</strong>, bisa antar kota, antar negara, bahkan antar benua!</p>
  <ul>
    <li><strong>Jarak:</strong> Lebih dari 10 km (tidak terbatas!)</li>
    <li><strong>Kecepatan:</strong> Bervariasi</li>
    <li><strong>Contoh:</strong> Internet, jaringan bank nasional, jaringan kantor cabang di berbagai kota</li>
  </ul>
  <p><em>Bayangin WAN seperti grup internasional di WhatsApp — bisa chat dengan orang dari berbagai negara!</em></p>
</div>

<h3>Perbandingan LAN, MAN, dan WAN</h3>
<table>
  <tr><th>Aspek</th><th>LAN</th><th>MAN</th><th>WAN</th></tr>
  <tr><td>Luas Area</td><td>Kecil (ruangan/gedung)</td><td>Sedang (satu kota)</td><td>Sangat Luas (negara/dunia)</td></tr>
  <tr><td>Kecepatan</td><td>Tinggi</td><td>Sedang</td><td>Bervariasi</td></tr>
  <tr><td>Biaya</td><td>Murah</td><td>Mahal</td><td>Sangat Mahal</td></tr>
  <tr><td>Contoh</td><td>Lab komputer sekolah</td><td>Jaringan antar sekolah</td><td>Internet</td></tr>
</table>

<h3>🕸️ Topologi Jaringan Komputer</h3>
<p>Selain luas areanya, jaringan komputer juga dibedakan berdasarkan cara komputernya disusun secara fisik. Tata letak fisik susunan kabel dan komputer ini disebut <strong>Topologi Jaringan</strong>. Berikut adalah 3 topologi yang paling sering digunakan:</p>

<div class="card-jenis">
  <h4>1. Topologi Star (Bintang)</h4>
  <p>Semua komputer dihubungkan ke satu alat pusat bernama <strong>Switch</strong> atau <strong>Hub</strong>.</p>
  <ul>
    <li><strong>Kelebihan:</strong> Paling stabil. Jika satu komputer rusak atau kabelnya putus, komputer lainnya tetap bisa terhubung dan tidak terganggu.</li>
    <li><strong>Kekurangan:</strong> Butuh banyak kabel dan jika Switch pusatnya rusak, seluruh jaringan akan mati.</li>
  </ul>
</div>

<div class="card-jenis">
  <h4>2. Topologi Bus</h4>
  <p>Semua komputer dihubungkan berbaris sepanjang satu kabel utama (seperti kursi di dalam bus).</p>
  <ul>
    <li><strong>Kelebihan:</strong> Murah dan sangat mudah dipasang karena hanya butuh satu kabel utama.</li>
    <li><strong>Kekurangan:</strong> Jika kabel utamanya putus di tengah, maka semua jaringan komputer akan langsung terputus total.</li>
  </ul>
</div>

<div class="card-jenis">
  <h4>3. Topologi Ring (Cincin)</h4>
  <p>Komputer dihubungkan melingkar membentuk lingkaran (cincin), di mana data dikirim bergantian searah jarum jam.</p>
  <ul>
    <li><strong>Kelebihan:</strong> Aliran data teratur dan hemat kabel.</li>
    <li><strong>Kekurangan:</strong> Jika salah satu komputer rusak, aliran lingkaran data akan terputus dan merusak koneksi seluruh komputer.</li>
  </ul>
</div>`
    },
    {
      judul: 'Media Transmisi: Kabel vs Nirkabel',
      icon: 'Cable',
      konten: `<h2>Media Transmisi Jaringan Komputer</h2>

<p>Data dari komputer kamu sampai ke tujuan itu melalui "jalan". Jalannya bisa berupa kabel atau tanpa kabel (nirkabel). Inilah yang disebut <strong>media transmisi</strong>.</p>

<h3>A. Media Kabel (Guided)</h3>
<p>Data dikirim melalui kabel fisik. Lebih stabil dan cepat, tapi terbatas oleh panjang kabel.</p>

<h4>Kabel UTP (Unshielded Twisted Pair)</h4>
<p>Kabel yang paling sering dipakai di jaringan komputer. Warnanya biru, ujungnya pakai konektor RJ-45 (mirip colokan telepon, tapi lebih besar).</p>
<div style="text-align: center; margin: 15px 0;">
  <img src="/images/kabel_utp.jpg" alt="Kabel UTP" style="max-width: 100%; height: auto; max-height: 180px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
  <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Kabel UTP dengan konektor RJ-45</span>
</div>
<ul>
  <li>Kecepatan: hingga 1 Gbps (cukup buat streaming dan gaming)</li>
  <li>Jarak maksimal: 100 meter</li>
  <li>Harganya murah dan mudah dipasang</li>
  <li>Biasa dipakai di warnet, lab komputer, dan kantor</li>
</ul>

<h4>Kabel Fiber Optik</h4>
<p>Ini kabel paling canggih! Data dikirim dalam bentuk <strong>cahaya</strong>, bukan listrik. Makanya super cepat!</p>
<div style="text-align: center; margin: 15px 0;">
  <img src="/images/kabel_fiber_optic.jpeg" alt="Kabel Fiber Optik" style="max-width: 100%; height: auto; max-height: 180px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
  <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Kabel Fiber Optik</span>
</div>
<ul>
  <li>Kecepatan: hingga 100 Gbps (100 kali lebih cepat dari UTP!)</li>
  <li>Jarak: bisa puluhan kilometer</li>
  <li>Tahan gangguan listrik dan petir</li>
  <li>Harganya lebih mahal</li>
  <li>Biasa dipakai untuk jaringan internet utama (backbone)</li>
</ul>

<h3>B. Media Nirkabel (Unguided)</h3>
<p>Data dikirim menggunakan gelombang radio atau cahaya. Praktis karena tanpa kabel, tapi lebih gampang kena gangguan.</p>

<h4>WiFi (Wireless Fidelity)</h4>
<p>Pasti kamu tahu WiFi, kan? Ini yang paling populer! WiFi menggunakan gelombang radio untuk mengirimkan data.</p>
<ul>
  <li>Jangkauan: 30-100 meter (tergantung hambatan tembok)</li>
  <li>Kecepatan: sampai 1 Gbps (WiFi 6)</li>
  <li>Praktis, tidak perlu kabel ke setiap perangkat</li>
</ul>

<h4>Bluetooth</h4>
<p>Buat koneksi jarak dekat aja, maksimal 10 meter. Biasa dipakai buat kirim file HP-ke-HP, atau sambungin earphone nirkabel.</p>

<h4>Data Seluler (4G/5G)</h4>
<p>Ini yang dipakai HP kamu kalau tidak pakai WiFi. Menggunakan sinyal dari menara BTS (Base Transceiver Station). 5G bahkan bisa download film dalam hitungan detik!</p>`
    },
    {
      judul: 'Perangkat Jaringan yang Sering Kamu Temui',
      icon: 'Router',
      konten: `<h2>Perangkat Jaringan Komputer</h2>

<p>Supaya jaringan komputer bisa bekerja, ada beberapa perangkat (alat) yang diperlukan. Beberapa mungkin sudah sering kamu lihat di sekolah atau di rumah!</p>

<div class="card-jenis">
  <h3>1. Router</h3>
  <p>Router adalah perangkat yang menghubungkan jaringan lokal (LAN) ke internet. Router bertugas <strong>mengatur jalur data</strong> supaya sampai ke tujuan yang benar.</p>
  <div style="text-align: center; margin: 15px 0;">
    <img src="/images/router.png" alt="Router" style="max-width: 100%; height: auto; max-height: 160px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
    <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Modem Router Nirkabel dengan antena</span>
  </div>
  <ul>
    <li>Contoh: Modem WiFi di rumah kamu</li>
    <li>Fungsi: Menghubungkan perangkat di rumah ke internet</li>
    <li><em>Router itu seperti satpam di pos penjagaan — dia yang tahu jalur mana yang harus dilewati supaya data sampai ke tujuan.</em></li>
  </ul>
</div>

<div class="card-jenis">
  <h3>2. Switch / Hub</h3>
  <p>Switch adalah perangkat yang menghubungkan komputer-komputer dalam satu jaringan LAN. Bedanya, switch lebih pintar dari hub karena bisa mengirim data langsung ke komputer yang dituju.</p>
  <div style="text-align: center; margin: 15px 0;">
    <img src="/images/switch_hub.jpg" alt="Switch" style="max-width: 100%; height: auto; max-height: 150px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
    <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Switch Hub jaringan</span>
  </div>
  <ul>
    <li>Biasa dipakai di lab komputer sekolah</li>
    <li>Fungsi: Menghubungkan komputer dalam satu ruangan/gedung</li>
    <li><em>Switch itu seperti petugas di perpustakaan — dia tahu buku (data) harus dikembalikan ke rak mana.</em></li>
  </ul>
</div>

<div class="card-jenis">
  <h3>3. Modem</h3>
  <p>Modem (Modulator-Demodulator) adalah perangkat yang mengubah sinyal internet dari kabel telepon atau fiber optik menjadi sinyal yang bisa dipakai komputer.</p>
  <div style="text-align: center; margin: 15px 0;">
    <img src="/images/modem.jpg" alt="Modem" style="max-width: 100%; height: auto; max-height: 160px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
    <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Modem Internet</span>
  </div>
  <ul>
    <li>Biasanya jadi satu dengan router (disebut "modem router")</li>
    <li>Tanpa modem, kamu tidak bisa internetan!</li>
  </ul>
</div>

<div class="card-jenis">
  <h3>4. Access Point (AP)</h3>
  <p>Access Point adalah perangkat yang memancarkan sinyal WiFi. Biasanya dipasang di langit-langit ruangan.</p>
  <div style="text-align: center; margin: 15px 0;">
    <img src="/images/access_point.jpeg" alt="Access Point" style="max-width: 100%; height: auto; max-height: 160px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
    <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Access Point pemancar WiFi</span>
  </div>
  <ul>
    <li>Fungsi: Menyebarkan sinyal WiFi ke area yang luas</li>
    <li>Di sekolah, biasanya dipasang di beberapa titik supaya WiFi merata</li>
  </ul>
</div>

<div class="card-jenis">
  <h3>5. Kabel dan Konektor RJ-45</h3>
  <p>Kabel UTP dengan konektor RJ-45 di ujungnya adalah "jalan" data pada jaringan kabel. Konektor RJ-45 bentuknya mirip colokan telepon tapi lebih besar.</p>
  <div style="text-align: center; margin: 15px 0;">
    <img src="/images/konektor_rj45.jpg" alt="RJ45 Connector" style="max-width: 100%; height: auto; max-height: 160px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin: 0 auto; display: block;" />
    <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 6px; font-style: italic;">Foto: Konektor RJ-45</span>
  </div>
</div>

<h3>Bagaimana Semuanya Bekerja?</h3>
<p>Gambaran sederhananya: Modem menerima internet dari provider → Router mengatur data → Switch menghubungkan ke komputer → Access Point memancarkan WiFi. Semua perangkat ini bekerja sama supaya kamu bisa internetan dengan lancar!</p>`
    },
    {
      judul: 'Manfaat & Dampak Jaringan Komputer',
      icon: 'ShieldCheck',
      konten: `<h2>Manfaat Jaringan Komputer</h2>

<p>Jaringan komputer (terutama internet) sudah mengubah cara kita hidup. Yuk lihat apa aja manfaatnya!</p>

<h3>1. Bidang Pendidikan</h3>
<ul>
  <li>Kamu bisa <strong>belajar online</strong> dari rumah (seperti sekarang!)</li>
  <li>Kirim tugas lewat Google Classroom atau WhatsApp</li>
  <li>Cari bahan belajar lewat Google atau Wikipedia</li>
  <li>Nonton video pembelajaran di YouTube</li>
</ul>

<h3>2. Bidang Komunikasi</h3>
<ul>
  <li>Chat dengan teman lewat WhatsApp, Telegram, atau Instagram</li>
  <li>Video call dengan keluarga yang jauh (Zoom, Google Meet)</li>
  <li>Kirim email untuk keperluan formal</li>
</ul>

<h3>3. Bidang Ekonomi</h3>
<ul>
  <li>Belanja online di Shopee, Tokopedia, Lazada</li>
  <li>Transfer uang lewat mobile banking</li>
  <li>GoFood / GrabFood — pesan makanan lewat aplikasi</li>
</ul>

<h3>4. Bidang Kesehatan</h3>
<ul>
  <li>Konsultasi dokter online (telemedicine)</li>
  <li>Rekam medis tersimpan di komputer rumah sakit</li>
</ul>

<h3>5. Bidang Hiburan</h3>
<ul>
  <li>Nonton YouTube, Netflix, Spotify</li>
  <li>Main game online bareng teman (Mobile Legends, Free Fire, PUBG)</li>
</ul>

<h3>Dampak Negatif yang Harus Kamu Waspadai</h3>
<p>Jaringan komputer juga punya sisi negatif. Makanya kita harus pintar-pintar menggunakannya!</p>
<ul>
  <li><strong>Kejahatan Siber:</strong> Hacking, pencurian data, phising (penipuan online)</li>
  <li><strong>Cyber Bullying:</strong> Perundungan di media sosial</li>
  <li><strong>Kecanduan:</strong> Main game atau medsos berlebihan sampai lupa waktu</li>
  <li><strong>Hoax:</strong> Berita palsu yang menyebar dengan cepat</li>
  <li><strong>Malware:</strong> Virus komputer yang bisa merusak data</li>
</ul>

<div class="card-jenis">
  <h3>Tips Aman Berinternet untuk Pelajar</h3>
  <ul>
    <li><strong>Jaga Password:</strong> Jangan pernah memberi password ke siapa pun, termasuk teman dekat. Gunakan kombinasi huruf, angka, dan simbol.</li>
    <li><strong>Waspada Link Mencurigakan:</strong> Jangan klik link sembarangan yang dikirim orang tak dikenal — bisa jadi phishing (penipuan) yang mencuri data kamu.</li>
    <li><strong>Atur Waktu Layar:</strong> Batasi waktu bermain HP/game online. Sisihkan waktu untuk belajar, olahraga, dan istirahat cukup.</li>
    <li><strong>Cek Kebenaran Berita:</strong> Sebelum menyebarkan berita atau informasi, cek dulu kebenarannya di sumber terpercaya. Jangan ikut menyebarkan hoax!</li>
    <li><strong>Jaga Privasi:</strong> Jangan sembarangan membagikan foto, alamat rumah, atau nomor telepon di media sosial.</li>
    <li><strong>Laporkan Cyber Bullying:</strong> Kalau kamu atau temanmu menjadi korban perundungan online, segera laporkan ke orang tua atau guru.</li>
  </ul>
</div>

<h3>Perbandingan Dampak Positif dan Negatif</h3>
<table>
  <tr><th>Dampak Positif</th><th>Dampak Negatif</th></tr>
  <tr><td>Belajar online jadi mudah</td><td>Kecanduan media sosial dan game</td></tr>
  <tr><td>Komunikasi lebih cepat</td><td>Cyber bullying dan pelecehan online</td></tr>
  <tr><td>Akses informasi tanpa batas</td><td>Penyebaran hoax dan berita palsu</td></tr>
  <tr><td>Belanja dan transaksi praktis</td><td>Penipuan online (phishing, scam)</td></tr>
  <tr><td>Hiburan dan kreativitas</td><td>Malware dan pencurian data</td></tr>
</table>`
    }
  ];

  for (const m of materiList) {
    insert.run([m.judul, m.konten, materiList.indexOf(m) + 1, m.icon]);
  }
  saveDb();
}

export function seedQuiz() {
  const existing = db.exec('SELECT COUNT(*) as count FROM quiz');
  const count = existing[0]?.values[0][0] || 0;
  if (count > 0) return;

  const insert = db.prepare(
    'INSERT INTO quiz (materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const quizData = [
    // ── Materi 1: Pengertian Jaringan Komputer (10 soal) ──
    {
      materi_id: 1, soal: 'Apa yang dimaksud dengan jaringan komputer?',
      a: 'Satu komputer yang terhubung ke listrik', b: 'Dua atau lebih komputer yang saling terhubung untuk berbagi data',
      c: 'Aplikasi di handphone', d: 'Sebuah jenis printer canggih', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Contoh berbagi sumber daya (resource sharing) dalam jaringan adalah...',
      a: 'Menyalakan komputer sendirian', b: 'Satu printer dipakai oleh banyak komputer sekaligus',
      c: 'Mematikan WiFi router', d: 'Menginstall game di komputer', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Di bawah ini yang BUKAN merupakan manfaat jaringan komputer adalah...',
      a: 'Berkomunikasi dengan teman lewat chat', b: 'Berbagi file dan data antar komputer',
      c: 'Membuat komputer secara otomatis menjadi lebih mahal', d: 'Mengakses informasi di internet', jawaban: 'c'
    },
    {
      materi_id: 1, soal: 'Contoh penerapan jaringan komputer di lingkungan sekolah adalah...',
      a: 'Rak buku di perpustakaan', b: 'Komputer-komputer di laboratorium yang saling terhubung',
      c: 'Kantin dan koperasi sekolah', d: 'Lapangan olahraga dan aula', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Salah satu keuntungan utama jaringan komputer di kantor adalah...',
      a: 'Karyawan bisa mencetak dokumen dari printer yang sama tanpa pindah tempat', b: 'Komputer jadi lebih cepat prosesnya',
      c: 'Layar monitor menjadi lebih besar', d: 'Keyboard tidak perlu diganti', jawaban: 'a'
    },
    {
      materi_id: 1, soal: 'WiFi di rumah yang menghubungkan HP, laptop, dan Smart TV ke internet adalah contoh...',
      a: 'Jaringan kabel fiber optik', b: 'Jaringan komputer nirkabel',
      c: 'Jaringan telepon kabel', d: 'Jaringan listrik rumah', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Tujuan utama dibuatnya jaringan komputer adalah...',
      a: 'Supaya komputer terlihat lebih keren', b: 'Agar komputer bisa saling berbagi data, berkomunikasi, dan memakai perangkat bersama',
      c: 'Untuk mempercepat prosesor komputer', d: 'Menambah kapasitas harddisk', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Ketika kamu mengirim tugas ke guru melalui WhatsApp, kamu sedang memanfaatkan jaringan komputer untuk...',
      a: 'Berbagi perangkat keras', b: 'Komunikasi dan berbagi data',
      c: 'Memperbaiki komputer', d: 'Menyimpan file secara offline', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Analogi yang tepat untuk menggambarkan jaringan komputer adalah...',
      a: 'Buku yang dibaca sendirian di kamar', b: 'Sinyal HP yang menghubungkan kamu dengan teman-teman',
      c: 'Baterai yang mengisi daya laptop', d: 'Layar monitor yang menampilkan gambar', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Apa yang terjadi jika komputer di lab sekolah tidak terhubung dalam jaringan?',
      a: 'Komputer menjadi lebih cepat', b: 'Siswa tidak bisa berbagi file atau memakai printer bersama',
      c: 'Internet menjadi lebih kencang', d: 'Layar komputer menjadi lebih jernih', jawaban: 'b'
    },

    // ── Materi 2: Sejarah Internet (10 soal) ──
    {
      materi_id: 2, soal: 'Apa nama proyek yang menjadi cikal bakal lahirnya internet?',
      a: 'NASA Space Program', b: 'ARPANET',
      c: 'Microsoft Windows', d: 'Google Search', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Pada tahun berapa ARPANET pertama kali berhasil menghubungkan 4 komputer?',
      a: '1959', b: '1969',
      c: '1979', d: '1989', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Siapa ilmuwan yang menemukan World Wide Web (WWW)?',
      a: 'Vint Cerf', b: 'Bob Kahn',
      c: 'Tim Berners-Lee', d: 'Mark Zuckerberg', jawaban: 'c'
    },
    {
      materi_id: 2, soal: 'Indonesia pertama kali terhubung ke internet pada tahun...',
      a: '1990', b: '1994',
      c: '2000', d: '2005', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Kepanjangan dari ARPANET adalah...',
      a: 'Advanced Research Projects Agency Network', b: 'American Research Program Network',
      c: 'Asian Radio Program Network', d: 'Automatic Router Protocol Network', jawaban: 'a'
    },
    {
      materi_id: 2, soal: 'Protokol TCP/IP yang menjadi bahasa standar komunikasi internet dikembangkan oleh...',
      a: 'Tim Berners-Lee dan Steve Jobs', b: 'Vint Cerf dan Bob Kahn',
      c: 'Bill Gates dan Mark Zuckerberg', d: 'Albert Einstein dan Thomas Edison', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Nama penyedia layanan internet (ISP) pertama di Indonesia adalah...',
      a: 'Telkom', b: 'IndoNet',
      c: 'Indosat', d: 'XL Axiata', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Pada tahun berapa World Wide Web (WWW) ditemukan sehingga kita bisa melihat gambar dan teks di internet?',
      a: '1969', b: '1983',
      c: '1990', d: '2000', jawaban: 'c'
    },
    {
      materi_id: 2, soal: 'Sebelum ada WiFi dan data seluler, cara komputer bisa internetan adalah...',
      a: 'Menggunakan remote control', b: 'Dihubungkan dengan kabel panjang ke jaringan',
      c: 'Memakai antena TV', d: 'Mengunakan baterai khusus', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Pada tahun 1983, ARPANET resmi menggunakan protokol standar internet yaitu...',
      a: 'HTTP', b: 'WWW',
      c: 'TCP/IP', d: 'WiFi 6', jawaban: 'c'
    },

    // ── Materi 3: LAN, MAN, WAN (10 soal) ──
    {
      materi_id: 3, soal: 'Jaringan yang mencakup satu gedung sekolah atau lab komputer disebut...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'VAN', jawaban: 'a'
    },
    {
      materi_id: 3, soal: 'Jaringan komputer yang mencakup wilayah satu kota disebut...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'PAN', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'Contoh jaringan WAN yang paling dikenal dan dipakai seluruh dunia adalah...',
      a: 'Lab komputer sekolah', b: 'Jaringan WiFi di kantor',
      c: 'Internet', d: 'Koneksi Bluetooth', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Urutan jenis jaringan dari cakupan area terkecil ke terluas yang benar adalah...',
      a: 'WAN - MAN - LAN', b: 'LAN - WAN - MAN',
      c: 'LAN - MAN - WAN', d: 'MAN - LAN - WAN', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Keunggulan LAN dibandingkan WAN dalam hal biaya dan kecepatan adalah...',
      a: 'LAN jangkauannya lebih luas dari WAN', b: 'LAN lebih murah biayanya dan kecepatannya lebih tinggi',
      c: 'LAN bisa dipakai di seluruh dunia', d: 'LAN tidak membutuhkan kabel sama sekali', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'Jaringan antar kantor pemerintah dalam satu kota Palembang adalah contoh...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'PAN', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'WiFi di rumahmu yang menghubungkan HP dan laptop termasuk jenis jaringan...',
      a: 'WAN', b: 'MAN',
      c: 'LAN', d: 'Internet global', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Jaringan komputer yang menghubungkan kantor-kantor bank di seluruh Indonesia termasuk jenis...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'Bluetooth', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Kepanjangan dari LAN adalah...',
      a: 'Large Area Network', b: 'Local Area Network',
      c: 'Long Access Network', d: 'Linked Area Node', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'Mengapa biaya membangun WAN lebih mahal dibandingkan LAN?',
      a: 'Karena WAN menggunakan perangkat yang lebih murah', b: 'Karena WAN hanya ada di satu gedung',
      c: 'Karena WAN mencakup area yang sangat luas sehingga butuh infrastruktur yang besar', d: 'Karena WAN tidak memerlukan kabel', jawaban: 'c'
    },

    // ── Materi 4: Media Transmisi (10 soal) ──
    {
      materi_id: 4, soal: 'Kabel jaringan yang paling umum dipakai untuk menghubungkan komputer di lab sekolah adalah...',
      a: 'Fiber optik', b: 'Kabel UTP',
      c: 'Kabel coaxial', d: 'Kabel listrik PLN', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Fiber optik mengirimkan data dalam bentuk...',
      a: 'Arus listrik', b: 'Cahaya (sinar laser/LED)',
      c: 'Gelombang radio', d: 'Gelombang suara', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Apa keunggulan utama fiber optik dibandingkan kabel UTP?',
      a: 'Lebih murah harganya', b: 'Lebih mudah dan cepat dipasang',
      c: 'Kecepatan sangat tinggi dan bisa menjangkau jarak yang jauh', d: 'Tidak perlu konektor di ujungnya', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Media transmisi nirkabel yang memiliki jangkauan 30–100 meter dan sering dipakai di rumah adalah...',
      a: 'Bluetooth', b: 'WiFi',
      c: 'Inframerah', d: 'Sinyal satelit', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Konektor yang dipasang di ujung kabel UTP untuk disambungkan ke komputer atau switch adalah...',
      a: 'USB Type-A', b: 'HDMI',
      c: 'RJ-45', d: 'VGA', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Bluetooth paling cocok digunakan untuk...',
      a: 'Koneksi internet jarak jauh lintas kota', b: 'Mengirim file antar perangkat dalam jarak dekat (maks 10 meter)',
      c: 'Menonton streaming video HD', d: 'Mengisi daya baterai secara nirkabel', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Media transmisi yang menggunakan kabel fisik untuk mengirimkan data disebut...',
      a: 'Media nirkabel (unguided)', b: 'Media kabel (guided)',
      c: 'Media satelit', d: 'Media inframerah', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Sinyal yang digunakan oleh HP kamu saat tidak ada WiFi dan tetap bisa internetan adalah...',
      a: 'Bluetooth', b: 'Inframerah',
      c: 'Data seluler (4G/5G)', d: 'Kabel UTP', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Jarak maksimal kabel UTP agar sinyal masih optimal adalah...',
      a: '10 meter', b: '50 meter',
      c: '100 meter', d: '1 kilometer', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Fiber optik biasanya dipakai untuk...',
      a: 'Menghubungkan dua komputer dalam satu meja', b: 'Jaringan utama (backbone) internet antar kota atau negara',
      c: 'Koneksi Bluetooth earphone', d: 'Sinyal remote control TV', jawaban: 'b'
    },

    // ── Materi 5: Perangkat Jaringan (10 soal) ──
    {
      materi_id: 5, soal: 'Perangkat jaringan yang bertugas menghubungkan jaringan rumah (LAN) ke internet adalah...',
      a: 'Switch', b: 'Router',
      c: 'Kabel UTP', d: 'Printer', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Fungsi utama switch dalam jaringan komputer adalah...',
      a: 'Memancarkan sinyal WiFi ke seluruh ruangan', b: 'Menghubungkan beberapa komputer dalam satu jaringan LAN',
      c: 'Menyimpan data dan file dokumen', d: 'Mencetak dokumen dari komputer', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Perangkat yang dipasang di langit-langit ruangan dan berfungsi memancarkan sinyal WiFi disebut...',
      a: 'Modem', b: 'Switch',
      c: 'Access Point (AP)', d: 'Router', jawaban: 'c'
    },
    {
      materi_id: 5, soal: 'Modem adalah perangkat yang berfungsi untuk...',
      a: 'Mencetak dokumen secara nirkabel', b: 'Menyimpan data dalam jumlah besar',
      c: 'Mengubah sinyal dari provider internet agar bisa digunakan komputer', d: 'Memancarkan sinyal Bluetooth', jawaban: 'c'
    },
    {
      materi_id: 5, soal: 'Router sering dianalogikan seperti satpam di pos penjagaan karena...',
      a: 'Router menjaga keamanan fisik gedung kantor', b: 'Router mengatur dan mengarahkan data ke jalur dan tujuan yang benar',
      c: 'Router hanya bekerja pada malam hari', d: 'Router memeriksa identitas pengguna secara manual', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Alur kerja perangkat jaringan yang benar dari internet ke komputer pengguna adalah...',
      a: 'Switch → Router → Modem → Komputer', b: 'Modem → Router → Switch → Komputer',
      c: 'Komputer → Switch → Modem → Router', d: 'Router → Modem → Switch → Komputer', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Perangkat jaringan yang paling sering kamu lihat di rumah dan berfungsi ganda sebagai modem sekaligus router disebut...',
      a: 'Access Point murni', b: 'Switch 24 port',
      c: 'Modem router (modem WiFi)', d: 'Repeater jaringan', jawaban: 'c'
    },
    {
      materi_id: 5, soal: 'Di lab komputer sekolah, perangkat yang menghubungkan semua komputer dalam satu ruangan adalah...',
      a: 'Router', b: 'Switch atau Hub',
      c: 'Access Point', d: 'Modem', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Kepanjangan dari AP dalam jaringan komputer adalah...',
      a: 'Application Program', b: 'Antenna Port',
      c: 'Access Point', d: 'Area Protocol', jawaban: 'c'
    },
    {
      materi_id: 5, soal: 'Apa perbedaan utama antara Switch dan Hub?',
      a: 'Switch lebih mahal tapi fungsinya sama persis dengan Hub', b: 'Hub lebih pintar karena bisa mengirim data langsung ke tujuan',
      c: 'Switch lebih pintar karena mengirim data langsung ke komputer yang dituju, bukan ke semua', d: 'Hub hanya bisa digunakan di rumah, Switch hanya di kantor', jawaban: 'c'
    },

    // ── Materi 6: Manfaat & Dampak (10 soal) ──
    {
      materi_id: 6, soal: 'Contoh pemanfaatan jaringan komputer di bidang pendidikan adalah...',
      a: 'Transfer uang antar rekening bank', b: 'Belajar online dan mengirim tugas lewat Google Classroom',
      c: 'Memesan makanan lewat aplikasi GoFood', d: 'Main game Mobile Legends', jawaban: 'b'
    },
    {
      materi_id: 6, soal: 'Manakah di bawah ini yang termasuk dampak NEGATIF dari jaringan komputer?',
      a: 'Belajar jadi lebih mudah dengan e-learning', b: 'Komunikasi dengan keluarga jauh jadi lebih cepat',
      c: 'Kejahatan siber seperti hacking dan pencurian data', d: 'Akses informasi dari seluruh dunia', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Shopee dan Tokopedia adalah contoh platform e-commerce, yaitu layanan jaringan komputer di bidang...',
      a: 'Pendidikan', b: 'Kesehatan',
      c: 'Ekonomi (belanja online)', d: 'Hiburan', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Merundung atau menghina teman melalui media sosial seperti Instagram atau TikTok disebut...',
      a: 'Hacking', b: 'Phishing',
      c: 'Cyber bullying', d: 'Malware', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Tips aman berinternet yang paling tepat adalah...',
      a: 'Membagikan password ke teman dekat agar bisa saling bantu', b: 'Mengklik link menarik dari orang tidak dikenal',
      c: 'Tidak memberikan password kepada siapa pun dan menjaga privasi data', d: 'Main game online sampai larut malam karena gratis', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Konsultasi dokter secara online melalui aplikasi adalah contoh manfaat jaringan komputer di bidang...',
      a: 'Ekonomi', b: 'Hiburan',
      c: 'Kesehatan (telemedicine)', d: 'Pendidikan', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Virus atau program jahat yang bisa merusak dan mencuri data di komputer kamu disebut...',
      a: 'Hoax', b: 'Malware',
      c: 'Cyber bullying', d: 'Spam', jawaban: 'b'
    },
    {
      materi_id: 6, soal: 'Penipuan online yang dilakukan dengan cara mengirim link atau pesan palsu untuk mencuri data pengguna disebut...',
      a: 'Malware', b: 'Cyber bullying',
      c: 'Phishing', d: 'Hoax', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Cara yang tepat untuk mencegah penyebaran hoax di media sosial adalah...',
      a: 'Langsung share ke semua kontak agar semua tahu', b: 'Cek kebenaran informasi di sumber terpercaya sebelum menyebarkan',
      c: 'Abaikan saja karena tidak berbahaya', d: 'Bagikan hanya ke grup keluarga saja', jawaban: 'b'
    },
    {
      materi_id: 6, soal: 'Nonton YouTube, mendengarkan Spotify, dan bermain game online adalah contoh manfaat jaringan di bidang...',
      a: 'Pendidikan', b: 'Kesehatan',
      c: 'Ekonomi', d: 'Hiburan', jawaban: 'd'
    }
  ];

  for (const q of quizData) {
    insert.run([q.materi_id, q.soal, q.a, q.b, q.c, q.d, q.jawaban]);
  }
  saveDb();
}

export function seedAdmin() {
  const existing = db.exec('SELECT COUNT(*) as count FROM users WHERE username = ?', ['admin']);
  const count = existing[0]?.values[0][0] || 0;
  if (count > 0) return;

  const hashedPassword = '$2a$10$dummy';
  bcrypt.hash('admin123', 10).then(async (hash) => {
    db.run('INSERT INTO users (nama, username, password, kelas, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin Guru', 'admin', hash, 'Administrator', 'guru']);
    saveDb();
    console.log('Admin account created (username: admin, password: admin123)');
  });
}
