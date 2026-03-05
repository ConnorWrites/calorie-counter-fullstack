import { useState, useEffect } from "react";
import FoodForm from "./components/FoodForm";
import FoodList from "./components/FoodList";
import Login from "./components/Login";
import Register from "./components/Register";

const API_URL = "http://localhost:4000";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [foods, setFoods] = useState([]);

  // Save token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setFoods([]);
    }
  }, [token]);

  // Fetch foods when token changes
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/foods`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setFoods(Array.isArray(data) ? data : []))
      .catch(error => {
        console.error("Failed to load foods:", error);
        setFoods([]);
      });
  }, [token]);

  const totalCalories = Array.isArray(foods)
    ? foods.reduce((total, food) => total + Number(food.calories), 0)
    : 0;

  // Add food
  function addFood(food) {
    fetch(`${API_URL}/foods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(food)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add food");
        return res.json();
      })
      .then(newFood => setFoods(prev => [...prev, newFood]))
      .catch(error => console.error(error));
  }

  // Delete food
  function deleteFood(id) {
    fetch(`${API_URL}/foods/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete food");
        return res.json();
      })
      .then(() => setFoods(prev => prev.filter(food => food.id !== id)))
      .catch(error => console.error(error));
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuthMode("login");
  }

  // Show login/register if no token
  if (!token) {
    if (authMode === "login") {
      return <Login onLogin={setToken} onSwitch={() => setAuthMode("register")} />;
    }
    return <Register onSwitch={() => setAuthMode("login")} />;
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