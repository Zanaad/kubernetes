# Ping-Pong App

Simple Node.js app that manages a counter stored in a Postgres database and exposes it via HTTP endpoints. The counter increments on each request and persists across pod restarts.

## Features & Architecture

- **Endpoints**:
  - `GET /`: Health check for Ingress
  - `GET /pingpong`: Increments and returns `pong X`
  - `GET /count`: Returns JSON `{ "count": X }` for other services to consume
- **Postgres StatefulSet**: Single replica with persistent volume for counter storage
- **Headless Service**: `postgres-svc` for stable network identity
- **Secret Management**: Database credentials encrypted with SOPS and age keys
- **Auto-initialization**: Creates counter table and seeds initial value on startup
- **Persistence**: Counter survives pod restarts

## Deploy to GKE with Ingress

Changes for GKE Ingress deployment:

- **Service**: Changed to `type: ClusterIP` (default, used with Ingress)
- **Code**: Added `/` health check endpoint for Ingress readiness probes
- **StatefulSet**:
  - Set `storageClassName: standard` (GKE's default storage class)
  - Added `subPath: postgres` to volumeMounts to avoid "directory not empty" errors when using persistent volumes

Deploy to GKE with Ingress:

```bash
kubens log-pong
kubectl apply -f k8s/service.yaml
```

## Access the application

- **Local k3d**: `http://localhost:8080/pingpong`
- **GKE Ingress**: `http://<INGRESS-IP>/pingpong`
- **Internal**: `http://ping-pong-app-svc:3000/count` (used by log-reader)
