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
          <Route path="financial-modeler/:id" element={<FinancialModeler />} />
          <Route path="validation-center/:id" element={<ValidationCenter />} />
          <Route path="plan-editor" element={<PlanEditor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
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