const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const port = process.env.PORT || 3000;
const SHARED_VOLUME = process.env.SHARED_VOLUME || "/var/lib/shared";
const LOG_FILE = process.env.LOG_FILE || path.join(SHARED_VOLUME, "log.txt");
const COUNTER_FILE =
  process.env.COUNTER_FILE || path.join(SHARED_VOLUME, "pong-count.txt");

async function readLogFile() {
  try {
    const content = await fs.readFile(LOG_FILE, "utf8");
    return content;
  } catch (err) {
    if (err.code === "ENOENT") {
      return "(log file not found yet)\n";
    }
    throw err;
  }
}

async function readPingPongCount() {
  try {
    const content = await fs.readFile(COUNTER_FILE, "utf8");
    return content.trim();
  } catch (err) {
    if (err.code === "ENOENT") {
      return "0";
    }
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      const logContent = await readLogFile();
      const pongCount = await readPingPongCount();

      // Format: last log line + ping/pong count
      const logLines = logContent.trim().split("\n");
      const lastLogLine = logLines[logLines.length - 1] || "(no logs yet)";

      const responseText = `${lastLogLine}\nPing / Pongs: ${pongCount}`;

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(responseText);
    } catch (err) {
      console.error("Failed to read files", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to read files\n");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Log reader listening on port ${port}`);
  console.log(`Reading log from ${LOG_FILE}`);
  console.log(`Reading pong count from ${COUNTER_FILE}`);
});
