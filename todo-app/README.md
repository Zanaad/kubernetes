# Todo App (Course Project Step 1)

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
kubectl create deployment todo-app --image=zanaad/todo-app
kubectl get deployments
kubectl get pods
kubectl logs -f pod_name_here
```
