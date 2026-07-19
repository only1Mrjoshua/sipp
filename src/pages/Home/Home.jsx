import React from 'react';
import Hero from '../../components/landing/Hero';
import Problem from '../../components/landing/Problem';
import Solution from '../../components/landing/Solution';
import HowItWorks from '../../components/landing/HowItWorks';
import FAQ from '../../components/landing/FAQ';
import CTA from '../../components/landing/CTA';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;