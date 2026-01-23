# Ping-Pong App

Simple Node.js application that responds to GET requests on `/pingpong` with "pong X" where X is an incrementing counter stored in memory.

## Build and push the image

```bash
docker build -t zanaad/ping-pong-app:latest .
docker push zanaad/ping-pong-app:latest
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f ../log-output-app/k8s/ingress.yaml
```

Or from the parent directory:

```bash
kubectl apply -f ping-pong-app/k8s/
kubectl apply -f log-output-app/k8s/ingress.yaml
```

## Access the application

Access the ping-pong endpoint at `http://localhost:8080/pingpong`

The counter increments with each request:

```bash
curl http://localhost:8080/pingpong
# Returns: pong 0
curl http://localhost:8080/pingpong
# Returns: pong 1
```
