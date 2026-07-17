import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

/**
 * Animated Counter component
 * @param {Object} props
 * @param {number} props.end - End value
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.suffix - Suffix string (e.g., '+', 'K')
 * @param {string} props.prefix - Prefix string (e.g., '$', '#')
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedCounter = ({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  ...props
}) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      let startTime;
      const startValue = 0;
      
      const updateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const currentValue = Math.floor(progress * (end - startValue) + startValue);
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setCount(end);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView, end, duration, controls]);

  return (
    <motion.span
      ref={ref}
      className={`font-bold text-primary-dark ${className}`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      }}
      {...props}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;