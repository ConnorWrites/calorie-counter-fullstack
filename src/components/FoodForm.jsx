import { useState } from "react";

function FoodForm({ onAddFood }) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !calories) return;

    onAddFood({
      id: Date.now(),
      name: name.trim(),
      calories
    });

    setName("");
    setCalories("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Food name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={e => setCalories(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default FoodForm;