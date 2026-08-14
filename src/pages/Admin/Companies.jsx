import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Trash2, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Download,
  Briefcase,
  Users,
  XCircle,
  Loader,
  AlertCircle,
  UserX
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminCompanies = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 5;

  // Static industry list (will be extended from backend later if needed)
  const industries = ['Software', 'Data Science', 'Design', 'Banking', 'Manufacturing', 'Telecommunications'];

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, selectedIndustry, currentPage]);

  const fetchCompanies = async () => {
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
      if (selectedIndustry) params.append('industry', selectedIndustry);

      const response = await api.get(`/api/admin/companies?${params.toString()}`);
      const data = response.data;
      setCompanies(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.response?.data?.detail || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowProfileModal(true);
  };

  const handleToggleSuspend = async (companyId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this company?`)) return;
    setActionLoading(true);
    try {
      await api.put(`/api/admin/companies/${companyId}/status`, {
        isActive: !currentStatus
      });
      await fetchCompanies();
      if (selectedCompany && selectedCompany._id === companyId) {
        setSelectedCompany(prev => ({ ...prev, isActive: !currentStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm('Are you sure you want to permanently delete this company? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/admin/companies/${companyId}`);
      await fetchCompanies();
      if (selectedCompany && selectedCompany._id === companyId) {
        setShowProfileModal(false);
        setSelectedCompany(null);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete company');
    } finally {
      setActionLoading(false);
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

      // Build filter params (same as table)
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedIndustry) params.append('industry', selectedIndustry);

      // Fetch all companies by looping through pages (backend limit is 100)
      let allCompanies = [];
      let page = 0;
      const limit = 100;
      let hasMore = true;

      while (hasMore) {
        const skip = page * limit;
        const p = new URLSearchParams(params);
        p.append('limit', limit);
        p.append('skip', skip);

        const response = await api.get(`/api/admin/companies?${p.toString()}`);
        const data = response.data;
        allCompanies = allCompanies.concat(data.data || []);
        hasMore = data.data && data.data.length === limit;
        page++;
        // Safety: avoid infinite loop if something goes wrong
        if (page > 50) break;
      }

      if (allCompanies.length === 0) {
        alert('No companies to export.');
        setExportLoading(false);
        return;
      }

      // Build CSV headers and rows
      const headers = [
        'Company Name', 'Email', 'Phone', 'Industry', 'State', 'City', 'Address',
        'Website', 'Contact Person', 'Status', 'Internships', 'Accepted Students', 'Registered At'
      ];

      const rows = allCompanies.map((c) => {
        const status = !c.isActive ? 'Suspended' : (!c.isVerified ? 'Pending' : 'Verified');
        return [
          c.companyName || '',
          c.email || '',
          c.phone || '',
          c.industry || '',
          c.state || '',
          c.city || '',
          c.address || '',
          c.website || '',
          c.contactPerson || 'N/A',
          status,
          c.internships || 0,
          c.acceptedStudents || 0,
          c.createdAt ? new Date(c.createdAt).toLocaleString() : ''
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `companies_export_${new Date().toISOString().slice(0,10)}.csv`);
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

  const getStatus = (company) => {
    if (!company.isActive) return 'Suspended';
    if (!company.isVerified) return 'Pending';
    return 'Verified';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'bg-status-success/10 text-status-success';
      case 'Pending': return 'bg-accent-yellow/10 text-accent-yellow';
      case 'Suspended': return 'bg-status-error/10 text-status-error';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Companies</h2>
        <p className="text-text-secondary">{error}</p>
        <button
          onClick={fetchCompanies}
          className="mt-4 text-primary hover:underline"
        >
          Try Again
        </button>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Company Management</h1>
          <p className="text-text-secondary">Manage all registered companies</p>
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
            placeholder="Search by company name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Companies Table */}
      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Industry</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Internships</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Accepted</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-text-muted">No companies found</td>
                </tr>
              ) : (
                companies.map((company, index) => {
                  const status = getStatus(company);
                  return (
                    <motion.tr
                      key={company._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-dark">
                              {company.companyName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary-dark">{company.companyName}</p>
                            <p className="text-xs text-text-muted">{company.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{company.industry}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{company.internships}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{company.acceptedStudents}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewCompany(company)}
                          />
                          <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-status-error hover:text-status-error/80" />} onClick={() => handleDelete(company._id)} disabled={actionLoading} />
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
            Showing {companies.length} of {total} companies
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

      {/* Company Profile Modal */}
      {showProfileModal && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-strong"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Company Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-1 hover:bg-background-light rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background-light rounded-xl">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-dark">
                    {selectedCompany.companyName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedCompany.companyName}</h3>
                  <p className="text-text-secondary">{selectedCompany.industry}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(getStatus(selectedCompany))}`}>
                    {getStatus(selectedCompany)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium text-primary-dark flex items-center"><Mail className="w-4 h-4 mr-1 text-primary" /> {selectedCompany.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium text-primary-dark flex items-center"><Phone className="w-4 h-4 mr-1 text-primary" /> {selectedCompany.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Address</p>
                  <p className="font-medium text-primary-dark flex items-center"><MapPin className="w-4 h-4 mr-1 text-primary" /> {selectedCompany.address}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Website</p>
                  <a href={`https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center">
                    <Globe className="w-4 h-4 mr-1" /> {selectedCompany.website}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Contact Person</p>
                  <p className="font-medium text-primary-dark flex items-center"><User className="w-4 h-4 mr-1 text-primary" /> {selectedCompany.contactPerson || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-text-muted">Internships</p>
                    <p className="text-xl font-bold text-primary">{selectedCompany.internships}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Accepted Students</p>
                    <p className="text-xl font-bold text-primary">{selectedCompany.acceptedStudents}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Briefcase className="w-4 h-4" />}
                  onClick={() => navigate(`/admin/company/${selectedCompany._id}/internships`)}
                >
                  View Internships
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Users className="w-4 h-4" />}
                  onClick={() => navigate(`/admin/company/${selectedCompany._id}/accepted-students`)}
                >
                  View Accepted Students
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-status-error text-status-error hover:bg-status-error/10" 
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDelete(selectedCompany._id)}
                  disabled={actionLoading}
                >
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-status-warning text-status-warning hover:bg-status-warning/10" 
                  icon={<UserX className="w-4 h-4" />}
                  onClick={() => handleToggleSuspend(selectedCompany._id, selectedCompany.isActive)}
                  disabled={actionLoading}
                >
                  {selectedCompany.isActive ? 'Suspend' : 'Activate'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;