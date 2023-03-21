import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  useUser
} from "@supabase/auth-helpers-react";
import Layout from "@/components/Layout";
import { fetcher } from "@/utils/fetcher";
import { SWRConfig } from 'swr';
import moment from "moment-timezone";
import "../styles/index.css";
import { AppProps } from "next/app";

moment.tz.setDefault("America/New_York");

export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  const { push } = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      push("/");
    }
  }, [user]);

  const [supabaseClient] = useState(
    createBrowserSupabaseClient()
  );

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionContextProvider>
  );
}
