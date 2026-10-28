import Link from "next/link"
import Icon from "./Icon"

export default function AppHeader({ title = "Kenali Modus", subtitle = "Bank BCA" }) {
  return (
    <div className="px-6 pt-6 pb-3 flex items-center justify-between text-white z-20">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="h-10 w-10 rounded-full bg-white/20 p-0.5 border border-white/40 shadow-xs flex items-center justify-center text-white active:scale-95 transition"
        >
          <div className="h-full w-full rounded-full bg-[#003882] flex items-center justify-center text-white font-black text-xs">
            Hi
          </div>
        </Link>
        <div>
          <div className="text-[11px] font-medium text-white/90 leading-none">
            {subtitle}
          </div>
          <h1 className="text-base font-extrabold text-white tracking-tight mt-1">
            {title}
          </h1>
        </div>
      </div>

      <Link
        href="/"
        className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xs active:scale-95 transition"
        aria-label="Kembali ke Beranda"
      >
        <Icon name="Home" size={16} />
      </Link>
    </div>
  )
}
