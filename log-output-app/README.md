# Log Output App

A two-container application running in a single pod that communicates internally via HTTP:

- **log-writer-app** (port 3001): Generates a random UUID at startup and creates a new `timestamp: uuid` log entry every 5 seconds. Exposes `GET /logs` endpoint returning `{ "entry": "<latest log>" }`.
- **log-reader-app** (port 3000): Aggregates log entries and ping-pong count, serving them at `GET /`. Fetches logs from log-writer via `http://localhost:3001/logs` and pong count from ping-pong service via Kubernetes DNS.

## Deploy to GKE with Gateway API

This exercise replaces Ingress with Gateway API for HTTP routing.

**Gateway** (`gateway.yaml`):

- Defines the load balancer entry point using `gke-l7-regional-external-managed` class
- Listens on HTTP port 80
- Requires a proxy-only subnet in the same region

**HTTPRoute** (`route.yaml`):

- Routes `/` to log-output-app-svc
- Routes `/pingpong` to ping-pong-app-svc

**Prerequisites:**

Create proxy-only subnet (one-time setup):

```bash
gcloud compute networks subnets create proxy-only-subnet \
  --purpose=REGIONAL_MANAGED_PROXY \
  --role=ACTIVE \
  --region=europe-west3 \
  --network=default \
  --range=10.0.0.0/23
```

**Deploy:**

```bash
kubens log-pong
kubectl apply -f k8s/

# Get Gateway IP
kubectl get gateway log-output-gateway
```

## Access the application

- `http://<GATEWAY-IP>/` - log-output with aggregated logs and pong count
- `http://<GATEWAY-IP>/pingpong` - ping-pong counter
