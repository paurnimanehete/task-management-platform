import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute, PublicRoute } from './layouts/ProtectedRoute';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Lazy-loaded pages for code splitting with React.lazy
const LoginPage    = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage    = lazy(() => import('./pages/TasksPage'));
const ProfilePage  = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <LoadingSpinner size="lg" message="Loading page..." />
  </div>
);

function App() {
  const { loadUser, token } = useAuth();

  // Re-validate token and refresh user data on mount
  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public routes (redirect if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes (require authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
