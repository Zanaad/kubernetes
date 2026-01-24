# Todo App

An interactive Node.js todo list application with a daily inspirational image. Keep track of your tasks with a beautiful, responsive interface.

## Features

- **Interactive Todo List**: Add and delete tasks in real-time
- **Character Limit**: Todos are limited to 140 characters with live counter feedback
- **Beautiful UI**: Vertical layout with image on top, clean design with smooth animations
- **Daily Image**: Fetches a random image from Lorem Picsum every 10 minutes
- **Image Caching**: Stores images in a persistent volume so they survive pod restarts
- **10-Minute Cache**: Same image for 10 minutes, then automatically refreshes
- **Keyboard Support**: Press Enter to add todos quickly
- **Task Counter**: Shows total number of tasks

## Rebuild and push the image

```bash
docker build -t zanaad/todo-app:latest .
docker push zanaad/todo-app:latest
```

## Deploy to Kubernetes

Restart existing deployment:

```bash
kubectl rollout restart deployment/todo-app
```

## Access the application

Open `http://localhost:8080` to view the todo list with daily image.

## Screenshot

![Todo App Screenshot](image.png)
