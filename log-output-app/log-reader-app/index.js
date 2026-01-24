const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const port = process.env.PORT || 3000;
const LOG_FILE = process.env.LOG_FILE || "/var/log/shared/log.txt";

async function readLogFile() {
  try {
    const content = await fs.readFile(LOG_FILE, "utf8");
    return content;
  } catch (err) {
    if (err.code === "ENOENT") {
      return "(log file not found yet)";
    }
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      const content = await readLogFile();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(content);
    } catch (err) {
      console.error("Failed to read log file", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to read log file\n");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Log reader listening on port ${port}`);
  console.log(`Reading from ${LOG_FILE}`);
});
