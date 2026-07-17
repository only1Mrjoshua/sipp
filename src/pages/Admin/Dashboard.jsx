import React from 'react';
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
  UserPlus
} from 'lucide-react';
import Card from '../../components/common/Card';

const AdminDashboard = () => {
  // Stats data
  const stats = [
    { label: 'Total Students', value: '1,248', icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Total Companies', value: '156', icon: Building2, color: 'bg-accent-yellow/10 text-accent-yellow' },
    { label: 'Internships', value: '89', icon: Briefcase, color: 'bg-status-info/10 text-status-info' },
    { label: 'Total Applications', value: '2,134', icon: FileCheck, color: 'bg-primary/10 text-primary' },
    { label: 'Accepted', value: '456', icon: CheckCircle, color: 'bg-status-success/10 text-status-success' },
    { label: 'Rejected', value: '892', icon: XCircle, color: 'bg-status-error/10 text-status-error' },
    { label: 'Pending', value: '786', icon: Clock, color: 'bg-accent-yellow/10 text-accent-yellow' },
    { label: 'Active Internships', value: '56', icon: TrendingUp, color: 'bg-status-success/10 text-status-success' },
  ];

  // Recent activity
  const recentActivity = [
    { action: 'New student registered', user: 'John Doe', time: '2 mins ago', icon: UserPlus },
    { action: 'New company registered', user: 'TechCorp Inc.', time: '15 mins ago', icon: Building2 },
    { action: 'New internship posted', user: 'DataVision Ltd.', time: '1 hour ago', icon: Briefcase },
    { action: 'Student accepted', user: 'Jane Smith', time: '2 hours ago', icon: CheckCircle },
    { action: 'Company profile updated', user: 'Creative Studios', time: '3 hours ago', icon: Activity },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Dashboard</h1>
        <p className="text-text-secondary">Overview of the SIPP platform</p>
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
              <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
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
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-background-light rounded-xl hover:bg-primary-light/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-dark">{activity.action}</p>
                  <p className="text-xs text-text-muted">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-text-muted">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;