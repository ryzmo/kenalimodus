import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function PageProgressBar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer

    const handleStart = () => {
      setLoading(true)
      setProgress(25)
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(timer)
            return 85
          }
          return prev + 15
        })
      }, 150)
    }

    const handleComplete = () => {
      clearInterval(timer)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      clearInterval(timer)
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  }, [router])

  if (!loading && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-transparent overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(2,146,252,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

