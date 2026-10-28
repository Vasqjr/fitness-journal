import api from './axios';
import type { Exercise } from '../types';

export const getExercises = () =>
  api.get<Exercise[]>('/exercises');

export const createExercise = (data: { name: string; muscleGroup: string; description?: string }) =>
  api.post<Exercise>('/exercises', data);

export const deleteExercise = (id: string) =>
  api.delete(`/exercises/${id}`);