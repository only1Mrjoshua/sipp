import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const ViewInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [status, setStatus] = useState('Active');

  // Mock data - would come from API based on id
  const internship = {
    id: id,
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    duration: '6 months',
    spots: 3,
    applicants: 12,
    status: status,
    deadline: '2024-12-15',
    postedDate: 'Dec 1, 2024',
    matchCount: 8,
    skillsRequired: ['React', 'JavaScript', 'CSS', 'Tailwind', 'TypeScript'],
    skillsOffered: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    benefits: ['Remote', 'Paid', 'Mentorship', 'Certificate', 'Hybrid'],
    aboutRole: 'We are looking for a passionate Frontend Developer Intern to join our dynamic team. You will work on exciting projects and learn from experienced developers. Responsibilities include building responsive web applications, collaborating with the design team, and participating in code reviews.',
    aboutCompany: 'TechCorp Inc. is a leading technology company specializing in innovative web solutions. We have a track record of mentoring young talents and helping them grow into successful professionals. Our culture is built on innovation, collaboration, and continuous learning.',
    applications: [
      { id: 1, name: 'John Doe', email: 'john.doe@university.edu', status: 'In Review', date: '2 days ago' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@university.edu', status: 'Accepted', date: '3 days ago' },
      { id: 3, name: 'Michael Johnson', email: 'michael.j@university.edu', status: 'Rejected', date: '1 week ago' },
    ]
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return { color: 'bg-status-success/10 text-status-success', icon: CheckCircle };
      case 'Closed':
        return { color: 'bg-status-error/10 text-status-error', icon: XCircle };
      default:
        return { color: 'bg-status-success/10 text-status-success', icon: CheckCircle };
    }
  };

  const getApplicationStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const StatusIcon = getStatusBadge(internship.status).icon;

  const handleToggleStatus = () => {
    setStatus(status === 'Active' ? 'Closed' : 'Active');
  };

  const handleDelete = () => {
    // Delete logic here
    setShowDeleteModal(false);
    navigate('/company/internships');
  };

  // Navigate to full application view
  const handleReviewApplication = (applicationId) => {
    navigate(`/company/application/${applicationId}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/company/internships')}
          className="flex items-center text-text-secondary hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Internships
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
                  {internship.company}
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
                  {internship.applicants} applicants
                </span>
                <span className="flex items-center text-text-secondary">
                  <Users className="w-4 h-4 mr-1" />
                  {internship.spots} spots
                </span>
              </div>
              <Button 
                variant={internship.status === 'Active' ? 'outline' : 'primary'} 
                size="sm"
                onClick={handleToggleStatus}
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
            <p className="text-text-secondary text-sm leading-relaxed">{internship.aboutRole}</p>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary" />
              About the Company
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{internship.aboutCompany}</p>
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
              {internship.skillsRequired.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-semibold text-primary-dark mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2 text-primary" />
              Skills to be Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.skillsOffered.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-status-info/10 text-status-info text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-semibold text-primary-dark mb-3 flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary" />
              Benefits
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.benefits.map((benefit, i) => (
                <span key={i} className="px-3 py-1 bg-status-success/10 text-status-success text-sm rounded-full">
                  {benefit}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Application Details */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Recent Applications
          </h3>
          <div className="overflow-x-auto">
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
                {internship.applications.map((app, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-primary-dark">{app.name}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.date}</td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => handleReviewApplication(app.id)}
                      >
                        Review
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
              Are you sure you want to delete this internship? This action cannot be undone and all applications will be removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
              >
                No, Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleDelete}
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