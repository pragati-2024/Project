import axios from 'axios';

const API = axios.create({
  // Use Vite proxy in dev: '/api/users'
  // Or override via VITE_API_BASE_URL for different environments.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/users',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  // Render free-tier cold starts can exceed 10s.
  timeout: 30000,
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;