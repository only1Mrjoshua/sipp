import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  UserPlus,
  Loader,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import api from '../../services/api';
import { authService } from '../../services/authService';



const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);

  // Map icon names to components
  const iconMap = {
    UserPlus,
    Building2,
    Briefcase,
    Activity,
    CheckCircle,
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = authService.getToken();
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Fetch stats
      const statsResponse = await api.get('/api/admin/stats');
      const statsData = statsResponse.data;

      // Build stats array from backend response
      const statsArray = [
        { label: 'Total Students', value: statsData.totalStudents || 0, icon: Users, color: 'bg-primary/10 text-primary' },
        { label: 'Total Companies', value: statsData.totalCompanies || 0, icon: Building2, color: 'bg-accent-yellow/10 text-accent-yellow' },
        { label: 'Internships', value: statsData.totalInternships || 0, icon: Briefcase, color: 'bg-status-info/10 text-status-info' },
        { label: 'Total Applications', value: statsData.totalApplications || 0, icon: FileCheck, color: 'bg-primary/10 text-primary' },
        { label: 'Accepted', value: statsData.accepted || 0, icon: CheckCircle, color: 'bg-status-success/10 text-status-success' },
        { label: 'Rejected', value: statsData.rejected || 0, icon: XCircle, color: 'bg-status-error/10 text-status-error' },
        { label: 'Pending', value: statsData.pending || 0, icon: Clock, color: 'bg-accent-yellow/10 text-accent-yellow' },
        { label: 'Active Internships', value: statsData.activeInternships || 0, icon: TrendingUp, color: 'bg-status-success/10 text-status-success' },
      ];
      setStats(statsArray);

      // Fetch recent activities
      const activitiesResponse = await api.get('/api/admin/activities?limit=5');
      setActivities(activitiesResponse.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get icon component from string
  const getIcon = (iconName) => {
    return iconMap[iconName] || Activity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" padding="lg" className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-status-error mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary-dark mb-2">Error Loading Dashboard</h2>
        <p className="text-text-secondary">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 text-primary hover:underline"
        >
          Try Again
        </button>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Dashboard</h1>
        <p className="text-text-secondary">Overview of the SIPP platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="text-center">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-primary-dark">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity, index) => {
              const IconComponent = getIcon(activity.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-background-light rounded-xl hover:bg-primary-light/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-dark">{activity.action}</p>
                      <p className="text-xs text-text-muted">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">{activity.time}</span>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;