import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  variant = "default"
}) => {
  const getErrorIcon = () => {
    switch (variant) {
      case 'network':
        return 'WifiOff';
      case 'notFound':
        return 'Search';
      case 'permission':
        return 'Lock';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorColor = () => {
    switch (variant) {
      case 'network':
        return 'text-orange-500';
      case 'notFound':
        return 'text-blue-500';
      case 'permission':
        return 'text-red-500';
      default:
        return 'text-error';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center mb-6 ${getErrorColor()}`}
      >
        <ApperIcon name={getErrorIcon()} size={32} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-display font-semibold text-secondary mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {message}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-4"
        >
          <Button
            onClick={onRetry}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            <span>Refresh Page</span>
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-sm text-gray-500"
      >
        <p>Need help? <a href="#" className="text-primary hover:text-primary/80 underline">Contact support</a></p>
      </motion.div>
    </motion.div>
  );
};

export default Error;