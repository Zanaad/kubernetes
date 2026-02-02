# Todo Backend

REST API with PostgreSQL storage and NATS event publishing.

**Purpose**: Provides todo CRUD operations, persists data to PostgreSQL, and publishes events to NATS.

**Technology**: Node.js, Express, PostgreSQL, NATS

**API Endpoints**:

- `GET /todos` - List todos
- `POST /todos` - Create todo (publishes NATS event)
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo
- `GET /healthz` - Health check

**Database**: PostgreSQL with automated migrations
