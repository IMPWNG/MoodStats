import { useState, useEffect } from "react";
import { createBrowserSupabaseClient, Session } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Layout from "@/components/Layout";
import { fetcher } from "@/utils/fetcher";
import useSWR from 'swr';
import moment from "moment-timezone";
import "../styles/index.css";
import { AppProps } from "next/app";

moment.tz.setDefault("America/New_York");



export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session,
}>) {
  const [supabaseClient] = useState(
    createBrowserSupabaseClient()
  );

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [moods, setMoods] = useState([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  const { data, error } = useSWR("/api/mood", fetcher);

  useEffect(() => {
    if (data) {
      setMoods(data);
    } else {
      console.log("error", error);
      setMoods([]);
    }
  }, [data, error]);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
