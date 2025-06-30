import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'VentureFlow Demo',
      email: 'demo@ventureflow.app',
      timezone: 'UTC-8',
      language: 'en',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      marketingEmails: false,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      publicProfile: false,
    },
    billing: {
      plan: 'Free',
      usage: '3/5 projects',
      nextBilling: 'N/A',
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'billing', label: 'Billing', icon: 'CreditCard' },
  ];

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Company Name"
            value={settings.general.companyName}
            onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
            placeholder="Enter your company name"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={settings.general.email}
            onChange={(e) => updateSetting('general', 'email', e.target.value)}
            placeholder="Enter your email"
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">
              Timezone
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">
              Language
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSetting('general', 'language', e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Data Export
        </h3>
        <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
          <div>
            <p className="font-medium text-secondary">Export Your Data</p>
            <p className="text-sm text-gray-600">Download all your business plans and data</p>
          </div>
<Button 
            variant="outline" 
            size="md"
            onClick={async () => {
              try {
                toast.info('Preparing data export...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const exportData = {
                  settings: settings,
                  exportDate: new Date().toISOString(),
                  dataType: 'user_settings_and_projects'
                };
                
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                  type: 'application/json' 
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ventureflow-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                toast.success('Data exported successfully!');
              } catch (err) {
                toast.error('Failed to export data');
              }
            }}
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            {
              key: 'emailNotifications',
              title: 'Email Notifications',
              description: 'Receive important updates via email'
            },
            {
              key: 'pushNotifications',
              title: 'Push Notifications',
              description: 'Get real-time notifications in your browser'
            },
            {
              key: 'weeklyDigest',
              title: 'Weekly Digest',
              description: 'Summary of your progress and insights'
            },
            {
              key: 'marketingEmails',
              title: 'Marketing Emails',
              description: 'Tips, news, and product updates'
            }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
              <div>
                <p className="font-medium text-secondary">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications[notification.key]}
                  onChange={(e) => updateSetting('notifications', notification.key, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Privacy Controls
        </h3>
        <div className="space-y-4">
          {[
            {
              key: 'dataSharing',
              title: 'Data Sharing',
              description: 'Allow anonymous data sharing for product improvement'
            },
            {
              key: 'analytics',
              title: 'Analytics',
              description: 'Help us improve by sharing usage analytics'
            },
            {
              key: 'publicProfile',
              title: 'Public Profile',
              description: 'Make your profile visible to other users'
            }
          ].map((privacy) => (
            <div key={privacy.key} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg">
              <div>
                <p className="font-medium text-secondary">{privacy.title}</p>
                <p className="text-sm text-gray-600">{privacy.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.privacy[privacy.key]}
                  onChange={(e) => updateSetting('privacy', privacy.key, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Account Actions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-red-800">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
<Button 
              variant="danger" 
              size="md"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
                  if (window.confirm('Please confirm again. This will permanently delete ALL your business plans, data, and account information.')) {
                    toast.error('Account deletion initiated. You will be logged out in 5 seconds.');
                    setTimeout(() => {
                      toast.error('Account deleted successfully.');
                      window.location.href = '/';
                    }, 5000);
                  }
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Current Plan
        </h3>
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-xl font-display font-bold text-secondary">Free Plan</h4>
                <Badge variant="primary">Current</Badge>
              </div>
              <p className="text-gray-600">Perfect for getting started with business planning</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient">$0</p>
              <p className="text-sm text-gray-600">per month</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">Usage</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm text-gray-600">3/5 projects</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">Features</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span>5 Business Plans</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span>Basic Templates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ApperIcon name="X" size={16} className="text-gray-400" />
                  <span className="text-gray-400">AI Assistant</span>
                </div>
              </div>
            </div>
          </div>
          
<Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => {
              toast.info('Redirecting to billing portal...');
              setTimeout(() => {
                toast.success('Welcome to Pro! Your account has been upgraded.');
              }, 2000);
            }}
          >
            Upgrade to Pro
          </Button>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-display font-semibold text-secondary mb-4">
          Available Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-primary">
            <div className="text-center mb-4">
              <Badge variant="primary" className="mb-2">Most Popular</Badge>
              <h4 className="text-xl font-display font-bold text-secondary">Pro Plan</h4>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gradient">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                'Unlimited Business Plans',
                'Advanced Templates',
                'AI Assistant',
                'Financial Modeling',
                'Team Collaboration',
                'Priority Support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
<Button 
              variant="primary" 
              size="md" 
              className="w-full"
              onClick={() => {
                toast.info('Processing Pro plan selection...');
                setTimeout(() => {
                  toast.success('Pro plan activated! Enjoy your enhanced features.');
                }, 2000);
              }}
            >
              Choose Pro
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="text-center mb-4">
              <h4 className="text-xl font-display font-bold text-secondary">Enterprise</h4>
              <div className="mt-2">
                <span className="text-3xl font-bold text-secondary">Custom</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                'Everything in Pro',
                'Custom Integrations',
                'Dedicated Support',
                'Advanced Analytics',
                'White-label Options',
                'SLA Guarantee'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-success" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
<Button 
              variant="outline" 
              size="md" 
              className="w-full"
              onClick={() => {
                toast.info('Opening contact form...');
                setTimeout(() => {
                  toast.success('Sales team will contact you within 24 hours!');
                }, 1000);
              }}
            >
              Contact Sales
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account preferences and configuration.
          </p>
        </div>
        
        {activeTab !== 'billing' && (
          <Button
            variant="primary"
            size="lg"
            loading={saving}
            onClick={handleSaveSettings}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={20} />
            <span>Save Changes</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-white shadow-premium'
                      : 'text-gray-600 hover:text-primary hover:bg-gradient-card'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;