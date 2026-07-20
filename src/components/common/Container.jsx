import React from 'react';

/**
 * Reusable Container component for consistent layout
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.noPadding - Remove default padding
 */
const Container = ({
  children,
  size = 'xl',
  className = '',
  noPadding = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        mx-auto
        ${sizeClasses[size]}
        ${!noPadding && 'px-4 sm:px-6 lg:px-8'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;