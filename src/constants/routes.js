// Route constants for consistent use across the application
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Student routes
  STUDENT_DASHBOARD: '/student',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_INTERNSHIPS: '/student/internships',
  STUDENT_APPLICATIONS: '/student/applications',
  
  // Company routes
  COMPANY_DASHBOARD: '/company',
  COMPANY_PROFILE: '/company/profile',
  COMPANY_INTERNSHIPS: '/company/internships',
  COMPANY_APPLICATIONS: '/company/applications',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_INTERNSHIPS: '/admin/internships',
  ADMIN_REPORTS: '/admin/reports',
  
  // Error
  NOT_FOUND: '*',
};

// Role-based route access
export const ROLE_ROUTES = {
  student: [
    ROUTES.STUDENT_DASHBOARD,
    ROUTES.STUDENT_PROFILE,
    ROUTES.STUDENT_INTERNSHIPS,
    ROUTES.STUDENT_APPLICATIONS,
  ],
  company: [
    ROUTES.COMPANY_DASHBOARD,
    ROUTES.COMPANY_PROFILE,
    ROUTES.COMPANY_INTERNSHIPS,
    ROUTES.COMPANY_APPLICATIONS,
  ],
  admin: [
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_STUDENTS,
    ROUTES.ADMIN_COMPANIES,
    ROUTES.ADMIN_INTERNSHIPS,
    ROUTES.ADMIN_REPORTS,
  ],
};

// Navigation links for each role
export const NAVIGATION_LINKS = {
  public: [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'About', path: ROUTES.ABOUT },
    { label: 'Contact', path: ROUTES.CONTACT },
  ],
  student: [
    { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD },
    { label: 'Profile', path: ROUTES.STUDENT_PROFILE },
    { label: 'Internships', path: ROUTES.STUDENT_INTERNSHIPS },
    { label: 'Applications', path: ROUTES.STUDENT_APPLICATIONS },
  ],
  company: [
    { label: 'Dashboard', path: ROUTES.COMPANY_DASHBOARD },
    { label: 'Profile', path: ROUTES.COMPANY_PROFILE },
    { label: 'Internships', path: ROUTES.COMPANY_INTERNSHIPS },
    { label: 'Applications', path: ROUTES.COMPANY_APPLICATIONS },
  ],
  admin: [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Students', path: ROUTES.ADMIN_STUDENTS },
    { label: 'Companies', path: ROUTES.ADMIN_COMPANIES },
    { label: 'Internships', path: ROUTES.ADMIN_INTERNSHIPS },
    { label: 'Reports', path: ROUTES.ADMIN_REPORTS },
  ],
};