import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

type RequestData = {
  currentModel: string;
  message: string;
};

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "edge";

export default async function handler(request: Request) {
  const { currentModel, message } = (await request.json()) as RequestData;

  if (!message) {
    return new Response("No message in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `The following is an analyse between a personal analyst and you that need somenone to give me details about your thougts based on the following message: ${message} and the following is the response from the analyst:`,} 
    ],
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
