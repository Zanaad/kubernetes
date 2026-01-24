# Log Output App

A two-container application running in a single pod:

- **log-writer-app**: Generates a random UUID at startup and writes timestamped log lines to a shared file every 5 seconds
- **log-reader-app**: Reads the shared log file and serves its content via HTTP endpoint

Both containers share a volume mounted at `/var/log/shared/` to enable file-based communication.

## Architecture

The app demonstrates multi-container pod patterns in Kubernetes:

- Writer container continuously appends `timestamp: uuid` to `/var/log/shared/log.txt`
- Reader container serves the file content at `GET /`
- Shared `emptyDir` volume enables inter-container communication

## Build and push images

Build and push the log-writer:

```bash
cd log-writer-app
docker build -t zanaad/log-writer-app:latest .
docker push zanaad/log-writer-app:latest
```

Build and push the log-reader:

```bash
cd log-reader-app
docker build -t zanaad/log-reader-app:latest .
docker push zanaad/log-reader-app:latest
```

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

## Access the application

Access the log output at `http://localhost:8080/`

The page displays all timestamped log entries written by the writer container.

## Check logs

View writer container logs:

```bash
kubectl logs deployment/log-output-app -c log-writer-app -f
```

View reader container logs:

```bash
kubectl logs deployment/log-output-app -c log-reader-app -f
```
