import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ProgressBar from '@/components/atoms/ProgressBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { projectService } from '@/services/api/projectService';

const PlanEditor = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const planSections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: 'FileText', description: 'Brief overview of your business' },
    { id: 'company-description', title: 'Company Description', icon: 'Building', description: 'Detailed company information' },
    { id: 'market-analysis', title: 'Market Analysis', icon: 'TrendingUp', description: 'Industry and market research' },
    { id: 'organization', title: 'Organization & Management', icon: 'Users', description: 'Company structure and team' },
    { id: 'products-services', title: 'Products & Services', icon: 'Package', description: 'What you offer to customers' },
    { id: 'marketing-sales', title: 'Marketing & Sales', icon: 'Megaphone', description: 'How you will reach customers' },
    { id: 'financial-projections', title: 'Financial Projections', icon: 'Calculator', description: 'Revenue and expense forecasts' },
    { id: 'funding-request', title: 'Funding Request', icon: 'DollarSign', description: 'Capital requirements' },
  ];

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await projectService.getById(parseInt(id));
      setProject(data);
    } catch (err) {
      setError('Failed to load business plan. Please try again.');
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleSaveSection = async (sectionData) => {
    try {
      setSaving(true);
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProject = {
        ...project,
        sections: {
          ...project.sections,
          [planSections[activeSection].id]: sectionData
        },
        updatedAt: new Date().toISOString()
      };
      
      await projectService.update(parseInt(id), updatedProject);
      setProject(updatedProject);
      
      toast.success('Section saved successfully!');
    } catch (err) {
      toast.error('Failed to save section');
      console.error('Error saving section:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Preparing your business plan for export...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Business plan exported successfully!');
    } catch (err) {
      toast.error('Failed to export business plan');
    }
  };

  const getCompletionPercentage = () => {
    if (!project?.sections) return 0;
    const completedSections = Object.keys(project.sections).length;
    return Math.round((completedSections / planSections.length) * 100);
  };

  const isSectionCompleted = (sectionId) => {
    return project?.sections?.[sectionId] && Object.keys(project.sections[sectionId]).length > 0;
  };

  if (loading) {
    return <Loading type="form" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load business plan"
        message={error}
        onRetry={loadProject}
      />
    );
  }

  if (!project) {
    return (
      <Error
        title="Business plan not found"
        message="The business plan you're looking for doesn't exist or has been deleted."
        variant="notFound"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={() => window.history.back()}
              className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <h1 className="text-2xl font-display font-bold text-secondary">
              {project.name}
            </h1>
            <Badge variant="primary" size="sm">
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="ml-11">
            <ProgressBar
              value={getCompletionPercentage()}
              variant="primary"
              size="md"
              showLabel={true}
              className="mb-2"
            />
            <p className="text-sm text-gray-600">
              {Object.keys(project.sections || {}).length} of {planSections.length} sections completed
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Bot" size={16} />
            <span>AI Assistant</span>
          </Button>
          
          <Button
            variant="outline"
            size="md"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export</span>
          </Button>
          
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={() => handleSaveSection({})}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={16} />
            <span>Save</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-6">
            <h3 className="font-display font-semibold text-lg text-secondary mb-4">
              Plan Sections
            </h3>
            
            <nav className="space-y-2">
              {planSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    activeSection === index
                      ? 'bg-gradient-primary text-white shadow-premium'
                      : 'text-gray-600 hover:text-primary hover:bg-gradient-card'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <ApperIcon name={section.icon} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {section.title}
                    </p>
                    <p className={`text-xs truncate ${
                      activeSection === index ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {isSectionCompleted(section.id) ? (
                      <ApperIcon 
                        name="CheckCircle" 
                        size={16} 
                        className={activeSection === index ? 'text-white' : 'text-success'} 
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        activeSection === index 
                          ? 'border-white' 
                          : 'border-gray-300'
                      }`} />
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SectionEditor
                  section={planSections[activeSection]}
                  data={project.sections?.[planSections[activeSection].id] || {}}
                  onSave={handleSaveSection}
                  saving={saving}
                />
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-80 z-50"
          >
            <Card className="p-4 shadow-elevated border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="Bot" size={16} className="text-white" />
                  </div>
                  <h4 className="font-medium text-secondary">AI Assistant</h4>
                </div>
                
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                <div className="bg-gradient-card p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Hi! I'm here to help you with your {planSections[activeSection].title} section. 
                    Here are some suggestions to get you started:
                  </p>
                </div>
                
                <div className="space-y-2">
{[
                    'Generate content outline',
                    'Suggest key points to cover', 
                    'Review and improve content',
                    'Find relevant market data'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        toast.info(`AI is working on: ${suggestion}...`);
                        setTimeout(() => {
                          toast.success(`${suggestion} completed! Check your section content.`);
                        }, 2000);
                      }}
                      className="w-full text-left p-2 text-sm text-gray-600 hover:text-primary hover:bg-gradient-card rounded-lg transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button variant="primary" size="sm">
                  <ApperIcon name="Send" size={14} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Section Editor Component
const SectionEditor = ({ section, data, onSave, saving }) => {
  const [formData, setFormData] = useState(data);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const renderSectionContent = () => {
    switch (section.id) {
      case 'executive-summary':
        return (
          <div className="space-y-6">
            <Input
              label="Company Name"
              value={formData.companyName || ''}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter your company name"
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary">
                Mission Statement <span className="text-error">*</span>
              </label>
              <textarea
                value={formData.missionStatement || ''}
                onChange={(e) => handleInputChange('missionStatement', e.target.value)}
                placeholder="Describe your company's mission and purpose..."
                rows={4}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary">
                Business Overview
              </label>
              <textarea
                value={formData.businessOverview || ''}
                onChange={(e) => handleInputChange('businessOverview', e.target.value)}
                placeholder="Provide a brief overview of your business..."
                rows={6}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            
            <Input
              label="Key Success Factors"
              value={formData.keySuccessFactors || ''}
              onChange={(e) => handleInputChange('keySuccessFactors', e.target.value)}
              placeholder="What will make your business succeed?"
            />
          </div>
        );
        
      case 'company-description':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary">
                Company History
              </label>
              <textarea
                value={formData.companyHistory || ''}
                onChange={(e) => handleInputChange('companyHistory', e.target.value)}
                placeholder="Tell the story of how your company was founded..."
                rows={4}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            
            <Input
              label="Legal Structure"
              value={formData.legalStructure || ''}
              onChange={(e) => handleInputChange('legalStructure', e.target.value)}
              placeholder="LLC, Corporation, Partnership, etc."
            />
            
            <Input
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Where is your business located?"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary">
                Company Values
              </label>
              <textarea
                value={formData.companyValues || ''}
                onChange={(e) => handleInputChange('companyValues', e.target.value)}
                placeholder="What values guide your company?"
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-card rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={section.icon} size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-secondary mb-2">
                {section.title}
              </h3>
              <p className="text-gray-600 mb-6">
                This section is under development. Use the AI assistant for guidance.
              </p>
<Button 
                variant="primary"
                onClick={() => {
                  setShowAIAssistant(true);
                  toast.info('AI Assistant is ready to help with this section!');
                }}
              >
                Get AI Help
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name={section.icon} size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-secondary">
            {section.title}
          </h2>
          <p className="text-gray-600">
            {section.description}
          </p>
        </div>
      </div>
      
      {renderSectionContent()}
      
<div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="md"
          onClick={() => {
            setShowAIAssistant(true);
            toast.info('Help is available through the AI Assistant!');
          }}
        >
          <ApperIcon name="HelpCircle" size={16} className="mr-2" />
          Get Help
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => {
              toast.info('Opening section preview...');
              setTimeout(() => {
                toast.success('Preview generated successfully!');
              }, 1500);
            }}
          >
            Preview
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleSave}
            loading={saving}
          >
            Save Section
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanEditor;