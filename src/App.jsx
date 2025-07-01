import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import PlanEditor from '@/components/pages/PlanEditor';
import FinancialModeler from '@/components/pages/FinancialModeler';
import ValidationCenter from '@/components/pages/ValidationCenter';
import Analytics from '@/components/pages/Analytics';
import Templates from '@/components/pages/Templates';
import Settings from '@/components/pages/Settings';

function App() {
  return (
    <>
<Routes>
<Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="plans/:id/edit" element={<PlanEditor />} />
          <Route path="plan-editor/new/:templateId" element={<PlanEditor />} />
          <Route path="financial-modeler/:id" element={<FinancialModeler />} />
          <Route path="validation-center/:id" element={<ValidationCenter />} />
          <Route path="plan-editor" element={<PlanEditor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
          {/* Fallback route for unmatched paths */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-display font-bold text-secondary mb-2">
                  Page Not Found
                </h1>
                <p className="text-gray-600 mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-premium transition-all"
                >
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;