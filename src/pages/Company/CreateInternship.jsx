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
  AlertCircle,
  Award,
  Loader
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import SkillSelector from '../../components/common/SkillSelector';
import api from '../../services/api';
import { authService } from '../../services/authService';
import { 
  getInternshipTypesForIndustry,
  getSkillsRequiredForIndustry,
  getSkillsOfferedForIndustry,
  getBenefitsForIndustry
} from '../../data/industryData';

const CreateInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSkillsRequired, setAvailableSkillsRequired] = useState([]);
  const [availableSkillsOffered, setAvailableSkillsOffered] = useState([]);
  const [availableBenefits, setAvailableBenefits] = useState([]);

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

  const internshipTypes = ['Full-time', 'Part-time', 'Remote', 'Hybrid'];
  const durationOptions = ['3 months', '4 months', '6 months', '9 months', '12 months'];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to create an internship');
        setLoading(false);
        return;
      }

      // Fetch company profile
      const response = await api.get(`/api/companies/profile/${userData.id}`);
      const profile = response.data;
      setCompanyProfile(profile);

      // Set aboutCompany from profile
      setFormData(prev => ({
        ...prev,
        aboutCompany: profile.aboutCompany || profile.companyName || '',
        location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : prev.location
      }));

      // Load industry-based data
      if (profile.industry) {
        const types = getInternshipTypesForIndustry(profile.industry);
        const skillsReq = getSkillsRequiredForIndustry(profile.industry);
        const skillsOff = getSkillsOfferedForIndustry(profile.industry);
        const benefits = getBenefitsForIndustry(profile.industry);

        setAvailableTypes(types);
        setAvailableSkillsRequired(skillsReq);
        setAvailableSkillsOffered(skillsOff);
        setAvailableBenefits(benefits);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setError(error.response?.data?.detail || 'Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSkillsRequiredChange = (skills) => {
    setFormData({ ...formData, skillsRequired: skills });
  };

  const handleSkillsOfferedChange = (skills) => {
    setFormData({ ...formData, skillsOffered: skills });
  };

  const handleBenefitsChange = (benefits) => {
    setFormData({ ...formData, benefits: benefits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter an internship title');
      setSubmitting(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter a location');
      setSubmitting(false);
      return;
    }
    if (!formData.type) {
      setError('Please select an internship type');
      setSubmitting(false);
      return;
    }
    if (!formData.duration) {
      setError('Please select a duration');
      setSubmitting(false);
      return;
    }
    if (!formData.spotsAvailable || parseInt(formData.spotsAvailable) < 1) {
      setError('Please enter a valid number of spots');
      setSubmitting(false);
      return;
    }
    if (!formData.aboutRole.trim()) {
      setError('Please describe the role');
      setSubmitting(false);
      return;
    }
    if (!formData.applicationDeadline) {
      setError('Please set an application deadline');
      setSubmitting(false);
      return;
    }

    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to create an internship');
        setSubmitting(false);
        return;
      }

      const submitData = {
        ...formData,
        aboutCompany: formData.aboutCompany || companyProfile?.companyName || '',
        spotsAvailable: parseInt(formData.spotsAvailable),
        skillsRequired: formData.skillsRequired || [],
        skillsOffered: formData.skillsOffered || [],
        benefits: formData.benefits || [],
      };

      await api.post('/api/internships/create', submitData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/company/internships');
      }, 2000);
    } catch (error) {
      console.error('Error creating internship:', error);
      setError(error.response?.data?.detail || 'Failed to create internship. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary">Loading...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="py-12 max-w-4xl">
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
      {/* Back Button */}
      <button
        onClick={() => navigate('/company/internships')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Internships
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Create Internship</h1>
        <p className="text-text-secondary">Post a new internship opportunity</p>
        {companyProfile?.industry && (
          <p className="text-sm text-text-muted mt-1">
            Industry: <span className="font-medium text-primary">{companyProfile.industry}</span>
          </p>
        )}
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
              {availableTypes.length > 0 ? (
                <>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="">Select Internship Type</option>
                    {availableTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <p className="text-xs text-text-muted mt-1">
                    Recommended positions based on your industry
                  </p>
                </>
              ) : (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g. Frontend Developer Intern"
                  required
                />
              )}
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

        {/* Skills Required - Using SkillSelector */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-primary shrink-0" />
            Skills Required
            <span className="text-sm font-normal text-text-muted ml-2">(Tap to select from industry recommendations)</span>
          </h3>
          {availableSkillsRequired.length > 0 ? (
            <SkillSelector
              label=""
              options={availableSkillsRequired}
              selected={formData.skillsRequired}
              onChange={handleSkillsRequiredChange}
              placeholder="Search skills..."
              emptyMessage="No skills available for your industry"
              maxDisplay={8}
            />
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-3">No industry-specific skills available. Add your own:</p>
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
          )}
        </Card>

        {/* Skills to be Offered - Using SkillSelector */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-primary shrink-0" />
            Skills to be Offered
            <span className="text-sm font-normal text-text-muted ml-2">(Tap to select from industry recommendations)</span>
          </h3>
          {availableSkillsOffered.length > 0 ? (
            <SkillSelector
              label=""
              options={availableSkillsOffered}
              selected={formData.skillsOffered}
              onChange={handleSkillsOfferedChange}
              placeholder="Search skills to offer..."
              emptyMessage="No skills available for your industry"
              maxDisplay={8}
            />
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-3">No industry-specific skills available. Add your own:</p>
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
          )}
        </Card>

        {/* Benefits - Using SkillSelector */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary shrink-0" />
            Benefits Offered
            <span className="text-sm font-normal text-text-muted ml-2">(Tap to select from industry recommendations)</span>
          </h3>
          {availableBenefits.length > 0 ? (
            <SkillSelector
              label=""
              options={availableBenefits}
              selected={formData.benefits}
              onChange={handleBenefitsChange}
              placeholder="Search benefits..."
              emptyMessage="No benefits available for your industry"
              maxDisplay={8}
            />
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-3">No industry-specific benefits available. Add your own:</p>
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
          )}
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
            loading={submitting}
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