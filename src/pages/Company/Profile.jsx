import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Settings,
  Edit2,
  Save,
  Camera,
  X,
  Globe,
  Users,
  Calendar,
  FileText,
  Tag,
  Award,
  Plus,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  
  const [profileData, setProfileData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    state: '',
    city: '',
    address: '',
    companyDescription: '',
    companySize: '',
    internshipCategories: [],
    skillsRequired: [],
    skillsOffered: [],
    benefits: [],
    profilePicture: '',
  });

  const companySizes = ['1–10', '11–50', '51–200', '200+'];

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setFetching(false);
        return;
      }

      const response = await api.get(`/api/companies/profile/${userData.id}`);
      const data = response.data;
      
      setProfileData({
        companyName: data.companyName || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        industry: data.industry || '',
        state: data.state || '',
        city: data.city || '',
        address: data.address || '',
        companyDescription: data.companyDescription || '',
        companySize: data.companySize || '',
        internshipCategories: data.internshipCategories || [],
        skillsRequired: data.skillsRequired || [],
        skillsOffered: data.skillsOffered || [],
        benefits: data.benefits || [],
        profilePicture: data.profilePicture || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setFetching(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/company/settings');
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setError('');
    setSaveSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setError('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !profileData.internshipCategories.includes(newCategory.trim())) {
      setProfileData({
        ...profileData,
        internshipCategories: [...profileData.internshipCategories, newCategory.trim()],
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setProfileData({
      ...profileData,
      internshipCategories: profileData.internshipCategories.filter(cat => cat !== categoryToRemove),
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skillsRequired.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skillsRequired: [...profileData.skillsRequired, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skillsRequired: profileData.skillsRequired.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddOfferedSkill = () => {
    if (newOfferedSkill.trim() && !profileData.skillsOffered.includes(newOfferedSkill.trim())) {
      setProfileData({
        ...profileData,
        skillsOffered: [...profileData.skillsOffered, newOfferedSkill.trim()],
      });
      setNewOfferedSkill('');
    }
  };

  const handleRemoveOfferedSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skillsOffered: profileData.skillsOffered.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !profileData.benefits.includes(newBenefit.trim())) {
      setProfileData({
        ...profileData,
        benefits: [...profileData.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setProfileData({
      ...profileData,
      benefits: profileData.benefits.filter(benefit => benefit !== benefitToRemove),
    });
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingPhoto(true);
    setError('');

    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('User not found. Please login again.');
        setUploadingPhoto(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${API_URL}/api/companies/profile/upload-photo/${userData.id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload photo');
      }

      const data = await response.json();
      
      setProfileData({
        ...profileData,
        profilePicture: data.profilePicture,
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      const updateData = {
        companyName: profileData.companyName,
        phone: profileData.phone,
        website: profileData.website || '',
        industry: profileData.industry,
        state: profileData.state,
        city: profileData.city,
        address: profileData.address,
        companyDescription: profileData.companyDescription,
        companySize: profileData.companySize,
        internshipCategories: profileData.internshipCategories,
        skillsRequired: profileData.skillsRequired,
        skillsOffered: profileData.skillsOffered,
        benefits: profileData.benefits,
      };

      await api.put(`/api/companies/profile/${userData.id}`, updateData);
      
      setSaveSuccess(true);
      setIsEditing(false);
      await fetchProfile();
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.detail || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    fetchProfile();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Company Profile</h1>
          <p className="text-text-secondary">
            {isEditing ? 'Edit your company information' : 'Manage your company information'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={isEditing ? "primary" : "ghost"} 
            size="sm" 
            icon={isEditing ? <Save className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            onClick={isEditing ? handleSave : handleSettingsClick}
            loading={loading}
            className="whitespace-nowrap"
          >
            {isEditing ? 'Save Changes' : 'Settings'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-status-success/10 text-status-success text-sm rounded-xl border border-status-success/20 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Profile updated successfully!
        </motion.div>
      )}

      {/* Error Message */}
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

      {/* Company Header */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center overflow-hidden">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary-dark">
                  {profileData.companyName ? profileData.companyName.split(' ').map(n => n[0]).join('') : 'C'}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors cursor-pointer">
                {uploadingPhoto ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
            )}
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                name="companyName"
                value={profileData.companyName}
                onChange={handleChange}
                className="w-full min-w-0 text-2xl font-bold text-primary-dark px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <h2 className="text-2xl font-bold text-primary-dark truncate">{profileData.companyName || 'Not set'}</h2>
            )}
            <p className="text-text-secondary truncate">{profileData.industry || 'Industry not set'}</p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mt-3 text-sm w-full">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                    <Mail className="w-4 h-4 shrink-0 text-text-muted" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="flex-1 min-w-0 w-full px-3 py-1 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                    <Phone className="w-4 h-4 shrink-0 text-text-muted" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="flex-1 min-w-0 w-full px-3 py-1 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <span className="flex items-center text-text-secondary truncate">
                    <Mail className="w-4 h-4 mr-1 shrink-0" />
                    <span className="truncate">{profileData.email}</span>
                  </span>
                  <span className="flex items-center text-text-secondary truncate">
                    <Phone className="w-4 h-4 mr-1 shrink-0" />
                    <span className="truncate">{profileData.phone}</span>
                  </span>
                </>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              icon={<Edit2 className="w-4 h-4" />}
              onClick={handleEditToggle}
              className="flex-shrink-0"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Company Details - Rest of the component remains the same */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary shrink-0" />
            Company Information
          </h3>
          <div className="space-y-3">
            {/* ... existing company info fields ... */}
            <div>
              <p className="text-sm text-text-muted">Industry</p>
              {isEditing ? (
                <input
                  type="text"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.industry || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Website</p>
              {isEditing ? (
                <input
                  type="text"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  placeholder="e.g. www.company.com"
                />
              ) : (
                <div>
                  {profileData.website ? (
                    <a 
                      href={`https://${profileData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline text-text-secondary font-medium break-all flex items-center gap-1"
                    >
                      <Globe className="w-4 h-4" />
                      {profileData.website}
                    </a>
                  ) : (
                    <p className="text-text-secondary font-medium break-words">Not set</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Company Size</p>
              {isEditing ? (
                <select
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                >
                  <option value="">Select Size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.companySize || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Location</p>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <>
                  <p className="text-text-secondary font-medium break-words">{profileData.city || 'Not set'}, {profileData.state || 'Not set'}</p>
                  <p className="text-text-secondary text-sm break-words">{profileData.address || 'Not set'}</p>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Company Description */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary shrink-0" />
            About Company
          </h3>
          <div>
            <p className="text-sm text-text-muted mb-2">Company Description</p>
            {isEditing ? (
              <textarea
                name="companyDescription"
                value={profileData.companyDescription}
                onChange={handleChange}
                rows="6"
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-text-secondary text-sm leading-relaxed break-words">
                {profileData.companyDescription || 'No description provided'}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Internship Categories */}
      <Card variant="bordered" padding="lg" className="mt-6">
        <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-primary shrink-0" />
          Internship Categories
        </h3>
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.internshipCategories && profileData.internshipCategories.length > 0 ? (
              profileData.internshipCategories.map((category, i) => (
                <span key={i} className="max-w-full break-words px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full flex items-center gap-1">
                  {category}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted italic">No categories added yet</p>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category (e.g. Software Engineering)"
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddCategory}
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Skills Required */}
      <Card variant="bordered" padding="lg" className="mt-6">
        <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary shrink-0" />
          Skills Required
        </h3>
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.skillsRequired && profileData.skillsRequired.length > 0 ? (
              profileData.skillsRequired.map((skill, i) => (
                <span key={i} className="max-w-full break-words px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full flex items-center gap-1">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted italic">No skills added yet</p>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. React)"
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddSkill}
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Skills to be Offered */}
      <Card variant="bordered" padding="lg" className="mt-6">
        <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-primary shrink-0" />
          Skills to be Offered
        </h3>
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.skillsOffered && profileData.skillsOffered.length > 0 ? (
              profileData.skillsOffered.map((skill, i) => (
                <span key={i} className="max-w-full break-words px-3 py-1 bg-status-info/10 text-status-info text-sm rounded-full flex items-center gap-1">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveOfferedSkill(skill)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted italic">No skills added yet</p>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
                placeholder="Add skill to offer (e.g. React)"
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddOfferedSkill()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddOfferedSkill}
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
          <p className="text-xs text-text-muted mt-2">Skills that interns will learn during their time at your company</p>
        </div>
      </Card>

      {/* Benefits */}
      <Card variant="bordered" padding="lg" className="mt-6">
        <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-primary shrink-0" />
          Benefits Offered
        </h3>
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profileData.benefits && profileData.benefits.length > 0 ? (
              profileData.benefits.map((benefit, i) => (
                <span key={i} className="max-w-full break-words px-3 py-1 bg-status-success/10 text-status-success text-sm rounded-full flex items-center gap-1">
                  {benefit}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveBenefit(benefit)}
                      className="ml-1 hover:text-status-error transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-muted italic">No benefits added yet</p>
            )}
          </div>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add benefit (e.g. Remote)"
                className="min-w-0 flex-1 w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddBenefit}
                className="sm:w-auto w-full shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;