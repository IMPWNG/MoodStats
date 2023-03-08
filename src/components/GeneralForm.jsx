import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Step,
  Stepper,
  Box,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  Stack,
  AlertTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material/styles";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { Inter } from "@next/font/google";
import { ST } from "next/dist/shared/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const steps = ["💬", "📁", "💯"];

export default function GeneralForm() {
  const [moods, setMoods] = useState([]);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [clicked, setClicked] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const supabase = useSupabaseClient();
  const user = useUser();

  const theme = useTheme();

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlert(true);
  };

  const handleAddMood = async () => {
    const description = newDescriptionText.trim();
    const category = categoryText.trim();
    if (description.length === 0) {
      showAlert("Description cannot be empty", "error");
      return;
    }
    if (category.length === 0) {
      showAlert("Category cannot be empty", "error");
      return;
    }
    if (!clicked || clicked < 1 || clicked > 10) {
      showAlert("Please select a rating", "error");
      return;
    }

    try {
      const { data: moods, error } = await supabase.from("stats").insert([
        {
          description,
          rating: clicked,
          user_id: user.id,
          category,
        },
      ]);
      if (error) throw error;
      setNewDescriptionText("");
      setCategoryText("");
      setClicked(null);
      setIsAdded(true);
      showAlert("Mood added successfully", "success");
    } catch (error) {
      console.log("error", error.message);

      showAlert(error.message, "error");
    }
  };

  const handleClickedButton = (rating) => {
    setClicked(rating);
  };

  const getButtonClass = (rating) => {
    if (clicked === rating) {
      return "btn-black bg-green-500";
    } else {
      return "btn-black";
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

    moods.forEach((mood) => {
      const rating = mood.rating;
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

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              {isAdded ? (
                <>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Card sx={{ display: "flex", width: "100%" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div" variant="h5">
                            {categoryText}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            {newDescriptionText}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            Rate:{" "}
                            {" " + clicked + " " + getMostUsedEmoji(moods)}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      onClick={handleAddMood}
                      sx={{ ml: 1, justifyContent: "center", width: "100%" }}
                      variant="contained"
                    >
                      Submit
                    </Button>
       
                  </Box>
                  <Snackbar open={alert} autoHideDuration={6000}>
                    <Alert severity={alertSeverity}>{alertMessage}</Alert>
                  </Snackbar>
                  
                </>
              ) : (
                <>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Card sx={{ display: "flex", width: "100%" }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div" variant="h5">
                            {categoryText}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            {newDescriptionText}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            Rate:{" "}
                            {" " + clicked + " " + getMostUsedEmoji(moods)}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      onClick={handleAddMood}
                      sx={{ ml: 1, justifyContent: "center", width: "100%" }}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {activeStep === 0 && (
                  <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                    <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
                      What's on your mind?
                    </Typography>
                    <TextField
                      type="text"
                      id="description"
                      value={newDescriptionText}
                      label="Type your mood here..."
                      onChange={(e) => setNewDescriptionText(e.target.value)}
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                        border: 1,
                        borderColor: "white",
                        borderRadius: 2,
                        input: { color: "white" },
                        label: { color: "white" },
                      }}
                    />
                  </Grid>
                )}
                {activeStep === 1 && (
                  <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                    <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
                      How you categorise your mood?
                    </Typography>
                    <TextField
                      label="Type a category here..."
                      type="text"
                      id="category"
                      value={categoryText}
                      onChange={(e) => setCategoryText(e.target.value)}
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                        border: 1,
                        borderColor: "white",
                        borderRadius: 2,
                        input: { color: "white" },
                        label: { color: "white" },
                      }}
                    />
                  </Grid>
                )}
                {activeStep === 2 && (
                  <Grid item xs={12} sm={12} sx={{ mt: 2, mb: 2 }}>
                    <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
                      How you rate your mood?
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      sx={{ mt: 4, justifyContent: "space-evenly" }}
                    >
                      <Button
                        className={getButtonClass(1)}
                        onClick={() => handleClickedButton(1)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        1
                      </Button>

                      <Button
                        className={getButtonClass(2)}
                        onClick={() => handleClickedButton(2)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        2
                      </Button>

                      <Button
                        className={getButtonClass(3)}
                        onClick={() => handleClickedButton(3)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        3
                      </Button>
                      <Button
                        className={getButtonClass(4)}
                        onClick={() => handleClickedButton(4)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        4
                      </Button>
                      <Button
                        className={getButtonClass(5)}
                        onClick={() => handleClickedButton(5)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        5
                      </Button>
                      <Button
                        className={getButtonClass(6)}
                        onClick={() => handleClickedButton(6)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        6
                      </Button>
                      <Button
                        className={getButtonClass(7)}
                        onClick={() => handleClickedButton(7)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        7
                      </Button>
                      <Button
                        className={getButtonClass(8)}
                        onClick={() => handleClickedButton(8)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        8
                      </Button>
                      <Button
                        className={getButtonClass(9)}
                        onClick={() => handleClickedButton(9)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        9
                      </Button>
                      <Button
                        className={getButtonClass(10)}
                        onClick={() => handleClickedButton(10)}
                        sx={{
                          color: "white",
                          ":hover": { color: "green" },
                          m: 1,
                        }}
                      >
                        10
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "See resume" : "Next"}
                </Button>

                {activeStep === steps.length - 1 && (
                  <Button
                    onClick={handleAddMood}
                    sx={{ ml: 1 }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          )}
        </Box>
      </div>
      <div className={styles.grid}>
        <Link href="/list_mood" className={styles.card} passHref>
          <h2 className={inter.className}>
            View, Delete, Modify {"  "}
            <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            View, Delete, Modify your mood from the list off all your created
            moods
          </p>
        </Link>
        <Link href="/graph_mood" className={styles.card} passHref>
          <h2>
            Graphs, stats, and more <span>-&gt;</span>
          </h2>
          <p>
            See your data in a more visual way, and get more insights about your
            mood
          </p>
        </Link>

        <Link href="/resume_mood" className={styles.card} passHref>
          <h2>
            Resume <span>-&gt;</span>
          </h2>
          <p>Get the daily, weekly, monthly, and yearly resume of your moods</p>
        </Link>

        <Link href="/upgrades" className={styles.card} passHref>
          <h2>
            Next Step <span>-&gt;</span>
          </h2>
          <p>See the next features that will be added to the app</p>
        </Link>
      </div>
    </main>
  );
}
