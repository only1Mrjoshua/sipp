import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar,
  Users,
  FileText,
  Building2,
  Tag,
  GraduationCap,
  Send,
  X,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import api from '../../services/api';
import { authService } from '../../services/authService';

const CreateInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyProfile, setCompanyProfile] = useState({
    companyName: '',
    skillsRequired: [],
    skillsOffered: [],
    benefits: [],
  });

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    duration: '6 months',
    aboutRole: '',
    aboutCompany: '',
    applicationDeadline: '',
    spotsAvailable: '',
    skillsRequired: [],
    skillsOffered: [],
    benefits: [],
  });

  const [newSkillToAdd, setNewSkillToAdd] = useState('');
  const [newSkillToOffer, setNewSkillToOffer] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const internshipTypes = ['Full-time', 'Part-time', 'Remote', 'Hybrid'];
  const durationOptions = ['3 months', '4 months', '6 months', '9 months', '12 months'];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const userData = authService.getCurrentUser();
      if (!userData) return;

      const response = await api.get(`/api/companies/profile/${userData.id}`);
      const data = response.data;
      
      setCompanyProfile({
        companyName: data.companyName || '',
        skillsRequired: data.skillsRequired || [],
        skillsOffered: data.skillsOffered || [],
        benefits: data.benefits || [],
      });

      setFormData(prev => ({
        ...prev,
        skillsRequired: data.skillsRequired || [],
        skillsOffered: data.skillsOffered || [],
        benefits: data.benefits || [],
      }));
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAddSkill = () => {
    if (newSkillToAdd.trim() && !formData.skillsRequired.includes(newSkillToAdd.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, newSkillToAdd.trim()],
      });
      setNewSkillToAdd('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddOfferedSkill = () => {
    if (newSkillToOffer.trim() && !formData.skillsOffered.includes(newSkillToOffer.trim())) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newSkillToOffer.trim()],
      });
      setNewSkillToOffer('');
    }
  };

  const handleRemoveOfferedSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter(benefit => benefit !== benefitToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title?.trim()) {
      setError('Please enter an internship title');
      setLoading(false);
      return;
    }
    if (!formData.location?.trim()) {
      setError('Please enter a location');
      setLoading(false);
      return;
    }
    if (!formData.aboutRole?.trim()) {
      setError('Please describe the role');
      setLoading(false);
      return;
    }
    if (!formData.aboutCompany?.trim()) {
      setError('Please describe your company');
      setLoading(false);
      return;
    }
    if (!formData.applicationDeadline) {
      setError('Please set an application deadline');
      setLoading(false);
      return;
    }
    if (!formData.spotsAvailable || parseInt(formData.spotsAvailable) < 1) {
      setError('Please enter a valid number of spots');
      setLoading(false);
      return;
    }

    // Prepare payload - ensure all fields match backend
    const payload = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      type: formData.type,
      duration: formData.duration,
      aboutRole: formData.aboutRole.trim(),
      aboutCompany: formData.aboutCompany.trim(),
      applicationDeadline: formData.applicationDeadline,
      spotsAvailable: parseInt(formData.spotsAvailable),
      skillsRequired: formData.skillsRequired || [],
      skillsOffered: formData.skillsOffered || [],
      benefits: formData.benefits || [],
    };

    try {
      const response = await api.post('/api/internships/create', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/company/internships');
      }, 2000);
    } catch (error) {
      // Enhanced error logging
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      alert(JSON.stringify(error.response.data.detail, null, 2));
      
      // Display the actual error message from the backend
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        
        // If detail is an array (validation errors from Pydantic)
        if (Array.isArray(detail)) {
          // Extract the error message from each validation error
          const errorMessages = detail
            .map(err => {
              // Get the field name
              let field = 'Unknown field';
              if (err.loc) {
                // Pydantic puts the field name in loc array
                field = err.loc[err.loc.length - 1];
              }
              const msg = err.msg || err.message || 'Invalid value';
              return `${field}: ${msg}`;
            })
            .join('. ');
          setError(errorMessages);
        } 
        // If detail is a string
        else if (typeof detail === 'string') {
          setError(detail);
        } 
        // If detail is an object
        else if (typeof detail === 'object') {
          setError(detail.msg || detail.message || JSON.stringify(detail));
        } 
        else {
          setError('Failed to create internship. Please check your input.');
        }
      } else {
        setError(error.message || 'Failed to create internship. Please try again.');
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-status-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Internship Created!</h2>
          <p className="text-text-secondary mb-6">
            Your internship has been successfully published. Students can now apply.
          </p>
          <p className="text-sm text-text-muted">Redirecting to internships...</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl">
      <button
        onClick={() => navigate('/company/internships')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Internships
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Create Internship</h1>
        <p className="text-text-secondary">Post a new internship opportunity for students</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-status-error/10 text-status-error text-sm rounded-xl border border-status-error/20 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary shrink-0" />
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                Internship Title <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g. Frontend Developer Intern"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1.5">
                  Location <span className="text-status-error">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted shrink-0" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g. Lagos, Nigeria"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1.5">
                  Internship Type <span className="text-status-error">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                  required
                >
                  {internshipTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1.5">
                  Duration <span className="text-status-error">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted shrink-0" />
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    required
                  >
                    {durationOptions.map((duration) => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1.5">
                  Spots Available <span className="text-status-error">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted shrink-0" />
                  <input
                    type="number"
                    name="spotsAvailable"
                    value={formData.spotsAvailable}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Number of spots"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* About the Role & Company */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary shrink-0" />
            About the Role & Company
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                About the Role <span className="text-status-error">*</span>
              </label>
              <textarea
                name="aboutRole"
                value={formData.aboutRole}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Describe the role, responsibilities, and what the intern will be doing..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                About the Company <span className="text-status-error">*</span>
              </label>
              <textarea
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell students about your company culture, mission, and values..."
                required
              />
            </div>
          </div>
        </Card>

        {/* Skills Required */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-primary shrink-0" />
            Skills Required <span className="text-sm font-normal text-text-muted ml-2">(From your profile)</span>
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsRequired.length === 0 ? (
                <p className="text-sm text-text-muted italic">No skills added yet. Add skills below.</p>
              ) : (
                formData.skillsRequired.map((skill, i) => (
                  <span key={i} className="max-w-full break-words px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkillToAdd}
                onChange={(e) => setNewSkillToAdd(e.target.value)}
                placeholder="Add skill..."
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddSkill} 
                type="button"
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Skills to be Offered */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-primary shrink-0" />
            Skills to be Offered <span className="text-sm font-normal text-text-muted ml-2">(From your profile)</span>
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsOffered.length === 0 ? (
                <p className="text-sm text-text-muted italic">No skills added yet. Add skills below.</p>
              ) : (
                formData.skillsOffered.map((skill, i) => (
                  <span key={i} className="max-w-full break-words px-3 py-1 bg-status-info/10 text-status-info text-sm rounded-full flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => handleRemoveOfferedSkill(skill)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkillToOffer}
                onChange={(e) => setNewSkillToOffer(e.target.value)}
                placeholder="Add skill to offer..."
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddOfferedSkill()}
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddOfferedSkill} 
                type="button"
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary shrink-0" />
            Benefits Offered <span className="text-sm font-normal text-text-muted ml-2">(From your profile)</span>
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.benefits.length === 0 ? (
                <p className="text-sm text-text-muted italic">No benefits added yet. Add benefits below.</p>
              ) : (
                formData.benefits.map((benefit, i) => (
                  <span key={i} className="max-w-full break-words px-3 py-1 bg-status-success/10 text-status-success text-sm rounded-full flex items-center gap-1">
                    {benefit}
                    <button
                      onClick={() => handleRemoveBenefit(benefit)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add benefit..."
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleAddBenefit} 
                type="button"
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Application Deadline */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary shrink-0" />
            Application Settings
          </h3>
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1.5">
              Application Deadline <span className="text-status-error">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted shrink-0" />
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <p className="text-xs text-text-muted mt-2">Applications will close on this date</p>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate('/company/internships')}
            type="button"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            loading={loading}
            icon={<Send className="w-4 h-4" />}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            Publish Internship
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default CreateInternship;