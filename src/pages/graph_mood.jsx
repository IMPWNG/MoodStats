import React from "react";
import StatsMood from "@/components/StatsMood";
import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function GraphMoodPage({ session }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function fetchMoods() {
      try {
        setLoading(true);
        const { data: moods, error } = await supabase
          .from("stats")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLoading(false);
        setMoods(moods);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log("error", error.message);
      }
    }
    fetchMoods();
  }, [session]);

  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mood List
        </Typography>
        <Link href="/">
          <Button variant="contained">Back to Home</Button>
        </Link>
      </Grid>
      <StatsMood session={moods} />
    </Grid>
  );
}
