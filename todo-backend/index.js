const http = require("http");

const port = process.env.PORT || 3000;
let todos = [];

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/todos" && req.method === "GET") {
    return sendJson(res, 200, todos);
  }

  if (req.url === "/todos" && req.method === "POST") {
    try {
      const body = await parseRequestBody(req);
      const text = (body.text || "").trim();

      if (!text) {
        return sendJson(res, 400, { error: "text is required" });
      }

      if (text.length > 140) {
        return sendJson(res, 400, { error: "text must be 140 chars or less" });
      }

      const todo = { id: Date.now(), text };
      todos.push(todo);

      return sendJson(res, 201, todo);
    } catch (err) {
      console.error("Failed to create todo", err);
      return sendJson(res, 400, { error: "invalid JSON" });
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found\n");
});

server.listen(port, () => {
  console.log(`todo-backend listening on port ${port}`);
});
