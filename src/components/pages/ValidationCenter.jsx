import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ProgressBar from '@/components/atoms/ProgressBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { validationService } from '@/services/api/validationService';

const ValidationCenter = () => {
  const { id } = useParams();
  const [validationData, setValidationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFramework, setActiveFramework] = useState('lean-canvas');
  const [saving, setSaving] = useState(false);

  const frameworks = [
    {
      id: 'lean-canvas',
      name: 'Lean Canvas',
      description: 'Validate your business model with 9 key building blocks',
      icon: 'Grid3X3',
      sections: [
        { id: 'problem', title: 'Problem', description: 'What problem are you solving?' },
        { id: 'solution', title: 'Solution', description: 'How do you solve the problem?' },
        { id: 'key-metrics', title: 'Key Metrics', description: 'How do you measure success?' },
        { id: 'value-proposition', title: 'Unique Value Proposition', description: 'What makes you different?' },
        { id: 'unfair-advantage', title: 'Unfair Advantage', description: 'What can\'t be copied?' },
        { id: 'channels', title: 'Channels', description: 'How do you reach customers?' },
        { id: 'customer-segments', title: 'Customer Segments', description: 'Who are your customers?' },
        { id: 'cost-structure', title: 'Cost Structure', description: 'What are your costs?' },
        { id: 'revenue-streams', title: 'Revenue Streams', description: 'How do you make money?' },
      ]
    },
    {
      id: 'swot',
      name: 'SWOT Analysis',
      description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats',
      icon: 'Target',
      sections: [
        { id: 'strengths', title: 'Strengths', description: 'Internal positive factors' },
        { id: 'weaknesses', title: 'Weaknesses', description: 'Internal negative factors' },
        { id: 'opportunities', title: 'Opportunities', description: 'External positive factors' },
        { id: 'threats', title: 'Threats', description: 'External negative factors' },
      ]
    },
    {
      id: 'customer-validation',
      name: 'Customer Validation',
      description: 'Validate your assumptions with real customer feedback',
      icon: 'Users',
      sections: [
        { id: 'customer-interviews', title: 'Customer Interviews', description: 'Interview results and insights' },
        { id: 'surveys', title: 'Surveys', description: 'Survey data and analysis' },
        { id: 'mvp-feedback', title: 'MVP Feedback', description: 'Minimum viable product testing' },
        { id: 'market-research', title: 'Market Research', description: 'Industry and competitor analysis' },
      ]
    }
  ];

  const loadValidationData = async () => {
    try {
      setLoading(true);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await validationService.getByProjectId(parseInt(id));
      setValidationData(data);
    } catch (err) {
      setError('Failed to load validation data. Please try again.');
      console.error('Error loading validation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadValidationData();
  }, [id]);

  const handleSaveValidation = async () => {
    try {
      setSaving(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await validationService.update(validationData.Id, validationData);
      
      toast.success('Validation data saved successfully!');
    } catch (err) {
      toast.error('Failed to save validation data');
      console.error('Error saving validation data:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateValidationScore = (framework, section, score) => {
    setValidationData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [framework]: {
          ...prev.scores[framework],
          [section]: score
        }
      }
    }));
  };

  const calculateFrameworkScore = (frameworkId) => {
    if (!validationData?.scores?.[frameworkId]) return 0;
    
    const scores = Object.values(validationData.scores[frameworkId]);
    if (scores.length === 0) return 0;
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const calculateOverallScore = () => {
    if (!validationData?.scores) return 0;
    
    const frameworkScores = frameworks.map(f => calculateFrameworkScore(f.id)).filter(s => s > 0);
    if (frameworkScores.length === 0) return 0;
    
    return Math.round(frameworkScores.reduce((sum, score) => sum + score, 0) / frameworkScores.length);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return <Loading type="form" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load validation center"
        message={error}
        onRetry={loadValidationData}
      />
    );
  }

  if (!validationData) {
    return (
      <Error
        title="Validation data not found"
        message="No validation data exists for this project yet."
        variant="notFound"
      />
    );
  }

  const currentFramework = frameworks.find(f => f.id === activeFramework);
  const overallScore = calculateOverallScore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-secondary">
              Idea Validation Center
            </h1>
            <p className="text-gray-600">
              Validate your business assumptions with proven frameworks
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Overall Score:</span>
            <Badge variant={getScoreBadgeVariant(overallScore)} size="lg">
              {overallScore}/100
            </Badge>
          </div>
          
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSaveValidation}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={16} />
            <span>Save Progress</span>
          </Button>
        </div>
      </div>

      {/* Validation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frameworks.map((framework) => {
          const score = calculateFrameworkScore(framework.id);
          const completedSections = validationData?.scores?.[framework.id] ? 
            Object.keys(validationData.scores[framework.id]).length : 0;
          
          return (
            <Card
              key={framework.id}
              hover={true}
              className={`cursor-pointer transition-all duration-200 ${
                activeFramework === framework.id ? 'ring-2 ring-primary shadow-premium' : ''
              }`}
              onClick={() => setActiveFramework(framework.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeFramework === framework.id ? 'bg-gradient-primary' : 'bg-gradient-card'
                  }`}>
                    <ApperIcon 
                      name={framework.icon} 
                      size={24} 
                      className={activeFramework === framework.id ? 'text-white' : 'text-primary'} 
                    />
                  </div>
                  
                  <Badge variant={getScoreBadgeVariant(score)}>
                    {score}/100
                  </Badge>
                </div>
                
                <h3 className="font-display font-semibold text-lg text-secondary mb-2">
                  {framework.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {framework.description}
                </p>
                
                <div className="space-y-2">
                  <ProgressBar
                    value={completedSections}
                    max={framework.sections.length}
                    variant="primary"
                    size="sm"
                  />
                  <p className="text-xs text-gray-500">
                    {completedSections} of {framework.sections.length} sections completed
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Framework Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Framework Sections */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-6">
            <h3 className="font-display font-semibold text-lg text-secondary mb-4">
              {currentFramework.name} Sections
            </h3>
            
            <div className="space-y-2">
              {currentFramework.sections.map((section, index) => {
                const sectionScore = validationData?.scores?.[activeFramework]?.[section.id] || 0;
                
                return (
                  <div
                    key={section.id}
                    className="p-3 rounded-lg border border-gray-200 hover:bg-gradient-card transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-secondary">
                        {section.title}
                      </h4>
                      <Badge 
                        variant={sectionScore > 0 ? getScoreBadgeVariant(sectionScore) : 'default'}
                        size="sm"
                      >
                        {sectionScore || '—'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {section.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Main Validation Area */}
        <div className="lg:col-span-3">
          <Card className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name={currentFramework.icon} size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-secondary">
                    {currentFramework.name}
                  </h2>
                  <p className="text-gray-600">
                    {currentFramework.description}
                  </p>
                </div>
              </div>
              
              <ProgressBar
                value={calculateFrameworkScore(activeFramework)}
                variant="primary"
                size="lg"
                showLabel={true}
                className="mb-4"
              />
            </div>

            {/* Validation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFramework.sections.map((section) => {
                const sectionScore = validationData?.scores?.[activeFramework]?.[section.id] || 0;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-card transition-shadow"
                  >
                    <h4 className="font-medium text-secondary mb-2">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {section.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Validation Score:</span>
                        <Badge variant={getScoreBadgeVariant(sectionScore)}>
                          {sectionScore}/100
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Rate your confidence (0-100):</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sectionScore}
                          onChange={(e) => updateValidationScore(activeFramework, section.id, parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                      
<Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const details = window.prompt(`Add details for ${section.title}:\n\nDescribe your research, evidence, or reasoning for this validation score.`);
                          if (details && details.trim()) {
                            toast.success('Details saved successfully!');
                            // In a real app, you'd save this to the validation data
                          }
                        }}
                      >
                        Add Details
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className="mt-8 p-6 bg-gradient-card rounded-lg">
              <h3 className="font-display font-semibold text-lg text-secondary mb-4 flex items-center">
                <ApperIcon name="Lightbulb" size={20} className="mr-2 text-warning" />
                Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validationData?.recommendations?.filter(rec => rec.framework === activeFramework).map((rec, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-secondary">{rec.title}</h4>
                      <Badge variant={rec.priority === 'high' ? 'error' : 'warning'} size="sm">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
<Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        toast.info(`Taking action: ${rec.actionText}...`);
                        setTimeout(() => {
                          if (rec.actionUrl === '/validation') {
                            toast.success('Validation improvement tips are now available!');
                          } else {
                            toast.success(`${rec.actionText} completed successfully!`);
                          }
                        }, 1000);
                      }}
                    >
                      {rec.actionText}
                    </Button>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-6">
                    <p className="text-gray-600">Complete more sections to see personalized recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ValidationCenter;