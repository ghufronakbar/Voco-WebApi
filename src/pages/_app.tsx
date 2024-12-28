import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Head>
        <title>Voco</title>
        <meta name="description" content="Admin Dashboard" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
