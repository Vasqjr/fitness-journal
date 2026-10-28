import api from './axios';
import type { ProgressPoint } from '../types';

export const getProgress = (exerciseId: string) =>
  api.get<ProgressPoint[]>(`/progress/${exerciseId}`);

export const getPersonalRecord = (exerciseId: string) =>
  api.get<{ weightKg: number; date: string; reps: number }>(`/progress/${exerciseId}/pr`);