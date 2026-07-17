import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  Briefcase,
  FileCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Container from '../components/common/Container';
import logo from '../assets/images/logo.png';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { 
      icon: Users, 
      label: 'Users', 
      isCategory: true,
      subItems: [
        { icon: UserCog, label: 'Students', path: '/admin/students' },
        { icon: Building2, label: 'Companies', path: '/admin/companies' },
      ]
    },
    { icon: Briefcase, label: 'Internships', path: '/admin/internships' },
    { icon: FileCheck, label: 'Applications', path: '/admin/applications' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const isSubItemActive = (subPath) => {
    return location.pathname === subPath;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-background-light flex">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-border-light
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:w-72' : 'lg:w-20'}
          w-72
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-screen flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-border-light px-6 flex-shrink-0">
            <Link to="/admin" onClick={closeMobileMenu} className="flex items-center">
              <img src={logo} alt="SIPP Logo" className="h-12 w-auto" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-primary-light/20 transition-colors"
            >
              <ChevronRight className={`w-5 h-5 text-primary-dark transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
            </button>
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
              const active = isActive(item.path);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isCategory = item.isCategory;

              if (isCategory) {
                // Category header - not clickable
                return (
                  <div key={item.path} className="mb-2">
                    <div className="flex items-center px-4 py-2">
                      <item.icon className="w-5 h-5 flex-shrink-0 text-text-muted" />
                      {isSidebarOpen && (
                        <span className="ml-3 text-xs font-semibold uppercase text-text-muted tracking-wider">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isSidebarOpen && (
                      <div className="ml-4 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={closeMobileMenu}
                            className={`
                              flex items-center rounded-xl px-4 py-2 transition-all duration-200 text-sm
                              ${isSubItemActive(subItem.path) ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-primary-light/20 hover:text-primary-dark'}
                            `}
                          >
                            <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular nav item - clickable
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center rounded-xl px-4 py-3 transition-all duration-200
                    ${active ? 'bg-primary text-white shadow-soft' : 'text-text-secondary hover:bg-primary-light/20 hover:text-primary-dark'}
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-primary'}`} />
                  {isSidebarOpen && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border-light p-4 flex-shrink-0">
            <button
              onClick={closeMobileMenu}
              className="flex w-full items-center rounded-xl px-4 py-3 text-status-error hover:bg-status-error/10 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
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
            </div>
          </Container>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;