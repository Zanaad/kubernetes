# Todo Project

Production todo app deployed to GKE with automated CI/CD.

**Stack**: Node.js, Postgres, GKE, Artifact Registry, GitHub Actions, Kustomize

## Architecture

- **todo-app**: Frontend with image caching
- **todo-backend**: REST API + Postgres StatefulSet
- **todo-job**: Hourly Wikipedia reading reminder CronJob

## CI/CD Pipelines

### Deploy (`.github/workflows/todo-deploy.yaml`)

- **Trigger**: Push to any branch
- **Actions**: Build images → Push to Artifact Registry → Deploy to GKE
- **Namespaces**: `main` → `todo`, other branches → `<branch-name>`

### Cleanup (`.github/workflows/delete-env.yaml`)

- **Trigger**: Branch deletion
- **Actions**: Deletes namespace (except `main`)

**Required Secrets**: `GKE_PROJECT`, `GKE_SA_KEY`, `SOPS_AGE_KEY`

## Deployment

**Cluster**: `dwk-cluster` (europe-west3-b)

**Deploy manually**:

```bash
gcloud container clusters get-credentials dwk-cluster --zone europe-west3-b
kubectl create namespace <namespace>
sops -d todo-backend/k8s/secret.enc.yaml | kubectl apply -n <namespace> -f -
cd todo-project && kustomize edit set namespace <namespace> && kustomize build . | kubectl apply -f -
```

**Access**:

```bash
kubectl get ingress todo-app-ingress -n <namespace>
```

Visit: `http://<INGRESS-IP>/`
