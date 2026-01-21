# Todo App

Simple Node.js HTTP server. On startup it prints "Server started in port N"

## Run locally

```bash
npm install
npm start
```

## Build and run with Docker

```bash
docker build -t zanaad/todo-app .
docker run --rm zanaad/todo-app
docker push zanaad/todo-app
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl get deployments
kubectl get pods
kubectl logs -f pod_name_here
```
