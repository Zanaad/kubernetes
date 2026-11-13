# Wikipedia with init and sidecar (Exercise 5.4)

A pod that serves Wikipedia pages with nginx. All three containers share an `emptyDir` volume, which is nginx's public www directory.

| Container | Type | What it does |
|---|---|---|
| `fetch-kubernetes-page` | init container | Downloads https://en.wikipedia.org/wiki/Kubernetes to `index.html` before the other containers start |
| `random-page-sidecar` | sidecar | Waits a random 5-15 minutes, downloads a random article from https://en.wikipedia.org/wiki/Special:Random over `index.html`, and repeats |
| `nginx` | main container | Serves whatever is in the www directory (mounted read-only) |

The sidecar is a [native sidecar](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/): an init container with `restartPolicy: Always`. Kubernetes starts it after the init container has saved the Kubernetes article and keeps it running next to nginx for the life of the pod.

The sidecar downloads to `index.html.tmp` first and then moves it over `index.html`, so nginx never serves a half-written page. The wait range is set with the `MIN_WAIT_SECONDS` and `MAX_WAIT_SECONDS` environment variables (default 300 and 900).

All containers use public images (`curlimages/curl`, `nginx`), so there is nothing to build.

## Deploy

```bash
kubectl apply -f namespace.yaml
kubectl apply -f deployment.yaml -f service.yaml
kubectl get pods -n wikipedia     # READY 2/2: nginx and the sidecar
```

## Test

```bash
kubectl port-forward -n wikipedia svc/wikipedia-app-svc 8090:80
# open http://localhost:8090 - first the Kubernetes article
```

```
$ kubectl logs -n wikipedia deploy/wikipedia-app -c random-page-sidecar
Waiting 502 seconds before fetching a random page
```

Testing the sidecar with a shorter wait:

```
$ kubectl set env -n wikipedia deploy/wikipedia-app -c random-page-sidecar MIN_WAIT_SECONDS=10 MAX_WAIT_SECONDS=20
$ kubectl logs -n wikipedia deploy/wikipedia-app -c random-page-sidecar
Waiting 17 seconds before fetching a random page
Saved: José Arana (footballer, born 1902) - Wikipedia
Waiting 17 seconds before fetching a random page
Saved: Boxing at the 2026 Commonwealth Games – Women's 65 kg - Wikipedia
```

After each `Saved` line, http://localhost:8090 shows that article. `kubectl apply -f deployment.yaml` restores the 5-15 minute wait.

As the exercise allows, the CSS of the saved pages can be broken, because the stylesheets use relative links to Wikipedia.
