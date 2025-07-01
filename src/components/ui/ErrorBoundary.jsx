import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
// Log to console in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // In production, you could send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full"
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ApperIcon name="AlertTriangle" size={40} className="text-error" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-display font-bold text-secondary mb-3"
              >
                Oops! Something went wrong
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6 leading-relaxed"
              >
                We encountered an unexpected error. Don't worry - your data is safe. 
                Try refreshing the page or contact support if the problem persists.
</motion.p>

              {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && this.state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left"
                >
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Development Error Details:
                  </h3>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                        Component Stack (click to expand)
                      </summary>
                      <pre className="text-xs text-red-600 whitespace-pre-wrap mt-1 ml-4 max-h-40 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RefreshCw" size={16} />
                  <span>Try Again</span>
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RotateCcw" size={16} />
                  <span>Reload Page</span>
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Home" size={16} />
                  <span>Go Home</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-100"
              >
                <p className="text-sm text-gray-500 mb-2">
                  Error ID: {this.state.errorId}
                </p>
                <p className="text-sm text-gray-500">
                  Need help? <a href="#" className="text-primary hover:text-primary/80 underline">Contact support</a> and include the error ID above.
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;