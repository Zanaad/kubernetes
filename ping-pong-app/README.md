# Ping-Pong App

Simple Node.js app that manages a counter stored in a Postgres database and exposes it via HTTP endpoints. The counter increments on each request and persists across pod restarts.

## Endpoints

- `GET /`: Health check (required for Gateway health probes)
- `GET /pingpong`: Increments and returns `pong X`
- `GET /count`: Returns JSON `{ "count": X }` for other services

## GKE Deployment Changes

- **Service**: ClusterIP (used with Gateway API)
- **StatefulSet**: `storageClassName: standard`, `subPath: postgres` for GKE persistent volumes
- **Code**: Added `/` health endpoint for Gateway readiness

## Deploy

```bash
kubens log-pong
kubectl apply -f k8s/
```

Gateway and HTTPRoute are defined in the log-output-app.
