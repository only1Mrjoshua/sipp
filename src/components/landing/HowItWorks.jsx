import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  UserCircle, 
  Tag, 
  Search, 
  Send, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

/**
 * How It Works Section - Step-by-step guide
 */
const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Student Registers',
      description: 'Create your account and set up your profile with basic information.',
      step: '1',
    },
    {
      icon: UserCircle,
      title: 'Builds Profile',
      description: 'Add your department, skills, interests, and career aspirations.',
      step: '2',
    },
    {
      icon: Tag,
      title: 'Adds Skills & Interests',
      description: 'Tag your skills and interests to enable intelligent matching.',
      step: '3',
    },
    {
      icon: Search,
      title: 'System Recommends Internships',
      description: 'AI-powered matching recommends the best opportunities for you.',
      step: '4',
    },
    {
      icon: Send,
      title: 'Student Applies',
      description: 'Apply to internships directly through the platform.',
      step: '5',
    },
    {
      icon: CheckCircle,
      title: 'Company Reviews Application',
      description: 'Companies review applications and contact qualified candidates.',
      step: '6',
    },
  ];

  return (
    <section className="py-20 bg-background-light">
      <Container>
        <SectionTitle
          badge="How It Works"
          title="Get Started in 6 Simple Steps"
          subtitle="From registration to placement - your journey to the perfect internship starts here."
          align="center"
        />

        <div className="relative mt-12">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary-light/50 -translate-x-1/2" />
          
          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <Card variant="default" padding="lg" className="max-w-md mx-auto lg:mx-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        index % 2 === 0 ? 'lg:order-2' : ''
                      }`}>
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className={index % 2 === 0 ? 'lg:text-right' : ''}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">Step {step.step}</span>
                          <h3 className="text-lg font-semibold text-primary-dark">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Timeline Node */}
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-glow z-10">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block w-6 h-6 text-primary/50" />
                  )}
                </div>

                {/* Empty space for alignment */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;