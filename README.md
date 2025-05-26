# ✈️ BizAway Interview Project

A Node.js application built with **NestJS** and **GraphQL** to power trip search, booking, and management features. It integrates with a third-party trip provider API and supports optional Redis and MongoDB functionality using Docker.

---

## 🚀 Features

- Search for trips between supported airports
- Sort by `fastest` (duration) or `cheapest` (cost)
- Book, update, list, and delete trips per user
- Caching support with Redis
- GraphQL API with full schema exposure
- Environment-based configuration
- Ready-to-use Docker + `docker-compose` setup

---

## 🧱 Tech Stack

- **NestJS** + **GraphQL**
- **MongoDB** for persistence
- **Redis** for caching
- **Docker** and **Docker Compose** for containerized environment
- **Jest** for unit testing

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Andriipalamarchuk/bizaway-interview.git
cd bizaway-interview
```

### 2. Create .env file with following properties
### Database
- **DATABASE_USERNAME**
- **DATABASE_PASSWORD**
- **DATABASE_PORT**
- **DATABASE_NAME**
- **DATABASE_DESTINATION_COLLECTION_NAME**
- **DATABASE_HOST**

### Redis
- **REDIS_HOST**
- **REDIS_PASSWORD**
- **REDIS_PORT**

### Node
- **NODE_PORT**
- **LOG_LEVEL**
- **GRAPHQL_PLAYGROUND**
- **BIZAWAY_GET_TRIPS_URL**
- **BIZAWAY_API_KEY**
- **JWT_TOKEN**

## 🐳 Running with Docker
Execute following command
```bash
docker compose up -d
```

## 🧪 Testing
```bash
npm run test
```

## 📘 API Overview
GraphQL schema is self-documented at:
```bash
http://localhost:3000/graphql
```

## 📌 TODOs & Ideas
- Add Swagger for REST endpoints (if any)
- Add integration tests
- Extend trip manager with tags or notes
- Implement rate limiting
- Add pagination on Bizaway API and users endpoint
