import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabase } from "../utils/initSupabase";
import moment from "moment-timezone";
import "../styles/index.css";

moment.tz.setDefault("America/New_York");

export default function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase} appearance={{ theme: ThemeSupa }}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  );
}
