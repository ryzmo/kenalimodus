# Dokumentasi Alur Keseluruhan Aplikasi (End-to-End System Flow) — Kenali Modus

Dokumentasi ini merangkum **seluruh arsitektur alur (*end-to-end user journey*)**, keterhubungan antar halaman, siklus intervensi kognitif (*Core Habit Loop*), alur data (*data pipeline & storage*), serta diagram alur lengkap (*comprehensive flowchart*) untuk aplikasi **Kenali Modus**.

---

## 1. Arsitektur & Siklus Utama (Core Architecture & Loops)

Aplikasi Kenali Modus dirancang berdasarkan kerangka kerja intervensi behavioral anti-fraud dengan 4 pilar utama:

```
[1. SIMULASI & REFLEKS]  --->  [2. SAFE SCORE & ROI]  --->  [3. EDUKASI & REWARD]  --->  [4. PROTEKSI SOSIAL]
  (/challenge: 5-Stage)          (/hasil: OJK Model)          (/modus & /rewards)          (/keluarga)
```

1. **Discovery & Onboarding (Beranda `/`)**:
   - Pengguna disambut nilai proposisi utama dan ringkasan skor kewaspadaan.
   - Pintu masuk ke simulasi cepat 2 menit atau ensiklopedia modus terbaru.
2. **Behavioral Experiment Engine (`/challenge`)**:
   - Sistem eksperimen 5 tahap (*Pre-Test $\rightarrow$ 3 Golden Rules Intervention $\rightarrow$ Post-Test $\rightarrow$ ARI Survey $\rightarrow$ DB Sync*).
3. **Analytics & Impact Feedback (`/hasil`)**:
   - Umpan balik skor personal (*Safe Score*), analisis penurunan risiko (*Relative Reduction*), dan kalkulator ROI mitigasi kerugian finansial (benchmark OJK).
4. **Continuous Learning & Incentives (`/modus` & `/rewards`)**:
   - Eksplorasi modus penipuan baru, menonton video/artikel resmi BCA dengan insentif poin literasi, *streak tracker*, dan penukaran reward/voucher.
5. **Collective Defense (`/keluarga`)**:
   - Memantau indeks pertahanan keluarga (*Family Defense Index*), mengidentifikasi anggota rentan, dan mengirim pengingat (*Nudge*) via WhatsApp.
6. **Institutional Governance (`/admin/impact`)**:
   - Dashboard monitoring bagi institusi/perbankan untuk melihat dampak intervensi secara agregat nasional.

---

## 2. Diagram Alur Keseluruhan (Master End-to-End Flowchart)

```mermaid
flowchart TD
    %% START & ENTRY
    Start([User Membuka Aplikasi Kenali Modus]) --> HomePage[Halaman Beranda /]

    %% HOME NAVIGATION & CHOICES
    HomePage --> HomeAction{Pilihan Aksi di Beranda}

    HomeAction -->|Mulai 2-Minute Challenge| StageIntro[1. CHALLENGE: Onboarding Nama & Usia]
    HomeAction -->|Eksplorasi Modus & Video| ModusPage[3. MODUS & EDUKASI /modus]
    HomeAction -->|Lihat Pertahanan Keluarga| FamilyPage[4. PROTEKSI KELUARGA /keluarga]
    HomeAction -->|Lihat Poin & Rewards| RewardsPage[5. REWARDS & POIN /rewards]
    HomeAction -->|Akses Admin Monitoring| AdminPage[6. ADMIN IMPACT DASHBOARD /admin/impact]
    HomeAction -->|Hubungi Kanal Resmi| BCAContact[Modal Bantuan Halo BCA 1500888 / WA Centang Hijau]

    %% ==========================================
    %% 1. CHALLENGE WORKFLOW
    %% ==========================================
    subgraph ChallengeEngine ["1. 2-Minute Scam Challenge Engine (/challenge)"]
        StageIntro --> StartPreTest[Inisialisasi Pre-Test: Timer 120s & Session ID]
        StartPreTest --> PreLoop[Pre-Test: 3 Skenario Keputusan Tanpa Panduan]
        PreLoop --> PreFeedback[Visual Feedback Jawaban & Hitung Pre-Risky Rate]
        PreFeedback --> IntervStage[Mikro-Intervensi: 3 Golden Rules BCA & Tips Kritis]
        IntervStage --> StartPostTest[Inisialisasi Post-Test: Reset Timer 120s]
        StartPostTest --> PostLoop[Post-Test: 3 Skenario Pengujian Refleks Baru]
        PostLoop --> PostFeedback[Visual Feedback Jawaban & Hitung Post-Risky Rate]
        PostFeedback --> ARISurvey[ARI Survey: 3 Soal Likert Skala 1-10 Attention, Repetition, Intention]
        ARISurvey --> SubmitData[Submit Data: Simpan LocalStorage & POST /api/impact/submit]
    end

    SubmitData --> HasilPage[2. HASIL SIMULASI & ANALISIS DAMPAK /hasil]

    %% ==========================================
    %% 2. HASIL WORKFLOW
    %% ==========================================
    subgraph HasilEngine ["2. Hasil & Impact Analytics (/hasil)"]
        HasilPage --> ShowSafeScore[Tampilkan Safe Score & Lencana]
        ShowSafeScore --> ShowImpactGraph[Visualisasi Penurunan Risiko: Pre vs Post Risky Rate]
        ShowImpactGraph --> ROICalc[Kalkulator Finansial OJK: Estimasi Kerugian yang Dicegah & ROI]
        ROICalc --> HasilAction{Aksi di Halaman Hasil}
        
        HasilAction -->|Bagikan Hasil / Protect Others| ShareWA[Share Link Safe Score ke WhatsApp / Clipboard]
        HasilAction -->|Tantang Anggota Keluarga| FamilyPage
        HasilAction -->|Klaim Poin Hadiah| RewardsPage
        HasilAction -->|Ulangi Simulasi| StageIntro
    end

    %% ==========================================
    %% 3. MODUS & EDUKASI WORKFLOW
    %% ==========================================
    subgraph ModusEngine ["3. Ensiklopedia Modus & Edukasi (/modus)"]
        ModusPage --> SearchFilter[Cari Modus / Filter Kategori: Phishing, APK, Social Engineering]
        SearchFilter --> OpenModusDetail[Buka Modal Detail Modus & Red Flags]
        ModusPage --> EduMedia[Tonton Video YouTube / Baca Artikel Resmi BCA]
        EduMedia --> ClaimEduPoints[Klaim Reward Literasi: +10 s/d +15 Poin ke Akun]
    end
    ClaimEduPoints --> RewardsPage

    %% ==========================================
    %% 4. KELUARGA WORKFLOW
    %% ==========================================
    subgraph FamilyEngine ["4. Perlindungan Keluarga / Social Defense (/keluarga)"]
        FamilyPage --> CalcFamilyIndex[Kalkulasi Family Defense Index & Deteksi Anggota Rentan]
        CalcFamilyIndex --> FamilyAction{Aksi Manajemen Keluarga}
        FamilyAction -->|Ingatkan Anggota Rentan| NudgeWA[Kirim Nudge WhatsApp Otomatis dengan Link Challenge]
        FamilyAction -->|Tambah Anggota Baru| AddMemberModal[Input Nama & Peran Anggota Baru]
        FamilyAction -->|Ajak Gabung Grup| CopyFamilyCode[Salin Kode Undangan Grup AMAN-BCA-XXX]
    end

    %% ==========================================
    %% 5. REWARDS WORKFLOW
    %% ==========================================
    subgraph RewardsEngine ["5. Gamifikasi, Poin & Rewards (/rewards)"]
        RewardsPage --> CheckTierStreak[Cek Tier Status & 7-Day Challenge Streak Tracker]
        CheckTierStreak --> RedeemCatalog[Pilih Voucher / Hadiah di Katalog]
        RedeemCatalog --> ValidatePoints{Poin Cukup?}
        ValidatePoints -- Ya --> ConfirmRedeem[Konfirmasi: Potong Poin, Simpan Voucher & Catat Log Riwayat]
        ValidatePoints -- Tidak --> AlertPoints[Notifikasi Poin Tidak Cukup: Tampilkan Panduan Tambah Poin]
        ConfirmRedeem --> ViewVoucher[Gunakan Kode Voucher di Merchant / BCA Partner]
    end

    %% ==========================================
    %% 6. ADMIN DASHBOARD WORKFLOW
    %% ==========================================
    subgraph AdminEngine ["6. Admin Dashboard Agregat (/admin/impact)"]
        AdminPage --> FetchAggregate[GET /api/impact/submit ke Neon PostgreSQL DB]
        FetchAggregate --> RenderKPI[Render Metrik: Partisipan, Penurunan Risiko Agregat, Rata-rata ARI, Total Loss Avoided]
        RenderKPI --> FilterTable[Pencarian & Analisis Riwayat Sesi Nasabah]
    end
```

---

## 3. Peta Navigasi Antar Halaman (Site Navigation Matrix)

| Dari Halaman | Menuju Halaman | Trigger / Aksi Pengguna | Keterangan Data yang Diteruskan / Disinkronkan |
| :--- | :--- | :--- | :--- |
| **Beranda (`/`)** | `/challenge` | Tombol *"Mulai 2-Minute Challenge"* | Membuka onboarding nama & usia, membuat sesi baru. |
| **Beranda (`/`)** | `/modus` | Tombol *"Lihat Semua Modus"* | Membuka katalog modus & video edukasi. |
| **Beranda (`/`)** | Kontak Resmi | Klik Card HaloBCA / WA BCA | Membuka popup kanal resmi pencegahan fraud. |
| **`/challenge`** | `/hasil` | Selesai menjawab 5 tahap (ARI Survey) | Menyimpan skor & hasil eksperimen ke storage dan database. |
| **`/hasil`** | `/keluarga` | Tombol *"Lindungi Keluarga"* | Membawa data Safe Score terbaru untuk diupdate ke profil *"Saya"*. |
| **`/hasil`** | `/rewards` | Tombol *"Klaim Hadiah"* | Mengakses saldo poin hasil menyelesaikan challenge (+10 s/d +20 poin). |
| **`/modus`** | `/challenge` | Tombol *"Coba Skenario Ini"* pada modal detail | Memulai simulasi yang difokuskan pada tipe modus yang dipilih. |
| **`/modus`** | `/rewards` | Menonton video / Membaca artikel edukasi | Menambah poin (+15 / +10 poin) ke `kenali_points_data`. |
| **`/keluarga`** | WhatsApp | Tombol *"Nudge"* pada anggota rentan | Mengirim format teks ajakan latihan via tautan WhatsApp. |
| **`/rewards`** | `/challenge` / `/modus` | Klik *"Misi Peroleh Poin"* | Mengarahkan pengguna untuk latihan/belajar agar saldo poin bertambah. |
| **Navbar/Footer** | Halaman Manapun | Klik ikon navigasi bawah (*Bottom Nav*) | Akses instan ke 5 halaman utama aplikasi. |

---

## 4. Alur Integrasi Data & State Pipeline (Data Flow Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor User as Nasabah / Pengguna
    participant Web as Next.js Frontend
    participant Local as localStorage Browser
    participant API as API Route (/api/impact/submit)
    participant DB as Neon PostgreSQL Database
    actor Admin as Tim Anti-Fraud / Admin

    Note over User,Web: 1. Fase Latihan & Eksperimen
    User->>Web: Masuk ke /challenge & Selesaikan 5 Tahap
    Web->>Local: Simpan (kenali_participant_name, age, modus_result, impact_result, points_data)
    Web->>API: POST /api/impact/submit (Payload: Pre/Post Risky Rate, ARI, Loss Avoided)
    API->>DB: INSERT INTO impact_participants (...)
    DB-->>API: 200 OK (Success Insert)
    API-->>Web: Response JSON (Saved Record & Updated Stats)
    Web->>User: Redirect ke /hasil (Visualisasi Safe Score & ROI Kalkulator)

    Note over User,Web: 2. Fase Proteksi Sosial & Gamifikasi
    User->>Web: Buka /keluarga
    Web->>Local: Sync skor 'Saya' dari kenali_modus_result
    User->>Web: Buka /rewards & Tukar Voucher
    Web->>Local: Potong saldo poin & simpan log di kenali_points_data

    Note over Admin,DB: 3. Fase Monitoring Institusi
    Admin->>Web: Akses /admin/impact
    Web->>API: GET /api/impact/submit
    API->>DB: SELECT Agregat Metrik & Recent Participants
    DB-->>API: Data Record Agregat
    API-->>Web: JSON (Total Peserta, Avg ARI, Total Kerugian Dicegah)
    Web->>Admin: Render Dashboard Analisis Dampak Real-Time
```

---

## 5. Ringkasan Kunci Struktur File Dokumentasi Terkait

Untuk detail spesifik per halaman dengan penjelasan komponen, parameter, dan state internal, silakan rujuk ke dokumentasi individual:
- 🏠 **[home-flow.md](file:///d:/kenalimodus/home-flow.md)** — Alur Halaman Beranda.
- ⏱️ **[challenge-flow.md](file:///d:/kenalimodus/challenge-flow.md)** — Alur FSM 5-Tahap 2-Minute Scam Challenge.
- 📊 **[hasil-flow.md](file:///d:/kenalimodus/hasil-flow.md)** — Alur Hasil Simulasi, Efektivitas Intervensi & Kalkulator OJK.
- 📚 **[modus-flow.md](file:///d:/kenalimodus/modus-flow.md)** — Alur Ensiklopedia Modus, Video & Artikel Edukasi Berhadiah.
- 👨‍👩‍👧‍👦 **[keluarga-flow.md](file:///d:/kenalimodus/keluarga-flow.md)** — Alur Family Defense Group, Nudge WhatsApp & Indeks Pertahanan.
- 🎁 **[rewards-flow.md](file:///d:/kenalimodus/rewards-flow.md)** — Alur Daily Streak, Katalog Penukaran Hadiah & Level Tier.
- 🛡️ **[admin-impact-flow.md](file:///d:/kenalimodus/admin-impact-flow.md)** — Alur Monitoring Dashboard Admin & Evaluasi Kognitif ARI.
