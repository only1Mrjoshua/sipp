import React from 'react';
import { motion } from 'framer-motion';
import { 
  XCircle, 
  FileText, 
  EyeOff, 
  Clock, 
  AlertTriangle,
  SearchX
} from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

/**
 * Problem Section - Highlights current SIWES challenges
 */
const Problem = () => {
  const problems = [
    {
      icon: SearchX,
      title: 'Manual Placement',
      description: 'Students rely on manual, outdated processes to find internship opportunities.',
      color: 'text-status-error',
      bgColor: 'bg-status-error/10',
    },
    {
      icon: AlertTriangle,
      title: 'Poor Matching',
      description: 'Students are often mismatched with internships that don\'t align with their skills.',
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
    },
    {
      icon: FileText,
      title: 'Paper-Based Process',
      description: 'Excessive paperwork and physical applications slow down the entire process.',
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/10',
    },
    {
      icon: EyeOff,
      title: 'Lack of Transparency',
      description: 'Students have limited visibility into application status and company feedback.',
      color: 'text-text-muted',
      bgColor: 'bg-text-muted/10',
    },
    {
      icon: Clock,
      title: 'Slow Communication',
      description: 'Delays in communication between students, companies, and coordinators.',
      color: 'text-status-info',
      bgColor: 'bg-status-info/10',
    },
    {
      icon: XCircle,
      title: 'Limited Opportunities',
      description: 'Students struggle to discover all available internship opportunities.',
      color: 'text-status-error',
      bgColor: 'bg-status-error/10',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionTitle
          badge="The Challenge"
          title="Problems with the Current SIWES Process"
          subtitle="The traditional internship placement system is broken. Here's why students and companies struggle."
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {problems.map((problem, index) => (
            <Card
              key={index}
              variant="bordered"
              padding="lg"
              animated
              delay={index * 0.1}
              className="hover:shadow-card-hover transition-shadow group"
            >
              <div className={`w-12 h-12 ${problem.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <problem.icon className={`w-6 h-6 ${problem.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-primary-dark mb-2">
                {problem.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {problem.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Problem;