import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    MessageCircle,
    ExternalLink,
    AlertCircle,
    Loader,
    Mail
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import { authService } from '../../services/authService';

const ViewApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState(null);
  const [error, setError] = useState('');

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

      const response = await api.get(`/api/applications/${id}/full`);
      console.log('Full application data:', response.data);
      setApplicationData(response.data);
    } catch (error) {
      console.error('Error fetching application:', error);
      setError(error.response?.data?.detail || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return { icon: Clock, className: 'bg-text-muted/10 text-text-muted' };
    }
    
    switch(status) {
      case 'Accepted':
        return { icon: CheckCircle, className: 'bg-status-success/10 text-status-success' };
      case 'Rejected':
        return { icon: XCircle, className: 'bg-status-error/10 text-status-error' };
      case 'In Review':
        return { icon: Clock, className: 'bg-accent-yellow/10 text-accent-yellow' };
      default:
        return { icon: Clock, className: 'bg-text-muted/10 text-text-muted' };
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

  const handleMessageEmployer = () => {
    const phoneNumber = applicationData?.company?.phone;
    if (phoneNumber) {
      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, '');
      window.location.href = `sms:${formattedNumber}`;
    } else {
      alert('No phone number available for this employer');
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary">Loading application details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !applicationData) {
    return (
      <Container className="py-8">
        <button
          onClick={() => navigate('/student/applications')}
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

  const { application, internship, company } = applicationData;
  const StatusIcon = getStatusBadge(application.status).icon;

  const timeline = [
    { 
      date: formatDate(application.createdAt), 
      event: 'Application Submitted', 
      status: 'completed' 
    },
    { 
      date: application.status ? formatDate(application.updatedAt) : 'Pending', 
      event: 'Application Reviewed', 
      status: application.status ? 'completed' : 'pending'
    },
    { 
      date: application.status === 'Accepted' || application.status === 'Rejected' 
        ? formatDate(application.updatedAt) 
        : 'Pending', 
      event: 'Final Decision', 
      status: application.status === 'Accepted' || application.status === 'Rejected' ? 'completed' : 'pending'
    },
  ];

  const companyName = company?.companyName || application?.companyName || 'Company';
  const companyEmail = company?.email || application?.companyEmail || 'Not provided';
  const companyPhone = company?.phone || application?.companyPhone || 'Not provided';
  const companyWebsite = company?.website || '#';

  const internshipTitle = internship?.title || application?.internshipTitle || 'Internship Position';
  const internshipLocation = internship?.location || 'Not specified';
  const internshipDuration = internship?.duration || 'Not specified';

  return (
    <Container className="py-8">
      <button
        onClick={() => navigate('/student/applications')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Applications
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="bordered" padding="lg">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-primary-dark">{internshipTitle}</h1>
                  {application.status && (
                    <Badge className={`${getStatusBadge(application.status).className} whitespace-nowrap shrink-0`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {application.status}
                    </Badge>
                  )}
                </div>
                <p className="text-text-secondary flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {companyName}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-secondary">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {internshipLocation}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {internshipDuration}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied: {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full whitespace-nowrap shrink-0">
                  {application.matchScore || 0}% Match
                </span>
              </div>
            </div>
          </Card>

          {internship?.aboutRole && (
            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-bold text-primary-dark mb-3">About the Role</h2>
              <p className="text-text-secondary leading-relaxed">{internship.aboutRole}</p>
            </Card>
          )}

          {(internship?.aboutCompany || company?.aboutCompany) && (
            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-bold text-primary-dark mb-3">About the Company</h2>
              <p className="text-text-secondary leading-relaxed">{internship?.aboutCompany || company?.aboutCompany}</p>
            </Card>
          )}

          {internship?.skillsRequired && internship.skillsRequired.length > 0 && (
            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-bold text-primary-dark mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                {internship.skillsRequired.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </Card>
          )}

          {internship?.benefits && internship.benefits.length > 0 && (
            <Card variant="bordered" padding="lg">
              <h2 className="text-lg font-bold text-primary-dark mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                {internship.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </Card>
          )}

          <Card variant="bordered" padding="lg">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Application Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' 
                        ? 'bg-status-success/20 text-status-success' 
                        : 'bg-text-muted/20 text-text-muted'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-8 ${
                        item.status === 'completed' 
                          ? 'bg-status-success' 
                          : 'bg-text-muted/30'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${
                      item.status === 'completed' 
                        ? 'text-primary-dark' 
                        : 'text-text-muted'
                    }`}>
                      {item.event}
                    </p>
                    <p className="text-sm text-text-muted">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {application.note && (
            <Card variant="bordered" padding="lg" className="bg-accent-yellow/5 border-accent-yellow/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark">Notes from Employer</h3>
                  <p className="text-text-secondary text-sm mt-1">{application.note}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted">Company Name</p>
                <p className="font-medium text-primary-dark">{companyName}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Company Email</p>
                {companyEmail && companyEmail !== 'Not provided' ? (
                  <a href={`mailto:${companyEmail}`} className="text-primary hover:underline text-sm">
                    {companyEmail}
                  </a>
                ) : (
                  <p className="text-sm text-text-secondary">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                {companyPhone && companyPhone !== 'Not provided' ? (
                  <a href={`tel:${companyPhone}`} className="text-primary hover:underline text-sm">
                    {companyPhone}
                  </a>
                ) : (
                  <p className="text-sm text-text-secondary">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs text-text-muted">Website</p>
                {companyWebsite && companyWebsite !== '#' ? (
                  <a 
                    href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center"
                  >
                    {companyWebsite} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-sm text-text-secondary">Not provided</p>
                )}
              </div>
              {internship?.applicationDeadline && (
                <div>
                  <p className="text-xs text-text-muted">Application Deadline</p>
                  <p className="text-sm font-medium text-primary-dark">
                    <Calendar className="w-4 h-4 mr-2 text-primary inline" />
                    {formatDate(internship.applicationDeadline)}
                  </p>
                </div>
              )}
              {internship?.spotsAvailable !== undefined && (
                <div>
                  <p className="text-xs text-text-muted">Spots Available</p>
                  <p className="text-sm font-medium text-primary-dark">{internship.spotsAvailable}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border-light space-y-3">
              {companyPhone && companyPhone !== 'Not provided' ? (
                <Button variant="primary" size="sm" fullWidth onClick={handleMessageEmployer}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Employer
                </Button>
              ) : (
                <Button variant="primary" size="sm" fullWidth disabled className="opacity-50 cursor-not-allowed">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  No Phone Number Available
                </Button>
              )}
              {companyEmail && companyEmail !== 'Not provided' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  onClick={() => window.location.href = `mailto:${companyEmail}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ViewApplication;