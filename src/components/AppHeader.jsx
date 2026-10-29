import Link from "next/link"
import Icon from "./Icon"

export default function AppHeader({ title = "Kenali Modus", subtitle = "Bank BCA" }) {
  return (
    <div className="px-6 pt-6 pb-3 flex items-center justify-between text-white z-20">
      <div>
        <div className="text-[11px] font-medium text-white/90 leading-none">
          {subtitle}
        </div>
        <h1 className="text-base font-extrabold text-white tracking-tight mt-1">
          {title}
        </h1>
      </div>
    </div>
  )
}
