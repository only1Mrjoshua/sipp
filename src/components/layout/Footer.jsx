import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail,
  Phone
} from 'lucide-react';
import Container from '../common/Container';
import logo from '../../assets/images/logo.png';

/**
 * Main Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <Container className="py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
          {/* Left - Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img src={logo} alt="SIPP Logo" className="h-16 w-auto brightness-0 invert" /> {/* Increased from h-12 to h-16 */}
            </Link>
            <p className="text-primary-light/70 text-sm leading-relaxed max-w-md">
              Smart Internship Placement Portal - Connecting students with the right internship opportunities.
            </p>
          </div>

          {/* Right - Contact Us (Aligned Left) */}
          <div>
            <h4 className="text-primary-light/70 text-sm font-medium mb-3">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-primary-light/70">
                <Mail className="w-5 h-5 text-primary-light/70 flex-shrink-0" />
                <a href="mailto:info@sipp.curriumx.online" className="hover:text-white transition-colors">
                  info@sipp.curriumx.online
                </a>
              </li>
              <li className="flex items-center space-x-3 text-primary-light/70">
                <Phone className="w-5 h-5 text-primary-light/70 flex-shrink-0" />
                <a href="tel:+2349063229518" className="hover:text-white transition-colors">
                  +234 906 322 9518
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-light/50 text-sm">
              &copy; {currentYear} SIPP. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-primary-light/50 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-light/50 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-primary-light/50 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;