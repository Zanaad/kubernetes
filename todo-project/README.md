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

## 3.9 DBaaS vs DIY Database Comparison

### Cloud SQL (DBaaS)

**Pros**:

- Automated backups with point-in-time recovery (no setup required)
- Automatic patching and version upgrades
- High availability with automatic failover
- Zero maintenance overhead for DB infrastructure
- Built-in monitoring and performance insights
- Scales vertically with a click

**Cons**:

- Higher operational costs (managed service premium)
- Vendor lock-in to GCP
- Network latency (external to cluster)
- Additional IAM and network configuration
- Less control over DB configuration

**Setup**: Cloud SQL instance + Cloud SQL Proxy sidecar, configure private IP or Cloud SQL Auth Proxy

**Backups**: Automatic daily backups, configurable retention, one-click restore

---

### Self-Managed Postgres (DIY)

**Pros**:

- Lower cost (only storage + compute overhead)
- Full control over configuration and tuning
- Runs inside cluster (lower latency)
- No vendor lock-in (portable across clouds)
- Simpler development setup (same config everywhere)

**Cons**:

- Manual backup configuration required
- Responsible for patching and upgrades
- Must handle HA/replication manually
- StatefulSet complexity (storage classes, PVCs)
- No built-in performance monitoring

**Setup**: StatefulSet + PVC + secret management (current implementation)

**Backups**: Manual setup via CronJob with `pg_dump` or volume snapshots, restore requires manual steps

---

**Current Choice**: DIY Postgres StatefulSet with PersistentVolumes for simplicity and cost efficiency in development/testing environments. For production workloads with strict SLA requirements, Cloud SQL is recommended.
