# Todo Project

Production todo app with GitOps deployment using ArgoCD.

**Stack**: Node.js, Postgres, NATS, Discord, GKE, Artifact Registry, GitHub Actions, Kustomize, ArgoCD

## Architecture

- **todo-app**: Frontend with image caching
- **todo-backend**: REST API + Postgres StatefulSet + NATS publisher
- **broadcaster**: NATS subscriber → Discord webhook notifications
- **todo-job**: Hourly Wikipedia reading reminder CronJob

## GitOps with ArgoCD

**Status:** ✅ Fully automated GitOps deployment enabled

### Workflow

```
Code Push → GitHub Actions builds images → Updates kustomization.yaml → ArgoCD syncs → Deployed
```

1. **Developer** pushes code to `main` branch
2. **GitHub Actions** builds Docker images with commit SHA tags
3. **GitHub Actions** pushes images to Google Artifact Registry
4. **GitHub Actions** updates `kustomization.yaml` with new image tags
5. **GitHub Actions** commits changes back to repository
6. **ArgoCD** detects changes (auto-sync enabled)
7. **ArgoCD** deploys new images to cluster automatically

**No manual `kubectl apply` needed!**

### ArgoCD Application

- **Repository**: GitHub kubernetes repo
- **Path**: `todo-project`
- **Sync Policy**: Automatic
- **Namespace**: `todo`
- **Sync Frequency**: ~3 minutes

## CI/CD Pipelines

### Deploy (`.github/workflows/todo-deploy.yaml`)

- **Trigger**: Push to `main` (or any branch)
- **Actions**:
  - Build all 4 images (app, backend, broadcaster, job)
  - Push to Artifact Registry with tag `<branch>-<commit-sha>`
  - Update kustomization.yaml with new image references
  - Commit to repository
- **ArgoCD**: Auto-syncs changes to cluster

### Cleanup (`.github/workflows/delete-env.yaml`)

- **Trigger**: Branch deletion
- **Actions**: Deletes namespace (except `main`)

**Required Secrets**: `GKE_PROJECT`, `GKE_SA_KEY`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`

## Deployment

**Cluster**: `dwk-cluster` (europe-west3-b)

**GitOps Deployment** (recommended):

```bash
# Changes auto-deploy via ArgoCD
git add .
git commit -m "Update application"
git push
# Wait ~3 minutes for ArgoCD to sync
```

**Manual Deployment** (for testing):

```bash
gcloud container clusters get-credentials dwk-cluster --zone europe-west3-b
kubectl create namespace todo
cd todo-project
kustomize build . | kubectl apply -f -
```

**Access**:

```bash
kubectl get ingress todo-app-ingress -n todo
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
