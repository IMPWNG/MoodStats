import { Mood } from "@/types/moodTypes";
import { useState, useEffect } from "react";

export const useDeleteMood = (id: number) => {
    const [moods, setMoods] = useState<Mood[]>([]);

    useEffect(() => {
        async function deleteMood(id: number) {
            try {
                const response = await fetch("/api/mood", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id,
                    }),
                });
                const { data: moods } = await response.json();
                setMoods(moods as Mood[]);
            }
            catch (error) {
                console.error(error);
            }
        }
        deleteMood(id);
    }, [id])
    return moods;
}


