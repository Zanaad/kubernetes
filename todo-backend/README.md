# Todo Backend

Node.js REST API that stores todos in a Postgres database and exposes HTTP endpoints for the todo-app frontend to consume.

## Features & Architecture

- **Endpoints**:
  - `GET /todos` — return all todos as JSON
  - `POST /todos` — create a todo `{ text }` (max 140 chars), returns created todo `{ id, text }`
- **Postgres StatefulSet**: Single replica with persistent volume for todo storage
- **Headless Service**: `postgres-svc` for stable network identity
- **Secret Management**: Database credentials encrypted with SOPS and age keys
- **Auto-initialization**: Creates todos table on startup
- **Persistence**: Todos persist across pod restarts

## Build and push the image

```bash
npm install
docker build -t zanaad/todo-backend:latest .
docker push zanaad/todo-backend:latest
```

## Generate age key and encrypt secrets

```bash
age-keygen -o key.txt
sops --encrypt --age PUBLIC_KEY_HERE --encrypted-regex '^(data)$' secret.yaml>secret.enc.yaml
```

## Deploy to Kubernetes

Decrypt and apply secrets first:

```bash
kubens todo
sops -d secret.enc.yaml | kubectl apply -f -
kubectl apply -f k8s/
```

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
