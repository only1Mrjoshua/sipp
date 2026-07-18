import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  School, 
  Briefcase,
  Settings,
  Edit2,
  Save,
  Camera,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    faculty: '',
    department: '',
    matricNumber: '',
    level: '',
    skills: [],
    interests: [],
    careerAspiration: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [user, setUser] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const userData = authService.getCurrentUser();
      setUser(userData);
      
      if (!userData) {
        setFetching(false);
        return;
      }

      const response = await api.get(`/api/students/profile/${userData.id}`);
      const data = response.data;
      
      setProfileData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        university: data.university || '',
        faculty: data.faculty || '',
        department: data.department || '',
        matricNumber: data.matricNumber || '',
        level: data.level || '',
        skills: data.skills || [],
        interests: data.interests || [],
        careerAspiration: data.careerAspiration || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setFetching(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/student/settings');
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter(interest => interest !== interestToRemove),
    });
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

      // Prepare data for API
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        university: profileData.university,
        faculty: profileData.faculty,
        department: profileData.department,
        matricNumber: profileData.matricNumber,
        level: profileData.level,
        skills: profileData.skills,
        interests: profileData.interests,
        careerAspiration: profileData.careerAspiration,
      };

      await api.put(`/api/students/profile/${userData.id}`, updateData);
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfile();
      
      // Show success for 3 seconds
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
    // Refetch to reset any changes
    fetchProfile();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Profile</h1>
          <p className="text-text-secondary">
            {isEditing ? 'Edit your personal information' : 'Manage your personal information'}
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

      {/* Profile Header */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-dark">
                {profileData.firstName[0]}{profileData.lastName[0] || '?'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="min-w-0">
                  <label className="text-xs text-text-muted block">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    className="w-full min-w-0 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-xs text-text-muted block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    className="w-full min-w-0 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-primary-dark truncate">
                {profileData.firstName} {profileData.lastName}
              </h2>
            )}
            <p className="text-text-secondary">{profileData.department || 'Student'}</p>
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

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Academic Information */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <School className="w-5 h-5 mr-2 text-primary shrink-0" />
            Academic Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-muted">University</p>
              {isEditing ? (
                <input
                  type="text"
                  name="university"
                  value={profileData.university}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.university || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Faculty</p>
              {isEditing ? (
                <input
                  type="text"
                  name="faculty"
                  value={profileData.faculty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.faculty || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Department</p>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.department || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Matric Number</p>
              {isEditing ? (
                <input
                  type="text"
                  name="matricNumber"
                  value={profileData.matricNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.matricNumber || 'Not set'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Level</p>
              {isEditing ? (
                <select
                  name="level"
                  value={profileData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                >
                  <option value="">Select Level</option>
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                </select>
              ) : (
                <p className="text-text-secondary font-medium">{profileData.level || 'Not set'}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Skills & Interests */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary shrink-0" />
            Skills & Interests
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-muted">Skills</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profileData.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, i) => (
                    <span key={i} className="max-w-full break-words px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full flex items-center gap-1">
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
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill..."
                    className="w-full sm:flex-1 min-w-0 px-3 py-1 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddSkill}
                    className="sm:w-auto w-full shrink-0"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Interests</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profileData.interests && profileData.interests.length > 0 ? (
                  profileData.interests.map((interest, i) => (
                    <span key={i} className="max-w-full break-words px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full flex items-center gap-1">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1 hover:text-status-error transition-colors shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-text-muted italic">No interests added yet</p>
                )}
              </div>
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest..."
                    className="w-full sm:flex-1 min-w-0 px-3 py-1 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddInterest}
                    className="sm:w-auto w-full shrink-0"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-muted">Career Aspiration</p>
              {isEditing ? (
                <input
                  type="text"
                  name="careerAspiration"
                  value={profileData.careerAspiration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <p className="text-text-secondary font-medium break-words">{profileData.careerAspiration || 'Not set'}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Save/Cancel Buttons - Only visible in edit mode at the bottom */}
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

export default StudentProfile;