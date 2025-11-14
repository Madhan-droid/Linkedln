// Bad:

const { MongoClient } = require("mongodb");
exports.handler = async (event) => {
  // ❌ BAD: creates a new DB connection for every invocation
  const client = new MongoClient(process.env.DB_URI);
  await client.connect();

  const db = client.db("test");
  const result = await db.collection("users").findOne({ id: 1 });

  return result;
};
// What’s wrong?
// Lambda will create a new DB connection every time it runs
// Slow cold starts
// You’ll quickly hit DB connection limits
// Very costly for high-traffic functions

//====================================================================================================================

// Good:
const { MongoClient } = require("mongodb");

let client = null; // 🟢 Reuse between executions

async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.DB_URI);
    await client.connect();
  }
  return client;
}

exports.handler = async (event) => {
  const dbClient = await getClient();
  const db = dbClient.db("test");

  const result = await db.collection("users").findOne({ id: 1 });
  return result;
};

// Benefits:
// Connection created only once
// Faster warm invocations
// No connection explosion
// Lower cost
