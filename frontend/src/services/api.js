import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

let csrfToken = null;

export const fetchCsrfToken = async () => null;


// Add a request interceptor to include auth token and CSRF token
api.interceptors.request.use((config) => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage'));
  const user = authStorage?.state?.user;
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('auth-storage');
    csrfToken = null;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateStats: async (stats) => {
    const response = await api.put('/auth/stats', stats);
    return response.data;
  },
};

export default api;
