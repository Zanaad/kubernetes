# Ping-pong as a serverless service (Exercise 5.7)

The Log output application with Ping-pong running as a [Knative Service](https://knative.dev/docs/serving/convert-deployment-to-knative-service/) on the Knative cluster from [exercise 5.6](../knative/README.md). Knative creates the deployment, routes and revisions for Ping-pong, and scales it to zero pods when there is no traffic.

| File | What it contains |
|---|---|
| [ping-pong-ksvc.yaml](ping-pong-ksvc.yaml) | Ping-pong as a Knative Service (`serving.knative.dev/v1`) |
| [log-output.yaml](log-output.yaml) | Log output deployment, ConfigMap and a NodePort service |
| [postgres.yaml](postgres.yaml) | Postgres StatefulSet for the Ping-pong counter |
| [namespace.yaml](namespace.yaml) | Namespace `log-pong` |

Changes compared to the earlier Ping-pong deployment:

- The `Deployment` and `Service` are replaced with a single Knative `Service`.
- `PORT` is no longer set in the manifest. Knative sets it from `containerPort`, and the app already reads the port from `PORT`.
- The readiness probe has no port, because Knative probes the container port itself.
- Log output calls Ping-pong with the fully qualified name `http://ping-pong-app.log-pong.svc.cluster.local`, as the exercise tips recommend. Knative's `ping-pong-app` service points to the Kourier gateway, which routes the request to the current revision.
- Log output has no readiness probe in this setup. Its `/readyz` calls Ping-pong, and checking it every few seconds would keep Ping-pong from ever scaling to zero.
- All images come from Docker Hub, because Knative resolves image tags from the registry.

## Deploy

```bash
kubectl apply -f namespace.yaml
kubectl create secret generic postgres-secret -n log-pong \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=<password> \
  --from-literal=POSTGRES_DB=logpong
kubectl apply -f postgres.yaml
kubectl apply -f ping-pong-ksvc.yaml
kubectl apply -f log-output.yaml
```

```
$ kubectl get ksvc -n log-pong
NAME            URL                                                 LATESTCREATED         LATESTREADY           READY
ping-pong-app   http://ping-pong-app.log-pong.172.18.0.2.sslip.io   ping-pong-app-00001   ping-pong-app-00001   True
```

## Test

Log output is exposed with NodePort 30080, which the cluster maps to `localhost:8082`. Ping-pong is reached through Kourier on `localhost:8081`, or directly with its sslip.io URL:

```
$ curl localhost:8082/
file content: this text is from file
env variable: MESSAGE=hello world
2026-11-13T21:58:55.242Z: d713f2d9-0dac-40ce-afe4-8d18c97ff8c1
Ping / Pongs: 0

$ curl -H "Host: ping-pong-app.log-pong.172.18.0.2.sslip.io" http://localhost:8081/
pong 0
$ curl http://ping-pong-app.log-pong.172.18.0.2.sslip.io/
pong 3

$ curl localhost:8082/ | tail -1
Ping / Pongs: 4
```

### Scaling to zero

```
# about 87 seconds without traffic later
$ kubectl get pods -n log-pong
NAME                              READY   STATUS    RESTARTS   AGE
log-output-app-7558cbb7d7-6gsd8   2/2     Running   0          108s
postgres-stset-0                  1/1     Running   0          2m17s

$ curl localhost:8082/ | tail -1
Ping / Pongs: 4        # 1.5 s, Knative started a new Ping-pong pod (cold start)
                       # the next request took 0.03 s

$ kubectl get pods -n log-pong
NAME                                              READY   STATUS    RESTARTS   AGE
log-output-app-7558cbb7d7-6gsd8                   2/2     Running   0          109s
ping-pong-app-00001-deployment-8455b44b49-77987   2/2     Running   0          1s
postgres-stset-0                                  1/1     Running   0          2m18s
```

The counter survives scaling to zero because it is stored in Postgres.
