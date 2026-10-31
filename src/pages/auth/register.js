import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "../../components/Icon"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState(2000)
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

    const currentYear = new Date().getFullYear()
    const parsedYear = Number(birthYear)
    if (!parsedYear || parsedYear < 1920 || parsedYear > currentYear) {
      setErrorMsg(`Tahun lahir tidak valid (1920 - ${currentYear}).`)
      return
    }

    const calculatedAge = Math.max(1, currentYear - parsedYear)

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, age: calculatedAge })
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
    <div className="h-screen max-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-2 font-sans overflow-hidden">
      <Head>
        <title>Sign Up — Kenali Modus BCA</title>
      </Head>

      {/* Mobile Device Canvas Wrapper - Fits Screen Without Scroll */}
      <div className="w-full max-w-md sm:rounded-[36px] bg-white h-full sm:h-auto sm:max-h-[96vh] shadow-2xl relative overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-slate-100">
        
        {/* Top Organic Wave Graphic Area (Seimbang) */}
        <div className="relative h-32 sm:h-36 shrink-0 w-full bg-gradient-to-br from-[#0292fc] via-[#2ba8ff] to-[#0051b3] overflow-hidden flex flex-col justify-between p-4 sm:p-5">
          {/* Topographic Contour Vector Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 80 Q 100 20 200 90 T 450 60" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 120 Q 80 50 220 130 T 450 100" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 160 Q 120 90 240 180 T 450 140" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>

          {/* Top Navigation */}
          <div className="relative z-10 flex items-center justify-between text-white">
            <Link
              href="/auth/login"
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
            >
              <Icon name="ChevronLeft" size={18} />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Registrasi Akun
            </span>
            <div className="w-8" />
          </div>

          {/* Wave Curve Masking Bottom */}
          <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className="h-9 sm:h-11 w-full fill-white"
            >
              <path d="M0.00,49.98 C149.99,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
            </svg>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="px-7 sm:px-9 pt-1 pb-5 flex-1 flex flex-col justify-between bg-white z-10 overflow-hidden">
          <div className="space-y-4">
            {/* Title with Underline Accent */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight inline-block relative">
                Sign up
                <div className="h-0.5 w-8 bg-[#0292fc] rounded-full mt-1" />
              </h1>
            </div>

            {/* Error & Success Notification */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <Icon name="AlertCircle" size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <Icon name="CheckCircle" size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                  <span className="text-slate-400 mr-2.5">
                    <Icon name="User" size={15} />
                  </span>
                  <span className="text-slate-300 text-xs mr-2 font-light">|</span>
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

              {/* Tahun Lahir */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Lahir
                </label>
                <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#0292fc] pb-1.5 transition">
                  <span className="text-slate-400 mr-2.5">
                    <Icon name="Calendar" size={15} />
                  </span>
                  <span className="text-slate-300 text-xs mr-2 font-light">|</span>
                  <input
                    type="number"
                    min="1920"
                    max={new Date().getFullYear()}
                    required
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="Contoh: 1998, 2002"
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
                    <Icon name="Mail" size={15} />
                  </span>
                  <span className="text-slate-300 text-xs mr-2 font-light">|</span>
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
                    <Icon name="Lock" size={15} />
                  </span>
                  <span className="text-slate-300 text-xs mr-2 font-light">|</span>
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
                    <Icon name={showPassword ? "EyeOff" : "Eye"} size={15} />
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
                    <Icon name="Lock" size={15} />
                  </span>
                  <span className="text-slate-300 text-xs mr-2 font-light">|</span>
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
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-2xl bg-[#0292fc] hover:bg-[#0081e3] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          <div className="text-center pt-2 sm:pt-3 text-xs text-slate-500">
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
