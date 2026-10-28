import api from './axios';
import type { Workout, WorkoutPage } from '../types';

export const getWorkouts = (page = 0, size = 20) =>
  api.get<WorkoutPage>(`/workouts?page=${page}&size=${size}`);

export const getWorkout = (id: string) =>
  api.get<Workout>(`/workouts/${id}`);

export const createWorkout = (data: { name: string; date: string; durationMinutes?: number; notes?: string }) =>
  api.post<Workout>('/workouts', data);

export const updateWorkout = (id: string, data: Partial<{ name: string; date: string; durationMinutes: number; notes: string }>) =>
  api.put<Workout>(`/workouts/${id}`, data);

export const deleteWorkout = (id: string) =>
  api.delete(`/workouts/${id}`);

export const addSet = (workoutId: string, data: { exerciseId: string; setNumber: number; reps?: number; weightKg?: number; rpe?: number; notes?: string }) =>
  api.post(`/workouts/${workoutId}/sets`, data);

export const updateSet = (workoutId: string, setId: string, data: Partial<{ reps: number; weightKg: number; rpe: number; notes: string }>) =>
  api.put(`/workouts/${workoutId}/sets/${setId}`, data);

export const deleteSet = (workoutId: string, setId: string) =>
  api.delete(`/workouts/${workoutId}/sets/${setId}`);