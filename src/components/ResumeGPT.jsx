import { set } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import {
  Grid,
  Typography,
  Button,
  ButtonGroup,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";

export default function ResumeGPT() {
  const messageInput = useRef(null);
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [resumeDescription, setResumeDescription] = useState("");
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchAndSetDescriptions();
  }, []);

  const handleEnter = (e) => {
    if (e.key === "Enter" && isLoading === false) {
      e.preventDefault();
      setIsLoading(true);
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = messageInput.current?.value;
    if (message !== undefined) {
      const initialResponse = [...response, message];
      setResponse(initialResponse);
      messageInput.current.value = "";
    }

    if (!message) {
      return;
    }

    const apiResponse = await (
      await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          currentModel,
        }),
      })
    ).json();

    const bot = apiResponse ? apiResponse.bot : null;

    const totalResponse = [...response, message, bot];
    setResponse(totalResponse);
    localStorage.setItem("response", JSON.stringify(totalResponse));
    setIsLoading(false);
  };

  const handleReset = () => {
    const result = "response";
    localStorage.removeItem(result);
    setResponse([]);
  };

  useSWR("fetchingResponse", async () => {
    const storedResponse = localStorage.getItem("response");
    if (storedResponse) {
      setResponse(JSON.parse(storedResponse));
    }
  });

  const fetchModel = async () => {
    // const models = setModels((await (await fetch('/api/models')).json()).data);
    const models = await (await fetch("/api/models")).json();
    setModels(models.data);
    // setCurrentModel(models.data[6].id);
    const modelIndex = models.data.findIndex(
      (model) => model.id === "text-davinci-003"
    );
    setCurrentModel(models.data[modelIndex].id);
    return models;
  };

  useSWR("fetchingModels", fetchModel);

  const createUniqueString = (data) => {
    let result = "";
    data.forEach((item) => {
      result += item.description;
    });
    return result;
  };

  const fetchAndSetDescriptions = async () => {
    try {
      const response = await fetch("/api/description");
      const data = await response.json();
      console.log("data", data);
      const uniqueDescriptionString = createUniqueString(data);
      setResumeDescription(uniqueDescriptionString);
      console.log("resumeOfAllDescription", uniqueDescriptionString);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching descriptions: ", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleShowResumeDescription = () => {
    fetchAndSetDescriptions();
  };

  const handleModelChange = (e) => {
    setCurrentModel(e.target.value);
  };

  // const handleResumeMood = () => {
  //   const description = ""; // replace with the actual resume description
  //   const totalResponse = [...data, description];
  //   setResponse(totalResponse);
  //   localStorage.setItem("response", JSON.stringify(totalResponse));
  //   console.log("response", data);
  // };

  return (
    <Grid item xs={12} md={12} sx={{ mt: -2 }}>
      <ButtonGroup
        variant="contained"
        aria-label="contained primary button group"
        sx={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Button
          onClick={handleShowResumeDescription}
          sx={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Resume your daily mood
        </Button>
        <Button onClick={handleShowResumeDescription}>
          Resume your weekly mood
        </Button>
        <Button onClick={handleShowResumeDescription}>
          Resume your monthly mood
        </Button>
        <Button
          onClick={handleReset}
          color="error"
          sx={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Clear history
        </Button>
      </ButtonGroup>

      {/* <div>
        <dialog
          className="dialog"
          open={openDialog}
          onClick={handleCloseDialog}
        >
          <div className="dialog__overlay"></div>
          <div className="dialog__content">
            <div className="dialog__body">
              <p>{resumeDescription}</p>
            </div>
            <div className="dialog__footer">
              <button
                onClick={handleCloseDialog}
                className="border-red-500 border-2 rounded-md p-2 text-white mb-25"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      </div> */}

      <Grid item xs={12} md={12}>
        {isLoading ? (
          response.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"
                } p-3 rounded-lg`}
              >
                <p>{item}</p>
              </div>
            );
          })
        ) : response ? (
          response.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"
                } p-3 rounded-lg`}
              >
                <p>{item}</p>
              </div>
            );
          })
        ) : (
          <div className="bg-gray-500 p-3 rounded-lg">
            <p>Hi, I'm your personal assistant. How can I help you?</p>
          </div>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        sx={{ justifyContent: "center", textAlign: "center", height: 470 }}
      >
     ...
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          justifyContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",

            height: 50,
            justifyContent: "center",
            textAlign: "center",
            borderRadius: 2,
            position: "relative",
            bottom: 0,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, width: "100%" }}
            placeholder="Type your query"
            inputProps={{ "aria-label": "search .." }}
            onKeyDown={handleEnter}
          />

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <Button
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Ask"}  
          </Button>

          <FormControl fullWidth sx={{ m: 1, ml: 4, maxWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Model dIA</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Model dIA"
              value={currentModel}
              onChange={handleModelChange}
            >
              {models.map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Grid>
    </Grid>
  );
}
