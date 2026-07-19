import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { getAllIndustries } from '../../data/industryData';

const CompanySignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    state: '',
    city: '',
    address: '',
    password: '',
    confirmPassword: '',
    verifyCompany: false,
    acceptTerms: false,
  });

  const industries = getAllIndustries();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.verifyCompany) {
      setError('Please verify that this is a registered company');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, verifyCompany, acceptTerms, ...registerData } = formData;
      await authService.registerCompany(registerData);
      
      // Save email to localStorage and pass to OTP page
      localStorage.setItem('pending_email', registerData.email);
      navigate('/verify-otp?role=company&email=' + encodeURIComponent(registerData.email));
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-status-error/10 text-status-error text-sm rounded-xl border border-status-error/20 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company Information */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="TechCorp Inc."
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="company@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="+234 800 000 0000"
                          required
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
                        Industry *
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        required
                      >
                        <option value="">Select Industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                      <p className="text-xs text-text-muted mt-1">
                        Your industry determines the internship types and skills available for your company
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1.5">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                          required
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
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Lekki"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Company Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="123 Business District, Lagos"
                        required
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
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 pr-12 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-dark transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 pr-12 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-dark transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agreement */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="verifyCompany"
                      checked={formData.verifyCompany}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 text-primary border-border-light rounded focus:ring-primary"
                      required
                    />
                    <span className="text-sm text-text-secondary">
                      Verify that this is a registered company
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 text-primary border-border-light rounded focus:ring-primary"
                      required
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
                  loading={loading}
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