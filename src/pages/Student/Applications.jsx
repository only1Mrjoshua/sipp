import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCheck, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentApplications = () => {
  const navigate = useNavigate();

  const applications = [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp Inc.', status: 'In Review', date: '2 days ago' },
    { id: 2, title: 'UI/UX Designer', company: 'Creative Studios', status: 'Accepted', date: '1 week ago' },
    { id: 3, title: 'Backend Developer', company: 'API Solutions', status: 'Rejected', date: '2 weeks ago' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5 text-status-success" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-status-error" />;
      case 'In Review': return <Clock className="w-5 h-5 text-accent-yellow" />;
      default: return <FileCheck className="w-5 h-5 text-accent-yellow" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-status-success/10 text-status-success';
      case 'Rejected': return 'bg-status-error/10 text-status-error';
      case 'In Review': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-accent-yellow/10 text-accent-yellow';
    }
  };

  const handleView = (id) => {
    navigate(`/student/application/${id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Applications</h1>
        <p className="text-text-secondary">Track all your internship applications</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: '12', color: 'text-primary' },
          { label: 'In Review', value: '4', color: 'text-accent-yellow' },
          { label: 'Accepted', value: '2', color: 'text-status-success' },
          { label: 'Rejected', value: '3', color: 'text-status-error' },
        ].map((stat, index) => (
          <Card key={index} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(app.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">{app.title}</h3>
                    <p className="text-text-secondary">{app.company}</p>
                    <p className="text-sm text-text-muted mt-1">{app.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleView(app.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentApplications;