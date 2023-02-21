import { supabase } from "../lib/initSupabase";
import Link from "next/link";
import ListsMood from "../components/ListsMood";
import { useState, useEffect } from "react";
import StatsMood from "../components/StatsMood";

export default function ListPage() {
  const [todos, setTodos] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

    useEffect(() => {
      if (todos.length) {
        const totalRating = todos.reduce((acc, cur) => acc + cur.rating, 0);
        setAverageRating(totalRating / todos.length);
      }
    }, [todos]);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", true);
    if (error) console.log("error", error);
    else setTodos(todos);
  };

  const deleteTodo = async (id) => {
    try {
      await supabase.from("todos").delete().eq("id", id);
      setTodos(todos.filter((x) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };
const getMostUsedCategory = (todos) => {
  const categoryCounts = {};
  todos.forEach((todo) => {
    const category = todo.category;
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

const getLessUsedCategory = (todos) => {
  const categoryCounts = {};
  todos.forEach((todo) => {
    const category = todo.category;
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

const displayBestRatingsByCategory = (todos) => {
  const categoryRatings = {};

  // loop through each todo
  todos.forEach((todo) => {
    const category = todo.category;
    const rating = todo.rating;

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
    <div>
      {Object.entries(categoryRatings)
        .filter(([category, rating]) => rating > 7)
        .map(([category, rating]) => (
          <p key={category}>
            Best rating for category '{category}': {rating}
          </p>
        ))}
    </div>
  );
};


const displayLowRatingsByCategory = (todos) => {
  const categoryRatings = {};

  // loop through each todo
  todos.forEach((todo) => {
    const category = todo.category;
    const rating = todo.rating;

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
    <div>
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
    </div>
  );
};

const getMostUsedEmoji = (todos) => {
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

  todos.forEach((todo) => {
    const rating = todo.rating;
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
    <div className="w-full h-full bg-gray-100">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Mood Stats</h1>
        <Link href="/">
          <a className="btn-black">Back</a>
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {getMostUsedCategory(todos)
          ? `Most used category: ${getMostUsedCategory(todos)}`
          : "Loading..."}{" "}
        <br />
        {getLessUsedCategory(todos)
          ? `Less used category: ${getLessUsedCategory(todos)}`
          : "Loading..."}{" "}
        <br />
        {displayBestRatingsByCategory(todos)}
        {displayLowRatingsByCategory(todos)}
        {getMostUsedEmoji(todos)
          ? `Your Mood is moslty: ${getMostUsedEmoji(todos)}`
          : "Loading..."}{" "}
        <br />
        <br />
        {averageRating ? `Average rating: ${averageRating}` : "Loading..."}
        <br />
        <div>
          <StatsMood todos={todos} />
        </div>
        
        {todos.map((todo) => (
          <ListsMood
            key={todo.id}
            todo={todo}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>
    </div>
  );
}
