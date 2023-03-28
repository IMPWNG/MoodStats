import { ListsMoods } from "@/components/ListsMood";
import {
  Grid,
  Typography
} from "@mui/material";
import {
  useSession,
} from "@supabase/auth-helpers-react";
import { NextPage } from "next";

const ListMood: NextPage = () => {

  const session = useSession();

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
          <ListsMoods />
        </div>
      )}
    </div>
  );
}

export default ListMood;