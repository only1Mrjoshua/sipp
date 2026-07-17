import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Container from '../common/Container';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

/**
 * Testimonials Section - User reviews
 */
const Testimonials = () => {
  const testimonials = [
    {
      name: 'Chioma Okafor',
      role: 'Computer Science Student, UNILAG',
      image: '👩‍🎓',
      content: 'SIPP completely transformed my SIWES experience. I found the perfect internship that matched my skills perfectly!',
      rating: 5,
    },
    {
      name: 'Emeka Nwachukwu',
      role: 'Engineering Manager, TechCorp',
      image: '👨‍💼',
      content: 'We\'ve hired some of our best interns through SIPP. The matching system is incredibly accurate and efficient.',
      rating: 5,
    },
    {
      name: 'Sarah Adeyemi',
      role: 'UI/UX Designer, Creative Studios',
      image: '👩‍💻',
      content: 'The platform is so easy to use! I love how I can track my applications and get notified of new opportunities.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionTitle
          badge="Testimonials"
          title="What Our Users Say"
          subtitle="Real stories from students and companies who have found success with SIPP."
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              variant="bordered"
              padding="lg"
              animated
              delay={index * 0.15}
              className="relative group hover:shadow-card-hover transition-shadow"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-light/30" />
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-semibold text-primary-dark">{testimonial.name}</h4>
                  <p className="text-sm text-text-secondary">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                ))}
              </div>
              
              <p className="text-text-secondary text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;