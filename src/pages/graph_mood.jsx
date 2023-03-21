import React from "react";
import StatsMood from "@/components/StatsMood";
import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function GraphMoodPage() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();

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
    if (user) {
      fetchMoods();
    }
  }, [user]);

  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
        <StatsMood moods={moods} />
      </Grid>
    </Grid>
  );
}
