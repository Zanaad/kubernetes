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

## Database Backups

**Backup Strategy**: Daily automated backups to Google Cloud Storage (GCS)

**Setup**:

1. Create GCS bucket: `gsutil mb -l europe-west3 gs://<bucket-name>`
2. Create service account with Storage Admin role
3. Create Kubernetes secret: `kubectl create secret generic gcs-backup-key --from-file=key.json=<path-to-key> -n todo`

**CronJob**: Runs daily at midnight, exports database with `pg_dump`, uploads to GCS with timestamp

**Restore**: Download backup from GCS and restore with `psql -U <user> -d <db> < backup.sql`

## Monitoring & Logging

**GKE Observability** (enabled by default):

- **Cloud Logging**: View pod logs and application events
- **Cloud Monitoring**: Track CPU, memory, and custom metrics
- **Dashboards**: Pre-built GKE dashboards available

**View Logs**:

1. Go to Cloud Console → **Logs Explorer**
2. Use query:

```
resource.type="k8s_container"
resource.labels.namespace_name="todo"
resource.labels.pod_name=~"todo-backend.*"
```

3. See JSON logs for todos: `{"event":"createTodo", "outcome":"success", "text":"...", "length":65}`

**View Metrics**:

1. Go to Cloud Console → **Cloud Monitoring**
2. View **GKE Dashboards** for CPU, memory, pod count
3. Check resource requests vs actual usage with `kubectl top pods -n todo`

![Cloud Logging](image.png)
