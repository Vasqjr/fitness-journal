import api from './axios';
import type { AuthResponse } from '../types';

export const register = (email: string, password: string, displayName: string) =>
  api.post<AuthResponse>('/auth/register', { email, password, displayName });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });