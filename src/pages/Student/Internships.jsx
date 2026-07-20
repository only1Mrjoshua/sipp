import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ArrowRight, User, AlertCircle, Briefcase, Loader } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const StudentInternships = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [hasSkills, setHasSkills] = useState(false);
  const [hasInterests, setHasInterests] = useState(false);
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    if (userData) {
      checkProfileCompletion(userData);
    } else {
      setLoading(false);
    }
  }, []);

  const checkProfileCompletion = async (userData) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/students/profile/completion/${userData.id}`);
      setProfileComplete(response.data.is_complete);
      setMissingFields(response.data.missing_fields);
      
      const profileResponse = await api.get(`/api/students/profile/${userData.id}`);
      const profile = profileResponse.data;
      
      const hasSkills = profile.skills && profile.skills.length > 0;
      const hasInterests = profile.interests && profile.interests.length > 0;
      
      setHasSkills(hasSkills);
      setHasInterests(hasInterests);
      
      if (response.data.is_complete && hasSkills && hasInterests) {
        await fetchInternships();
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await api.get('/api/internships/student/matched');
      setInternships(response.data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships([]);
    }
  };

  const handleApply = (internship) => {
    const internshipId = internship._id || internship.id;
    console.log('Navigating to apply with ID:', internshipId);
    if (internshipId) {
      navigate(`/student/apply/${internshipId}`);
    } else {
      console.error('No internship ID found:', internship);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show profile completion message if profile is not complete
  if (!profileComplete) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-20 h-20 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-accent-yellow" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-3">
            Complete Your Profile
          </h2>
          <p className="text-text-secondary mb-4">
            To get matched with internship opportunities based on your skills and interests, 
            please complete your profile information.
          </p>
          <p className="text-sm text-text-muted mb-4">
            The system uses your <strong>skills</strong> and <strong>interests</strong> to find 
            the best internships for you.
          </p>
          {missingFields.length > 0 && (
            <div className="bg-background-light rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-medium text-primary-dark mb-2">Missing Information:</p>
              <ul className="text-sm text-text-secondary space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button 
            variant="primary" 
            size="lg" 
            icon={<User className="w-5 h-5" />}
            onClick={() => navigate('/student/profile')}
          >
            Go to Profile
          </Button>
        </Card>
      </div>
    );
  }

  // Show message if student needs to add skills/interests
  if (!hasSkills || !hasInterests) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-20 h-20 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-accent-yellow" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-3">
            Add Your Skills & Interests
          </h2>
          <p className="text-text-secondary mb-4">
            To get personalized internship recommendations, you need to add your skills and interests to your profile.
          </p>
          <div className="bg-background-light rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-primary-dark mb-2">You're missing:</p>
            <ul className="text-sm text-text-secondary space-y-1">
              {!hasSkills && (
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Skills (e.g., React, Python, Java)
                </li>
              )}
              {!hasInterests && (
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Interests (e.g., Web Development, Data Science, UI/UX)
                </li>
              )}
            </ul>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            icon={<User className="w-5 h-5" />}
            onClick={() => navigate('/student/profile')}
          >
            Update Profile
          </Button>
        </Card>
      </div>
    );
  }

  // Show empty state if no internships available
  if (internships.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-3">
            No Internships Available
          </h2>
          <p className="text-text-secondary mb-4">
            There are currently no internships matching your skills and interests. 
            Companies haven't posted any internships that match your profile yet.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={<User className="w-4 h-4" />}
              onClick={() => navigate('/student/profile')}
            >
              Update Profile
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show internships if available
  return (
    <div>
      {/* Header with count */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Internships</h1>
          <p className="text-text-secondary">Browse internship opportunities matched for you</p>
        </div>
        <div className="text-sm text-text-muted font-medium bg-background-light px-4 py-2 rounded-full whitespace-nowrap">
          {internships.length} Internship{internships.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Internship Cards */}
      <div className="space-y-4">
        {internships.map((internship, index) => {
          const internshipId = internship._id || internship.id;
          
          return (
            <motion.div
              key={internshipId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-primary-dark truncate">{internship.title}</h3>
                        <p className="text-text-secondary flex items-center mt-1">
                          <Building2 className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{internship.companyName || 'Unknown Company'}</span>
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                        {internship.match || 0}% Match
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-secondary">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        {internship.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                        {internship.duration}
                      </span>
                      <span className="px-2 py-0.5 bg-background-light rounded-full">
                        {internship.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {internship.skillsRequired && internship.skillsRequired.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => handleApply(internship)}
                    className="flex-shrink-0"
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentInternships;