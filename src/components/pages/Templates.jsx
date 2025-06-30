import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { templateService } from '@/services/api/templateService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await templateService.getAll();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCreateFromTemplate = async (template) => {
    try {
      toast.success(`Creating new project from ${template.name}...`);
      // Simulate project creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error('Failed to create project from template');
    }
  };

  const handleSearch = (searchTerm) => {
    let filtered = templates;
    
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    setFilteredTemplates(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    let filtered = templates;
    
    if (category !== 'all') {
      filtered = filtered.filter(template => template.category === category);
    }
    
    setFilteredTemplates(filtered);
  };

  const categories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'tech', label: 'Technology', count: templates.filter(t => t.category === 'tech').length },
    { id: 'retail', label: 'Retail', count: templates.filter(t => t.category === 'retail').length },
    { id: 'service', label: 'Service', count: templates.filter(t => t.category === 'service').length },
    { id: 'manufacturing', label: 'Manufacturing', count: templates.filter(t => t.category === 'manufacturing').length },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTemplateIcon = (category) => {
    switch (category) {
      case 'tech':
        return 'Laptop';
      case 'retail':
        return 'ShoppingBag';
      case 'service':
        return 'Users';
      case 'manufacturing':
        return 'Factory';
      default:
        return 'FileText';
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load templates"
        message={error}
        onRetry={loadTemplates}
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
            Business Plan Templates
          </h1>
          <p className="text-gray-600 text-lg">
            Choose from professionally crafted templates to jumpstart your business planning.
          </p>
        </div>
        
        <Button
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Upload" size={20} />
          <span>Import Template</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="w-full lg:w-96">
          <SearchBar
            placeholder="Search templates..."
            onSearch={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-primary text-white shadow-premium'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow-card'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Templates */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-semibold text-secondary flex items-center">
          <ApperIcon name="Star" size={20} className="mr-2 text-warning" />
          Featured Templates
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.filter(t => t.featured).map((template) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <Card hover={true} className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="warning" size="sm">
                    <ApperIcon name="Star" size={12} className="mr-1" />
                    Featured
                  </Badge>
                </div>
                
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name={getTemplateIcon(template.category)} size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg text-secondary mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getDifficultyColor(template.difficulty)} size="sm">
                      {template.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{template.sections} sections</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ApperIcon name="Users" size={14} />
                    <span>{template.usageCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Estimated time: {template.estimatedTime}
                  </div>
                  
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleCreateFromTemplate(template)}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="ArrowRight" size={16} />
                    <span>Use Template</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-semibold text-secondary">
          All Templates ({filteredTemplates.length})
        </h2>
        
        {filteredTemplates.length === 0 ? (
          <Empty
            variant="templates"
            title="No templates found"
            description="Try adjusting your search or filter criteria to find relevant templates."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card hover={true} className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-card rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={getTemplateIcon(template.category)} 
                        size={20} 
                        className="text-primary" 
                      />
                    </div>
                    
                    {template.featured && (
                      <Badge variant="warning" size="sm">
                        <ApperIcon name="Star" size={12} className="mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="font-display font-semibold text-lg text-secondary">
                      {template.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant={getDifficultyColor(template.difficulty)} size="sm">
                        {template.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {template.sections} sections
                      </span>
                      <span className="text-xs text-gray-500">
                        {template.estimatedTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ApperIcon name="Users" size={14} />
                      <span>{template.usageCount} used</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateFromTemplate(template)}
                      className="flex items-center space-x-1"
                    >
                      <ApperIcon name="Plus" size={14} />
                      <span>Use</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Templates;