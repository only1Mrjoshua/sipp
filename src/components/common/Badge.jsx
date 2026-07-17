import React from 'react';

/**
 * Reusable Badge component for status indicators
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.outline - Outline variant
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  outline = false,
  children,
  className = '',
  ...props
}) => {
  const variantColors = {
    primary: {
      bg: 'bg-primary',
      text: 'text-white',
      border: 'border-primary',
      outlineText: 'text-primary',
    },
    success: {
      bg: 'bg-status-success',
      text: 'text-white',
      border: 'border-status-success',
      outlineText: 'text-status-success',
    },
    warning: {
      bg: 'bg-status-warning',
      text: 'text-white',
      border: 'border-status-warning',
      outlineText: 'text-status-warning',
    },
    error: {
      bg: 'bg-status-error',
      text: 'text-white',
      border: 'border-status-error',
      outlineText: 'text-status-error',
    },
    info: {
      bg: 'bg-status-info',
      text: 'text-white',
      border: 'border-status-info',
      outlineText: 'text-status-info',
    },
    accent: {
      bg: 'bg-accent-yellow',
      text: 'text-white',
      border: 'border-accent-yellow',
      outlineText: 'text-accent-yellow',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const color = variantColors[variant];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-full
        transition-all duration-200
        ${sizeClasses[size]}
        ${outline 
          ? `bg-transparent border-2 ${color.border} ${color.outlineText}`
          : `${color.bg} ${color.text}`
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;