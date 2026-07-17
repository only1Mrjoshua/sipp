import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentInternships = () => {
  const internships = [
    {
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc.',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      duration: '6 months',
      match: '95%',
      tags: ['React', 'JavaScript', 'CSS'],
    },
    {
      title: 'Data Analyst Intern',
      company: 'DataVision Ltd.',
      location: 'Abuja, Nigeria',
      type: 'Part-time',
      duration: '4 months',
      match: '88%',
      tags: ['Python', 'SQL', 'Tableau'],
    },
    {
      title: 'UI/UX Design Intern',
      company: 'Creative Studios',
      location: 'Remote',
      type: 'Full-time',
      duration: '6 months',
      match: '82%',
      tags: ['Figma', 'UI Design', 'UX Research'],
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-dark">Internships</h1>
        <p className="text-text-secondary">Browse internship opportunities matched for you</p>
      </div>

      {/* Internship Cards */}
      <div className="space-y-4">
        {internships.map((internship, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="bordered" padding="lg" className="hover:shadow-card-hover transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark">{internship.title}</h3>
                      <p className="text-text-secondary flex items-center mt-1">
                        <Building2 className="w-4 h-4 mr-1" />
                        {internship.company}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                      {internship.match} Match
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-secondary">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {internship.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {internship.duration}
                    </span>
                    <span className="px-2 py-0.5 bg-background-light rounded-full">
                      {internship.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {internship.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-light/20 text-primary-dark text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Apply Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentInternships;