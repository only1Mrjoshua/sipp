import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';
import Container from '../common/Container';
import logo from '../../assets/images/logo.png';

/**
 * Main Navigation component
 * Transparent initially, becomes solid on scroll
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
          {/* Logo - Larger size */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="SIPP Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Actions - Only Login and Get Started */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
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

      {/* Mobile Menu - Only Login and Get Started */}
      <motion.div
        className={`
          lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-md
          border-b border-border-light shadow-lg
          ${isMobileMenuOpen ? 'block' : 'hidden'}
        `}
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -10
        }}
        transition={{ duration: 0.2 }}
      >
        <Container className="py-6">
          <div className="flex flex-col space-y-3">
            <Link to="/login">
              <Button variant="ghost" fullWidth>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" fullWidth>
                Get Started
              </Button>
            </Link>
          </div>
        </Container>
      </motion.div>
    </header>
  );
};

export default Navbar;