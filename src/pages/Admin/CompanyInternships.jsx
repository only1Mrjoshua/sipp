import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  Users,
  Loader,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const AdminCompanyInternships = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internships, setInternships] = useState([]);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = authService.getToken();
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const companyRes = await api.get(`/api/admin/companies/${companyId}`);
      setCompany(companyRes.data);

      const internshipsRes = await api.get(`/api/admin/companies/${companyId}/internships`);
      console.log('Internships data:', internshipsRes.data); // Debug: check status values
      setInternships(internshipsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Status badge function
  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase() || '';
    switch(normalized) {
      case 'active':
        return { color: 'bg-status-success/10 text-status-success', icon: CheckCircle };
      case 'closed':
        return { color: 'bg-status-error/10 text-status-error', icon: XCircle };
      case 'draft':
        return { color: 'bg-accent-yellow/10 text-accent-yellow', icon: AlertCircle };
      case 'archived':
        return { color: 'bg-text-muted/10 text-text-muted', icon: AlertCircle };
      default:
        return { color: 'bg-primary/10 text-primary', icon: Briefcase };
    }
  };

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
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Data</h2>
        <p className="text-text-secondary">{error}</p>
        <button onClick={fetchData} className="mt-4 text-primary hover:underline">Try Again</button>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/companies')}
          className="p-2 hover:bg-background-light rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">{company?.companyName}</h1>
          <p className="text-text-secondary">All internships posted by this company</p>
        </div>
      </div>

      {internships.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No internships found for this company.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {internships.map((internship) => {
            const badge = getStatusBadge(internship.status);
            const StatusIcon = badge.icon;
            return (
              <Card key={internship._id} variant="bordered" padding="lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-primary-dark">{internship.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center ${badge.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {internship.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-secondary">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {internship.location}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {internship.duration}</span>
                      <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {internship.applicants} applicants</span>
                      <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {internship.type}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCompanyInternships;