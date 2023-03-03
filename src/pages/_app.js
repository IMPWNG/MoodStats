import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { MyUserContextProvider } from "@/utils/useUser";
import Layout from "@/components/Layout";

import moment from "moment-timezone";
import "../styles/index.css";

moment.tz.setDefault("America/New_York");

export default function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(
    createBrowserSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <MyUserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MyUserContextProvider>
    </SessionContextProvider>
  );
}
