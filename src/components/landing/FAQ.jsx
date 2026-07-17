import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

/**
 * FAQ Section - Animated accordion
 */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is SIPP?',
      answer: 'SIPP (Smart Internship Placement Portal) is a modern web-based platform designed to simplify and improve the SIWES internship placement process. It intelligently matches students with internship opportunities using a tag-based matching system.',
    },
    {
      question: 'Who can use SIPP?',
      answer: 'SIPP is designed for three main user groups: Students looking for internships, Companies offering internship opportunities, and Administrators managing the platform.',
    },
    {
      question: 'How does the matching system work?',
      answer: 'Our smart matching system compares students\' skills, interests, department, and career aspirations with company internship requirements. It uses a tag-based system to find the best matches.',
    },
    {
      question: 'Is SIPP free for students?',
      answer: 'Yes! SIPP is completely free for students. We believe every student should have access to quality internship opportunities without any barriers.',
    },
    {
      question: 'How do companies join SIPP?',
      answer: 'Companies can create an account, verify their organization, and start posting internship opportunities immediately. Our team reviews all company registrations to ensure quality.',
    },
    {
      question: 'Can I track my application status?',
      answer: 'Yes! SIPP provides real-time application tracking. You can see exactly where your application stands, from submission to final placement decision.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-background-light">
      <Container>
        <SectionTitle
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Find answers to the most common questions about SIPP."
          align="center"
        />

        <div className="max-w-3xl mx-auto mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              variant="bordered"
              padding="none"
              className="overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-light/5 transition-colors"
              >
                <span className="font-semibold text-primary-dark">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-text-secondary leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;