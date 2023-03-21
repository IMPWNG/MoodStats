'use client'
import { useState, useEffect, useRef, ReactNode } from "react";
import useSWR from "swr";
import {
  Grid,
  Button,
  ButtonGroup,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { NextComponentType } from "next";
import { Mood } from "@/types/moodTypes";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

interface ModelType {
  object: 'engine'
  id: string
  ready: boolean
  owner: string
  permissions: null
  created: string
}

const ResumeGPT: NextComponentType = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const messageInput = useRef<HTMLTextAreaElement | null>(null)
  const [response, setResponse] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [models, setModels] = useState<ModelType[]>([])
  const [currentModel, setCurrentModel] = useState<string>('gpt-3.5-turbo')
  const [message, setMessage] = useState<string>('')

  const user = useUser();

  useEffect(() => {
    const descriptions = getAllMoodsDescription();
    setMessage(descriptions);
    async function getMoods() {
      try {
        const res = await fetch("/api/mood");
        const { data } = await res.json();
        setMoods(data);
      } catch (error) {
        console.error(error);
      }
    }
    getMoods();
  }, [user, moods]);

  const getAllMoodsDescription = () => {
    return moods.map((mood) => mood.description).join("\n");
  };

  const handleButtonClick = () => {
    const messageInput = document.getElementById("message-input") as HTMLTextAreaElement;
    if (messageInput) {
      messageInput.value = `Give me a resume of my thought in 10lines. Try to categorise each tought and give me a final summary: ${getAllMoodsDescription()} in 10lines`;
     }
    
  };




  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  // const handleShowResumeDescription = () => {
  //   const description = resumeDescription; // replace with the actual resume description
  //   const totalResponse = [...data, description];
  //   setResponse(totalResponse);
  //   localStorage.setItem("response", JSON.stringify(totalResponse));
  //   console.log("response", data);
  // };

  // const handleResumeMood = () => {
  //   const description = ""; // replace with the actual resume description
  //   const totalResponse = [...data, description];
  //   setResponse(totalResponse);
  //   localStorage.setItem("response", JSON.stringify(totalResponse));
  //   console.log("response", data);
  // };



  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.FormEvent<HTMLFormElement>
  ) => {
    if (e.key === 'Enter' && isLoading === false) {
      e.preventDefault()
      setIsLoading(true)
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const message = messageInput.current?.value
    if (message !== undefined) {
      setResponse((prev) => [...prev, message])
      messageInput.current!.value = ''
    }

    if (!message) {
      return
    }

    const response = await fetch('/api/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        currentModel,
      }),
    })
    console.log('Edge function returned.')

    console.log(response)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    setResponse((prev) => [...prev, message])

    let currentResponse: string[] = []
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      currentResponse = [...currentResponse, chunkValue]
      setResponse((prev) => [...prev.slice(0, -1), currentResponse.join('')])
    }
    setIsLoading(false)
  }

  const handleReset = () => {
    localStorage.removeItem('response')
    setResponse([])
  }

  const fetcher = async () => {
    const models = await (await fetch('/api/models')).json()
    setModels(models.data)
    const modelIndex = models.data.findIndex(
      (model: ModelType) => model.id === 'gpt-3.5-turbo'
    )
    setCurrentModel(models.data[modelIndex].id)
    return models
  }

  useSWR('fetchingModels', fetcher)

  const handleModelChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setCurrentModel(event.target.value);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column-reverse" }}>

      
      <Grid container spacing={2} style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
        {isLoading ? (
          response.map((item: any, index: number) => {
            return (
              <Grid item xs={12} key={index}>
              <div
                className={`chat-message ${index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"
                  } p-3 rounded-lg`}
                key={index}
              >
                <p>{item}</p>
              </div>
              </Grid>
            );
          })
        ) : response ? (
          response.map((item: string, index: number) => {
            return (
              <Grid item xs={12} key={index}>
              <div
                className={`chat-message ${index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"
                  } p-3 rounded-lg`}
                key={index}
              >
                <p>{item}</p>
              </div>
              </Grid>
            );
          })
        ) : null}
      </Grid>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 w-full md:max-w-3xl bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] mb-4"
        >
          <textarea
            id="message-input"
            name="Message"
            placeholder="Type your query"
            onKeyDown={handleEnter}
            ref={messageInput}
            className="w-full resize-none bg-transparent outline-none pt-4 pl-4 translate-y-1"
          />
          <Button
            className="chat-button"
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {isLoading ? <CircularProgress size={20} /> : "Ask"}
          </Button>

          <Button className="chat-button" onClick={handleButtonClick} variant="contained" color="success">
            Resume
          </Button>

          <Button className="chat-button" onClick={handleReset} color="error" variant="contained">
            Clear
          </Button>
        </form>
      </div>
    </div>

  );
}

export default ResumeGPT;
