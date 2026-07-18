import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Loader
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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
    profilePicture: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleSettingsClick = () => {
    navigate('/student/settings');
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setUploadingPhoto(true);

    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        alert('User not found. Please login again.');
        setUploadingPhoto(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${API_URL}/api/students/profile/upload-photo/${userData.id}`,
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
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
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
    fetchProfile();
  };

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
        profilePicture: data.profilePicture || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setFetching(false);
    }
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
          <h1 className="text-2xl font-bold text-primary-dark">Profile</h1>
          <p className="text-text-secondary">
            {isEditing ? 'Edit your personal information' : 'Manage your personal information'}
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

      {/* Profile Header */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center overflow-hidden">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary-dark">
                  {profileData.firstName[0]}{profileData.lastName[0] || '?'}
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
            <p className="text-text-secondary">Computer Science Student</p>
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
                <p className="text-text-secondary font-medium break-words">{profileData.university}</p>
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
                <p className="text-text-secondary font-medium break-words">{profileData.faculty}</p>
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
                <p className="text-text-secondary font-medium break-words">{profileData.department}</p>
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
                <p className="text-text-secondary font-medium break-words">{profileData.matricNumber}</p>
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
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                </select>
              ) : (
                <p className="text-text-secondary font-medium">{profileData.level}</p>
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
                {profileData.skills.map((skill, i) => (
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
                ))}
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
                {profileData.interests.map((interest, i) => (
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
                ))}
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
                <p className="text-text-secondary font-medium break-words">{profileData.careerAspiration}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

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

export default StudentProfile;