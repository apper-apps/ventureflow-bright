import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MetricCard from '@/components/molecules/MetricCard';
import ProjectCard from '@/components/molecules/ProjectCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { projectService } from '@/services/api/projectService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = await projectService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

const handleCreateProject = () => {
    toast.success('Redirecting to templates...');
    // Navigate to templates page
    window.location.href = '/templates';
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const calculateMetrics = () => {
    if (projects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        avgCompletion: 0,
        totalRevenue: 0
      };
    }

    const activeProjects = projects.filter(p => p.status !== 'completed').length;
    const avgCompletion = Math.round(
      projects.reduce((sum, p) => sum + p.completionPercentage, 0) / projects.length
    );
    const totalRevenue = projects.reduce((sum, p) => sum + (p.projectedRevenue || 0), 0);

    return {
      totalProjects: projects.length,
      activeProjects,
      avgCompletion,
      totalRevenue: Math.round(totalRevenue)
    };
  };

  const metrics = calculateMetrics();

  const searchFilters = [
    { id: 'draft', label: 'Draft' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'high-score', label: 'High Validation Score' },
  ];

  const handleFilter = (activeFilters) => {
    let filtered = projects;

    if (activeFilters.includes('draft')) {
      filtered = filtered.filter(p => p.status === 'draft');
    }
    if (activeFilters.includes('in-progress')) {
      filtered = filtered.filter(p => p.status === 'in-progress');
    }
    if (activeFilters.includes('completed')) {
      filtered = filtered.filter(p => p.status === 'completed');
    }
    if (activeFilters.includes('high-score')) {
      filtered = filtered.filter(p => p.validationScore >= 80);
    }

    // Apply search term to filtered results
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load dashboard"
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Let's continue building your business success story.
          </p>
        </div>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateProject}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>New Business Plan</span>
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={metrics.totalProjects}
          icon="FolderOpen"
          change="+2 this month"
          changeType="positive"
        />
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          icon="Clock"
          change="+1 this week"
          changeType="positive"
        />
        <MetricCard
          title="Avg. Completion"
          value={`${metrics.avgCompletion}%`}
          icon="TrendingUp"
          change="+12% this month"
          changeType="positive"
        />
        <MetricCard
          title="Projected Revenue"
          value={`$${metrics.totalRevenue}K`}
          icon="DollarSign"
          change="+8% this month"
          changeType="positive"
          gradient={true}
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-lg text-secondary mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateProject}
            className="flex items-center space-x-3 p-4 bg-gradient-card rounded-lg hover:shadow-premium transition-all duration-200 hover:scale-[1.02] text-left"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-secondary">Start New Plan</p>
              <p className="text-sm text-gray-600">Create from template</p>
            </div>
          </button>
          
<button 
            onClick={() => {
              if (projects.length > 0) {
                window.location.href = `/financial-modeler/${projects[0].Id}`;
              } else {
                toast.info('Create a project first to access financial modeling!');
                setTimeout(() => window.location.href = '/templates', 1000);
              }
            }}
            className="flex items-center space-x-3 p-4 bg-gradient-card rounded-lg hover:shadow-premium transition-all duration-200 hover:scale-[1.02] text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calculator" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-secondary">Financial Model</p>
              <p className="text-sm text-gray-600">Build projections</p>
            </div>
          </button>
          
<button 
            onClick={() => {
              if (projects.length > 0) {
                window.location.href = `/validation-center/${projects[0].Id}`;
              } else {
                toast.info('Create a project first to access idea validation!');
                setTimeout(() => window.location.href = '/templates', 1000);
              }
            }}
            className="flex items-center space-x-3 p-4 bg-gradient-card rounded-lg hover:shadow-premium transition-all duration-200 hover:scale-[1.02] text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-warning to-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-secondary">Validate Ideas</p>
              <p className="text-sm text-gray-600">Test assumptions</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-2xl font-display font-semibold text-secondary">
            Your Business Plans
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="w-80">
              <SearchBar
                placeholder="Search projects..."
                onSearch={handleSearch}
                onFilter={handleFilter}
                filters={searchFilters}
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Empty
            variant="projects"
            onAction={handleCreateProject}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-lg text-secondary mb-4 flex items-center">
          <ApperIcon name="Activity" size={20} className="mr-2 text-primary" />
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          {[
            { action: 'Created new business plan', item: 'E-commerce Platform', time: '2 hours ago', icon: 'Plus', color: 'text-success' },
            { action: 'Completed financial model', item: 'Tech Startup', time: '1 day ago', icon: 'Calculator', color: 'text-primary' },
            { action: 'Updated validation score', item: 'Restaurant Chain', time: '2 days ago', icon: 'CheckCircle', color: 'text-accent' },
            { action: 'Exported business plan', item: 'SaaS Product', time: '3 days ago', icon: 'Download', color: 'text-warning' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 hover:bg-gradient-card rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                <ApperIcon name={activity.icon} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-secondary">
                  {activity.action} <span className="font-normal">"{activity.item}"</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;