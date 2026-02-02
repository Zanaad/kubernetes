# Todo Project - Multi-Environment GitOps Deployment

Production-ready todo application demonstrating modern Kubernetes DevOps practices with separate staging and production environments using GitOps with ArgoCD.

**Stack**: Node.js, PostgreSQL, NATS, Discord, GKE, Artifact Registry, GitHub Actions, Kustomize, ArgoCD

---

## � Repositories

This project follows **GitOps best practices** with separate repositories for application code and Kubernetes configurations.

### 🔧 [dwk-project-code](https://github.com/Zanaad/dwk-project-code)

**Application Source Code**

Contains all application source code, Dockerfiles, and CI/CD workflows.

**Services**:

- `broadcaster` - NATS→Discord notification service
- `todo-app` - Frontend application with image caching
- `todo-backend` - REST API with PostgreSQL and NATS
- `todo-job` - Scheduled Wikipedia URL fetcher

**CI/CD**: GitHub Actions workflow builds images and updates GitOps repo

---

### ⚙️ [dwk-project-gitops](https://github.com/Zanaad/dwk-project-gitops)

**GitOps Configuration**

Contains all Kubernetes manifests, Kustomize overlays, and ArgoCD applications.

**Structure**:

- `base/` - Shared Kubernetes resources
- `overlays/staging/` - Staging environment configuration
- `overlays/prod/` - Production environment configuration
- ArgoCD application definitions

**Deployment**: ArgoCD watches this repo and automatically syncs to cluster

---

## 🚀 Quick Start

### Deploy to Staging

```bash
# Push to main branch in dwk-project-code
git push origin main
# Automatically builds and deploys to staging
```

### Deploy to Production

```bash
# Create version tag in dwk-project-code
git tag v1.0.0 && git push origin v1.0.0
# Automatically builds and deploys to production
```

---

## 🏗️ Architecture

**Components**:

- **todo-app**: Frontend (Node.js, Express)
- **todo-backend**: REST API (Node.js, PostgreSQL, NATS)
- **broadcaster**: Event consumer (NATS → Discord)
- **todo-job**: CronJob (Bash, hourly Wikipedia fetcher)

**Infrastructure**:

- Kubernetes (GKE)
- PostgreSQL StatefulSet
- NATS messaging
- ArgoCD for GitOps
- Kustomize for multi-environment configs

**Environments**:

- **Staging** (`todo-staging` namespace): Auto-deploys on every commit to main
- **Production** (`todo` namespace): Auto-deploys on version tags only

---

## 🎯 Key Features

✅ **GitOps**: Git as single source of truth  
✅ **Multi-Environment**: Separate staging and production  
✅ **Automated CI/CD**: GitHub Actions + ArgoCD  
✅ **Kustomize**: Environment-specific configurations  
✅ **Event-Driven**: NATS messaging for notifications
