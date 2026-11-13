# Greeter

Small HTTP service used by Log output in the service mesh setup (exercise 5.3).

- `GET /` responds with `<GREETING> from greeter <VERSION>`, e.g. `Hello from greeter v1`
- `GET /healthz` responds with `OK`

Environment variables:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port to listen on |
| `GREETING` | `Hello` | The greeting text |
| `VERSION` | `v1` | Version shown in the response |

Both greeter versions in [log-output-mesh](../log-output-mesh) use the same image with different `GREETING` and `VERSION` values.

```bash
docker build -t zanaad/greeter-app:1.0 .
docker run -p 3000:3000 -e GREETING=Moi -e VERSION=v2 zanaad/greeter-app:1.0
curl localhost:3000/   # Moi from greeter v2
```
