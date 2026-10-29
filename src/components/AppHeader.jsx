import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "./Icon"

export default function AppHeader({
  title = "Kenali Modus",
  subtitle = "Bank BCA #AwasModus",
  showBack = true,
  backHref = "/",
  rightElement = null
}) {
  const router = useRouter()

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/modus", label: "Katalog Modus" },
    { href: "/challenge", label: "Challenge" },
    { href: "/keluarga", label: "Keluarga" },
    { href: "/rewards", label: "Rewards" }
  ]

  return (
    <header className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 md:pt-7 pb-2 flex items-center justify-between text-white z-20">
      <div className="flex items-center gap-3">
        {showBack && (
          <Link
            href={backHref}
            className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition active:scale-95 shadow-2xs"
            aria-label="Kembali"
          >
            <Icon name="ChevronLeft" size={20} />
          </Link>
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

        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  )
}
