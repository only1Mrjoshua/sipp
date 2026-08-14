import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const AdminApplications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 5;

  const statuses = ['All', 'In Review', 'Accepted', 'Rejected'];

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, selectedStatus, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = authService.getToken();
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const skip = (currentPage - 1) * itemsPerPage;
      const params = new URLSearchParams({
        limit: itemsPerPage,
        skip: skip,
      });
      if (searchTerm) params.append('search', searchTerm);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await api.get(`/api/admin/applications?${params.toString()}`);
      const data = response.data;
      setApplications(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.detail || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // ─── Export to CSV ────────────────────────────────────────────────
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const token = authService.getToken();
      if (!token) {
        alert('Not authenticated');
        setExportLoading(false);
        return;
      }

      // Build base params (search and status)
      const baseParams = new URLSearchParams();
      if (searchTerm) baseParams.append('search', searchTerm);
      if (selectedStatus) baseParams.append('status', selectedStatus);

      let allApps = [];
      let page = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const skip = page * limit;
        const p = new URLSearchParams(baseParams);
        p.append('limit', limit);
        p.append('skip', skip);

        const response = await api.get(`/api/admin/applications?${p.toString()}`);
        const data = response.data;
        allApps = allApps.concat(data.data || []);
        hasMore = data.data && data.data.length === limit;
        page++;
        if (page > 50) break; // safety
      }

      if (allApps.length === 0) {
        alert('No applications to export.');
        setExportLoading(false);
        return;
      }

      // Build CSV headers and rows
      const headers = [
        'Student Name', 'Student Email', 'Company', 'Internship', 
        'Match Score (%)', 'Status', 'Applied Date'
      ];

      const rows = allApps.map((app) => [
        app.studentName || '',
        app.studentEmail || '',
        app.companyName || '',
        app.internshipTitle || '',
        app.matchScore || 0,
        app.status || 'Pending',
        app.createdAt ? new Date(app.createdAt).toLocaleString() : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // ─── Rest of component ────────────────────────────────────────────

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

  const totalPages = Math.ceil(total / itemsPerPage);

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

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Applications</h2>
        <p className="text-text-secondary">{error}</p>
        <button onClick={fetchApplications} className="mt-4 text-primary hover:underline">Try Again</button>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Application Management</h1>
          <p className="text-text-secondary">Oversee all internship applications</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<Download className="w-4 h-4" />}
          onClick={handleExport}
          loading={exportLoading}
        >
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
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-text-muted">No applications found</td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-dark">
                            {app.studentName?.split(' ').map(n => n[0]).join('') || 'S'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-primary-dark">{app.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.companyName}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{app.internshipTitle}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-primary">{app.matchScore || 0}%</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status || 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted text-center sm:text-left">
            Showing {applications.length} of {total} applications
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
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
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