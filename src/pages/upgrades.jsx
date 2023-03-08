import { Typography, Button, Grid } from "@mui/material";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import CommentIcon from "@mui/icons-material/Comment";

export default function Upgrade() {
  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next Upgrades
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }}>
        <Link href="/">
          <Button variant="contained">Back to Home</Button>
        </Link>
        <List sx={{ width: "100%", maxWidth: 360, mt: 4 }}>
          <p>Allow mood modification</p>

          <p>Allow multiple users</p>
          <p>Add graphic view</p>
        </List>
      </Grid>
    </Grid>
  );
}
