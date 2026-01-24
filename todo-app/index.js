const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const IMAGE_DIR = process.env.IMAGE_DIR || "/var/lib/data";
const IMAGE_PATH = path.join(IMAGE_DIR, "cached-image.jpg");
const METADATA_PATH = path.join(IMAGE_DIR, "image-metadata.json");
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Ensure image directory exists
function ensureImageDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
}

// Check if cached image is still valid
function isCacheValid() {
  if (!fs.existsSync(IMAGE_PATH) || !fs.existsSync(METADATA_PATH)) {
    return false;
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
    const age = Date.now() - metadata.timestamp;
    return age < CACHE_DURATION_MS;
  } catch (err) {
    console.error("Failed to read metadata:", err);
    return false;
  }
}

// Fetch new image from Lorem Picsum (handles redirects)
function fetchNewImage(callback) {
  console.log("Fetching new image from Lorem Picsum...");

  const imageUrl = "https://picsum.photos/1200";

  function downloadImage(url) {
    https
      .get(url, (response) => {
        // Handle redirects (302, 301, etc.)
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          console.log(`Following redirect to ${response.headers.location}`);
          downloadImage(response.headers.location);
          return;
        }

        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(IMAGE_PATH);

          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();

            // Save metadata
            const metadata = { timestamp: Date.now() };
            fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata), "utf8");

            console.log("Image cached successfully");
            callback(null);
          });
        } else {
          callback(new Error(`Failed to fetch image: ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        callback(err);
      });
  }

  downloadImage(imageUrl);
}

// Get image (from cache or fetch new)
function getImage(callback) {
  ensureImageDir();

  if (isCacheValid()) {
    console.log("Serving cached image");
    fs.readFile(IMAGE_PATH, callback);
  } else {
    fetchNewImage((err) => {
      if (err) {
        callback(err);
      } else {
        fs.readFile(IMAGE_PATH, callback);
      }
    });
  }
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px;
    }
    
    .wrapper {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .daily-image {
      width: 100%;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      object-fit: cover;
      max-height: 400px;
    }
    
    .container {
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
    }
    
    .header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .header h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 8px;
    }
    
    .header p {
      color: #999;
      font-size: 14px;
    }
    
    .input-section {
      margin-bottom: 30px;
    }
    
    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    input[type="text"] {
      flex: 1;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }
    
    input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
    }
    
    input[type="text"]:placeholder-shown {
      color: #ccc;
    }
    
    .add-btn {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.3s;
    }
    
    .add-btn:hover {
      background: #5568d3;
    }
    
    .add-btn:active {
      transform: scale(0.98);
    }
    
    .char-count {
      font-size: 12px;
      color: #999;
      text-align: right;
      margin-top: 4px;
    }
    
    .char-count.warning {
      color: #ff9800;
    }
    
    .char-count.error {
      color: #ff6b6b;
    }
    
    .todo-section h2 {
      color: #333;
      font-size: 16px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .todo-list {
      list-style: none;
    }
    
    .todo-item {
      padding: 14px;
      background: #f8f9fa;
      margin-bottom: 10px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
      border-left: 4px solid #667eea;
    }
    
    .todo-item:hover {
      background: #f0f1f5;
      transform: translateX(4px);
    }
    
    .todo-item span {
      flex: 1;
      color: #333;
      font-size: 14px;
      word-break: break-word;
    }
    
    .delete-btn {
      background: #ff6b6b;
      color: white;
      padding: 6px 12px;
      font-size: 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    
    .delete-btn:hover {
      background: #ff5252;
    }
    
    .empty-state {
      text-align: center;
      color: #bbb;
      padding: 30px 20px;
      font-size: 14px;
    }
    
    .todo-count {
      color: #999;
      font-size: 12px;
      margin-top: 15px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <img src="/image" alt="Daily inspiration" class="daily-image">
    
    <div class="container">
      <div class="header">
        <h1>📝 My Todo List</h1>
        <p>Keep track of what needs to be done</p>
      </div>
      
      <div class="input-section">
        <div class="input-group">
          <input 
            type="text" 
            id="todoInput" 
            placeholder="Add a new task (max 140 characters)..."
            maxlength="140"
            autofocus
          >
          <button class="add-btn" onclick="addTodo()">Add</button>
        </div>
        <div class="char-count" id="charCount">0 / 140</div>
      </div>
      
      <div class="todo-section">
        <h2>Tasks</h2>
        <ul class="todo-list" id="todoList">
          <li class="empty-state">No todos yet. Add one to get started!</li>
        </ul>
        <div class="todo-count" id="todoCount"></div>
      </div>
    </div>
  </div>

  <script>
    let todos = [];

    // Monitor character count
    document.getElementById('todoInput').addEventListener('input', function(e) {
      const count = e.target.value.length;
      const charCountEl = document.getElementById('charCount');
      charCountEl.textContent = count + ' / 140';
      
      if (count > 100) {
        charCountEl.className = 'char-count warning';
      } else if (count >= 140) {
        charCountEl.className = 'char-count error';
      } else {
        charCountEl.className = 'char-count';
      }
    });

    function addTodo() {
      const input = document.getElementById('todoInput');
      const text = input.value.trim();
      
      if (text === '') {
        alert('Please enter a todo!');
        return;
      }
      
      if (text.length > 140) {
        alert('Todo must be 140 characters or less!');
        return;
      }

      todos.push({ id: Date.now(), text: text });
      input.value = '';
      document.getElementById('charCount').textContent = '0 / 140';
      renderTodos();
    }

    function deleteTodo(id) {
      todos = todos.filter(t => t.id !== id);
      renderTodos();
    }

    function renderTodos() {
      const list = document.getElementById('todoList');
      const countEl = document.getElementById('todoCount');
      
      if (todos.length === 0) {
        list.innerHTML = '<li class="empty-state">No todos yet. Add one to get started!</li>';
        countEl.textContent = '';
        return;
      }
      
      list.innerHTML = todos.map(todo => 
        '<li class="todo-item">' +
        '  <span>' + escapeHtml(todo.text) + '</span>' +
        '  <button class="delete-btn" onclick="deleteTodo(' + todo.id + ')">Delete</button>' +
        '</li>'
      ).join('');
      
      countEl.textContent = todos.length + ' task' + (todos.length !== 1 ? 's' : '');
    }

    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    document.getElementById('todoInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') addTodo();
    });
  </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
  } else if (req.url === "/image" && req.method === "GET") {
    getImage((err, imageData) => {
      if (err) {
        console.error("Error serving image:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Failed to load image\n");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(imageData);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
