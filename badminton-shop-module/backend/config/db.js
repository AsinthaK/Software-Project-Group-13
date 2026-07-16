const mysql = require("mysql2");
require("dotenv").config();

// Using a connection POOL instead of a single connection.
// A pool reuses connections and handles concurrent requests safely —
// a single createConnection() will crash your app under load or after
// MySQL idles out the connection.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "badminton_shop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// promise() wrapper lets us use async/await instead of callbacks
const db = pool.promise();

// Quick sanity check on startup
db.query("SELECT 1")
  .then(() => console.log("MySQL connected successfully"))
  .catch((err) => console.error("MySQL connection failed:", err.message));

module.exports = db;
