-- Enable UUID generation (PostgreSQL built-in)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
                       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email         VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       display_name  VARCHAR(100) NOT NULL,
                       created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Muscle group lookup (stored as string in workout_sets, this is just for reference)
-- We handle this as a Java enum, no separate table needed

-- Exercises table (global library + user custom exercises)
CREATE TABLE exercises (
                           id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           name        VARCHAR(100) NOT NULL,
                           muscle_group VARCHAR(50) NOT NULL,
                           description TEXT,
                           is_custom   BOOLEAN NOT NULL DEFAULT FALSE,
                           created_by  UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Workouts table (a single training session)
CREATE TABLE workouts (
                          id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          name             VARCHAR(100) NOT NULL,
                          date             DATE NOT NULL,
                          duration_minutes INTEGER,
                          notes            TEXT,
                          created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workout sets table (individual sets within a workout)
CREATE TABLE workout_sets (
                              id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              workout_id  UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
                              exercise_id UUID NOT NULL REFERENCES exercises(id),
                              set_number  INTEGER NOT NULL,
                              reps        INTEGER,
                              weight_kg   NUMERIC(6,2),
                              rpe         NUMERIC(3,1),
                              notes       TEXT
);

-- Seed some global exercises so the app isn't empty
INSERT INTO exercises (name, muscle_group, description, is_custom) VALUES
                                                                       ('Barbell Squat',       'LEGS',      'Compound lower body movement',     FALSE),
                                                                       ('Deadlift',            'BACK',      'Full body pull movement',          FALSE),
                                                                       ('Bench Press',         'CHEST',     'Horizontal push movement',         FALSE),
                                                                       ('Overhead Press',      'SHOULDERS', 'Vertical push movement',           FALSE),
                                                                       ('Pull Up',             'BACK',      'Vertical pull bodyweight movement', FALSE),
                                                                       ('Barbell Row',         'BACK',      'Horizontal pull movement',         FALSE),
                                                                       ('Romanian Deadlift',   'LEGS',      'Hip hinge movement',               FALSE),
                                                                       ('Incline Bench Press', 'CHEST',     'Upper chest horizontal push',      FALSE),
                                                                       ('Dumbbell Curl',       'BICEPS',    'Bicep isolation',                  FALSE),
                                                                       ('Tricep Pushdown',     'TRICEPS',   'Tricep isolation',                 FALSE),
                                                                       ('Plank',               'CORE',      'Core stability hold',              FALSE),
                                                                       ('Leg Press',           'LEGS',      'Machine lower body push',          FALSE);