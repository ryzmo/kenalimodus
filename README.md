# Kenali Modus (Prototype)

Kenali Modus adalah aplikasi web prototype simulasi interaktif dan edukasi keamanan perbankan digital berbasis **Mobile-First Responsive Design**. Aplikasi ini dirancang untuk menguji, mengukur, dan melatih refleks pengambilan keputusan pengguna terhadap berbagai modus penipuan digital terkini melalui pendekatan 2-Minute Scam Challenge.

Proyek ini berstatus sebagai prototype untuk kebutuhan riset, demonstrasi fitur, serta evaluasi efektivitas intervensi perilaku dan dampak finansial dengan pengalaman pengguna yang dioptimalkan untuk perangkat seluler (smartphone) dan tetap adaptif di desktop.

---

## Fitur & Pendekatan Desain

- **Mobile-First Experience**: Dirancang khusus dengan prioritas antarmuka smartphone (bottom navigation, touch-friendly tap targets, dan layout percakapan simulasi yang realistis) serta responsif di layar tablet dan desktop.
- **2-Minute Scam Challenge**: Simulasi kuis interaktif skenario nyata penipuan digital (APK kurir, QRIS palsu, social engineering, dll).
- **Gamifikasi & Rewards**: Level profil risiko, lencana keamanan, sistem poin, dan simulasi reward voucher.
- **Mode Lindungi Keluarga**: Fitur berbagi edukasi dan pantau skor keamanan anggota keluarga.
- **Dampak Finansial & Riset**: Evaluasi pra & pasca intervensi serta dashboard dampak kerugian yang berhasil dicegah.

---

## Tech Stack

### Frontend
- Framework: Next.js (Pages Router)
- Library UI: React 19
- Styling: Tailwind CSS v4 dan Custom CSS (Mobile-First Architecture)
- Iconography: Lucide React

### Backend & Database (Lightweight)
- Serverless API Routes: Next.js API Routes
- Database: NeonDB (Serverless PostgreSQL)

---

## Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:
- Node.js versi 18.17 atau yang lebih baru
- npm (bawaan Node.js), yarn, pnpm, atau bun
- Git

---

## Panduan Instalasi dan Menjalankan Aplikasi

### 1. Clone Repository
Unduh repositori proyek ke komputer lokal Anda:
```bash
git clone https://github.com/username/kenalimodus.git
cd kenalimodus
```

### 2. Instal Dependensi
Jalankan perintah berikut untuk menginstal seluruh pustaka yang diperlukan:
```bash
npm install
```

### 3. Konfigurasi Environment Variables (Opsional)
Buat berkas `.env.local` di root direktori jika Anda ingin menghubungkan aplikasi ke database NeonDB:
```env
DATABASE_URL=postgresql://user:password@endpoint/dbname?sslmode=require
```
Catatan: Jika `DATABASE_URL` tidak diisi, aplikasi tetap dapat berjalan menggunakan penyimpanan lokal (browser localStorage / in-memory fallback).

### 4. Jalankan Server Pengembangan
Mulai server development:
```bash
npm run dev
```

### 5. Buka di Browser
Akses aplikasi melalui peramban web pada alamat:
```
http://localhost:3000
```

---

## Perintah Tambahan

- Membangun aplikasi untuk produksi:
  ```bash
  npm run build
  ```
- Menjalankan versi produksi:
  ```bash
  npm start
  ```
- Menjalankan linter kode:
  ```bash
  npm run lint
  ```

---

## Catatan Status Prototype

 Ini merupakan prototype fungsional. Seluruh skenario simulasi, kuesioner evaluasi, serta visualisasi data disajikan sebagai media pembelajaran dan pengujian interaktif untuk meningkatkan kewaspadaan terhadap penipuan digital.
