import axios, { AxiosError } from 'axios';

const API_BASE_URL = (() => {
  const envUrl = (import.meta as any).env.VITE_API_URL;
  return envUrl || 'http://localhost:5000/api';
})();

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return api.post<AuthResponse>('/auth/register', { name, email, password });
  },

  login: async (email: string, password: string) => {
    return api.post<AuthResponse>('/auth/login', { email, password });
  },

  logout: async () => {
    return api.post<{ message: string }>('/auth/logout');
  },

  getMe: async () => {
    return api.get<User>('/auth/me');
  },

  getUsers: async () => {
    return api.get<{ users: User[]; total: number }>('/auth/admin/users');
  },

  deleteUser: async (id: string) => {
    return api.delete<{ message: string }>(`/auth/admin/users/${id}`);
  },
};

