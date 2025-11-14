//GOOD Example — Reusable MongoDB Connection

const { MongoClient } = require("mongodb");

// 🟢 Declared outside → persisted across invocations
let client = null;

async function getDB() {
  if (!client) {
    client = new MongoClient(process.env.DB_URI);
    await client.connect(); // Runs ONLY on first cold start
  }
  return client.db("appdb");
}

exports.handler = async (event) => {
  const db = await getDB();

  const user = await db.collection("users").findOne({ id: 1 });

  return user;
};
// Why this is GOOD?
// Connection reused across all warm Lambda executions
// Faster response (no repeated connect())
// Lower cost
// DB stays healthy (no connection floods)

//===================================================================================================================

// BAD Example — RDS / MySQL Connection (inside handler)

const mysql = require("mysql2/promise");

exports.handler = async () => {
  // ❌ BAD: Creates a NEW MySQL connection every time
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  const [rows] = await connection.execute("SELECT * FROM users");
  return rows;
};

//GOOD Example — Reusing MySQL/RDS Connection

const mysql = require("mysql2/promise");

let connection;

exports.handler = async () => {
  // 🟢 Reuse existing connection
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  const [rows] = await connection.execute("SELECT * FROM users");
  return rows;
};
