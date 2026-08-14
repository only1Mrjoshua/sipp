import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  School,
  Briefcase,
  MapPin,
  Clock,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { authService } from '../../services/authService';

const CompanyAcceptedStudents = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
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

      // Get company details
      const companyRes = await api.get(`/api/admin/companies/${companyId}`);
      setCompany(companyRes.data);

      // Get accepted students
      const studentsRes = await api.get(`/api/admin/companies/${companyId}/accepted`);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading accepted students...</p>
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
          <p className="text-text-secondary">Students accepted by this company</p>
        </div>
      </div>

      {students.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No accepted students yet for this company.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((item) => (
            <Card key={item._id} variant="bordered" padding="lg">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-dark">
                      {item.student?.firstName?.[0]}{item.student?.lastName?.[0] || 'S'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark">
                      {item.student?.firstName} {item.student?.lastName}
                    </h4>
                    <p className="text-sm text-text-secondary flex items-center">
                      <Mail className="w-3 h-3 mr-1" /> {item.student?.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-text-muted">University</p>
                    <p className="font-medium">{item.student?.university || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Department</p>
                    <p className="font-medium">{item.student?.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Level</p>
                    <p className="font-medium">{item.student?.level || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Match Score</p>
                    <p className="font-medium text-primary">{item.matchScore}%</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border-light">
                  <p className="text-sm text-text-muted">Internship</p>
                  <p className="font-medium text-primary-dark flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {item.internship?.title}
                  </p>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> {item.internship?.location} · <Clock className="w-3 h-3" /> {item.internship?.duration}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyAcceptedStudents;