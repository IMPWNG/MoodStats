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
  Card,
  CardContent,
  IconButton,
  Alert,
} from "@mui/material";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import CircularProgress from "@mui/material/CircularProgress";

const steps = ["💬", "📁", "💯"];

export default function GeneralForm() {
  const [moods, setMoods] = useState([]);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [clicked, setClicked] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [alert, setAlert] = useState(false);
  const [createCategory, setCreateCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("category")
        .eq("user_id", user.id);

      if (error) throw error;
      const categories = data.map((item) => item.category);
      const uniqueCategories = [...new Set(categories)];
      setCreateCategory(uniqueCategories);
      setCategories(data);
    };
    getCategories();
  }, []);

  const supabase = useSupabaseClient();
  const user = useUser();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setNewDescriptionText("");
    setCategoryText("");
    setClicked(null);
  };

  const handleAddMood = async () => {
    const description = newDescriptionText.trim();
    const category = categoryText.trim();
    if (description.length === 0) {
      setActiveStep(0);

      return;
    }
    if (category.length === 0) {
      setActiveStep(1);

      return;
    }
    if (!clicked || clicked < 1 || clicked > 10) {
      setActiveStep(2);

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
      setIsAdded(true);
      setNewDescriptionText("");
      setCategoryText("");
      setClicked(null);
      setActiveStep(0);
      setLoading(true);

      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);

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
    } else if (
      mostUsedRating === "6" ||
      mostUsedRating === "7" ||
      mostUsedRating === "8" ||
      mostUsedRating === "9"
    ) {
      return "🙂";
    } else if (mostUsedRating === "10") {
      return "🥰";
    }
  };

  const getUniqueCategories = (categories) => {
    const uniqueCategories = [];
    categories.forEach((category) => {
      if (!uniqueCategories.includes(category.category)) {
        uniqueCategories.push(category.category);
      }
    });
    return uniqueCategories;
  };

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        md={12}
        sx={{ textAlign: "center", mt: 4, justifyContent: "center" }}
      >
        <Box sx={{ width: "100%", minWidth: 400, p: 10 }}>
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
              severity="success"
              onClose={() => {
                setAlert(true);
              }}
            >
              Mood added!
            </Alert>
          )}

          {activeStep === steps.length ? (
            <>
              {/* //if description, category and rating are not empty, then show all steps completed */}
              {newDescriptionText.length > 0 &&
              categoryText.length > 0 &&
              clicked != null ? (
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you can submit your mood!
                </Typography>
              ) : (
                <Typography sx={{ mt: 2, mb: 1 }}>
                  You're missing some information!
                  {/* //get the missing information from the user */}
                  {newDescriptionText.length === 0 && (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Please add a{" "}
                      <a
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        onClick={() => setActiveStep(0)}
                      >
                        description
                      </a>
                    </Typography>
                  )}
                  {categoryText.length === 0 && (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Please add a{" "}
                      <a
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        onClick={() => setActiveStep(1)}
                      >
                        category
                      </a>
                    </Typography>
                  )}
                  {clicked === null && (
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Please add a{" "}
                      <a
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        onClick={() => setActiveStep(2)}
                      >
                        rating
                      </a>
                    </Typography>
                  )}
                </Typography>
              )}

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
                <Button
                  onClick={handleReset}
                  sx={{
                    ml: 1,
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "red" },
                  }}
                  variant="contained"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{
                    ml: 1,
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "red" },
                  }}
                  variant="contained"
                >
                  Back
                </Button>
                {newDescriptionText.length > 0 &&
                  categoryText.length > 0 &&
                  clicked !== null && (
                    <Button
                      onClick={handleAddMood}
                      sx={{
                        ml: 1,
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": { backgroundColor: "green" },
                      }}
                      variant="contained"
                    >
                      {loading ? "Submit" : <CircularProgress size={24} />}
                    </Button>
                  )}
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
                      multiline
                      rows={6}
                      onChange={(e) => setNewDescriptionText(e.target.value)}
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "white",
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
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
                      id="category"
                      value={categoryText}
                      label="Describe your mood..."
                      multiline
                      rows={3}
                      sx={{
                        justifyContent: "center",
                        input: { color: "white" },
                        label: { color: "white" },
                        textAlign: "center",
                        mb: 4,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "white",
                          },
                          "&:hover fieldset": {
                            borderColor: "white",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "white",
                        },
                        "& .MuiInputLabel-root": {
                          color: "white",
                        },
                      }}
                      onChange={(e) => setCategoryText(e.target.value)}
                    />

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={12}>
                        {getUniqueCategories(categories).map((category) => {
                          return (
                            <Button
                              onClick={() => setCategoryText(category)}
                              sx={{ ml: 1 }}
                            >
                              {category}
                            </Button>
                          );
                        })}
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button
                          onClick={() => setCategoryText("")}
                          sx={{
                            ml: 1,
                            backgroundColor: "red",
                            color: "white",
                            ":hover": { backgroundColor: "red" },
                            mt: 2,
                          }}
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      sx={{ mt: 4, justifyContent: "space-evenly" }}
                    ></Grid>
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
                      {/* //change the color of the button if it is clicked */}
                      {clicked === 1 ? (
                        <Button
                          className={getButtonClass(1)}
                          onClick={() => handleClickedButton(1)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          1
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(1)}
                          onClick={() => handleClickedButton(1)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          1
                        </Button>
                      )}

                      {/* <Button
                        className={getButtonClass(1)}
                        onClick={() => handleClickedButton(1)}
                      >
                        1
                      </Button> */}
                      {clicked === 2 ? (
                        <Button
                          className={getButtonClass(1)}
                          onClick={() => handleClickedButton(1)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          2
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(2)}
                          onClick={() => handleClickedButton(2)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          2
                        </Button>
                      )}
                      {clicked === 3 ? (
                        <Button
                          className={getButtonClass(3)}
                          onClick={() => handleClickedButton(3)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          3
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(3)}
                          onClick={() => handleClickedButton(3)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          3
                        </Button>
                      )}
                      {clicked === 4 ? (
                        <Button
                          className={getButtonClass(4)}
                          onClick={() => handleClickedButton(4)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          4
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(4)}
                          onClick={() => handleClickedButton(4)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          4
                        </Button>
                      )}
                      {clicked === 5 ? (
                        <Button
                          className={getButtonClass(5)}
                          onClick={() => handleClickedButton(5)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          5
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(5)}
                          onClick={() => handleClickedButton(5)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          5
                        </Button>
                      )}
                      {clicked === 6 ? (
                        <Button
                          className={getButtonClass(6)}
                          onClick={() => handleClickedButton(6)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          6
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(6)}
                          onClick={() => handleClickedButton(6)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          6
                        </Button>
                      )}
                      {clicked === 7 ? (
                        <Button
                          className={getButtonClass(7)}
                          onClick={() => handleClickedButton(7)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          7
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(7)}
                          onClick={() => handleClickedButton(7)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          7
                        </Button>
                      )}
                      {clicked === 8 ? (
                        <Button
                          className={getButtonClass(8)}
                          onClick={() => handleClickedButton(8)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          8
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(8)}
                          onClick={() => handleClickedButton(8)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          8
                        </Button>
                      )}
                      {clicked === 9 ? (
                        <Button
                          className={getButtonClass(9)}
                          onClick={() => handleClickedButton(9)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          9
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(9)}
                          onClick={() => handleClickedButton(9)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          9
                        </Button>
                      )}
                      {clicked === 10 ? (
                        <Button
                          className={getButtonClass(10)}
                          onClick={() => handleClickedButton(10)}
                          sx={{
                            color: "white",
                            ":hover": { color: "green" },
                            m: 1,
                            backgroundColor: "green",
                          }}
                          variant="contained"
                        >
                          10
                        </Button>
                      ) : (
                        <Button
                          className={getButtonClass(10)}
                          onClick={() => handleClickedButton(10)}
                          sx={{
                            color: "white",
                            ":hover": { color: "white" },
                            m: 1,
                          }}
                        >
                          10
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{
                  mt: 2,
                  mb: 2,
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      onClick={handleBack}
                      sx={{
                        ml: 1,
                        backgroundColor: "red",
                        color: "white",
                        ":hover": { backgroundColor: "red" },
                      }}
                      variant="contained"
                    >
                      Back
                    </Button>
                  )}
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button
                    onClick={handleNext}
                    sx={{
                      ml: 1,
                      backgroundColor: "green",
                      ":hover": { backgroundColor: "green" },
                    }}
                    variant="contained"
                  >
                    {activeStep === steps.length - 1 ? "See resume" : "Next"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
