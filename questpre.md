# Kumpulan Soal Pre-Test (Baseline Behavioral Test) — Kenali Modus

Dokumen ini memuat seluruh instrumen Soal Pre-Test (Fase 1 Uji Refleks Awal) pada simulasi 2-Minute Scam Challenge di aplikasi Kenali Modus. Fase Pre-Test dirancang untuk mengukur tingkat kerentanan awal (baseline risky action rate) pengguna sebelum diberikan intervensi kognitif 3 Golden Rules BCA.

---

## Ikhtisar Struktur Soal Pre-Test

- Jumlah Skenario: 5 Butir Skenario Studi Kasus Nyata
- Format Pilihan: Multiple Choice (5 Pilihan: A, B, C, D, E)
- Tingkat Kesulitan: Sangat Sulit (Terdapat jebakan psikologis & distraksi teknis)
- Batasan Waktu: 120 Detik (2 Menit)
- Sistem Penilaian:
  - Pilihan Tepat (Aman): +20 Poin (isCorrect: true, isRisky: false)
  - Pilihan Berisiko/Salah: -5 s/d -20 Poin (isCorrect: false, isRisky: true)

---

## Rincian Soal Pre-Test

### 1. Skenario 1: Impersonation — Telepon Perubahan Biaya (Fake Call CS Bank)

- ID Soal: pre-1 (Pair: pair-call-otp)
- Kategori / Modus: Impersonation / Fake Call / CS Perbankan Palsu
- Tingkat Kesulitan: Sangat Sulit
- Konteks / Latar Belakang:
  Kamu mendapat telepon dari seseorang yang mengaku sebagai petugas bank. Ia menjelaskan bahwa ada perubahan biaya administrasi dan mengatakan kamu perlu melakukan beberapa langkah di aplikasi agar rekening tetap aktif. Ia tidak meminta OTP atau PIN secara langsung.
- Tipe Tampilan: Panggilan Telepon (phone)
- Pengirim: Petugas Layanan Bank
- Pesan / Dialog:
  "Selamat siang. Ada perubahan tarif transfer menjadi Rp150.000/bulan. Jika Bapak/Ibu ingin tetap di tarif gratis lama, kami bantu proses sekarang. Tidak perlu memberikan PIN atau OTP. Bapak/Ibu cukup membuka aplikasi dan mengikuti instruksi kami."
- Pertanyaan:
  Apa respon spontan yang paling tepat?

#### Pilihan Jawaban:
- [ ] A. Mengikuti langkahnya selama tidak diminta memberikan OTP atau PIN.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Tidak meminta OTP atau PIN bukan berarti penelepon sudah terverifikasi. Risiko dapat muncul dari instruksi lain yang diberikan melalui aplikasi.
- [ ] B. Meminta nomor laporan lalu mengikuti instruksinya jika nomor tersebut cocok.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Nomor laporan dapat disebutkan atau dibuat oleh pelaku. Itu bukan verifikasi independen.
- [x] C. Mengakhiri telepon dan menghubungi bank melalui kanal resmi yang kamu akses sendiri.
  (BENAR / Aman: +20 Poin)
  Alasan Feedback: Tepat. Identitas penelepon harus diverifikasi melalui kanal resmi yang kamu akses sendiri, bukan melalui nomor yang menghubungi kamu.
- [ ] D. Membuka aplikasi bank sambil tetap tersambung dengan penelepon agar prosesnya lebih cepat.
  (Salah / Berisiko: -15 Poin)
  Alasan Feedback: Penelepon tetap dapat mengarahkan tindakanmu selama panggilan berlangsung.
- [ ] E. Menunggu sampai penelepon menghubungi kembali melalui nomor resmi bank.
  (Salah / Berisiko: -5 Poin)
  Alasan Feedback: Menunggu panggilan kembali tidak memastikan bahwa komunikasi berikutnya benar-benar berasal dari bank.

#### Tanda-Tanda Bahaya (Red Flags):
1. Penelepon meminta pengguna melakukan tindakan melalui aplikasi.
2. Identitas penelepon belum diverifikasi secara independen.
3. Ada tekanan agar pengguna segera mengikuti instruksi.

#### Kaidah Perlindungan (Golden Rule):
"Jika pihak yang menelepon meminta kamu melakukan tindakan terkait rekening, hentikan komunikasi dan verifikasi melalui kanal resmi (Halo BCA 1500888)."

---

### 2. Skenario 2: APK Berbahaya — Resi Paket dari WhatsApp (Malware Injection)

- ID Soal: pre-2 (Pair: pair-apk-wa)
- Kategori / Modus: APK Berbahaya / Penyebaran APK Resi/Kurir
- Tingkat Kesulitan: Sangat Sulit
- Konteks / Latar Belakang:
  Kamu sedang menunggu paket. Tiba-tiba ada WhatsApp dari nomor yang mengaku sebagai kurir dan mengatakan paket membutuhkan konfirmasi tambahan.
- Tipe Tampilan: Percakapan WhatsApp (whatsapp)
- Pengirim: Kurir Ekspedisi
- Pesan / Dialog:
  "Siang kak, paket atas nama Anda perlu konfirmasi titik pengantaran. Kami kirim file resi sekaligus foto lokasi paket. Silakan buka file berikut: Foto_Bukti_Pengantaran.apk"
- Pertanyaan:
  Apa tindakan yang paling aman?

#### Pilihan Jawaban:
- [ ] A. Membuka file karena memang sedang menunggu paket.
  (Salah / Berisiko: -15 Poin)
  Alasan Feedback: Konteks paket yang memang sedang ditunggu dapat dimanfaatkan untuk membuat file berbahaya terlihat masuk akal.
- [ ] B. Membuka file tetapi tidak memberikan izin tambahan jika diminta.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Masalahnya sudah muncul sejak file meminta instalasi aplikasi dari sumber yang tidak terpercaya.
- [ ] C. Memeriksa nomor pengirim dan membuka file jika terlihat seperti nomor kurir.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Nomor telepon yang terlihat seperti nomor kurir tidak cukup untuk memastikan file tersebut aman.
- [x] D. Tidak membuka atau memasang file dan memeriksa status paket melalui aplikasi marketplace atau ekspedisi resmi.
  (BENAR / Aman: +20 Poin)
  Alasan Feedback: Tepat. Status paket dapat diverifikasi melalui aplikasi atau website resmi tanpa membuka file instalasi dari chat.
- [ ] E. Meminta pengirim mengirim ulang dokumen tersebut dalam format PDF.
  (Salah / Berisiko: -5 Poin)
  Alasan Feedback: Meminta format lain memang lebih baik daripada memasang APK, tetapi identitas pengirim tetap belum terverifikasi. Gunakan kanal resmi untuk mengecek paket.

#### Tanda-Tanda Bahaya (Red Flags):
1. File yang dikirim meminta instalasi aplikasi (ekstensi .apk).
2. File berasal dari percakapan WhatsApp yang tidak dikenal.
3. Status paket dapat diperiksa melalui kanal resmi tanpa file tersebut.

#### Kaidah Perlindungan (Golden Rule):
"Jangan memasang aplikasi dari file yang dikirim melalui chat. Periksa paket melalui aplikasi atau website resmi."

---

### 3. Skenario 3: Phishing — SMS Peringatan Aktivitas Login (Credential Harvesting)

- ID Soal: pre-3 (Pair: pair-phishing-link)
- Kategori / Modus: Phishing / Phishing Link Keamanan Rekening
- Tingkat Kesulitan: Sangat Sulit
- Konteks / Latar Belakang:
  Kamu menerima SMS dengan nama pengirim yang terlihat seperti institusi keuangan. Pesan mengatakan ada aktivitas login yang tidak biasa.
- Tipe Tampilan: Pesan Singkat SMS (sms)
- Pengirim: INFO-PERBANKAN
- Pesan / Dialog:
  "Rekening Anda terdeteksi login dari perangkat baru. Untuk memastikan akun tetap aman, lakukan verifikasi dalam 15 menit melalui tautan berikut: https://bca-verifikasi-keamanan.biz/login"
- Pertanyaan:
  Langkah apa yang kamu ambil pertama kali?

#### Pilihan Jawaban:
- [ ] A. Membuka link tersebut dan memasukkan User ID serta Password untuk memastikan akun aman.
  (Salah / Berisiko: -20 Poin)
  Alasan Feedback: Tautan dari SMS belum terverifikasi dan dapat mengarahkan ke halaman phishing.
- [ ] B. Memastikan nama pengirim terlihat familiar lalu membuka link tersebut.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Nama pengirim yang terlihat resmi tidak cukup untuk membuktikan keaslian pesan.
- [ ] C. Mencari nomor layanan bank di internet lalu tetap membuka link sambil menunggu informasi.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Tidak ada alasan untuk membuka tautan sebelum pesan tersebut diverifikasi.
- [x] D. Mengabaikan tautan dan membuka aplikasi bank secara langsung untuk memeriksa status rekening.
  (BENAR / Aman: +20 Poin)
  Alasan Feedback: Tepat. Kanal resmi diakses secara mandiri sehingga kamu tidak bergantung pada tautan dalam SMS.
- [ ] E. Membalas SMS untuk memastikan apakah benar ada aktivitas login.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Membalas pesan tidak membuktikan bahwa pengirim benar-benar berasal dari bank.

#### Tanda-Tanda Bahaya (Red Flags):
1. Pesan menggunakan ancaman urgensi / tekanan batas waktu (15 menit).
2. Nama domain bukan domain resmi institusi (menggunakan ekstensi .biz).
3. Pengguna diarahkan menuju link eksternal untuk verifikasi kredensial.

#### Kaidah Perlindungan (Golden Rule):
"Untuk masalah rekening, jangan mengikuti link dari SMS. Buka aplikasi atau website resmi secara mandiri."

---

### 4. Skenario 4: Social Engineering — Tawaran Pekerjaan Like Video (Freelance Scam)

- ID Soal: pre-4 (Pair: pair-soceng-deposit)
- Kategori / Modus: Social Engineering / Social Engineering Skema Freelance
- Tingkat Kesulitan: Sangat Sulit
- Konteks / Latar Belakang:
  Kamu dimasukkan ke grup yang menawarkan pekerjaan online berupa like dan review. Pada tahap awal, kamu bahkan menerima pembayaran kecil.
- Tipe Tampilan: Chat Grup Telegram (telegram)
- Pengirim: HRD Digital Media
- Pesan / Dialog:
  "Tugas pertama: like 3 video dan kami transfer Rp45.000. Pembayaran sudah berhasil. Untuk masuk ke level berikutnya dengan komisi Rp1.500.000, diperlukan deposit jaminan Rp300.000."
- Pertanyaan:
  Bagaimana kamu menyikapi tawaran tersebut?

#### Pilihan Jawaban:
- [ ] A. Transfer deposit karena tugas pertama sudah terbukti menghasilkan uang.
  (Salah / Berisiko: -20 Poin)
  Alasan Feedback: Pembayaran kecil di awal dapat digunakan sebagai umpan untuk membangun kepercayaan sebelum korban diminta melakukan deposit.
- [ ] B. Meminta bukti bahwa anggota lain berhasil mencairkan komisi sebelum memutuskan.
  (Salah / Berisiko: -5 Poin)
  Alasan Feedback: Bukti transfer atau testimoni dalam grup dapat dibuat oleh pihak yang terlibat dalam skema.
- [ ] C. Melanjutkan selama jumlah deposit masih lebih kecil daripada komisi yang dijanjikan.
  (Salah / Berisiko: -15 Poin)
  Alasan Feedback: Perbandingan deposit dan komisi tidak membuat skema tersebut aman.
- [x] D. Menolak deposit, keluar dari grup, dan menghentikan komunikasi.
  (BENAR / Aman: +20 Poin)
  Alasan Feedback: Tepat. Permintaan deposit untuk memperoleh pekerjaan atau mencairkan komisi merupakan indikator kuat skema penipuan.
- [ ] E. Meminta admin mengurangi nominal deposit agar risiko finansial lebih kecil.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Mengurangi nominal tidak menghilangkan pola penipuan. Masalah utamanya adalah pengguna diminta mengirim uang terlebih dahulu.

#### Tanda-Tanda Bahaya (Red Flags):
1. Pekerjaan sederhana menghasilkan komisi yang tidak wajar.
2. Pembayaran kecil diberikan terlebih dahulu untuk memancing rasa percaya.
3. Korban diminta mentransfer deposit dana untuk melanjutkan pekerjaan.

#### Kaidah Perlindungan (Golden Rule):
"Jangan pernah membayar atau mentransfer uang deposit untuk mendapatkan pekerjaan atau mencairkan komisi."

---

### 5. Skenario 5: Quishing (QRIS) — QRIS dengan Nama Hampir Sesuai (Tampered QR Code)

- ID Soal: pre-5 (Pair: pair-qris-quishing)
- Kategori / Modus: Quishing (QRIS) / Quishing / QRIS Tempelan
- Tingkat Kesulitan: Sangat Sulit
- Konteks / Latar Belakang:
  Kamu sedang membeli makanan di sebuah merchant. Setelah QRIS dipindai, nama penerima yang muncul di aplikasi hampir sama dengan nama toko.
- Tipe Tampilan: Layanan QRIS Kasir (qris)
- Pengirim: QRIS Kasir
- Pesan / Dialog:
  "Nama toko: Bakmi Sedap 88. Nama penerima pada layar pembayaran: Bakmi Sedap 88 Official."
- Pertanyaan:
  Apa tindakan yang paling tepat sebelum memasukkan PIN?

#### Pilihan Jawaban:
- [ ] A. Tetap membayar karena perbedaan nama hanya sedikit.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Perbedaan nama tujuan tetap perlu dikonfirmasi sebelum transaksi.
- [ ] B. Membayar nominal kecil terlebih dahulu untuk memastikan QRIS tersebut benar.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Transaksi kecil tetap mengirimkan dana ke rekening yang belum terverifikasi.
- [ ] C. Meminta kasir menunjukkan bukti bahwa rekening tersebut milik toko.
  (Salah / Berisiko: -5 Poin)
  Alasan Feedback: Bukti yang diberikan di tempat belum tentu cukup untuk memastikan kepemilikan rekening.
- [x] D. Menunda pembayaran dan mengonfirmasi nama penerima kepada merchant sebelum melanjutkan.
  (BENAR / Aman: +20 Poin)
  Alasan Feedback: Tepat. Nama penerima harus dipastikan sesuai dengan merchant sebelum pembayaran diotorisasi.
- [ ] E. Membayar jika nominal transaksi tidak terlalu besar karena risikonya dianggap kecil.
  (Salah / Berisiko: -10 Poin)
  Alasan Feedback: Nominal transaksi tidak menentukan apakah tujuan pembayaran tersebut benar atau salah.

#### Tanda-Tanda Bahaya (Red Flags):
1. Nama penerima tidak identik persis dengan nama merchant resmi.
2. Adanya stiker QRIS tempelan yang menutupi barcode asli merchant.
3. Desakan antrean yang membuat pembeli terburu-buru memasukkan PIN tanpa konfirmasi.

#### Kaidah Perlindungan (Golden Rule):
"Selalu periksa nama penerima pada layar konfirmasi sebelum memasukkan PIN dan menyelesaikan transaksi QRIS."
