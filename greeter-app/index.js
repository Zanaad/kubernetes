const http = require("http");

const port = process.env.PORT || 3000;
const GREETING = process.env.GREETING || "Hello";
const VERSION = process.env.VERSION || "v1";

const server = http.createServer((req, res) => {
  if (req.url === "/healthz" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } else if (req.url === "/" && req.method === "GET") {
    console.log(`GET / -> ${GREETING} from ${VERSION}`);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`${GREETING} from greeter ${VERSION}`);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Greeter ${VERSION} listening on port ${port}`);
});
