# Todo App

A simple Node.js HTTP server that serves an interactive todo list web application. On startup it prints "Server started in port N" and listens for GET requests on the root path.

## Rebuild and push the image

```bash
docker build -t zanaad/todo-app:latest .
docker push zanaad/todo-app:latest
```

## Redeploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

## Access the application

```bash
kubectl port-forward deployment/todo-app 3000:3000
```

Then open your browser at `http://localhost:3000`
