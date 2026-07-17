import React, { useState } from 'react';
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
  XCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const companies = [
    {
      id: 1,
      name: 'TechCorp Inc.',
      email: 'hr@techcorp.com',
      phone: '+234 800 123 4567',
      industry: 'Software',
      address: '123 Business District, Lagos',
      website: 'www.techcorp.com',
      contactPerson: 'Sarah Johnson',
      status: 'Verified',
      internships: 12,
      acceptedStudents: 8,
      logo: 'TC',
    },
    {
      id: 2,
      name: 'DataVision Ltd.',
      email: 'careers@datavision.com',
      phone: '+234 800 123 4568',
      industry: 'Data Science',
      address: '456 Tech Hub, Abuja',
      website: 'www.datavision.com',
      contactPerson: 'Michael Adeyemi',
      status: 'Pending',
      internships: 6,
      acceptedStudents: 3,
      logo: 'DV',
    },
    {
      id: 3,
      name: 'Creative Studios',
      email: 'hello@creativestudios.com',
      phone: '+234 800 123 4569',
      industry: 'Design',
      address: '789 Art District, Lagos',
      website: 'www.creativestudios.com',
      contactPerson: 'Amara Okafor',
      status: 'Verified',
      internships: 8,
      acceptedStudents: 5,
      logo: 'CS',
    },
  ];

  const industries = ['Software', 'Data Science', 'Design', 'Banking', 'Manufacturing', 'Telecommunications'];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'bg-status-success/10 text-status-success';
      case 'Pending': return 'bg-accent-yellow/10 text-accent-yellow';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'Suspended': return 'bg-status-error/10 text-status-error';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Company Management</h1>
          <p className="text-text-secondary">Manage all registered companies</p>
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
              {currentCompanies.map((company, index) => (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-light hover:bg-background-light/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-dark">{company.logo}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-dark">{company.name}</p>
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
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowProfileModal(true);
                        }}
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
            Showing {filteredCompanies.length} of {companies.length} companies
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
                  <span className="text-2xl font-bold text-primary-dark">{selectedCompany.logo}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">{selectedCompany.name}</h3>
                  <p className="text-text-secondary">{selectedCompany.industry}</p>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedCompany.status)}`}>
                    {selectedCompany.status}
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
                  <p className="font-medium text-primary-dark flex items-center"><User className="w-4 h-4 mr-1 text-primary" /> {selectedCompany.contactPerson}</p>
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
                <Button variant="outline" size="sm" icon={<Briefcase className="w-4 h-4" />}>View Internships</Button>
                <Button variant="outline" size="sm" icon={<Users className="w-4 h-4" />}>View Accepted Students</Button>
                <Button variant="outline" size="sm" className="border-status-error text-status-error hover:bg-status-error/10" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;