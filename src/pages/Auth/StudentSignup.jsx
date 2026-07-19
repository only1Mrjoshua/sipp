import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, Eye, EyeOff, ChevronDown } from 'lucide-react';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SkillSelector from '../../components/common/SkillSelector';
import { authService } from '../../services/authService';
import { 
  getAllDepartments, 
  getSkillsForDepartment, 
  getInterestsForDepartment, 
  getCareersForDepartment 
} from '../../data/departmentSkills';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [availableCareers, setAvailableCareers] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    faculty: '',
    department: '',
    matricNumber: '',
    level: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    skills: [],
    interests: [],
    careerAspiration: '',
  });

  // Update available options when department changes
  useEffect(() => {
    if (formData.department) {
      const skills = getSkillsForDepartment(formData.department);
      const interests = getInterestsForDepartment(formData.department);
      const careers = getCareersForDepartment(formData.department);
      
      setAvailableSkills(skills);
      setAvailableInterests(interests);
      setAvailableCareers(careers);
      
      // Auto-select first career aspiration if available
      if (careers.length > 0 && !formData.careerAspiration) {
        setFormData(prev => ({
          ...prev,
          careerAspiration: careers[0]
        }));
      }
    } else {
      setAvailableSkills([]);
      setAvailableInterests([]);
      setAvailableCareers([]);
    }
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  // Keep __NONE__ in the state so the component knows it's selected
  const handleSkillChange = (skills) => {
    setFormData({ ...formData, skills });
  };

  // Keep __NONE__ in the state so the component knows it's selected
  const handleInterestChange = (interests) => {
    setFormData({ ...formData, interests });
  };

  const handleCareerChange = (e) => {
    setFormData({ ...formData, careerAspiration: e.target.value });
  };

  // Clean data before submitting to backend - filter out __NONE__
  const cleanDataForSubmission = (data) => {
    const cleaned = { ...data };
    // Filter out __NONE__ from skills and interests
    cleaned.skills = data.skills.filter(s => s !== '__NONE__');
    cleaned.interests = data.interests.filter(s => s !== '__NONE__');
    return cleaned;
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

    if (!formData.acceptTerms) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    // Skills validation is not required - they can have none

    setLoading(true);

    try {
      const { confirmPassword, acceptTerms, ...registerData } = formData;
      // Clean the data before sending to backend
      const cleanedData = cleanDataForSubmission(registerData);
      await authService.registerStudent(cleanedData);
      
      // Save email to localStorage and pass to OTP page
      localStorage.setItem('pending_email', registerData.email);
      navigate('/verify-otp?role=student&email=' + encodeURIComponent(registerData.email));
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get all departments for dropdown
  const departments = getAllDepartments();

  return (
    <section className="min-h-screen py-20 bg-gradient-hero">
      <Container>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="bordered" padding="lg" className="shadow-strong">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-primary-dark">Student Sign Up</h1>
                <p className="text-text-secondary mt-2">Create your student account</p>
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
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="student@university.edu"
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

                {/* Academic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark mb-4">
                    Academic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        University *
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="University of Lagos"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Faculty *
                      </label>
                      <input
                        type="text"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Faculty of Science"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Matric Number *
                      </label>
                      <input
                        type="text"
                        name="matricNumber"
                        value={formData.matricNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="****/CS/2024/001"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Level *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="100L">100L</option>
                        <option value="200L">200L</option>
                        <option value="300L">300L</option>
                        <option value="400L">400L</option>
                        <option value="500L">500L</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skills Section - Only show if department is selected */}
                {formData.department && (
                  <div>
                    <h3 className="text-sm font-semibold text-primary-dark mb-4">
                      Skills & Career Preferences
                    </h3>
                    
                    {/* Skills I Have - Allow None */}
                    <div className="mb-6">
                      <SkillSelector
                        label="Skills I Have"
                        options={availableSkills}
                        selected={formData.skills}
                        onChange={handleSkillChange}
                        placeholder="Search skills..."
                        emptyMessage="No skills available for this department yet"
                        allowNone={true}
                        noneLabel="None / I don't have any skills yet"
                      />
                    </div>

                    {/* Skills I Want to Learn - Allow None */}
                    <div className="mb-6">
                      <SkillSelector
                        label="Skills I Want to Learn"
                        options={availableSkills}
                        selected={formData.interests}
                        onChange={handleInterestChange}
                        placeholder="Search skills to learn..."
                        emptyMessage="No skills available for this department yet"
                        allowNone={true}
                        noneLabel="None / I don't want to learn any specific skills yet"
                      />
                    </div>

                    {/* Career Aspiration */}
                    <div>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        Career Aspiration *
                      </label>
                      {availableCareers.length > 0 ? (
                        <select
                          name="careerAspiration"
                          value={formData.careerAspiration}
                          onChange={handleCareerChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                          required
                        >
                          <option value="">Select Career Path</option>
                          {availableCareers.map((career) => (
                            <option key={career} value={career}>{career}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="careerAspiration"
                          value={formData.careerAspiration}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="e.g., Full Stack Developer"
                        />
                      )}
                    </div>
                  </div>
                )}

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
                <div>
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

export default StudentSignup;