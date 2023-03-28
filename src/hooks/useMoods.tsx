import { Mood } from "@/types/moodTypes";
import { useState, useEffect } from "react";

export const useMoods = () => {
    const [moods, setMoods] = useState<Mood[]>([]);

    useEffect(() => {
        async function getMoods() {
            try {
                const response = await fetch("/api/mood");
                const { data: moods } = await response.json();
                setMoods(moods as Mood[]);
            }
            catch (error) {
                console.error(error);
            }
        }
        getMoods();
    }, [])
    return moods;
}




