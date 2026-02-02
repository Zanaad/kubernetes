# Todo Job

Hourly Kubernetes CronJob that reads a random Wikipedia URL.

**Purpose**: Demonstrates scheduled job execution in Kubernetes.

**Technology**: Bash, curl, Alpine Linux

**Schedule**: Every hour (`0 * * * *`)

**Action**: Fetches `https://en.wikipedia.org/wiki/Special:Random` and logs to stdout
