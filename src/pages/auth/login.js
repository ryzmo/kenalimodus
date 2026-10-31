import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import Icon from "../../components/Icon"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [lockoutTimer, setLockoutTimer] = useState(0)

  // Countdown timer lockout
  useEffect(() => {
    let interval = null
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [lockoutTimer])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (lockoutTimer > 0) return

    setLoading(true)
    setErrorMsg("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password
      })

      if (res?.error) {
        setErrorMsg(res.error)

        const match = res.error.match(/dalam (\d+) detik/)
        if (match && match[1]) {
          setLockoutTimer(parseInt(match[1], 10))
        } else if (res.error.includes("dikunci selama 60 detik")) {
          setLockoutTimer(60)
        }
      } else if (res?.ok) {
        localStorage.setItem("kenali_participant_name", email.split("@")[0])
        router.push("/profil")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kendala saat menghubungi server.")
    } finally {
      setLoading(false)
    }
  }

  // Masuk sebagai Tamu (Guest)
  const handleGuestLogin = () => {
    localStorage.setItem("kenali_participant_name", "Tamu")
    localStorage.setItem("kenali_participant_age", "25")
    router.push("/challenge")
  }

  return (
    <div className="h-screen max-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-2 font-sans overflow-hidden">
      <Head>
        <title>Sign In — Kenali Modus BCA</title>
      </Head>

      {/* Mobile Device Canvas Wrapper - Fits Screen Without Scroll */}
      <div className="w-full max-w-md sm:rounded-[36px] bg-white h-full sm:h-auto sm:max-h-[96vh] shadow-2xl relative overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-slate-100">

        {/* Top Organic Wave Graphic Area (Kompak) */}
        <div className="relative h-40 sm:h-44 shrink-0 w-full bg-gradient-to-br from-[#0292fc] via-[#2ba8ff] to-[#0051b3] overflow-hidden flex flex-col justify-between p-4 sm:p-5">
          {/* Topographic Contour Vector Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 80 Q 100 20 200 90 T 450 60" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M-50 120 Q 80 50 220 130 T 450 100" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M-50 160 Q 120 90 240 180 T 450 140" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="280" cy="110" rx="60" ry="35" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="120" cy="180" rx="70" ry="40" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Top Navigation */}
          <div className="relative z-10 flex items-center justify-between text-white">
            <Link
              href="/"
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
            >
              <Icon name="ChevronLeft" size={18} />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Kenali Modus
            </span>
            <div className="w-8" />
          </div>

          {/* Wave Curve Masking Bottom */}
          <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className="h-10 sm:h-12 w-full fill-white"
            >
              <path d="M0.00,49.98 C149.99,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
            </svg>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="px-6 sm:px-8 pt-0 pb-4 flex-1 flex flex-col justify-between bg-white z-10 overflow-hidden">
          <div>
            {/* Title with Custom Underline Accent */}
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight inline-block relative">
                Sign in
                <div className="h-0.5 w-8 bg-[#0292fc] rounded-full mt-1" />
              </h1>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className={`mb-4 p-3 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${lockoutTimer > 0
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-rose-50 border-rose-200 text-rose-600"
                }`}>
                <Icon
                  name={lockoutTimer > 0 ? "Clock" : "AlertCircle"}
                  size={16}
                  className="shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p>{errorMsg}</p>
                  {lockoutTimer > 0 && (
                    <p className="mt-1 font-black text-amber-900">
                      Sisa waktu tunggu: {lockoutTimer} detik
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input Field */}
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
                    disabled={lockoutTimer > 0}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@email.com"
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                  />
                </div>
              </div>

              {/* Password Input Field */}
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
                    disabled={lockoutTimer > 0}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded-sm border-slate-300 text-[#0292fc] focus:ring-0 cursor-pointer accent-[#0292fc]"
                  />
                  <span className="text-[11px] font-semibold text-slate-500">
                    Remember Me
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-bold text-[#0292fc] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || lockoutTimer > 0}
                  className="w-full h-12 rounded-2xl bg-[#0292fc] hover:bg-[#0081e3] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Memverifikasi...</span>
                  ) : lockoutTimer > 0 ? (
                    <span>Terkunci ({lockoutTimer}s)</span>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>
            </form>

            {/* Guest Login Option - Rapat & Proporsional */}
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="relative flex items-center justify-center mb-2">
                <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Atau Coba Langsung
                </span>
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 hover:from-blue-100 hover:to-sky-100 text-[#003882] font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.99] border-2 border-[#0292fc]/40 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-[#0292fc] text-white flex items-center justify-center">
                  <Icon name="UserCheck" size={13} />
                </div>
                <span>Masuk sebagai Tamu</span>
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-1.5">
                Langsung coba simulasi Scam Challenge tanpa registrasi akun
              </p>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <div className="text-center pt-4 text-xs text-slate-500">
            Don&apos;t have an Account ?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-[#0292fc] hover:underline ml-1"
            >
              Sign up
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
