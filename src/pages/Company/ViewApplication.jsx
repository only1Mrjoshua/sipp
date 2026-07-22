import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  Briefcase,
  User,
  Mail, 
  Phone, 
  School, 
  BookOpen,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Download,
  Mail as MailIcon,
  MessageCircle,
  Calendar,
  Tag,
  Award,
  FileText,
  Send,
  Eye,
  FileEdit,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import api from '../../services/api';
import { authService } from '../../services/authService';

const ViewApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);
  const [internship, setInternship] = useState(null);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [note, setNote] = useState('');
  const [reviewStarted, setReviewStarted] = useState(false);

  useEffect(() => {
    fetchApplicationData();
  }, [id]);

  const fetchApplicationData = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setError('Please login to view this application');
        setLoading(false);
        return;
      }

      // Get application details
      const response = await api.get(`/api/applications/${id}`);
      const appData = response.data;
      setApplication(appData);

      // Get internship details
      if (appData.internshipId) {
        try {
          const internshipResponse = await api.get(`/api/internships/${appData.internshipId}`);
          setInternship(internshipResponse.data);
        } catch (err) {
          console.error('Error fetching internship:', err);
        }
      }

      // Get student details
      if (appData.studentId) {
        try {
          const studentResponse = await api.get(`/api/students/profile/${appData.studentId}`);
          setStudent(studentResponse.data);
        } catch (err) {
          console.error('Error fetching student:', err);
          setStudent({
            firstName: appData.studentName || 'Unknown',
            lastName: '',
            email: appData.studentEmail || 'Not provided',
            phone: appData.studentPhone || 'Not provided',
            university: appData.studentUniversity || '',
            department: appData.studentDepartment || '',
            level: appData.studentLevel || '',
            skills: appData.studentSkills || [],
            interests: appData.studentInterests || [],
            careerAspiration: ''
          });
        }
      }

      // ---------- AUTO-START REVIEW ----------
      // If the application has no status, automatically start the review.
      if (!appData.status || appData.status === '') {
        await autoStartReview();
      }
      // --------------------------------------

    } catch (error) {
      console.error('Error fetching application:', error);
      setError(error.response?.data?.detail || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  // New function to auto-start review
  const autoStartReview = async () => {
    if (reviewStarted) return;
    setReviewStarted(true);
    try {
      await api.put(`/api/applications/${id}/review`);
      setApplication(prev => prev ? { ...prev, status: 'In Review' } : null);
      console.log('Auto-review started successfully');
    } catch (error) {
      console.error('Error auto-starting review:', error);
    }
  };

  const statusOptions = ['In Review', 'Accept', 'Reject'];

  const getDisplayStatus = (status) => {
    if (!status) return '';
    switch(status) {
      case 'Accept': return 'Accepted';
      case 'Reject': return 'Rejected';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-text-muted/10 text-text-muted';
    const displayStatus = getDisplayStatus(status);
    switch(displayStatus) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-text-muted/10 text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <ClockIcon className="w-5 h-5 text-text-muted" />;
    const displayStatus = getDisplayStatus(status);
    switch(displayStatus) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'In Review': return <ClockIcon className="w-5 h-5 text-accent-yellow" />;
      default: return <ClockIcon className="w-5 h-5 text-text-muted" />;
    }
  };

  const getModalMessage = (status) => {
    switch(status) {
      case 'Accept': return 'Are you sure you want to Accept this Student\'s Application?';
      case 'Reject': return 'Are you sure you want to Reject this Student\'s Application?';
      default: return `Are you sure you want to change the status to ${status}?`;
    }
  };

  const getModalTitle = (status) => {
    switch(status) {
      case 'Accept': return 'Accept Application';
      case 'Reject': return 'Reject Application';
      default: return 'Update Application Status';
    }
  };

  const getNotePlaceholder = (status) => {
    switch(status) {
      case 'Accept': return 'Add a note (e.g. Start date, next steps, etc.)';
      case 'Reject': return 'Add a note explaining why the application was rejected';
      default: return 'Add a note (optional)';
    }
  };

  const getNoteLabel = (status) => {
    switch(status) {
      case 'Accept': return 'Acceptance Note (Optional)';
      case 'Reject': return 'Rejection Reason (Optional)';
      default: return 'Note (Optional)';
    }
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setNote('');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    setUpdating(true);
    try {
      let backendStatus = selectedStatus;
      if (selectedStatus === 'Accept') backendStatus = 'Accepted';
      if (selectedStatus === 'Reject') backendStatus = 'Rejected';

      await api.put(`/api/applications/${id}/status`, {
        status: backendStatus,
        note: note || ''
      });
      
      setApplication(prev => ({
        ...prev,
        status: backendStatus,
        note: note || prev.note
      }));
      
      setShowStatusModal(false);
      await fetchApplicationData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.detail || 'Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadResume = () => {
    alert('Download functionality coming soon');
  };

  const handleMessageStudent = () => {
    const phoneNumber = student?.phone || application?.studentPhone;
    if (phoneNumber) {
      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, '');
      window.location.href = `sms:${formattedNumber}`;
    } else {
      alert('No phone number available for this student');
    }
  };

  const handleEmailStudent = () => {
    const email = student?.email || application?.studentEmail;
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      alert('No email available for this student');
    }
  };

  if (loading) {
    return (
      <Container className="py-8 max-w-5xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary">Loading application details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !application) {
    return (
      <Container className="py-8 max-w-5xl">
        <button
          onClick={() => navigate('/company/applications')}
          className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Applications
        </button>
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Application</h2>
          <p className="text-text-secondary">{error || 'Application not found'}</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={fetchApplicationData}
          >
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  const studentName = student 
    ? `${student.firstName || ''} ${student.lastName || ''}`.trim() 
    : application.studentName || 'Unknown Student';

  const studentEmail = student?.email || application.studentEmail || 'Not provided';
  const studentPhone = student?.phone || application.studentPhone || 'Not provided';
  const studentUniversity = student?.university || application.studentUniversity || '';
  const studentFaculty = student?.faculty || '';
  const studentDepartment = student?.department || application.studentDepartment || '';
  const studentLevel = student?.level || application.studentLevel || '';
  const studentSkills = student?.skills || application.studentSkills || [];
  const studentInterests = student?.interests || application.studentInterests || [];
  const studentCareerAspiration = student?.careerAspiration || '';

  const internshipTitle = internship?.title || application.internshipTitle || 'Unknown Position';
  const internshipLocation = internship?.location || 'Not specified';
  const internshipDuration = internship?.duration || 'Not specified';
  const internshipType = internship?.type || 'Full-time';

  const currentStatus = application.status || null;

  return (
    <Container className="py-8 max-w-5xl">
      <button
        onClick={() => navigate('/company/applications')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Applications
      </button>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Application Details</h1>
          <p className="text-text-secondary">
            Review application for <span className="font-medium text-primary-dark">{internshipTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentStatus && (
            <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${getStatusColor(currentStatus)}`}>
              {getStatusIcon(currentStatus)}
              <span className="ml-1">{getDisplayStatus(currentStatus)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Student Information
            </h3>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-light">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-dark">
                  {studentName.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary-dark">{studentName}</h4>
                <p className="text-text-secondary">{studentCareerAspiration || 'Student'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  {studentEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  {studentPhone}
                </p>
              </div>
              {studentUniversity && (
                <div>
                  <p className="text-sm text-text-muted">University</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <School className="w-4 h-4 mr-2 text-primary" />
                    {studentUniversity}
                  </p>
                </div>
              )}
              {studentFaculty && (
                <div>
                  <p className="text-sm text-text-muted">Faculty</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-primary" />
                    {studentFaculty}
                  </p>
                </div>
              )}
              {studentDepartment && (
                <div>
                  <p className="text-sm text-text-muted">Department</p>
                  <p className="font-medium text-primary-dark">{studentDepartment}</p>
                </div>
              )}
              {studentLevel && (
                <div>
                  <p className="text-sm text-text-muted">Level</p>
                  <p className="font-medium text-primary-dark">{studentLevel}</p>
                </div>
              )}
            </div>
          </Card>

          {(studentSkills.length > 0 || studentInterests.length > 0 || studentCareerAspiration) && (
            <Card variant="bordered" padding="lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-primary" />
                Skills & Interests
              </h3>
              <div className="space-y-4">
                {studentSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-text-muted mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {studentSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {studentInterests.length > 0 && (
                  <div>
                    <p className="text-sm text-text-muted mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {studentInterests.map((interest, i) => (
                        <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {studentCareerAspiration && (
                  <div>
                    <p className="text-sm text-text-muted">Career Aspiration</p>
                    <p className="font-medium text-primary-dark">{studentCareerAspiration}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {application.coverLetter && (
            <Card variant="bordered" padding="lg">
              <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Cover Letter
              </h3>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {application.coverLetter}
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h3 className="text-lg font-bold text-primary-dark mb-4">Application Actions</h3>
            
            <div className="mb-4 p-4 bg-primary/5 rounded-xl text-center">
              <p className="text-sm text-text-muted">Match Score</p>
              <p className="text-3xl font-bold text-primary">{application.matchScore || 0}%</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-dark">Update Status</p>
              {statusOptions.map((status) => {
                const isActive = 
                  (status === 'Accept' && currentStatus === 'Accepted') ||
                  (status === 'Reject' && currentStatus === 'Rejected') ||
                  (status === 'In Review' && currentStatus === 'In Review');

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? `${getStatusColor(status)} font-medium`
                        : 'text-text-secondary hover:bg-background-light'
                    }`}
                    disabled={isActive}
                  >
                    {status}
                    {isActive && (
                      <span className="ml-2 text-xs">(Current)</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="my-4 border-t border-border-light"></div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-dark">Contact Student</p>
              {studentEmail && studentEmail !== 'Not provided' && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={handleEmailStudent}
                  icon={<MailIcon className="w-4 h-4" />}
                >
                  Send Email
                </Button>
              )}
              {studentPhone && studentPhone !== 'Not provided' && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={handleMessageStudent}
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  Message Student
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-strong"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedStatus === 'Accept' ? 'bg-status-success/10' : 
                selectedStatus === 'Reject' ? 'bg-status-error/10' : 
                'bg-accent-yellow/10'
              }`}>
                {selectedStatus === 'Accept' ? <CheckCircle className="w-5 h-5 text-status-success" /> :
                 selectedStatus === 'Reject' ? <XCircle className="w-5 h-5 text-status-error" /> :
                 <ClockIcon className="w-5 h-5 text-accent-yellow" />}
              </div>
              <h3 className="text-lg font-bold text-primary-dark">{getModalTitle(selectedStatus)}</h3>
            </div>

            <p className="text-text-secondary text-sm mb-4">
              {getModalMessage(selectedStatus)}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-primary-dark mb-1.5">
                {getNoteLabel(selectedStatus)}
              </label>
              <div className="relative">
                <FileEdit className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={getNotePlaceholder(selectedStatus)}
                  rows="3"
                  className="w-full pl-9 pr-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                {selectedStatus === 'Accept' ? 'Add any additional information for the student' :
                 selectedStatus === 'Reject' ? 'Providing a reason helps the student improve' :
                 'Optional note for your records'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={confirmStatusChange}
                loading={updating}
                className={selectedStatus === 'Accept' ? 'bg-status-success hover:bg-status-success/80' :
                           selectedStatus === 'Reject' ? 'bg-status-error hover:bg-status-error/80' : ''}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Container>
  );
};

export default ViewApplication;