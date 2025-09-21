const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const port = 3000;

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// ---------------------------
// MySQL connection
// ---------------------------
const db = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "root", // your MySQL password
  database: "sih"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ---------------------------
// Serve homepage
// ---------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------------------
// Register route
// ---------------------------
// ---------------------------
// Register route
// ---------------------------
app.post("/api/register", (req, res) => {
  console.log("Received registration request:", req.body);
  let { fullName, email, password, phone, aadhar, role, farmLocation, farmSize, shopName, address, department } = req.body;

  // Map Government Official to 'Gov' for ENUM
  if (role === "Government Official") role = "Gov";

  // Validate required fields
  if (!fullName || !email || !password || !role || !aadhar) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Insert into users table
  const queryUser = `
    INSERT INTO users (name, email, phone, aadhar, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(queryUser, [fullName, email, phone, aadhar, password, role], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ success: false, message: "Email already registered" });
      }
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    // Insert into role-specific table including extra fields
    let roleQuery = "";
    let roleValues = [];

    switch (role) {
      case "Farmer":
        roleQuery = `
          INSERT INTO farmer (name, phone, email, aadhar, farm_location, farm_size)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        roleValues = [fullName, phone, email, aadhar, farmLocation, farmSize];
        break;

      case "Merchant":
        roleQuery = `
          INSERT INTO merchant (name, phone, email, aadhar, shop_name)
          VALUES (?, ?, ?, ?, ?)
        `;
        roleValues = [fullName, phone, email, aadhar, shopName];
        break;

      case "Buyer":
        roleQuery = `
          INSERT INTO buyer (name, phone, email, aadhar, address)
          VALUES (?, ?, ?, ?, ?)
        `;
        roleValues = [fullName, phone, email, aadhar, address];
        break;

      case "Gov":
        roleQuery = `
          INSERT INTO gov_official (name, phone, email, aadhar, department)
          VALUES (?, ?, ?, ?, ?)
        `;
        roleValues = [fullName, phone, email, aadhar, department];
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid role" });
    }

    db.query(roleQuery, roleValues, (err2) => {
      if (err2) {
        console.error("Role-specific insert error:", err2);
        return res.status(500).json({ success: false, message: "Error saving role-specific data" });
      }

      res.json({ success: true, message: "Registration successful! Please login." });
    });
  });
});

// ---------------------------
// Login route
// ---------------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Query the users table
  const query = `SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1`;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = results[0];

    // Return only necessary info
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});


// ---------------------------
// Start server
// ---------------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
