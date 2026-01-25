const http = require("http");

const port = process.env.PORT || 3000;
let counter = 0;

const server = http.createServer((req, res) => {
  if (req.url === "/pingpong" && req.method === "GET") {
    const response = `pong ${counter}`;
    counter++;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(response);
  } else if (req.url === "/count" && req.method === "GET") {
    // HTTP endpoint to return just the counter (for log-output to fetch)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: counter }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Ping-pong app started on port ${port}`);
  console.log(`In-memory counter initialized`);
});
