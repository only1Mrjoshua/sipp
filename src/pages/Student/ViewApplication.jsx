import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Clock, CheckCircle,
    XCircle,
    Calendar, MessageCircle,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';

const ViewApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock application data (would come from API)
  const application = {
    id: id,
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    duration: '6 months',
    status: 'In Review',
    appliedDate: 'December 10, 2024',
    match: '95%',
    tags: ['React', 'JavaScript', 'CSS', 'Tailwind'],
    description: 'We are looking for a passionate Frontend Developer Intern to join our dynamic team. You will work on exciting projects and learn from experienced developers.',
    about: 'TechCorp Inc. is a leading technology company specializing in innovative web solutions. We have a track record of mentoring young talents and helping them grow into successful professionals.',
    requirements: ['Proficiency in React.js', 'Strong JavaScript skills', 'Understanding of CSS and responsive design', 'Good communication skills'],
    benefits: ['Mentorship program', 'Remote work options', 'Flexible working hours', 'Potential for full-time offer'],
    startDate: 'January 2025',
    deadline: 'December 15, 2024',
    companyEmail: 'hr@techcorp.com',
    companyPhone: '+234 800 123 4567',
    companyWebsite: 'www.techcorp.com',
    timeline: [
      { date: 'Dec 10, 2024', event: 'Application Submitted', status: 'completed' },
      { date: 'Dec 12, 2024', event: 'Application Reviewed', status: 'completed' },
      { date: 'Dec 20, 2024', event: 'Final Decision', status: 'pending' },
    ],
    notes: 'Your application is currently being reviewed by the hiring team. We will reach out to you soon with updates.',
    contactPerson: 'Sarah Johnson',
    contactRole: 'Hiring Manager',
    interviewDetails: {
      scheduled: true,
      date: 'December 18, 2024',
      time: '2:00 PM WAT',
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij',
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Accepted':
        return { icon: CheckCircle, className: 'bg-status-success/10 text-status-success' };
      case 'Rejected':
        return { icon: XCircle, className: 'bg-status-error/10 text-status-error' };
      case 'In Review':
        return { icon: Clock, className: 'bg-accent-yellow/10 text-accent-yellow' };
      default:
        return { icon: Clock, className: 'bg-accent-yellow/10 text-accent-yellow' };
    }
  };

  const StatusIcon = getStatusBadge(application.status).icon;

  return (
    <Container className="py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/applications')}
        className="flex items-center text-text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Applications
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Header */}
          <Card variant="bordered" padding="lg">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-primary-dark">{application.title}</h1>
                  <Badge className={`${getStatusBadge(application.status).className} whitespace-nowrap shrink-0`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {application.status}
                  </Badge>
                </div>
                <p className="text-text-secondary flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {application.company}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-secondary">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {application.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {application.duration}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied: {application.appliedDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full whitespace-nowrap shrink-0">
                {application.match} Match
              </span>
              </div>
            </div>
          </Card>

          {/* Application Timeline */}
          <Card variant="bordered" padding="lg">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Application Timeline</h2>
            <div className="space-y-4">
              {application.timeline.map((item, index) => (
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
                    {index < application.timeline.length - 1 && (
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

          {/* Application Notes */}
          {application.notes && (
            <Card variant="bordered" padding="lg" className="bg-accent-yellow/5 border-accent-yellow/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-primary-dark">Notes from Employer</h3>
                  <p className="text-text-secondary text-sm mt-1">{application.notes}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card variant="bordered" padding="lg" className="sticky top-24">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted">Contact Person</p>
                <p className="font-medium text-primary-dark">{application.contactPerson}</p>
                <p className="text-sm text-text-secondary">{application.contactRole}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Company Email</p>
                <a href={`mailto:${application.companyEmail}`} className="text-primary hover:underline text-sm">
                  {application.companyEmail}
                </a>
              </div>
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                <a href={`tel:${application.companyPhone}`} className="text-primary hover:underline text-sm">
                  {application.companyPhone}
                </a>
              </div>
              <div>
                <p className="text-xs text-text-muted">Website</p>
                <a 
                  href={`https://${application.companyWebsite}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center"
                >
                  {application.companyWebsite} <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-border-light space-y-3">
              <Button variant="primary" size="sm" fullWidth>
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Employer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ViewApplication;