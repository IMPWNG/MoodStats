import React from "react";
import { useState, useEffect } from "react";
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
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import SearchResult from "@/components/SearchResult";

export default function ListCardMood() {
    const [moods, setMoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);


  const supabase = useSupabaseClient();

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
   if (id !== undefined && Number.isInteger(id)) {
     try {
       const { data, error } = await supabase
         .from("stats")
         .delete()
         .match({ id: id });
       if (error) throw error;
       setMoods(moods.filter((moods) => moods.id !== id));
       setAlertDelete(true);
       setTimeout(() => {
         setAlertDelete(false);
       }, 3000);
     } catch (error) {
       console.log("error", error.message);
     }
   } else {
     console.log("ID is undefined or not a valid value.");
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
     // Wait for the update to complete
     await Promise.all([updatedMood]);
     // Show the alert only when the fetch to get the update is done
     setAlertModify(true);
     setTimeout(() => {
       setAlertModify(false);
     }, 3000);
   } catch (error) {
     console.log("error", error.message);
   }
 };

  return (
    <Grid container spacing={2}>
      {moods.map((moods) => (
        <Grid item xs={12} sm={6} md={4} key={moods.id}>
          <SearchResult
            moods={moods}
            onDelete={() => deleteMood(moods.id)}
            onModify={() => modifyMood()}
          />

            </Grid>
      ))}


    </Grid>
  );
}
