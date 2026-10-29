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
    localStorage.setItem("kenali_participant_name", "Tamu #AwasModus")
    localStorage.setItem("kenali_participant_age", "25")
    router.push("/challenge")
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 md:p-6 font-sans">
      <Head>
        <title>Sign In — Kenali Modus BCA</title>
      </Head>

      {/* Mobile Device Canvas Wrapper */}
      <div className="w-full max-w-md sm:rounded-[42px] bg-white min-h-screen sm:min-h-[820px] shadow-2xl relative overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-slate-100">
        
        {/* Top Organic Wave Graphic Area */}
        <div className="relative h-64 sm:h-72 w-full bg-gradient-to-br from-[#0292fc] via-[#2ba8ff] to-[#0051b3] overflow-hidden flex flex-col justify-between p-6">
          {/* Topographic Contour Vector Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full object-cover" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 80 Q 100 20 200 90 T 450 60" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 120 Q 80 50 220 130 T 450 100" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 160 Q 120 90 240 180 T 450 140" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 200 Q 90 130 210 220 T 450 180" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M-50 240 Q 110 170 230 260 T 450 220" stroke="white" strokeWidth="1.5" fill="none"/>
              <ellipse cx="280" cy="110" rx="60" ry="35" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="120" cy="180" rx="70" ry="40" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          {/* Top Navigation */}
          <div className="relative z-10 flex items-center justify-between text-white pt-2">
            <Link
              href="/"
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition active:scale-95"
            >
              <Icon name="ChevronLeft" size={20} />
            </Link>
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/20">
              #AwasModus BCA
            </span>
            <div className="w-9" />
          </div>

          {/* Wave Curve Masking Bottom */}
          <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className="h-16 sm:h-20 w-full fill-white"
            >
              <path d="M0.00,49.98 C149.99,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
            </svg>
          </div>
        </div>

        {/* Form Body Area */}
        <div className="px-7 sm:px-9 pt-2 pb-6 flex-1 flex flex-col justify-between bg-white z-10">
          <div>
            {/* Title with Custom Underline Accent */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-[#002554] tracking-tight inline-block relative">
                Sign in
                <div className="h-1 w-10 bg-[#0292fc] rounded-full mt-1.5" />
              </h1>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className={`mb-4 p-3 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                lockoutTimer > 0
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

            {/* Guest Login Option */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.99] border border-slate-200/80 cursor-pointer"
              >
                <Icon name="UserCheck" size={15} className="text-[#0292fc]" />
                <span>Masuk sebagai Tamu (Mode Latihan)</span>
              </button>
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
