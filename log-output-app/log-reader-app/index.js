const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 3000;
const LOG_WRITER_SERVICE =
  process.env.LOG_WRITER_SERVICE || "http://localhost:3001";
const PING_PONG_SERVICE =
  process.env.PING_PONG_SERVICE || "http://ping-pong-app-svc:3000";

async function getLogEntry() {
  return new Promise((resolve) => {
    const url = new URL(`${LOG_WRITER_SERVICE}/logs`);

    http
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.entry || "(no logs yet)");
          } catch (err) {
            console.error("Failed to parse log-writer response:", err);
            resolve("(no logs yet)");
          }
        });
      })
      .on("error", (err) => {
        console.error("Failed to fetch logs from writer:", err);
        resolve("(no logs yet)");
      });
  });
}

async function getPingPongCount() {
  return new Promise((resolve) => {
    const url = new URL(`${PING_PONG_SERVICE}/count`);

    http
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.count.toString());
          } catch (err) {
            console.error("Failed to parse ping-pong response:", err);
            resolve("0");
          }
        });
      })
      .on("error", (err) => {
        console.error("Failed to fetch ping-pong count:", err);
        resolve("0");
      });
  });
}

async function checkPingPongService() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${PING_PONG_SERVICE}/count`);

    http
      .get(url, (response) => {
        if (response.statusCode === 200) {
          resolve(true);
        } else {
          reject(new Error(`Status code ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/healthz" && req.method === "GET") {
    try {
      await checkPingPongService();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Ready");
    } catch (err) {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("Ping-pong not ready");
    }
    return;
  }
  if (req.url === "/" && req.method === "GET") {
    try {
      const logEntry = await getLogEntry();
      const pongCount = await getPingPongCount();

      // Read config file and env variable
      let fileContent = "(file not found)";
      try {
        fileContent = fs.readFileSync("/config/information.txt", "utf8").trim();
      } catch (err) {
        console.error("Failed to read config file:", err);
      }
      const envMessage = process.env.MESSAGE || "(not set)";

      const responseText = `file content: ${fileContent}\nenv variable: MESSAGE=${envMessage}\n${logEntry}\nPing / Pongs: ${pongCount}`;

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(responseText);
    } catch (err) {
      console.error("Failed to process request", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to process request\n");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Log reader listening on port ${port}`);
  console.log(`Fetching logs from ${LOG_WRITER_SERVICE}/logs`);
  console.log(`Fetching pong count from ${PING_PONG_SERVICE}/count`);
});
