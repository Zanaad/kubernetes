# Todo Backend

Minimal Node.js API that stores todos in memory and exposes HTTP endpoints for the todo-app frontend to consume.

## Endpoints

- `GET /todos` — return all todos as JSON
- `POST /todos` — create a todo `{ text }` (max 140 chars), returns created todo `{ id, text }`

## Build and push the image

```bash
docker build -t zanaad/todo-backend:latest .
docker push zanaad/todo-backend:latest
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```
