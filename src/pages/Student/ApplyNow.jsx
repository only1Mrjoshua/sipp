import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Briefcase, 
  CheckCircle,
  Send,
  Loader,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import api from '../../services/api';
import { authService } from '../../services/authService';

const ApplyNow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [error, setError] = useState('');
  const [internship, setInternship] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [matchScore, setMatchScore] = useState(0);

  useEffect(() => {
    console.log('ApplyNow mounted with ID from params:', id);
    
    if (!id) {
      setError('No internship specified. Please go back and try again.');
      setLoading(false);
      return;
    }
    
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to apply');
        setLoading(false);
        return;
      }

      console.log('Fetching internship with ID:', id);
      const internshipResponse = await api.get(`/api/internships/${id}`);
      console.log('Internship data received:', internshipResponse.data);
      setInternship(internshipResponse.data);

      // Fetch student profile
      const profileResponse = await api.get(`/api/students/profile/${userData.id}`);
      setStudentProfile(profileResponse.data);

      // Calculate match score
      const studentSkills = profileResponse.data.skills || [];
      const internshipSkills = internshipResponse.data.skillsRequired || [];
      
      if (studentSkills.length > 0 && internshipSkills.length > 0) {
        const matchedSkills = studentSkills.filter(skill => internshipSkills.includes(skill));
        const score = Math.round((matchedSkills.length / internshipSkills.length) * 100);
        setMatchScore(Math.min(score, 100));
      } else {
        setMatchScore(0);
      }

      // Check if student has already applied
      try {
        const applicationsResponse = await api.get('/api/applications/student');
        const applications = applicationsResponse.data || [];
        const hasApplied = applications.some(app => app.internshipId === id);
        setAlreadyApplied(hasApplied);
        console.log('Already applied:', hasApplied);
      } catch (appError) {
        console.error('Error checking applications:', appError);
        setAlreadyApplied(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.detail || 'Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (alreadyApplied) {
      return;
    }
    
    setApplying(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to apply');
        setApplying(false);
        return;
      }

      const payload = {
        internshipId: id,
        coverLetter: '', // Optional: Add cover letter field if needed
      };

      console.log('Submitting application with payload:', payload);
      await api.post('/api/applications/apply', payload);
      setApplied(true);
      setTimeout(() => {
        navigate('/student/applications');
      }, 2000);
    } catch (error) {
      console.error('Error applying:', error);
      setError(error.response?.data?.detail || 'Failed to submit application. Please try again.');
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <Container className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-status-error" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button variant="outline" onClick={() => navigate('/student/internships')}>
            Back to Internships
          </Button>
        </Card>
      </Container>
    );
  }

  if (!internship) {
    return (
      <Container className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Internship Not Found</h2>
          <p className="text-text-secondary mb-6">The internship you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/student/internships')}>
            Browse Internships
          </Button>
        </Card>
      </Container>
    );
  }

  if (applied) {
    return (
      <Container className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-status-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">Application Submitted!</h2>
          <p className="text-text-secondary mb-6">
            Your application for <strong>{internship.title}</strong> has been successfully submitted.
          </p>
          <p className="text-sm text-text-muted">Redirecting to applications...</p>
        </Card>
      </Container>
    );
  }

  // Use spotsAvailable directly from the internship data
  const spotsAvailable = internship.spotsAvailable || 0;
  const isFull = spotsAvailable <= 0;

  return (
    <Container noPadding className="px-2 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/internships')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Internships
      </button>

      {error && (
        <div className="mb-4 p-3 bg-status-error/10 text-status-error text-sm rounded-xl border border-status-error/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {alreadyApplied && (
        <div className="mb-4 p-3 bg-status-success/10 text-status-success text-sm rounded-xl border border-status-success/20 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          You have already applied to this internship.
        </div>
      )}

      {isFull && !alreadyApplied && internship.status === 'Active' && (
        <div className="mb-4 p-3 bg-accent-yellow/10 text-accent-yellow text-sm rounded-xl border border-accent-yellow/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          This internship is currently full. No more spots available.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Internship Details */}
          <Card variant="bordered" padding="lg">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-primary-dark">{internship.title}</h1>
                <p className="text-text-secondary flex items-center mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  {internship.companyName || internship.company || 'Unknown Company'}
                </p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full whitespace-nowrap shrink-0">
                {matchScore || internship.match || 0}% Match
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {internship.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {internship.duration}
              </span>
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {internship.type}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {internship.skillsRequired && internship.skillsRequired.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-sm max-w-none">
              <h4 className="text-sm font-semibold text-primary-dark">About the Role</h4>
              <p className="text-text-secondary text-sm">{internship.aboutRole || internship.description}</p>

              <h4 className="text-sm font-semibold text-primary-dark mt-4">About the Company</h4>
              <p className="text-text-secondary text-sm">{internship.aboutCompany || internship.about}</p>

              {internship.requirements && internship.requirements.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold text-primary-dark mt-4">Requirements</h4>
                  <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                    {internship.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </>
              )}

              {internship.benefits && internship.benefits.length > 0 && (
                <>
                  <h4 className="text-sm font-semibold text-primary-dark mt-4">Benefits</h4>
                  <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                    {internship.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-light">
              <div>
                <p className="text-xs text-text-muted">Application Deadline</p>
                <p className="text-sm font-medium text-primary-dark">{internship.applicationDeadline || internship.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Availability</p>
                <p className={`text-sm font-medium ${spotsAvailable <= 0 ? 'text-status-error' : 'text-primary-dark'}`}>
                  {spotsAvailable} spots {spotsAvailable <= 0 ? '(Full)' : 'available'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Application Form */}
        <div className="space-y-6">
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Application Review</h2>
            <p className="text-sm text-text-secondary mb-4">
              Your profile information will be used for this application. Please review before submitting.
            </p>

            {/* Profile Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Full Name</span>
                <span className="font-medium text-primary-dark">
                  {studentProfile?.firstName || ''} {studentProfile?.lastName || ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Email</span>
                <span className="font-medium text-primary-dark">{studentProfile?.email || ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Phone</span>
                <span className="font-medium text-primary-dark">{studentProfile?.phone || ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">University</span>
                <span className="font-medium text-primary-dark">{studentProfile?.university || ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Department</span>
                <span className="font-medium text-primary-dark">{studentProfile?.department || ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Level</span>
                <span className="font-medium text-primary-dark">{studentProfile?.level || ''}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Skills</span>
                <span className="font-medium text-primary-dark text-xs">
                  {studentProfile?.skills?.join(', ') || 'No skills added'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Career Aspiration</span>
                <span className="font-medium text-primary-dark">{studentProfile?.careerAspiration || 'Not set'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-light">
            </div>

            {alreadyApplied ? (
              <Button
                variant="success"
                size="lg"
                fullWidth
                disabled
                icon={<FileCheck className="w-5 h-5" />}
                className="bg-status-success text-white hover:bg-status-success/80 cursor-default"
              >
                Applied ✓
              </Button>
            ) : isFull ? (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                disabled
                className="cursor-not-allowed opacity-50"
              >
                No Spots Available
              </Button>
            ) : internship.status !== 'Active' ? (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                disabled
                className="cursor-not-allowed opacity-50"
              >
                Internship Closed
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={applying}
                onClick={handleApply}
                icon={<Send className="w-5 h-5" />}
              >
                Apply Now
              </Button>
            )}

            <p className="text-xs text-text-muted text-center mt-3">
              {alreadyApplied 
                ? "You've already applied to this internship"
                : isFull
                ? "No spots available for this internship"
                : internship.status !== 'Active'
                ? "This internship is no longer accepting applications"
                : `By applying, you agree to share your profile information with ${internship.companyName || internship.company}`
              }
            </p>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ApplyNow;