import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CompanyApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const applications = [
    {
      id: 1,
      student: 'John Doe',
      position: 'Frontend Developer Intern',
      university: 'University of Lagos',
      department: 'Computer Science',
      level: '400L',
      status: 'Pending',
      date: '2 days ago',
      email: 'john.doe@university.edu',
      phone: '+234 800 000 0000',
      skills: ['React', 'JavaScript', 'CSS', 'Python'],
      coverLetter: 'I am very passionate about frontend development...',
      matchScore: '95%',
      resume: 'John_Doe_Resume.pdf',
    },
    {
      id: 2,
      student: 'Jane Smith',
      position: 'Data Analyst Intern',
      university: 'University of Ibadan',
      department: 'Statistics',
      level: '400L',
      status: 'In Review',
      date: '3 days ago',
      email: 'jane.smith@university.edu',
      phone: '+234 800 000 0001',
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      coverLetter: 'I have strong analytical skills...',
      matchScore: '88%',
      resume: 'Jane_Smith_Resume.pdf',
    },
    {
      id: 3,
      student: 'Michael Johnson',
      position: 'UI/UX Design Intern',
      university: 'Covenant University',
      department: 'Graphic Design',
      level: '400L',
      status: 'Shortlisted',
      date: '1 week ago',
      email: 'michael.j@university.edu',
      phone: '+234 800 000 0002',
      skills: ['Figma', 'UI Design', 'UX Research', 'Adobe XD'],
      coverLetter: 'I specialize in creating user-centered designs...',
      matchScore: '92%',
      resume: 'Michael_J_Resume.pdf',
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'Shortlisted': return 'bg-status-info/10 text-status-info';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      case 'Pending': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'Shortlisted': return <Clock className="w-5 h-5 text-status-info" />;
      case 'In Review': return <Clock className="w-5 h-5 text-accent-yellow" />;
      case 'Pending': return <Clock className="w-5 h-5 text-accent-yellow" />;
      default: return <FileCheck className="w-5 h-5 text-accent-yellow" />;
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setShowDetails(true);
  };

  // Calculate stats
  const totalApplications = applications.length;
  const inReview = applications.filter(app => app.status === 'In Review' || app.status === 'Pending').length;
  const accepted = applications.filter(app => app.status === 'Accepted' || app.status === 'Shortlisted').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Applications</h1>
        <p className="text-text-secondary">Review and manage student applications</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: totalApplications, color: 'text-primary' },
          { label: 'In Review', value: inReview, color: 'text-accent-yellow' },
          { label: 'Accepted', value: accepted, color: 'text-status-success' },
          { label: 'Rejected', value: rejected, color: 'text-status-error' },
        ].map((stat, index) => (
          <Card key={index} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(app.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">{app.student}</h3>
                    <p className="text-text-secondary">{app.position}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-text-muted">
                      <span className="flex items-center">
                        <Building2 className="w-3 h-3 mr-1" />
                        {app.university}
                      </span>
                      <span className="flex items-center">
                        <FileCheck className="w-3 h-3 mr-1" />
                        {app.department}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {app.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {app.matchScore}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleViewDetails(app)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-strong"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Application Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-background-light rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-background-light rounded-xl">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-dark">
                    {selectedApplication.student.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedApplication.student}</h3>
                  <p className="text-text-secondary">{selectedApplication.position}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center text-text-secondary text-sm">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  {selectedApplication.email}
                </div>
                <div className="flex items-center text-text-secondary text-sm">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  {selectedApplication.phone}
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2">Cover Letter</p>
                <p className="text-text-secondary text-sm p-3 bg-background-light rounded-lg">
                  {selectedApplication.coverLetter}
                </p>
              </div>

              {/* Documents */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2">Documents</p>
                <div className="flex gap-3">
                  <button className="flex items-center text-sm text-primary hover:underline p-2 border border-border-light rounded-lg">
                    <Download className="w-4 h-4 mr-2" />
                    {selectedApplication.resume}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button variant="success" size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button variant="outline" size="sm" className="border-status-info text-status-info hover:bg-status-info/10">
                  <Clock className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
                <Button variant="outline" size="sm" className="border-status-error text-status-error hover:bg-status-error/10">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;