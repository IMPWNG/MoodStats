import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/ui'
import AddMood from '../components/AddMood'
import Link from 'next/link'

export default function IndexPage() {
  const { user } = Auth.useUser()

  return (
    <div className="w-full h-full bg-gray-300">
      {!user ? (
        <div className="w-full h-full flex justify-center items-center p-4">
          <div>
            <Auth
              supabaseClient={supabase}
              providers={["google", "github"]}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
            />
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full flex flex-col justify-center items-center p-4"
          style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
        >
          <h1 className="text-2xl font-bold mb-4 justify-items-center">
            Welcome to Mood Stats
          </h1>
          <Link href="/list">
            <a className="btn-black w-full mt-12">View Stats</a>
          </Link>
          <AddMood user={supabase.auth.user()} />
          <button
            className="btn-black w-full mt-12"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.log("Error logging out:", error.message);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
