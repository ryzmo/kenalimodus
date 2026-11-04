import React from "react"
import Icon from "./Icon"

/**
 * Komponen Simulasi Visual Kasus Nyata (Mock UI)
 * Didesain khusus agar orang tua / lansia dapat langsung mengenali
 * format tampilan nyata: Pesan WhatsApp, Telepon Panggilan Darurat,
 * SMS Blast Bank, Stiker Barcode QRIS, atau Grup Telegram Freelance.
 */
export default function ScenarioMockIllustration({ scenario }) {
  if (!scenario) return null

  const mockType = scenario.mockType || "whatsapp"
  const sender = scenario.sender || "Pengirim Tidak Dikenal"
  const message = scenario.message || ""
  const title = scenario.title || ""
  const category = scenario.category || ""

  // 1. TAMPILAN PANGGILAN TELEPON (Incoming Call)
  if (mockType === "phone") {
    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm">
        {/* Top Call Banner */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-black/40 text-[10px] text-slate-300 border-b border-white/10">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Panggilan Masuk...
          </span>
          <span className="font-mono">00:14</span>
        </div>

        {/* Caller Avatar & Name */}
        <div className="p-4 text-center">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-slate-700/80 border-2 border-slate-600 flex items-center justify-center text-slate-300 shadow-inner">
            <Icon name="PhoneCall" size={26} />
          </div>
          <div className="text-sm font-black text-white tracking-wide">{sender}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Nomor Tak Dikenal • Tanpa Centang Resmi</div>

          {/* Voice transcript bubble */}
          <div className="mt-3 mx-auto max-w-md p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-bold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Suara Penelepon:</span>
            </div>
            <p className="text-xs text-slate-150 leading-relaxed italic text-white/95">
              &quot;{message}&quot;
            </p>
          </div>
        </div>

        {/* Buttons Action Visual (Red vs Green) */}
        <div className="flex items-center justify-center gap-8 pb-4 pt-1">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-md">
              <Icon name="PhoneCall" size={16} className="rotate-[135deg]" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Tolak</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600/90 flex items-center justify-center text-white shadow-md">
              <Icon name="PhoneCall" size={16} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Jawab</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. TAMPILAN STIKER QRIS (Pembayaran Digital)
  if (mockType === "qris" || category.includes("QRIS")) {
    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* QRIS Header */}
        <div className="bg-[#002554] text-white px-3.5 py-2 flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5">
            <Icon name="QrCode" size={16} />
            <span>QRIS PEMBAYARAN</span>
          </span>
          <span className="text-[10px] font-normal text-sky-200">Periksa Nama Merchant</span>
        </div>

        <div className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/60">
          {/* Simulated QR Code Stamp */}
          <div className="relative w-28 h-28 shrink-0 bg-white p-2 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shadow-inner">
            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <Icon name="QrCode" size={54} />
            </div>
            <span className="text-[9px] font-bold text-slate-500 mt-1">NMID: ID1029381...</span>
          </div>

          <div className="flex-1 text-left space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Nama Terdaftar Pada Barcode:
            </div>
            <div className="text-xs sm:text-sm font-black text-[#002554] bg-white p-2.5 rounded-xl border border-slate-200">
              {sender}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
              {message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 3. TAMPILAN SMS BLAST (Kotak Pesan Masuk SMS)
  if (mockType === "sms") {
    return (
      <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* SMS Header */}
        <div className="bg-slate-100 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#003882] flex items-center justify-center">
              <Icon name="MessageSquare" size={14} />
            </div>
            <div>
              <div className="text-xs font-black text-[#002554] leading-tight">{sender}</div>
              <div className="text-[10px] text-slate-400 leading-tight">Pesan Singkat (SMS)</div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Baru saja</span>
        </div>

        {/* SMS Bubble */}
        <div className="p-3.5 bg-slate-50">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs text-slate-800 leading-relaxed font-sans">
            {message}
          </div>
        </div>
      </div>
    )
  }

  // 4. TAMPILAN WHATSAPP / TELEGRAM CHAT (Default)
  const isTelegram = mockType === "telegram"
  const headerBg = isTelegram ? "bg-[#229ed9]" : "bg-[#075e54]"
  const bubbleBg = isTelegram ? "bg-white" : "bg-[#dcf8c6]/90"

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-[#efeae2] shadow-sm">
      {/* App Bar WhatsApp / Telegram */}
      <div className={`${headerBg} text-white px-3.5 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {sender.charAt(0) || "P"}
          </div>
          <div>
            <div className="text-xs font-black text-white leading-tight flex items-center gap-1">
              <span>{sender}</span>
              {/* Tanpa centang jika penipu */}
            </div>
            <div className="text-[10px] text-white/80 leading-tight">
              {isTelegram ? "Grup Telegram" : "WhatsApp"}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-white/80 font-mono">11:42</span>
      </div>

      {/* Chat Canvas */}
      <div className="p-3.5 space-y-2">
        <div className={`p-3 max-w-sm rounded-2xl border border-slate-200/60 shadow-2xs text-xs text-slate-900 leading-relaxed ${bubbleBg}`}>
          {message}
          <div className="text-right text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-1">
            <span>11:42</span>
            <span>✓✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}

