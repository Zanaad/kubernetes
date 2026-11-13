# Istio service mesh with Bookinfo (Exercise 5.2)

The [Istio ambient mode getting-started](https://istio.io/latest/docs/ambient/getting-started/) tutorial on a local k3d cluster, using the Bookinfo sample application. The steps are followed up to, but not including, "Clean up".

Versions: Istio 1.32.0, Gateway API v1.6.1, k3s v1.34.1.

## Cluster and Istio setup

Istio 1.32 requires Kubernetes 1.33 or newer, so the cluster uses k3s v1.34.1 (the default k3d image is v1.31). On this k3s version the CNI plugins live in `/var/lib/rancher/k3s/data/cni`, so `cni.cniBinDir` has to be set for the first install. Otherwise the `ztunnel` pods are stuck in `ContainerCreating` with `failed to find plugin "istio-cni"`.

```bash
k3d cluster create mesh --api-port 6550 -p '9080:80@loadbalancer' -p '9443:443@loadbalancer' \
  --agents 2 --k3s-arg '--disable=traefik@server:*' --image rancher/k3s:v1.34.1-k3s1

curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.32.0 sh -
export PATH=$HOME/istio-1.32.0/bin:$PATH

kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.1/experimental-install.yaml

istioctl install --set profile=ambient --set values.global.platform=k3d \
  --set values.cni.cniBinDir=/var/lib/rancher/k3s/data/cni --skip-confirmation

kubectl apply -f ~/istio-1.32.0/samples/addons/prometheus.yaml
kubectl apply -f ~/istio-1.32.0/samples/addons/kiali.yaml
```

## 1. Deploy the sample application

```bash
cd ~/istio-1.32.0
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
kubectl apply -f samples/bookinfo/platform/kube/bookinfo-versions.yaml

kubectl apply -f samples/bookinfo/gateway-api/bookinfo-gateway.yaml
kubectl annotate gateway bookinfo-gateway networking.istio.io/service-type=ClusterIP --namespace=default

kubectl port-forward svc/bookinfo-gateway-istio 8080:80
```

The application is at http://localhost:8080/productpage.

![Bookinfo product page](images/productpage.png)

## 2. Secure and visualize the application

Adding the namespace to the ambient mesh, with no restarts or sidecars needed:

```bash
kubectl label namespace default istio.io/dataplane-mode=ambient
```

After this the Bookinfo pods use the `HBONE` protocol (mTLS through ztunnel), as shown by `istioctl ztunnel-config workloads`.

Generating traffic and opening Kiali:

```bash
for i in $(seq 1 100); do curl -s -o /dev/null -m 10 http://localhost:8080/productpage; done
istioctl dashboard kiali
```

The tutorial's loop uses `curl -sSI` (HEAD requests) without a timeout, and one of those requests hung. A GET with `-m 10` works reliably: all 100 requests returned `200`.

In Kiali: **Traffic Graph**, namespace **default**, **Display → Security** shows the padlocks on the mTLS connections.

![Kiali traffic graph with mTLS](images/kiali-graph.png)

## 3. Enforce authorization policies

### Layer 4 policy (ztunnel)

[productpage-ztunnel.yaml](productpage-ztunnel.yaml) allows only the ingress gateway to call `productpage`.

```bash
kubectl apply -f productpage-ztunnel.yaml
kubectl apply -f ~/istio-1.32.0/samples/curl/curl.yaml

kubectl exec deploy/curl -- curl -s "http://productpage:9080/productpage"
# command terminated with exit code 56
```

The browser still works because it goes through the gateway.

### Layer 7 policy (waypoint proxy)

```bash
istioctl waypoint apply --enroll-namespace --wait
kubectl apply -f productpage-waypoint.yaml
kubectl apply -f productpage-ztunnel-with-waypoint.yaml
```

- [productpage-waypoint.yaml](productpage-waypoint.yaml): the `curl` service account may only send `GET` requests to `productpage`.
- [productpage-ztunnel-with-waypoint.yaml](productpage-ztunnel-with-waypoint.yaml): the L4 policy also allows traffic from the waypoint.

Results:

```
$ kubectl exec deploy/curl -- curl -s "http://productpage:9080/productpage" -X DELETE
RBAC: access denied

$ kubectl exec deploy/reviews-v1 -- curl -s http://productpage:9080/productpage
RBAC: access denied

$ kubectl exec deploy/curl -- curl -s http://productpage:9080/productpage | grep -o "<title>.*</title>"
<title>Simple Bookstore App</title>
```

## 4. Manage traffic

[reviews-httproute.yaml](reviews-httproute.yaml) sends 90% of requests to `reviews-v1` and 10% to `reviews-v2`.

```bash
kubectl apply -f reviews-httproute.yaml
kubectl exec deploy/curl -- sh -c "for i in \$(seq 1 100); do curl -s http://productpage:9080/productpage | grep reviews-v.-; done"
```

Result of 100 requests: 89 went to `reviews-v1` and 11 to `reviews-v2`.

![Kiali traffic split between reviews versions](images/kiali-traffic-split.png)
