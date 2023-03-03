import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect } from "react";
import StatsMood from "../components/StatsMood";
import { supabaseClient } from "@/utils/initSupabase";
import ResumeGPT from "@/components/ResumeGPT";
import {
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";


export default function ListMoodPage() {
  const [moods, setMoods] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");
  const [filterByDate, setFilterByDate] = useState(false);
  const [filterByRate, setFilterByRate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);


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

  const handleFilterByDate = () => {
    // Toggle the value of filterByDate
    setFilterByDate((prevFilter) => !prevFilter);
    // Sort moods by created_at in descending order (most recent first)
    setMoods((prevMoods) =>
      [...prevMoods].sort((a, b) => {
        if (filterByDate) {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          return new Date(a.created_at) - new Date(b.created_at);
        }
      })
    );
    if (filterByDate) {
      fetchMoods();
    }
  };

  const handleFilterByRate = () => {
    // Toggle the value of filterByRate
    setFilterByRate((prevFilter) => !prevFilter);
    // Sort moods by rating in descending order (highest rating first)
    setMoods((prevMoods) =>
      [...prevMoods].sort((a, b) => {
        if (filterByRate) {
          return a.rating - b.rating;
        } else {
          return b.rating - a.rating;
        }
      })
    );
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

// const modifyMood = async (id) => {
//   try {
//     const moodToModify = moods.find((mood) => mood.id === id);
//     const newCategory = prompt("Modify category:", moodToModify.category);
//     const newDescription = prompt(
//       "Modify description:",
//       moodToModify.description
//     );
//     const newRating = prompt("Modify rating:", moodToModify.rating);
//     const newCreatedAt = prompt("Modify created_at:", moodToModify.created_at);
//     if (
//       newCategory !== null ||
//       newDescription !== null ||
//       newRating !== null ||
//       newCreatedAt !== null
//     ) {
//       const response = await fetch(`/api/mood/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           category: newCategory || moodToModify.category,
//           description: newDescription || moodToModify.description,
//           rating: newRating || moodToModify.rating,
//           created_at: newCreatedAt || moodToModify.created_at,
//         }),
//       });
//       const modifiedMood = {
//         ...moodToModify,
//         category: newCategory || moodToModify.category,
//         description: newDescription || moodToModify.description,
//         rating: newRating || moodToModify.rating,
//         created_at: newCreatedAt || moodToModify.created_at,
//       };
//       setMoods((prevMoods) =>
//         prevMoods.map((mood) => (mood.id === id ? modifiedMood : mood))
//       );
//       response.status === 200 && console.log("Mood modified successfully");
//     }
//   } catch (error) {
//     console.log("Error modifying mood:", error);
//   }
// };


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
        <FormGroup
          row
          sx={{
            justifyContent: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                onClick={handleFilterByDate}
                color="secondary"
                sx={{ color: "grey.500" }}
              />
            }
            label="Sort by Date"
          />
          <FormControlLabel
            control={
              <Checkbox
                onClick={handleFilterByRate}
                color="secondary"
                sx={{ color: "grey.500" }}
              />
            }
            label="Sort by Rating"
          />
        </FormGroup>
      </Grid>

      <Grid item xs={12} sx={{ mt: 4 }}>
        {filterByDate &&
          moods
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((mood) => (
              <ListsMood
                key={mood.id}
                mood={mood}
                onDelete={() => deleteMood(mood.id)}
                onModify={() => modifyMood(mood.id)}
              />
            ))}
        {!filterByDate &&
          moods.map((mood) => (
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
