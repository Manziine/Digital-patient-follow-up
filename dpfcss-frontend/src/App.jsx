import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

import useAuthStore from './store/authStore';

import LandingPage from './pages/LandingPage';
import ManifestoPage from './pages/ManifestoPage';
import SystemPage from './pages/SystemPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PatientDashboard from './pages/patient/PatientDashboard';
import PatientMessages from './pages/patient/PatientMessages';
import PatientSettings from './pages/patient/PatientSettings';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderMessages from './pages/provider/ProviderMessages';
import ProviderSettings from './pages/provider/ProviderSettings';
import ProviderPatients from './pages/provider/ProviderPatients';
import ProviderAppointments from './pages/provider/ProviderAppointments';

import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function RouteChangeLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500); // simulate 500ms route transition
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', backgroundColor: 'transparent', zIndex: 9999 }}>
        <div style={{ height: '100%', backgroundColor: 'var(--color-accent)', animation: 'progress 0.5s ease-out forwards' }} />
        <style>{`@keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            background: 'var(--color-bg)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)',
            borderRadius: '0',
            boxShadow: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          },
          success: { iconTheme: { primary: 'var(--color-primary)', secondary: 'var(--color-bg)' } },
          error:   { iconTheme: { primary: 'var(--color-accent)', secondary: 'var(--color-bg)'  } },
        }}
      />
      <RouteChangeLoader />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/manifesto" element={<ManifestoPage />} />
        <Route path="/system" element={<SystemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient routes */}
        <Route path="/patient" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </PrivateRoute>
        } />
        <Route path="/patient/messages" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientMessages />
          </PrivateRoute>
        } />
        <Route path="/patient/settings" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientSettings />
          </PrivateRoute>
        } />

        {/* Provider routes */}
        <Route path="/provider" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </PrivateRoute>
        } />
        <Route path="/provider/patients" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderPatients />
          </PrivateRoute>
        } />
        <Route path="/provider/appointments" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderAppointments />
          </PrivateRoute>
        } />
        <Route path="/provider/messages" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderMessages />
          </PrivateRoute>
        } />
        <Route path="/provider/settings" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderSettings />
          </PrivateRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
