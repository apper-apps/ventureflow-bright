import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const MetricCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  gradient = false,
  trend,
}) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-gray-500',
  };

  const changeIcon = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus',
  };

  return (
    <Card 
      hover={true} 
      gradient={gradient}
      className="relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && (
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} size={20} className="text-white" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gradient"
        >
          {value}
        </motion.p>
        
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${changeColor[changeType]}`}>
            <ApperIcon name={changeIcon[changeType]} size={16} />
            <span className="font-medium">{change}</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 h-12">
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <defs>
              <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5B4FE5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#trendGradient)"
              strokeWidth="2"
              points={trend.map((point, index) => `${index * (100 / (trend.length - 1))},${30 - (point / Math.max(...trend)) * 25}`).join(' ')}
            />
          </svg>
        </div>
      )}
    </Card>
  );
};

export default MetricCard;