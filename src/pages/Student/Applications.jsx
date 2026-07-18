import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Loader,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const StudentApplications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = authService.getCurrentUser();
      if (!userData) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/applications/student');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.detail || 'Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="w-5 h-5 text-text-muted" />;
    
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'In Review': return <Clock className="w-5 h-5 text-accent-yellow" />;
      default: return <FileCheck className="w-5 h-5 text-text-muted" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-text-muted/10 text-text-muted';
    
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-text-muted/10 text-text-muted';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return '';  // Return empty string for no status
    return status;
  };

  const handleView = (id) => {
    console.log('Navigating to application with ID:', id);
    if (id) {
      navigate(`/student/application/${id}`);
    } else {
      console.error('No application ID found');
    }
  };

  // Calculate stats - only count applications with status
  const totalApplications = applications.length;
  const inReview = applications.filter(app => app.status === 'In Review').length;
  const accepted = applications.filter(app => app.status === 'Accepted').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">My Applications</h1>
        <p className="text-text-secondary">Track all your internship applications</p>
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

      {applications.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-2">No Applications Yet</h2>
          <p className="text-text-secondary mb-6">
            You haven't applied to any internships yet. Browse internships and start your application!
          </p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/student/internships')}
          >
            Browse Internships
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats Summary - Fixed responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: totalApplications, color: 'text-primary' },
              { label: 'In Review', value: inReview, color: 'text-accent-yellow' },
              { label: 'Accepted', value: accepted, color: 'text-status-success' },
              { label: 'Rejected', value: rejected, color: 'text-status-error' },
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-text-secondary whitespace-nowrap">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((app, index) => {
              const appId = app._id || app.id;
              const title = app.internshipTitle || app.title || 'Unknown Position';
              const company = app.companyName || app.company || 'Unknown Company';
              const status = app.status || null;
              const date = app.updatedAt || app.createdAt || app.date || '';
              const formattedDate = date ? new Date(date).toLocaleDateString() : 'Recently';
              
              return (
                <motion.div
                  key={appId || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary-dark">{title}</h3>
                          <p className="text-text-secondary">{company}</p>
                          <p className="text-sm text-text-muted mt-1">Applied: {formattedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {status && (
                          <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleView(appId)}
                          className="whitespace-nowrap"
                        >
                          View
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
    </div>
  );
};

export default StudentApplications;