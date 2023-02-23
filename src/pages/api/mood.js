// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase
          .from("stats")
          .select("*")
          .order("id", { ascending: false });
        if (error) {
          throw new Error(error.message);
        }
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "POST":
      try {
        const { description, category, rating, user_id } = req.body;
        const { data, error } = await supabase
          .from("stats")
          .insert({
            description,
            category,
            rating,
            user_id,
          })
          .single();
        if (error) {
          throw new Error(error.message);
        }
        res.status(201).json(data);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;
      case "DELETE":
        try {
          const { id } = req.body;
          const { error } = await supabase
            .from("stats")
            .delete()
            .eq("id", id);
          if (error) {
            throw new Error(error.message);
          }
          res.status(204).end();
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
        break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
