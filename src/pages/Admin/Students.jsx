import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Trash2, 
  UserX, 
  Mail,
  Phone,
  Tag,
  Award,
  User,
  CheckCircle,
  XCircle,
  Download,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const AdminStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const itemsPerPage = 5;

  const departments = ['Computer Science', 'Statistics', 'Graphic Design', 'Engineering', 'Business', 'Medicine'];
  const levels = ['100L', '200L', '300L', '400L', '500L'];
  const statuses = ['Active', 'Suspended', 'Inactive'];

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, selectedDepartment, selectedLevel, selectedStatus, currentPage]);

  const fetchStudents = async () => {
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
      if (selectedDepartment) params.append('department', selectedDepartment);
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await api.get(`/api/admin/students?${params.toString()}`);
      const data = response.data;
      setStudents(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.detail || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleSuspend = async (studentId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this student?`)) return;
    setActionLoading(true);
    try {
      await api.put(`/api/admin/students/${studentId}/status`, {
        isActive: !currentStatus
      });
      await fetchStudents();
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent(prev => ({ ...prev, isActive: !currentStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this student? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api.delete(`/api/admin/students/${studentId}`);
      await fetchStudents();
      if (selectedStudent && selectedStudent._id === studentId) {
        setShowProfileModal(false);
        setSelectedStudent(null);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete student');
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

      let allStudents = [];
      let page = 0;
      const pageSize = 100; // max allowed by backend
      let hasMore = true;

      // Fetch all students page by page
      while (hasMore) {
        const params = new URLSearchParams({
          limit: pageSize,
          skip: page * pageSize,
        });
        if (searchTerm) params.append('search', searchTerm);
        if (selectedDepartment) params.append('department', selectedDepartment);
        if (selectedLevel) params.append('level', selectedLevel);
        if (selectedStatus) params.append('status', selectedStatus);

        const response = await api.get(`/api/admin/students?${params.toString()}`);
        const data = response.data;
        const pageStudents = data.data || [];
        allStudents = allStudents.concat(pageStudents);
        
        if (pageStudents.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }

      if (allStudents.length === 0) {
        alert('No students to export.');
        setExportLoading(false);
        return;
      }

      const headers = [
        'First Name', 'Last Name', 'Email', 'Phone', 'Department',
        'Level', 'Matric Number', 'Skills', 'Interests', 'Career Aspiration',
        'Status', 'Applications', 'Registered At'
      ];

      const rows = allStudents.map((s) => [
        s.firstName || '',
        s.lastName || '',
        s.email || '',
        s.phone || '',
        s.department || '',
        s.level || '',
        s.matricNumber || '',
        (s.skills || []).join('; '),
        (s.interests || []).join('; '),
        s.careerAspiration || '',
        s.isActive ? 'Active' : 'Suspended',
        s.applications || 0,
        s.createdAt ? new Date(s.createdAt).toLocaleString() : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export data.');
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-status-success/10 text-status-success';
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
          <p className="mt-4 text-text-secondary">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Students</h2>
        <p className="text-text-secondary">{error}</p>
        <button
          onClick={fetchStudents}
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
          <h1 className="text-2xl font-bold text-primary-dark">Student Management</h1>
          <p className="text-text-secondary">Manage all registered students</p>
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
            placeholder="Search by name, email, or matric number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
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

      {/* Students Table */}
      <Card variant="bordered" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-light">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Level</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Applications</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-muted">No students found</td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-dark">
                            {(student.firstName?.[0] || '') + (student.lastName?.[0] || '')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary-dark">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-text-muted">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{student.department}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{student.level}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.isActive ? 'Active' : 'Suspended')}`}>
                        {student.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{student.applications}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleViewStudent(student)}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<UserX className="w-4 h-4 text-status-error hover:text-status-error/80" />}
                          onClick={() => handleSuspend(student._id, student.isActive)}
                          disabled={actionLoading}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Trash2 className="w-4 h-4 text-status-error hover:text-status-error/80" />}
                          onClick={() => handleDelete(student._id)}
                          disabled={actionLoading}
                        />
                      </div>
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
            Showing {students.length} of {total} students
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

      {/* Student Profile Modal */}
      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-strong"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary-dark">Student Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-1 hover:bg-background-light rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background-light rounded-xl">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-dark">
                    {(selectedStudent.firstName?.[0] || '') + (selectedStudent.lastName?.[0] || '')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <p className="text-text-secondary">{selectedStudent.department} • {selectedStudent.level}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedStudent.isActive ? 'Active' : 'Suspended')}`}>
                    {selectedStudent.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Matric Number</p>
                  <p className="font-medium text-primary-dark">{selectedStudent.matricNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium text-primary-dark flex items-center"><Mail className="w-4 h-4 mr-1 text-primary" /> {selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="font-medium text-primary-dark flex items-center"><Phone className="w-4 h-4 mr-1 text-primary" /> {selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Applications</p>
                  <p className="text-2xl font-bold text-primary">{selectedStudent.applications}</p>
                </div>
              </div>

              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary-dark mb-2 flex items-center"><Tag className="w-4 h-4 mr-1 text-primary" /> Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.interests && selectedStudent.interests.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-primary-dark mb-2 flex items-center"><Award className="w-4 h-4 mr-1 text-primary" /> Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-status-error text-status-error hover:bg-status-error/10" 
                  icon={<UserX className="w-4 h-4" />}
                  onClick={() => handleSuspend(selectedStudent._id, selectedStudent.isActive)}
                  disabled={actionLoading}
                >
                  {selectedStudent.isActive ? 'Suspend Account' : 'Activate Account'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-status-error text-status-error hover:bg-status-error/10" 
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDelete(selectedStudent._id)}
                  disabled={actionLoading}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;