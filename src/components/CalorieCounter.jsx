import React, { useState, useEffect } from "react";
import Loader from './utils/Loader';

const CalorieCounter = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dailyData, setDailyData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data from local storage on initial load
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("calorieData")) || {};
    setDailyData(storedData);
  }, []);

  const fetchNutritionData = async () => {
    setError("");
    setResults([]);

    if (!query.trim()) {
      setError("Please enter a food item.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-id": "40292761",
            "x-app-key": "e8900660d5e29aec6b7cbaf73df6910d",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(data.foods || []);
      saveToDailyData(data.foods);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const saveToDailyData = (foods) => {
    const today = new Date().toLocaleDateString(); // e.g., "12/26/2024"
    const updatedData = { ...dailyData };

    if (!updatedData[today]) {
      updatedData[today] = [];
    }

    foods.forEach((food) => {
      updatedData[today].push({
        name: food.food_name,
        calories: food.nf_calories,
      });
    });

    setDailyData(updatedData);
    localStorage.setItem("calorieData", JSON.stringify(updatedData));
  };

  const deleteItem = (date, index) => {
    const updatedData = { ...dailyData };
    updatedData[date].splice(index, 1); // Remove the item
    if (updatedData[date].length === 0) {
      delete updatedData[date]; // Remove the date if no items remain
    }
    setDailyData(updatedData);
    localStorage.setItem("calorieData", JSON.stringify(updatedData));
  };

  const editItem = (date, index, updatedItem) => {
    const updatedData = { ...dailyData };
    updatedData[date][index] = updatedItem; // Update the item
    setDailyData(updatedData);
    localStorage.setItem("calorieData", JSON.stringify(updatedData));
  };

  const calculateTotalCalories = (items) => {
    return items.reduce((total, item) => total + item.calories, 0);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Calorie Counter</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter a food item (e.g., apple, pasta)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {!loading ? (
        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={fetchNutritionData}
        >
          Get Nutrition Info
        </button>
      ) : (
        <Loader />
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        {Object.keys(dailyData).map((date) => {
          const totalCalories = calculateTotalCalories(dailyData[date]);
          return (
            <div
              key={date}
              className="mb-6 p-4 border border-gray-300 rounded bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{date}</h2>
                <p className="text-blue-500 font-bold">
                  Total Calories: {totalCalories} kcal
                </p>
              </div>
              <ul>
                {dailyData[date].map((item, index) => (
                  <li
                    key={index}
                    className="mb-2 p-2 border border-gray-200 rounded flex justify-between items-center hover:scale-105 duration-300"
                  >
                    <div>
                      <p>
                        <strong>Food:</strong> {item.name}
                      </p>
                      <p>
                        <strong>Calories:</strong> {item.calories} kcal
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                        onClick={() => {
                          const newName = prompt("Edit food name:", item.name);
                          const newCalories = prompt(
                            "Edit calories:",
                            item.calories
                          );
                          if (newName && newCalories) {
                            editItem(date, index, {
                              name: newName,
                              calories: parseFloat(newCalories),
                            });
                          }
                        }}
                      >
                        Edit
                      </button> */}
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteItem(date, index)}
                      >
                        remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalorieCounter;
