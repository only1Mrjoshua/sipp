import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Trash2, 
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  Users,
  Download,
  XCircle,
  Tag,
  Award,
  FileText,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const AdminInternships = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 5;

  const categories = ['Software', 'Data Science', 'Design', 'Marketing', 'Finance', 'Engineering'];
  const locations = ['Lagos', 'Abuja', 'Remote', 'Port Harcourt', 'Ibadan'];
  const statuses = ['Active', 'Closed', 'Draft', 'Archived'];

  useEffect(() => {
    fetchInternships();
  }, [searchTerm, selectedCategory, selectedLocation, selectedStatus, currentPage]);

  const fetchInternships = async () => {
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

      const response = await api.get(`/api/admin/internships?${params.toString()}`);
      const data = response.data;
      setInternships(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError(err.response?.data?.detail || 'Failed to load internships');
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

      let allInternships = [];
      let page = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const skip = page * limit;
        const p = new URLSearchParams(baseParams);
        p.append('limit', limit);
        p.append('skip', skip);

        const response = await api.get(`/api/admin/internships?${p.toString()}`);
        const data = response.data;
        allInternships = allInternships.concat(data.data || []);
        hasMore = data.data && data.data.length === limit;
        page++;
        if (page > 50) break; // safety
      }

      // Apply frontend filters (category, location)
      let filtered = allInternships;
      if (selectedCategory) {
        filtered = filtered.filter(internship => internship.category === selectedCategory);
      }
      if (selectedLocation) {
        filtered = filtered.filter(internship => internship.location?.includes(selectedLocation));
      }

      if (filtered.length === 0) {
        alert('No internships to export.');
        setExportLoading(false);
        return;
      }

      const headers = [
        'Title', 'Company', 'Location', 'Type', 'Duration', 'Status',
        'Spots Available', 'Applicants', 'Skills Required', 'Benefits',
        'Created At'
      ];

      const rows = filtered.map((internship) => [
        internship.title || '',
        internship.companyName || '',
        internship.location || '',
        internship.type || '',
        internship.duration || '',
        internship.status || '',
        internship.spotsAvailable || 0,
        internship.applicants || 0,
        (internship.skillsRequired || []).join('; '),
        (internship.benefits || []).join('; '),
        internship.createdAt ? new Date(internship.createdAt).toLocaleString() : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `internships_export_${new Date().toISOString().slice(0,10)}.csv`);
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

  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowViewModal(true);
  };

  const handleDelete = async (internshipId) => {
    if (!window.confirm('Are you sure you want to permanently delete this internship? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/admin/internships/${internshipId}`);
      await fetchInternships();
      if (selectedInternship && selectedInternship._id === internshipId) {
        setShowViewModal(false);
        setSelectedInternship(null);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete internship');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-status-success/10 text-status-success';
      case 'Closed': return 'bg-status-error/10 text-status-error';
      case 'Draft': return 'bg-accent-yellow/10 text-accent-yellow';
      case 'Archived': return 'bg-text-muted/10 text-text-muted';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  // Frontend filtering for category and location
  const filteredInternships = internships.filter(internship => {
    const matchesCategory = !selectedCategory || internship.category === selectedCategory;
    const matchesLocation = !selectedLocation || internship.location?.includes(selectedLocation);
    return matchesCategory && matchesLocation;
  });

  const totalPages = Math.ceil(total / itemsPerPage);

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

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Internships</h2>
        <p className="text-text-secondary">{error}</p>
        <button onClick={fetchInternships} className="mt-4 text-primary hover:underline">Try Again</button>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Internship Management</h1>
          <p className="text-text-secondary">Oversee all internship listings</p>
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
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Internships Table */}
      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Internship</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Applicants</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-muted">No internships found</td>
                </tr>
              ) : (
                filteredInternships.map((internship, index) => {
                  const skills = internship.skillsRequired || [];
                  return (
                    <motion.tr
                      key={internship._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-primary-dark">{internship.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">{skill}</span>
                            ))}
                            {skills.length > 3 && (
                              <span className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">+{skills.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{internship.companyName}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-text-muted" />
                        {internship.location}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                          {internship.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{internship.applicants}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => handleView(internship)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Trash2 className="w-4 h-4 text-status-error hover:text-status-error/80" />}
                            onClick={() => handleDelete(internship._id)}
                            disabled={actionLoading}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted text-center sm:text-left">
            Showing {filteredInternships.length} of {total} internships
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
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* View Internship Modal */}
      {showViewModal && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-strong"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Internship Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-background-light rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedInternship.title}</h3>
                  <p className="text-text-secondary flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {selectedInternship.companyName}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedInternship.status)}`}>
                  {selectedInternship.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Location</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Type</p>
                  <p className="font-medium text-primary-dark">{selectedInternship.type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Duration</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Application Deadline</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.applicationDeadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Available Slots</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.spotsAvailable}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Total Applicants</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.applicants}
                  </p>
                </div>
              </div>

              {selectedInternship.aboutRole && (
                <div>
                  <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-primary" />
                    Description
                  </p>
                  <p className="text-text-secondary text-sm p-3 bg-background-light rounded-lg">
                    {selectedInternship.aboutRole}
                  </p>
                </div>
              )}

              {selectedInternship.skillsRequired && selectedInternship.skillsRequired.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1 text-primary" />
                    Skills Required
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skillsRequired.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedInternship.benefits && selectedInternship.benefits.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-1 text-primary" />
                    Benefits
                  </p>
                  <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                    {selectedInternship.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-status-error text-status-error hover:bg-status-error/10" 
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDelete(selectedInternship._id)}
                  disabled={actionLoading}
                >
                  Delete Internship
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminInternships;