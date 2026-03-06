import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://calorie-counter-fullstack.onrender.com";

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
if (data.token) {
      onLogin(data.token); // pass token to App.jsx
      console.log("Login successful, token received:", data.token);
    } else {
      throw new Error("No token received");
    }
   } catch (err) {
      setError(err.message);
     console.error("Login error:", err);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={onSwitch}>Register</button>
      </p>
    </div>
  );
}