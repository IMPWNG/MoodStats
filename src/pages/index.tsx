import React, { useEffect } from "react";
import { GeneralForm } from "@/components/GeneralForm";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from "next";

const Home: NextPage = () => {
  const session = useSession();

  useEffect(() => {
    document.body.classList.add("bg-gray-100");
    return () => {
      document.body.classList.remove("bg-gray-100");
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-0">
      {!session ? (
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 pt-16 pb-12 bg-white border-2 border-gray-300 rounded-md shadow-md sm:px-6 sm:pt-12 sm:pb-16 sm:shadow-lg">
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-2xl font-bold text-gray-900">You are not logged in</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 pt-16 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <GeneralForm />
        </div>
      )}
    </div>
  );
};

export default Home;
