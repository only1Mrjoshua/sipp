import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - 'default' | 'bordered' | 'glass' | 'gradient'
 * @param {string} props.padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {boolean} props.hoverable - Enable hover effects
 * @param {boolean} props.animated - Enable animation
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.className - Additional CSS classes
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  animated = false,
  delay = 0,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white shadow-card',
    bordered: 'bg-white border border-border-light',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft',
    gradient: 'bg-gradient-to-br from-primary-light/20 to-primary/10',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-5 sm:p-6 lg:p-8',
  };

  const hoverClasses = hoverable
    ? 'hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 cursor-pointer'
    : '';

  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      },
    },
  };

  // Always use motion.div to avoid prop issues
  return (
    <motion.div
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${className}
      `}
      initial={animated ? 'hidden' : undefined}
      whileInView={animated ? 'visible' : undefined}
      viewport={animated ? { once: true, amount: 0.2 } : undefined}
      variants={animationVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;