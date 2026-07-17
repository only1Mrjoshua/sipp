import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import StudentsLayout from '../layouts/StudentsLayout';
import CompanyLayout from '../layouts/CompanyLayout';

// Student Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import StudentSignup from '../pages/Auth/StudentSignup';
import CompanySignup from '../pages/Auth/CompanySignup';
import VerifyOTP from '../pages/Auth/VerifyOTP';
import StudentInternships from '../pages/Student/Internships';
import StudentApplications from '../pages/Student/Applications';
import StudentProfile from '../pages/Student/Profile';
import StudentSettings from '../pages/Student/Settings';
import ApplyNow from '../pages/Student/ApplyNow';
import ViewApplication from '../pages/Student/ViewApplication';

// Company Pages
import CompanyApplications from '../pages/Company/Applications';
import CompanyProfile from '../pages/Company/Profile';
import CompanySettings from '../pages/Company/Settings';
import CreateInternship from '../pages/Company/CreateInternship';
import CompanyInternships from '../pages/Company/CompanyInternships';
import ViewInternship from '../pages/Company/ViewInternship';
import EditInternship from '../pages/Company/EditInternship';
import CompanyViewApplication from '../pages/Company/ViewApplication';

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
      { path: 'settings', element: <StudentSettings /> },
      { path: 'apply/:id', element: <ApplyNow /> },
      { path: 'application/:id', element: <ViewApplication /> },
    ],
  },
  {
    path: '/company',
    element: <CompanyLayout />,
    children: [
      { index: true, element: <CompanyInternships /> },
      { path: 'internships', element: <CompanyInternships /> },
      { path: 'internship/:id', element: <ViewInternship /> },
      { path: 'internship/edit/:id', element: <EditInternship /> },
      { path: 'applications', element: <CompanyApplications /> },
      { path: 'application/:id', element: <CompanyViewApplication /> },
      { path: 'profile', element: <CompanyProfile /> },
      { path: 'settings', element: <CompanySettings /> },
      { path: 'create-internship', element: <CreateInternship /> },
    ],
  },
]);

export default router;