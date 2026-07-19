import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail,
  Phone
} from 'lucide-react';
import Container from '../common/Container';
import PolicyModal from '../common/PolicyModal';
import PrivacyPolicyContent from '../landing/PrivacyPolicy';
import TermsOfServiceContent from '../landing/TermsOfService';
import CookiePolicyContent from '../landing/CookiePolicy';
import logo from '../../assets/images/logo.png';

/**
 * Main Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModalContent = () => {
    switch(activeModal) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: <PrivacyPolicyContent />
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: <TermsOfServiceContent />
        };
      case 'cookies':
        return {
          title: 'Cookie Policy',
          content: <CookiePolicyContent />
        };
      default:
        return null;
    }
  };

  const modalData = getModalContent();

  return (
    <>
      <footer className="bg-primary-dark text-white">
        <Container className="py-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12">
            {/* Left - Brand */}
            <div className="space-y-4">
              <Link to="/">
                <img src={logo} alt="SIPP Logo" className="h-16 w-auto brightness-0 invert" />
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
                <button 
                  onClick={() => openModal('privacy')}
                  className="text-primary-light/50 hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => openModal('terms')}
                  className="text-primary-light/50 hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => openModal('cookies')}
                  className="text-primary-light/50 hover:text-white transition-colors cursor-pointer"
                >
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </Container>
      </footer>

      {/* Policy Modal */}
      {modalData && (
        <PolicyModal
          isOpen={!!activeModal}
          onClose={closeModal}
          title={modalData.title}
          content={modalData.content}
        />
      )}
    </>
  );
};

export default Footer;