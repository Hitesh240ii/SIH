const express = require("express");
const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static(__dirname));

// Example backend route
app.get("/api/data", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
