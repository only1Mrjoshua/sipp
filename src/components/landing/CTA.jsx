import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../common/Container';
import Button from '../common/Button';

/**
 * Call to Action Section - Final CTA
 */
const CTA = () => {
  return (
    <section className="py-20 bg-primary-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Ready to Start Your{' '}
            <span className="text-gradient-accent">SIWES Journey</span>?
          </h2>
          
          <p className="text-lg text-primary-light/80 max-w-2xl mx-auto mb-8">
            Join thousands of students and companies already using SIPP to find the perfect internship match.
            Create your account today and take the first step toward your dream internship.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button
                variant="accent"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                className="shadow-glow"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;