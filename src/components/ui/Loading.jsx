import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'dashboard' }) => {
  const renderDashboardSkeleton = () => (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="shimmer h-8 w-64 rounded-lg"></div>
          <div className="shimmer h-4 w-96 rounded-md"></div>
        </div>
        <div className="shimmer h-10 w-32 rounded-lg"></div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="shimmer h-5 w-20 rounded-md"></div>
              <div className="shimmer h-8 w-8 rounded-lg"></div>
            </div>
            <div className="shimmer h-8 w-16 rounded-md mb-2"></div>
            <div className="shimmer h-3 w-24 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="shimmer h-6 w-32 rounded-md"></div>
              <div className="shimmer h-8 w-8 rounded-full"></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="shimmer h-4 w-full rounded-md"></div>
              <div className="shimmer h-4 w-3/4 rounded-md"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="shimmer h-4 w-20 rounded-md"></div>
              <div className="shimmer h-2 w-24 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-card">
      <div className="animate-pulse space-y-4">
        <div className="shimmer h-6 w-3/4 rounded-md"></div>
        <div className="space-y-2">
          <div className="shimmer h-4 w-full rounded-md"></div>
          <div className="shimmer h-4 w-5/6 rounded-md"></div>
          <div className="shimmer h-4 w-4/6 rounded-md"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="shimmer h-4 w-20 rounded-md"></div>
          <div className="shimmer h-8 w-24 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="shimmer h-6 w-48 rounded-md"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="shimmer h-10 w-10 rounded-full"></div>
              <div className="space-y-2">
                <div className="shimmer h-4 w-32 rounded-md"></div>
                <div className="shimmer h-3 w-24 rounded-md"></div>
              </div>
            </div>
            <div className="shimmer h-8 w-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="bg-white p-8 rounded-xl shadow-card space-y-6">
      <div className="shimmer h-8 w-64 rounded-md"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="shimmer h-4 w-24 rounded-md"></div>
            <div className="shimmer h-10 w-full rounded-lg"></div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="shimmer h-4 w-32 rounded-md"></div>
        <div className="shimmer h-24 w-full rounded-lg"></div>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <div className="shimmer h-10 w-24 rounded-lg"></div>
        <div className="shimmer h-10 w-32 rounded-lg"></div>
      </div>
    </div>
  );

  const skeletonComponents = {
    dashboard: renderDashboardSkeleton,
    card: renderCardSkeleton,
    table: renderTableSkeleton,
    form: renderFormSkeleton,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      {skeletonComponents[type] || renderDashboardSkeleton()}
    </motion.div>
  );
};

export default Loading;