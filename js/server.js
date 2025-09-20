const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// In-memory database (for prototype)
let users = [];

// Register route
app.post("/api/register", (req, res) => {
  const { fullName, email, password, role, phone } = req.body;
  // Check if user exists
  if(users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ fullName, email, password, role, phone });
  res.json({ message: "Registration successful!" });
});

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if(!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful!", role: user.role });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
