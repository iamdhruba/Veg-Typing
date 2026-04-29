import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

let csrfToken = null;

// Fetch CSRF token
const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/auth/csrf-token');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Add a request interceptor to include auth token and CSRF token
api.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
    
    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase())) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      csrfToken = null;
      window.location.href = '/login';
    }
    // Refresh CSRF token on 403
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null;
      await fetchCsrfToken();
      // Retry the request
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      // Fetch CSRF token after login
      await fetchCsrfToken();
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      // Fetch CSRF token after registration
      await fetchCsrfToken();
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
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
