import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CompanyInternships = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Mock data - would come from API
  const internships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      duration: '6 months',
      spots: 3,
      applicants: 12,
      status: 'Active',
      deadline: '2024-12-15',
      postedDate: 'Dec 1, 2024',
      matchCount: 8,
      skills: ['React', 'JavaScript', 'CSS', 'Tailwind'],
    },
    {
      id: 2,
      title: 'Data Analyst Intern',
      location: 'Abuja, Nigeria',
      type: 'Part-time',
      duration: '4 months',
      spots: 2,
      applicants: 8,
      status: 'Active',
      deadline: '2024-12-20',
      postedDate: 'Dec 5, 2024',
      matchCount: 5,
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      location: 'Remote',
      type: 'Full-time',
      duration: '6 months',
      spots: 1,
      applicants: 15,
      status: 'Closed',
      deadline: '2024-11-30',
      postedDate: 'Nov 15, 2024',
      matchCount: 10,
      skills: ['Figma', 'UI Design', 'UX Research', 'Adobe XD'],
    },
    {
      id: 4,
      title: 'Backend Developer Intern',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      duration: '6 months',
      spots: 2,
      applicants: 6,
      status: 'Draft',
      deadline: '2025-01-15',
      postedDate: 'Dec 8, 2024',
      matchCount: 3,
      skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
    },
  ];

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

  // Navigation Functions
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

  const confirmDelete = () => {
    // Delete logic here - would call API
    console.log('Deleting internship:', selectedInternship);
    setShowDeleteModal(false);
    setSelectedInternship(null);
    // Optionally refresh the list or show success message
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">My Internships</h1>
          <p className="text-text-secondary">Manage all your internship postings</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/company/create-internship')}
        >
          Create Internship
        </Button>
      </div>

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
          
          return (
            <motion.div
              key={internship.id}
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
                            TechCorp Inc.
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
                      {internship.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-6 mt-3 text-sm text-text-muted">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {internship.applicants} applicants
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {internship.spots} spots available
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Deadline: {internship.deadline}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {internship.matchCount} matched students
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