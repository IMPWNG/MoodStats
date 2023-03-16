import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export default function ListsMoods({ moods, onDelete, onModify }) {
  const formatDateTime = (dateTimeString) => {
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenReadMore, setDialogOpenReadMore] = useState(false);
  const [rating, setRating] = useState(moods.rating);
  const [category, setCategory] = useState(moods.category);
  const [description, setDescription] = useState(moods.description);
  const [categories, setCategories] = useState([]);
  const [created_at, setCreated_at] = useState(
    formatDateTime(moods.created_at)
  );
  const supabase = useSupabaseClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function fetchCategories() {
      const { data: categoriesData, error } = await supabase
        .from("stats")
        .select("category");
      if (error) {
        console.log("error", error.message);
      } else {
        const uniqueCategories = new Set(
          categoriesData.map((category) => category.category)
        );
        setCategories([...uniqueCategories]);
      }
    }
    fetchCategories();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDialogReadMore = () => {
    setDialogOpenReadMore(true);
  };

  const handleCloseDialogReadMore = () => {
    setDialogOpenReadMore(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating > 10) {
      alert("Rating cannot be more than 10");
      return;
    }
    const { data, error } = await supabase
      .from("stats")
      .delete()
      .eq("id", moods.id); // use the `eq` filter to match the record with the given id
    if (error) {
      console.log("error", error.message);
    } else {
      onDelete(moods.id); // call the `onDelete` callback with the id of the deleted record
      setDialogOpen(false);
      window.location.reload();
    }
  };

  const getBorderColor = (rating) => {
    if (rating >= 8) {
      return "green";
    } else if (rating >= 6) {
      return "yellow";
    } else if (rating >= 4) {
      return "orange";
    } else {
      return "red";
    }
  };

  //create the const rowsMood to get the data from the database
  const rowsMood = Array.isArray(moods)
    ? moods.map((mood) => ({
        id: mood.id,
        rating: mood.rating,
        category: mood.category,
        description: mood.description,
        created_at: mood.created_at,
      }))
    : [];

  return (
    <div
      style={{
        height: 700,
        margin: "auto",
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        padding: 20,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rowsMood || []}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "grey.500",
          borderRadius: 10,
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
            hide: true,
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
          },
          {
            field: "action",
            headerName: "Action",
            headerAlign: "center",
            width: 200,
            disableColumnMenu: true,
            align: "center",
            renderCell: (params) => (
              <>
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    onDelete(params.row.id);
                  }}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenDialog();
                    onModify(
                      params.row.id,
                      params.row.description,
                      params.row.rating,
                      params.row.category
                    );
                  }}
                >
                  Modify
                </Button>
              </>
            ),
          },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        density="comfortable"
      />

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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="rating"
              label="Rating"
              type="number"
              fullWidth
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <Select
              labelId="category"
              id="category"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>

            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>

              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* <Card
        variant="outlined"
        sx={{
          mb: 2,
          border: 4,
          borderColor: getBorderColor(moods.rating),
          height: 400,
        }}
      >
        <CardContent sx={{ height: 300 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
            <Typography
              sx={{ textDecoration: "underline" }}
              color="text.secondary"
              variant="h5"
              component="h2"
            >
              Content:
            </Typography>
            <Typography
              variant="p"
              component="p"
              sx={{ mt: 2, fontSize: 15, mb: 2 }}
            >
              {moods.description.length > 200 ? (
                <>
                  {moods.description.substring(0, 100)}...
                  <a
                    onClick={handleOpenDialogReadMore}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    Read More
                  </a>
                </>
              ) : (
                moods.description
              )}
            </Typography>
          </Typography>

          <Dialog open={dialogOpenReadMore} onClose={handleCloseDialogReadMore}>
            <DialogTitle>More</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                value={description}
                disabled
                multiline
                rows={20}
              />
            </DialogContent>
          </Dialog>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <Typography
              sx={{ textDecoration: "underline" }}
              color="text.secondary"
            >
              Rate:
            </Typography>{" "}
            {moods.rating}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <Typography
              sx={{ textDecoration: "underline" }}
              color="text.secondary"
            >
              Category:
            </Typography>{" "}
            {moods.category}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            <Typography
              sx={{ textDecoration: "underline" }}
              color="text.secondary"
            >
              Created At:
            </Typography>{" "}
            {formatDateTime(moods.created_at)}
          </Typography>
        </CardContent>


        <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
          <Button
            size="small"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            variant="contained"
          >
            Delete
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOpenDialog();
              onModify();
            }}
            variant="contained"
          >
            Modify
          </Button>
        </CardActions>

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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="rating"
                label="Rating"
                type="number"
                fullWidth
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <Select
                labelId="category"
                id="category"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>

                <Button type="submit">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Card> */}
    </div>
  );
}
