import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@university.edu',
      phone: '+234 800 000 0000',
      department: 'Computer Science',
      level: '400L',
      matricNumber: 'UNILAG/CS/2024/001',
      skills: ['React', 'JavaScript', 'CSS', 'Python', 'SQL'],
      interests: ['Web Development', 'Data Science'],
      status: 'Active',
      applications: 8,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      phone: '+234 800 000 0001',
      department: 'Statistics',
      level: '400L',
      matricNumber: 'UNILAG/STAT/2024/002',
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      interests: ['Data Science', 'Analytics'],
      status: 'Active',
      applications: 6,
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.j@university.edu',
      phone: '+234 800 000 0002',
      department: 'Graphic Design',
      level: '400L',
      matricNumber: 'UNILAG/GD/2024/003',
      skills: ['Figma', 'UI Design', 'UX Research', 'Adobe XD'],
      interests: ['UI/UX Design', 'Product Design'],
      status: 'Suspended',
      applications: 4,
    },
  ];

  const departments = ['Computer Science', 'Statistics', 'Graphic Design', 'Engineering', 'Business', 'Medicine'];
  const levels = ['100L', '200L', '300L', '400L', '500L'];
  const statuses = ['Active', 'Suspended', 'Inactive'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || student.department === selectedDepartment;
    const matchesLevel = !selectedLevel || student.level === selectedLevel;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-status-success/10 text-status-success';
      case 'Suspended': return 'bg-status-error/10 text-status-error';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Student Management</h1>
          <p className="text-text-secondary">Manage all registered students</p>
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
              {currentStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-dark">{student.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-dark">{student.name}</p>
                        <p className="text-xs text-text-muted">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{student.department}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{student.level}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{student.applications}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowProfileModal(true);
                        }}
                      />
                      <Button variant="ghost" size="sm" icon={<UserX className="w-4 h-4 text-status-error hover:text-status-error/80" />} />
                      <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-status-error hover:text-status-error/80" />} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Simplified for mobile */}
        <div className="px-4 py-3 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted text-center sm:text-left">
            Showing {filteredStudents.length} of {students.length} students
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
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-background-light rounded-xl">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-dark">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedStudent.name}</h3>
                  <p className="text-text-secondary">{selectedStudent.department} • {selectedStudent.level}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
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

              {/* Skills */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2 flex items-center"><Tag className="w-4 h-4 mr-1 text-primary" /> Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-sm rounded-full">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2 flex items-center"><Award className="w-4 h-4 mr-1 text-primary" /> Interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">{interest}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button variant="outline" size="sm" className="border-status-error text-status-error hover:bg-status-error/10" icon={<UserX className="w-4 h-4" />}>Suspend Account</Button>
                <Button variant="outline" size="sm" className="border-status-error text-status-error hover:bg-status-error/10" icon={<Trash2 className="w-4 h-4" />}>Delete Account</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;