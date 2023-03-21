import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Grid } from "@mui/material";

import { getURL } from "@/utils/url";

const SignIn = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  if (!user)
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Auth
            supabaseClient={supabaseClient}
            providers={["github"]}
            redirectTo={getURL()}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#404040",
                    brandAccent: "#52525b",
                  },
                },
              },
            }}
            theme="dark"
          />
        </Grid>
      </Grid>
    );
};

export default SignIn;
