import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PostComposer } from './pages/PostComposer';
import { Schedule } from './pages/Schedule';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useStore();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/posts" element={
        <ProtectedRoute>
          <Layout><PostComposer /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/schedule" element={
        <ProtectedRoute>
          <Layout><Schedule /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/media" element={
        <ProtectedRoute>
          <Layout>
            <div className="p-8 text-center text-slate-500">
               <h2 className="text-2xl font-bold mb-2">Media Library</h2>
               <p>Feature simulated in "Create Post" drag-drop zone.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
             <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
               <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Settings</h2>
               <div className="space-y-4">
                 <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                   <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">System Note</h3>
                   <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                     This is a frontend prototype. Backend services (Redis, Prisma, S3) are simulated in the browser.
                   </p>
                 </div>
               </div>
             </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}