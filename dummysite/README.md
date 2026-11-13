# DummySite (Exercise 5.1)

A custom resource `DummySite` with a `website_url` field, and a controller that serves a copy of that website inside the cluster.

## How it works

- `manifests/crd.yaml` adds the `DummySite` resource type (`stable.dwk/v1`) to Kubernetes.
- The **controller** (`controller/index.js`, Node.js with `@kubernetes/client-node`) watches DummySites in all namespaces. For each new one it creates:
  - a **Deployment** `<name>-site`, where an init container (`curl`) downloads `website_url` into a shared `emptyDir` volume and an `nginx` container serves it,
  - a **Service** `<name>-site-svc` (ClusterIP, port 80).
- Both resources have an owner reference to the DummySite, so deleting the DummySite deletes them too.
- The controller runs as `dummysite-controller-account`, which the ClusterRole allows to watch DummySites and create Deployments and Services.

## Build the controller image

```bash
cd dummysite/controller
docker build -t zanaad/dummysite-controller:v1 .

# Either load it straight into the k3d cluster...
k3d image import zanaad/dummysite-controller:v1 -c mesh
# ...or push it to Docker Hub
docker push zanaad/dummysite-controller:v1
```

## Deploy

```bash
cd dummysite/manifests

kubectl apply -f crd.yaml
kubectl apply -f clusterrole.yaml -f serviceaccount.yaml -f clusterrolebinding.yaml
kubectl apply -f deployment.yaml
kubectl apply -f dummysite.yaml
```

## Test

```bash
kubectl get dummysites
kubectl logs deployment/dummysite-controller-dep
kubectl get deploy,svc,pods -l dummysite=example

kubectl port-forward svc/example-site-svc 8080:80
# open http://localhost:8080 - a copy of https://example.com/
```

A more complex site (the CSS can be broken in the copy, as the exercise allows):

```bash
kubectl apply -f dummysite-wikipedia.yaml
kubectl port-forward svc/wikipedia-site-svc 8081:80
# open http://localhost:8081
```

Deleting a DummySite also removes its Deployment and Service:

```bash
kubectl delete dummysite example
kubectl get deploy,svc -l dummysite=example
```
