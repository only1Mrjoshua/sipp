import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is 401 (Unauthorized) or 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if the error is due to token expiration
      const errorMessage = error.response?.data?.detail || '';
      
      // If token is invalid or expired
      if (errorMessage.toLowerCase().includes('invalid token') || 
          errorMessage.toLowerCase().includes('token expired') ||
          errorMessage.toLowerCase().includes('not authenticated') ||
          error.status === 401) {
        
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('pending_email');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;