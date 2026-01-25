# Ping-Pong App

Simple Node.js app that manages an in-memory counter and exposes it via HTTP endpoints. The counter increments on each request and is accessible by other services through HTTP GET requests.

## Features

- `GET /pingpong`: Increments and returns `pong X`
- `GET /count`: Returns JSON `{ "count": X }` for other services to consume
- In-memory counter (resets on pod restart)
- No persistent storage required

## Deploy to Kubernetes

Already in `log-pong` namespace (created in log-output setup):

```bash
kubectl apply -f k8s/
```

## Access the application

- `http://localhost:8080/pingpong` - Increment and display counter
- `http://ping-pong-app-svc:3000/count` - HTTP endpoint for other services (used by log-reader)
