import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Section Title component
 * @param {Object} props
 * @param {string} props.title - Main title
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.badge - Badge text (optional)
 * @param {string} props.align - 'left' | 'center' | 'right'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Enable animations
 */
const SectionTitle = ({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
  animate = true,
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1 } },
  };

  const Component = animate ? motion.div : 'div';
  const TitleComponent = animate ? motion.h2 : 'h2';
  const SubtitleComponent = animate ? motion.p : 'p';

  return (
    <Component
      className={`mb-12 ${alignClasses[align]} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {badge && (
        <motion.span
          variants={badgeVariants}
          className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-primary-dark bg-primary-light/30 rounded-full"
        >
          {badge}
        </motion.span>
      )}
      
      <TitleComponent
        variants={titleVariants}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-dark"
      >
        {title}
      </TitleComponent>
      
      {subtitle && (
        <SubtitleComponent
          variants={subtitleVariants}
          className="mt-4 text-lg text-text-secondary max-w-3xl mx-auto"
        >
          {subtitle}
        </SubtitleComponent>
      )}
    </Component>
  );
};

export default SectionTitle;