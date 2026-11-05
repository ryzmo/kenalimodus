import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import FontSizeFloatingControl from "@/components/FontSizeFloatingControl";
import PageProgressBar from "@/components/PageProgressBar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <PageProgressBar />
      <Component {...pageProps} />
      <FontSizeFloatingControl />
    </SessionProvider>
  );
}
