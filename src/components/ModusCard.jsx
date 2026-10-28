import Link from "next/link"
import Icon from "./Icon"

export default function ModusCard({
  tag,
  title,
  desc,
  level = "Waspada",
  icon = "AlertTriangle"
}) {
  return (
    <Link
      href="/challenge"
      className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide ${
            level === "Tinggi"
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}
        >
          {level === "Tinggi" ? "Risiko Tinggi" : "Waspada"}
        </span>
        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0055b8] transition">
          Simulasi →
        </span>
      </div>

      <div className="mt-4 text-[10px] font-black uppercase tracking-wider text-[#0055b8]">
        {tag}
      </div>

      <h3 className="mt-1 text-base font-bold leading-snug text-[#003882] group-hover:text-[#0055b8] transition">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
        {desc}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#0055b8]">
        <span>Pelajari & Uji Refleks</span>
        <Icon name="ArrowRight" size={14} />
      </div>
    </Link>
  )
}
