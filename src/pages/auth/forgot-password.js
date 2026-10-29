import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "../../components/Icon"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Minta Kode, 2: Masukkan Kode & Password Baru
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [demoCode, setDemoCode] = useState("")

  // Step 1: Request Kode Pemulihan
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal memproses permintaan.")
      } else {
        if (data.demoResetCode) {
          setDemoCode(data.demoResetCode)
          setToken(data.demoResetCode) // Auto-fill untuk kemudahan pengguna
        }
        setSuccessMsg("Kode verifikasi pemulihan berhasil dibuat!")
        setStep(2)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kendala saat menghubungi server.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Konfirmasi Password Baru
  const handleConfirmReset = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi baru tidak cocok.")
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          email,
          token,
          newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal mengatur ulang kata sandi.")
      } else {
        setSuccessMsg("Kata sandi berhasil diperbarui! Mengalihkan ke login...")
        setTimeout(() => {
          router.push("/auth/login")
        }, 1200)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kendala saat menghubungi server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans">
      <Head>
        <title>Reset Password — Kenali Modus BCA</title>
      </Head>

      {/* Mobile Device Canvas Wrapper */}
      <div className="w-full max-w-md sm:rounded-[42px] bg-white min-h-screen sm:min-h-[820px] shadow-2xl relative overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-slate-100">
        
        {/* Top Organic Wave Graphic Area */}
        <div className="relative h-60 sm:h-64 w-full bg-gradient-to-br from-[#0292fc] via-[#2ba8ff] to-[#0051b3] overflow-hidden flex flex-col justify-between p-6">
          {/* Topographic Contour Vector Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 80 Q 100 20 200 90 T 450 60" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 120 Q 80 50 220 130 T 450 100" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 160 Q 120 90 240 180 T 450 140" stroke="white" strokeWidth="1.5" fill="none"/>
              <ellipse cx="280" cy="110" rx="60" ry="35" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Top Navigation */}
          <div className="relative z-10 flex items-center justify-between text-white pt-2">
            <Link
              href="/auth/login"
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
            >
              <Icon name="ChevronLeft" size={20} />
            </Link>
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Reset Password
            </span>
            <div className="w-9" />
          </div>

          {/* Wave Curve Masking Bottom */}
          <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className="h-16 w-full fill-white"
            >
              <path d="M0.00,49.98 C149.99,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
            </svg>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="px-7 sm:px-9 pt-2 pb-6 flex-1 flex flex-col justify-between bg-white z-10">
          <div>
            {/* Title with Underline Accent */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-black text-[#002554] tracking-tight inline-block relative">
                {step === 1 ? "Forgot Password" : "New Password"}
                <div className="h-1 w-10 bg-[#0292fc] rounded-full mt-1.5" />
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                {step === 1
                  ? "Masukkan email akun Anda untuk mendapatkan kode verifikasi pemulihan."
                  : "Masukkan kode 6 digit dan buat kata sandi baru Anda."}
              </p>
            </div>

            {/* Error & Success Notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <Icon name="AlertCircle" size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <Icon name="CheckCircle" size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Banner Kode Otomatis */}
            {demoCode && step === 2 && (
              <div className="mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-[#002554]">
                <p className="font-bold flex items-center gap-1.5">
                  <Icon name="ShieldCheck" size={15} className="text-[#0292fc]" />
                  <span>Kode Verifikasi Pemulihan:</span>
                </p>
                <div className="mt-1 tracking-widest text-center text-lg font-black text-[#003882] bg-white py-1.5 rounded-xl border border-blue-200">
                  {demoCode}
                </div>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                    <span className="text-slate-400 mr-2.5">
                      <Icon name="Mail" size={16} />
                    </span>
                    <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@email.com"
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-[#0292fc] hover:bg-[#0081e3] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Mengirim...</span>
                    ) : (
                      <span>Request Code</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Code
                  </label>
                  <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                    <span className="text-slate-400 mr-2.5">
                      <Icon name="Hash" size={16} />
                    </span>
                    <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent tracking-widest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                    <span className="text-slate-400 mr-2.5">
                      <Icon name="Lock" size={16} />
                    </span>
                    <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition pl-2 cursor-pointer"
                    >
                      <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                    <span className="text-slate-400 mr-2.5">
                      <Icon name="Lock" size={16} />
                    </span>
                    <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent tracking-wider"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-[#0292fc] hover:bg-[#0081e3] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Menyimpan...</span>
                    ) : (
                      <span>Save Password</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center pt-4 text-xs text-slate-500">
            Remember Password ?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-[#0292fc] hover:underline ml-1"
            >
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
