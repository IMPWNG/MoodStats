import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@/utils/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@mui/material";

export default function Layout({ children, meta: pageMeta }) {
  const router = useRouter();
   const supabaseClient = useSupabaseClient();
   const { user } = useUser();
  const meta = {
    title: "Mood Stats",
    description: "Test",
    cardImage: "/og.png",
    ...pageMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
    
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <nav>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
            <div className="flex flex-1 items-center">
              <nav className="space-x-2 ml-6 hidden lg:block">
                <p>Hello {user?.email}!</p>
              </nav>
            </div>

            <div className="flex flex-1 justify-end space-x-8">
              {user ? (
                <Button variant="contained" color="primary"
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    router.push("/signin");
                  }}
                >
                  Sign out
                </Button>
              ) : (
                <Link href="/signin">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main id="skip">{children}</main>
    </>
  );
}
