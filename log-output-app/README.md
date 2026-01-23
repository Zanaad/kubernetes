# Log Output App

Node.js app that generates a UUID once at startup, keeps it in memory, and logs it with a timestamp every 5 seconds. Exposes an HTTP endpoint at `/status` to retrieve the current timestamp and random string.

## Rebuild and push the image

```bash
docker build -t zanaad/log-output-app:latest .
docker push zanaad/log-output-app:latest
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

Access the root endpoint at `http://localhost:8080` and the status endpoint at `http://localhost:8080/status`.

## Check logs

```bash
kubectl logs -f deployment/log-output-app
```
