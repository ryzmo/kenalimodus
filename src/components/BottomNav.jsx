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
      icon: "Zap"
    },
    {
      href: "/keluarga",
      label: "Keluarga",
      icon: "UsersRound"
    },
    {
      href: "/hasil",
      label: "Profil",
      icon: "UserRound"
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:bottom-5 md:left-1/2 md:right-auto md:w-[560px] md:-translate-x-1/2 md:rounded-3xl md:border md:shadow-soft">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1 py-2">

        {items.map((item) => {

          const active =
            router.pathname === item.href

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold transition ${
                active
                  ? "bg-blue-50 text-[#0876c9]"
                  : "text-slate-400 hover:text-[#0876c9]"
              }`}
            >

              <Icon
                name={item.icon}
                size={20}
                strokeWidth={active ? 2.7 : 2}
              />

              <span>
                {item.label}
              </span>

            </Link>

          )

        })}

      </div>

    </nav>
  )
}