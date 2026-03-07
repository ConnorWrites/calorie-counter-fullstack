import { useState, useEffect } from "react";
import FoodForm from "./components/FoodForm";
import FoodList from "./components/FoodList";
import Login from "./components/Login";
import Register from "./components/Register";

const API_URL = "https://calorie-counter-fullstack.onrender.com";

function App() {
  // Load token from localStorage, or null if missing
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [foods, setFoods] = useState([]);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setFoods([]);
    }
  }, [token]);

  // Fetch foods whenever token is available
  useEffect(() => {
    if (!token) return;

    const fetchFoods = async () => {
      try {
        console.log("Using token:", token);
        console.log(`Fetching foods from: ${API_URL}/foods`);
        const res = await fetch(`${API_URL}/foods`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch foods: ${res.status}`);
        const data = await res.json();
        setFoods(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load foods:", error);
        setFoods([]);
      }
    };

    fetchFoods();
  }, [token]);

  const totalCalories = Array.isArray(foods)
    ? foods.reduce((total, food) => total + Number(food.calories), 0)
    : 0;

  // Add food
  const addFood = async (food) => {
    if (!token) return console.error("Cannot add food: no token available");
    try {
      const res = await fetch(`${API_URL}/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(food),
      });
      if (!res.ok) throw new Error(`Failed to add food: ${res.status}`);
      const newFood = await res.json();
      setFoods((prev) => [...prev, newFood]);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete food
  const deleteFood = async (id) => {
    if (!token) return console.error("Cannot delete food: no token available");
    try {
      const res = await fetch(`${API_URL}/foods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to delete food: ${res.status}`);
      await res.json();
      setFoods((prev) => prev.filter((food) => food.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthMode("login");
  };

  // Render login/register if no token
  if (!token) {
    if (authMode === "login") {
      return (
        <Login
          onLogin={(newToken) => {
            console.log("Login successful, token received:", newToken);
            setToken(newToken);
          }}
          onSwitch={() => setAuthMode("register")}
        />
      );
    }
    return (
    <Register 
    onLogin={(newToken) => { 
      console.log("Registration successful, token received:", newToken);
      setToken(newToken);
    }} 
    onSwitch={() => setAuthMode("login")} /> 
  );
  }

  // Main app view
  return (
    <main>
      <h1>Calorie Counter</h1>
      <p>Total Calories: {totalCalories}</p>
      <button onClick={handleLogout}>Logout</button>

      <FoodForm onAddFood={addFood} />
      <FoodList foods={foods} onDelete={deleteFood} />
    </main>
  );
}

export default App;