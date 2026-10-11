-- 1. CREATE TABLES
DROP TABLE IF EXISTS progress CASCADE;
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

-- 2. INSERT USERS
INSERT INTO users (id, nama, username, password, kelas, role, created_at) VALUES (1, 'Admin Guru', 'admin', '$2a$10$PKk9FlZrxh9gIWrhpkl3luoVdTi2RmhlCIoAFKRPdXrGG84sNbIde', 'Administrator', 'guru', '2026-08-02 09:42:56');
INSERT INTO users (id, nama, username, password, kelas, role, created_at) VALUES (2, 'Putri Nurmala', 'rkilaaaa', '$2a$10$jyWqWmNxNjH6ofi.J94MN.TYuCyx5dk/vPFOIeHMPOZ0SUsxpSbLu', 'IX.4', 'siswa', '2026-08-02 09:56:07');
INSERT INTO users (id, nama, username, password, kelas, role, created_at) VALUES (3, 'tegar', 'Tegar', '$2a$10$5LZ9CPGFQeZ6OWrpYCSLCuHsrboyGXI44ezh1/1ag7n3WsekcVzfW', 'IX-1', 'siswa', '2026-09-13 09:32:16');
INSERT INTO users (id, nama, username, password, kelas, role, created_at) VALUES (4, 'Tegar', 'Test1', '$2a$10$fwj6574obu4uGGmVfNn.8uM4cUc4Rzi3XRFkJJgU/.MMWiPGB2726', '', 'siswa', '2026-10-04 20:31:24');

-- 3. INSERT MATERI
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (1, 'Apa Itu Jaringan Komputer?', '<h2>Apa Itu Jaringan Komputer?</h2>

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
<p>Karena hampir semua aktivitas kita sekarang menggunakan jaringan! Mulai dari belajar online, main game, nonton YouTube, sampai kirim tugas ke guru. Semua itu bisa terjadi karena adanya jaringan komputer.</p>', 1, 'Laptop');
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (2, 'Perjalanan Internet: Dari ARPANET sampai WiFi', '<h2>Cerita di Balik Internet</h2>

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
<p>Dulu, komputer harus dihubungkan dengan kabel panjang untuk bisa internetan. Sekarang? Tinggal colok WiFi atau pakai data seluler, langsung terhubung! Perkembangan teknologi sungguh luar biasa.</p>', 2, 'History');
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (3, 'LAN, MAN, WAN — Kenali Jenis Jaringannya!', '<h2>Jenis-Jenis Jaringan Komputer</h2>

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
</div>', 3, 'Globe');
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (4, 'Media Transmisi: Kabel vs Nirkabel', '<h2>Media Transmisi Jaringan Komputer</h2>

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
<p>Ini yang dipakai HP kamu kalau tidak pakai WiFi. Menggunakan sinyal dari menara BTS (Base Transceiver Station). 5G bahkan bisa download film dalam hitungan detik!</p>', 4, 'Cable');
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (5, 'Perangkat Jaringan yang Sering Kamu Temui', '<h2>Perangkat Jaringan Komputer</h2>

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
<p>Gambaran sederhananya: Modem menerima internet dari provider → Router mengatur data → Switch menghubungkan ke komputer → Access Point memancarkan WiFi. Semua perangkat ini bekerja sama supaya kamu bisa internetan dengan lancar!</p>', 5, 'Router');
INSERT INTO materi (id, judul, konten, urutan, icon) VALUES (6, 'Manfaat & Dampak Jaringan Komputer', '<h2>Manfaat Jaringan Komputer</h2>

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
</table>', 6, 'ShieldCheck');

-- 4. INSERT QUIZ
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (1, 1, 'Apa yang dimaksud dengan jaringan komputer?', 'Satu komputer yang terhubung ke listrik', 'Dua atau lebih komputer yang saling terhubung untuk berbagi data', 'Aplikasi di handphone', 'Sebuah jenis printer canggih', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (2, 1, 'Contoh berbagi sumber daya (resource sharing) dalam jaringan adalah...', 'Menyalakan komputer sendirian', 'Satu printer dipakai oleh banyak komputer sekaligus', 'Mematikan WiFi router', 'Menginstall game di komputer', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (3, 1, 'Di bawah ini yang BUKAN merupakan manfaat jaringan komputer adalah...', 'Berkomunikasi dengan teman lewat chat', 'Berbagi file dan data antar komputer', 'Membuat komputer secara otomatis menjadi lebih mahal', 'Mengakses informasi di internet', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (4, 1, 'Contoh penerapan jaringan komputer di lingkungan sekolah adalah...', 'Rak buku di perpustakaan', 'Komputer-komputer di laboratorium yang saling terhubung', 'Kantin dan koperasi sekolah', 'Lapangan olahraga dan aula', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (5, 1, 'Salah satu keuntungan utama jaringan komputer di kantor adalah...', 'Karyawan bisa mencetak dokumen dari printer yang sama tanpa pindah tempat', 'Komputer jadi lebih cepat prosesnya', 'Layar monitor menjadi lebih besar', 'Keyboard tidak perlu diganti', 'a');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (6, 1, 'WiFi di rumah yang menghubungkan HP, laptop, dan Smart TV ke internet adalah contoh...', 'Jaringan kabel fiber optik', 'Jaringan komputer nirkabel', 'Jaringan telepon kabel', 'Jaringan listrik rumah', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (7, 1, 'Tujuan utama dibuatnya jaringan komputer adalah...', 'Supaya komputer terlihat lebih keren', 'Agar komputer bisa saling berbagi data, berkomunikasi, dan memakai perangkat bersama', 'Untuk mempercepat prosesor komputer', 'Menambah kapasitas harddisk', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (8, 1, 'Ketika kamu mengirim tugas ke guru melalui WhatsApp, kamu sedang memanfaatkan jaringan komputer untuk...', 'Berbagi perangkat keras', 'Komunikasi dan berbagi data', 'Memperbaiki komputer', 'Menyimpan file secara offline', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (9, 1, 'Analogi yang tepat untuk menggambarkan jaringan komputer adalah...', 'Buku yang dibaca sendirian di kamar', 'Sinyal HP yang menghubungkan kamu dengan teman-teman', 'Baterai yang mengisi daya laptop', 'Layar monitor yang menampilkan gambar', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (10, 1, 'Apa yang terjadi jika komputer di lab sekolah tidak terhubung dalam jaringan?', 'Komputer menjadi lebih cepat', 'Siswa tidak bisa berbagi file atau memakai printer bersama', 'Internet menjadi lebih kencang', 'Layar komputer menjadi lebih jernih', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (11, 2, 'Apa nama proyek yang menjadi cikal bakal lahirnya internet?', 'NASA Space Program', 'ARPANET', 'Microsoft Windows', 'Google Search', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (12, 2, 'Pada tahun berapa ARPANET pertama kali berhasil menghubungkan 4 komputer?', '1959', '1969', '1979', '1989', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (13, 2, 'Siapa ilmuwan yang menemukan World Wide Web (WWW)?', 'Vint Cerf', 'Bob Kahn', 'Tim Berners-Lee', 'Mark Zuckerberg', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (14, 2, 'Indonesia pertama kali terhubung ke internet pada tahun...', '1990', '1994', '2000', '2005', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (15, 2, 'Kepanjangan dari ARPANET adalah...', 'Advanced Research Projects Agency Network', 'American Research Program Network', 'Asian Radio Program Network', 'Automatic Router Protocol Network', 'a');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (16, 2, 'Protokol TCP/IP yang menjadi bahasa standar komunikasi internet dikembangkan oleh...', 'Tim Berners-Lee dan Steve Jobs', 'Vint Cerf dan Bob Kahn', 'Bill Gates dan Mark Zuckerberg', 'Albert Einstein dan Thomas Edison', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (17, 2, 'Nama penyedia layanan internet (ISP) pertama di Indonesia adalah...', 'Telkom', 'IndoNet', 'Indosat', 'XL Axiata', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (18, 2, 'Pada tahun berapa World Wide Web (WWW) ditemukan sehingga kita bisa melihat gambar dan teks di internet?', '1969', '1983', '1990', '2000', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (19, 2, 'Sebelum ada WiFi dan data seluler, cara komputer bisa internetan adalah...', 'Menggunakan remote control', 'Dihubungkan dengan kabel panjang ke jaringan', 'Memakai antena TV', 'Mengunakan baterai khusus', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (20, 2, 'Pada tahun 1983, ARPANET resmi menggunakan protokol standar internet yaitu...', 'HTTP', 'WWW', 'TCP/IP', 'WiFi 6', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (21, 3, 'Jaringan yang mencakup satu gedung sekolah atau lab komputer disebut...', 'LAN', 'MAN', 'WAN', 'VAN', 'a');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (22, 3, 'Jaringan komputer yang mencakup wilayah satu kota disebut...', 'LAN', 'MAN', 'WAN', 'PAN', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (23, 3, 'Contoh jaringan WAN yang paling dikenal dan dipakai seluruh dunia adalah...', 'Lab komputer sekolah', 'Jaringan WiFi di kantor', 'Internet', 'Koneksi Bluetooth', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (24, 3, 'Urutan jenis jaringan dari cakupan area terkecil ke terluas yang benar adalah...', 'WAN - MAN - LAN', 'LAN - WAN - MAN', 'LAN - MAN - WAN', 'MAN - LAN - WAN', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (25, 3, 'Keunggulan LAN dibandingkan WAN dalam hal biaya dan kecepatan adalah...', 'LAN jangkauannya lebih luas dari WAN', 'LAN lebih murah biayanya dan kecepatannya lebih tinggi', 'LAN bisa dipakai di seluruh dunia', 'LAN tidak membutuhkan kabel sama sekali', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (26, 3, 'Jaringan antar kantor pemerintah dalam satu kota Palembang adalah contoh...', 'LAN', 'MAN', 'WAN', 'PAN', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (27, 3, 'WiFi di rumahmu yang menghubungkan HP dan laptop termasuk jenis jaringan...', 'WAN', 'MAN', 'LAN', 'Internet global', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (28, 3, 'Jaringan komputer yang menghubungkan kantor-kantor bank di seluruh Indonesia termasuk jenis...', 'LAN', 'MAN', 'WAN', 'Bluetooth', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (29, 3, 'Kepanjangan dari LAN adalah...', 'Large Area Network', 'Local Area Network', 'Long Access Network', 'Linked Area Node', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (30, 3, 'Mengapa biaya membangun WAN lebih mahal dibandingkan LAN?', 'Karena WAN menggunakan perangkat yang lebih murah', 'Karena WAN hanya ada di satu gedung', 'Karena WAN mencakup area yang sangat luas sehingga butuh infrastruktur yang besar', 'Karena WAN tidak memerlukan kabel', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (31, 4, 'Kabel jaringan yang paling umum dipakai untuk menghubungkan komputer di lab sekolah adalah...', 'Fiber optik', 'Kabel UTP', 'Kabel coaxial', 'Kabel listrik PLN', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (32, 4, 'Fiber optik mengirimkan data dalam bentuk...', 'Arus listrik', 'Cahaya (sinar laser/LED)', 'Gelombang radio', 'Gelombang suara', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (33, 4, 'Apa keunggulan utama fiber optik dibandingkan kabel UTP?', 'Lebih murah harganya', 'Lebih mudah dan cepat dipasang', 'Kecepatan sangat tinggi dan bisa menjangkau jarak yang jauh', 'Tidak perlu konektor di ujungnya', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (34, 4, 'Media transmisi nirkabel yang memiliki jangkauan 30–100 meter dan sering dipakai di rumah adalah...', 'Bluetooth', 'WiFi', 'Inframerah', 'Sinyal satelit', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (35, 4, 'Konektor yang dipasang di ujung kabel UTP untuk disambungkan ke komputer atau switch adalah...', 'USB Type-A', 'HDMI', 'RJ-45', 'VGA', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (36, 4, 'Bluetooth paling cocok digunakan untuk...', 'Koneksi internet jarak jauh lintas kota', 'Mengirim file antar perangkat dalam jarak dekat (maks 10 meter)', 'Menonton streaming video HD', 'Mengisi daya baterai secara nirkabel', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (37, 4, 'Media transmisi yang menggunakan kabel fisik untuk mengirimkan data disebut...', 'Media nirkabel (unguided)', 'Media kabel (guided)', 'Media satelit', 'Media inframerah', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (38, 4, 'Sinyal yang digunakan oleh HP kamu saat tidak ada WiFi dan tetap bisa internetan adalah...', 'Bluetooth', 'Inframerah', 'Data seluler (4G/5G)', 'Kabel UTP', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (39, 4, 'Jarak maksimal kabel UTP agar sinyal masih optimal adalah...', '10 meter', '50 meter', '100 meter', '1 kilometer', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (40, 4, 'Fiber optik biasanya dipakai untuk...', 'Menghubungkan dua komputer dalam satu meja', 'Jaringan utama (backbone) internet antar kota atau negara', 'Koneksi Bluetooth earphone', 'Sinyal remote control TV', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (41, 5, 'Perangkat jaringan yang bertugas menghubungkan jaringan rumah (LAN) ke internet adalah...', 'Switch', 'Router', 'Kabel UTP', 'Printer', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (42, 5, 'Fungsi utama switch dalam jaringan komputer adalah...', 'Memancarkan sinyal WiFi ke seluruh ruangan', 'Menghubungkan beberapa komputer dalam satu jaringan LAN', 'Menyimpan data dan file dokumen', 'Mencetak dokumen dari komputer', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (43, 5, 'Perangkat yang dipasang di langit-langit ruangan dan berfungsi memancarkan sinyal WiFi disebut...', 'Modem', 'Switch', 'Access Point (AP)', 'Router', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (44, 5, 'Modem adalah perangkat yang berfungsi untuk...', 'Mencetak dokumen secara nirkabel', 'Menyimpan data dalam jumlah besar', 'Mengubah sinyal dari provider internet agar bisa digunakan komputer', 'Memancarkan sinyal Bluetooth', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (45, 5, 'Router sering dianalogikan seperti satpam di pos penjagaan karena...', 'Router menjaga keamanan fisik gedung kantor', 'Router mengatur dan mengarahkan data ke jalur dan tujuan yang benar', 'Router hanya bekerja pada malam hari', 'Router memeriksa identitas pengguna secara manual', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (46, 5, 'Alur kerja perangkat jaringan yang benar dari internet ke komputer pengguna adalah...', 'Switch → Router → Modem → Komputer', 'Modem → Router → Switch → Komputer', 'Komputer → Switch → Modem → Router', 'Router → Modem → Switch → Komputer', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (47, 5, 'Perangkat jaringan yang paling sering kamu lihat di rumah dan berfungsi ganda sebagai modem sekaligus router disebut...', 'Access Point murni', 'Switch 24 port', 'Modem router (modem WiFi)', 'Repeater jaringan', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (48, 5, 'Di lab komputer sekolah, perangkat yang menghubungkan semua komputer dalam satu ruangan adalah...', 'Router', 'Switch atau Hub', 'Access Point', 'Modem', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (49, 5, 'Kepanjangan dari AP dalam jaringan komputer adalah...', 'Application Program', 'Antenna Port', 'Access Point', 'Area Protocol', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (50, 5, 'Apa perbedaan utama antara Switch dan Hub?', 'Switch lebih mahal tapi fungsinya sama persis dengan Hub', 'Hub lebih pintar karena bisa mengirim data langsung ke tujuan', 'Switch lebih pintar karena mengirim data langsung ke komputer yang dituju, bukan ke semua', 'Hub hanya bisa digunakan di rumah, Switch hanya di kantor', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (51, 6, 'Contoh pemanfaatan jaringan komputer di bidang pendidikan adalah...', 'Transfer uang antar rekening bank', 'Belajar online dan mengirim tugas lewat Google Classroom', 'Memesan makanan lewat aplikasi GoFood', 'Main game Mobile Legends', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (52, 6, 'Manakah di bawah ini yang termasuk dampak NEGATIF dari jaringan komputer?', 'Belajar jadi lebih mudah dengan e-learning', 'Komunikasi dengan keluarga jauh jadi lebih cepat', 'Kejahatan siber seperti hacking dan pencurian data', 'Akses informasi dari seluruh dunia', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (53, 6, 'Shopee dan Tokopedia adalah contoh platform e-commerce, yaitu layanan jaringan komputer di bidang...', 'Pendidikan', 'Kesehatan', 'Ekonomi (belanja online)', 'Hiburan', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (54, 6, 'Merundung atau menghina teman melalui media sosial seperti Instagram atau TikTok disebut...', 'Hacking', 'Phishing', 'Cyber bullying', 'Malware', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (55, 6, 'Tips aman berinternet yang paling tepat adalah...', 'Membagikan password ke teman dekat agar bisa saling bantu', 'Mengklik link menarik dari orang tidak dikenal', 'Tidak memberikan password kepada siapa pun dan menjaga privasi data', 'Main game online sampai larut malam karena gratis', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (56, 6, 'Konsultasi dokter secara online melalui aplikasi adalah contoh manfaat jaringan komputer di bidang...', 'Ekonomi', 'Hiburan', 'Kesehatan (telemedicine)', 'Pendidikan', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (57, 6, 'Virus atau program jahat yang bisa merusak dan mencuri data di komputer kamu disebut...', 'Hoax', 'Malware', 'Cyber bullying', 'Spam', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (58, 6, 'Penipuan online yang dilakukan dengan cara mengirim link atau pesan palsu untuk mencuri data pengguna disebut...', 'Malware', 'Cyber bullying', 'Phishing', 'Hoax', 'c');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (59, 6, 'Cara yang tepat untuk mencegah penyebaran hoax di media sosial adalah...', 'Langsung share ke semua kontak agar semua tahu', 'Cek kebenaran informasi di sumber terpercaya sebelum menyebarkan', 'Abaikan saja karena tidak berbahaya', 'Bagikan hanya ke grup keluarga saja', 'b');
INSERT INTO quiz (id, materi_id, soal, opsi_a, opsi_b, opsi_c, opsi_d, jawaban) VALUES (60, 6, 'Nonton YouTube, mendengarkan Spotify, dan bermain game online adalah contoh manfaat jaringan di bidang...', 'Pendidikan', 'Kesehatan', 'Ekonomi', 'Hiburan', 'd');

-- 5. RESET AUTO-INCREMENT SEQUENCES
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('materi_id_seq', COALESCE((SELECT MAX(id) FROM materi), 1));
SELECT setval('quiz_id_seq', COALESCE((SELECT MAX(id) FROM quiz), 1));
