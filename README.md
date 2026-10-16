# Fitness Journal

A full-stack fitness tracking application inspired by StrengthLog. Log workouts, track exercises and sets, monitor personal records, and visualize your progress over time.

> 🚧 **In Progress** — core features are live; new features are still being added.

## Live Demo

**Frontend:** fitness-journal-frontend.vercel.app

The frontend is hosted on Vercel and talks to a Spring Boot API hosted on Railway.

---

## Repositories

| Layer    | Repository                                                                      | Stack                                                   |
| -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Frontend | [fitness-journal-frontend](https://github.com/Vasqjr/fitness-journal-frontend) | React, TypeScript, Vite, Axios, Recharts                |
| Backend  | [fitness-journal-backend](https://github.com/Vasqjr/fitness-journal-backend)   | Spring Boot, Spring Security, JWT, PostgreSQL, Flyway   |

---

## Architecture

```
React Frontend (Vercel)
Pages · Components · Auth Context · Axios (JWT interceptor)
        |
        | REST / JSON over HTTPS
        ↓
Spring Boot API (Railway)
├── Controller Layer     (BaseController · Auth · Workout · Exercise · Set)
├── Service Layer        (business logic)
├── Repository Layer     (Spring Data JPA)
├── Entity Layer         (User · Workout · Exercise · WorkoutSet · MuscleGroup)
├── Security             (Spring Security · JWT filter chain · BCrypt)
└── Cross-Cutting        (DTO records · @RestControllerAdvice exception handler · Actuator)
        |
        ↓
PostgreSQL (Railway)
└── Schema managed by Flyway migrations, seeded with exercises
```

**Data model:** `User` → many `Workout` → many `WorkoutSet`. Each set references an `Exercise`, which belongs to a `MuscleGroup`. All entities use UUID primary keys.

---

## Features

- **Authentication** — Register and log in with JWT-based sessions and BCrypt-hashed passwords
- **Workout Logging** — Create workouts and add exercises and sets, with inline set editing
- **Exercise Library** — Browse a seeded exercise list grouped by muscle group, with search
- **Progress Tracking** — Charts of max weight and total volume over time (dual-axis), plus personal records
- **Unit Conversion** — Switch between kg and lbs; preference is saved in the browser
- **Pagination** — Paginated workout listing
- **Protected Routes** — Authenticated pages redirect to login; logged-in users skip the login screen
- **Health Checks** — Spring Actuator endpoint at `/actuator/health`

---

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- React Router
- React Context (auth state)
- Axios (with JWT request interceptor and 401 handling)
- Recharts (progress charts)

### Backend

- Java 17 + Spring Boot 3.4.5 (Maven)
- Spring Security + JWT (jjwt)
- Spring Data JPA + Hibernate
- Flyway (database migrations)
- PostgreSQL
- Spring Actuator

### Infrastructure & Deployment

- **Vercel** — frontend hosting, auto-deploys on push
- **Railway** — backend and PostgreSQL hosting, auto-deploys on push, provides HTTPS
- **Docker** — multi-stage Dockerfile; Docker Compose for local development
- **Kubernetes** — local Minikube manifests (2 app replicas, Postgres, secrets, readiness/liveness probes)
- **AWS (earlier deployment)** — the backend was previously deployed with ECR, ECS Fargate, RDS, and SSM Parameter Store before moving to Railway

---

## Local Development

### Prerequisites

- Docker + Docker Compose
- Node.js 18+
- Java 17+ (only if running the backend outside Docker)

### Running Locally

```bash
# Clone both repositories
git clone https://github.com/Vasqjr/fitness-journal-backend.git
git clone https://github.com/Vasqjr/fitness-journal-frontend.git

# Start backend + database via Docker Compose
cd fitness-journal-backend
docker-compose up

# Start frontend
cd ../fitness-journal-frontend
npm install
npm run dev
```

With Docker Compose, the API runs on `http://localhost:8080` and PostgreSQL is exposed on port `5433`.

### Configuration

**Backend environment variables**

| Variable      | Description                  |
| ------------- | ---------------------------- |
| `DB_URL`      | JDBC connection URL          |
| `DB_USERNAME` | Database username            |
| `DB_PASSWORD` | Database password            |
| `JWT_SECRET`  | Secret used to sign JWTs     |

**Frontend environment variables**

| Variable       | Description                                              |
| -------------- | -------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:8080`) |

---

## Running on Kubernetes (Minikube)

```bash
# Build the image and load it into Minikube
docker build -t springboot-app:latest .
minikube image load springboot-app:latest

# Apply manifests
kubectl create namespace fitness-journal
kubectl apply -f secret.yaml -f postgres.yaml -f deployment.yaml
```

The deployment runs two replicas with readiness and liveness probes on `/actuator/health`.

---

## Roadmap

- [x] Spring Boot project structure
- [x] Database schema, JPA entities, and Flyway migrations
- [x] JWT authentication
- [x] Workout, exercise, and set CRUD endpoints
- [x] React frontend — auth flow
- [x] React frontend — workout logging UI
- [x] Progress visualization, charts, and personal records
- [x] Dockerized backend with Docker Compose
- [x] Production deployment (Vercel + Railway)
- [x] Kubernetes manifests for local cluster
- [ ] CI pipeline (GitHub Actions)
- [ ] JWT refresh tokens
- [ ] Tighter CORS configuration for production domains
