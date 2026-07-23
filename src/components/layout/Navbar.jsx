import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  FileText, 
  ChevronDown, 
  LayoutDashboard
} from 'lucide-react';
import Button from '../common/Button';
import Container from '../common/Container';
import logo from '../../assets/images/logo.png';
import { authService } from '../../services/authService';
import api from '../../services/api';  // 👈 import api

/**
 * Main Navigation component
 * Transparent initially, becomes solid on scroll
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = authService.getCurrentUser();
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(userData);
      // If we already have a profilePicture in localStorage, use it
      const storedPic = localStorage.getItem('profile_picture');
      if (storedPic) {
        setProfilePicture(storedPic);
      } else {
        // Otherwise fetch from backend
        fetchUserProfile(userData);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setProfilePicture(null);
    }
  }, [location]);

  const fetchUserProfile = async (userData) => {
    try {
      let endpoint = '';
      if (userData.role === 'student') {
        endpoint = `/api/students/profile/${userData.id}`;
      } else if (userData.role === 'company') {
        endpoint = `/api/companies/profile/${userData.id}`;
      } else {
        return;
      }
      const response = await api.get(endpoint);
      const profile = response.data;
      const pic = profile.profilePicture || profile.profile_picture || null;
      if (pic) {
        setProfilePicture(pic);
        // Save to localStorage so next loads are faster
        localStorage.setItem('profile_picture', pic);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setProfilePicture(null);
    localStorage.removeItem('profile_picture');
    setShowDropdown(false);
    navigate('/');
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  };

  // Get user's first name only
  const getFirstName = () => {
    if (!user) return 'User';
    if (user.companyName) return user.companyName;
    if (user.firstName && user.firstName.trim()) return user.firstName.trim();
    if (user.first_name && user.first_name.trim()) return user.first_name.trim();
    if (user.email) return user.email.split('@')[0] || 'User';
    return 'User';
  };

  const getProfilePictureUrl = () => {
    return profilePicture || null;
  };

  const getRoleBasedRoute = () => {
    if (!user) return '/profile';
    switch(user.role) {
      case 'student': return '/student/profile';
      case 'company': return '/company/profile';
      case 'admin': return '/admin/profile';
      default: return '/profile';
    }
  };

  const getRoleBasedDashboard = () => {
    if (!user) return '/';
    switch(user.role) {
      case 'student': return '/student/internships';
      case 'company': return '/company/internships';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const getRoleBasedApplications = () => {
    if (!user) return '/applications';
    switch(user.role) {
      case 'student': return '/student/applications';
      case 'company': return '/company/applications';
      default: return '/applications';
    }
  };

  const getRoleBasedSettings = () => {
    if (!user) return '/settings';
    switch(user.role) {
      case 'student': return '/student/settings';
      case 'company': return '/company/settings';
      case 'admin': return '/admin/settings';
      default: return '/settings';
    }
  };

  const avatarUrl = getProfilePictureUrl();
  const displayName = getFirstName();
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-soft' 
          : 'bg-transparent'
        }
      `}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="SIPP Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`
                    flex items-center gap-3 group focus:outline-none
                    ${isScrolled 
                      ? 'bg-gray-50 hover:bg-gray-100' 
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white'
                    }
                    px-3 py-1.5 rounded-full transition-all shadow-sm hover:shadow-md
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 hover:border-primary transition-all flex items-center justify-center text-primary-dark font-semibold text-xs overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={displayName} 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = initials || 'U';
                        }}
                      />
                    ) : (
                      initials || 'U'
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary-dark hidden sm:block max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-strong overflow-hidden z-50 py-1">
                    <div className="px-4 py-3 border-b border-border-light">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark font-semibold text-lg overflow-hidden">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={displayName} 
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = initials || 'U';
                              }}
                            />
                          ) : (
                            initials || 'U'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-primary-dark truncate">{displayName}</p>
                          <p className="text-xs text-text-muted truncate">{user.email}</p>
                          <p className="text-xs text-text-muted mt-0.5 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowDropdown(false); navigate(getRoleBasedRoute()); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-background-light transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button
                      onClick={() => { setShowDropdown(false); navigate(getRoleBasedDashboard()); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-background-light transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Internships
                    </button>
                    <button
                      onClick={() => { setShowDropdown(false); navigate(getRoleBasedApplications()); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-background-light transition-colors"
                    >
                      <FileText className="w-4 h-4" /> My Applications
                    </button>

                    <div className="border-t border-border-light my-1"></div>

                    <button
                      onClick={() => { setShowDropdown(false); navigate(getRoleBasedSettings()); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-background-light transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-status-error hover:bg-status-error/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary-dark" />
            ) : (
              <Menu className="w-6 h-6 text-primary-dark" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <motion.div
        className={`
          lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-md
          border-b border-border-light shadow-lg
          ${isMobileMenuOpen ? 'block' : 'hidden'}
        `}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <Container className="py-6">
          <div className="flex flex-col space-y-3">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-background-light rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark font-semibold overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={displayName} 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = initials || 'U';
                        }}
                      />
                    ) : (
                      initials || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-dark">{displayName}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
                
                <Link to={getRoleBasedRoute()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth icon={<User className="w-4 h-4" />}>My Profile</Button>
                </Link>
                <Link to={getRoleBasedDashboard()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</Button>
                </Link>
                <Link to={getRoleBasedApplications()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth icon={<FileText className="w-4 h-4" />}>My Applications</Button>
                </Link>
                <Link to={getRoleBasedSettings()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth icon={<Settings className="w-4 h-4" />}>Settings</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  icon={<LogOut className="w-4 h-4" />}
                  className="text-status-error hover:bg-status-error/5"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth>Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </motion.div>
    </header>
  );
};

export default Navbar;