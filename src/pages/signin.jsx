import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { getURL } from "@/utils/helpers";

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <p>
              Test4
            </p>
          </div>
          <div className="flex flex-col space-y-4">
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
          </div>
        </div>
      </div>
    );
};

export default SignIn;
