# Fitness-Journal-Documentation

A full-stack fitness tracking application inspired by Strengthlog. Log workouts, track exercises, monitor progress, and visualize performance over time.

> 🚧 **In Progress** — backend and frontend in active development.
## Live Project Link
https://fitness-journal-frontend-pmf0w2pu2-jr-ay-v20.vercel.app/
---

## Repositories

| Layer | Repository | Stack |
|-------|-----------|-------|
| Frontend | [fitness-journal-frontend](https://github.com/Vasqjr/fitness-journal-frontend) | React, TypeScript, Axios |
| Backend | [fitness-journal-backend](https://github.com/Vasqjr/fitness-journal-backend) | Spring Boot, Spring Security, JWT, PostgreSQL |

---

## Architecture

```
React Frontend (Pages · Components · Axios)
        |
        | REST / JSON
        ↓
Spring Boot Application
├── Controller Layer     (Auth · User · Workout · Exercise · Set)
├── Service Layer        (Auth · User · Workout · Exercise · Progress)
├── Repository Layer     (Spring Data JPA)
├── Entity / Model Layer (User · Workout · Exercise · WorkoutSet · MuscleGroup · ProgressEntry)
├── Security             (Spring Security · JWT · JwtFilter · SecurityConfig)
└── Cross-Cutting        (DTOs · Mappers · GlobalExceptionHandler)
        |
        ↓
Infrastructure (AWS)
├── RDS        — PostgreSQL production database
├── ECS / EC2  — Docker container hosting
└── ECR        — Docker image registry

Local Development
└── Docker Compose (Spring Boot + PostgreSQL containers)
```

---

## Features

- **Authentication** — Secure register/login with JWT-based session management
- **Workout Logging** — Create and manage workout sessions with exercises and sets
- **Exercise Library** — Browse and track exercises by muscle group
- **Progress Tracking** — Monitor performance over time with progress entries
- **RESTful API** — Clean, documented endpoints consumed by the React frontend

---

## Tech Stack

### Frontend
- React + TypeScript
- Axios (HTTP client)
- CSS Modules / SCSS

### Backend
- Java + Spring Boot
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL

### Infrastructure
- AWS ECS / EC2 (container hosting)
- AWS RDS (managed PostgreSQL)
- AWS ECR (Docker image registry)
- Docker + Docker Compose (local development)
- Kubernetes (Deployments · Services · ConfigMaps)

---

## Local Development

### Prerequisites
- Docker + Docker Compose
- Node.js 18+
- Java 17+

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

---

## Roadmap

- [x] Spring Boot project structure
- [x] Database schema + JPA entities
- [x] JWT authentication
- [x] Workout + Exercise CRUD endpoints
- [x] React frontend — auth flow
- [x] React frontend — workout logging UI
- [ ] Progress visualization / charts
- [ ] AWS deployment
