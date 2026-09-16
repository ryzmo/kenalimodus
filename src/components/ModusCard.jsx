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
      className="group block rounded-3xl bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-1"
    >

      <div className="flex items-start justify-between gap-4">

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0876c9]">

          <Icon
            name={icon}
            size={23}
          />

        </div>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-black ${
            level === "Tinggi"
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {level}
        </span>

      </div>


      <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
        {tag}
      </div>


      <h3 className="mt-1 text-lg font-black leading-tight text-[#102a54]">
        {title}
      </h3>


      <p className="mt-2 text-sm leading-6 text-slate-500">
        {desc}
      </p>


      <div className="mt-4 flex items-center gap-1 text-sm font-black text-[#0876c9]">

        Pelajari

        <Icon
          name="ArrowRight"
          size={16}
          className="transition duration-200 group-hover:translate-x-1"
        />

      </div>

    </Link>

  )
}