import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import StudentsLayout from '../layouts/StudentsLayout';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import StudentSignup from '../pages/Auth/StudentSignup';
import CompanySignup from '../pages/Auth/CompanySignup';
import VerifyOTP from '../pages/Auth/VerifyOTP';
import StudentInternships from '../pages/Student/Internships';
import StudentApplications from '../pages/Student/Applications';
import StudentProfile from '../pages/Student/Profile';
import ApplyNow from '../pages/Student/ApplyNow';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'signup/student', element: <StudentSignup /> },
      { path: 'signup/company', element: <CompanySignup /> },
      { path: 'verify-otp', element: <VerifyOTP /> },
    ],
  },
  {
    path: '/student',
    element: <StudentsLayout />,
    children: [
      { index: true, element: <StudentInternships /> },
      { path: 'internships', element: <StudentInternships /> },
      { path: 'applications', element: <StudentApplications /> },
      { path: 'profile', element: <StudentProfile /> },
      { path: 'apply/:id', element: <ApplyNow /> }, // Dynamic route for apply
    ],
  },
]);

export default router;