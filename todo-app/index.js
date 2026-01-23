const http = require("http");

const port = process.env.PORT || 3000;

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
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 500px;
      padding: 30px;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    button {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover { background: #5568d3; }
    .todo-list {
      list-style: none;
    }
    .todo-item {
      padding: 12px;
      background: #f5f5f5;
      margin-bottom: 8px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .delete-btn {
      background: #ff6b6b;
      padding: 5px 10px;
      font-size: 12px;
    }
    .delete-btn:hover { background: #ff5252; }
    .empty-state {
      text-align: center;
      color: #999;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 My Todo List</h1>
    <div class="input-group">
      <input type="text" id="todoInput" placeholder="Add a new task...">
      <button onclick="addTodo()">Add</button>
    </div>
    <ul class="todo-list" id="todoList">
      <li class="empty-state">No todos yet. Add one to get started!</li>
    </ul>
  </div>

  <script>
    let todos = [];

    function addTodo() {
      const input = document.getElementById('todoInput');
      const text = input.value.trim();
      if (text === '') return;

      todos.push({ id: Date.now(), text: text });
      input.value = '';
      renderTodos();
    }

    function deleteTodo(id) {
      todos = todos.filter(t => t.id !== id);
      renderTodos();
    }

    function renderTodos() {
      const list = document.getElementById('todoList');
      if (todos.length === 0) {
        list.innerHTML = '<li class="empty-state">No todos yet. Add one to get started!</li>';
        return;
      }
      list.innerHTML = todos.map(todo => 
        '<li class="todo-item">' +
        '  <span>' + todo.text + '</span>' +
        '  <button class="delete-btn" onclick="deleteTodo(' + todo.id + ')">Delete</button>' +
        '</li>'
      ).join('');
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
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(port, () => {
  console.log(`Server started in port ${port}`);
});
