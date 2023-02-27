import React from "react";
import StatsMood from "@/components/StatsMood";
import { useState, useEffect } from "react";
import { Grid, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function GraphMoodPage() {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const response = await fetch("/api/mood");
    const data = await response.json();

    setMoods(data);
  };
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
      <StatsMood moods={moods} />
    </Grid>
  );
}
