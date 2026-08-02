import axios from 'axios';

// Create configured Axios instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maatri_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Response Warning:', error.message);
    return Promise.reject(error);
  }
);
