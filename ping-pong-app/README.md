# Ping-Pong App

Simple Node.js app that responds to `GET /pingpong` with `pong X` and stores the counter in a shared persistent volume so it survives pod restarts.

Data is stored in `/var/lib/shared/pong-count.txt` (shared PVC).

## Rebuild and push the image

```bash
docker build -t zanaad/ping-pong-app:latest .
docker push zanaad/ping-pong-app:latest
```

## Deploy to Kubernetes

Apply storage first, then the app (PVC is shared with log-output):

```bash
kubectl apply -f k8s/deployment.yaml
```

## Access the application

`http://localhost:8080/pingpong`

Each request increments the counter and writes it to the shared volume. The log-output app reads this counter and shows it alongside its log line.
