const http = require("http");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3000;
const randomString = uuidv4();

// Log the status every 5 seconds
setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
}, 5000);

// HTTP server to expose status endpoint
const server = http.createServer((req, res) => {
  if (req.url === "/status" && req.method === "GET") {
    const status = {
      timestamp: new Date().toISOString(),
      randomString: randomString,
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(status, null, 2));
  } else if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Log Output App - Use /status endpoint to get current status\n");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Random string: ${randomString}`);
});
