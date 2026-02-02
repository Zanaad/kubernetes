# Broadcaster

NATS subscriber that forwards todo creation events to Discord.

**Purpose**: Monitors todo creation events from NATS and posts notifications to Discord webhook.

**Technology**: Node.js, NATS JetStream

**Environment Variables**:

- `NATS_URL` - NATS server connection
- `DISCORD_WEBHOOK_URL` - Discord webhook (empty in staging = logs only)
