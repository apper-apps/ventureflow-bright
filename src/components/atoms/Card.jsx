import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  };

  const baseClasses = `
    bg-white rounded-xl shadow-card transition-all duration-200
    ${hover ? 'hover:shadow-premium hover:scale-[1.02]' : ''}
    ${gradient ? 'bg-gradient-card backdrop-blur-sm' : ''}
    ${paddingClasses[padding]}
    ${className}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;