import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CompanySignup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Direct navigation to OTP page with company param
    navigate('/verify-otp?role=company');
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-hero">
      <Container>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="bordered" padding="lg" className="shadow-strong">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-primary-dark">Company Sign Up</h1>
                <p className="text-text-secondary mt-2">Create your company account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company Information */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="TechCorp Inc."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          Official Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="company@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry & Location */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Industry & Location
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Industry
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                      >
                        <option value="">Select Industry</option>
                        <option value="Software">Software</option>
                        <option value="Banking">Banking</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Oil & Gas">Oil & Gas</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          State
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                          <option value="">Select State</option>
                          <option value="Lagos">Lagos</option>
                          <option value="Abuja">Abuja</option>
                          <option value="Rivers">Rivers</option>
                          <option value="Kano">Kano</option>
                          <option value="Oyo">Oyo</option>
                          <option value="Kaduna">Kaduna</option>
                          <option value="Enugu">Enugu</option>
                          <option value="Edo">Edo</option>
                          <option value="Ogun">Ogun</option>
                          <option value="Kwara">Kwara</option>
                          <option value="Delta">Delta</option>
                          <option value="Anambra">Anambra</option>
                          <option value="Plateau">Plateau</option>
                          <option value="Borno">Borno</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Lekki"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Company Address
                      </label>
                      <textarea
                        rows="2"
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="123 Business District, Lagos"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Section */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Account
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Agreement */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-0.5 text-primary border-border-light rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">
                      Verify that this is a registered company
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-0.5 text-primary border-border-light rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">
                      I accept the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Create Account
                </Button>

                <div className="text-center">
                  <p className="text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default CompanySignup;