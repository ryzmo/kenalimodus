import React, { useState, useEffect } from "react";

const SIZES = [
  { id: "normal", label: "Normal", scale: "100%", desc: "Ukuran standar" },
  { id: "large", label: "Besar", scale: "115%", desc: "Lebih mudah dibaca" },
  { id: "xlarge", label: "Sangat Besar", scale: "130%", desc: "Teks ekstra jelas" },
];

export default function FontSizeFloatingControl() {
  const [currentSize, setCurrentSize] = useState("normal");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("km_font_size") || "normal";
    applySize(saved);
  }, []);

  const applySize = (sizeId) => {
    setCurrentSize(sizeId);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font-size", sizeId);
      localStorage.setItem("km_font_size", sizeId);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-8 sm:right-6 z-50 select-none print:hidden">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-sky-100 w-64 text-left animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-sky-50 mb-3">
            <div>
              <span className="font-bold text-sm text-[#002554] block">Ukuran Teks</span>
              <span className="text-[11px] text-sky-700">Penyesuaian ramah lansia</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-sky-50 text-slate-400 hover:text-slate-600 transition"
              aria-label="Tutup menu ukuran"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            {SIZES.map((item) => {
              const active = currentSize === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    applySize(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition text-left ${
                    active
                      ? "bg-sky-50 border-sky-400 text-[#003882] shadow-sm font-semibold"
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`font-black ${
                        item.id === "normal"
                          ? "text-sm"
                          : item.id === "large"
                          ? "text-base"
                          : "text-lg"
                      } ${active ? "text-[#0055b8]" : "text-slate-500"}`}
                    >
                      A
                    </span>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                    </div>
                  </div>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-[#0055b8]"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center space-x-1">
            <span>👓 Membantu membaca lebih nyaman</span>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center space-x-1 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-sky-200/90 hover:shadow-xl transition-all">
        {/* Quick Decrease */}
        <button
          onClick={() => {
            const idx = SIZES.findIndex((s) => s.id === currentSize);
            if (idx > 0) applySize(SIZES[idx - 1].id);
          }}
          disabled={currentSize === "normal"}
          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
            currentSize === "normal"
              ? "text-slate-300 cursor-not-allowed"
              : "text-[#003882] hover:bg-sky-50"
          }`}
          title="Perkecil huruf"
        >
          A-
        </button>

        {/* Center Pill Button to open full options */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-[#002554] text-xs font-semibold transition"
          title="Atur ukuran teks"
        >
          <span className="text-[14px]">Aa</span>
          <span className="text-[11px] hidden sm:inline text-sky-800">
            {SIZES.find((s) => s.id === currentSize)?.label}
          </span>
        </button>

        {/* Quick Increase */}
        <button
          onClick={() => {
            const idx = SIZES.findIndex((s) => s.id === currentSize);
            if (idx < SIZES.length - 1) applySize(SIZES[idx + 1].id);
          }}
          disabled={currentSize === "xlarge"}
          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
            currentSize === "xlarge"
              ? "text-slate-300 cursor-not-allowed"
              : "text-[#003882] hover:bg-sky-50"
          }`}
          title="Perbesar huruf"
        >
          A+
        </button>
      </div>
    </div>
  );
}

