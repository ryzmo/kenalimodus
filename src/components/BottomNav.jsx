import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "./Icon"

export default function BottomNav() {
  const router = useRouter()

  const items = [
    {
      href: "/",
      label: "Home",
      icon: "Home"
    },
    {
      href: "/modus",
      label: "Modus",
      icon: "BookOpen"
    },
    {
      href: "/challenge",
      label: "Challenge",
      icon: "Zap",
      highlight: true
    },

    {
      href: "/keluarga",
      label: "Keluarga",
      icon: "UsersRound"
    },
    {
      href: "/profil",
      label: "Profil",
      icon: "UserRound"
    }
  ]

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:max-w-md floating-nav rounded-full px-3 py-2">
      <div className="flex items-center justify-between">
        {items.map((item) => {
          const active = router.pathname === item.href

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
                aria-label="Mulai Challenge"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#003882] via-[#0055b8] to-[#0088ff] text-white flex items-center justify-center shadow-lg group-hover:scale-105 active:scale-95 transition ring-4 ring-white">
                  <Icon name="Zap" size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-extrabold text-[#003882] mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition ${active ? "text-[#003882]" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center transition ${active ? "bg-blue-50 text-[#003882]" : "text-slate-400"
                  }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  strokeWidth={active ? 2.6 : 1.8}
                />
              </div>
              <span
                className={`text-[9px] tracking-tight ${active ? "font-extrabold text-[#003882]" : "font-semibold"
                  }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
