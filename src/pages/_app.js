import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabase } from "../utils/initSupabase";

import "../styles/index.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase} appearance={{ theme: ThemeSupa }}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  );
}
