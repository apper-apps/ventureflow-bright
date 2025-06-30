import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { financialService } from '@/services/api/financialService';

const FinancialModeler = () => {
  const { id } = useParams();
  const [financialModel, setFinancialModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('revenue');
  const [saving, setSaving] = useState(false);

  const loadFinancialModel = async () => {
    try {
      setLoading(true);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await financialService.getByProjectId(parseInt(id));
      setFinancialModel(data);
    } catch (err) {
      setError('Failed to load financial model. Please try again.');
      console.error('Error loading financial model:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialModel();
  }, [id]);

  const handleSaveModel = async () => {
    try {
      setSaving(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await financialService.update(financialModel.Id, financialModel);
      
      toast.success('Financial model saved successfully!');
    } catch (err) {
      toast.error('Failed to save financial model');
      console.error('Error saving financial model:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateModelData = (section, index, field, value) => {
    setFinancialModel(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: parseFloat(value) || 0 } : item
      )
    }));
  };

  const addModelRow = (section, template) => {
    setFinancialModel(prev => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: Date.now() }]
    }));
  };

  const removeModelRow = (section, index) => {
    setFinancialModel(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    if (!financialModel) return { revenue: 0, expenses: 0, profit: 0 };
    
    const totalRevenue = financialModel.revenue.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = financialModel.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const profit = totalRevenue - totalExpenses;
    
    return { revenue: totalRevenue, expenses: totalExpenses, profit };
  };

  const generateChartData = () => {
    if (!financialModel) return { categories: [], series: [] };
    
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totals = calculateTotals();
    
    // Simulate monthly breakdown
    const revenueData = categories.map((_, index) => {
      const baseAmount = totals.revenue / 12;
      const seasonality = Math.sin((index / 12) * Math.PI * 2) * 0.2 + 1;
      return Math.round(baseAmount * seasonality);
    });
    
    const expenseData = categories.map((_, index) => {
      const baseAmount = totals.expenses / 12;
      const variation = Math.random() * 0.1 + 0.95;
      return Math.round(baseAmount * variation);
    });
    
    return {
      categories,
      series: [
        { name: 'Revenue', data: revenueData },
        { name: 'Expenses', data: expenseData },
        { name: 'Profit', data: revenueData.map((rev, i) => rev - expenseData[i]) }
      ]
    };
  };

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: true }
    },
    colors: ['#00D4AA', '#EF4444', '#5B4FE5'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: generateChartData().categories,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        },
        formatter: function (val) {
          return '$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val);
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$' + val.toLocaleString();
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 3
    }
  };

  if (loading) {
    return <Loading type="form" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load financial model"
        message={error}
        onRetry={loadFinancialModel}
      />
    );
  }

  if (!financialModel) {
    return (
      <Error
        title="Financial model not found"
        message="No financial model exists for this project yet."
        variant="notFound"
      />
    );
  }

  const totals = calculateTotals();
  const chartData = generateChartData();

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
              Financial Model
            </h1>
            <p className="text-gray-600">
              Build comprehensive financial projections for your business
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="md"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export</span>
          </Button>
          
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSaveModel}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={16} />
            <span>Save Model</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={16} className="text-success" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gradient">
            ${totals.revenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Annual projection</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingDown" size={16} className="text-error" />
            </div>
          </div>
          <p className="text-2xl font-bold text-error">
            ${totals.expenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Annual projection</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              totals.profit >= 0 ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <ApperIcon 
                name={totals.profit >= 0 ? "CheckCircle" : "AlertCircle"} 
                size={16} 
                className={totals.profit >= 0 ? 'text-success' : 'text-error'} 
              />
            </div>
          </div>
          <p className={`text-2xl font-bold ${
            totals.profit >= 0 ? 'text-success' : 'text-error'
          }`}>
            ${totals.profit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {totals.revenue > 0 ? Math.round((totals.profit / totals.revenue) * 100) : 0}% margin
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-lg text-secondary">
            Financial Projections
          </h3>
          <div className="flex space-x-2">
            <Badge variant="success" size="sm">12 Month View</Badge>
          </div>
        </div>
        
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="line"
          height={350}
        />
      </Card>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-secondary flex items-center">
              <ApperIcon name="TrendingUp" size={20} className="mr-2 text-success" />
              Revenue Streams
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addModelRow('revenue', { name: '', amount: 0, recurring: false })}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {financialModel.revenue.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-3 bg-gradient-card rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Revenue source"
                  value={item.name}
                  onChange={(e) => updateModelData('revenue', index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => updateModelData('revenue', index, 'amount', e.target.value)}
                  className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => removeModelRow('revenue', index)}
                  className="p-2 text-gray-400 hover:text-error rounded-lg transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </motion.div>
            ))}
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-secondary">
                Total Revenue: ${totals.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Expenses Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-secondary flex items-center">
              <ApperIcon name="TrendingDown" size={20} className="mr-2 text-error" />
              Expenses
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addModelRow('expenses', { name: '', amount: 0, category: 'operational' })}
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {financialModel.expenses.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-3 bg-gradient-card rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Expense item"
                  value={item.name}
                  onChange={(e) => updateModelData('expenses', index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => updateModelData('expenses', index, 'amount', e.target.value)}
                  className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => removeModelRow('expenses', index)}
                  className="p-2 text-gray-400 hover:text-error rounded-lg transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </motion.div>
            ))}
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-secondary">
                Total Expenses: ${totals.expenses.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scenarios */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-lg text-secondary mb-6 flex items-center">
          <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />
          Scenario Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Conservative', multiplier: 0.8, color: 'bg-orange-100 text-orange-800' },
            { name: 'Realistic', multiplier: 1.0, color: 'bg-blue-100 text-blue-800' },
            { name: 'Optimistic', multiplier: 1.3, color: 'bg-green-100 text-green-800' },
          ].map((scenario) => {
            const scenarioRevenue = Math.round(totals.revenue * scenario.multiplier);
            const scenarioExpenses = totals.expenses;
            const scenarioProfit = scenarioRevenue - scenarioExpenses;
            
            return (
              <div key={scenario.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-secondary">{scenario.name}</h4>
                  <Badge variant="default" className={scenario.color}>
                    {scenario.multiplier === 1.0 ? 'Base' : `${Math.round(scenario.multiplier * 100)}%`}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${scenarioRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses:</span>
                    <span className="font-medium">${scenarioExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Profit:</span>
                    <span className={`font-medium ${scenarioProfit >= 0 ? 'text-success' : 'text-error'}`}>
                      ${scenarioProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default FinancialModeler;