// config/db.js
const mysql = require("mysql2/promise");

// ✅ Use createPool for scalability (preferred over createConnection)
const pool = mysql.createPool({
  host: process.env.DB_HOST, // e.g., "localhost"
  user: process.env.DB_USER, // e.g., "root"
  password: process.env.DB_PASSWORD, // e.g., "password"
  database: process.env.DB_NAME, // e.g., "mydb"
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true, // 👈 optional: support for named query params
  timezone: "Z", // store/retrieve all timestamps in UTC
});

// Optional: test connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
