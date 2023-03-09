import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
  const supabase = useSupabaseClient();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <li
      onClick={(e) => {
        e.preventDefault();
      }}
      className="flex items-center justify-between px-4 py-4 sm:px-6"
    >
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <button
          className="float-right text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
        <button
          className="float-right text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenDialog();
            onModify();
          }}
        >
          Modify
        </button>
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Modify Mood</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
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
              <TextField
                autoFocus
                margin="dense"
                id="category"
                label="Category"
                type="text"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
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
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>

        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {moods.rating == 1 && (
            <span className="text-red-500"> {moods.description} 😡</span>
          )}
          {moods.rating == 2 && (
            <span className="text-red-500"> {moods.description} 😡</span>
          )}
          {moods.rating == 3 && (
            <span className="text-red-500"> {moods.description} 😟</span>
          )}
          {moods.rating == 4 && (
            <span className="text-orange-500"> {moods.description} 😐</span>
          )}
          {moods.rating == 5 && (
            <span className="text-orange-500"> {moods.description} 😐</span>
          )}
          {moods.rating == 6 && (
            <span className="text-yellow-500"> {moods.description} 🙂</span>
          )}
          {moods.rating == 7 && (
            <span className="text-yellow-500"> {moods.description} 😃</span>
          )}
          {moods.rating == 8 && (
            <span className="text-green-500"> {moods.description} 🥰</span>
          )}
          {moods.rating == 9 && (
            <span className="text-green-500"> {moods.description} 🥰</span>
          )}
          {moods.rating == 10 && (
            <span className="text-green-500"> {moods.description} 🥰</span>
          )}
        </h2>
        <span className="mr-2 text-black dark:text-gray-400">
          Rating: {moods.rating}/10
        </span>
        <span className="mr-2 text-black dark:text-gray-400">
          Created: {formatDateTime(moods.created_at)}
        </span>
        <br />
        <span className="mr-2 text-black dark:text-gray-400">
          Category: {moods.category}
        </span>
      </div>
    </li>
  );
}
