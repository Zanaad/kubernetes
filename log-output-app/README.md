# Log Output App

A two-container application running in a single pod that communicates internally via HTTP:

- **log-writer-app** (port 3001): Generates a random UUID at startup and creates a new `timestamp: uuid` log entry every 5 seconds. Exposes `GET /logs` endpoint returning `{ "entry": "<latest log>" }`.
- **log-reader-app** (port 3000): Aggregates log entries and ping-pong count, serving them at `GET /`. Fetches logs from log-writer via `http://localhost:3001/logs` and pong count from ping-pong service via `http://ping-pong-app-svc:3000/count`.

## Architecture

- Both containers in single pod sharing network namespace
- HTTP communication between containers on localhost
- External HTTP call to ping-pong service via Kubernetes DNS
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

```bash
kubectl apply -f k8s/
```

## Access the application

Open `http://localhost:8080/`

You should see the latest log entry and the current ping/pong count. The log entry updates automatically every 5 seconds.
