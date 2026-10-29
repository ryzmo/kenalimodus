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
    <div className="px-6 pt-5 pb-2 flex items-center justify-between text-white z-20">
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
          <h1 className="text-lg font-black text-white tracking-tight mt-0.5 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {rightElement && (
        <div>{rightElement}</div>
      )}
    </div>
  )
}
