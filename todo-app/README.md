# Todo App

Node.js frontend service that serves a static UI (HTML/JS/CSS) and proxies todo API calls to `todo-backend`.

## Features

- Serves static UI from `public/index.html`
- Proxies `GET /todos` and `POST /todos` to `todo-backend`
- Daily image fetch & cache (`/image`) with 10-minute TTL
- 140-char limit with live counter, responsive layout

## Rebuild and push the image

```bash
docker build -t zanaad/todo-app:latest .
docker push zanaad/todo-app:latest
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

## Access the application

- Browser: `http://localhost:8080`
- API (proxied): `http://localhost:8080/todos`
