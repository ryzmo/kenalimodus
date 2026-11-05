import { useEffect } from "react"
import { useRouter } from "next/router"
import { syncPresentationModeFromServer } from "@/utils/presentationMode"

export default function PresentationSyncManager() {
  const router = useRouter()

  useEffect(() => {
    // 1. Sync segera saat aplikasi pertama kali mount
    syncPresentationModeFromServer()

    // 2. Polling ringan setiap 4 detik agar semua device yang sedang membuka web langsung terupdate
    const interval = setInterval(() => {
      // Hanya lakukan fetch jika dokumen sedang aktif (tab terlihat)
      if (typeof document !== "undefined" && !document.hidden) {
        syncPresentationModeFromServer()
      }
    }, 4000)

    // 3. Sync saat tab browser kembali aktif
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncPresentationModeFromServer()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // 4. Sync saat route/halaman berpindah
    const handleRouteChange = () => {
      syncPresentationModeFromServer()
    }
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router])

  return null
}
