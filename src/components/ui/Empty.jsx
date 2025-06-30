import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item.",
  icon = "Plus",
  actionText = "Get Started",
  onAction,
  variant = "default"
}) => {
  const getEmptyConfig = () => {
    switch (variant) {
      case 'projects':
        return {
          icon: 'FolderPlus',
          title: 'No business plans yet',
          description: 'Create your first business plan to start validating and developing your ideas.',
          actionText: 'Create New Plan',
          gradient: 'from-blue-50 to-indigo-50',
          iconColor: 'text-blue-500'
        };
      case 'templates':
        return {
          icon: 'FileText',
          title: 'No templates available',
          description: 'Browse our collection of business plan templates to get started quickly.',
          actionText: 'Browse Templates',
          gradient: 'from-green-50 to-emerald-50',
          iconColor: 'text-green-500'
        };
      case 'analytics':
        return {
          icon: 'BarChart3',
          title: 'No analytics data',
          description: 'Complete more sections of your business plan to see detailed analytics.',
          actionText: 'Continue Planning',
          gradient: 'from-purple-50 to-pink-50',
          iconColor: 'text-purple-500'
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionText: 'Clear Filters',
          gradient: 'from-gray-50 to-slate-50',
          iconColor: 'text-gray-500'
        };
      default:
        return {
          icon: icon,
          title: title,
          description: description,
          actionText: actionText,
          gradient: 'from-gray-50 to-slate-50',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-6 ${config.iconColor}`}
      >
        <ApperIcon name={config.icon} size={40} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-display font-semibold text-secondary mb-3"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed text-lg"
      >
        {config.description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            className="flex items-center space-x-2 shadow-premium hover:shadow-elevated transition-all duration-200"
          >
            <ApperIcon name={config.icon} size={20} />
            <span>{config.actionText}</span>
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl"
      >
        {variant === 'projects' && (
          <>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Lightbulb" size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm text-secondary mb-1">Validate Ideas</h4>
              <p className="text-xs text-gray-600">Test your business concepts with proven frameworks</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Calculator" size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-sm text-secondary mb-1">Financial Modeling</h4>
              <p className="text-xs text-gray-600">Create detailed financial projections and scenarios</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-sm text-secondary mb-1">Collaborate</h4>
              <p className="text-xs text-gray-600">Work with your team to refine your business plan</p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Empty;