import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const applications = [
    {
      id: 1,
      student: 'John Doe',
      company: 'TechCorp Inc.',
      internship: 'Frontend Developer Intern',
      matchScore: 95,
      status: 'In Review',
      date: '2 days ago',
    },
    {
      id: 2,
      student: 'Jane Smith',
      company: 'DataVision Ltd.',
      internship: 'Data Analyst Intern',
      matchScore: 88,
      status: 'In Review',
      date: '3 days ago',
    },
    {
      id: 3,
      student: 'Michael Johnson',
      company: 'Creative Studios',
      internship: 'UI/UX Design Intern',
      matchScore: 92,
      status: 'Accepted',
      date: '1 week ago',
    },
    {
      id: 4,
      student: 'Sarah Williams',
      company: 'TechCorp Inc.',
      internship: 'Backend Developer Intern',
      matchScore: 78,
      status: 'Rejected',
      date: '2 weeks ago',
    },
  ];

  const statuses = ['All', 'In Review', 'Accepted', 'Rejected'];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.internship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-3.5 h-3.5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 text-status-error" />;
      case 'In Review': return <Clock className="w-3.5 h-3.5 text-accent-yellow" />;
      default: return <Clock className="w-3.5 h-3.5 text-accent-yellow" />;
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Application Management</h1>
          <p className="text-text-secondary">Oversee all internship applications</p>
        </div>
        <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search by student, company, or internship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status === 'All' ? '' : status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                selectedStatus === status || (status === 'All' && !selectedStatus)
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border-light text-text-secondary hover:bg-primary-light/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Internship</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Match Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentApplications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-dark">{app.student.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-sm font-medium text-primary-dark">{app.student}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{app.company}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{app.internship}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary">{app.matchScore}%</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Simplified for mobile */}
        <div className="px-4 py-3 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted text-center sm:text-left">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-text-secondary px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminApplications;