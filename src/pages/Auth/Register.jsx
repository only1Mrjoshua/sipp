import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Building2, ArrowRight } from 'lucide-react';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Register = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Find your perfect internship match',
      icon: Users,
      path: '/signup/student',
      color: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      id: 'company',
      title: 'Company',
      description: 'Find talented interns for your organization',
      icon: Building2,
      path: '/signup/company',
      color: 'bg-accent-yellow/10',
      iconColor: 'text-accent-yellow',
    },
  ];

  const handleRoleSelect = (path) => {
    navigate(path);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-hero">
      <Container>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">
                Choose Your Account Type
              </h1>
              <p className="text-text-secondary mt-3 text-lg">
                Select how you want to use SIPP
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.path)}
                    className="cursor-pointer"
                  >
                    <Card
                      variant="default"
                      padding="lg"
                      className="text-center hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className={`w-20 h-20 ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-10 h-10 ${role.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-bold text-primary-dark mb-2">
                        {role.title}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {role.description}
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<ArrowRight className="w-4 h-4" />}
                        >
                          Select
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Register;