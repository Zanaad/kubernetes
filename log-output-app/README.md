# Log Output App

A two-container application running in a single pod that communicates internally via HTTP:

- **log-writer-app** (port 3001): Generates a random UUID at startup and creates a new `timestamp: uuid` log entry every 5 seconds. Exposes `GET /logs` endpoint returning `{ "entry": "<latest log>" }`.
- **log-reader-app** (port 3000): Aggregates log entries and ping-pong count, serving them at `GET /`. Fetches logs from log-writer via `http://localhost:3001/logs` and pong count from ping-pong service via `http://ping-pong-app-svc:3000/count`.

## Architecture

- Both containers in single pod sharing network namespace
- HTTP communication between containers on localhost
- External HTTP call to ping-pong service via Kubernetes DNS
- ConfigMap provides configuration via file volume and environment variable
- Reader responds with:
  ```
  file content: <content from ConfigMap file>
  env variable: MESSAGE=<value from ConfigMap>
  <last log line>
  Ping / Pongs: <count>
  ```

## Configuration

The application uses a ConfigMap (`log-output-config`) that provides:

- **Environment variable**: `MESSAGE` - displayed in the output
- **File volume**: `information.txt` - mounted at `/config/information.txt` and read by log-reader-app

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

## Access the application

Open `http://localhost:8080/`

You should see the latest log entry and the current ping/pong count. The log entry updates automatically every 5 seconds.
