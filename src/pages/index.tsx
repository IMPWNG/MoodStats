import React from "react";
import {GeneralForm} from "@/components/GeneralForm";
import useSWR from 'swr';
import {
  useSession,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { fetcher } from "@/utils/fetcher";

export default function IndexPage() {

  const [moods, setMoods] = useState<any>([]);

  const session = useSession();

  const { data, error } = useSWR("/api/mood", fetcher);

  useEffect(() => {
    if (data) {
      setMoods(data);
    } else {
      console.log("error", error);
      setMoods([]);
    }
  }, [data, error]);

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
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
          <GeneralForm />
        )}
      </Grid>
    </Grid>
  );
}
