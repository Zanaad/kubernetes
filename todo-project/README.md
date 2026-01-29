# Todo Project

Complete todo application with frontend, backend, and scheduled tasks deployed to Google Kubernetes Engine using Kustomize.

## Architecture

```
todo-project/
├── todo-app           — Frontend (Node.js + HTML/JS/CSS)
├── todo-backend       — REST API (Node.js + Postgres)
├── todo-job           — CronJob for Wikipedia reading reminders
└── kustomization.yaml — Root Kustomize manifest
```

**Data Flow**:

- todo-app (port 3000) → proxies → todo-backend (port 3000) → Postgres StatefulSet
- todo-job (hourly) → CronJob → POST /todos → todo-backend

## Deploy to GKE with Kustomize

```bash
# Create namespace
kubectl create namespace todo
kubens todo

# Decrypt secrets
sops -d todo-backend/k8s/secret.enc.yaml | kubectl apply -f -

# Deploy all components with Kustomize
kubectl apply -k .
```

Check status:

```bash
kubectl get pods
kubectl get svc
```

## Components

- [todo-app](todo-app/README.md) — Frontend proxy with caching
- [todo-backend](todo-backend/README.md) — REST API with request logging and 140-char validation
- [todo-job](todo-job/README.md) — CronJob for Wikipedia article todos

## Access

Get the Ingress IP:

```bash
kubectl get ingress todo-app-ingress -n todo
```

Then access todo-app via:

```
http://<INGRESS-IP>/
```

## Features

- **Frontend**: Static UI with live todo counter
- **Backend**: Postgres-backed REST API with JSON logging
- **Database**: StatefulSet with encrypted secrets and persistent volumes
- **Automation**: CronJob generates reading reminders hourly
- **Configuration**: Kustomize for managing all resources together
