import * as k8s from "@kubernetes/client-node";

const GROUP = "stable.dwk";
const VERSION = "v1";
const PLURAL = "dummysites";

const NGINX_IMAGE = process.env.NGINX_IMAGE || "nginx:1.27-alpine";
const CURL_IMAGE = process.env.CURL_IMAGE || "curlimages/curl:8.11.1";

const kc = new k8s.KubeConfig();
// Uses the pod's service account inside the cluster, ~/.kube/config locally
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);
const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const customApi = kc.makeApiClient(k8s.CustomObjectsApi);

const resourceName = (site) => `${site.metadata.name}-site`;

// Deleting the DummySite makes Kubernetes delete everything it owns
const ownerReference = (site) => ({
  apiVersion: `${GROUP}/${VERSION}`,
  kind: "DummySite",
  name: site.metadata.name,
  uid: site.metadata.uid,
  controller: true,
});

// Init container downloads the page into a shared volume, nginx serves it
const buildDeployment = (site) => {
  const name = resourceName(site);
  return {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name,
      labels: { app: name, "dummysite": site.metadata.name },
      ownerReferences: [ownerReference(site)],
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: name } },
      template: {
        metadata: { labels: { app: name, "dummysite": site.metadata.name } },
        spec: {
          volumes: [{ name: "site", emptyDir: {} }],
          initContainers: [
            {
              name: "fetch-site",
              image: CURL_IMAGE,
              args: [
                "--silent",
                "--show-error",
                "--fail",
                "--location",
                "--user-agent",
                "Mozilla/5.0 (compatible; DummySite/1.0)",
                "--output",
                "/site/index.html",
                site.spec.website_url,
              ],
              volumeMounts: [{ name: "site", mountPath: "/site" }],
            },
          ],
          containers: [
            {
              name: "nginx",
              image: NGINX_IMAGE,
              ports: [{ containerPort: 80 }],
              volumeMounts: [
                { name: "site", mountPath: "/usr/share/nginx/html" },
              ],
            },
          ],
        },
      },
    },
  };
};

const buildService = (site) => {
  const name = resourceName(site);
  return {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: `${name}-svc`,
      labels: { app: name, "dummysite": site.metadata.name },
      ownerReferences: [ownerReference(site)],
    },
    spec: {
      type: "ClusterIP",
      selector: { app: name },
      ports: [{ port: 80, targetPort: 80, protocol: "TCP" }],
    },
  };
};

// Create a resource, treating "already exists" as success so restarts are safe
const createIfMissing = async (kind, name, create) => {
  try {
    await create();
    console.log(`  created ${kind} ${name}`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`  ${kind} ${name} already exists`);
      return;
    }
    throw err;
  }
};

const handleAdd = async (site) => {
  const { name, namespace } = site.metadata;
  const url = site.spec?.website_url;
  console.log(`DummySite ${namespace}/${name} added (website_url: ${url})`);

  if (!url) {
    console.error(`  DummySite ${namespace}/${name} has no website_url, skipping`);
    return;
  }

  try {
    const deployment = buildDeployment(site);
    await createIfMissing("Deployment", deployment.metadata.name, () =>
      appsApi.createNamespacedDeployment({ namespace, body: deployment }),
    );

    const service = buildService(site);
    await createIfMissing("Service", service.metadata.name, () =>
      coreApi.createNamespacedService({ namespace, body: service }),
    );
  } catch (err) {
    console.error(
      `  failed to create resources for ${namespace}/${name}:`,
      err.body || err.message,
    );
  }
};

const informer = k8s.makeInformer(
  kc,
  `/apis/${GROUP}/${VERSION}/${PLURAL}`,
  () => customApi.listClusterCustomObject({ group: GROUP, version: VERSION, plural: PLURAL }),
);

informer.on(k8s.ADD, handleAdd);
informer.on(k8s.DELETE, (site) => {
  const { name, namespace } = site.metadata;
  console.log(
    `DummySite ${namespace}/${name} deleted, Kubernetes removes its Deployment and Service`,
  );
});
informer.on(k8s.ERROR, (err) => {
  console.error("Watch error, restarting in 5 seconds:", err?.message || err);
  setTimeout(() => startInformer(), 5000);
});

const startInformer = async () => {
  try {
    await informer.start();
    console.log(`Watching ${PLURAL}.${GROUP} in all namespaces`);
  } catch (err) {
    console.error("Failed to start watch, retrying in 5 seconds:", err?.message || err);
    setTimeout(() => startInformer(), 5000);
  }
};

startInformer();
