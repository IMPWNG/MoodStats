import { useState, useEffect } from "react";

export default function AddMood({ user }) {
  const [moods, setMoods] = useState([]);
  const [newDescriptionText, setNewDescriptionText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [clicked, setClicked] = useState(null);
  const [categoryText, setCategoryText] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    const response = await fetch("/api/mood");
    const data = await response.json();
    setMoods(data);
  };

  const handleAddMood = async () => {
    const description = newDescriptionText.trim();
    const category = categoryText.trim();
    if (description.length === 0) {
      setErrorText("Description cannot be empty");
      return;
    }
    if (category.length === 0) {
      setErrorText("Category cannot be empty");
      return;
    }
    if (!clicked || clicked < 1 || clicked > 10) {
      setErrorText("Please rate your mood");
      return;
    }
    const response = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        rating: clicked,
        user_id: user.id,
        category,
      }),
    });
    const data = await response.json();
    if (data?.error) {
      setErrorText(data.error.message);
      return;
    }
    setNewDescriptionText("");
    setCategoryText("");
    setClicked(null);
    setIsAdded(true);
  };

  const handleClickedButton = (rating) => {
    setClicked(rating);
  };

  const getButtonClass = (rating) => {
    if (clicked === rating) {
      return "btn-black bg-green-500";
    } else {
      return "btn-black";
    }
  };

  //create a function that will show an alet when the user adds a mood
  const showAddedAlert = () => {
    if (isAdded) {
      return (
        <div className="bg-green-500 text-white p-2 rounded">
          <p>Added!</p>
        </div>
      );
    }
    //set a timeout to remove the alert after 3 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  return (
    <>
      <h1 className="mb-12 text-center text-2xl font-bold mt-5">Add Mood</h1>
      <div className="flex gap-2 my-2">
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="What's on your mind ? - Rate your mood"
          value={newDescriptionText}
          onChange={(e) => {
            setErrorText("");
            setNewDescriptionText(e.target.value);
          }}
        />
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="Category"
          value={categoryText}
          onChange={(e) => {
            setErrorText("");
            setCategoryText(e.target.value);
          }}
        />
        <div className="flex flex-col gap-2">
          <button
            className={getButtonClass(1)}
            onClick={() => handleClickedButton(1)}
          >
            1
          </button>
          <button
            className={getButtonClass(2)}
            onClick={() => handleClickedButton(2)}
          >
            2
          </button>
          <button
            className={getButtonClass(3)}
            onClick={() => handleClickedButton(3)}
          >
            3
          </button>
          <button
            className={getButtonClass(4)}
            onClick={() => handleClickedButton(4)}
          >
            4
          </button>
          <button
            className={getButtonClass(5)}
            onClick={() => handleClickedButton(5)}
          >
            5
          </button>
          <button
            className={getButtonClass(6)}
            onClick={() => handleClickedButton(6)}
          >
            6
          </button>
          <button
            className={getButtonClass(7)}
            onClick={() => handleClickedButton(7)}
          >
            7
          </button>
          <button
            className={getButtonClass(8)}
            onClick={() => handleClickedButton(8)}
          >
            8
          </button>
          <button
            className={getButtonClass(9)}
            onClick={() => handleClickedButton(9)}
          >
            9
          </button>
          <button
            className={getButtonClass(10)}
            onClick={() => handleClickedButton(10)}
          >
            10
          </button>
        </div>
        <button className="btn-black" onClick={handleAddMood}>
          Add
        </button>
        {showAddedAlert()}
      </div>
      {!!errorText && <Alert text={errorText} />}
    </>
  );
}

const Alert = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
