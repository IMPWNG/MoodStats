import React from "react";
import { GeneralForm } from "@/components/GeneralForm";
import {
  useSession,
} from "@supabase/auth-helpers-react";
import { Grid, Typography } from "@mui/material";
import { NextPage } from "next";

const Home: NextPage = () => {

  const session = useSession();

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        {!session ? (
 

              <><div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 text-center sm:py-0">
          <div className="flex flex-col items-center justify-center w-full px-4 pt-16 pb-12 text-center bg-white border-2 border-gray-300 rounded-md shadow-md sm:px-6 sm:pt-12 sm:pb-16 sm:shadow-lg sm:max-w-md sm:w-full sm:mx-auto sm:mt-0 sm:mb-0">
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-2xl font-bold text-gray-900">You are not dddddsigned in</p>


            </div>
          </div>


        </div></>

        ) : (
          <GeneralForm />
        )}
      </Grid>
  );
}

export default Home;