'use client'
import { useState, useEffect, useRef, ReactNode } from "react";
import useSWR from "swr";
import {
  Grid,
  Button,
  ButtonGroup,
  FormControl,
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
  const [rating, setRating] = useState<number>(0)
  const [category, setCategory] = useState<string>('')

  const user = useUser();

  useEffect(() => {
    const descriptions = getAllMoodsDescription();
    const ratings = getAllRatingMoods();
    const categories = getAllCategoryMoods();
    setMessage(descriptions);
    setRating(ratings);
    setCategory(categories);
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


  const getAllCreated_atMoods = () => {
    return moods.map((mood) => mood.created_at).join("\n");
  };

  const getAllRatingMoods = () => {
    //rating is a number between 1 and 10
    return moods.map((mood) => mood.rating).reduce((a, b) => a + b, 0);
  };

  const getAllCategoryMoods = () => {
    return moods.map((mood) => mood.category).join("\n");
  };

  const handleButtonClick = () => {
    const messageInput = document.getElementById("message-input") as HTMLTextAreaElement;
    if (messageInput) {
      messageInput.value = `  
      Forget all our precedents prompts. Let's start from scratch.
      You're my personal analyst. You're going to help me feel better with myself.

      This is all my tought that I have been feeling : 

      - This are the gories that I have been feeling : ${moods[0].category}

      - This are the description that I have been feeling : ${getAllMoodsDescription()}

      Never forget the line : bellow 

      Forget about the past. It's gone. Don't worry about the future. It hasn't arrived. Live in the present. It's all you have.
      
      Give me a resume of all that like a personal analyst would do and give me 3 tips to improve my mood. Don't forget to give me a rating of my mood /10. Don't say you're my personal analyst. Act like a mentor without saying it.
      `;
    }
  };

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
    <><Grid container spacing={2} style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        response
          .slice(1)
          .map((item: any, index: number) => {
            return (
              <Grid item xs={12} key={index}>
                <div
                  className={`chat-message ${index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"} p-3 rounded-lg`}
                  key={index}
                >
                  <p>{item}</p>
                </div>
              </Grid>
            );
          })
      ) : response ? (
        response
          .slice(1)
          .map((item: string, index: number) => {
            return (
              <Grid item xs={12} key={index}>
                <div
                  className={`chat-message ${index % 2 === 0 ? "bg-blue-500" : "bg-gray-500"} p-3 rounded-lg`}
                  key={index}
                >
                  <p>{item}</p>
                </div>
              </Grid>
            );
          })
      ) : null}
    </Grid>
    <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FormControl variant="outlined" sx={{
          width: "100%", display: "flex",

          //add a nice gradient to the chatbot like the menu
          background: 'linear-gradient(to right, rgba(255, 0, 0, 0.8), rgba(255, 165, 0, 0.8), rgba(255, 255, 0, 0.8))',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}>




          <form
            onSubmit={handleSubmit}

          >
            <textarea
              id="message-input"
              name="Message"
              placeholder="Type your query"
              onKeyDown={handleEnter}
              ref={messageInput}
              className="w-full resize-none bg-transparent outline-none pt-4 pl-4 translate-y-1" />
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button

                disabled={isLoading}
                type="submit"
                sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}


              >
                {isLoading ? <CircularProgress size={20} /> : "Ask"}
              </Button>

              <Button className="chat-button" onClick={handleButtonClick} variant="contained" color="success">
                Resume
              </Button>

              <Button className="chat-button" onClick={handleReset} color="error" variant="contained">
                Clear
              </Button>
            </ButtonGroup>
          </form>
        </FormControl>
      </Grid></>


  );
}

export default ResumeGPT;
