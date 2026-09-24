import axios from 'axios';

// Base API URL configuration with normalization
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const cleaned = envUrl.trim().replace(/\/$/, '');
    return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
  }
  
  // If deployed on Vercel or any non-localhost domain, fallback to live Render backend
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://task-management-platform-ifsc.onrender.com/api';
  }

  // Local development fallback
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to tolerate Render free-tier cold starts
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    // Check localStorage (Remember Me) or sessionStorage (Session only)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error & Auth Expiry Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (expired or invalid token)
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session_expired=true';
        }
      }
    }

    // Friendly message for timeout / cold start errors
    let customMessage = error.response?.data?.message;

    if (!customMessage) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        customMessage = 'Server response timed out. The backend on Render may be waking up from sleep — please try again in a few seconds.';
      } else if (error.message === 'Network Error') {
        customMessage = 'Unable to connect to backend server. Please check your internet connection or server CORS settings.';
      } else {
        customMessage = error.message || 'An unexpected error occurred. Please try again.';
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);

export default api;
