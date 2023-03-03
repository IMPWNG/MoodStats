import React from "react";

export default function ListsMood({ mood, onDelete }) {

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
          {mood.rating == 1 && (
            <span className="text-red-500"> {mood.description} 😡</span>
          )}
          {mood.rating == 2 && (
            <span className="text-red-500"> {mood.description} 😡</span>
          )}
          {mood.rating == 3 && (
            <span className="text-red-500"> {mood.description} 😟</span>
          )}
          {mood.rating == 4 && (
            <span className="text-orange-500"> {mood.description} 😐</span>
          )}
          {mood.rating == 5 && (
            <span className="text-orange-500"> {mood.description} 😐</span>
          )}
          {mood.rating == 6 && (
            <span className="text-yellow-500"> {mood.description} 🙂</span>
          )}
          {mood.rating == 7 && (
            <span className="text-yellow-500"> {mood.description} 😃</span>
          )}
          {mood.rating == 8 && (
            <span className="text-green-500"> {mood.description} 🥰</span>
          )}
          {mood.rating == 9 && (
            <span className="text-green-500"> {mood.description} 🥰</span>
          )}
          {mood.rating == 10 && (
            <span className="text-green-500"> {mood.description} 🥰</span>
          )}
        </h2>
        <span className="mr-2 text-black dark:text-gray-400">
          Rating: {mood.rating}/10
        </span>
        <span className="mr-2 text-black dark:text-gray-400">
          Created: {formatDateTime(mood.created_at)}
        </span>
        <br />
        <span className="mr-2 text-black dark:text-gray-400">
          Category: {mood.category}
        </span>
      </div>
    </li>
  );
}
