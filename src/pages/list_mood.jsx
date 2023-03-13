import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ListMoodPage() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterByDate, setFilterByDate] = useState(false);
  const [filterByRate, setFilterByRate] = useState(false);
  const [filterByCategory, setFilterByCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function fetchMoods() {
      try {
        setLoading(true);
        const { data: moods, error } = await supabase
          .from("stats")
          .select("*")
          .eq("user_id", user?.id || "");

        if (error) throw error;
        const uniqueCategories = new Set(moods.map((mood) => mood.category));
        setCategories([...uniqueCategories].filter(Boolean));
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

  const deleteMood = async (id) => {
    try {
      const { data, error } = await supabase
        .from("stats")
        .delete()
        .match({ id: id });
      if (error) throw error;
      setMoods(moods.filter((moods) => moods.id !== id));
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const modifyMood = async (id, rating, category, description) => {
    try {
      const { data: updatedMood, error } = await supabase
        .from("stats")
        .update({
          rating: rating,
          category: category,
          description: description,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      setMoods((prevMoods) =>
        prevMoods.map((mood) => {
          if (mood.id === id) {
            return updatedMood;
          }
          return mood;
        })
      );
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const countMoodsYear = (moods) => {
    const currentYear = new Date(2023, 0, 1);
    const moodSinceYear = moods.filter(
      (mood) => new Date(mood.created_at) > currentYear
    );
    const count = moodSinceYear.length;
    return count;
  };

  const countMoodsMonth = (moods) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const filteredMoods = moods.filter(
      (mood) => mood.createdAt >= startOfMonth
    );

    return filteredMoods.length;
  };

  const getMostUsedCategory = (moods) => {
    const categoryCounts = {};
    moods.forEach((moods) => {
      const category = moods.category;
      if (category in categoryCounts) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedCategories.length > 0) {
      return sortedCategories[0][0];
    } else {
      return null;
    }
  };

  const getLessUsedCategory = (moods) => {
    const categoryCounts = {};
    moods.forEach((moods) => {
      const category = moods.category;
      if (category in categoryCounts) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => a[1] - b[1]
    );

    if (sortedCategories.length > 0) {
      return sortedCategories[0][0];
    } else {
      return null;
    }
  };

  const getMostUsedEmoji = (moods) => {
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    };

    moods.forEach((moods) => {
      const rating = moods.rating;
      ratingCounts[rating] += 1;
    });

    const sortedRatings = Object.entries(ratingCounts).sort(
      (a, b) => b[1] - a[1]
    );

    let mostUsedRating = sortedRatings[0][0];

    if (mostUsedRating === "1" || mostUsedRating === "2") {
      return "😡";
    } else if (
      mostUsedRating === "3" ||
      mostUsedRating === "4" ||
      mostUsedRating === "5"
    ) {
      return "😟";
    } else if (mostUsedRating === "6" || mostUsedRating === "7") {
      return "🙂";
    } else {
      return "🥰";
    }
  };

  //create a function to change color of the rating based on the value of the rating
  const getRatingColor = (moods) => {
    const ratings = moods.map((mood) => parseFloat(mood.rating));
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    if (averageRating >= 1 && averageRating <= 2) {
      return "red";
    } else if (averageRating >= 3 && averageRating <= 5) {
      return "orange";
    } else if (averageRating >= 6 && averageRating <= 7) {
      return "yellow";
    } else if (averageRating >= 8 && averageRating <= 10) {
      return "green";
    } else {
      return "invalid rating";
    }
  };

  const handleFilterByDate = () => {
    // Toggle the value of filterByDate
    setFilterByDate((prevFilter) => !prevFilter);
    // Sort moods by created_at in the desired order (most recent or oldest first)
    setMoods((prevMoods) =>
      [...prevMoods].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (filterByDate) {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      })
    );
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

  //create a function to sort the moods by category
  const handleFilterByCategory = (selectedCategory) => {
    // Toggle the value of filterByCategory
    setFilterByCategory((prevFilter) => !prevFilter);

    // Filter moods by selected category
    const filteredMoods = selectedCategory
      ? moods.filter((mood) => mood.category === selectedCategory)
      : moods;

    // Sort filtered moods by category in ascending order
    const sortedMoods = [...filteredMoods].sort((a, b) => {
      if (filterByCategory) {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
      }
    });

    // Update the state with sorted and filtered moods
    setMoods(sortedMoods);
  };

  //save into other database
  // const handleClick = async () => {
  //   setStatus("loading");
  //   setLoading(true);
  //   const { data: stats, error: statsError } = await supabaseClient
  //     .from("stats")
  //     .select("*");

  //   if (statsError) {
  //     setStatus("idle");
  //     console.error(statsError);
  //     return;
  //   }

  //   const { data: descriptionStats, error: descriptionStatsError } =
  //     await supabaseClient.from("description_stats").select("*");

  //   if (descriptionStatsError) {
  //     setStatus("error");
  //     console.error(descriptionStatsError);
  //     return;
  //   }

  //   const existingIds = descriptionStats.map((ds) => ds.id);

  //   for (let i = 0; i < stats.length; i++) {
  //     const { id, description } = stats[i];
  //     if (!existingIds.includes(id)) {
  //       const { error: insertError } = await supabaseClient
  //         .from("description_stats")
  //         .insert({ id, description });
  //       if (insertError) {
  //         setStatus("error");
  //         console.error(insertError);
  //         setLoading(false);
  //       }
  //     }
  //     setStatus("saved to the DB!");
  //     setLoading(false);
  //     setTimeout(() => {
  //       setStatus("idle");
  //     }
  //     , 2000);

  //   }
  // };

  //create a function to loop trough the moods, get the rate and calculate the average
  const getAverageRating = (moods) => {
    const ratings = moods.map((mood) => parseFloat(mood.rating));
    const sum = ratings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = sum / ratings.length;
    return averageRating;
  };

  const ratingColor = getRatingColor(moods);
  const averageRating = getAverageRating(moods);

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
      <Grid item xs={12}>
        <Button variant="contained" onClick={() => handleClick(moods)}>
          Save descriptions to description database
        </Button>
      </Grid>

      <Grid item xs={12}>
        {getMostUsedCategory(moods) ? (
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Most used category
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: "green", textAlign: "center" }}
            >
              {getMostUsedCategory(moods)}
            </Typography>
          </>
        ) : (
          "Loading..."
        )}{" "}
        <br />
        {getLessUsedCategory(moods) ? (
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Less used category
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: "red", textAlign: "center" }}
            >
              {getLessUsedCategory(moods)}
            </Typography>
          </>
        ) : (
          "Loading..."
        )}{" "}
        <br />
        <br />
        {getAverageRating(moods) ? (
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Average rating
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mb: 2,
                textAlign: "center",
                color: ratingColor,
              }}
            >
              {averageRating.toFixed(2)} {getMostUsedEmoji(moods)}
            </Typography>
          </>
        ) : (
          "Loading..."
        )}{" "}
        <br />
        {countMoodsYear(moods) ? (
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Total Entry this years
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              {countMoodsYear(moods)}
            </Typography>
          </>
        ) : (
          "Loading..."
        )}{" "}
        <br />
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
              <Button
                onClick={handleFilterByDate}
                disabled={loading || error}
                variant="contained"
                sx={{ width: "100%" }}
              >
                {filterByDate
                  ? "Click to Oldest First"
                  : "Click to Recent First"}
              </Button>
            }
            sx={{ mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Filter by Date
          </Typography>
          <FormControlLabel
            control={
              <Button
                onClick={handleFilterByRate}
                disabled={loading || error}
                variant="contained"
                sx={{ width: "100%" }}
              >
                {filterByRate
                  ? "Click to Lowest First"
                  : "Click to Highest First"}
              </Button>
            }
            sx={{ mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Filter by Rating
          </Typography>
          {/* <FormControlLabel
            control={
              <>
                <Select
                  value={categories}
                  onChange={handleFilterByCategory}
                  disabled={loading || error}
                  sx={{
                    color: "white",
                    width: 200,
                    border: 1,
                    borderColor: "grey.500",
                    borderRadius: 4,
                    mr: 2,
                    input: {
                      color: "white",
                    },
                    InputLabelProps: {
                      color: "white",
                    },

                  }}
                >
                 {categories.map((category) => (
                    <MenuItem value={category}>{category}</MenuItem>
                  ))}
                  
                </Select>
              </>
            }
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Filter by Category
          </Typography> */}
        </FormGroup>
      </Grid>

      <Grid item xs={12} sx={{ mt: 4 }}>
        {filterByDate &&
          moods
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((moods) => (
              <Grid item xs={12} sx={{ mt: 4, m: 4 }}>
                <ListsMood
                  key={moods.id}
                  moods={moods}
                  onDelete={() => deleteMood(moods.id)}
                  onModify={() => modifyMood()}
                />
              </Grid>
            ))}
        {!filterByDate &&
          moods.map((moods) => (
            <Grid item xs={12} sx={{ mt: 4, m: 4 }}>
              <ListsMood
                key={moods.id}
                moods={moods}
                onDelete={() => deleteMood(moods.id)}
                onModify={() => modifyMood()}
              />
            </Grid>
          ))}
        {/* {filterByCategory &&
          moods
            .filter((moods) => moods.category === categories)
            .map((moods) => (
              <Grid item xs={12} sx={{ mt: 4, m: 4 }}>
                <ListsMood
                  key={moods.id}
                  moods={moods}
                  onDelete={() => deleteMood(moods.id)}
                  onModify={() => modifyMood()}
                />
              </Grid>
            ))} */}
      </Grid>
    </Grid>
  );
}
