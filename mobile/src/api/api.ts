import axios from 'axios';
import { ENV } from '@/config/env';
import { normalizeError } from './normalizeError';

const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    const normalizedError = normalizeError(error);
    return Promise.reject(normalizedError);
  }
)

