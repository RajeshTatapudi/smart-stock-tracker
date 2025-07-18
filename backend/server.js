const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "watchlist_db", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Routes
// Get all stocks
app.get("/stocks", (req, res) => {
  db.query("SELECT * FROM stocks", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Add a new stock
app.post("/stocks", (req, res) => {
    const { name, ticker, price, category, change, favorite } = req.body;
    const sql = "INSERT INTO stocks (name, ticker, price, category, `change`, favorite) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, ticker, price, category, change, favorite], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding stock");
      } else {
        res.status(200).send("Stock added successfully");
      }
    });
  });
  

// Delete a stock
app.delete("/stocks/:ticker", (req, res) => {
  const ticker = req.params.ticker;
  const sql = "DELETE FROM stocks WHERE ticker = ?";
  db.query(sql, [ticker], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.send("Stock deleted successfully");
  });
});

// Update a stock
// Update stock details
app.put("/stocks/:ticker", (req, res) => {
    const { ticker } = req.params;
    const { name, price, category, change, favorite } = req.body;
    const sql = "UPDATE stocks SET name = ?, price = ?, category = ?, `change` = ?, favorite = ? WHERE ticker = ?";
    db.query(sql, [name, price, category, change, favorite, ticker], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating stock");
      } else {
        res.status(200).send("Stock updated successfully");
      }
    });
  });
  
// Start server (modified to listen on all network interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
