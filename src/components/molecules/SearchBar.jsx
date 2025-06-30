import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onFilter,
  filters = [],
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" size={18} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
        />
        
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Filter" size={18} />
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filterId => {
            const filter = filters.find(f => f.id === filterId);
            return (
              <motion.div
                key={filterId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-primary text-white text-sm rounded-full"
              >
                <span>{filter?.label}</span>
                <button
                  onClick={() => handleFilterToggle(filterId)}
                  className="ml-1 hover:text-gray-200"
                >
                  <ApperIcon name="X" size={14} />
                </button>
              </motion.div>
            );
          })}
          
          <button
            onClick={() => {
              setActiveFilters([]);
              onFilter?.([]);
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-card space-y-3"
        >
          <h4 className="font-medium text-secondary mb-3">Filter by:</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filters.map(filter => (
              <label
                key={filter.id}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.includes(filter.id)}
                  onChange={() => handleFilterToggle(filter.id)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
                />
                <span className="text-sm text-gray-700">{filter.label}</span>
              </label>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;