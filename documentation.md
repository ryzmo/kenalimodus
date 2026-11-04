# Dokumentasi Teknis dan Panduan Sistem KenaliModus

Dokumen ini menyajikan spesifikasi arsitektur, struktur basis data, daftar Application Programming Interface (API), navigasi halaman aplikasi, serta panduan instalasi dan penggunaan platform KenaliModus secara menyeluruh tanpa penggunaan elemen dekoratif atau emotikon.

---

## 1. Ikhtisar Sistem

KenaliModus adalah platform edukasi interaktif dan simulasi keamanan siber perbankan yang dirancang untuk menguji, mengukur, dan meningkatkan kewaspadaan nasabah beserta anggota keluarganya terhadap berbagai modus rekayasa sosial (social engineering), tautan phishing, peredaran file APK berbahaya, hingga penipuan berbasis QRIS (quishing).

### 1.1 Tumpukan Teknologi (Technology Stack)
- Bahasa Pemrograman: JavaScript (Node.js)
- Framework Antarmuka: Next.js (Versi 16 - Pages Router) & React 19
- Styling Antarmuka: Tailwind CSS Versi 4
- Basis Data: Neon Serverless PostgreSQL
- Autentikasi: NextAuth.js dengan strategi JSON Web Token (JWT) dan bcryptjs untuk hashing kata sandi

---

## 2. Struktur Basis Data (Database Schema)

Inisialisasi tabel dilakukan secara otomatis melalui berkas pustaka `src/lib/db.js` saat aplikasi berjalan. Berikut adalah skema tabel yang digunakan:

### 2.1 Tabel `tiers`
Menyimpan klasifikasi peringkat pengguna berdasarkan akumulasi perolehan poin edukasi.
- `id` (SERIAL, Primary Key): Pengenal unik tingkatan.
- `tier_name` (VARCHAR(50), Unique, Not Null): Nama tingkatan (Bronze Guardian, Silver Protector, Gold Champion, Platinum Legend).
- `min_points` (INT, Default 0): Batas minimum poin untuk mencapai tingkatan.
- `max_points` (INT, Default 99): Batas maksimum poin pada tingkatan bersangkutan.
- `badge_icon` (VARCHAR(50)): Nama aset representasi tingkatan.
- `perks_description` (TEXT): Rincian hak istimewa atau benefit tingkatan.
- `created_at` (TIMESTAMP WITH TIME ZONE): Waktu pencatatan data.

### 2.2 Tabel `users`
Menyimpan identitas nasabah, kredensial login, skor keamanan, poin, dan status proteksi anti brute-force.
- `id` (SERIAL, Primary Key): Pengenal unik pengguna.
- `name` (VARCHAR(150)): Nama lengkap pengguna.
- `email` (VARCHAR(191), Unique): Alamat email terdaftar.
- `password_hash` (TEXT): Hasil enkripsi satu arah kata sandi menggunakan pustaka bcrypt.
- `image` (TEXT): Tautan URL foto profil pengguna.
- `age` (INT, Default 25): Usia pengguna untuk keperluan segmentasi data demografis.
- `safe_score` (INT, Default 78): Indeks skor ketahanan keamanan digital (rentang 0 sampai 100).
- `total_points` (INT, Default 120): Akumulasi poin penghargaan yang aktif.
- `current_streak` (INT, Default 1): Jumlah hari keaktifan berturut-turut.
- `last_active_date` (DATE): Tanggal terakhir pengguna beraktivitas pada sistem.
- `tier_id` (INT, Foreign Key merujuk ke `tiers.id`): Relasi tingkatan pengguna.
- `role` (VARCHAR(30), Default 'user'): Hak akses akun ('user' atau 'admin').
- `failed_attempts` (INT, Default 0): Pencatat frekuensi kegagalan input kata sandi berturut-turut.
- `lockout_until` (TIMESTAMP WITH TIME ZONE): Waktu kedaluwarsa pembatasan login otomatis jika salah kata sandi 3 kali.
- `reset_token` (VARCHAR(255)): Token unik untuk alur pemulihan kata sandi.
- `reset_token_expiry` (TIMESTAMP WITH TIME ZONE): Masa berlaku token reset kata sandi.
- `created_at` (TIMESTAMP WITH TIME ZONE): Waktu pembuatan akun.
- `updated_at` (TIMESTAMP WITH TIME ZONE): Waktu pembaruan data akun terakhir.

### 2.3 Tabel `family_groups` & `family_members`
Menyimpan relasi perlindungan antar-anggota keluarga.
- `family_groups`:
  - `id` (SERIAL, Primary Key): Pengenal unik grup keluarga.
  - `name` (VARCHAR(100)): Nama grup keluarga.
  - `invite_code` (VARCHAR(20), Unique): Kode rujukan untuk bergabung ke grup.
  - `created_by` (INT, Foreign Key merujuk ke `users.id`): Pemilik atau pembuat grup.
- `family_members`:
  - `id` (SERIAL, Primary Key): Pengenal unik anggota.
  - `group_id` (INT, Foreign Key merujuk ke `family_groups.id`): Relasi grup.
  - `user_id` (INT, Nullable, Foreign Key merujuk ke `users.id`): ID akun terdaftar jika ada.
  - `name` (VARCHAR(100)): Nama anggota keluarga (misal: Ayah, Ibu, Anak).
  - `relation` (VARCHAR(50)): Hubungan kekerabatan.
  - `safe_score` (INT, Default 75): Skor keamanan individu anggota.
  - `status` (VARCHAR(30)): Status kerentanan ('Aman', 'Waspada', 'Rentan').

### 2.4 Tabel `challenge_history`
Merekam setiap sesi simulasi tes refleks yang telah diselesaikan.
- `id` (SERIAL, Primary Key): Pengenal unik rekaman challenge.
- `user_id` (INT, Nullable, Foreign Key merujuk ke `users.id`): Akun penyelesai tes.
- `participant_name` (VARCHAR(150)): Nama peserta tes.
- `score` (INT): Nilai akhir simulasi (0 sampai 100).
- `total_questions` (INT): Jumlah soal dalam sesi.
- `correct_count` (INT): Jumlah jawaban benar.
- `failed_count` (INT): Jumlah jawaban salah.
- `evaluation_headline` (VARCHAR(255)): Ringkasan evaluasi hasil.
- `details` (JSONB): Rincian log jawaban per butir soal, opsi yang dipilih, dan waktu pengerjaan.
- `points_earned` (INT): Poin yang dihadiahkan dari sesi tersebut.
- `created_at` (TIMESTAMP WITH TIME ZONE): Waktu pelaksanaan tes.

### 2.5 Tabel `points_log`
Buku besar riwayat perolehan dan penukaran poin.
- `id` (SERIAL, Primary Key): Pengenal unik transaksi poin.
- `user_id` (INT, Foreign Key merujuk ke `users.id`): Pemilik transaksi.
- `points_change` (INT): Besaran perubahan poin (positif untuk perolehan, negatif untuk penukaran voucher).
- `activity_type` (VARCHAR(100)): Jenis aktivitas ('challenge_completion', 'edu_claim', 'daily_streak', 'reward_redemption').
- `description` (TEXT): Keterangan perolehan atau pemotongan.
- `created_at` (TIMESTAMP WITH TIME ZONE): Waktu pencatatan.

---

## 3. Dokumentasi Application Programming Interface (API)

Semua endpoint berbasis RESTful JSON yang berada pada direktori `src/pages/api`.

### 3.1 Modul Autentikasi

#### POST `/api/auth/[...nextauth]`
Menangani protokol autentikasi NextAuth Credentials Provider dan penerbitan sesi JSON Web Token.
- Payload Permintaan:
  ```json
  {
    "email": "nasabah@example.com",
    "password": "PasswordNasabah123"
  }
  ```
- Mekanisme Keamanan:
  1. Pemeriksaan lockout: Menolak login jika kolom `lockout_until` masih aktif di masa depan.
  2. Verifikasi bcrypt terhadap `password_hash`.
  3. Proteksi Anti Brute-Force: Jika salah kata sandi mencapai 3 kali, akun dikunci otomatis selama 60 detik.
  4. Pengembalian sesi JWT berisi `id`, `name`, `email`, `role`, `safe_score`, `total_points`, dan `current_streak`.

#### POST `/api/auth/register`
Mendaftarkan akun baru ke dalam sistem.
- Payload Permintaan:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "password": "PasswordAman123",
    "age": 45
  }
  ```
- Respon Berhasil (HTTP 201):
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": { "id": 12, "email": "budi@example.com" }
  }
  ```
- Respon Gagal (HTTP 400): Email telah terdaftar atau format masukan tidak valid.

#### POST `/api/auth/forgot-password`
Menangani verifikasi dan penyetelan ulang kata sandi melalui token unik atau email terverifikasi.
- Parameter Aksi:
  - Permintaan Token (`action: "request"`): Menghasilkan token acak dengan masa berlaku 15 menit.
  - Penyetelan Ulang (`action: "reset"`): Memperbarui `password_hash` akun terkait.

---

### 3.2 Modul Simulasi Challenge

#### GET `/api/challenge/history`
Mengambil rekam jejak evaluasi challenge pengguna.
- Parameter Query: `userId` (wajib).
- Respon Berhasil (HTTP 200):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 105,
        "score": 100,
        "correctCount": 5,
        "failedCount": 0,
        "evaluationHeadline": "Refleks Keamanan Sangat Baik",
        "createdAt": "2026-11-03T10:00:00.000Z"
      }
    ]
  }
  ```

#### POST `/api/challenge/history`
Menyimpan hasil pengerjaan simulasi challenge ke database dan menghitung skor rata-rata nasabah.
- Payload Permintaan:
  ```json
  {
    "userId": 12,
    "participantName": "Budi Santoso",
    "score": 80,
    "totalQuestions": 5,
    "correctCount": 4,
    "failedCount": 1,
    "evaluationHeadline": "Waspada Terhadap Undangan APK",
    "details": [...],
    "pointsEarned": 10
  }
  ```
- Respon Berhasil (HTTP 200):
  ```json
  {
    "success": true,
    "message": "Riwayat challenge berhasil dicatat",
    "avgScore": 84
  }
  ```

---

### 3.3 Modul Pengguna & Sinkronisasi Data

#### GET `/api/user/sync`
Mengambil data poin, Safe Score, status level tier, dan riwayat aktivitas terkini dari database.
- Parameter Query: `userId` (wajib).

#### POST `/api/user/sync`
Memperbarui saldo poin dan mencatat transaksi ke tabel `points_log` (contoh: klaim poin setelah membaca artikel edukasi atau menonton video #AwasModus).
- Payload Permintaan:
  ```json
  {
    "userId": 12,
    "pointsAdded": 1,
    "activityType": "edu_claim",
    "description": "Edukasi BCA: Mantra B-C-A"
  }
  ```
- Respon Berhasil (HTTP 200): Saldo poin terakumulasi dan data tier dievaluasi ulang secara dinamis.

---

### 3.4 Modul Perlindungan Keluarga

#### GET `/api/family`
Mengambil daftar jaringan perlindungan keluarga dari akun yang sedang login.
- Parameter Query: `userId` (wajib).
- Data yang dikembalikan: Nama grup, kode undangan, serta rincian tiap anggota keluarga (nama, hubungan, nilai safe score, dan indikator risiko).

#### POST `/api/family`
Menambahkan anggota keluarga baru atau membuat grup keluarga baru.
- Payload Permintaan:
  ```json
  {
    "userId": 12,
    "name": "Ibu Maryam",
    "relation": "Orang Tua",
    "safeScore": 60
  }
  ```

---

### 3.5 Modul Administrator & Riset Dampak

#### GET `/api/admin/manage`
Endpoint khusus akun dengan wewenang `role: "admin"` untuk memantau data analitik agregat, total akun terdaftar, sebaran Safe Score nasional, dan total potensi kerugian finansial yang berhasil dihindarkan.

#### POST `/api/impact/submit`
Mencatat hasil riset evaluasi dampak sebelum (pre-test) dan sesudah (post-test) intervensi simulasi KenaliModus.

---

## 4. Struktur Antarmuka & Navigasi Halaman

Semua rute antarmuka pengguna berada di dalam folder `src/pages`:

1. `/` (Beranda):
   Menampilkan ringkasan status proteksi nasabah, Safe Score terkini, tombol akses cepat 2-Minute Challenge, serta cuplikan katalog modus penipuan terpopuler.

2. `/challenge`:
   Halaman inti simulasi refleks 2 menit. Menampilkan skenario kasus penipuan acak adaptif lengkap dengan ilustrasi format telepon masuk, pesan WhatsApp, stiker QRIS, maupun SMS blast, serta opsi penanganan dan umpan balik instan.

3. `/modus` (Katalog Modus & Artikel):
   Katalog komprehensif berisi jenis-jenis modus penipuan (APK Sniffer, Phishing Link, CS Palsu, QRIS Quishing, SIM Swap, Recovery Scam, dan Investasi Bodong). Menyajikan diagram alur kerja penipuan, tanda bahaya versus kaidah aman, video edukasi resmi, dan flashcard artikel.

4. `/keluarga`:
   Pusat kendali perlindungan keluarga. Mengizinkan nasabah menghubungkan akun orang tua atau anak untuk memantau tingkat kerentanan anggota keluarga secara terpusat.

5. `/profil`:
   Halaman akun nasabah yang menyajikan rincian Safe Score, evaluasi kelemahan spesifik, rekomendasi pencegahan, histori soal challenge yang pernah dikerjakan, dan status lencana keamanan.

6. `/rewards`:
   Katalog penukaran poin reward dengan e-voucher dan produk mitra resmi, dilengkapi riwayat log mutasi perolehan poin yang transparan.

7. `/entrypoint`:
   Pusat presentasi desain seluruh titik masuk nasabah ke platform KenaliModus, mencakup banner aplikasi myBCA, template kampanye media sosial, standee akrilik QR cabang perbankan, dan notifikasi smartphone.

8. `/auth/login`, `/auth/register`, `/auth/forgot-password`:
   Rangkaian antarmuka autentikasi pengguna dengan fitur proteksi lockout, opsi login cepat sebagai tamu (guest mode), dan alur pemulihan kata sandi.

9. `/admin` & `/admin/impact`:
   Dashboard pemantauan administrator untuk mengukur efektivitas perilaku nasabah dan dampak mitigasi risiko kejahatan siber.

---

## 5. Fitur Aksesibilitas Ramah Lansia

Untuk memastikan platform nyaman digunakan oleh target sasaran utama, yaitu orang tua dan lansia, sistem dilengkapi komponen `FontSizeFloatingControl.jsx`:
- Tombol mengambang yang dapat diakses di seluruh halaman web tanpa mengganggu navigasi utama.
- Tersedia tiga tingkatan skala huruf:
  - Normal (100% / 16px)
  - Besar (115% / 18.5px)
  - Sangat Besar (130% / 21px)
- Preferensi ukuran huruf disimpan secara permanen pada `localStorage` pengguna dan diinjeksikan langsung ke atribut akar dokumen HTML (`data-font-size`).

---

## 6. Panduan Instalasi dan Menjalankan Aplikasi

### 6.1 Prasyarat Sistem
- Node.js versi 18.18.0 atau yang lebih baru.
- Akun atau instans Neon PostgreSQL aktif.

### 6.2 Variabel Lingkungan (.env.local)
Buat berkas `.env.local` pada direktori utama proyek dengan konfigurasi berikut:
```env
# Koneksi Basis Data Neon PostgreSQL
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# Konfigurasi NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rahasia_kunci_autentikasi_kenalimodus_2026
```

### 6.3 Langkah Instalasi Lokal
1. Memasang dependensi pustaka:
   ```bash
   npm install
   ```
2. Menjalankan server pengembangan:
   ```bash
   npm run dev
   ```
3. Membuka aplikasi melalui peramban pada alamat:
   ```
   http://localhost:3000
   ```

### 6.4 Pembuatan Paket Produksi
Untuk memastikan tidak terdapat kesalahan sintaksis dan skrip siap dijalankan pada lingkungan produksi:
```bash
npm run build
npm run start
```

---

## 7. Prosedur Penerapan pada Vercel (Production Deployment)

1. Pastikan seluruh kode sumber telah diunggah ke repositori Git (GitHub atau GitLab).
2. Hubungkan repositori proyek ke layanan Vercel.
3. Pada menu **Project Settings** > **Environment Variables** di dashboard Vercel, daftarkan tiga variabel berikut:
   - `DATABASE_URL`: Alamat connection string Neon PostgreSQL Anda.
   - `NEXTAUTH_SECRET`: String acak aman untuk penandatanganan token JWT.
   - `NEXTAUTH_URL`: Alamat domain publik Vercel Anda (contoh: `https://kenalimodus.vercel.app`).
4. Jalankan perintah Deployment ulang (**Redeploy**) untuk menerapkan variabel lingkungan secara aktif.

