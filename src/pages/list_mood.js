import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect } from "react";
import StatsMood from "../components/StatsMood";
import { supabase } from "@/utils/initSupabase";
import ResumeGPT from "@/components/ResumeGPT";
import {
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from "@mui/material";

export default function ListMoodPage() {
  const [moods, setMoods] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");

  // useEffect(() => {
  //   if (moods.length) {
  //     const totalRating = moods.reduce((acc, cur) => acc + cur.rating, 0);
  //     setAverageRating(totalRating / moods.length);
  //   }
  //   fetchMoods();
  //   //stop fetching
  //   setLoading(false);

  // }, [moods]);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const response = await fetch("/api/mood");
    const data = await response.json();

    //stop fetching
    setLoading(false);

    setMoods(data);
  };


  const deleteMood = async (id) => {
    try {
      const response = await fetch("/api/mood", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      setMoods(moods.filter((mood) => mood.id !== id));
      response.status === 200 && console.log("Mood deleted successfully");
    } catch (error) {
      console.log("Error deleting mood:", error);
    }
  };

  const modifyMood = async (id) => {
    try {
        const response = await fetch("/api/mood", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        });
        setMoods(moods.filter((mood) => mood.id !== id));
        response.status === 200 && console.log("Mood modified successfully");
    } catch (error) {
        console.log("Error modifying mood:", error);
    }
    };


  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mood List
        </Typography>
        <Link href="/">
            <Button variant="contained">Back to Home</Button>

        </Link>

      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <FormGroup row sx={{ justifyContent: "center" }}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Sort by Date"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Sort by Rating"
          />
        </FormGroup>
      </Grid>

      <Grid item xs={12} sx={{ mt: 4 }}>
        {moods.map((mood) => (
          <ListsMood
            key={mood.id}
            mood={mood}
            onDelete={() => deleteMood(mood.id)}
            onModify={() => modifyMood(mood.id)}
          />
        ))}
      </Grid>
    </Grid>
  );
}
