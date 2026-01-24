const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const port = process.env.PORT || 3000;
const SHARED_VOLUME = process.env.SHARED_VOLUME || "/var/lib/shared";
const COUNTER_FILE =
  process.env.COUNTER_FILE || path.join(SHARED_VOLUME, "pong-count.txt");

let counter = 0;

async function ensureDirectoryExists() {
  try {
    await fs.mkdir(SHARED_VOLUME, { recursive: true });
  } catch (err) {
    console.error("Failed to create shared volume directory", err);
  }
}

async function loadCounter() {
  try {
    const content = await fs.readFile(COUNTER_FILE, "utf8");
    counter = parseInt(content, 10) || 0;
    console.log(`Loaded counter from file: ${counter}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Failed to read counter file", err);
    }
    counter = 0;
  }
}

async function saveCounter() {
  try {
    await fs.writeFile(COUNTER_FILE, counter.toString(), "utf8");
  } catch (err) {
    console.error("Failed to write counter to file", err);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/pingpong" && req.method === "GET") {
    const response = `pong ${counter}`;
    counter++;
    await saveCounter();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(response);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

async function start() {
  await ensureDirectoryExists();
  await loadCounter();

  server.listen(port, () => {
    console.log(`Ping-pong app started on port ${port}`);
    console.log(`Shared volume: ${SHARED_VOLUME}`);
    console.log(`Counter file: ${COUNTER_FILE}`);
  });
}

start();
