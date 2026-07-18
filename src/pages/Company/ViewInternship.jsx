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
  Building2,
  Tag,
  GraduationCap,
  Award,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  FileText,
  Download,
  ExternalLink,
  Loader
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Container from '../../components/common/Container';
import api from '../../services/api';
import { authService } from '../../services/authService';

const ViewInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

      // Fetch internship details
      const response = await api.get(`/api/internships/${id}`);
      const data = response.data;
      setInternship(data);

      // Fetch applications for this internship
      try {
        const appsResponse = await api.get(`/api/applications/internship/${id}`);
        setApplications(appsResponse.data || []);
      } catch (appErr) {
        console.error('Error fetching applications:', appErr);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching internship:', error);
      setError(error.response?.data?.detail || 'Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return { color: 'bg-status-success/10 text-status-success', icon: CheckCircle };
      case 'Closed':
        return { color: 'bg-status-error/10 text-status-error', icon: XCircle };
      case 'Draft':
        return { color: 'bg-accent-yellow/10 text-accent-yellow', icon: AlertCircle };
      default:
        return { color: 'bg-status-success/10 text-status-success', icon: CheckCircle };
    }
  };

  const getApplicationStatusColor = (status) => {
    if (!status) return 'bg-text-muted/10 text-text-muted';
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-text-muted/10 text-text-muted';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const handleToggleStatus = async () => {
    if (!internship) return;
    
    setUpdating(true);
    const newStatus = internship.status === 'Active' ? 'Closed' : 'Active';
    
    try {
      await api.put(`/api/internships/${id}/status`, { status: newStatus });
      setInternship(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.detail || 'Failed to update internship status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/internships/${id}`);
      setShowDeleteModal(false);
      navigate('/company/internships');
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert(error.response?.data?.detail || 'Failed to delete internship');
      setDeleting(false);
    }
  };

  const handleReviewApplication = (applicationId) => {
    navigate(`/company/application/${applicationId}`);
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

  if (error || !internship) {
    return (
      <div>
        <div className="mb-8">
          <button
            onClick={() => navigate('/company/internships')}
            className="flex items-center text-text-secondary hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Internship</h2>
          <p className="text-text-secondary">{error || 'Internship not found'}</p>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={fetchInternshipData}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusBadge(internship.status).icon;
  const applicantsCount = applications.length;
  
  // Calculate spots left: total spots - number of accepted applications
  const totalSpots = internship.spotsAvailable || 0;
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
  const spotsLeft = Math.max(totalSpots - acceptedCount, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/company/internships')}
          className="flex items-center text-text-secondary hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back 
        </button>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => navigate(`/company/internship/edit/${id}`)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowDeleteModal(true)}
            className="border-status-error text-status-error hover:bg-status-error/10"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Internship Header */}
        <Card variant="bordered" padding="lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-primary-dark">{internship.title}</h1>
                <div className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${getStatusBadge(internship.status).color}`}>
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {internship.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center text-text-secondary">
                  <Building2 className="w-4 h-4 mr-1" />
                  {internship.companyName || 'Your Company'}
                </span>
                <span className="flex items-center text-text-secondary">
                  <MapPin className="w-4 h-4 mr-1" />
                  {internship.location}
                </span>
                <span className="flex items-center text-text-secondary">
                  <Clock className="w-4 h-4 mr-1" />
                  {internship.duration}
                </span>
                <span className="flex items-center text-text-secondary">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {internship.type}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center text-text-secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {applicantsCount} applicants
                </span>
                <span className="flex items-center text-text-secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {spotsLeft} spots
                </span>
              </div>
              <Button 
                variant={internship.status === 'Active' ? 'outline' : 'primary'} 
                size="sm"
                onClick={handleToggleStatus}
                loading={updating}
                className={internship.status === 'Active' ? 'border-status-error text-status-error hover:bg-status-error/10' : ''}
              >
                {internship.status === 'Active' ? 'Close Internship' : 'Reopen Internship'}
              </Button>
            </div>
          </div>
        </Card>

        {/* About Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              About the Role
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{internship.aboutRole || 'No description available'}</p>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary" />
              About the Company
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{internship.aboutCompany || internship.companyName || 'No company description available'}</p>
          </Card>
        </div>

        {/* Skills & Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-semibold text-primary-dark mb-3 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-primary" />
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.skillsRequired && internship.skillsRequired.length > 0 ? (
                internship.skillsRequired.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">No skills listed</span>
              )}
            </div>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-semibold text-primary-dark mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 text-primary" />
              Skills to be Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.skillsOffered && internship.skillsOffered.length > 0 ? (
                internship.skillsOffered.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-status-info/10 text-status-info text-sm rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">No skills listed</span>
              )}
            </div>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-semibold text-primary-dark mb-3 flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary" />
              Benefits
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.benefits && internship.benefits.length > 0 ? (
                internship.benefits.map((benefit, i) => (
                  <span key={i} className="px-3 py-1 bg-status-success/10 text-status-success text-sm rounded-full">
                    {benefit}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">No benefits listed</span>
              )}
            </div>
          </Card>
        </div>

        {/* Application Details */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Applications
          </h3>
          <div className="overflow-x-auto">
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">No applications yet for this internship.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-background-light">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => {
                    const appId = app._id || app.id;
                    const studentName = app.studentName || app.name || 'Unknown Student';
                    const studentEmail = app.studentEmail || app.email || 'No email';
                    const status = app.status || null;
                    const date = app.createdAt || app.date || '';
                    const formattedDate = formatRelativeDate(date);
                    
                    return (
                      <motion.tr
                        key={appId || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-primary-dark">{studentName}</td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{studentEmail}</td>
                        <td className="px-4 py-3">
                          {status ? (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(status)}`}>
                              {status}
                            </span>
                          ) : (
                            <span className="text-sm text-text-muted">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">{formattedDate}</td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => handleReviewApplication(appId)}
                          >
                            Review
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-strong"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-status-error/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-status-error" />
              </div>
              <h3 className="text-lg font-bold text-primary-dark">Delete Internship</h3>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to delete <strong>"{internship.title}"</strong>? This action cannot be undone and all {applicantsCount} applications will be removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                No, Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleDelete}
                loading={deleting}
                className="bg-status-error hover:bg-status-error/80"
              >
                Yes, Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewInternship;