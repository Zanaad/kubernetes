# Kubernetes Course Exercises

Exercises for [DevOps with Kubernetes](https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes-2026) (University of Helsinki).
Each exercise has a release with the exercise number as its tag, and each link below points to that release and the directory of the exercise.

Applications:

- [log-output-app](log-output-app) - Log output application (writer and reader containers)
- [ping-pong-app](ping-pong-app) - Ping-pong counter used by Log output
- [todo-project](todo-project) - The course project: todo-app, todo-backend, todo-job and broadcaster
- [dummysite](dummysite) - DummySite custom resource and controller
- [istio-bookinfo](istio-bookinfo) - Istio ambient mesh with the Bookinfo sample app
- [log-output-mesh](log-output-mesh) and [greeter-app](greeter-app) - Log output in the Istio mesh with a greeter service and traffic splitting
- [wikipedia-app](wikipedia-app) - nginx serving Wikipedia pages with an init container and a sidecar
- [knative](knative) - Knative Serving on k3d with the getting started examples
- [dwk-project-code](https://github.com/Zanaad/dwk-project-code) and [dwk-project-gitops](https://github.com/Zanaad/dwk-project-gitops) - the project's code and configuration repositories (exercise 4.10)

## Part 1: Kubernetes basics (course chapter 2)

| Exercise | Title | Link |
|---|---|---|
| [1.1](https://github.com/Zanaad/kubernetes/tree/1.1) | Getting started | [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.1/log-output-app) |
| [1.2](https://github.com/Zanaad/kubernetes/tree/1.2) | The project, step 1 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.2/todo-app) |
| [1.3](https://github.com/Zanaad/kubernetes/tree/1.3) | Declarative approach | [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.3/log-output-app) |
| [1.4](https://github.com/Zanaad/kubernetes/tree/1.4) | The project, step 2 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.4/todo-app) |
| [1.5](https://github.com/Zanaad/kubernetes/tree/1.5) | The project, step 3 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.5/todo-app) |
| [1.6](https://github.com/Zanaad/kubernetes/tree/1.6) | The project, step 4 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.6/todo-app) |
| [1.7](https://github.com/Zanaad/kubernetes/tree/1.7) | External access with Ingress | [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.7/log-output-app) |
| [1.8](https://github.com/Zanaad/kubernetes/tree/1.8) | The project, step 5 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.8/todo-app) |
| [1.9](https://github.com/Zanaad/kubernetes/tree/1.9) | More services | [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/1.9/ping-pong-app), [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.9/log-output-app) |
| [1.10](https://github.com/Zanaad/kubernetes/tree/1.10) | Even more services | [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.10/log-output-app) |
| [1.11](https://github.com/Zanaad/kubernetes/tree/1.11) | Persisting data | [log-output-app](https://github.com/Zanaad/kubernetes/tree/1.11/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/1.11/ping-pong-app) |
| [1.12](https://github.com/Zanaad/kubernetes/tree/1.12) | The project, step 6 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.12/todo-app) |
| [1.13](https://github.com/Zanaad/kubernetes/tree/1.13) | The project, step 7 | [todo-app](https://github.com/Zanaad/kubernetes/tree/1.13/todo-app) |

## Part 2: More building blocks (course chapter 3)

| Exercise | Title | Link |
|---|---|---|
| [2.1](https://github.com/Zanaad/kubernetes/tree/2.1) | Connecting pods | [log-output-app](https://github.com/Zanaad/kubernetes/tree/2.1/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/2.1/ping-pong-app) |
| [2.2](https://github.com/Zanaad/kubernetes/tree/2.2) | The project, step 8 | [todo-app](https://github.com/Zanaad/kubernetes/tree/2.2/todo-app), [todo-backend](https://github.com/Zanaad/kubernetes/tree/2.2/todo-backend) |
| [2.3](https://github.com/Zanaad/kubernetes/tree/2.3) | Keep them separated | [log-output-app](https://github.com/Zanaad/kubernetes/tree/2.3/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/2.3/ping-pong-app) |
| [2.4](https://github.com/Zanaad/kubernetes/tree/2.4) | The project, step 9 | [todo-app](https://github.com/Zanaad/kubernetes/tree/2.4/todo-app), [todo-backend](https://github.com/Zanaad/kubernetes/tree/2.4/todo-backend) |
| [2.5](https://github.com/Zanaad/kubernetes/tree/2.5) | Documentation and ConfigMaps | [log-output-app](https://github.com/Zanaad/kubernetes/tree/2.5/log-output-app) |
| [2.6](https://github.com/Zanaad/kubernetes/tree/2.6) | The project, step 10 | [todo-app](https://github.com/Zanaad/kubernetes/tree/2.6/todo-app) |
| [2.7](https://github.com/Zanaad/kubernetes/tree/2.7) | Stateful applications | [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/2.7/ping-pong-app) |
| [2.8](https://github.com/Zanaad/kubernetes/tree/2.8) | The project, step 11 | [todo-backend](https://github.com/Zanaad/kubernetes/tree/2.8/todo-backend) |
| [2.9](https://github.com/Zanaad/kubernetes/tree/2.9) | The project, step 12 | [todo-job](https://github.com/Zanaad/kubernetes/tree/2.9/todo-job) |
| [2.10](https://github.com/Zanaad/kubernetes/tree/2.10) | The project, step 13 | [todo-backend](https://github.com/Zanaad/kubernetes/tree/2.10/todo-backend) |

## Part 3: To the cloud (course chapter 4)

| Exercise | Title | Link |
|---|---|---|
| [3.1](https://github.com/Zanaad/kubernetes/tree/3.1) | Pingpong GKE | [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/3.1/ping-pong-app) |
| [3.2](https://github.com/Zanaad/kubernetes/tree/3.2) | Back to Ingress | [log-output-app](https://github.com/Zanaad/kubernetes/tree/3.2/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/3.2/ping-pong-app) |
| [3.3](https://github.com/Zanaad/kubernetes/tree/3.3) | To the Gateway | [log-output-app](https://github.com/Zanaad/kubernetes/tree/3.3/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/3.3/ping-pong-app) |
| [3.4](https://github.com/Zanaad/kubernetes/tree/3.4) | Rewritten routing | [log-output-app](https://github.com/Zanaad/kubernetes/tree/3.4/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/3.4/ping-pong-app) |
| [3.5](https://github.com/Zanaad/kubernetes/tree/3.5) | The project, step 14 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.5/todo-project) |
| [3.6](https://github.com/Zanaad/kubernetes/tree/3.6) | The project, step 15 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.6/todo-project), [.github/workflows](https://github.com/Zanaad/kubernetes/tree/3.6/.github/workflows) |
| [3.7](https://github.com/Zanaad/kubernetes/tree/3.7) | The project, step 16 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.7/todo-project), [.github/workflows](https://github.com/Zanaad/kubernetes/tree/3.7/.github/workflows) |
| [3.8](https://github.com/Zanaad/kubernetes/tree/3.8) | The project, step 17 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.8/todo-project), [.github/workflows](https://github.com/Zanaad/kubernetes/tree/3.8/.github/workflows) |
| [3.9](https://github.com/Zanaad/kubernetes/tree/3.9) | DBaaS vs DIY | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.9/todo-project) |
| [3.10](https://github.com/Zanaad/kubernetes/tree/3.10) | The project, step 18 | [todo-project/todo-backend](https://github.com/Zanaad/kubernetes/tree/3.10/todo-project/todo-backend) |
| [3.11](https://github.com/Zanaad/kubernetes/tree/3.11) | The project, step 19 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.11/todo-project) |
| [3.12](https://github.com/Zanaad/kubernetes/tree/3.12) | The project, step 20 | [todo-project](https://github.com/Zanaad/kubernetes/tree/3.12/todo-project) |

## Part 4: GitOps and friends (course chapter 5)

| Exercise | Title | Link |
|---|---|---|
| [4.1](https://github.com/Zanaad/kubernetes/tree/4.1) | Readiness probe | [log-output-app](https://github.com/Zanaad/kubernetes/tree/4.1/log-output-app), [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/4.1/ping-pong-app) |
| [4.2](https://github.com/Zanaad/kubernetes/tree/4.2) | The project, step 21 | [todo-project](https://github.com/Zanaad/kubernetes/tree/4.2/todo-project) |
| [4.3](https://github.com/Zanaad/kubernetes/tree/4.3) | Prometheus | [README.md](https://github.com/Zanaad/kubernetes/tree/4.3) |
| [4.4](https://github.com/Zanaad/kubernetes/tree/4.4) | Your canary | [ping-pong-app](https://github.com/Zanaad/kubernetes/tree/4.4/ping-pong-app) |
| [4.5](https://github.com/Zanaad/kubernetes/tree/4.5) | The project, step 22 | [todo-project](https://github.com/Zanaad/kubernetes/tree/4.5/todo-project) |
| [4.6](https://github.com/Zanaad/kubernetes/tree/4.6) | The project, step 23 | [todo-project/broadcaster](https://github.com/Zanaad/kubernetes/tree/4.6/todo-project/broadcaster) |
| [4.7](https://github.com/Zanaad/kubernetes/tree/4.7) | Baby steps to GitOps | [log-output-app](https://github.com/Zanaad/kubernetes/tree/4.7/log-output-app), [.github/workflows](https://github.com/Zanaad/kubernetes/tree/4.7/.github/workflows) |
| [4.8](https://github.com/Zanaad/kubernetes/tree/4.8) | The project, step 24 | [todo-project](https://github.com/Zanaad/kubernetes/tree/4.8/todo-project) |
| [4.9](https://github.com/Zanaad/kubernetes/tree/4.9) | The project, step 25 | [todo-project](https://github.com/Zanaad/kubernetes/tree/4.9/todo-project) |
| [4.10](https://github.com/Zanaad/kubernetes/tree/4.10) | The project, the grande finale | [todo-project](https://github.com/Zanaad/kubernetes/tree/4.10/todo-project), [dwk-project-code](https://github.com/Zanaad/dwk-project-code), [dwk-project-gitops](https://github.com/Zanaad/dwk-project-gitops) |

## Part 5: Beyond the basics (course chapter 6)

| Exercise | Title | Link |
|---|---|---|
| [5.1](https://github.com/Zanaad/kubernetes/tree/5.1) | DIY CRD & Controller | [dummysite](https://github.com/Zanaad/kubernetes/tree/5.1/dummysite) |
| [5.2](https://github.com/Zanaad/kubernetes/tree/5.2) | Getting started with Istio service mesh | [istio-bookinfo](https://github.com/Zanaad/kubernetes/tree/5.2/istio-bookinfo) |
| [5.3](https://github.com/Zanaad/kubernetes/tree/5.3) | Log app, the Service Mesh Edition | [log-output-mesh](https://github.com/Zanaad/kubernetes/tree/5.3/log-output-mesh), [greeter-app](https://github.com/Zanaad/kubernetes/tree/5.3/greeter-app), [log-output-app](https://github.com/Zanaad/kubernetes/tree/5.3/log-output-app) |
| [5.4](https://github.com/Zanaad/kubernetes/tree/5.4) | Wikipedia with init and sidecar | [wikipedia-app](https://github.com/Zanaad/kubernetes/tree/5.4/wikipedia-app) |
| [5.6](https://github.com/Zanaad/kubernetes/tree/5.6) | Trying serverless | [knative](https://github.com/Zanaad/kubernetes/tree/5.6/knative) |
