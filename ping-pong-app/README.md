# Ping-Pong App

Simple Node.js app that manages a counter stored in a Postgres database and exposes it via HTTP endpoints. The counter increments on each request and persists across pod restarts.

## Features & Architecture

- **Endpoints**:
  - `GET /pingpong`: Increments and returns `pong X`
  - `GET /count`: Returns JSON `{ "count": X }` for other services to consume
- **Postgres StatefulSet**: Single replica with persistent volume for counter storage
- **Headless Service**: `postgres-svc` for stable network identity
- **Secret Management**: Database credentials encrypted with SOPS and age keys
- **Auto-initialization**: Creates counter table and seeds initial value on startup
- **Persistence**: Counter survives pod restarts

## Rebuild and push the image

```bash
npm install
docker build -t zanaad/ping-pong-app:latest .
docker push zanaad/ping-pong-app:latest
```

## Generate age key and encrypt secrets

```bash
age-keygen -o key.txt
sops sops --encrypt --age PUBLIC_KEY_HERE --encrypted-regex '^(data)$' secret.yaml>secret.enc.yaml
```

## Deploy to Kubernetes

Decrypt and apply secrets first:

```bash
kubens log-pong
sops -d secret.enc.yaml | kubectl apply -f -
kubectl apply -f k8s/
```

## Access the application

- `http://localhost:8080/pingpong` - Increment and display counter
- `http://ping-pong-app-svc:3000/count` - HTTP endpoint for other services (used by log-reader)

## Debug Postgres

Connect to database for debugging:

```bash
kubectl run -it --rm --restart=Never --image postgres psql-for-debugging sh
psql postgres://USER:PASSWORD@postgres-svc:5432/DB_NAME
```

Inside psql:

```sql
\dt                      -- list tables
SELECT * FROM counter;   -- view counter value
```
