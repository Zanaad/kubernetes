# Todo App

An interactive Node.js todo list application with a daily inspirational image.

## Features

- **Interactive Todo List**: Add and delete tasks in real-time
- **Daily Image**: Fetches a random image from Lorem Picsum every 10 minutes
- **Image Caching**: Stores images in a persistent volume so they survive pod restarts
- **10-Minute Cache**: Same image for 10 minutes, then automatically refreshes

## Rebuild and push the image

```bash
docker build -t zanaad/todo-app:latest .
docker push zanaad/todo-app:latest
```

## Deploy to Kubernetes

Apply storage first (PV/PVC for image caching), then the app:

```bash
kubectl apply -f k8s/persistent-volume.yaml
kubectl apply -f k8s/persistent-volume-claim.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/deployment.yaml
```

Or apply all at once:

```bash
kubectl apply -f k8s/
```

## Access the application

Open `http://localhost:8080` to view the todo list with daily image.

The image is cached at `/var/lib/data/cached-image.jpg` in the persistent volume and refreshes every 10 minutes.
