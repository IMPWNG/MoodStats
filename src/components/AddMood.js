import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Step,
  Stepper,
  Box,
  StepLabel,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTheme } from "@mui/material/styles";

const steps = ["💬", "📁", "💯"];

export default function AddMood({ user }) {
  const [moods, setMoods] = useState([]);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [clicked, setClicked] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const theme = useTheme();

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const response = await fetch("/api/mood");
    const data = await response.json();
    setMoods(data);
  };

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

  const handleAddMood = async () => {
    const description = newDescriptionText.trim();
    const category = categoryText.trim();
    if (description.length === 0) {
      setErrorText("Description cannot be empty");
      return;
    }
    if (category.length === 0) {
      setErrorText("Category cannot be empty");
      return;
    }
    if (!clicked || clicked < 1 || clicked > 10) {
      setErrorText("Please rate your mood");
      return;
    }
    const response = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        rating: clicked,
        user_id: user.id,
        category,
      }),
    });
    const data = await response.json();
    if (data?.error) {
      setErrorText(data.error.message);
      return;
    }
    setNewDescriptionText("");
    setCategoryText("");
    setClicked(null);
    setIsAdded(true);
    setActiveStep(0);
    fetchMoods();
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

  //create a function that will show an alet when the user adds a mood
  const showAddedAlert = () => {
    if (isAdded) {
      return (
        <div className="bg-green-500 text-white p-2 rounded">
          <p>Added!</p>
        </div>
      );
    }
    //set a timeout to remove the alert after 3 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
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
    <>
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
            {showAddedAlert()}

            {!!errorText ? (
              <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
                <Alert text={errorText} />
              </Grid>
            ) : (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you can submit your mood!
                </Typography>
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
                          Rate: {" " + clicked + " " + getMostUsedEmoji(moods)}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pl: 1,
                          pb: 1,
                        }}
                      >
                        <IconButton aria-label="previous">
                          {theme.direction === "rtl" ? (
                            <EditIcon />
                          ) : (
                            <DeleteForeverIcon />
                          )}
                        </IconButton>

                        <IconButton aria-label="next">
                          {theme.direction === "rtl" ? (
                            <DeleteForeverIcon />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleReset} sx={{ ml: 1 }}>
                Reset
              </Button>
              <Button onClick={handleBack} sx={{ ml: 1 }}>
                Back
              </Button>
              <Button onClick={handleAddMood} disabled={!!errorText}>
                Submit
              </Button>
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
            </Box>
          </Grid>
        )}
      </Box>

      {/* <h1 className="mb-12 text-center text-2xl font-bold mt-5">Add Mood</h1>
      <div className="flex gap-2 my-2">
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="What's on your mind ? - Rate your mood"
          value={newDescriptionText}
          onChange={(e) => {
            setErrorText("");
            setNewDescriptionText(e.target.value);
          }}
        />
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="Category"
          value={categoryText}
          onChange={(e) => {
            setErrorText("");
            setCategoryText(e.target.value);
          }}
        />
        <div className="flex flex-col gap-2">
          <Button
            className={getButtonClass(1)}
            onClick={() => handleClickedButton(1)}
          >
            1
          </Button>
          <Button
            className={getButtonClass(2)}
            onClick={() => handleClickedButton(2)}
          >
            2
          </Button>
          <Button
            className={getButtonClass(3)}
            onClick={() => handleClickedButton(3)}
          >
            3
          </Button>
          <Button
            className={getButtonClass(4)}
            onClick={() => handleClickedButton(4)}
          >
            4
          </Button>
          <Button
            className={getButtonClass(5)}
            onClick={() => handleClickedButton(5)}seß
          >
            5
          </Button>
          <Button
            className={getButtonClass(6)}
            onClick={() => handleClickedButton(6)}
          >
            6
          </Button>
          <Button
            className={getButtonClass(7)}
            onClick={() => handleClickedButton(7)}
          >
            7
          </Button>
          <Button
            className={getButtonClass(8)}
            onClick={() => handleClickedButton(8)}
          >
            8
          </Button>
          <Button
            className={getButtonClass(9)}
            onClick={() => handleClickedButton(9)}
          >
            9
          </Button>
          <Button
            className={getButtonClass(10)}
            onClick={() => handleClickedButton(10)}
          >
            10
          </Button>
        </div>
        <Button className="btn-black" onClick={handleAddMood}>
          Add
        </Button>
        {showAddedAlert()}
      </div>
      {!!errorText && <Alert text={errorText} />} */}
    </>
  );
}

const Alert = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
