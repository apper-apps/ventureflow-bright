import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const NavItem = ({ 
  to, 
  icon, 
  label, 
  badge,
  collapsed = false,
  onClick
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
          isActive
            ? 'bg-gradient-primary text-white shadow-premium'
            : 'text-gray-600 hover:text-primary hover:bg-gradient-card'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon name={icon} size={20} className="flex-shrink-0" />
          
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1"
            >
              {label}
            </motion.span>
          )}
          
          {badge && !collapsed && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2 py-0.5 text-xs rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {badge}
            </motion.span>
          )}
          
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-secondary text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {label}
              {badge && <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{badge}</span>}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavItem;