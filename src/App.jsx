import React, { useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { router } from './routes';
import { authService } from './services/authService';

function App() {
  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        const currentPath = window.location.pathname;
        // Don't redirect if on public routes
        const publicRoutes = ['/', '/login', '/register', '/admin-login', '/verify-otp'];
        if (!publicRoutes.includes(currentPath) && !currentPath.startsWith('/signup/')) {
          window.location.href = '/login';
        }
      }
    };
    
    checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;