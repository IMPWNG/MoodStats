import { supabase } from "../utils/initSupabase";
import { Auth } from "@supabase/auth-ui-react";
import Head from "next/head";
import AddMood from "../components/AddMood";
import Link from "next/link";
import { Container, Typography, Grid, Button } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function IndexPage() {
  const { user } = Auth.useUser();

  return (
    <>
      {!user ? (
        <div className="w-full h-full flex justify-center items-center p-4">
          <Auth
            supabaseClient={supabase}
            providers={["google", "github"]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </div>
      ) : (
        <>
          <Head>
            <title>Mood Stats</title>
            <meta
              name="description"
              content="Get full data of your personal mind"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={styles.main}>
            <div className={styles.description}>
              <p className="text-2xl font-bold">Moods Stats</p>
              <div>
                <Button variant="contained" color="primary">
                  Request a feature or report a bug
                </Button>
              </div>
            </div>
            <div className={styles.center}>
              <AddMood user={user} />
            </div>
            <div className={styles.grid}>
              <Link href="/list_mood" className={styles.card} passHref>
                <h2 className={inter.className}>
                  View, Delete, Modify {"  "}
                  <span>-&gt;</span>
                </h2>
                <p className={inter.className}>
                  View, Delete, Modify your mood from the list off all your
                  created moods
                </p>
              </Link>
              <Link href="/graph_mood" className={styles.card} passHref>

        
                <h2>
                  Graphs, stats, and more <span>-&gt;</span>
                </h2>
                <p>
                  See your data in a more visual way, and get more insights
                  about your mood
                </p>
              </Link>

              <Link href="/resume_mood" className={styles.card} passHref>
                <h2>
                  Resume <span>-&gt;</span>
                </h2>
                <p>
                  Get the daily, weekly, monthly, and yearly resume of your
                  moods
                </p>
              </Link>

              <Link href="/upgrades" className={styles.card} passHref>
                <h2>
                  Next Step <span>-&gt;</span>
                </h2>
                <p>See the next features that will be added to the app</p>
              </Link>
            </div>
          </main>
        </>
      )}
    </>
  );
}
