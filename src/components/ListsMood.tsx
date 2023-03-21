import { useState, useEffect } from "react";
import { NextPage } from "next";
import { DataGrid } from "@mui/x-data-grid";
import { Mood } from "@/types/moodTypes";
import { Card, CardHeader, Grid, Button } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";

export const ListsMoods: NextPage = () => {

  const [moods, setMoods] = useState<Mood[]>([]);
  const user = useUser();

  useEffect(() => {
    async function getMoods() {
      try {
        const response = await fetch("/api/mood");
        const { data: moods } = await response.json();
        setMoods(moods as Mood[]);
      }
      catch (error) {
        console.error(error);
      }
    }
    getMoods();
  }, [user]);

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

    const ratings = moods.map((mood: { rating: any; }) => mood.rating);
    const sum = ratings.reduce((sum: any, rating: any) => sum + rating, 0);
    const averageRating = sum / ratings.length;
    return averageRating;
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
    <Grid container spacing={2}>
    <Grid
      item
      xs={12}
      md={12}
      sx={{
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        mt: 4,
      }}
    >
      <Card sx={{ width: 300, height: 400, borderRadius: 10, boxShadow: 5 }}>
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
    </Grid>
    <Grid
      item
      xs={12}
      md={12}
      sx={{
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        mt: 4,
      }}
    >
    <div
      style={{
        height: 700,
        margin: "auto",
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        padding: 10,
        width: "80%",
      }}
    >
        <DataGrid
          rows={rowsMood || []}
          sx={{
            backgroundColor: "white",
            border: 1,
            borderColor: "grey.500",
            borderRadius: 1,
            "& .MuiDataGrid-columnHeaderWrapper": {
              backgroundColor: "red",
              border: 1,
              borderColor: "red",
              borderRadius: 10,
            },
            m: 1,
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "black",
              fontSize: "1.2rem",
            },
            "& .MuiDataGrid-cell": {
              color: "black",
              justifyContent: "center",
              width: "100%",
              alignContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "white",
              justifyContent: "center",
            },
          }}
          columns={[
            {
              field: "id",
              headerName: "ID",
              width: 70,
              headerAlign: "center",
              disableColumnMenu: true,
            },
            {
              field: "rating",
              headerName: "Rating",
              headerAlign: "center",
              width: 130,
            },
            {
              field: "category",
              headerName: "Category",
              headerAlign: "center",
              width: 130,
            },
            {
              field: "description",
              headerName: "Description",
              headerAlign: "center",
              width: 250,
              maxWidth: 300,
              disableColumnMenu: true,
            },
            {
              field: "created_at",
              headerName: "Created At",
              headerAlign: "center",
              width: 200,
              disableColumnMenu: true,

            },
            {
              field: "action",
              headerName: "Action",
              headerAlign: "center",
              width: 150,
              disableColumnMenu: true,
              renderCell: (params: any) => (
                <strong>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                
                  >
                    Edit
                  </Button>
                  <Button

                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ marginLeft: 16 }}
                
                  >
                    Delete
                  </Button>
                </strong>
              ),

            }
          ]}
          checkboxSelection
          density="comfortable" />
      </div>
</Grid>      
      
      </Grid>
  );
}
