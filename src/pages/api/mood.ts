import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, PostgrestError } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Data = {
  id: number;
  description: string;
  category: string;
  user_id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Data[]; error?: Error | PostgrestError }>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabaseClient
          .from("stats")
          .select("*")
          .select("category")
          .order("id", { ascending: false });
        if (error) {
          throw new Error(error.message);
        }
        res.status(200).json({ data: data as Data[] });
      } catch (error) {
        res.status(400).json({ data: [], error: error as Error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
