import React, { useState } from 'react';
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
  GraduationCap,
  Award,
  FileText
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminInternships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const internships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc.',
      location: 'Lagos, Nigeria',
      category: 'Software',
      duration: '6 months',
      deadline: '2024-12-15',
      slots: 3,
      applicants: 12,
      status: 'Active',
      skills: ['React', 'JavaScript', 'CSS', 'Tailwind'],
      description: 'We are looking for a passionate Frontend Developer Intern to join our dynamic team. You will work on exciting projects and learn from experienced developers.',
      requirements: ['Proficiency in React.js', 'Strong JavaScript skills', 'Understanding of CSS and responsive design'],
      benefits: ['Mentorship program', 'Remote work options', 'Flexible working hours'],
    },
    {
      id: 2,
      title: 'Data Analyst Intern',
      company: 'DataVision Ltd.',
      location: 'Abuja, Nigeria',
      category: 'Data Science',
      duration: '4 months',
      deadline: '2024-12-20',
      slots: 2,
      applicants: 8,
      status: 'Active',
      skills: ['Python', 'SQL', 'Tableau', 'Excel'],
      description: 'We are seeking a Data Analyst Intern with strong analytical skills to join our team.',
      requirements: ['Proficiency in Python', 'SQL knowledge', 'Data visualization skills'],
      benefits: ['Paid internship', 'Flexible hours', 'Training provided'],
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      company: 'Creative Studios',
      location: 'Remote',
      category: 'Design',
      duration: '6 months',
      deadline: '2024-11-30',
      slots: 1,
      applicants: 15,
      status: 'Closed',
      skills: ['Figma', 'UI Design', 'UX Research', 'Adobe XD'],
      description: 'We are looking for a creative UI/UX Design Intern to help us design beautiful user experiences.',
      requirements: ['Figma proficiency', 'Understanding of UX principles', 'Portfolio required'],
      benefits: ['Remote work', 'Mentorship', 'Certificate upon completion'],
    },
  ];

  const categories = ['Software', 'Data Science', 'Design', 'Marketing', 'Finance', 'Engineering'];
  const locations = ['Lagos', 'Abuja', 'Remote', 'Port Harcourt', 'Ibadan'];
  const statuses = ['Active', 'Closed', 'Draft', 'Archived'];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || internship.category === selectedCategory;
    const matchesLocation = !selectedLocation || internship.location.includes(selectedLocation);
    const matchesStatus = !selectedStatus || internship.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInternships = filteredInternships.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-status-success/10 text-status-success';
      case 'Closed': return 'bg-status-error/10 text-status-error';
      case 'Draft': return 'bg-accent-yellow/10 text-accent-yellow';
      case 'Archived': return 'bg-text-muted/10 text-text-muted';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowViewModal(true);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Internship Management</h1>
          <p className="text-text-secondary">Oversee all internship listings</p>
        </div>
        <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
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
              {currentInternships.map((internship, index) => (
                <motion.tr
                  key={internship.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-primary-dark">{internship.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {internship.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">{skill}</span>
                        ))}
                        {internship.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-primary-light/20 text-primary-dark text-xs rounded-full">+{internship.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{internship.company}</td>
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
            Showing {filteredInternships.length} of {internships.length} internships
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
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedInternship.title}</h3>
                  <p className="text-text-secondary flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {selectedInternship.company}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedInternship.status)}`}>
                  {selectedInternship.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Location</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Category</p>
                  <p className="font-medium text-primary-dark">{selectedInternship.category}</p>
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
                    {selectedInternship.deadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Available Slots</p>
                  <p className="font-medium text-primary-dark flex items-center">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    {selectedInternship.slots}
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

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1 text-primary" />
                  Description
                </p>
                <p className="text-text-secondary text-sm p-3 bg-background-light rounded-lg">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Skills Required */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1 text-primary" />
                  Skills Required
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-accent-yellow/10 text-accent-orange text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <p className="text-sm font-medium text-primary-dark mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1 text-primary" />
                  Requirements
                </p>
                <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                  {selectedInternship.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
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

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light">
                <Button variant="outline" size="sm" className="border-status-error text-status-error hover:bg-status-error/10" icon={<Trash2 className="w-4 h-4" />}>
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