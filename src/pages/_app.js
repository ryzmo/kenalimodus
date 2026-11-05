import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import FontSizeFloatingControl from "@/components/FontSizeFloatingControl";
import PageProgressBar from "@/components/PageProgressBar";
import PresentationSyncManager from "@/components/PresentationSyncManager";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <PageProgressBar />
      <PresentationSyncManager />
      <Component {...pageProps} />
      <FontSizeFloatingControl />
    </SessionProvider>
  );
}
