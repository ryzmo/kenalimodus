import { useState } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"

const TABS = [
  { id: "all", label: "Semua" },
  { id: "mybca", label: "myBCA Banner" },
  { id: "social", label: "Media Sosial" },
  { id: "qr", label: "QR Fisik Cabang" },
  { id: "push", label: "Notifikasi Ponsel" }
]

export default function EntrypointPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyLink = (url) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-[#f8fafc]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">
        {/* App Header */}
        <AppHeader
          title="Entry Point Saluran"
          subtitle="Akses Masuk Nasabah & Keluarga"
          showBack={true}
          backHref="/"
        />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
          {/* Header Ringkas */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#0055b8] uppercase tracking-wide">
                  Saluran Akses Nasabah
                </span>
                <h1 className="text-base sm:text-lg font-black text-[#002554] mt-1">
                  Desain Entry Point KenaliModus
                </h1>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Titik masuk nasabah dan keluarga menuju simulasi refleks, mulai dari aplikasi myBCA, media sosial, barcode cabang, hingga notifikasi HP.
                </p>
              </div>
              <Link
                href="/challenge"
                className="shrink-0 px-4 py-2 rounded-xl bg-[#0055b8] text-white text-xs font-bold hover:bg-[#003882] transition text-center"
              >
                Buka Challenge
              </Link>
            </div>
          </div>

          {/* Tab Filter Sederhana */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-[#0055b8] text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {copiedLink && (
            <div className="rounded-xl bg-[#002554] text-white p-2.5 text-xs font-semibold text-center">
              Tautan kampanye berhasil disalin.
            </div>
          )}

          {/* 1. myBCA Banner & Card */}
          {(activeTab === "all" || activeTab === "mybca") && (
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">01.</span>
                <h2 className="text-xs sm:text-sm font-black text-[#002554]">
                  Banner Aplikasi myBCA
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <span className="font-bold text-[#002554]">myBCA • Beranda Nasabah</span>
                  <span className="text-slate-400 text-[11px]">Akun Terverifikasi</span>
                </div>

                {/* Banner Minimalis */}
                <div className="rounded-xl bg-[#003882] text-white p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-200">
                      Fitur Proteksi Keluarga
                    </span>
                    <h3 className="text-sm sm:text-base font-bold leading-snug">
                      Cek Ketahanan Digital Orang Tua dari Modus APK
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
                      Simulasi 2 menit untuk mengukur kesiapan orang tua menghadapi kontak penipuan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/challenge"
                      className="px-3.5 py-2 rounded-lg bg-white text-[#002554] text-xs font-bold hover:bg-slate-100 transition"
                    >
                      Mulai Tes
                    </Link>
                    <Link
                      href="/keluarga"
                      className="px-3.5 py-2 rounded-lg border border-white/50 text-white text-xs font-semibold hover:bg-white/10 transition"
                    >
                      Keluarga
                    </Link>
                  </div>
                </div>

                {/* Card Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#002554]">Safe Score Keluarga</div>
                      <div className="text-[11px] text-slate-500">Skor rata-rata: 85/100</div>
                    </div>
                    <Link href="/profil" className="text-xs font-bold text-[#0055b8]">
                      Detail →
                    </Link>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#002554]">Rewards Edukasi</div>
                      <div className="text-[11px] text-slate-500">Tukar poin Safe Score</div>
                    </div>
                    <Link href="/rewards" className="text-xs font-bold text-[#0055b8]">
                      Lihat →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. Media Sosial & Pesan WhatsApp */}
          {(activeTab === "all" || activeTab === "social") && (
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">02.</span>
                <h2 className="text-xs sm:text-sm font-black text-[#002554]">
                  Media Sosial & Pesan Berbagi
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Desain Feed Medsos */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-[#002554]">Instagram Feed @goodlifebca</span>
                    <span className="text-slate-400 text-[11px]">Sponsored</span>
                  </div>

                  <div className="aspect-4/3 rounded-xl bg-[#002554] text-white p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                        #AwasModus
                      </span>
                      <h3 className="text-sm sm:text-base font-bold mt-1.5 leading-snug">
                        Orang Tua Anda Sering Menerima File .APK di WhatsApp?
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Cek apakah mereka sudah mengenali bahaya file APK palsu.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="text-slate-300 text-[11px]">bca.id/kenalimodus</span>
                      <span className="font-bold text-white underline">Ikuti Tes →</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ajakan visual untuk generasi muda agar menguji kewaspadaan orang tua mereka sebelum tabungan terancam.
                  </p>
                </div>

                {/* Pesan Teks WhatsApp */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-[#002554]">Pesan Ajakan WhatsApp Keluarga</span>
                    <span className="text-slate-400 text-[11px]">Teks Terusan</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <div className="text-[11px] text-slate-400 italic">Pesan untuk grup keluarga:</div>
                    <p className="font-semibold text-[#002554]">
                      Pemberitahuan untuk Bapak, Ibu, dan Seluruh Anggota Keluarga:
                    </p>
                    <p>
                      Waspada file berakhiran .apk di WhatsApp (undangan nikah palsu & resi kurir) yang bisa menyadap SMS perbankan.
                    </p>
                    <p>
                      Silakan coba tes refleks digital keluarga di website resmi BCA:
                      <br />
                      <span className="font-bold text-[#0055b8]">https://kenalimodus.bca.co.id/challenge</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyLink("https://kenalimodus.bca.co.id/challenge")}
                    className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#002554] text-xs font-semibold transition cursor-pointer"
                  >
                    Salin Teks WhatsApp
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 3. QR Fisik Cabang */}
          {(activeTab === "all" || activeTab === "qr") && (
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">03.</span>
                <h2 className="text-xs sm:text-sm font-black text-[#002554]">
                  QR Campaign Fisik di Cabang
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Visual Frame QR */}
                  <div className="w-40 p-4 rounded-xl border border-slate-300 bg-slate-50 text-center flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                      Akrilik Meja CS
                    </span>
                    <div className="w-24 h-24 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-mono text-xs text-slate-400 font-bold">
                      [ QR CODE ]
                    </div>
                    <span className="text-[11px] font-bold text-[#002554] mt-2">
                      Scan 2 Menit
                    </span>
                  </div>

                  {/* Info Penempatan */}
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="font-bold text-[#002554]">
                      Titik Pemasangan di Kantor Cabang:
                    </div>
                    <ul className="text-slate-600 pl-4 list-disc space-y-1 leading-relaxed">
                      <li>Meja Customer Service: Petugas mengarahkan nasabah mencoba tes saat pembukaan rekening atau konsultasi.</li>
                      <li>Sudut Mesin ATM: Stiker pengingat di samping layar sebelum nasabah melakukan transaksi tunai.</li>
                      <li>Bagian Bawah Struk ATM: Kode akses singkat bca.id/cekmodus pada struk bukti transaksi.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. Notifikasi Ponsel */}
          {(activeTab === "all" || activeTab === "push") && (
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">04.</span>
                <h2 className="text-xs sm:text-sm font-black text-[#002554]">
                  Push Notification myBCA
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Notifikasi 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-[#002554]">myBCA • Peringatan</span>
                    <span>Baru saja</span>
                  </div>
                  <div className="text-xs font-bold text-[#002554]">
                    Waspada Modus Surat Tilang .APK di WhatsApp
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ukur kewaspadaan Anda terhadap penyadapan SMS OTP lewat simulasi refleks 2 menit.
                  </p>
                  <Link href="/challenge" className="inline-block pt-1 text-xs font-bold text-[#0055b8]">
                    Buka Challenge →
                  </Link>
                </div>

                {/* Notifikasi 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-[#002554]">myBCA • Keluarga</span>
                    <span>Kemarin</span>
                  </div>
                  <div className="text-xs font-bold text-[#002554]">
                    Periksa Safe Score Anggota Keluarga
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pastikan orang tua tidak mudah tertipu kontak tidak dikenal. Hubungkan akun keluarga Anda.
                  </p>
                  <Link href="/keluarga" className="inline-block pt-1 text-xs font-bold text-[#0055b8]">
                    Lihat Keluarga →
                  </Link>
                </div>
              </div>
            </section>
          )}

          <BottomSpace />
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
