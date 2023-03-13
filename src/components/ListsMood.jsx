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
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,

} from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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
  const [rating, setRating] = useState(moods.rating);
  const [category, setCategory] = useState(moods.category);
  const [description, setDescription] = useState(moods.description);
  const [categories, setCategories] = useState([]);
  const supabase = useSupabaseClient();

    useEffect(() => {
      async function fetchCategories() {
        const { data: categoriesData, error } = await supabase
          .from("stats")
          .select("category");

        if (error) {
          console.log("error", error.message);
        } else {
          const uniqueCategories =  new Set(categoriesData.map((category) => category.category));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (rating > 10) {
       alert("Rating cannot be more than 10");
       return;
     }
    const { data, error } = await supabase
      .from("stats")
      .update({ rating, category, description })
      .eq("id", moods.id);
    if (error) {
      console.log("error", error.message);
    } else {
      onModify();
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


  return (
    <Card variant="outlined" sx={{ mb: 2, border: 4, borderColor: getBorderColor(moods.rating)}}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 1.5 }}>
          <Typography
            sx={{ textDecoration: "underline" }}
            color="text.secondary"
            variant="h5"
            component="h2"
          >
            Content:
          </Typography>
          {moods.description}
        </Typography>
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
      <CardActions>
        <Button
          size="small"
          color="error"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
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
            onModify();
          }}
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
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
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
    </Card>
  );
}
