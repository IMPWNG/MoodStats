import React, { useEffect } from "react";
import { GeneralForm } from "@/components/GeneralForm";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { Grid, Typography, Button } from "@mui/material";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();

  useEffect(() => {
    document.body.classList.add("bg-gray-100");
    return () => {
      document.body.classList.remove("bg-gray-100");
    };
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
      {!session ? (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" align="center">
              You are not logged
            </Typography>
            <Link href="/signin" passHref style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Button variant="contained" color="primary" sx={{ color: 'white' }}>
                Signin
              </Button>
            </Link>
          </Grid>
        </Grid>
      ) : (
        <GeneralForm />
      )}
    </Grid>
  );
};

export default Home;
