# Fitness Journal – Full Stack Project

## 🧾 Overview

Fitness Journal is a full-stack fitness tracking application inspired by StrengthLog, built with **Spring Boot** (backend) and **React + TypeScript** (frontend). Users can log workouts, record exercises and sets, and visualize their strength progress over time. The app is containerized with Docker and deployed to the cloud, with the frontend on Vercel and the backend and database on Railway.

**Live demo:** <https://fitness-journal-fullstack.vercel.app/>

## 🎯 Features

- **Workout Logging**
  - Create workouts and add exercises and sets.
  - Edit sets inline without leaving the workout page.
  - Paginated workout history.
- **Exercise Library**
  - Seeded exercise list grouped by muscle group.
  - Searchable exercise selector.
- **Progress Tracking**
  - Dual-axis chart of max weight and total volume over time.
  - Personal records displayed on the Progress page.
- **Unit Conversion**
  - Switch between kg and lbs; preference is saved in the browser.
- **Authentication**
  - Register and log in with JWT-based sessions.
  - Protected routes redirect unauthenticated users to the login page.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, React Context, Axios, Recharts
- **Backend:** Java 17, Spring Boot 3.4.5, Spring Security, JWT, Spring Data JPA, Maven
- **Database:** PostgreSQL with Flyway migrations and UUID primary keys
- **DevOps:** Docker (multi-stage build), Docker Compose, Kubernetes (Minikube)

## 🏗️ Architecture

- **Backend layers:** Controller → Service → Repository → Entity
- **Entities:** `User`, `Workout`, `Exercise`, `WorkoutSet`, `MuscleGroup`
- **Relationships:** A user has many workouts, and a workout has many sets. Each set references an exercise.
- **Cross-cutting:** DTO records for all requests and responses, a shared `BaseController`, and a global `@RestControllerAdvice` exception handler.
- **Health checks:** Spring Actuator at `/actuator/health`.

## ☁️ Deployment & Infrastructure

- **Vercel**
  - Hosts the React frontend and auto-deploys on every push.
- **Railway**
  - Hosts the Spring Boot API and a managed PostgreSQL service.
  - Provides automatic HTTPS, which avoids mixed-content issues with the Vercel frontend.
  - Configured through environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
- **Docker**
  - Multi-stage Dockerfile for small production images.
  - Docker Compose runs the API and PostgreSQL together for local development, with a database health check before the app starts.
- **Kubernetes**
  - Minikube manifests for a two-replica deployment, Postgres, and secrets.
  - Readiness and liveness probes on `/actuator/health`.
- **AWS (earlier deployment)**
  - The backend was originally deployed with ECR, ECS Fargate, RDS, and SSM Parameter Store before moving to Railway.

## 🔐 Security

- JWT authentication with Spring Security and a custom filter chain.
- Passwords hashed with BCrypt.
- Protected API endpoints and protected frontend routes.
- Axios interceptor attaches the token to requests and redirects to login on a 401.
- Secrets and credentials stored in environment variables, never in source control.

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Vasqjr/fitness-journal.git
cd fitness-journal

# Start the backend and database
cd backend
docker-compose up

# In a second terminal, start the frontend
cd frontend
npm install
npm run dev
```

The API runs on `http://localhost:8080` and PostgreSQL is exposed on port `5433`. Set `VITE_API_URL` in the frontend environment to point at the API.
