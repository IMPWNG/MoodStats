import { useState, useReducer, JSXElementConstructor, ReactElement, ReactFragment } from "react";
import { NextPage } from "next";
import { Mood } from "@/types/moodTypes";
import { Card, CardHeader, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions, Alert, CardContent } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useMoods } from "@/hooks/useMoods";

interface MoodsPropsChange {
  onDelete?: (id: number) => void;
  onModify?: (id: number, description: string, rating: number, category: string) => void;
}

export const ListsMoods: NextPage<MoodsPropsChange> = ({ onDelete, onModify }) => {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useReducer(
    (prev: any, next: any) => ({ ...prev, ...next }),
    {
      id: 0,
      description: "",
      rating: 0,
      category: "",
    }
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [oppenAlert, setOppenAlert] = useState<boolean>(false);

  const moods = useMoods();


  // useEffect(() => {
  //   async function getMoods() {
  //     try {
  //       const response = await fetch("/api/mood");
  //       const { data: moods } = await response.json();
  //       setMoods(moods as Mood[]);
  //     }
  //     catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   async function deleteMood(id: string) {
  //     try {
  //       const response = await fetch("/api/mood", {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           id,
  //         }),
  //       });
  //       const { data: moods } = await response.json();
  //       onDelete(id);
  //       setMoods(moods as Mood[]);

  //     }
  //     catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   async function modifyMood(id: string, description: string, rating: number, category: string) {
  //     try {
  //       const response = await fetch("/api/mood", {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           id,
  //           description,
  //           rating,
  //           category,
  //         }),
  //       });
  //       const { data: moods } = await response.json();
  //       onModify(id, description, rating, category);
  //       setMoods(moods as Mood[]);
  //     }
  //     catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getMoods();
  // }, []);

  const deleteMood = async (id: number) => {
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
      const { data: moods } = await response.json();
      onDelete(id);
    }
    catch (error) {
      console.error(error);
    }
  }

  const modifyMood = async (id: number, description: string, rating: number, category: string) => {
    try {
      const response = await fetch("/api/mood", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          description,
          rating,
          category,
        }),
      });
      const { data: moods } = await response.json();
      onModify(id, description, rating, category);

    }
    catch (error) {
      console.error(error);
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { description, rating, category } = e.currentTarget;
    if (rating > 10) {
      alert("Rating cannot be more than 10");
      return;
    }
    const moodsTop = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        rating,
        category,
      }),

    });

    const response = await fetch("/api/mood", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: moodsTop[0]?.id,
      }),
    });
    const { data: moods } = await response.json();
    onDelete(moods[0]?.id);
    setOpen(false);
    window.location.reload();
  };


  const formatDateTime = (dateTimeString = "") => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  };

  const countMoodsYear = (moods: Mood[]) => {
    const currentYear = new Date(2023, 0, 1);
    if (!Array.isArray(moods)) {
      return 0;
    }

    const moodsThisYear = moods.filter((mood) => {
      const moodDate = new Date(mood.created_at);
      return moodDate.getFullYear() === currentYear.getFullYear();
    }
    );
    return moodsThisYear.length;
  };

  const getMostUsedCategory = (moods: Mood[]) => {
    const categoryCounts: { [key: string]: number } = {};
    if (!Array.isArray(moods)) {
      return null;
    }
    moods.forEach((mood: { category: any; }) => {
      const category = mood?.category;
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

  const getLessUsedCategory = (moods: Mood[]) => {
    const categoryCounts: { [key: string]: number } = {};
    if (!Array.isArray(moods)) {
      return null;
    }
    moods.forEach((mood: { category: any; }) => {
      const category = mood?.category;
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

  //create a function to loop trough the moods, get the rate and calculate the average
  const getAverageRating = (moods: Mood[]) => {
    if (!Array.isArray(moods) || moods.length === 0) {
      return 0;
    }

    const ratings = moods.map((mood: { rating: number; }) => mood.rating);
    const sum = ratings.reduce((sum: number, rating: number) => sum + rating, 0);
    const averageRating = sum / ratings.length;
    return averageRating;
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  // const ratingColor = getRatingColor(moods);
  const averageRating = getAverageRating(moods);

  //create the const rowsMood to get the data from the database
  const rowsMood = Array.isArray(moods) && moods.length
    ? moods.map((mood) => ({
      id: mood.id,
      rating: mood.rating,
      category: mood.category,
      description: mood.description,
      created_at: formatDateTime(mood.created_at),
    }))
    : [];

  return (

    <>
      <Card sx={{ width: 300, height: 400, mb: 5, borderRadius: 2, boxShadow: 2 }}>
        {getMostUsedCategory(moods) ? (
          <CardHeader
            title="Most used category"
            subheader={getMostUsedCategory(moods)}
            sx={{
              textAlign: "center",
              "& .MuiCardHeader-subheader": {
                color: "green",
                fontSize: "1.5rem",
              },
            }} />
        ) : (
          "Loading..."
        )}{" "}
        {getLessUsedCategory(moods) ? (
          <CardHeader
            title="Less used category"
            subheader={getLessUsedCategory(moods)}
            sx={{
              textAlign: "center",

              "& .MuiCardHeader-subheader": {
                color: "red",
                fontSize: "1.5rem",
              },
            }} />
        ) : (
          "Loading..."
        )}{" "}
        <CardHeader
          title="Average Rating"
          subheader={`${averageRating.toFixed(2)} / 10`}
          sx={{
            textAlign: "center",

            "& .MuiCardHeader-subheader": {
              color: "blue",
              fontSize: "1.5rem",
            },
          }} />
        <CardHeader
          title="Total entries this year"
          subheader={countMoodsYear(moods)}
          sx={{
            textAlign: "center",

            "& .MuiCardHeader-subheader": {
              color: "blue",
              fontSize: "1.5rem",
            },
          }} />
      </Card>


      <div className="flex flex-col items-center justify-center">
        <table className="order-separate border border-slate-500 text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-500 text-center">
                Rating
              </th>
              <th scope="col" className="border border-slate-500 text-center">
                Category
              </th>
              <th scope="col" className="border border-slate-500 text-center">
                Description
              </th>
              <th scope="col" className="border border-slate-500 text-center">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsMood.map((mood) => (
              <tr key={mood.id}>
                <td className="border border-slate-700 text-center">
                  {mood.rating}
                </td>
                <td className="border border-slate-700 text-center">
                  {mood.category}
                </td>
                <td className="border border-slate-700 text-center">
                  {mood.description}
                </td>
                <td className="border border-slate-700 text-center">
                  {mood.created_at}
                </td>
                <td className="border border-slate-700 text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenDialog();

                      modifyMood(
                        mood.id,
                        mood.description,
                        mood.rating,
                        mood.category
                      )
                    }}
                  >
                    Modify
                  </Button>
                </td>
                <td className="border border-slate-700 text-center">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteMood(mood.id);
                      window.location.reload();
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Modify Mood</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              value={mood.description}
              onChange={(e) => mood.description = e.target.value} />
            <TextField
              autoFocus
              margin="dense"
              id="rating"
              label="Rating"
              type="number"
              fullWidth
              value={mood.rating}
              onChange={(e) => mood.rating = e.target.value}
            />
            <Select
              labelId="category"
              id="category"
              value={mood.category}
              label="Category"
              onChange={(e) => mood.category = e.target.value}
            >
              {categories.map((category) => (
                <MenuItem value={category}>{category}</MenuItem>
              ))}
            </Select>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>

  );
}
