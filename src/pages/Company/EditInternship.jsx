import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Save,
  X,
  Plus,
  CheckCircle,
  Award,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import api from '../../services/api';
import { authService } from '../../services/authService';

const EditInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    duration: '',
    spotsAvailable: '',
    aboutRole: '',
    aboutCompany: '',
    applicationDeadline: '',
    skillsRequired: [],
    skillsOffered: [],
    benefits: [],
  });

  const internshipTypes = ['Full-time', 'Part-time', 'Remote', 'Hybrid'];
  const durationOptions = ['3 months', '4 months', '6 months', '9 months', '12 months'];

  useEffect(() => {
    fetchInternshipData();
  }, [id]);

  const fetchInternshipData = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to view this internship');
        setLoading(false);
        return;
      }

      const response = await api.get(`/api/internships/${id}`);
      const data = response.data;
      
      setFormData({
        title: data.title || '',
        location: data.location || '',
        type: data.type || 'Full-time',
        duration: data.duration || '6 months',
        spotsAvailable: data.spotsAvailable || '',
        aboutRole: data.aboutRole || '',
        aboutCompany: data.aboutCompany || '',
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline).toISOString().split('T')[0] : '',
        skillsRequired: data.skillsRequired || [],
        skillsOffered: data.skillsOffered || [],
        benefits: data.benefits || [],
      });
    } catch (error) {
      console.error('Error fetching internship:', error);
      setError(error.response?.data?.detail || 'Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddOfferedSkill = () => {
    if (newOfferedSkill.trim() && !formData.skillsOffered.includes(newOfferedSkill.trim())) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, newOfferedSkill.trim()],
      });
      setNewOfferedSkill('');
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
    setSubmitting(true);
    setError('');
    
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to update this internship');
        setSubmitting(false);
        return;
      }

      // Prepare data for API
      const updateData = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        duration: formData.duration,
        spotsAvailable: parseInt(formData.spotsAvailable),
        aboutRole: formData.aboutRole,
        aboutCompany: formData.aboutCompany,
        applicationDeadline: formData.applicationDeadline,
        skillsRequired: formData.skillsRequired,
        skillsOffered: formData.skillsOffered,
        benefits: formData.benefits,
      };

      await api.put(`/api/internships/${id}`, updateData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/company/internship/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating internship:', error);
      setError(error.response?.data?.detail || 'Failed to update internship. Please try again.');
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
            <p className="mt-4 text-text-secondary">Loading internship details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error && !formData.title) {
    return (
      <Container className="py-8 max-w-4xl">
        <button
          onClick={() => navigate('/company/internships')}
          className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Internships
        </button>
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Internship</h2>
          <p className="text-text-secondary">{error}</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={fetchInternshipData}
          >
            Try Again
          </Button>
        </Card>
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
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Internship Updated!</h2>
          <p className="text-text-secondary mb-6">
            Your internship has been successfully updated.
          </p>
          <p className="text-sm text-text-muted">Redirecting...</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/company/internship/${id}`)}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Internship
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Edit Internship</h1>
        <p className="text-text-secondary">Update your internship posting</p>
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
            Skills Required
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsRequired.map((skill, i) => (
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
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
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
            Skills to be Offered
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skillsOffered.map((skill, i) => (
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
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
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
            <Award className="w-5 h-5 mr-2 text-primary shrink-0" />
            Benefits Offered
          </h3>
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.benefits.map((benefit, i) => (
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
              ))}
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
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/company/internship/${id}`)}
            type="button"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            loading={submitting}
            icon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            Update Internship
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default EditInternship;