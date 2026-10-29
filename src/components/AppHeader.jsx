import Link from "next/link"
import Icon from "./Icon"

export default function AppHeader({
  title = "Kenali Modus",
  subtitle = "Bank BCA #AwasModus",
  showBack = true,
  backHref = "/",
  rightElement = null
}) {
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
          {subtitle && (
            <div className="text-[10px] font-semibold text-white/80 uppercase tracking-wider leading-none">
              {subtitle}
            </div>
          )}
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight mt-0.5 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop Quick Nav */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 border border-white/25">
          <Link href="/" className="px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
            Beranda
          </Link>
          <Link href="/modus" className="px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
            Katalog
          </Link>
          <Link href="/challenge" className="px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
            Challenge
          </Link>
          <Link href="/keluarga" className="px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
            Keluarga
          </Link>
          <Link href="/rewards" className="px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
            Rewards
          </Link>
        </nav>

        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  )
}
