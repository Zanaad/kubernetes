# Wikipedia Todo CronJob

A Kubernetes CronJob that generates a new todo every hour to remind you to read a random Wikipedia article.

## How it works

- Fetches a random Wikipedia article URL from `https://en.wikipedia.org/wiki/Special:Random`
- Creates a new todo with text "Read the article at <URL>" in the todo-backend
- Runs every hour at the start of each hour

## Build and push

```bash
docker build -t zanaad/todo-cronjob:latest .
docker push zanaad/todo-cronjob:latest
```

## Deploy

```bash
kubectl apply -f k8s/cronjob.yaml
```

## Check status

```bash
kubens todo
kubectl get cronjobs
kubectl get jobs
kubectl logs -l job-name=<job-name>
```
