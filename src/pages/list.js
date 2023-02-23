import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect } from "react";
import StatsMood from "../components/StatsMood";

export default function ListPage() {
  const [moods, setMoods] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    if (moods.length) {
      const totalRating = moods.reduce((acc, cur) => acc + cur.rating, 0);
      setAverageRating(totalRating / moods.length);
    }
  }, [moods]);

  const fetchMoods = async () => {
    const response = await fetch("/api/mood");
    const data = await response.json();
    setMoods(data);
  };

const deleteMood = async (id) => {
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
    setMoods(moods.filter((mood) => mood.id !== id));
    response.status === 200 && console.log("Mood deleted successfully");
  } catch (error) {
    console.log("Error deleting mood:", error);
  }
};

  
  const getMostUsedCategory = (moods) => {
    const categoryCounts = {};
    moods.forEach((mood) => {
      const category = mood.category;
      if (category in categoryCounts) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedCategories.length > 0) {
      return sortedCategories[0][0];
    } else {
      return null;
    }
  };

  const getLessUsedCategory = (moods) => {
    const categoryCounts = {};
    moods.forEach((mood) => {
      const category = mood.category;
      if (category in categoryCounts) {
        categoryCounts[category] += 1;
      } else {
        categoryCounts[category] = 1;
      }
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      (a, b) => a[1] - b[1]
    );

    if (sortedCategories.length > 0) {
      return sortedCategories[0][0];
    } else {
      return null;
    }
  };

  const displayBestRatingsByCategory = (moods) => {
    const categoryRatings = {};

    // loop through each mood
    moods.forEach((mood) => {
      const category = mood.category;
      const rating = mood.rating;

      // if category hasn't been seen yet, add it to the object with this rating
      if (!(category in categoryRatings)) {
        categoryRatings[category] = rating;
      } else {
        // if category has been seen, update the rating if this one is better
        if (rating > categoryRatings[category]) {
          categoryRatings[category] = rating;
        }
      }
    });

    // filter out categories with ratings less than or equal to 5 and display the best rating for each category
    return (
      <>
        {Object.entries(categoryRatings)
          .filter(([rating]) => rating > 7)
          .map(([category, rating]) => (
            <p key={category}>
              Best rating for category '{category}': {rating}
            </p>
          ))}
      </>
    );
  };

  const displayLowRatingsByCategory = (moods) => {
    const categoryRatings = {};

    // loop through each mood
    moods.forEach((mood) => {
      const category = mood.category;
      const rating = mood.rating;

      // if category hasn't been seen yet, add it to the object with this rating
      if (!(category in categoryRatings)) {
        categoryRatings[category] = rating;
      } else {
        // if category has been seen, update the rating if this one is lower
        if (rating < categoryRatings[category]) {
          categoryRatings[category] = rating;
        }
      }
    });

    // loop through the object and display the low rating for each category
    return (
      <>
        {Object.entries(categoryRatings).map(([category, rating]) => {
          if (rating < 3) {
            return (
              <p key={category}>
                Low rating for category '{category}': {rating}
              </p>
            );
          }
          return null;
        })}
      </>
    );
  };

  const getMostUsedEmoji = (moods) => {
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    };

    moods.forEach((mood) => {
      const rating = mood.rating;
      ratingCounts[rating] += 1;
    });

    const sortedRatings = Object.entries(ratingCounts).sort(
      (a, b) => b[1] - a[1]
    );

    let mostUsedRating = sortedRatings[0][0];

    if (mostUsedRating === "1" || mostUsedRating === "2") {
      return "😡";
    } else if (
      mostUsedRating === "3" ||
      mostUsedRating === "4" ||
      mostUsedRating === "5"
    ) {
      return "😟";
    } else if (mostUsedRating === "6" || mostUsedRating === "7") {
      return "🙂";
    } else {
      return "🥰";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Mood Stats</h1>
        <Link href="/">
          {" "}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back
          </button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {getMostUsedCategory(moods)
          ? `Most used category: ${getMostUsedCategory(moods)}`
          : "Loading..."}{" "}
        <br />
        {getLessUsedCategory(moods)
          ? `Less used category: ${getLessUsedCategory(moods)}`
          : "Loading..."}{" "}
        <br />
        {displayBestRatingsByCategory(moods)}
        {displayLowRatingsByCategory(moods)}
        {getMostUsedEmoji(moods)
          ? `Your Mood is moslty: ${getMostUsedEmoji(moods)}`
          : "Loading..."}{" "}
        <br />
        <br />
        {averageRating ? `Average rating: ${averageRating}` : "Loading..."}
        <br />
        <div>
          <StatsMood moods={moods} />
        </div>
        <div>
          {moods.map((mood) => (
            <ListsMood
              key={mood.id}
              mood={mood}
              onDelete={() => deleteMood(mood.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
