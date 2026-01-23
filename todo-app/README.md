# Todo App

A simple Node.js HTTP server that serves an interactive todo list web application. On startup it prints "Server started in port N" and listens for GET requests on the root path.

## Rebuild and push the image

```bash
docker build -t zanaad/todo-app:latest .
docker push zanaad/todo-app:latest
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

Or apply all at once:

```bash
kubectl apply -f k8s/
```

## Access the application

The app is exposed via Ingress. Open your browser at `http://localhost:8080`.
