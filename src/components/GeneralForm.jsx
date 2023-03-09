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
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material/styles";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });
const steps = ["💬", "📁", "💯"];

export default function GeneralForm() {
  const [moods, setMoods] = useState([]);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [clicked, setClicked] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const [alert, setAlert] = useState(false);

  const supabase = useSupabaseClient();
  const user = useUser();

  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAddMood = async () => {
    const description = newDescriptionText.trim();
    const category = categoryText.trim();
    if (description.length === 0) {
      setActiveStep(0);
      setAlert(true);
      return;
    }
    if (category.length === 0) {
      setActiveStep(1);
      setAlert(true);
      return;
    }
    if (!clicked || clicked < 1 || clicked > 10) {
      setActiveStep(2);
      setAlert(true);
      return;
    }

    try {
      const { data, error } = await supabase.from("stats").insert([
        {
          description,
          rating: clicked,
          user_id: user.id,
          category,
        },
      ]);
      setAlert(true);
      setIsAdded(true);
      setNewDescriptionText("");
      setCategoryText("");
      setClicked(null);
      setActiveStep(0);

      if (error) throw error;
    } catch (error) {
      console.log("error", error.message);
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

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {alert && (
            <Alert
              sx={{ mt: 4, mb: 4 }}
              onClose={() => setInterval(setAlert(false), 2000)}
            >
              Mood added!
            </Alert>
          )}

          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you can submit your mood!
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Card sx={{ display: "flex", width: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent
                      sx={{ justifyContent: "center", textAlign: "left" }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        Category{" "}
                      </Typography>
                      {categoryText}
                      <Typography sx={{ fontWeight: "bold", mb: 1, mt: 2 }}>
                        Description{" "}
                      </Typography>
                      {newDescriptionText}
                      <Typography sx={{ fontWeight: "bold", mb: 1, mt: 2 }}>
                        Rate
                      </Typography>{" "}
                      {" " + clicked + " " + getMostUsedEmoji(moods)}
                    </CardContent>
                  </Box>
                </Card>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />

                <Button onClick={handleReset} sx={{ ml: 1 }}>
                  Reset
                </Button>
                <Button onClick={handleBack} sx={{ ml: 1 }}>
                  Back
                </Button>
                <Button onClick={handleAddMood}>Submit</Button>
              </Box>
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
                      id="description"
                      value={newDescriptionText}
                      label="Type your mood here..."
                      onChange={(e) => setNewDescriptionText(e.target.value)}
                      sx={{
                        width: "100%",
                        justifyContent: "center",
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
                      id="category"
                      value={categoryText}
                      onChange={(e) => setCategoryText(e.target.value)}
                      sx={{
                        width: "100%",
                        justifyContent: "center",
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
