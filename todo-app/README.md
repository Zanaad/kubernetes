# Todo App

A simple Node.js HTTP server that serves an interactive todo list web application. On startup it prints "Server started in port N" and listens for GET requests on the root path.

## Delete the old cluster

```bash
k3d cluster delete
```

## Create a new cluster with an open port

```bash
k3d cluster create --port 8082:30080@agent:0 -p 8080:80@loadbalancer --agents 2
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Access the application

NodePort listens on 30080. With the k3d port mapping above, open your browser at `http://localhost:8082`.
