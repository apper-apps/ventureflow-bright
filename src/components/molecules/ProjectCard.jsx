import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ProgressBar from '@/components/atoms/ProgressBar';
import { formatDistanceToNow } from 'date-fns';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'draft':
        return 'Edit';
      default:
        return 'Circle';
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/plans/${project.Id}/edit`);
  };

  const handleCardClick = () => {
    navigate(`/plans/${project.Id}/edit`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        hover={true}
        className="cursor-pointer relative group"
        onClick={handleCardClick}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant={getStatusVariant(project.status)} size="sm">
            <ApperIcon name={getStatusIcon(project.status)} size={12} className="mr-1" />
            {project.status.replace('-', ' ')}
          </Badge>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Edit" size={16} />
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-4">
          <h3 className="font-display font-semibold text-lg text-secondary mb-2 line-clamp-2">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar
            value={project.completionPercentage}
            variant="primary"
            size="sm"
            showLabel={false}
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{project.completedSections} of {project.totalSections} sections</span>
            <span>{project.completionPercentage}% complete</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gradient-card rounded-lg">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">{project.validationScore}/100</p>
            <p className="text-xs text-gray-600">Validation Score</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-accent">${project.projectedRevenue}K</p>
            <p className="text-xs text-gray-600">Projected Revenue</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={12} />
            <span>Updated {formatDistanceToNow(new Date(project.updatedAt))} ago</span>
          </span>
          
          <div className="flex items-center space-x-2">
            {project.hasFinancialModel && (
              <div className="w-2 h-2 bg-success rounded-full" title="Financial model complete" />
            )}
            {project.hasValidation && (
              <div className="w-2 h-2 bg-info rounded-full" title="Validation complete" />
            )}
            {project.isExported && (
              <div className="w-2 h-2 bg-warning rounded-full" title="Recently exported" />
            )}
          </div>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity rounded-xl pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export default ProjectCard;