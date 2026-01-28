const http = require("http");
const { Pool } = require("pg");

const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "postgres-svc",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || "logpong",
  port: 5432,
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counter (
        id INTEGER PRIMARY KEY,
        value INTEGER NOT NULL
      )
    `);

    const result = await pool.query("SELECT value FROM counter WHERE id = 1");
    if (result.rows.length === 0) {
      await pool.query("INSERT INTO counter (id, value) VALUES (1, 0)");
      console.log("Counter initialized to 0 in database");
    } else {
      console.log(`Counter loaded from database: ${result.rows[0].value}`);
    }
  } catch (err) {
    console.error("Failed to initialize database", err);
    process.exit(1);
  }
}

async function getCounter() {
  const result = await pool.query("SELECT value FROM counter WHERE id = 1");
  return result.rows[0].value;
}

async function incrementCounter() {
  const result = await pool.query(
    "UPDATE counter SET value = value + 1 WHERE id = 1 RETURNING value",
  );
  return result.rows[0].value;
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/pingpong" && req.method === "GET") {
    try {
      const currentCount = await getCounter();
      const response = `pong ${currentCount}`;
      await incrementCounter();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(response);
    } catch (err) {
      console.error("Failed to process /pingpong", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error\n");
    }
  } else if (req.url === "/count" && req.method === "GET") {
    try {
      const count = await getCounter();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ count }));
    } catch (err) {
      console.error("Failed to process /count", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to retrieve count" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

async function start() {
  await initDatabase();
  server.listen(port, () => {
    console.log(`Ping-pong app started on port ${port}`);
    console.log(`Connected to Postgres at ${process.env.POSTGRES_HOST}`);
  });
}

start();
