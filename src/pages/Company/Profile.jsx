import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  GraduationCap
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  
  const [profileData, setProfileData] = useState({
    companyName: 'TechCorp Inc.',
    email: 'hr@techcorp.com',
    phone: '+234 800 123 4567',
    website: 'www.techcorp.com',
    industry: 'Software',
    state: 'Lagos',
    city: 'Lekki',
    address: '123 Business District, Lagos',
    companyDescription: 'Leading technology company specializing in innovative web solutions and software development. We are dedicated to nurturing young talent and providing real-world experience to students.',
    companySize: '51-200',
    internshipCategories: ['Software Engineering', 'Data Science', 'UI/UX Design'],
    skillsRequired: ['React', 'JavaScript', 'Python', 'SQL', 'Java'],
    skillsOffered: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    benefits: ['Remote', 'Paid', 'Mentorship', 'Certificate', 'Hybrid'],
  });

  const companySizes = ['1–10', '11–50', '51–200', '200+'];

  const handleSettingsClick = () => {
    navigate('/company/settings');
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
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

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
    }, 1500);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Company Profile</h1>
          <p className="text-text-secondary">
            {isEditing ? 'Edit your company information' : 'Manage your company information'}
          </p>
        </div>
        {/* Save/Cancel Buttons at the top */}
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

      {/* Company Header */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-dark">
                {profileData.companyName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                <Camera className="w-4 h-4" />
              </button>
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
              <h2 className="text-2xl font-bold text-primary-dark truncate">{profileData.companyName}</h2>
            )}
            <p className="text-text-secondary truncate">{profileData.industry}</p>
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

      {/* Company Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary shrink-0" />
            Company Information
          </h3>
          <div className="space-y-3">
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
                <p className="text-text-secondary font-medium break-words">{profileData.industry}</p>
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
                />
              ) : (
                <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-text-secondary font-medium break-all">
                  {profileData.website}
                </a>
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
                <p className="text-text-secondary font-medium break-words">{profileData.companySize} employees</p>
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
                  <p className="text-text-secondary font-medium break-words">{profileData.city}, {profileData.state}</p>
                  <p className="text-text-secondary text-sm break-words">{profileData.address}</p>
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
                {profileData.companyDescription}
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
            {profileData.internshipCategories.map((category, i) => (
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
            ))}
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
            {profileData.skillsRequired.map((skill, i) => (
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
            ))}
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
            {profileData.skillsOffered.map((skill, i) => (
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
            ))}
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
            {profileData.benefits.map((benefit, i) => (
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
            ))}
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