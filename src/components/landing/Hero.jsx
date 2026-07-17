import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Building2, Briefcase } from 'lucide-react';
import Button from '../common/Button';
import Container from '../common/Container';
import { Link } from 'react-router-dom';

/**
 * Hero Section - Main landing page hero
 */
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-yellow/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-primary-dark"
            >
              Find the Right{' '}
              <span className="text-gradient">SIWES Internship</span>
              <br />
              for Your Skills
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed"
            >
              Create your profile, discover matching internships, and track your
              applications, all in one smart platform designed for SIWES students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Image (Now visible on all screen sizes) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="bg-white rounded-2xl shadow-strong p-4 border border-border-light overflow-hidden">
                <img 
                  src="/src/assets/images/dashboard-preview.jpg" 
                  alt="SIPP Dashboard Preview"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;