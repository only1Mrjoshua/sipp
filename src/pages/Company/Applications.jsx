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
  Briefcase,
  Building2,
  Calendar
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const CompanyApplications = () => {
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

      const response = await api.get('/api/applications/company');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.detail || 'Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '';  // No color for no status
    
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-text-muted/10 text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <FileCheck className="w-5 h-5 text-text-muted" />;
    
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'In Review': return <Clock className="w-5 h-5 text-accent-yellow" />;
      default: return <FileCheck className="w-5 h-5 text-text-muted" />;
    }
  };

  const handleReviewApplication = async (app) => {
    const appId = app._id || app.id;
    
    try {
      // If status is null/empty, call review endpoint to set to "In Review"
      if (!app.status) {
        await api.put(`/api/applications/${appId}/review`);
      }
      
      // Navigate to the review page
      navigate(`/company/application/${appId}`);
    } catch (error) {
      console.error('Error starting review:', error);
      alert(error.response?.data?.detail || 'Failed to start review');
    }
  };

  // Calculate stats
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
        <h1 className="text-2xl font-bold text-primary-dark">Applications</h1>
        <p className="text-text-secondary">Review and manage applications for your internships</p>
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
            You haven't received any applications for your internships yet. 
            Students will be able to apply once they find your internships.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/company/internships')}
          >
            View Your Internships
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats Summary */}
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
              const studentName = app.studentName || app.student || 'Unknown Student';
              const internshipTitle = app.internshipTitle || app.position || 'Unknown Position';
              const university = app.studentUniversity || app.university || '';
              const department = app.studentDepartment || app.department || '';
              const level = app.studentLevel || app.level || '';
              const matchScore = app.matchScore || 0;
              const status = app.status || null;
              
              return (
                <motion.div
                  key={appId || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(status)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-primary-dark">{studentName}</h3>
                            <p className="text-text-secondary">{internshipTitle}</p>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-text-muted">
                              {university && (
                                <span className="flex items-center">
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {university}
                                </span>
                              )}
                              {department && (
                                <span className="flex items-center">
                                  <FileCheck className="w-3 h-3 mr-1" />
                                  {department}
                                </span>
                              )}
                              {level && (
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {status && (
                          <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full whitespace-nowrap">
                          {matchScore}% Match
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleReviewApplication(app)}
                          className="whitespace-nowrap"
                        >
                          Review
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

export default CompanyApplications;