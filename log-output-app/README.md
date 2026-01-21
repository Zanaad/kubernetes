# Log Output App

Node.js app that generates a UUID once at startup, keeps it in memory, and logs it with a timestamp every 5 seconds.

## Run locally

```bash
npm install
npm start
```

## Build, run, and push image

```bash
docker build -t zanaad/log-output-app .
docker run --rm zanaad/log-output-app
docker push zanaad/log-output-app
```

## Deploy to Kubernetes

```bash
k3d cluster create -a 2
kubectl cluster-info
kubectl config use-context k3d-k3s-default
kubectl create deployment log-output-app --image=zanaad/log-output-app
kubectl get deployments
kubectl get pods
kubectl logs -f pod_name_here
```
