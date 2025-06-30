import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { analyticsService } from '@/services/api/analyticsService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      const data = await analyticsService.getAnalytics(timeRange);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  const projectProgressChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
    },
    colors: ['#5B4FE5', '#00D4AA', '#F59E0B', '#EF4444'],
    labels: ['Completed', 'In Progress', 'Draft', 'On Hold'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Projects',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1E1B3A',
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const validationScoreChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#5B4FE5'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
        }
      }
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
    }
  };

  const revenueProjectionChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    colors: ['#00D4AA', '#5B4FE5'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
        },
        formatter: function (val) {
          return '$' + val + 'K';
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$' + val + 'K';
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3,
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load analytics"
        message={error}
        onRetry={loadAnalytics}
      />
    );
  }

  if (!analytics || analytics.totalProjects === 0) {
    return (
      <Empty
        variant="analytics"
        title="No analytics data available"
        description="Complete more sections of your business plans to see detailed analytics and insights."
        onAction={() => window.location.href = '/'}
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track your business planning progress and insights.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === option.value
                    ? 'bg-gradient-primary text-white'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="md"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={analytics.totalProjects}
          change="+12%"
          changeType="positive"
          icon="FolderOpen"
          trend={[20, 25, 30, 28, 35, 40, 45]}
        />
        <MetricCard
          title="Avg. Completion"
          value={`${analytics.avgCompletion}%`}
          change="+8%"
          changeType="positive"
          icon="TrendingUp"
          trend={[60, 65, 68, 72, 75, 78, 82]}
        />
        <MetricCard
          title="Validation Score"
          value={analytics.avgValidationScore}
          change="+5%"
          changeType="positive"
          icon="CheckCircle"
          trend={[70, 72, 75, 78, 80, 82, 85]}
        />
        <MetricCard
          title="Projected Revenue"
          value={`$${analytics.totalProjectedRevenue}K`}
          change="+15%"
          changeType="positive"
          icon="DollarSign"
          gradient={true}
          trend={[100, 120, 140, 160, 180, 200, 250]}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-secondary">
              Project Status Distribution
            </h3>
            <Badge variant="info" size="sm">
              {analytics.totalProjects} total
            </Badge>
          </div>
          
          <Chart
            options={projectProgressChartOptions}
            series={analytics.projectStatusData}
            type="donut"
            height={300}
          />
        </Card>

        {/* Validation Score Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-secondary">
              Validation Score Trends
            </h3>
            <Badge variant="success" size="sm">
              +12% this month
            </Badge>
          </div>
          
          <Chart
            options={validationScoreChartOptions}
            series={[{
              name: 'Average Score',
              data: analytics.validationTrendData
            }]}
            type="area"
            height={300}
          />
        </Card>
      </div>

      {/* Revenue Projections */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-lg text-secondary">
            Revenue Projections by Month
          </h3>
          <div className="flex items-center space-x-4">
            <Badge variant="primary" size="sm">
              Projected: ${analytics.totalProjectedRevenue}K
            </Badge>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
        
        <Chart
          options={revenueProjectionChartOptions}
          series={[
            {
              name: 'Conservative',
              data: analytics.revenueProjectionData.conservative
            },
            {
              name: 'Optimistic',
              data: analytics.revenueProjectionData.optimistic
            }
          ]}
          type="bar"
          height={350}
        />
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <Card className="p-6">
          <h3 className="font-display font-semibold text-lg text-secondary mb-4 flex items-center">
            <ApperIcon name="Lightbulb" size={20} className="mr-2 text-warning" />
            Key Insights
          </h3>
          
          <div className="space-y-4">
            {analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gradient-card rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  insight.type === 'positive' ? 'bg-success/10 text-success' : 
                  insight.type === 'warning' ? 'bg-warning/10 text-warning' : 
                  'bg-info/10 text-info'
                }`}>
                  <ApperIcon 
                    name={insight.type === 'positive' ? 'TrendingUp' : 
                          insight.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                    size={16} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary mb-1">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
          <h3 className="font-display font-semibold text-lg text-secondary mb-4 flex items-center">
            <ApperIcon name="Target" size={20} className="mr-2 text-primary" />
            Recommendations
          </h3>
          
          <div className="space-y-4">
            {analytics.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border border-gray-200 rounded-lg hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-secondary">
                    {rec.title}
                  </p>
                  <Badge 
                    variant={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'} 
                    size="sm"
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {rec.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = rec.actionUrl}
                >
                  {rec.actionText}
                  <ApperIcon name="ArrowRight" size={12} className="ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Analytics;