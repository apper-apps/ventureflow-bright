import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = ({ collapsed, onToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/templates', icon: 'FileText', label: 'Templates', badge: '12' },
    { to: '/analytics', icon: 'BarChart3', label: 'Analytics' },
    { to: '/settings', icon: 'Settings', label: 'Settings' },
  ];

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' },
  };

  return (
    <motion.div
      initial={false}
      animate={collapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-elevated z-30 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-gradient">VentureFlow</h1>
                  <p className="text-xs text-gray-500">Business Planning</p>
                </div>
              </motion.div>
            )}
            
            {collapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto"
              >
                <ApperIcon name="Zap" size={20} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <Button
          variant="primary"
          size={collapsed ? "sm" : "md"}
          className={`w-full ${collapsed ? 'px-2' : ''}`}
          onClick={() => window.location.href = '/templates'}
        >
          {collapsed ? (
            <ApperIcon name="Plus" size={18} />
          ) : (
            <>
              <ApperIcon name="Plus" size={18} className="mr-2" />
              New Plan
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigationItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* AI Assistant Section */}
      <div className="p-4 border-t border-gray-100">
        <div className={`bg-gradient-card rounded-lg p-3 ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="Bot" size={14} className="text-white" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-secondary">AI Assistant</span>
            )}
          </div>
          
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <p className="text-xs text-gray-600">
                Get help with your business plan
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  const aiModal = document.createElement('div');
                  aiModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                  aiModal.innerHTML = `
                    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 class="text-lg font-semibold mb-4">AI Assistant</h3>
                      <p class="text-sm text-gray-600 mb-4">Hello! I'm your AI assistant. How can I help you with your business plan today?</p>
                      <div class="flex space-x-3">
                        <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Close</button>
                        <button onclick="alert('AI chat feature coming soon!'); this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Chat</button>
                      </div>
                    </div>
                  `;
                  document.body.appendChild(aiModal);
                }}
              >
                <ApperIcon name="MessageCircle" size={14} className="mr-2" />
                Chat with AI
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 text-left"
              >
                <p className="text-sm font-medium text-secondary">Demo User</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </motion.div>
            )}
          </button>

          {/* User Menu */}
          <AnimatePresence>
            {showUserMenu && !collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-lg shadow-premium p-2 space-y-1"
              >
                <button 
                  onClick={() => {
                    toast.info('Opening user profile...');
                    setTimeout(() => {
                      window.location.href = '/settings';
                    }, 1000);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                >
                  <ApperIcon name="User" size={14} />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => {
                    toast.info('Redirecting to billing...');
                    setTimeout(() => {
                      window.location.href = '/settings';
                    }, 1000);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                >
                  <ApperIcon name="CreditCard" size={14} />
                  <span>Billing</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={() => {
                    const helpModal = document.createElement('div');
                    helpModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    helpModal.innerHTML = `
                      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 class="text-lg font-semibold mb-4">Help & Support</h3>
                        <div class="space-y-3">
                          <p class="text-sm text-gray-600">• Email: support@ventureflow.app</p>
                          <p class="text-sm text-gray-600">• Phone: 1-800-VENTURE</p>
                          <p class="text-sm text-gray-600">• Chat: Available 24/7</p>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Close</button>
                      </div>
                    `;
                    document.body.appendChild(helpModal);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                >
                  <ApperIcon name="HelpCircle" size={14} />
                  <span>Help</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;