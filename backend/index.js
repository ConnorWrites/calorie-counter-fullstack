import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import db from "./database.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const __dirname = path.resolve();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// JWT Middleware
// -----------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// -----------------------------
// Register
// -----------------------------
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    const info = stmt.run(email, hashedPassword);
    res.json({ message: "User registered successfully", userId: info.lastInsertRowid });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// -----------------------------
// Login
// -----------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// -----------------------------
// Foods API
// -----------------------------
app.get("/foods", authenticateToken, (req, res) => {
  const stmt = db.prepare("SELECT * FROM foods WHERE userId = ?");
  const userFoods = stmt.all(req.user.userId);
  res.json(userFoods);
});

app.post("/foods", authenticateToken, (req, res) => {
  const { name, calories } = req.body;
  if (!name || !calories) return res.status(400).json({ error: "Name and calories are required" });

  const stmt = db.prepare("INSERT INTO foods (userId, name, calories) VALUES (?, ?, ?)");
  const info = stmt.run(req.user.userId, name, calories);

  const food = { id: info.lastInsertRowid, userId: req.user.userId, name, calories };
  res.json(food);
});

app.delete("/foods/:id", authenticateToken, (req, res) => {
  const stmt = db.prepare("DELETE FROM foods WHERE id = ? AND userId = ?");
  const info = stmt.run(req.params.id, req.user.userId);

  if (info.changes === 0) return res.status(404).json({ error: "Food not found or unauthorized" });

  res.json({ success: true });
});

// -----------------------------
// Serve React frontend
// -----------------------------
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// -----------------------------
// Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});