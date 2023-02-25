import { set } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";

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
    <div className="flex justify-center">
      <button
        onClick={handleReset}
        className="bg-red-500 rounded-md p-2 text-white mb-25"
      >
        Clear history
      </button>
      <button
        className="bg-green-500 rounded-md p-2 text-white mb-25"
        onClick={handleShowResumeDescription}
      >
        Resume your Mood
      </button>
      {/* //show the resumer inside a dialog  */}
      <div>
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
      </div>


   




      {/* <select
        value={currentModel}
        onChange={handleModelChange}
        className="w-72 fixed top-5 left-5 outline-none border-none p-4 rounded-md bg-white text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-900"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.id}
          </option>
        ))}
      </select> */}

      <div className="w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl">
        {isLoading
          ? response.map((item, index) => {
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
          : response
          ? response.map((item, index) => {
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
          : null}
      </div>
      <form className="fixed bottom-0 w-full md:max-w-3xl bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] mb-4">
        <textarea
          name="Message"
          placeholder="Type your query"
          ref={messageInput}
          onKeyDown={handleEnter}
          className="w-full resize-none bg-transparent outline-none pt-4 pl-4 translate-y-1"
        />
        <button
          disabled={isLoading}
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 w-full p-4 text-white"
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
}
