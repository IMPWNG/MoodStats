import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  try {
    const { currentModel, message } = req.body;

    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${message}`,
      temperature: 0.2,
      max_tokens: 30000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).json({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error || "Something went wrong" });
  }
}
