import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-premium hover:shadow-elevated focus:ring-primary/50 hover:scale-[1.02]',
    secondary: 'bg-white text-secondary border border-gray-200 shadow-card hover:bg-gray-50 hover:shadow-premium focus:ring-primary/50 hover:scale-[1.02]',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 hover:scale-[1.02]',
    ghost: 'text-secondary hover:bg-gray-100 focus:ring-primary/50 hover:scale-[1.02]',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white shadow-premium hover:shadow-elevated focus:ring-error/50 hover:scale-[1.02]',
    success: 'bg-gradient-to-r from-success to-green-600 text-white shadow-premium hover:shadow-elevated focus:ring-success/50 hover:scale-[1.02]',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;