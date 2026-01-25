# Todo App

Node.js frontend service that serves a static UI (HTML/JS/CSS) and proxies todo API calls to `todo-backend`.

## Features

- Serves static UI from `public/index.html`
- Proxies `GET /todos` and `POST /todos` to `todo-backend`
- Daily image fetch & cache (`/image`) with 10-minute TTL
- 140-char limit with live counter, responsive layout

## Namespace

Create the `todo` namespace:

```bash
kubectl create namespace todo
```

Switch to that namespace:

```bash
kubens todo
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

## Access the application

- Browser: `http://localhost:8080`
- API (proxied): `http://localhost:8080/todos`
