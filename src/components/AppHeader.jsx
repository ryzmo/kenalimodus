import Link from "next/link"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import Icon from "./Icon"

export default function AppHeader({
  title = "Kenali Modus",
  subtitle = "Bank BCA #AwasModus",
  showBack = true,
  backHref = "/",
  onBack = null,
  rightElement = null
}) {
  const router = useRouter()
  const { data: session } = useSession()

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/modus", label: "Katalog Modus" },
    { href: "/challenge", label: "Challenge" },
    { href: "/keluarga", label: "Keluarga" },
    { href: "/profil", label: "Profil" }
  ]

  return (
    <header className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 md:pt-7 pb-2 flex items-center justify-between text-white z-20">
      <div className="flex items-center gap-3">
        {showBack && (
          onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Kembali"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
          ) : (
            <Link
              href={backHref}
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition active:scale-95 shadow-2xs"
              aria-label="Kembali"
            >
              <Icon name="ChevronLeft" size={20} />
            </Link>
          )
        )}
        <div>

          <h1 className="text-lg md:text-xl font-black text-white tracking-tight mt-0.5 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop Quick Nav with Active State */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full p-1 border border-white/25">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition duration-150 ${isActive
                  ? "bg-white text-[#003882] shadow-2xs"
                  : "text-white hover:bg-white/20"
                  }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Account Button jika sudah login */}
        {session && (
          <Link
            href="/profil"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/30 transition text-xs font-bold text-white shadow-2xs"
          >
            <div className="h-6 w-6 rounded-full bg-amber-400 text-[#002554] flex items-center justify-center font-black text-[11px] overflow-hidden">
              {session.user?.image ? (
                <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
              ) : (
                session.user?.name?.charAt(0) || "U"
              )}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">{session.user?.name || "Profil"}</span>
          </Link>
        )}

        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  )
}
