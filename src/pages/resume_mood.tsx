import ResumeGPT from "@/components/ResumeGPT";
import { Grid, Typography } from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import { NextPage } from "next";

const ResumerMood: NextPage = () => {

  const session = useSession();

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
      {!session ? (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" align="center">
              You are not signed in
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" align="center">
              Please sign in to access this page.
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <ResumeGPT />
      )}
    </Grid>
  );
}

export default ResumerMood;
