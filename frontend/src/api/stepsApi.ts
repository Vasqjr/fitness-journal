import api from './axios';
import type { StepEntry } from '../types';

export const getSteps = (from: string, to: string) =>
  api.get<StepEntry[]>('/steps', { params: { from, to } });

export const saveSteps = (date: string, steps: number) =>
  api.put<StepEntry>(`/steps/${date}`, { steps });

export const deleteSteps = (date: string) =>
  api.delete(`/steps/${date}`);