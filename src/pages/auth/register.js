import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "../../components/Icon"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.")
      return
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal melakukan pendaftaran.")
      } else {
        setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman masuk...")
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
        <title>Sign Up — Kenali Modus BCA</title>
      </Head>

      {/* Mobile Device Canvas Wrapper */}
      <div className="w-full max-w-md sm:rounded-[42px] bg-white min-h-screen sm:min-h-[820px] shadow-2xl relative overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-slate-100">
        
        {/* Top Organic Wave Graphic Area */}
        <div className="relative h-56 sm:h-64 w-full bg-gradient-to-br from-[#0292fc] via-[#2ba8ff] to-[#0051b3] overflow-hidden flex flex-col justify-between p-6">
          {/* Topographic Contour Vector Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 80 Q 100 20 200 90 T 450 60" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 120 Q 80 50 220 130 T 450 100" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 160 Q 120 90 240 180 T 450 140" stroke="white" strokeWidth="1.5" fill="none"/>
              <ellipse cx="280" cy="110" rx="60" ry="35" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="120" cy="180" rx="70" ry="40" stroke="white" strokeWidth="1.5" fill="none" />
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
              Registrasi Akun
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
        <div className="px-7 sm:px-9 pt-1 pb-6 flex-1 flex flex-col justify-between bg-white z-10">
          <div>
            {/* Title with Underline Accent */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#002554] tracking-tight inline-block relative">
                Sign up
                <div className="h-1 w-10 bg-[#0292fc] rounded-full mt-1.5" />
              </h1>
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

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                  <span className="text-slate-400 mr-2.5">
                    <Icon name="User" size={16} />
                  </span>
                  <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                  <span className="text-slate-400 mr-2.5">
                    <Icon name="Lock" size={16} />
                  </span>
                  <span className="text-slate-300 text-sm mr-2 font-light">|</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password
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
                    placeholder="Ulangi kata sandi"
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent tracking-wider"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-[#0292fc] hover:bg-[#0081e3] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Mendaftarkan...</span>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center pt-4 text-xs text-slate-500">
            Already have an Account ?{" "}
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
