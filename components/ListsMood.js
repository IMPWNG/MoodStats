import { useState, useEffect } from "react";
import { supabase } from "../lib/initSupabase";

export default function ListsMood({ todo, onDelete, user }) {
  const [isCompleted, setIsCompleted] = useState(todo.is_complete);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", true);
    if (error) console.log("error", error);
    else setTodos(todos);
  };
  

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ is_complete: !isCompleted })
        .eq("id", todo.id)
        .single();
      if (error) {
        throw new Error(error);
      }
      setIsCompleted(data.is_complete);
    } catch (error) {
      console.log("error", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  };


  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      className="flex items-center justify-between px-4 py-4 sm:px-6"
    >
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <button
          className="float-right text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {todo.rating == 1 && (
            <span className="text-red-500"> {todo.task} 😡</span>
          )}
          {todo.rating == 2 && (
            <span className="text-yellow-500"> {todo.task} 😡</span>
          )}
          {todo.rating == 3 && (
            <span className="text-yellow-500"> {todo.task} 😟</span>
          )}
          {todo.rating == 4 && (
            <span className="text-green-500"> {todo.task} 🤯</span>
          )}
          {todo.rating == 5 && (
            <span className="text-green-500"> {todo.task} 😐</span>
          )}
          {todo.rating == 6 && (
            <span className="text-green-500"> {todo.task} 🙂</span>
          )}
          {todo.rating == 7 && (
            <span className="text-green-500"> {todo.task} 😃</span>
          )}
          {todo.rating == 8 && (
            <span className="text-green-500"> {todo.task} 🥰</span>
          )}
          {todo.rating == 9 && (
            <span className="text-green-500"> {todo.task} 🥰</span>
          )}
          {todo.rating == 10 && (
            <span className="text-green-500"> {todo.task} 🥰</span>
          )}
        </h2>
        <span className="mr-2">Rating: {todo.rating}/10</span>
        <span className="mr-2">
          Created: {formatDateTime(todo.inserted_at)}
        </span>
        <br />
        <span className="mr-2">
          Category: {todo.category}
        </span>

      </div>
    </li>
  );
};
