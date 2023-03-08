import React from "react";
import GeneralForm from "@/components/GeneralForm";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetchMoods();
  }, [session]);

  const fetchMoods = async () => {
    try {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("user_id", user.id);

      if (error) throw error;
      setMoods(data);
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return (
    <>
      {!session ? (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-24 text-center">
          <h1 className="text-6xl font-bold">Welcome to the Mood Tracker!</h1>
          <p className="mt-3 text-2xl">Please sign in to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-24 text-center">
          <GeneralForm moods={session} />
        </div>
      )}
    </>
  );
}
