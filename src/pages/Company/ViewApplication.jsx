import React, { useState } from 'react';
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
  FileEdit
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';

const ViewApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - would come from API based on application id
  const application = {
    id: id,
    internshipTitle: 'Frontend Developer Intern',
    internshipCompany: 'TechCorp Inc.',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    duration: '6 months',
    match: '95%',
    status: 'In Review',
    appliedDate: '2 days ago',
    student: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@university.edu',
      phone: '+234 800 000 0000',
      university: 'University of Lagos',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      level: '400L',
      skills: ['React', 'JavaScript', 'CSS', 'Python', 'SQL'],
      interests: ['Web Development', 'Data Science'],
      careerAspiration: 'Full Stack Developer',
    },
    coverLetter: 'I am very passionate about frontend development and have been building web applications for the past two years. I have experience with React, JavaScript, and CSS, and I am eager to apply my skills in a professional environment. I am particularly excited about the opportunity to work at TechCorp Inc. because of your innovative approach to web solutions and your commitment to mentoring young talents. I believe this internship will be a perfect opportunity for me to grow as a developer and contribute meaningfully to your team.',
    resume: 'John_Doe_Resume.pdf',
    documents: ['John_Doe_Resume.pdf', 'John_Doe_CoverLetter.pdf'],
    timeline: [
      { date: 'Dec 10, 2024', event: 'Application Submitted', status: 'completed' },
      { date: 'Dec 12, 2024', event: 'Application Reviewed', status: 'completed' },
      { date: 'Dec 20, 2024', event: 'Final Decision', status: 'pending' },
    ],
  };

  // Internal status values: 'In Review', 'Accept', 'Reject'
  // Display statuses: 'In Review', 'Accepted', 'Rejected'
  const [currentStatus, setCurrentStatus] = useState(application.status);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const statusOptions = ['In Review', 'Accept', 'Reject'];

  // Display text mapping for statuses
  const getDisplayStatus = (status) => {
    switch(status) {
      case 'Accept': return 'Accepted';
      case 'Reject': return 'Rejected';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    // Check against display values for the badge
    const displayStatus = getDisplayStatus(status);
    switch(displayStatus) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const getStatusIcon = (status) => {
    const displayStatus = getDisplayStatus(status);
    switch(displayStatus) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'In Review': return <ClockIcon className="w-5 h-5 text-accent-yellow" />;
      default: return <ClockIcon className="w-5 h-5 text-accent-yellow" />;
    }
  };

  const getModalMessage = (status) => {
    switch(status) {
      case 'Accept':
        return 'Are you sure you want to Accept this Student\'s Application?';
      case 'Reject':
        return 'Are you sure you want to Reject this Student\'s Application?';
      default:
        return `Are you sure you want to change the status to ${status}?`;
    }
  };

  const getModalTitle = (status) => {
    switch(status) {
      case 'Accept':
        return 'Accept Application';
      case 'Reject':
        return 'Reject Application';
      default:
        return 'Update Application Status';
    }
  };

  const getNotePlaceholder = (status) => {
    switch(status) {
      case 'Accept':
        return 'Add a note (e.g. Start date, next steps, etc.)';
      case 'Reject':
        return 'Add a note explaining why the application was rejected';
      default:
        return 'Add a note (optional)';
    }
  };

  const getNoteLabel = (status) => {
    switch(status) {
      case 'Accept':
        return 'Acceptance Note (Optional)';
      case 'Reject':
        return 'Rejection Reason (Optional)';
      default:
        return 'Note (Optional)';
    }
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setNote('');
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    setLoading(true);
    // Simulate API call with note
    setTimeout(() => {
      setCurrentStatus(selectedStatus);
      setShowStatusModal(false);
      setLoading(false);
      // Note would be sent to API here
      console.log(`Status changed to: ${selectedStatus}`, `Note: ${note}`);
    }, 1000);
  };

  return (
    <Container className="py-8 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/company/applications')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Applications
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Application Details</h1>
          <p className="text-text-secondary">
            Review application for <span className="font-medium text-primary-dark">{application.internshipTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${getStatusColor(currentStatus)}`}>
            {getStatusIcon(currentStatus)}
            <span className="ml-1">{getDisplayStatus(currentStatus)}</span>
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Profile Card */}
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Student Information
            </h3>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-light">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-dark">
                  {application.student.firstName[0]}{application.student.lastName[0]}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary-dark">
                  {application.student.firstName} {application.student.lastName}
                </h4>
                <p className="text-text-secondary">{application.student.careerAspiration}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  {application.student.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  {application.student.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">University</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <School className="w-4 h-4 mr-2 text-primary" />
                  {application.student.university}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Faculty</p>
                <p className="font-medium text-primary-dark flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  {application.student.faculty}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Department</p>
                <p className="font-medium text-primary-dark">{application.student.department}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Level</p>
                <p className="font-medium text-primary-dark">{application.student.level}</p>
              </div>
            </div>
          </Card>

          {/* Skills & Interests */}
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-primary" />
              Skills & Interests
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-muted mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {application.student.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {application.student.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-text-muted">Career Aspiration</p>
                <p className="font-medium text-primary-dark">{application.student.careerAspiration}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Actions */}
        <div className="space-y-6">
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h3 className="text-lg font-bold text-primary-dark mb-4">Application Actions</h3>
            
            {/* Match Score */}
            <div className="mb-4 p-4 bg-primary/5 rounded-xl text-center">
              <p className="text-sm text-text-muted">Match Score</p>
              <p className="text-3xl font-bold text-primary">{application.match}</p>
            </div>

            {/* Status Update - With correct highlighting */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-dark">Update Status</p>
              {statusOptions.map((status) => {
                // Check if this status matches the current status (considering display mapping)
                const isActive =
                  (status === 'Accept' && currentStatus === 'Accept') ||
                  (status === 'Reject' && currentStatus === 'Reject') ||
                  currentStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? `${getStatusColor(status)} font-medium`
                        : 'text-text-secondary hover:bg-background-light'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Status Change Confirmation Modal with Note */}
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

            {/* Note Input */}
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
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={confirmStatusChange}
                loading={loading}
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