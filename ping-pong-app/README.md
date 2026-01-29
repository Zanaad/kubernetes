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

## Deploy to GKE

This exercise deploys ping-pong to Google Kubernetes Engine with a LoadBalancer service.

Setup GKE cluster:

```bash
gcloud auth login
gcloud config set project PROJECT_NAME
gcloud services enable container.googleapis.com
gcloud container clusters create dwk-cluster --zone=europe-west3-b --cluster-version=1.32 --disk-size=32 --num-nodes=3 --machine-type=e2-micro
gcloud components install gke-gcloud-auth-plugin
```

Changes for GKE deployment:

- **Service**: Changed to `type: LoadBalancer` to expose publicly
- **StatefulSet**:
  - Set `storageClassName: standard` (GKE's default storage class)
  - Added `subPath: postgres` to volumeMounts to avoid "directory not empty" errors when using persistent volumes

Deploy to GKE:

```bash
kubectl create namespace log-pong
kubens log-pong
sops -d secret.enc.yaml | kubectl apply -f -
kubectl apply -f k8s/
kubectl get svc ping-pong-app-svc  # Get the external LoadBalancer IP
```

## Access the application

- **Local k3d**: `http://localhost:8080/pingpong`
- **GKE LoadBalancer**: `http://<EXTERNAL-IP>/pingpong` (get IP from `kubectl get svc`)
- **Internal**: `http://ping-pong-app-svc:3000/count` (used by log-reader)
