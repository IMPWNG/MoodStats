import { useUser } from "@/utils/useUser";
import AddMood from "@/components/AddMood";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GeneralForm() {
  const { user } = useUser();

  return ( 
    <main className={styles.main}>
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
            View, Delete, Modify your mood from the list off all your created
            moods
          </p>
        </Link>
        <Link href="/graph_mood" className={styles.card} passHref>
          <h2>
            Graphs, stats, and more <span>-&gt;</span>
          </h2>
          <p>
            See your data in a more visual way, and get more insights about your
            mood
          </p>
        </Link>

        <Link href="/resume_mood" className={styles.card} passHref>
          <h2>
            Resume <span>-&gt;</span>
          </h2>
          <p>Get the daily, weekly, monthly, and yearly resume of your moods</p>
        </Link>

        <Link href="/upgrades" className={styles.card} passHref>
          <h2>
            Next Step <span>-&gt;</span>
          </h2>
          <p>See the next features that will be added to the app</p>
        </Link>
      </div>
    </main>
  );
}