import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar,
  Users,
  Eye,
  Edit2,
  Trash2,
  PlusCircle,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const CompanyInternships = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/internships/company');
      const data = response.data || [];
      
      // Check and update status for each internship
      const updatedData = data.map(internship => {
        const shouldClose = shouldInternshipClose(internship);
        if (shouldClose && internship.status === 'Active') {
          // If it should close, update status
          updateInternshipStatus(internship.id, 'Closed');
          return { ...internship, status: 'Closed' };
        }
        return internship;
      });
      
      setInternships(updatedData);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setError('Failed to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shouldInternshipClose = (internship) => {
    const spotsAvailable = internship.spotsAvailable || 0;
    const applicants = internship.applicants || 0;
    const deadline = internship.applicationDeadline;
    
    // Check if spots are filled
    if (applicants >= spotsAvailable && spotsAvailable > 0) {
      return true;
    }
    
    // Check if deadline has passed
    if (deadline) {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      if (deadlineDate < today) {
        return true;
      }
    }
    
    return false;
  };

  const updateInternshipStatus = async (internshipId, newStatus) => {
    try {
      // TODO: Add endpoint to update status
      // await api.put(`/api/internships/${internshipId}/status`, { status: newStatus });
      console.log(`Internship ${internshipId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating internship status:', error);
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
        return { color: 'bg-primary/10 text-primary', icon: Briefcase };
    }
  };

  const handleView = (id) => {
    navigate(`/company/internship/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/company/internship/edit/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedInternship(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/internships/${selectedInternship}`);
      setInternships(prev => prev.filter(i => i.id !== selectedInternship));
      setShowDeleteModal(false);
      setSelectedInternship(null);
    } catch (error) {
      console.error('Error deleting internship:', error);
      setError('Failed to delete internship. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">My Internships</h1>
          <p className="text-text-secondary">Manage all your internship postings</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/company/create-internship')}
          className="whitespace-nowrap"
        >
          Create Internship
        </Button>
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

      {internships.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">No Internships Yet</h2>
          <p className="text-text-secondary mb-6">
            You haven't created any internship postings yet. Start by creating your first internship!
          </p>
          <Button 
            variant="primary" 
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/company/create-internship')}
          >
            Create Your First Internship
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: internships.length, color: 'text-primary' },
              { label: 'Active', value: internships.filter(i => i.status === 'Active').length, color: 'text-status-success' },
              { label: 'Closed', value: internships.filter(i => i.status === 'Closed').length, color: 'text-status-error' },
              { label: 'Draft', value: internships.filter(i => i.status === 'Draft').length, color: 'text-accent-yellow' },
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Internships List */}
          <div className="space-y-4">
            {internships.map((internship, index) => {
              const StatusIcon = getStatusBadge(internship.status).icon;
              const spotsLeft = (internship.spotsAvailable || 0) - (internship.applicants || 0);
              const isFull = spotsLeft <= 0;
              
              return (
                <motion.div
                  key={internship.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-primary-dark">{internship.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="flex items-center text-sm text-text-secondary">
                                <Building2 className="w-4 h-4 mr-1" />
                                {internship.companyName || 'Your Company'}
                              </span>
                              <span className="flex items-center text-sm text-text-secondary">
                                <MapPin className="w-4 h-4 mr-1" />
                                {internship.location}
                              </span>
                              <span className="flex items-center text-sm text-text-secondary">
                                <Clock className="w-4 h-4 mr-1" />
                                {internship.duration}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${getStatusBadge(internship.status).color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {internship.status}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {internship.skillsRequired && internship.skillsRequired.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {internship.skillsRequired && internship.skillsRequired.length > 4 && (
                            <span className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                              +{internship.skillsRequired.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-6 mt-3 text-sm text-text-muted">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {internship.applicants || 0} applicants
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span className={isFull && internship.status === 'Active' ? 'text-status-error font-medium' : ''}>
                              {Math.max(spotsLeft, 0)} spots left
                            </span>
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Deadline: {internship.applicationDeadline || 'Not set'}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {internship.matchCount || 0} matched students
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(internship.id)}
                          className="w-full justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="ml-2 lg:hidden">View</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(internship.id)}
                          className="w-full justify-center"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="ml-2 lg:hidden">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(internship.id)}
                          className="w-full justify-center text-status-error hover:bg-status-error/10"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="ml-2 lg:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

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
              Are you sure you want to delete this internship? This action cannot be undone and all applications will be removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={confirmDelete}
                loading={deleting}
                className="bg-status-error hover:bg-status-error/80"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompanyInternships;