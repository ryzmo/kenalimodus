import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import FontSizeFloatingControl from "@/components/FontSizeFloatingControl";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <FontSizeFloatingControl />
    </SessionProvider>
  );
}
