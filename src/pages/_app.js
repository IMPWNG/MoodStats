import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabaseClient } from "../utils/initSupabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import moment from "moment-timezone";
import "../styles/index.css";

moment.tz.setDefault("America/New_York");

export default function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  );
}
