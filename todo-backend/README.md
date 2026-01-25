# Todo Backend

Minimal Node.js API that stores todos in memory and exposes HTTP endpoints for the todo-app frontend to consume.

## Endpoints

- `GET /todos` — return all todos as JSON
- `POST /todos` — create a todo `{ text }` (max 140 chars), returns created todo `{ id, text }`

## Deploy to Kubernetes

Already in `todo` namespace (created in todo-app setup):

```bash
kubectl apply -f k8s/
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```
