import React from "react";
import GeneralForm from "@/components/GeneralForm";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function IndexPage() {
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  return (
    <>
      {!session ? (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-24 text-center">
          <h1 className="text-6xl font-bold">Welcome to the Mood Tracker!</h1>
          <p className="mt-3 text-2xl">Please sign in to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-24 text-center">
          <GeneralForm />
        </div>
      )}
    </>
  );
}
