# Trying serverless with Knative (Exercise 5.6)

Knative Serving installed on a local k3d cluster, with the three getting started examples: [deploying a Knative Service](https://knative.dev/docs/getting-started/first-service/), [autoscaling](https://knative.dev/docs/getting-started/first-autoscale/) and [traffic splitting](https://knative.dev/docs/getting-started/first-traffic-split/).

Versions: Knative Serving v1.24.0, net-kourier v1.24.0, k3s v1.34.1.

## Cluster

A cluster without Traefik, so that Kourier can use port 80 of the k3d load balancer (mapped to `localhost:8081`):

```bash
k3d cluster create knative --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 \
  --k3s-arg "--disable=traefik@server:0" --image rancher/k3s:v1.34.1-k3s1
```

With a second k3d cluster running at the same time, the node failed to start with `failed to create fsnotify watcher: too many open files`. The Linux default `fs.inotify.max_user_instances=128` is too low for two clusters, so either raise it or run one cluster at a time.

## Install Knative Serving

Following [Installing Knative Serving using YAML files](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/), with Kourier as the networking layer and Magic DNS (sslip.io):

```bash
R=https://github.com/knative/serving/releases/download/knative-v1.24.0
kubectl apply -f $R/serving-crds.yaml
kubectl apply -f $R/serving-core.yaml

kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.24.0/kourier.yaml
kubectl patch configmap/config-network --namespace knative-serving --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

### Fixing the crashing pods

After the install, `controller`, `webhook` and `net-kourier-controller` were in `CrashLoopBackOff`, and `activator` and `autoscaler` kept restarting. The logs of a crashing pod showed the reason:

```
$ kubectl logs -n knative-serving deploy/webhook --previous
..."message":"Version check failed",
"error":"kubernetes version \"1.34.1+k3s1\" is not compatible, need at least \"1.35.0-0\"
(this can be overridden with the env var \"KUBERNETES_MIN_VERSION\")"
```

Knative v1.24.0 requires Kubernetes 1.35, but the cluster runs 1.34. As the error message suggests, the version check can be overridden with an environment variable:

```bash
kubectl set env deployment --all -n knative-serving KUBERNETES_MIN_VERSION=1.34.0
```

After that, all pods in `knative-serving` and `kourier-system` were `1/1 Running`.

### Magic DNS

```bash
kubectl apply -f $R/serving-default-domain.yaml
```

The job set the default domain to `172.18.0.2.sslip.io`, so the services get URLs like `http://hello.default.172.18.0.2.sslip.io`.

## 1. Deploying a Knative Service

[hello.yaml](hello.yaml):

```
$ kubectl apply -f hello.yaml
$ kubectl get ksvc
NAME    URL                                        LATESTCREATED   LATESTREADY   READY
hello   http://hello.default.172.18.0.2.sslip.io   hello-00001     hello-00001   True

$ curl -H "Host: hello.default.172.18.0.2.sslip.io" http://localhost:8081
Hello World!
```

## 2. Autoscaling

Knative scales the service to zero pods when it gets no traffic and starts a pod again on the next request:

```
$ kubectl get pods -l serving.knative.dev/service=hello
hello-00001-deployment-77d589f787-qmfvz   2/2   Running   0     17s

# about 84 seconds without traffic later
$ kubectl get pods -l serving.knative.dev/service=hello
No resources found in default namespace.

$ curl -H "Host: hello.default.172.18.0.2.sslip.io" http://localhost:8081
Hello World!        # 0.86 s, a new pod was started (cold start)
                    # the next request took 0.007 s

$ kubectl get pods -l serving.knative.dev/service=hello
hello-00001-deployment-77d589f787-4mxj8   2/2   Running   0     1s
```

## 3. Traffic splitting

[hello-v2.yaml](hello-v2.yaml) changes `TARGET` to `Knative`, which creates revision `hello-00002`. The new revision gets all the traffic:

```
$ kubectl apply -f hello-v2.yaml
$ kubectl get revisions
NAME          CONFIG NAME   GENERATION   READY
hello-00001   hello         1            True
hello-00002   hello         2            True

$ curl -H "Host: hello.default.172.18.0.2.sslip.io" http://localhost:8081
Hello Knative!
```

[hello-traffic-split.yaml](hello-traffic-split.yaml) splits the traffic 50/50 between the latest revision and `hello-00001`:

```
$ kubectl apply -f hello-traffic-split.yaml
$ for i in $(seq 1 100); do curl -s -H "Host: hello.default.172.18.0.2.sslip.io" http://localhost:8081; done | sort | uniq -c
     48 Hello Knative!
     52 Hello World!
```
