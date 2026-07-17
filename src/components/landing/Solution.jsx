import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Users, 
  Building2, 
  Briefcase, 
  GitBranch,
  Bell,
  BarChart3,
  Shield
} from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

/**
 * Solution Section - How SIPP solves the problems
 */
const Solution = () => {
  const solutions = [
    {
      icon: CheckCircle2,
      title: 'Smart Matching',
      description: 'AI-powered algorithms match students with internships based on skills and interests.',
      color: 'text-primary',
    },
    {
      icon: Users,
      title: 'Student Profiles',
      description: 'Comprehensive profiles showcase skills, projects, and career aspirations.',
      color: 'text-primary-light',
    },
    {
      icon: Building2,
      title: 'Company Portal',
      description: 'Companies can easily publish internships and manage applications.',
      color: 'text-accent-yellow',
    },
    {
      icon: Briefcase,
      title: 'Centralized Listings',
      description: 'All internship opportunities in one place, easily searchable and filterable.',
      color: 'text-primary-dark',
    },
    {
      icon: GitBranch,
      title: 'Application Tracking',
      description: 'Transparent application status tracking from submission to placement.',
      color: 'text-status-success',
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Instant updates on new opportunities and application status changes.',
      color: 'text-status-info',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Data-driven insights for students, companies, and administrators.',
      color: 'text-accent-orange',
    },
    {
      icon: Shield,
      title: 'Better Management',
      description: 'Simplified coordination between all stakeholders in the placement process.',
      color: 'text-text-secondary',
    },
  ];

  return (
    <section className="py-20 bg-background-light">
      <Container>
        <SectionTitle
          badge="The Solution"
          title="How SIPP Transforms Internship Placement"
          subtitle="We've built a modern platform that addresses every pain point in the SIWES process."
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              variant="default"
              padding="lg"
              animated
              delay={index * 0.08}
              className="group hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <solution.icon className={`w-6 h-6 ${solution.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary-dark mb-1">
                    {solution.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Solution;