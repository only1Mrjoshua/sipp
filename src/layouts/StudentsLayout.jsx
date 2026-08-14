import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  FileCheck, 
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import logo from '../assets/images/logo.png';
import { authService } from '../services/authService';
import api from '../services/api';

const StudentsLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const navItems = [
    { icon: Briefcase, label: 'Internships', path: '/student/internships' },
    { icon: FileCheck, label: 'Applications', path: '/student/applications' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  // Get user data on mount
  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    if (userData) {
      fetchProfilePicture(userData.id);
    }
  }, []);

  const fetchProfilePicture = async (userId) => {
    try {
      const response = await api.get(`/api/students/profile/${userId}`);
      if (response.data.profilePicture) {
        setProfilePicture(response.data.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background-light flex">
      {/* Mobile Menu Overlay - Click to close */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          bg-white
          border-r border-border-light
          transition-all duration-300 ease-in-out

          ${isSidebarOpen ? 'lg:w-72' : 'lg:w-20'}
          w-72

          ${
            isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        <div className="flex h-dvh flex-col overflow-hidden">

          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-border-light px-6 flex-shrink-0">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center"
            >
              <img src={logo} alt="SIPP Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
            >
              <ChevronRight
                className={`w-5 h-5 text-primary-dark transition-transform duration-300 ${
                  isSidebarOpen ? '' : 'rotate-180'
                }`}
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
            >
              <X className="w-5 h-5 text-primary-dark" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center rounded-xl px-4 py-3 transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-soft'
                        : 'text-text-secondary hover:bg-primary-light/20 hover:text-primary-dark'
                    }
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-primary'
                    }`}
                  />

                  {isSidebarOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border-light p-4 flex-shrink-0">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center rounded-xl px-4 py-3 text-status-error hover:bg-status-error/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />

              {isSidebarOpen && (
                <span className="ml-3 text-sm font-medium">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          flex-1 min-w-0 transition-all duration-300
          ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-light">
          <Container className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-20">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-primary-dark" />
              </button>

              <div className="ml-auto">
                <Link
                  to="/student/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light hover:bg-primary transition-colors duration-200 group overflow-hidden"
                  title="Profile"
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-primary-dark group-hover:text-white">
                      {getUserInitials()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </Container>
        </header>

        {/* Page Content */}
        <main className="px-2 py-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-strong"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-status-warning/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-status-warning" />
              </div>
              <h3 className="text-lg font-bold text-primary-dark">Confirm Logout</h3>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to logout of your student account? You will need to login again to access your dashboard.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleLogout}
                className="bg-status-error hover:bg-status-error/80"
              >
                Yes, Logout
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentsLayout;