import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="id" data-scroll-behavior="smooth">
      <Head>
        {/* Resource Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* SEO & Open Graph for WhatsApp/Social Sharing */}
        <meta name="description" content="KENALI MODUS - Gamified anti-fraud experience. Latih refleks keamanan perbankan digital melalui simulasi interaktif, ukur Safe Score, dan lindungi keluarga dari penipuan." />
        <meta name="theme-color" content="#0876c9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KENALI MODUS - Uji Refleks Anti-Penipuan Digital" />
        <meta property="og:description" content="Apakah kamu bisa mengenali modus penipuan digital? Coba 2-Minute Scam Challenge, ukur Safe Score kamu, dan lindungi keluarga dari fraud & scam!" />
        <meta property="og:site_name" content="KENALI MODUS" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KENALI MODUS - 2-Minute Scam Challenge" />
        <meta name="twitter:description" content="Latih refleks kamu mengenali modus penipuan digital. Gratis, tanpa install, langsung di browser." />
      </Head>
      <body className="antialiased selection:bg-sky-500 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
