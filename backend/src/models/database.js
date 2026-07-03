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

<h3>🚀 Awal Mula: Tahun 1960-an</h3>
<p>Semua bermula dari proyek bernama <strong>ARPANET</strong> (Advanced Research Projects Agency Network) buatan Amerika Serikat. Tahun 1969, mereka berhasil menghubungkan <strong>4 komputer</strong> di 4 universitas berbeda. Ini adalah internet pertama di dunia!</p>

<div class="card-jenis">
  <h3>🧐 Fun Fact!</h3>
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
  <h3>🏫 1. LAN (Local Area Network)</h3>
  <p>LAN adalah jaringan yang mencakup area <strong>kecil</strong>, seperti satu ruangan, satu sekolah, atau satu gedung.</p>
  <ul>
    <li><strong>Jarak:</strong> 10 meter sampai 1 km</li>
    <li><strong>Kecepatan:</strong> Sangat cepat!</li>
    <li><strong>Contoh:</strong> Lab komputer sekolah, WiFi rumah, jaringan kantor</li>
    <li><strong>Biaya:</strong> Relatif murah</li>
  </ul>
  <p>💡 <em>Bayangin LAN itu seperti grup WA satu kelas — cuma anggotanya orang-orang di kelas itu saja.</em></p>
</div>

<div class="card-jenis">
  <h3>🏙️ 2. MAN (Metropolitan Area Network)</h3>
  <p>MAN adalah jaringan yang mencakup area <strong>satu kota</strong> atau wilayah metropolitan.</p>
  <ul>
    <li><strong>Jarak:</strong> 1 sampai 10 km</li>
    <li><strong>Kecepatan:</strong> Sedang sampai cepat</li>
    <li><strong>Contoh:</strong> Jaringan antar sekolah dalam satu kota, jaringan kantor pemerintah kota</li>
  </ul>
  <p>💡 <em>Bayangin MAN seperti grup WA satu angkatan sekolah — anggotanya dari kelas yang berbeda-beda, tapi masih satu sekolah.</em></p>
</div>

<div class="card-jenis">
  <h3>🌍 3. WAN (Wide Area Network)</h3>
  <p>WAN adalah jaringan yang mencakup area <strong>sangat luas</strong>, bisa antar kota, antar negara, bahkan antar benua!</p>
  <ul>
    <li><strong>Jarak:</strong> Lebih dari 10 km (tidak terbatas!)</li>
    <li><strong>Kecepatan:</strong> Bervariasi</li>
    <li><strong>Contoh:</strong> Internet, jaringan bank nasional, jaringan kantor cabang di berbagai kota</li>
  </ul>
  <p>💡 <em>Bayangin WAN seperti grup internasional di WhatsApp — bisa chat dengan orang dari berbagai negara!</em></p>
</div>

<h3>📊 Perbandingan LAN, MAN, dan WAN</h3>
<table>
  <tr><th>Aspek</th><th>LAN</th><th>MAN</th><th>WAN</th></tr>
  <tr><td>Luas Area</td><td>Kecil (ruangan/gedung)</td><td>Sedang (satu kota)</td><td>Sangat Luas (negara/dunia)</td></tr>
  <tr><td>Kecepatan</td><td>Tinggi</td><td>Sedang</td><td>Bervariasi</td></tr>
  <tr><td>Biaya</td><td>Murah</td><td>Mahal</td><td>Sangat Mahal</td></tr>
  <tr><td>Contoh</td><td>Lab komputer sekolah</td><td>Jaringan antar sekolah</td><td>Internet</td></tr>
</table>`
    },
    {
      judul: 'Media Transmisi: Kabel vs Nirkabel',
      icon: 'Cable',
      konten: `<h2>Media Transmisi Jaringan Komputer</h2>

<p>Data dari komputer kamu sampai ke tujuan itu melalui "jalan". Jalannya bisa berupa kabel atau tanpa kabel (nirkabel). Inilah yang disebut <strong>media transmisi</strong>.</p>

<h3>🔌 A. Media Kabel (Guided)</h3>
<p>Data dikirim melalui kabel fisik. Lebih stabil dan cepat, tapi terbatas oleh panjang kabel.</p>

<h4>1️⃣ Kabel UTP (Unshielded Twisted Pair)</h4>
<p>Kabel yang paling sering dipakai di jaringan komputer. Warnanya biru, ujungnya pakai konektor RJ-45 (mirip colokan telepon, tapi lebih besar).</p>
<ul>
  <li>Kecepatan: hingga 1 Gbps (cukup buat streaming dan gaming)</li>
  <li>Jarak maksimal: 100 meter</li>
  <li>Harganya murah dan mudah dipasang</li>
  <li>Biasa dipakai di warnet, lab komputer, dan kantor</li>
</ul>

<h4>2️⃣ Kabel Fiber Optik</h4>
<p>Ini kabel paling canggih! Data dikirim dalam bentuk <strong>cahaya</strong>, bukan listrik. Makanya super cepat!</p>
<ul>
  <li>Kecepatan: hingga 100 Gbps (100 kali lebih cepat dari UTP!)</li>
  <li>Jarak: bisa puluhan kilometer</li>
  <li>Tahan gangguan listrik dan petir</li>
  <li>Harganya lebih mahal</li>
  <li>Biasa dipakai untuk jaringan internet utama (backbone)</li>
</ul>

<h3>📡 B. Media Nirkabel (Unguided)</h3>
<p>Data dikirim menggunakan gelombang radio atau cahaya. Praktis karena tanpa kabel, tapi lebih gampang kena gangguan.</p>

<h4>1️⃣ WiFi (Wireless Fidelity)</h4>
<p>Pasti kamu tahu WiFi, kan? Ini yang paling populer! WiFi menggunakan gelombang radio untuk mengirimkan data.</p>
<ul>
  <li>Jangkauan: 30-100 meter (tergantung hambatan tembok)</li>
  <li>Kecepatan: sampai 1 Gbps (WiFi 6)</li>
  <li>Praktis, tidak perlu kabel ke setiap perangkat</li>
</ul>

<h4>2️⃣ Bluetooth</h4>
<p>Buat koneksi jarak dekat aja, maksimal 10 meter. Biasa dipakai buat kirim file HP-ke-HP, atau sambungin earphone nirkabel.</p>

<h4>3️⃣ Data Seluler (4G/5G)</h4>
<p>Ini yang dipakai HP kamu kalau tidak pakai WiFi. Menggunakan sinyal dari menara BTS (Base Transceiver Station). 5G bahkan bisa download film dalam hitungan detik!</p>`
    },
    {
      judul: 'Perangkat Jaringan yang Sering Kamu Temui',
      icon: 'Router',
      konten: `<h2>Perangkat Jaringan Komputer</h2>

<p>Supaya jaringan komputer bisa bekerja, ada beberapa perangkat (alat) yang diperlukan. Beberapa mungkin sudah sering kamu lihat di sekolah atau di rumah!</p>

<div class="card-jenis">
  <h3>📶 1. Router</h3>
  <p>Router adalah perangkat yang menghubungkan jaringan lokal (LAN) ke internet. Router bertugas <strong>mengatur jalur data</strong> supaya sampai ke tujuan yang benar.</p>
  <ul>
    <li>Contoh: Modem WiFi di rumah kamu</li>
    <li>Fungsi: Menghubungkan perangkat di rumah ke internet</li>
    <li>💡 <em>Router itu seperti satpam di pos penjagaan — dia yang tahu jalur mana yang harus dilewati supaya data sampai ke tujuan.</em></li>
  </ul>
</div>

<div class="card-jenis">
  <h3>🔀 2. Switch / Hub</h3>
  <p>Switch adalah perangkat yang menghubungkan komputer-komputer dalam satu jaringan LAN. Bedanya, switch lebih pintar dari hub karena bisa mengirim data langsung ke komputer yang dituju.</p>
  <ul>
    <li>Biasa dipakai di lab komputer sekolah</li>
    <li>Fungsi: Menghubungkan komputer dalam satu ruangan/gedung</li>
    <li>💡 <em>Switch itu seperti petugas di perpustakaan — dia tahu buku (data) harus dikembalikan ke rak mana.</em></li>
  </ul>
</div>

<div class="card-jenis">
  <h3>🌐 3. Modem</h3>
  <p>Modem (Modulator-Demodulator) adalah perangkat yang mengubah sinyal internet dari kabel telepon atau fiber optik menjadi sinyal yang bisa dipakai komputer.</p>
  <ul>
    <li>Biasanya jadi satu dengan router (disebut "modem router")</li>
    <li>Tanpa modem, kamu tidak bisa internetan!</li>
  </ul>
</div>

<div class="card-jenis">
  <h3>📡 4. Access Point (AP)</h3>
  <p>Access Point adalah perangkat yang memancarkan sinyal WiFi. Biasanya dipasang di langit-langit ruangan.</p>
  <ul>
    <li>Fungsi: Menyebarkan sinyal WiFi ke area yang luas</li>
    <li>Di sekolah, biasanya dipasang di beberapa titik supaya WiFi merata</li>
  </ul>
</div>

<div class="card-jenis">
  <h3>🔌 5. Kabel dan Konektor RJ-45</h3>
  <p>Kabel UTP dengan konektor RJ-45 di ujungnya adalah "jalan" data pada jaringan kabel. Konektor RJ-45 bentuknya mirip colokan telepon tapi lebih besar.</p>
</div>

<h3>🧩 Bagaimana Semuanya Bekerja?</h3>
<p>Gambaran sederhananya: Modem menerima internet dari provider → Router mengatur data → Switch menghubungkan ke komputer → Access Point memancarkan WiFi. Semua perangkat ini bekerja sama supaya kamu bisa internetan dengan lancar!</p>`
    },
    {
      judul: 'Manfaat & Dampak Jaringan Komputer',
      icon: 'ShieldCheck',
      konten: `<h2>Manfaat Jaringan Komputer</h2>

<p>Jaringan komputer (terutama internet) sudah mengubah cara kita hidup. Yuk lihat apa aja manfaatnya!</p>

<h3>📚 1. Bidang Pendidikan</h3>
<ul>
  <li>Kamu bisa <strong>belajar online</strong> dari rumah (seperti sekarang!)</li>
  <li>Kirim tugas lewat Google Classroom atau WhatsApp</li>
  <li>Cari bahan belajar lewat Google atau Wikipedia</li>
  <li>Nonton video pembelajaran di YouTube</li>
</ul>

<h3>💬 2. Bidang Komunikasi</h3>
<ul>
  <li>Chat dengan teman lewat WhatsApp, Telegram, atau Instagram</li>
  <li>Video call dengan keluarga yang jauh (Zoom, Google Meet)</li>
  <li>Kirim email untuk keperluan formal</li>
</ul>

<h3>🛒 3. Bidang Ekonomi</h3>
<ul>
  <li>Belanja online di Shopee, Tokopedia, Lazada</li>
  <li>Transfer uang lewat mobile banking</li>
  <li>GoFood / GrabFood — pesan makanan lewat aplikasi</li>
</ul>

<h3>🏥 4. Bidang Kesehatan</h3>
<ul>
  <li>Konsultasi dokter online (telemedicine)</li>
  <li>Rekam medis tersimpan di komputer rumah sakit</li>
</ul>

<h3>🎮 5. Bidang Hiburan</h3>
<ul>
  <li>Nonton YouTube, Netflix, Spotify</li>
  <li>Main game online bareng teman (Mobile Legends, Free Fire, PUBG)</li>
</ul>

<h3>⚠️ Dampak Negatif yang Harus Kamu Waspadai</h3>
<p>Jaringan komputer juga punya sisi negatif. Makanya kita harus pintar-pintar menggunakannya!</p>
<ul>
  <li><strong>Kejahatan Siber:</strong> Hacking, pencurian data, phising (penipuan online)</li>
  <li><strong>Cyber Bullying:</strong> Perundungan di media sosial</li>
  <li><strong>Kecanduan:</strong> Main game atau medsos berlebihan sampai lupa waktu</li>
  <li><strong>Hoax:</strong> Berita palsu yang menyebar dengan cepat</li>
  <li><strong>Malware:</strong> Virus komputer yang bisa merusak data</li>
</ul>

<div class="card-jenis">
  <h3>💡 Tips Aman Berinternet untuk Pelajar</h3>
  <ul>
    <li>Jangan pernah memberi password ke siapa pun</li>
    <li>Jangan klik link sembarangan yang dikirim orang tak dikenal</li>
    <li>Batasi waktu main HP, jangan sampai lupa belajar!</li>
    <li>Kalau dapat berita, cek dulu kebenarannya</li>
  </ul>
</div>`
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
    // Materi 1: Pengertian
    {
      materi_id: 1, soal: 'Apa itu jaringan komputer?',
      a: 'Satu komputer yang terhubung ke listrik', b: 'Dua atau lebih komputer yang saling terhubung',
      c: 'Aplikasi di handphone', d: 'Sebuah jenis printer', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Contoh berbagi sumber daya dalam jaringan adalah...',
      a: 'Menyalakan komputer', b: 'Satu printer dipakai banyak komputer',
      c: 'Mematikan WiFi', d: 'Menginstall game', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Di bawah ini yang BUKAN manfaat jaringan komputer adalah...',
      a: 'Berkomunikasi dengan teman', b: 'Berbagi data',
      c: 'Membuat komputer jadi lebih mahal', d: 'Mengakses internet', jawaban: 'c'
    },
    {
      materi_id: 1, soal: 'Contoh jaringan komputer di sekolah adalah...',
      a: 'Perpustakaan buku', b: 'Lab komputer yang terhubung',
      c: 'Kantin sekolah', d: 'Lapangan olahraga', jawaban: 'b'
    },
    {
      materi_id: 1, soal: 'Apa yang bisa dilakukan dengan adanya jaringan komputer?',
      a: 'Mencetak dokumen dari komputer lain', b: 'Membuat komputer baru',
      c: 'Menambah RAM', d: 'Mempercepat kipas komputer', jawaban: 'a'
    },
    // Materi 2: Sejarah
    {
      materi_id: 2, soal: 'Apa nama proyek awal yang menjadi cikal bakal internet?',
      a: 'NASA', b: 'ARPANET',
      c: 'Microsoft', d: 'Google', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Pada tahun berapa ARPANET pertama kali menghubungkan 4 komputer?',
      a: '1959', b: '1969',
      c: '1979', d: '1989', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Siapa yang menemukan World Wide Web (WWW)?',
      a: 'Vint Cerf', b: 'Bob Kahn',
      c: 'Tim Berners-Lee', d: 'Mark Zuckerberg', jawaban: 'c'
    },
    {
      materi_id: 2, soal: 'Indonesia pertama kali terhubung internet pada tahun...',
      a: '1990', b: '1994',
      c: '2000', d: '2005', jawaban: 'b'
    },
    {
      materi_id: 2, soal: 'Apa kepanjangan dari ARPANET?',
      a: 'Advanced Research Projects Agency Network', b: 'American Research Program Network',
      c: 'Asian Radio Program Network', d: 'Automatic Router Protocol Network', jawaban: 'a'
    },
    // Materi 3: Jenis-jenis
    {
      materi_id: 3, soal: 'Jaringan yang mencakup satu gedung sekolah disebut...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'VAN', jawaban: 'a'
    },
    {
      materi_id: 3, soal: 'Jaringan yang mencakup satu kota disebut...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'PAN', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'Contoh jaringan WAN yang paling terkenal adalah...',
      a: 'Lab komputer sekolah', b: 'Jaringan WiFi kantor',
      c: 'Internet', d: 'Jaringan Bluetooth', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Dari yang terkecil ke terbesar, urutan jaringan yang benar adalah...',
      a: 'WAN - MAN - LAN', b: 'LAN - WAN - MAN',
      c: 'LAN - MAN - WAN', d: 'MAN - LAN - WAN', jawaban: 'c'
    },
    {
      materi_id: 3, soal: 'Keunggulan LAN dibanding WAN adalah...',
      a: 'Jangkauan lebih luas', b: 'Biaya lebih murah dan kecepatan lebih tinggi',
      c: 'Bisa dipakai di seluruh dunia', d: 'Tidak perlu kabel', jawaban: 'b'
    },
    {
      materi_id: 3, soal: 'Jaringan yang paling luas jangkauannya adalah...',
      a: 'LAN', b: 'MAN',
      c: 'WAN', d: 'PAN', jawaban: 'c'
    },
    // Materi 4: Media Transmisi
    {
      materi_id: 4, soal: 'Kabel yang paling sering dipakai untuk jaringan LAN adalah...',
      a: 'Fiber optik', b: 'UTP',
      c: 'Kabel coaxial', d: 'Kabel listrik', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Fiber optik mengirimkan data dalam bentuk...',
      a: 'Listrik', b: 'Cahaya',
      c: 'Gelombang radio', d: 'Suara', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Apa kelebihan fiber optik dibanding kabel UTP?',
      a: 'Lebih murah', b: 'Lebih mudah dipasang',
      c: 'Kecepatan lebih tinggi dan jarak lebih jauh', d: 'Tidak perlu konektor', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Media transmisi nirkabel yang jangkauannya 30-100 meter adalah...',
      a: 'Bluetooth', b: 'WiFi',
      c: 'Inframerah', d: 'Satelit', jawaban: 'b'
    },
    {
      materi_id: 4, soal: 'Konektor yang dipakai di ujung kabel UTP adalah...',
      a: 'USB', b: 'HDMI',
      c: 'RJ-45', d: 'VGA', jawaban: 'c'
    },
    {
      materi_id: 4, soal: 'Bluetooth biasanya dipakai untuk...',
      a: 'Internet jarak jauh', b: 'Kirim data jarak dekat (maks 10m)',
      c: 'Menonton TV', d: 'Mengisi baterai', jawaban: 'b'
    },
    // Materi 5: Perangkat
    {
      materi_id: 5, soal: 'Perangkat yang menghubungkan perangkat di rumah ke internet adalah...',
      a: 'Switch', b: 'Router',
      c: 'Kabel UTP', d: 'Printer', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Apa fungsi switch dalam jaringan?',
      a: 'Memancarkan sinyal WiFi', b: 'Menghubungkan komputer dalam satu jaringan',
      c: 'Menyimpan data', d: 'Mencetak dokumen', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Perangkat yang memancarkan sinyal WiFi disebut...',
      a: 'Modem', b: 'Switch',
      c: 'Access Point', d: 'Router', jawaban: 'c'
    },
    {
      materi_id: 5, soal: 'Konektor RJ-45 berbentuk mirip dengan...',
      a: 'Colokan listrik', b: 'Colokan telepon (lebih besar)',
      c: 'USB', d: 'HDMI', jawaban: 'b'
    },
    {
      materi_id: 5, soal: 'Router bertugas untuk...',
      a: 'Menyimpan file', b: 'Mengatur jalur data ke tujuan yang benar',
      c: 'Menampilkan gambar', d: 'Mencetak dokumen', jawaban: 'b'
    },
    // Materi 6: Manfaat
    {
      materi_id: 6, soal: 'Contoh manfaat jaringan di bidang pendidikan adalah...',
      a: 'Transfer uang', b: 'Belajar online dan kirim tugas',
      c: 'Pesan makanan', d: 'Main game', jawaban: 'b'
    },
    {
      materi_id: 6, soal: 'Apa dampak NEGATIF dari jaringan komputer?',
      a: 'Belajar jadi mudah', b: 'Komunikasi jadi cepat',
      c: 'Kejahatan siber seperti hacking', d: 'Mengakses informasi', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Contoh e-commerce (belanja online) adalah...',
      a: 'Zoom', b: 'Shopee',
      c: 'YouTube', d: 'WhatsApp', jawaban: 'b'
    },
    {
      materi_id: 6, soal: 'Yang termasuk cyber bullying adalah...',
      a: 'Belajar kelompok', b: 'Mengirim tugas',
      c: 'Merundung teman di media sosial', d: 'Nonton film', jawaban: 'c'
    },
    {
      materi_id: 6, soal: 'Tips aman berinternet yang benar adalah...',
      a: 'Memberi password ke teman', b: 'Klik link sembarangan',
      c: 'Tidak memberi password ke siapa pun', d: 'Main game sampai lupa waktu', jawaban: 'c'
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
