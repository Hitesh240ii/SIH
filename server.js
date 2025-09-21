// server.js
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const app = express();
const port = 3000;

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ---------------------------
// MySQL connection pool
// ---------------------------
const db = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "root", // your MySQL password
  database: "sih",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(() => console.log("✅ Connected to MySQL database"))
  .catch(err => console.error("❌ Error connecting to MySQL:", err));

// ---------------------------
// Serve homepage
// ---------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------------------
// Register route
// ---------------------------
app.post("/api/register", async (req, res) => {
  let { fullName, email, password, phone, aadhar, role, farmLocation, farmSize, shopName, address, department } = req.body;

  if (!fullName || !email || !password || !role || !aadhar) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (role === "Government Official") role = "Gov";

  const queryUser = `
    INSERT INTO users (name, email, phone, aadhar, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(queryUser, [fullName, email, phone, aadhar, password, role]);

    // Role-specific inserts
    let roleQuery = "";
    let roleValues = [];

    switch (role) {
      case "Farmer":
        roleQuery = `INSERT INTO farmer (name, phone, email, aadhar, farm_location, farm_size) VALUES (?, ?, ?, ?, ?, ?)`;
        roleValues = [fullName, phone, email, aadhar, farmLocation, farmSize];
        break;
      case "Merchant":
        roleQuery = `INSERT INTO merchant (name, phone, email, aadhar, shop_name) VALUES (?, ?, ?, ?, ?)`;
        roleValues = [fullName, phone, email, aadhar, shopName];
        break;
      case "Buyer":
        roleQuery = `INSERT INTO buyer (name, phone, email, aadhar, address) VALUES (?, ?, ?, ?, ?)`;
        roleValues = [fullName, phone, email, aadhar, address];
        break;
      case "Gov":
        roleQuery = `INSERT INTO gov_official (name, phone, email, aadhar, department) VALUES (?, ?, ?, ?, ?)`;
        roleValues = [fullName, phone, email, aadhar, department];
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid role" });
    }

    await db.query(roleQuery, roleValues);
    res.json({ success: true, message: "Registration successful! Please login." });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ---------------------------
// Login route
// ---------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1", [email, password]);
    if (results.length === 0) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const user = results[0];
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ---------------------------
// Farmer routes
// ---------------------------
app.get("/api/farmer/:id", async (req, res) => {
  const farmerId = req.params.id;
  try {
    const [results] = await db.query("SELECT * FROM farmer WHERE id = ? LIMIT 1", [farmerId]);
    if (results.length === 0) return res.status(404).json({ success: false, message: "Farmer not found" });
    res.json({ success: true, farmer: results[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get("/api/farmer/activity/:id", async (req, res) => {
  const farmerId = req.params.id;
  try {
    const [rows] = await db.query("SELECT description, created_at FROM activity WHERE farmer_id = ? ORDER BY created_at DESC LIMIT 5", [farmerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching activity" });
  }
});

app.get("/api/farmer/marketplace", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.product_id, p.type, f.name AS farmer_name, f.farm_location,
        p.harvest_date, p.quantity, p.price_per_kg, pq.approved_price
      FROM product p
      JOIN farmer f ON p.farmer_id = f.farmer_id
      LEFT JOIN product_quality pq ON p.product_id = pq.prod_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching marketplace data" });
  }
});

app.get("/api/farmer/leaderboard", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT farmer_id, name, farm_location, rating, total_sales
      FROM farmer
      ORDER BY total_sales DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

app.get("/api/farmer/dashboard/:id", async (req, res) => {
  const farmerId = req.params.id;
  try {
    const [[totalSales]] = await db.query("SELECT COALESCE(SUM(price * quantity), 0) AS total_sales FROM sales WHERE farmer_id = ?", [farmerId]);
    const [[activeListings]] = await db.query("SELECT COUNT(*) AS active_listings FROM product WHERE farmer_id = ? AND quantity > 0", [farmerId]);
    const [[ratingRank]] = await db.query("SELECT rating, district_rank FROM farmer WHERE farmer_id = ?", [farmerId]);

    res.json({
      total_sales: totalSales.total_sales,
      active_listings: activeListings.active_listings,
      rating: ratingRank.rating,
      district_rank: ratingRank.district_rank
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
