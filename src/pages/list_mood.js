import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect, use } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { set } from "date-fns";
import { Category } from "@mui/icons-material";

export default function ListMoodPage({ session }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterByDate, setFilterByDate] = useState(false);
  const [filterByRate, setFilterByRate] = useState(false);

  const supabase = useSupabaseClient();
  const user = useUser();

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
    async function fetchMoods() {
      try {
        setLoading(true);
        const { data: moods, error } = await supabase
          .from("stats")
          .select("*")
          .order("created_at", { ascending: false })
          .eq("user_id", user.id);

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
      const { data, error } = await supabase
        .from("stats")
        .update({
          rating: rating,
          category: category,
          description: description,
        })
        .match({ id: id });
      if (error) throw error;
      setMoods(moods.filter((moods) => moods.id !== id));
    } catch (error) {
      console.log("error", error.message);
    }
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
      setMoods((prevMoods) =>
        [...prevMoods].sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        })
      );
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

  //   const getMostUsedCategory = (moods) => {
  //     const categoryCounts = {};
  //     moods.forEach((moods) => {
  //       const category = moods.category;
  //       if (category in categoryCounts) {
  //         categoryCounts[category] += 1;
  //       } else {
  //         categoryCounts[category] = 1;
  //       }
  //     });

  //     const sortedCategories = Object.entries(categoryCounts).sort(
  //       (a, b) => b[1] - a[1]
  //     );

  //     if (sortedCategories.length > 0) {
  //       return sortedCategories[0][0];
  //     } else {
  //       return null;
  //     }
  //   };

  //   const getLessUsedCategory = (moods) => {
  //     const categoryCounts = {};
  //     moods.forEach((moods) => {
  //       const category = moods.category;
  //       if (category in categoryCounts) {
  //         categoryCounts[category] += 1;
  //       } else {
  //         categoryCounts[category] = 1;
  //       }
  //     });

  //     const sortedCategories = Object.entries(categoryCounts).sort(
  //       (a, b) => a[1] - b[1]
  //     );

  //     if (sortedCategories.length > 0) {
  //       return sortedCategories[0][0];
  //     } else {
  //       return null;
  //     }
  //   };

  //   const displayBestRatingsByCategory = (moods) => {
  //     const categoryRatings = {};

  //     // loop through each moods
  //     moods.forEach((moods) => {
  //       const category = moods.category;
  //       const rating = moods.rating;

  //       // if category hasn't been seen yet, add it to the object with this rating
  //       if (!(category in categoryRatings)) {
  //         categoryRatings[category] = rating;
  //       } else {
  //         // if category has been seen, update the rating if this one is better
  //         if (rating > categoryRatings[category]) {
  //           categoryRatings[category] = rating;
  //         }
  //       }
  //     });

  //     // filter out categories with ratings less than or equal to 5 and display the best rating for each category
  //     return (
  //       <>
  //         {Object.entries(categoryRatings)
  //           .filter(([rating]) => rating > 7)
  //           .map(([category, rating]) => (
  //             <p key={category}>
  //               Best rating for category '{category}': {rating}
  //             </p>
  //           ))}
  //       </>
  //     );
  //   };

  //   const displayLowRatingsByCategory = (moods) => {
  //     const categoryRatings = {};

  //     // loop through each moods
  //     moods.forEach((moods) => {
  //       const category = moods.category;
  //       const rating = moods.rating;

  //       // if category hasn't been seen yet, add it to the object with this rating
  //       if (!(category in categoryRatings)) {
  //         categoryRatings[category] = rating;
  //       } else {
  //         // if category has been seen, update the rating if this one is lower
  //         if (rating < categoryRatings[category]) {
  //           categoryRatings[category] = rating;
  //         }
  //       }
  //     });

  //     // loop through the object and display the low rating for each category
  //     return (
  //       <>
  //         {Object.entries(categoryRatings).map(([category, rating]) => {
  //           if (rating < 3) {
  //             return (
  //               <p key={category}>
  //                 Low rating for category '{category}': {rating}
  //               </p>
  //             );
  //           }
  //           return null;
  //         })}
  //       </>
  //     );
  //   };

  //   const getMostUsedEmoji = (moods) => {
  //     const ratingCounts = {
  //       1: 0,
  //       2: 0,
  //       3: 0,
  //       4: 0,
  //       5: 0,
  //       6: 0,
  //       7: 0,
  //       8: 0,
  //       9: 0,
  //       10: 0,
  //     };

  //     moods.forEach((moods) => {
  //       const rating = moods.rating;
  //       ratingCounts[rating] += 1;
  //     });

  //     const sortedRatings = Object.entries(ratingCounts).sort(
  //       (a, b) => b[1] - a[1]
  //     );

  //     let mostUsedRating = sortedRatings[0][0];

  //     if (mostUsedRating === "1" || mostUsedRating === "2") {
  //       return "😡";
  //     } else if (
  //       mostUsedRating === "3" ||
  //       mostUsedRating === "4" ||
  //       mostUsedRating === "5"
  //     ) {
  //       return "😟";
  //     } else if (mostUsedRating === "6" || mostUsedRating === "7") {
  //       return "🙂";
  //     } else {
  //       return "🥰";
  //     }
  //   };

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
            .map((moods) => (
              <ListsMood
                key={moods.id}
                moods={moods}
                onDelete={() => deleteMood(moods.id)}
                onModify={() => modifyMood(moods.id)}
              />
            ))}
        {!filterByDate &&
          moods.map((moods) => (
            <ListsMood
              key={moods.id}
              moods={moods}
              onDelete={() => deleteMood(moods.id)}
              onModify={() => modifyMood(moods.id)}
            />
          ))}
      </Grid>
    </Grid>
  );
}

//   return (
//     <>
//       <div className="flex justify-between items-center p-4">
//         <h1 className="text-2xl font-bold">Mood Stats</h1>
//         <Link href="/">
//           {" "}
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             Add moods
//           </button>
//         </Link>
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleClick(moods)}>
//           Save descriptions to database
//         </button>
//         <div className="flex flex-col gap-4 p-4 mb-4">
//           <ResumeGPT />
//         </div>
//         {status === "loading" && <p>Loading...</p>}
//         {status === "saved to the DB!" && <p>Saved to the DB!</p>}
//         {status === "error" && <p>Error!</p>}

//       </div>
//       <div className="flex flex-col gap-4 p-4 mb-4">
//         {getMostUsedCategory(moods) ? (
//           <>
//             Most used category:
//             <span className="text-green-500">{getMostUsedCategory(moods)}</span>
//           </>
//         ) : (
//           "Loading..."
//         )}{" "}
//         <br />
//         {getLessUsedCategory(moods) ? (
//           <>
//             Less used category:
//             <span className="text-red-500">{getLessUsedCategory(moods)}</span>
//           </>
//         ) : (
//           "Loading..."
//         )}{" "}
//         <br />
//         <br />
//         <br />
//         Most Rated Category: {displayBestRatingsByCategory(moods)}
//         <br />
//         Less Rated Category: {displayLowRatingsByCategory(moods)}
//         <br />
//         <br />
//         {getMostUsedEmoji(moods)
//           ? `Your Mood is moslty: ${getMostUsedEmoji(moods)}`
//           : "Loading..."}{" "}
//         <br />
//         <br />
//         {averageRating ? `Average rating: ${averageRating}` : "Loading..."}
//         <br />
//         <div>
//           <StatsMood moods={moods} />
//         </div>
//         <div>
//           {moods.map((moods) => (
//             <ListsMood
//               key={moods.id}
//               moods={moods}
//               onDelete={() => deleteMood(moods.id)}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
