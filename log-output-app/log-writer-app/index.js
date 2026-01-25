const http = require("http");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3001;
const WRITE_INTERVAL_MS = 5000;
const randomString = uuidv4();
let lastLogEntry = "";

function generateLogEntry() {
  const timestamp = new Date().toISOString();
  lastLogEntry = `${timestamp}: ${randomString}`;
  console.log(`log entry -> ${lastLogEntry}`);
}

const server = http.createServer((req, res) => {
  if (req.url === "/logs" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ entry: lastLogEntry }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

console.log(`Log writer starting. Random string: ${randomString}`);
console.log(`Generating log entries every ${WRITE_INTERVAL_MS / 1000}s`);

generateLogEntry();
setInterval(generateLogEntry, WRITE_INTERVAL_MS);

server.listen(port, () => {
  console.log(`Log writer listening on port ${port}`);
  console.log(`Logs available at /logs endpoint`);
});
