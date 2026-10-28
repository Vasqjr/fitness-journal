export interface User {
  userId: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  displayName: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
  isCustom: boolean;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
  notes: string | null;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  durationMinutes: number | null;
  notes: string | null;
  createdAt: string;
  sets: WorkoutSet[];
}

export interface WorkoutPage {
  content: Workout[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface ProgressPoint {
  date: string;
  maxWeightKg: number;
  totalVolume: number;
  totalSets: number;
}