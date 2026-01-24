# Log Output App

A two-container application running in a single pod and sharing a persistent volume at `/var/lib/shared`:

- **log-writer-app**: Generates a random UUID at startup and writes `timestamp: uuid` to `/var/lib/shared/log.txt` every 5 seconds.
- **log-reader-app**: Serves the latest log line plus the ping-pong request count (`/var/lib/shared/pong-count.txt`) at `GET /`.

## Architecture

- PersistentVolume (`shared-pv`) + PVC (`shared-pvc`) shared across apps
- Writer appends to `/var/lib/shared/log.txt`
- Ping-pong app updates `/var/lib/shared/pong-count.txt`
- Reader responds with:
  ```
  <last log line>
  Ping / Pongs: <count>
  ```

## Rebuild and push images

```bash
cd log-writer-app
docker build -t zanaad/log-writer-app:latest .
docker push zanaad/log-writer-app:latest

cd ../log-reader-app
docker build -t zanaad/log-reader-app:latest .
docker push zanaad/log-reader-app:latest
```

## Deploy to Kubernetes

Apply storage first, then apps:

```bash
kubectl apply -f k8s/persistent-volume.yaml
kubectl apply -f k8s/persistent-volume-claim.yaml
kubectl apply -f k8s/deployment.yaml
```

Or apply everything:

```bash
kubectl apply -f k8s/
```

## Access the application

Open `http://localhost:8080/`

You should see the latest writer log line and the current ping/pong count.
