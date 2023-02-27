import ResumeGPT from "@/components/ResumeGPT";
import { Grid, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function ResumerMoodPage() {
    return(
            <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mood List
        </Typography>
        <Link href="/">
          <Button variant="contained">Back to Home</Button>
        </Link>
      </Grid>
  
        <Grid item xs={12} md={12} sx={{ justifyContent: "center", textAlign: "center" }}>

        <ResumeGPT />
        </Grid>
    </Grid>
    )
  
}

