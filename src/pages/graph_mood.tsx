import React from "react";
import { StatsMood } from "@/components/StatsMood";
import { Grid, Typography, Button } from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import Link from "next/link";

const GraphMood: NextPage = () => {
  
  const session = useSession();

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
        <StatsMood />
      )}
    </Grid>
  );
}

export default GraphMood;
