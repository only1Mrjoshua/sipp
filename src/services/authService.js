import api from './api';

export const authService = {
  // Student Registration
  registerStudent: async (data) => {
    const response = await api.post('/api/auth/register/student', data);
    return response.data;
  },

  // Company Registration
  registerCompany: async (data) => {
    const response = await api.post('/api/auth/register/company', data);
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    return response.data;
  },

  // Admin Login
  adminLogin: async (email, password) => {
    const response = await api.post('/api/auth/admin-login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pending_email');
    // Redirect to login
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    // Optional: Check if token is expired (you can decode and check exp)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (e) {
      return false;
    }
    
    return true;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('access_token');
  }
};